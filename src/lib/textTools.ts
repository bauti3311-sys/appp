import { normalize } from './normalize';
import { SearchResult } from '../types';

export const TEXT_OPERATIONS: Record<string, string> = {
  mayusculas: 'Mayúsculas',
  minusculas: 'Minúsculas',
  capitalizar: 'Capitalizar',
  'limpiar espacios': 'Limpiar espacios',
  'ordenar lineas': 'Ordenar líneas',
  'quitar duplicados': 'Quitar duplicados',
  'contar palabras': 'Contar palabras',
  'contar caracteres': 'Contar caracteres',
  'crear lista': 'Crear lista',
  slug: 'Crear identificador',
  'codificar url': 'Codificar URL',
  'decodificar url': 'Decodificar URL',
  'formatear json': 'Formatear JSON',
};

export class TextTools {
  static transform(operation: string, text: string): string {
    if (text.length > 32000) {
      throw new Error('Máximo 32.000 caracteres');
    }

    switch (operation) {
      case 'mayusculas':
        return text.toUpperCase();
      case 'minusculas':
        return text.toLowerCase();
      case 'capitalizar':
        return text.toLowerCase().replace(/\b\p{L}+/gu, word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        );
      case 'limpiar espacios':
        return text
          .split('\n')
          .map(line => line.trim().replace(/[\t ]+/g, ' '))
          .join('\n')
          .trim();
      case 'ordenar lineas':
        return text
          .split('\n')
          .sort((a, b) => normalize(a).localeCompare(normalize(b)))
          .join('\n');
      case 'quitar duplicados':
        return Array.from(new Set(text.split('\n'))).join('\n');
      case 'contar palabras': {
        const words = text.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu);
        return words ? words.length.toString() : '0';
      }
      case 'contar caracteres':
        return text.length.toString();
      case 'crear lista':
        return text
          .split('\n')
          .filter(l => l.trim().length > 0)
          .map(l => `• ${l.trim()}`)
          .join('\n');
      case 'slug':
        return normalize(text)
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      case 'codificar url':
        return encodeURIComponent(text);
      case 'decodificar url':
        try {
          return decodeURIComponent(text);
        } catch {
          return text;
        }
      case 'formatear json': {
        const trimmed = text.trim();
        if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
          throw new Error('Pegá un objeto o arreglo JSON válido');
        }
        const parsed = JSON.parse(trimmed);
        return JSON.stringify(parsed, null, 2);
      }
      default:
        throw new Error('Herramienta no compatible');
    }
  }

  static results(query: string): SearchResult[] {
    const n = normalize(query.trim());
    const out: SearchResult[] = [];

    if (['herramientas de texto', 'texto', 'transformar texto', 'text'].includes(n)) {
      Object.entries(TEXT_OPERATIONS).forEach(([key, label]) => {
        out.push({
          id: `text:menu:${key}`,
          title: label,
          subtitle: 'Local · escribir o pegar texto',
          category: 'Herramientas',
          score: 2100,
          action: { type: 'restore_query', query: `${label}: ` },
          iconName: 'Type',
        });
      });
    }

    const colonIdx = query.indexOf(':');
    if (colonIdx > 0) {
      const head = normalize(query.substring(0, colonIdx).trim());
      const input = query.substring(colonIdx + 1).trim();
      if (TEXT_OPERATIONS[head] && input) {
        try {
          const transformed = this.transform(head, input);
          out.push({
            id: `text:${head}`,
            title: TEXT_OPERATIONS[head],
            subtitle: `Transformación: ${transformed.slice(0, 60)}`,
            category: 'Herramientas',
            score: 2800,
            action: { type: 'lookup', lookupType: `text:${head}`, query: input },
            preview: transformed,
            iconName: 'FileText',
          });
        } catch (e: any) {
          out.push({
            id: `text:err:${head}`,
            title: TEXT_OPERATIONS[head],
            subtitle: e?.message || 'Error en transformación',
            category: 'Herramientas',
            score: 2800,
            action: { type: 'restore_query', query: `${head}: ` },
            iconName: 'AlertTriangle',
          });
        }
      }
    }

    if (['uuid', 'generar uuid', 'nuevo uuid'].includes(n)) {
      const id = crypto.randomUUID();
      out.push({
        id: 'text:uuid',
        title: 'Generar UUID v4',
        subtitle: `UUID aleatorio: ${id}`,
        category: 'Herramientas',
        score: 2800,
        action: { type: 'copy', text: id },
        preview: id,
        iconName: 'Key',
      });
    }

    return out;
  }
}

export class SymbolTools {
  private static readonly entries: [string, string][] = [
    ['✓', 'check correcto aprobado'],
    ['✕', 'cruz cerrar error cancelar'],
    ['→', 'flecha derecha siguiente'],
    ['←', 'flecha izquierda anterior'],
    ['↑', 'flecha arriba subir'],
    ['↓', 'flecha abajo bajar'],
    ['±', 'mas menos aproximado'],
    ['°', 'grado temperatura'],
    ['×', 'multiplicar producto'],
    ['÷', 'dividir fraccion'],
    ['∞', 'infinito infinito'],
    ['π', 'pi numero pi'],
    ['©', 'copyright derechos'],
    ['®', 'registrado marca'],
    ['™', 'marca comercial'],
    ['€', 'euro moneda'],
    ['$', 'dolar peso moneda'],
    ['⌘', 'comando cmd apple'],
    ['⌥', 'opcion alt'],
    ['⇧', 'shift mayuscula'],
    ['😀', 'sonrisa feliz carita alegre'],
    ['🔥', 'fuego fuego crack top'],
    ['✨', 'estrellas magia brillo'],
    ['💡', 'bombilla idea luz'],
    ['🚀', 'cohete lanzamiento rapido'],
    ['❤️', 'corazon amor me gusta'],
    ['👍', 'pulgar arriba bien like'],
    ['🎉', 'celebracion fiesta fiesta'],
    ['📌', 'chincheta pin fijar fijado']
  ];

  static results(query: string): SearchResult[] {
    const n = normalize(query.trim());
    const prefixes = ['simbolos', 'simbolo', 'emoji', 'emojis'];
    const matchedPrefix = prefixes.find(p => n === p || n.startsWith(`${p} `));
    if (!matchedPrefix) return [];

    const term = n.slice(matchedPrefix.length).trim();
    return this.entries
      .filter(([_, label]) => !term || label.includes(term))
      .map(([value, label]) => ({
        id: `symbol:${value}`,
        title: `${value}  ${label.split(' ')[0]}`,
        subtitle: `Copiar símbolo «${value}» al portapapeles`,
        category: 'Herramientas',
        score: 2100,
        action: { type: 'copy', text: value },
        preview: value,
        iconName: 'Smile',
      }));
  }
}
