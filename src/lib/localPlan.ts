import { normalize } from './normalize';
import { LocalPlanData, PlanStepType } from '../types';

export class LocalLanguage {
  private static readonly wordsToNumbers: Record<string, number> = {
    cero: 0, uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10,
    once: 11, doce: 12, trece: 13, catorce: 14, quince: 15, dieciseis: 16, diecisiete: 17, dieciocho: 18, diecinueve: 19,
    veinte: 20, veintiuno: 21, veintidos: 22, veintitres: 23, veinticuatro: 24, veinticinco: 25, treinta: 30,
    cuarenta: 40, cincuenta: 50, sesenta: 60, setenta: 70, ochenta: 80, noventa: 90, cien: 100
  };

  static canonical(raw: string): string {
    let text = normalize(raw.trim());
    // Replace word numbers with digits
    for (const [word, num] of Object.entries(this.wordsToNumbers)) {
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      text = text.replace(regex, num.toString());
    }
    return text;
  }
}

export class LocalPlan {
  static step(raw: string): PlanStepType | null {
    const q = LocalLanguage.canonical(raw);

    // Media commands
    if (['pausar musica', 'pausar la musica', 'pausar', 'pause'].includes(q)) {
      return { type: 'media', command: 'pause' };
    }
    if (['reanudar musica', 'reproducir musica', 'reanudar', 'play'].includes(q)) {
      return { type: 'media', command: 'play' };
    }
    if (['siguiente cancion', 'siguiente tema', 'siguiente', 'next'].includes(q)) {
      return { type: 'media', command: 'next' };
    }
    if (['cancion anterior', 'anterior', 'previous'].includes(q)) {
      return { type: 'media', command: 'previous' };
    }

    // Open apps
    const openMatch = raw.trim().match(/^(?:abrir|iniciar|abr[ií]|abre|open)\s+(.+)$/i);
    if (openMatch) {
      return { type: 'open', name: openMatch[1].trim() };
    }

    // Volume or Brightness adjustments:
    // e.g. "bajar el brillo al 35%", "subir volumen 20%", "brillo al 50%"
    const adjustMatch = q.match(/^(?:(bajar|subir|ajustar|poner|cambiar)\s+)?(?:el\s+)?(brillo|volumen)(?:\s+(al|a|en))?\s+(\d{1,3})\s*%?$/);
    if (adjustMatch) {
      const verb = adjustMatch[1] || '';
      const device = adjustMatch[2]; // 'brillo' or 'volumen'
      const prep = adjustMatch[3] || '';
      const value = parseInt(adjustMatch[4], 10);
      if (value < 0 || value > 100) return null;

      const isRelative = ['bajar', 'subir'].includes(verb) && !['al', 'a'].includes(prep);
      const delta = verb === 'bajar' ? -value : value;

      if (device === 'brillo') {
        return isRelative
          ? { type: 'relative_brightness', delta }
          : { type: 'brightness', percent: value };
      } else {
        return isRelative
          ? { type: 'relative_volume', delta }
          : { type: 'volume', percent: value };
      }
    }

    return null;
  }

  static parse(raw: string): LocalPlanData | null {
    if (!raw || raw.length > 4000) return null;

    // Split on delimiters: comma, ' y ', ' luego ', ' despues ' followed by an action verb
    const regex = /(?:\s*,\s*|\s+(?:y|luego|despu[eé]s)\s+)(?=(?:abrir|abr[ií]|abre|open|iniciar|bajar|baj[aá]|subir|sub[ií]|ajustar|poner|pon[eé]|cambiar|brillo|volumen|pausar|paus[aá]|reanudar|reproducir|siguiente|anterior)\b)/i;
    const parts = raw.trim().split(regex);

    if (parts.length < 2 || parts.length > 6) return null;

    const steps: LocalPlanData['steps'] = [];
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].trim();
      const stepType = this.step(part);
      if (!stepType) return null;

      let label = '';
      let icon = 'Sliders';
      let note: string | undefined;

      switch (stepType.type) {
        case 'brightness':
          label = `Ajustar brillo al ${stepType.percent}%`;
          icon = 'Sun';
          note = 'Servicio reversible · límite 20-100%';
          break;
        case 'relative_brightness':
          label = `${stepType.delta > 0 ? 'Subir' : 'Bajar'} brillo un ${Math.abs(stepType.delta)}%`;
          icon = 'Sun';
          break;
        case 'volume':
          label = `Ajustar volumen al ${stepType.percent}%`;
          icon = 'Volume2';
          break;
        case 'relative_volume':
          label = `${stepType.delta > 0 ? 'Subir' : 'Bajar'} volumen un ${Math.abs(stepType.delta)}%`;
          icon = 'Volume2';
          break;
        case 'open':
          label = `Abrir ${stepType.name}`;
          icon = 'ExternalLink';
          break;
        case 'media':
          label = stepType.command === 'pause' ? 'Pausar reproducción' : stepType.command === 'play' ? 'Reanudar música' : 'Siguiente pista';
          icon = 'Music';
          break;
      }

      steps.push({
        id: `step-${i + 1}-${Date.now()}`,
        step: stepType,
        label,
        icon,
        enabled: true,
        status: 'pending',
        note,
      });
    }

    return {
      raw,
      steps,
    };
  }
}
