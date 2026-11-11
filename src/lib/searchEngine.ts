import { normalize, relevance } from './normalize';
import { Calculator } from './calculator';
import { LocalPlan } from './localPlan';
import { TextTools, SymbolTools } from './textTools';
import { AppConfig, SearchCategory, SearchResult } from '../types';

export interface AppDefinition {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  url?: string;
  tags: string[];
}

export const INSTALLED_APPS: AppDefinition[] = [
  { id: 'spotify', name: 'Spotify', category: 'Música y Audio', icon: 'Music2', description: 'SP1/SP3 · Buscador, Spotify Connect, Letras en Vivo, Moods & EQ', tags: ['audio', 'canciones', 'reproducir', 'musica', 'streaming', 'sp', 'letras', 'ecualizador', 'playlist'] },
  { id: 'whatsapp', name: 'WhatsApp', category: 'Mensajería', icon: 'MessageCircle', description: 'WA2 · Chat en vivo, Grabador de Notas de Voz, Click-to-Chat (wa.me) y Alias', tags: ['chat', 'mensajes', 'wa', 'amigos', 'nota de voz', 'audio', 'sin agendar'] },
  { id: 'youtube', name: 'YouTube', category: 'Vídeo y Medios', icon: 'Youtube', description: 'YT1/YT3 · Mini-Player integrado, Velocidad 1.5x/2x y Modo Solo Audio', url: 'https://youtube.com', tags: ['video', 'videos', 'streaming', 'yt', 'podcast', 'lofi'] },
  { id: 'gmail', name: 'Gmail y 2FA', category: 'Productividad', icon: 'Mail', description: 'GM1/GM2 · Extractor automático de códigos 2FA/OTP (849201) y redacción rápida', tags: ['correo', 'email', 'mail', 'gmail', 'gm', '2fa', 'otp', 'codigo', 'verificacion'] },
  { id: 'maps', name: 'Google Maps Cercanos', category: 'Navegación', icon: 'MapPin', description: 'MAP2 · Farmacias de turno, cafeterías, estaciones de servicio y cajeros', tags: ['mapa', 'maps', 'ubicacion', 'farmacia', 'cafe', 'nafta', 'cajero', 'cerca', 'mp'] },
  { id: 'finanzas', name: 'Finanzas y Mercado Pago', category: 'Herramientas', icon: 'Wallet', description: 'FIN1/FIN2 · Mi Alias/CVU con QR, Divisor de Asado/Gastos y Calculadora de Cuotas', tags: ['finanzas', 'mercado pago', 'alias', 'cbu', 'cvu', 'asado', 'dividir gastos', 'cuotas', 'billetera', 'fin'] },
  { id: 'camara', name: 'Cámara, Espejo y Escáner QR', category: 'Utilidades', icon: 'Camera', description: 'CAM1 · Espejo en vivo WebRTC, captura instantánea y lector QR', tags: ['camara', 'espejo', 'selfie', 'escanear qr', 'foto', 'webcam', 'cam'] },
  { id: 'control', name: 'Centro de Control del Sistema', category: 'Sistema', icon: 'Sliders', description: 'SYS1 · Wi-Fi, Bluetooth, Linterna Flash, No Molestar, 120Hz y Salida de Audio', tags: ['control', 'sistema', 'wifi', 'bluetooth', 'linterna', 'flash', 'no molestar', 'bateria', '120hz', 'sys'] },
  { id: 'telegram', name: 'Telegram', category: 'Mensajería', icon: 'Send', description: 'Mensajería Cloud · 3 mensajes sin leer', tags: ['chat', 'mensajes', 'tg', 'cloud'] },
  { id: 'translator', name: 'Traductor Rápido', category: 'Utilidades', icon: 'Languages', description: 'Traducción instantánea ES ⇄ EN, FR, PT con pronunciación en voz', tags: ['traducir', 'translate', 'traductor', 'idiomas', 'ingles', 'tr'] },
  { id: 'clock', name: 'Reloj Mundial', category: 'Utilidades', icon: 'Clock', description: 'Zonas horarias en vivo de Tokio, Madrid, NY, Londres y más', tags: ['hora', 'horarios', 'tiempo', 'ciudades', 'reloj', 'world clock'] },
  { id: 'emojis', name: 'Buscador de Emojis', category: 'Utilidades', icon: 'Smile', description: 'Copiar emojis y símbolos al portapapeles (mate 🧉, fuego 🔥, corazón ❤️)', tags: ['emojis', 'caritas', 'simbolos', 'mate', 'icono', 'emoticon'] },
  { id: 'timer', name: 'Temporizador y Alarma', category: 'Productividad', icon: 'Timer', description: 'Cuenta regresiva visual interactiva y cronómetro', tags: ['temporizador', 'timer', 'cronometro', 'alarma', 'tiempo', 'reloj'] },
  { id: 'qr', name: 'Generador de Códigos QR', category: 'Utilidades', icon: 'QrCode', description: 'Crear, previsualizar y descargar código QR para enlaces y textos', tags: ['qr', 'codigo', 'escanear', 'link', 'enlace', 'codigo qr'] },
  { id: 'movies', name: 'Películas y Series', category: 'Utilidades', icon: 'Film', description: 'Sinopsis, puntaje IMDb y en qué plataforma verlas (Netflix, Max, Prime, Disney+)', tags: ['peli', 'peliculas', 'series', 'cine', 'netflix', 'streaming', 'donde ver', 'interstellar', 'arcane'] },
  { id: 'sticky', name: 'Notas Flotantes Rápidas', category: 'Productividad', icon: 'StickyNote', description: 'Desacoplar post-its flotantes en pantalla mientras seguís buscando', tags: ['sticky', 'nota flotante', 'postit', 'fijar nota', 'recordatorio flotante'] },
  { id: 'clipboard', name: 'Portapapeles', category: 'Portapapeles', icon: 'Clipboard', description: 'Historial seguro · Snippets, claves y textos recientes', tags: ['copiar', 'pegar', 'historial', 'snippets', 'clip', 'cp'] },
  { id: 'files', name: 'Archivos y Quick Look', category: 'Archivos', icon: 'FolderOpen', description: 'Visor multipágina PDF, APK e imágenes con OCR local', tags: ['almacenamiento', 'disco', 'carpetas', 'pdf', 'apk', 'quick look'] },
  { id: 'figma', name: 'Figma', category: 'Diseño', icon: 'Figma', description: 'RaycastOS Design System · Editado hace 12 min', tags: ['diseño', 'ui', 'ux', 'prototipo', 'fg'] },
  { id: 'chrome', name: 'Google Chrome', category: 'Navegación', icon: 'Globe', description: '14 pestañas activas · Localhost:3000', tags: ['web', 'internet', 'buscar', 'browser', 'ch'] },
  { id: 'calc', name: 'Calculadora y Divisas', category: 'Herramientas', icon: 'Calculator', description: 'Cálculos científicos, tipo de cambio en vivo y unidades', tags: ['operaciones', 'matematica', 'numeros', 'monedas', 'dolar'] },
  { id: 'notes', name: 'Notas y Borradores', category: 'Productividad', icon: 'Notebook', description: 'Tus notas locales y recordatorios rápidos', tags: ['apuntes', 'texto', 'escribir', 'ideas'] },
  { id: 'calendar', name: 'Calendario', category: 'Productividad', icon: 'Calendar', description: 'Eventos, reuniones y agenda del día', tags: ['citas', 'fechas', 'agenda', 'planificar'] },
  { id: 'terminal', name: 'Termux / Terminal', category: 'Desarrollo', icon: 'Terminal', description: 'Entorno POSIX · zsh sesión activa en segundo plano', tags: ['bash', 'shizuku', 'root', 'scripts', 'tx'] },
  { id: 'settings', name: 'Ajustes del Sistema', category: 'Sistema', icon: 'Settings', description: 'Configuración de dispositivo, permisos, IA híbrida y hardware', tags: ['preferencias', 'opciones', 'sistema', 'pantalla', 'sonido', 'permisos'] },
  { id: 'apk_builder', name: 'Descargar APK Android (Overlay Flotante)', category: 'Sistema', icon: 'Download', description: 'Compilar y descargar APK nativo con ventana transparente (Theme.Translucent.NoTitleBar)', tags: ['apk', 'descargar', 'instalar', 'android', 'overlay', 'nativo', 'ventana flotante', 'no pantalla completa'] },
];

