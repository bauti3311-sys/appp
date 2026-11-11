import { AppConfig, DeviceState, SystemPermissions } from '../types';

export const DEFAULT_PERMISSIONS: SystemPermissions = {
  notifications: true,
  overlayWindow: true,
  accessibilityShizuku: true,
  clipboardFocus: true,
  microphoneVoice: true,
  storageFiles: true,
  mediaControl: true,
  networkLookups: true,
  cameraScanner: true,
  locationMaps: true,
};

export const DEFAULT_CONFIG: AppConfig = {
  theme: 'dark',
  preset: 'hybrid',
  opacity: 0.96,
  glassIntensity: 28,
  corner: 22,
  borderWidth: 1.0,
  shadowSize: 'dramatic',
  accent: 'emerald',
  accentIntensity: 'subtle',
  density: 'comfortable',
  slimRows: false,
  topBevel: true,
  springPhysics: 'smooth_ios',
  shortcutStyle: 'mac',
  focusDimming: false,
  iconStyle: 'original',
  showStatusHeader: false,
  fontFamily: 'inter',
  freeDrag: true,
  haptics: true,
  autoClearOnLaunch: false,
  textScale: 1.0,
  uiScale: 1.0,
  barWidth: 440,
  inspectorWidth: 495,
  splitGap: 18,
  maxSuggestions: 3,
  privateMode: false,
  learning: true,
  suggestions: true,
  blur: true,
  soundEffects: true,
  engine: 'google',
  aiProvider: 'gemini',
  aiModel: 'gemini-2.5-flash',
  aiTemperature: 0.4,
  aiSystemPrompt: 'Asistente universal conciso y directo para Android / Desktop. Prioriza acciones rápidas.',
  aiAutoOtp: true,
  aiSmartReplies: true,
  paymentAlias: 'bauti.spotlight.mp',
  paymentCbu: '0000003100084920194821',
  paymentHolder: 'Bautista Ayala',
  paymentBank: 'Mercado Pago / Brubank',
  permissions: { ...DEFAULT_PERMISSIONS },
  floatingNotes: [],
  favorites: ['spotify', 'whatsapp', 'youtube', 'finanzas'],
  recent: ['spotify', 'whatsapp', 'youtube'],
  usageCounts: {
    spotify: 14,
    whatsapp: 10,
    youtube: 8,
    finanzas: 6,
  },
  searchHistory: [
    'spotify',
    'whatsapp',
    'youtube',
    'dividir gastos asado',
  ],
  pins: ['bajar el brillo al 35% y abrir Spotify', 'clima en Buenos Aires'],
  hiddenSuggestions: [],
  pinnedSuggestions: ['spotify'],
  snippets: [
    {
      id: 'snip-1',
      name: 'saludo',
      template: 'Hola {nombre}, espero que estés muy bien. Te escribo por {asunto}. ¡Saludos!',
    },
    {
      id: 'snip-2',
      name: 'alias',
      template: 'Te paso mis datos para transferir:\nAlias: bauti.spotlight.mp\nCVU: 0000003100084920194821\nTitular: Bautista Ayala (Mercado Pago)',
    },
    {
      id: 'snip-3',
      name: 'reunion',
      template: 'Invitación a reunión de seguimiento el {fecha} a las {hora}.',
    },
  ],
  aliases: [
    { alias: 'wa', target: 'whatsapp' },
    { alias: 'tg', target: 'telegram' },
    { alias: 'yt', target: 'youtube' },
    { alias: 'sp', target: 'spotify' },
    { alias: 'gm', target: 'gmail' },
    { alias: 'mp', target: 'finanzas' },
    { alias: 'cam', target: 'camara' },
    { alias: 'sys', target: 'control' },
  ],
  notes: [
    {
      id: 'note-1',
      title: 'Bienvenido a Spotlight Next 2.5 — Asistente Universal',
      content: 'Integración total con Spotify, WhatsApp, YouTube, Gmail (2FA), Maps, Mercado Pago/Finanzas, Cámara y Centro de Control.',
      updatedAt: Date.now() - 3600000,
    },
  ],
  clips: [
    {
      id: 'clip-otp',
      text: 'Tu código de verificación de Mercado Pago es 849201. No lo compartas con nadie.',
      timestamp: Date.now() - 60000,
      isPinned: true,
    },
    {
      id: 'clip-1',
      text: 'sk_live_99f38e77a21bc90a07e14dcf881209ab',
      timestamp: Date.now() - 240000,
      isPinned: true,
    },
    {
      id: 'clip-3',
      text: 'Alias: bauti.spotlight.mp | CVU: 0000003100084920194821',
      timestamp: Date.now() - 1800000,
      isPinned: false,
    },
  ],
  sportsFavorites: [
    { id: '133604', name: 'Real Madrid', kind: 'team', sport: 'Soccer', country: 'Spain' },
    { id: '133602', name: 'Barcelona', kind: 'team', sport: 'Soccer', country: 'Spain' },
    { id: '133610', name: 'Boca Juniors', kind: 'team', sport: 'Soccer', country: 'Argentina' },
  ],
};

const STORAGE_KEY = 'spotlight_next_config_v4';

export class PreferencesStore {
  static load(): AppConfig {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('spotlight_next_config_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Fix legacy glassIntensity if it was stored as 0..1 float instead of px
        const fixedGlass =
          typeof parsed.glassIntensity === 'number' && parsed.glassIntensity <= 1.5
            ? Math.round(parsed.glassIntensity * 40)
            : parsed.glassIntensity ?? DEFAULT_CONFIG.glassIntensity;

        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          glassIntensity: fixedGlass,
          permissions: {
            ...DEFAULT_PERMISSIONS,
            ...(parsed.permissions || {}),
          },
        };
      }
    } catch (e) {
      console.warn('Error loading preferences from localStorage:', e);
    }
    return DEFAULT_CONFIG;
  }

  static save(config: AppConfig): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn('Error saving preferences:', e);
    }
  }

  static clearHistory(config: AppConfig): AppConfig {
    const updated: AppConfig = {
      ...config,
      recent: [],
      usageCounts: {},
      searchHistory: [],
      clips: config.clips.filter(c => c.isPinned),
    };
    this.save(updated);
    return updated;
  }
}

export const INITIAL_DEVICE_STATE: DeviceState = {
  volume: 70,
  brightness: 88,
  isMuted: false,
  isPlaying: true,
  wifiEnabled: true,
  bluetoothEnabled: true,
  flashlightEnabled: false,
  dndEnabled: false,
  batterySaver: false,
  hotspotEnabled: false,
  autoRotate: true,
  refreshRate: 120,
  audioOutput: 'headphones',
  activeMediaTrack: {
    title: 'Midnight City',
    artist: 'M83',
    album: "Hurry Up, We're Dreaming",
  },
  openAppWindow: null,
};
