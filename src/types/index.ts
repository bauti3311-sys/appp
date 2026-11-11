export type SearchCategory =
  | 'Todo'
  | 'Aplicaciones'
  | 'Comandos'
  | 'Archivos'
  | 'Portapapeles'
  | 'Herramientas'
  | 'Utilidades'
  | 'IA'
  | 'Notas'
  | 'Productividad'
  | 'Ajustes'
  | 'Información';

export type ViewMode = 'suggestions' | 'split_inspector' | 'dashboard';

export type PlanStepType =
  | { type: 'brightness'; percent: number }
  | { type: 'volume'; percent: number }
  | { type: 'open'; name: string }
  | { type: 'relative_brightness'; delta: number }
  | { type: 'relative_volume'; delta: number }
  | { type: 'media'; command: 'play' | 'pause' | 'next' | 'previous' };

export interface LocalPlanData {
  raw: string;
  steps: {
    id: string;
    step: PlanStepType;
    label: string;
    icon: string;
    enabled: boolean;
    status?: 'pending' | 'success' | 'blocked' | 'error';
    note?: string;
  }[];
}

export type Action =
  | { type: 'launch'; appName: string; appId: string; url?: string }
  | { type: 'device'; command: string; value?: number }
  | { type: 'plan'; plan: LocalPlanData }
  | { type: 'copy'; text: string; preview?: string }
  | { type: 'lookup'; lookupType: string; query: string }
  | { type: 'compose_message'; channel: 'whatsapp' | 'whatsapp_business' | 'telegram' | 'email' | 'sms'; target: string; text: string }
  | { type: 'expand_snippet'; template: string }
  | { type: 'routine'; minutes: number; volume: number }
  | { type: 'new_note'; initialText?: string }
  | { type: 'edit_note'; id: string; text: string }
  | { type: 'restore_query'; query: string }
  | { type: 'system_panel'; page: 'interpret' | 'settings' | 'inspector' | 'display_review'; param?: string }
  | { type: 'select_mode'; mode: SearchCategory; clearQuery?: boolean }
  | { type: 'ask_ai'; prompt: string; sensitive?: boolean };

export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: SearchCategory;
  score: number;
  action: Action;
  iconName?: string;
  preview?: string;
  mime?: string;
  badge?: string;
  groupLabel?: string;
  isFavorite?: boolean;
  isPinned?: boolean;
}

export interface StickyNoteItem {
  id: string;
  title: string;
  content: string;
  color: 'amber' | 'sky' | 'emerald' | 'rose' | 'purple';
  x: number;
  y: number;
}

export interface SystemPermissions {
  notifications: boolean;
  overlayWindow: boolean;
  accessibilityShizuku: boolean;
  clipboardFocus: boolean;
  microphoneVoice: boolean;
  storageFiles: boolean;
  mediaControl: boolean;
  networkLookups: boolean;
  cameraScanner?: boolean;
  locationMaps?: boolean;
}

export interface AppConfig {
  theme: 'auto' | 'light' | 'dark';
  preset: 'hybrid' | 'glass' | 'raycast' | 'macos' | 'ios' | 'graphite';
  opacity: number;
  glassIntensity: number;
  corner: number;
  borderWidth: number;
  shadowSize: number | 'soft' | 'medium' | 'dramatic';
  accent: 'blue' | 'purple' | 'emerald' | 'amber' | 'rose' | 'graphite' | 'cyan';
  accentIntensity?: 'minimal' | 'subtle' | 'vibrant';
  density: 'compact' | 'comfortable' | 'spacious';
  slimRows?: boolean;
  topBevel?: boolean;
  springPhysics?: 'instant' | 'smooth_ios' | 'elastic_raycast';
  shortcutStyle?: 'mac' | 'pc_android' | 'touch_minimal';
  focusDimming?: boolean;
  iconStyle?: 'original' | 'monochrome' | 'tinted';
  showStatusHeader?: boolean;
  fontFamily?: 'inter' | 'system' | 'mono' | 'jakarta';
  freeDrag?: boolean;
  haptics?: boolean;
  autoClearOnLaunch?: boolean;
  textScale: number;
  uiScale?: number;
  barWidth?: number;
  inspectorWidth?: number;
  splitGap?: number;
  maxSuggestions?: number;
  privateMode: boolean;
  learning: boolean;
  suggestions: boolean;
  blur: boolean;
  soundEffects: boolean;
  engine: 'google' | 'duckduckgo' | 'bing';
  aiProvider: 'gemini' | 'openai' | 'local';
  aiModel: string;
  aiTemperature?: number;
  aiSystemPrompt?: string;
  aiAutoOtp?: boolean;
  aiSmartReplies?: boolean;
  paymentAlias?: string;
  paymentCbu?: string;
  paymentHolder?: string;
  paymentBank?: string;
  permissions?: SystemPermissions;
  floatingNotes?: StickyNoteItem[];
  favorites: string[];
  recent: string[];
  usageCounts?: Record<string, number>;
  searchHistory?: string[];
  pins: string[];
  hiddenSuggestions: string[];
  pinnedSuggestions: string[];
  snippets: { id: string; name: string; template: string }[];
  aliases: { alias: string; target: string }[];
  notes: { id: string; title: string; content: string; updatedAt: number }[];
  clips: { id: string; text: string; timestamp: number; isPinned?: boolean }[];
  sportsFavorites: { id: string; name: string; kind: 'team' | 'league'; sport: string; country?: string }[];
}

export interface InfoCardData {
  title: string;
  subtitle: string;
  body: string;
  copyText?: string;
  url?: string;
  rows?: { label: string; value: string }[];
  category?: string;
}

export interface DeviceState {
  volume: number;
  brightness: number;
  isMuted: boolean;
  isPlaying: boolean;
  wifiEnabled?: boolean;
  bluetoothEnabled?: boolean;
  flashlightEnabled?: boolean;
  dndEnabled?: boolean;
  batterySaver?: boolean;
  hotspotEnabled?: boolean;
  autoRotate?: boolean;
  refreshRate?: 60 | 90 | 120;
  audioOutput?: 'speaker' | 'headphones' | 'tv' | 'car';
  audioOutputDevice?: string;
  batteryLevel?: number;
  ramUsageMb?: number;
  activeMediaTrack?: { title: string; artist: string; album?: string; coverUrl?: string };
  openAppWindow?: { name: string; id: string; icon: string } | null;
}