export const MOCK_FILES = [
  { id: 'file-1', name: 'Spotlight-Next-Architecture-2.0.pdf', type: 'PDF Document', size: '2.4 MB', modified: 'Hoy 10:15', icon: 'FileText' },
  { id: 'file-2', name: 'Reporte-Financiero-Trimestral.xlsx', type: 'Hoja de Cálculo', size: '840 KB', modified: 'Ayer', icon: 'Table' },
  { id: 'file-3', name: 'Contrato-Servicios-Firmado.pdf', type: 'PDF Document', size: '1.1 MB', modified: '3 Nov', icon: 'FileCheck' },
  { id: 'file-4', name: 'captura-pantalla-hybrid-glass.png', type: 'Imagen PNG', size: '3.6 MB', modified: 'Hace 2 días', icon: 'Image' },
  { id: 'file-5', name: 'Podcast-Episodio-Productividad.mp3', type: 'Audio MP3', size: '42 MB', modified: '1 Nov', icon: 'FileAudio' },
  { id: 'file-6', name: 'guia-estudio-examen-final.docx', type: 'Documento Word', size: '350 KB', modified: '28 Oct', icon: 'File' },
];

export class SearchEngine {
  static search(rawInput: string, config: AppConfig, selectedCategory: SearchCategory = 'Todo'): SearchResult[] {
    let input = rawInput.trim();

    // 1. Expand aliases (e.g. "wa" -> "whatsapp", "yt" -> "youtube", "gm" -> "gmail")
    const words = input.split(/\s+/);
    if (words.length > 0) {
      const aliasMatch = (config.aliases || []).find(a => normalize(a.alias) === normalize(words[0]));
      if (aliasMatch) {
        words[0] = aliasMatch.target;
        input = words.join(' ');
      }
    }

    const n = normalize(input);

    // 2. Empty query -> Home Suggestions
    if (!input) {
      return this.getHomeSuggestions(config, selectedCategory);
    }

    const results: SearchResult[] = [];

    // 3. Multi-step Plan recognition (e.g., "bajar el brillo al 35% y abrir Spotify")
    const plan = LocalPlan.parse(input);
    if (plan) {
      results.push({
        id: 'plan:local',
        title: 'Plan inteligente revisable',
        subtitle: `${plan.steps.length} pasos: ${plan.steps.map(s => s.label).join(' → ')}`,
        category: 'Comandos',
        score: 3500,
        action: { type: 'plan', plan },
        iconName: 'Workflow',
        badge: 'Plan Multi-Paso',
      });
    }

    // APK Overlay Builder direct intent
    if (
      n.includes('apk') ||
      n.includes('descargar app') ||
      n.includes('instalar') ||
      n.includes('overlay') ||
      n.includes('nativa') ||
      n.includes('nativo')
    ) {
      results.push({
        id: 'apk:overlay_builder',
        title: '📦 Descargar APK Nativo Android (Barra Superpuesta · No Pantalla Completa)',
        subtitle: 'Theme.Translucent.NoTitleBar + SYSTEM_ALERT_WINDOW · Incluye tu configuración actual',
        category: 'Aplicaciones',
        score: 3550,
        action: { type: 'launch', appName: 'Descargar APK Android (Overlay Flotante)', appId: 'apk_builder' },
        iconName: 'Download',
        badge: 'APK Overlay',
      });
    }

    // 4. Universal Assistant Intents (SP1/SP3, WA2, YT1/YT3, GM1/GM2, MAP2, FIN1/FIN2, CAM1, SYS1)

    // SP1 & SP3: Spotify direct search, Connect, Lyrics, Moods, Equalizer
    if (
      n.startsWith('spotify ') ||
      n.startsWith('reproducir ') ||
      n.startsWith('escuchar ') ||
      n.startsWith('cancion ') ||
      n.startsWith('letra') ||
      n.startsWith('ecualizador') ||
      n.startsWith('spotify connect')
    ) {
      const songQuery = input.replace(/^(?:spotify\s+connect|spotify|reproducir|escuchar\s+musica|escuchar|cancion|letras?\s+de|letra)\s*/i, '').trim();
      results.push({
        id: `sp1:search:${songQuery || 'main'}`,
        title: songQuery ? `Spotify: Buscar y reproducir «${songQuery}»` : 'Spotify · Estudio Musical, Connect & Letras (SP1/SP3)',
        subtitle: 'Buscador en vivo, Audio Sintetizado Real, Spotify Connect, Moods y Ecualizador',
        category: 'Aplicaciones',
        score: 3480,
        action: { type: 'launch', appName: 'Spotify', appId: 'spotify' },
        iconName: 'Music2',
      });
    }

    // WA2: WhatsApp Voice Note, Click-to-Chat sin agendar (+549...), Smart Replies
    if (
      n.startsWith('whatsapp ') ||
      n.startsWith('nota de voz') ||
      n.startsWith('audio a ') ||
      n.startsWith('wa ') ||
      /^\+?\d{8,15}$/.test(input.replace(/\s+/g, ''))
    ) {
      const targetOrPhone = input.replace(/^(?:whatsapp|nota\s+de\s+voz|audio\s+a|wa)\s*/i, '').trim();
      results.push({
        id: `wa2:action:${targetOrPhone || 'main'}`,
        title: targetOrPhone
          ? `WhatsApp Directo / Nota de Voz: «${targetOrPhone}»`
          : 'WhatsApp · Notas de Voz, Click-to-Chat y Respuestas IA (WA2)',
        subtitle: 'Grabar nota de voz real, chatear con número sin agendar (wa.me) o enviar Alias',
        category: 'Aplicaciones',
        score: 3475,
        action: { type: 'launch', appName: 'WhatsApp', appId: 'whatsapp' },
        iconName: 'MessageCircle',
      });
    }

    // WhatsApp natural compose: "mandarle un whatsapp a Juan diciendo nos vemos"
    const waMatch = input.match(/^(?:mandar(?:le)?|enviar(?:le)?|escribir(?:le)?)\s+(?:un\s+)?(?:whatsapp|mensaje|wa)\s+a\s+([^:diciendo]+)(?:\s+(?:diciendo|con|que|:)\s*(.*))?$/i);
    if (waMatch) {
      const target = waMatch[1].trim();
      const body = (waMatch[2] || '').trim();
      results.push({
        id: `wa:compose:${target}`,
        title: `Enviar WhatsApp a ${target}`,
        subtitle: body ? `Borrador: «${body}» · Revisar antes de enviar` : 'Escribir mensaje o grabar nota de voz',
        category: 'Comandos',
        score: 3490,
        action: {
          type: 'compose_message',
          channel: 'whatsapp',
          target,
          text: body,
        },
        iconName: 'MessageSquare',
      });
    }

    // YT1 & YT3: YouTube Mini-Player, Speed 1.5x/2x, Audio-Only Podcast mode
    if (
      n.startsWith('youtube') ||
      n.startsWith('video ') ||
      n.startsWith('ver video') ||
      n.startsWith('lofi') ||
      n.startsWith('podcast')
    ) {
      const ytQuery = input.replace(/^(?:youtube|ver\s+video|video)\s*/i, '').trim();
      results.push({
        id: `yt1:player:${ytQuery || 'main'}`,
        title: ytQuery ? `YouTube Mini-Player: «${ytQuery}»` : 'YouTube · Reproductor Flotante, Velocidad 2x y Solo Audio (YT1/YT3)',
        subtitle: 'Ver video sin salir de tu barra, cambiar velocidad (1.25x, 1.5x, 2x) o modo Podcast',
        category: 'Aplicaciones',
        score: 3465,
        action: { type: 'launch', appName: 'YouTube', appId: 'youtube' },
        iconName: 'Youtube',
      });
    }

    // GM1 & GM2: Gmail Fast Inbox, Express Compose & 2FA/OTP Code Extractor
    if (
      n.startsWith('gmail') ||
      n.startsWith('correo') ||
      n.startsWith('mail') ||
      n.startsWith('2fa') ||
      n.startsWith('otp') ||
      n.startsWith('codigo') ||
      n.includes('verificacion')
    ) {
      results.push({
        id: 'gm2:otp:copy',
        title: '🔐 Copiar Código 2FA / OTP: 849201 (Mercado Pago)',
        subtitle: 'Detectado hace 1 min en Gmail · Enter para copiar al portapapeles',
        category: 'Herramientas',
        score: 3520,
        action: { type: 'copy', text: '849201' },
        iconName: 'KeyRound',
        preview: '849201',
      });
      results.push({
        id: 'gm1:inbox',
        title: 'Gmail · Bandeja Rápida, Redacción Express y Extractor 2FA (GM1/GM2)',
        subtitle: 'Leer correos recientes, extraer códigos de seguridad y enviar mail rápido',
        category: 'Aplicaciones',
        score: 3460,
        action: { type: 'launch', appName: 'Gmail y 2FA', appId: 'gmail' },
        iconName: 'Mail',
      });
    }

    // MAP2: Google Maps Nearby Places (Farmacias, Cafés, Nafta, Cajeros)
    if (
      n.startsWith('google maps') ||
      n.startsWith('maps') ||
      n.startsWith('mapa') ||
      n.includes('farmacia') ||
      n.includes('cafeteria') ||
      n.includes('estacion de servicio') ||
      n.includes('nafta') ||
      n.includes('cajero') ||
      n.includes('cerca de mi') ||
      n.includes('lugares cercanos')
    ) {
      results.push({
        id: 'map2:nearby',
        title: 'Google Maps · Buscador de Lugares Cercanos Abiertos (MAP2)',
        subtitle: 'Farmacias de turno, cafeterías, estaciones de servicio y cajeros con ruta en 1 toque',
        category: 'Aplicaciones',
        score: 3470,
        action: { type: 'launch', appName: 'Google Maps Cercanos', appId: 'maps' },
        iconName: 'MapPin',
      });
    }

    // FIN1 & FIN2: Finanzas, Mi Alias/CBU, Divisor de Asado/Gastos, Calculadora de Cuotas
    if (
      n.includes('alias') ||
      n.includes('cbu') ||
      n.includes('cvu') ||
      n.includes('mercado pago') ||
      n.includes('asado') ||
      n.includes('dividir') ||
      n.includes('cuotas') ||
      n.startsWith('finanzas')
    ) {
      const userAlias = config.paymentAlias || 'bauti.spotlight.mp';
      const userCbu = config.paymentCbu || '0000003100084920194821';
      results.push({
        id: 'fin1:copy_alias',
        title: `💳 Copiar Mi Alias: ${userAlias}`,
        subtitle: `CVU: ${userCbu} (${config.paymentBank || 'Mercado Pago'}) · Enter para copiar`,
        category: 'Herramientas',
        score: 3510,
        action: {
          type: 'copy',
          text: `Alias: ${userAlias}\nCVU: ${userCbu}\nTitular: ${config.paymentHolder || 'Bautista Ayala'} (${config.paymentBank || 'Mercado Pago'})`,
        },
        iconName: 'Wallet',
      });
      results.push({
        id: 'fin1:open_hub',
        title: 'Finanzas · Mi Alias/QR, Divisor de Asado y Calculadora de Cuotas (FIN1/FIN2)',
        subtitle: 'Dividir gastos entre amigos para WhatsApp y comparar cuotas vs efectivo',
        category: 'Aplicaciones',
        score: 3485,
        action: { type: 'launch', appName: 'Finanzas y Mercado Pago', appId: 'finanzas' },
        iconName: 'Wallet',
      });
    }

    // CAM1: Cámara, Espejo Rápido y Escáner QR
    if (
      n.startsWith('camara') ||
      n.startsWith('espejo') ||
      n.startsWith('selfie') ||
      n.startsWith('escanear') ||
      n.startsWith('webcam')
    ) {
      results.push({
        id: 'cam1:open',
        title: 'Cámara, Espejo Rápido y Escáner QR en Vivo (CAM1)',
        subtitle: 'Espejo instantáneo WebRTC, modo selfie invertido, captura de foto y lector QR',
        category: 'Utilidades',
        score: 3460,
        action: { type: 'launch', appName: 'Cámara, Espejo y Escáner QR', appId: 'camara' },
        iconName: 'Camera',
      });
    }

    // SYS1: Centro de Control del Sistema (Wi-Fi, Bluetooth, Linterna, DND, 120Hz)
    if (
      n.startsWith('centro de control') ||
      n.startsWith('control') ||
      n.includes('linterna') ||
      n.includes('wifi') ||
      n.includes('bluetooth') ||
      n.includes('no molestar') ||
      n.includes('120hz') ||
      n.includes('ahorro de bateria')
    ) {
      results.push({
        id: 'sys1:open',
        title: 'Centro de Control del Sistema · Hardware y Conectividad (SYS1)',
        subtitle: 'Switches en vivo: Wi-Fi 6E, Bluetooth 5.4, Linterna Flash, No Molestar, 120Hz y Audio',
        category: 'Comandos',
        score: 3475,
        action: { type: 'launch', appName: 'Centro de Control del Sistema', appId: 'control' },
        iconName: 'Sliders',
      });
    }

    if (['quiero estudiar sin distracciones', 'modo estudio', 'concentracion', 'focus'].includes(n)) {
      results.push({
        id: 'routine:focus',
        title: 'Iniciar Sesión de Concentración (Pomodoro)',
        subtitle: 'Volumen al 20% + temporizador de 25 minutos sin distracciones',
        category: 'Productividad',
        score: 3200,
        action: { type: 'routine', minutes: 25, volume: 20 },
        iconName: 'Timer',
      });
    }

    // AI intent matching
    if (n.startsWith('explicame este pdf') || n.startsWith('explicar pdf') || n.startsWith('resumir documento')) {
      results.push({
        id: 'ai:pdf_review',
        title: 'Explicar documento o PDF',
        subtitle: 'Elegir archivo local y extraer texto con revisión previa antes de IA',
        category: 'IA',
        score: 3300,
        action: { type: 'ask_ai', prompt: 'Explicar y sintetizar los puntos clave de este documento' },
        iconName: 'Sparkles',
      });
    }

    // 4b. Raycast Everyday Non-Technical Tools
    if (n.startsWith('tr ') || n.startsWith('traducir ') || n.startsWith('translate ') || n === 'traductor' || n === 'tr') {
      const phrase = input.replace(/^(?:tr|traducir|translate)\s*/i, '').trim();
      results.push({
        id: 'raycast:translator',
        title: phrase ? `Traducir «${phrase}»` : 'Traductor Rápido Local',
        subtitle: 'Traducción instantánea ES ⇄ EN, FR, PT con pronunciación en voz',
        category: 'Utilidades',
        score: 3450,
        action: { type: 'launch', appName: 'Traductor Rápido', appId: 'translator' },
        iconName: 'Languages',
      });
    }

    if (n.startsWith('hora en ') || n.startsWith('hora ') || n.startsWith('reloj') || n === 'horarios' || n === 'world clock') {
      const city = input.replace(/^(?:hora\s+en|hora|reloj\s+en|reloj)\s*/i, '').trim();
      results.push({
        id: 'raycast:clock',
        title: city ? `Hora en ${city}` : 'Reloj Mundial y Zonas Horarias',
        subtitle: 'Horarios en vivo de Tokio, NY, Madrid, Londres y diferencia horaria',
        category: 'Utilidades',
        score: 3420,
        action: { type: 'launch', appName: 'Reloj Mundial', appId: 'clock' },
        iconName: 'Clock',
      });
    }

    if (n.startsWith('emoji') || n === 'mate' || n.startsWith('emojis') || n.startsWith('icono') || n.startsWith('simbolo')) {
      const term = input.replace(/^(?:emoji|emojis|icono|simbolo)\s*/i, '').trim();
      results.push({
        id: 'raycast:emojis',
        title: term ? `Buscar emoji: «${term}»` : 'Buscador de Emojis y Símbolos',
        subtitle: 'Copiar mate 🧉, fuego 🔥, corazón ❤️ y más de 100 símbolos con un toque',
        category: 'Utilidades',
        score: 3400,
        action: { type: 'launch', appName: 'Buscador de Emojis', appId: 'emojis' },
        iconName: 'Smile',
      });
    }

    if (n.startsWith('timer') || n.startsWith('temporizador') || n.startsWith('crono') || n === 'alarma') {
      results.push({
        id: 'raycast:timer',
        title: 'Temporizador y Cronómetro Visual',
        subtitle: 'Cuenta regresiva interactiva, presets (1, 5, 15, 25 min) y cronómetro',
        category: 'Productividad',
        score: 3380,
        action: { type: 'launch', appName: 'Temporizador y Alarma', appId: 'timer' },
        iconName: 'Timer',
      });
    }

    if (n.startsWith('qr ') || n.startsWith('codigo qr') || n === 'qr') {
      const qrContent = input.replace(/^(?:codigo\s+)?qr\s*/i, '').trim();
      results.push({
        id: 'raycast:qr',
        title: qrContent ? `Generar Código QR para «${qrContent}»` : 'Generador de Códigos QR',
        subtitle: 'Previsualizar, descargar y copiar código QR para enlaces, textos y Wi-Fi',
        category: 'Utilidades',
        score: 3360,
        action: { type: 'launch', appName: 'Generador de Códigos QR', appId: 'qr' },
        iconName: 'QrCode',
      });
    }

    if (
      n.startsWith('peli ') ||
      n.startsWith('pelicula') ||
      n.startsWith('serie ') ||
      n.startsWith('donde ver') ||
      n === 'peliculas' ||
      n === 'series' ||
      n === 'cine'
    ) {
      const movieTitle = input.replace(/^(?:peli|pelicula|peliculas|serie|series|donde\s+ver)\s*/i, '').trim();
      results.push({
        id: 'raycast:movies',
        title: movieTitle ? `Película / Serie: «${movieTitle}»` : 'Buscador de Películas y Series',
        subtitle: 'Puntaje IMDb, sinopsis y en qué plataforma de streaming verla hoy',
        category: 'Utilidades',
        score: 3440,
        action: { type: 'launch', appName: 'Películas y Series', appId: 'movies' },
        iconName: 'Film',
      });
    }

    if (n.startsWith('nota flotante') || n.startsWith('sticky') || n.startsWith('postit')) {
      const stickyText = input.replace(/^(?:nota\s+flotante|sticky|postit)\s*/i, '').trim();
      results.push({
        id: 'raycast:sticky',
        title: stickyText ? `Fijar Nota Flotante: «${stickyText}»` : 'Notas Flotantes Rápidas (Sticky Notes)',
        subtitle: 'Desacoplar nota adhesiva flotante en pantalla mientras seguís buscando',
        category: 'Productividad',
        score: 3410,
        action: { type: 'launch', appName: 'Notas Flotantes Rápidas', appId: 'sticky' },
        iconName: 'StickyNote',
      });
    }

    // 5. Calculator evaluation
    const calcResult = Calculator.evaluate(input);
    if (calcResult !== null) {
      results.push({
        id: `calc:${input}`,
        title: `${calcResult}`,
        subtitle: `Cálculo: ${input} = ${calcResult} (Enter para copiar)`,
        category: 'Herramientas',
        score: 3300,
        action: { type: 'copy', text: calcResult },
        iconName: 'Calculator',
        preview: calcResult,
      });
    }

    // 6. Direct Device commands
    const volMatch = n.match(/^(?:(bajar|subir|ajustar|poner)\s+)?(?:el\s+)?volumen(?:\s+(al|a))?\s+(\d{1,3})%?$/);
    if (volMatch) {
      const val = parseInt(volMatch[3], 10);
      if (val >= 0 && val <= 100) {
        results.push({
          id: `cmd:vol:${val}`,
          title: `Ajustar volumen al ${val}%`,
          subtitle: 'Control local de volumen multimedia',
          category: 'Comandos',
          score: 3200,
          action: { type: 'device', command: `volume:${val}`, value: val },
          iconName: 'Volume2',
        });
      }
    }

    const brightMatch = n.match(/^(?:(bajar|subir|ajustar|poner)\s+)?(?:el\s+)?brillo(?:\s+(al|a))?\s+(\d{1,3})%?$/);
    if (brightMatch) {
      const val = parseInt(brightMatch[3], 10);
      if (val >= 0 && val <= 100) {
        results.push({
          id: `cmd:bright:${val}`,
          title: `Ajustar brillo de pantalla al ${val}%`,
          subtitle: 'Control de luminosidad real en vivo',
          category: 'Comandos',
          score: 3200,
          action: { type: 'device', command: `brightness:${val}`, value: val },
          iconName: 'Sun',
        });
      }
    }

    if (['silenciar', 'mute', 'activar sonido', 'unmute', 'pausar', 'reanudar', 'siguiente cancion', 'encender linterna', 'apagar linterna'].includes(n)) {
      results.push({
        id: `cmd:device:${n}`,
        title: n.charAt(0).toUpperCase() + n.slice(1),
        subtitle: 'Comando nativo de audio/sistema',
        category: 'Comandos',
        score: 2900,
        action: { type: 'device', command: n },
        iconName: 'Sliders',
      });
    }

    // 7. Online lookups: Weather, Currency, Wikipedia, Dictionary
    if (n.startsWith('clima en ') || n.startsWith('clima ') || n.startsWith('tiempo en ')) {
      const city = input.replace(/^(?:clima\s+en|clima|tiempo\s+en)\s+/i, '').trim();
      if (city) {
        results.push({
          id: `online:weather:${city}`,
          title: `Clima en ${city}`,
          subtitle: 'Pronóstico de temperatura, humedad y lluvia de Open-Meteo',
          category: 'Información',
          score: 3000,
          action: { type: 'lookup', lookupType: 'weather', query: city },
          iconName: 'CloudSun',
        });
      }
    }

    const currMatch = input.match(/^([+-]?\d+(?:[.,]\d+)?)\s*([a-zA-Z]{3})\s+(?:a|en|to)\s+([a-zA-Z]{3})$/i);
    if (currMatch) {
      results.push({
        id: `online:currency:${input}`,
        title: `Convertir ${currMatch[1]} ${currMatch[2].toUpperCase()} a ${currMatch[3].toUpperCase()}`,
        subtitle: 'Tipo de cambio de referencia oficial Frankfurter',
        category: 'Herramientas',
        score: 3100,
        action: { type: 'lookup', lookupType: 'currency', query: input },
        iconName: 'DollarSign',
      });
    }

    if (n.startsWith('wiki ') || n.startsWith('wikipedia ')) {
      const term = input.replace(/^(?:wiki|wikipedia)\s+/i, '').trim();
      results.push({
        id: `online:wiki:${term}`,
        title: `Buscar «${term}» en Wikipedia`,
        subtitle: 'Resumen enciclopédico oficial',
        category: 'Información',
        score: 2800,
        action: { type: 'lookup', lookupType: 'wiki', query: term },
        iconName: 'BookOpen',
      });
    }

    if (n.startsWith('definir ') || n.startsWith('significado ')) {
      const word = input.replace(/^(?:definir|significado(?: de)?)\s+/i, '').trim();
      results.push({
        id: `online:dict:${word}`,
        title: `Definición de «${word}»`,
        subtitle: 'Definición en Wikcionario en español',
        category: 'Información',
        score: 2800,
        action: { type: 'lookup', lookupType: 'dictionary', query: word },
        iconName: 'Book',
      });
    }

    // 8. Text Tools & Symbols
    const textToolResults = TextTools.results(input);
    results.push(...textToolResults);
    const symbolResults = SymbolTools.results(input);
    results.push(...symbolResults);

    // 9. Search Installed Apps
    INSTALLED_APPS.forEach(app => {
      const nameScore = relevance(input, app.name);
      const tagMatch = app.tags.some(tag => tag.startsWith(n) || n.startsWith(tag));
      const score = Math.max(nameScore, tagMatch ? 600 : 0);

      if (score > 0 || relevance(input, app.description) > 0) {
        const usageBoost = (config.usageCounts?.[app.id] || 0) * 65;
        const recentIndex = config.recent.indexOf(app.id);
        const recentBoost = recentIndex >= 0 ? Math.max(0, (10 - recentIndex) * 40) : 0;
        results.push({
          id: `app:${app.id}`,
          title: app.name,
          subtitle: app.description,
          category: 'Aplicaciones',
          score: score + 1200 + usageBoost + recentBoost,
          action: { type: 'launch', appName: app.name, appId: app.id, url: app.url },
          iconName: app.icon,
          isFavorite: config.favorites.includes(app.id),
        });
      }
    });

    // 10. Search Files
    MOCK_FILES.forEach(file => {
      const score = relevance(input, file.name);
      if (score > 0) {
        results.push({
          id: `file:${file.id}`,
          title: file.name,
          subtitle: `${file.type} · ${file.size} · ${file.modified}`,
          category: 'Archivos',
          score: score + 900,
          action: { type: 'copy', text: file.name },
          iconName: file.icon,
        });
      }
    });

    // 11. Search Notes & Snippets
    config.notes.forEach(note => {
      const titleScore = relevance(input, note.title);
      const bodyScore = relevance(input, note.content);
      const score = Math.max(titleScore, bodyScore);
      if (score > 0) {
        results.push({
          id: `note:${note.id}`,
          title: note.title,
          subtitle: `Nota · ${note.content.slice(0, 70)}...`,
          category: 'Notas',
          score: score + 800,
          action: { type: 'edit_note', id: note.id, text: note.content },
          iconName: 'FileEdit',
          preview: note.content,
        });
      }
    });

    config.snippets.forEach(snippet => {
      const score = relevance(input, snippet.name);
      if (score > 0) {
        results.push({
          id: `snippet:${snippet.id}`,
          title: `Snippet: ${snippet.name}`,
          subtitle: snippet.template.slice(0, 80),
          category: 'Herramientas',
          score: score + 850,
          action: { type: 'expand_snippet', template: snippet.template },
          iconName: 'Code',
          preview: snippet.template,
        });
      }
    });

    // 12. Search Clips (plus automatic 6-digit OTP badge if aiAutoOtp is enabled)
    config.clips.forEach(clip => {
      if (normalize(clip.text).includes(n)) {
        const otpMatch = config.aiAutoOtp ? clip.text.match(/\b(\d{6})\b/) : null;
        results.push({
          id: `clip:${clip.id}`,
          title: otpMatch ? `🔐 Código 2FA detectado: ${otpMatch[1]}` : clip.text.slice(0, 50),
          subtitle: `Portapapeles ${clip.isPinned ? '· Fijado' : ''}`,
          category: 'Portapapeles',
          score: 800 + (clip.isPinned ? 200 : 0) + (otpMatch ? 600 : 0),
          action: { type: 'copy', text: otpMatch ? otpMatch[1] : clip.text },
          iconName: 'Clipboard',
          preview: clip.text,
        });
      }
    });

    // 13. AI Query fallback option
    if (input.length > 2) {
      results.push({
        id: `ai:query:${input}`,
        title: `Preguntar a la IA (${config.aiProvider.toUpperCase()}) sobre «${input}»`,
        subtitle: `Modelo ${config.aiModel} · Generar respuesta explicativa en panel de IA`,
        category: 'IA',
        score: 400,
        action: { type: 'ask_ai', prompt: input },
        iconName: 'Sparkles',
      });
    }

    // 14. Web search fallback
    results.push({
      id: `web:search:${input}`,
      title: `Buscar «${input}» en Google`,
      subtitle: 'Abrir búsqueda en nueva pestaña',
      category: 'Información',
      score: 100,
      action: { type: 'launch', appName: 'Google', appId: 'chrome', url: `https://www.google.com/search?q=${encodeURIComponent(input)}` },
      iconName: 'ExternalLink',
    });

    // Deduplicate by id and sort by score descending
    const uniqueMap = new Map<string, SearchResult>();
    for (const r of results) {
      if (!uniqueMap.has(r.id) || uniqueMap.get(r.id)!.score < r.score) {
        uniqueMap.set(r.id, r);
      }
    }

    const sorted = Array.from(uniqueMap.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    if (selectedCategory !== 'Todo') {
      return sorted.filter(item => item.category === selectedCategory);
    }

    return sorted;
  }

  private static getHomeSuggestions(config: AppConfig, selectedCategory: SearchCategory): SearchResult[] {
    const list: SearchResult[] = [];

    if (selectedCategory === 'Archivos') {
      return MOCK_FILES.slice(0, 4).map(f => ({
        id: `file:${f.id}`,
        title: f.name,
        subtitle: `${f.type} · ${f.size} · ${f.modified}`,
        category: 'Archivos',
        score: 1000,
        action: { type: 'copy', text: f.name },
        iconName: f.icon,
      }));
    }

    if (selectedCategory === 'Portapapeles') {
      return config.clips.slice(0, 4).map(c => ({
        id: `clip:${c.id}`,
        title: c.text.slice(0, 60),
        subtitle: `Copiado · ${new Date(c.timestamp).toLocaleTimeString()}`,
        category: 'Portapapeles',
        score: 1000,
        action: { type: 'copy', text: c.text },
        iconName: 'Clipboard',
        preview: c.text,
      }));
    }

    if (selectedCategory === 'Notas') {
      const items: SearchResult[] = [
        {
          id: 'note:new',
          title: 'Crear nueva nota',
          subtitle: 'Abrir editor de nota rápida',
          category: 'Notas',
          score: 1100,
          action: { type: 'new_note' },
          iconName: 'PlusCircle',
        },
      ];
      config.notes.slice(0, 3).forEach(note => {
        items.push({
          id: `note:${note.id}`,
          title: note.title,
          subtitle: note.content.slice(0, 80),
          category: 'Notas',
          score: 1000,
          action: { type: 'edit_note', id: note.id, text: note.content },
          iconName: 'FileEdit',
          preview: note.content,
        });
      });
      return items;
    }

    // ADAPTIVE SUGGESTIONS
    const usageCounts = config.usageCounts || {};
    const availableApps = INSTALLED_APPS.filter(app => !config.hiddenSuggestions.includes(app.id));

    const rankedApps = [...availableApps].sort((a, b) => {
      const recentIdxA = config.recent.indexOf(a.id);
      const recentIdxB = config.recent.indexOf(b.id);
      const recentScoreA = recentIdxA >= 0 ? (20 - recentIdxA) * 55 : 0;
      const recentScoreB = recentIdxB >= 0 ? (20 - recentIdxB) * 55 : 0;
      const countScoreA = (usageCounts[a.id] || 0) * 85;
      const countScoreB = (usageCounts[b.id] || 0) * 85;
      const favScoreA = config.favorites.includes(a.id) ? 90 : 0;
      const favScoreB = config.favorites.includes(b.id) ? 90 : 0;
      return (recentScoreB + countScoreB + favScoreB) - (recentScoreA + countScoreA + favScoreA);
    });

    const maxCount = Math.max(2, Math.min(6, config.maxSuggestions ?? 3));
    const topAdaptiveApps = rankedApps.slice(0, maxCount);
    topAdaptiveApps.forEach((app, idx) => {
      const isFav = config.favorites.includes(app.id);
      const displayTitle =
        app.id === 'clipboard'
          ? 'Consultar portapapeles'
          : app.id === 'whatsapp'
          ? 'Leer mensajes de WhatsApp'
          : app.name;
      const displaySubtitle =
        app.id === 'clipboard'
          ? 'Textos capturados con Spotlight en foco'
          : app.id === 'whatsapp'
          ? 'Notificaciones actuales autorizadas · Notas de voz y wa.me'
          : app.description;

      list.push({
        id: `app:${app.id}`,
        title: displayTitle,
        subtitle: displaySubtitle,
        category: app.id === 'clipboard' ? 'Portapapeles' : 'Aplicaciones',
        score: 2000 - idx * 50,
        action: { type: 'launch', appName: app.name, appId: app.id, url: app.url },
        iconName: app.icon,
        isFavorite: isFav,
        isPinned: config.pinnedSuggestions.includes(app.id),
      });
    });

    const topNames = topAdaptiveApps.map(a => a.name.toLowerCase());
    const adaptiveQuery = (config.searchHistory || []).find(
      q =>
        q.trim().length > 2 &&
        !topNames.includes(q.trim().toLowerCase()) &&
        q.toLowerCase() !== 'consultar portapapeles' &&
        q.toLowerCase() !== 'whatsapp'
    );

    if (adaptiveQuery && list.length < maxCount + 1) {
      list.push({
        id: `adaptive:query:${adaptiveQuery}`,
        title: adaptiveQuery,
        subtitle: 'Sugerencia adaptativa según tus búsquedas',
        category: 'Comandos',
        score: 1850,
        action: { type: 'restore_query', query: adaptiveQuery },
        iconName: 'Sparkles',
      });
    }

    if (selectedCategory !== 'Todo') {
      return list.filter(item => item.category === selectedCategory);
    }

    return list;
  }
}
