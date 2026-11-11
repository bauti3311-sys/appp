import React, { useState, useEffect, useRef } from 'react';
import {
  Pin, Star, MoreHorizontal, X, ExternalLink, Play,
  Pause, SkipForward, SkipBack, Search,
  Send, Check, CheckCheck, ChevronRight,
  Volume2, ArrowLeft, Shuffle, Repeat, Heart, Copy, Eye, EyeOff,
  Trash2, Plus, ArrowRightLeft,
  Sun, Moon, RotateCcw, Film, StickyNote, Tv, Sparkles
} from 'lucide-react';
import { SearchResult, DeviceState, AppConfig, StickyNoteItem } from '../types';
import { IosAppIcon, getAppBrand } from './IosAppIcon';
import { Calculator } from '../lib/calculator';
import { ExtensiveSpotifyInspector, ExtensiveWhatsAppInspector } from './SpotifyWhatsAppExtensive';
import {
  YouTubeInspectorPanel,
  GmailInspectorPanel,
  MapsInspectorPanel,
  FinanzasInspectorPanel,
  CameraInspectorPanel,
  ControlCenterInspectorPanel,
} from './UniversalIntegrationsPanel';

interface SplitInspectorProps {
  result: SearchResult;
  deviceState: DeviceState;
  config: AppConfig;
  isMobilePhone?: boolean;
  onUpdateDevice: (partial: Partial<DeviceState>) => void;
  onUpdateConfig?: (updated: AppConfig) => void;
  onCopyText?: (text: string) => void;
  onExecutePrimary: () => void;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onTogglePin: (id: string) => void;
  onOpenActions: () => void;
  onQuickQuery: (query: string) => void;
  onStartDrag?: (e: React.MouseEvent | React.TouchEvent) => void;
}

interface MovieCatalogItem {
  id: string;
  title: string;
  year: number;
  type: 'Película' | 'Serie';
  imdb: string;
  duration: string;
  genre: string;
  director: string;
  synopsis: string;
  platforms: Array<{ name: string; color: string; badge: string }>;
  posterGradient: string;
}

const MOVIES_CATALOG: MovieCatalogItem[] = [
  {
    id: 'interstellar',
    title: 'Interstellar',
    year: 2014,
    type: 'Película',
    imdb: '8.7',
    duration: '2h 49m',
    genre: 'Ciencia Ficción • Drama',
    director: 'Christopher Nolan',
    synopsis: 'Un grupo de exploradores viaja a través de un agujero de gusano en el espacio en un intento por asegurar la supervivencia de la humanidad.',
    platforms: [
      { name: 'Max', color: '#002be7', badge: '4K HDR' },
      { name: 'Prime Video', color: '#00a8e1', badge: 'Incluida' },
      { name: 'Apple TV+', color: '#555555', badge: 'Alquiler' },
    ],
    posterGradient: 'from-amber-600 via-indigo-950 to-black',
  },
  {
    id: 'eternauta',
    title: 'El Eternauta',
    year: 2025,
    type: 'Serie',
    imdb: '8.9',
    duration: '1 Temporada (6 eps)',
    genre: 'Ciencia Ficción • Suspenso',
    director: 'Bruno Stagnaro (con Ricardo Darín)',
    synopsis: 'Tras una nevada mortal que acaba con gran parte de la población en Buenos Aires, Juan Salvo y un grupo de sobrevivientes resisten una amenaza invisible.',
    platforms: [
      { name: 'Netflix', color: '#e50914', badge: 'Exclusivo 4K' },
    ],
    posterGradient: 'from-sky-600 via-slate-900 to-black',
  },
  {
    id: 'arcane',
    title: 'Arcane: League of Legends',
    year: 2024,
    type: 'Serie',
    imdb: '9.0',
    duration: '2 Temporadas',
    genre: 'Animación • Steampunk Acción',
    director: 'Fortiche / Christian Linke',
    synopsis: 'En medio del conflicto entre las ciudades gemelas de Piltover y Zaun, dos hermanas luchan en bandos opuestos de una guerra entre tecnologías mágicas.',
    platforms: [
      { name: 'Netflix', color: '#e50914', badge: 'Dolby Vision' },
    ],
    posterGradient: 'from-fuchsia-600 via-blue-950 to-black',
  },
  {
    id: 'dune2',
    title: 'Dune: Parte Dos',
    year: 2024,
    type: 'Película',
    imdb: '8.5',
    duration: '2h 46m',
    genre: 'Ciencia Ficción • Aventura',
    director: 'Denis Villeneuve',
    synopsis: 'Paul Atreides se une a Chani y a los Fremen mientras busca venganza contra los conspiradores que destruyeron a su familia.',
    platforms: [
      { name: 'Max', color: '#002be7', badge: 'IMAX Enhanced' },
      { name: 'Prime Video', color: '#00a8e1', badge: '4K' },
    ],
    posterGradient: 'from-orange-500 via-amber-900 to-black',
  },
  {
    id: 'thebear',
    title: 'The Bear (El Oso)',
    year: 2024,
    type: 'Serie',
    imdb: '8.6',
    duration: '3 Temporadas',
    genre: 'Drama • Comedia Intensa',
    director: 'Christopher Storer',
    synopsis: 'Un joven chef de alta cocina regresa a Chicago para dirigir la caótica tienda de sándwiches de su familia.',
    platforms: [
      { name: 'Disney+', color: '#113ccf', badge: 'Star Original' },
    ],
    posterGradient: 'from-blue-600 via-neutral-900 to-black',
  },
  {
    id: 'oppenheimer',
    title: 'Oppenheimer',
    year: 2023,
    type: 'Película',
    imdb: '8.3',
    duration: '3h 00m',
    genre: 'Biografía • Historia',
    director: 'Christopher Nolan',
    synopsis: 'La historia del físico J. Robert Oppenheimer y su rol al frente del Proyecto Manhattan durante la Segunda Guerra Mundial.',
    platforms: [
      { name: 'Prime Video', color: '#00a8e1', badge: 'Incluida' },
      { name: 'Apple TV+', color: '#555555', badge: '4K' },
    ],
    posterGradient: 'from-red-600 via-orange-950 to-black',
  },
];

interface TrackItem {
  title: string;
  artist: string;
  album: string;
  duration: string;
  durationSecs: number;
  playlist: 'synthwave' | 'focus' | 'favs';
  coverText: string;
  coverGradient: string;
}

const INITIAL_TRACKS: TrackItem[] = [
  { title: 'Midnight City', artist: 'M83', album: "Hurry Up, We're Dreaming", duration: '4:03', durationSecs: 243, playlist: 'synthwave', coverText: 'M83', coverGradient: 'from-emerald-600 via-teal-800 to-neutral-950' },
  { title: 'Veridis Quo', artist: 'Daft Punk', album: 'Discovery', duration: '5:45', durationSecs: 345, playlist: 'focus', coverText: 'DP', coverGradient: 'from-amber-500 via-orange-800 to-neutral-950' },
  { title: 'Nightcall', artist: 'Kavinsky', album: 'OutRun', duration: '4:18', durationSecs: 258, playlist: 'synthwave', coverText: 'KV', coverGradient: 'from-rose-600 via-purple-900 to-neutral-950' },
  { title: 'Resonance', artist: 'HOME', album: 'Odyssey', duration: '3:32', durationSecs: 212, playlist: 'favs', coverText: 'HM', coverGradient: 'from-cyan-500 via-indigo-900 to-neutral-950' },
  { title: 'Starboy', artist: 'The Weeknd', album: 'Starboy', duration: '3:50', durationSecs: 230, playlist: 'favs', coverText: 'TW', coverGradient: 'from-red-600 via-rose-950 to-black' },
];

const QUICK_LOOK_FILES = [
  {
    id: 'spotlight-architecture.pdf',
    name: 'spotlight-architecture.pdf',
    type: 'PDF Multipágina',
    size: '2.4 MB',
    pages: [
      {
        pageNumber: 1,
        heading: '1. Arquitectura Híbrida Spotlight Next 2.0',
        content: 'Diseño modular de baja latencia (<16ms por cuadro a 120Hz en Moto G86 pOLED y 90Hz en Samsung Tab A9+).\n\n• Motor local de intenciones y planes encadenados.\n• Superficie Liquid Glass con desenfoque reactivo.\n• Inspector dividido con estado persistente.',
      },
      {
        pageNumber: 2,
        heading: '2. Sistema de Acentos Dinámicos iOS',
        content: 'Cada aplicación proyecta su firma cromática original en bordes biselados, indicadores activos y aura ambiental exterior.\n\n• Spotify: #1ED760 (Neon Emerald)\n• WhatsApp: #25D366 (Chat Green)\n• Telegram: #229ED9 (Cloud Sky)',
      },
      {
        pageNumber: 3,
        heading: '3. Seguridad y Portapapeles Encriptado',
        content: 'Detección automática de tokens y claves API (sk_live_*, Bearer) con enmascaramiento visual en el Inspector de Portapapeles.',
      },
    ],
  },
  {
    id: 'Spotlight-Next-v2.apk',
    name: 'Spotlight-Next-v2.apk',
    type: 'Paquete Android APK',
    size: '18.6 MB',
    pages: [
      {
        pageNumber: 1,
        heading: 'Manifiesto de Paquete APK (ARM64)',
        content: 'Package: dev.bautista.spotlight\nTarget SDK: 35 (Android 15)\nMin SDK: 28\nPermisos: SYSTEM_ALERT_WINDOW, BIND_QUICK_SETTINGS_TILE, RECORD_AUDIO.\nFirma SHA-256 verificada.',
      },
    ],
  },
  {
    id: 'Reporte-Financiero-Q4.xlsx',
    name: 'Reporte-Financiero-Q4.xlsx',
    type: 'Hoja de Cálculo',
    size: '840 KB',
    pages: [
      {
        pageNumber: 1,
        heading: 'Resumen Trimestral Q4 — Métricas Clave',
        content: 'Ingresos recurrentes: $48,920 USD (+24% YoY)\nLatencia media de búsqueda: 4.2 ms\nUsuarios activos en móvil (Moto G86): 68%\nUsuarios activos en tablet (Tab A9+): 32%',
      },
    ],
  },
];

// Emoji database with search keywords
const EMOJI_ITEMS = [
  { char: '🧉', name: 'Mate Argentino', cat: 'arg', tags: 'mate yerba argentina bebida infusion uruguay' },
  { char: '🔥', name: 'Fuego / Candela', cat: 'pop', tags: 'fuego caliente llama top energia calor' },
  { char: '❤️', name: 'Corazón Rojo', cat: 'pop', tags: 'corazon amor red love rojo' },
  { char: '🇦🇷', name: 'Bandera Argentina', cat: 'arg', tags: 'argentina bandera celeste sol buenos aires' },
  { char: '🥩', name: 'Asado / Carne', cat: 'arg', tags: 'asado carne comida parrilla argentina' },
  { char: '☀️', name: 'Sol de Mayo', cat: 'arg', tags: 'sol calor dia luz verano' },
  { char: '✨', name: 'Chispas / Brillitos', cat: 'pop', tags: 'chispas magia estrellas nuevo' },
  { char: '🚀', name: 'Cohete / Despegue', cat: 'pop', tags: 'cohete rapido tecnologia despegar' },
  { char: '😎', name: 'Cara con Lentes', cat: 'face', tags: 'cool lentes sonrisa fachero' },
  { char: '😂', name: 'Risa con Lágrimas', cat: 'face', tags: 'risa gracioso divertido carcajada lol' },
  { char: '🥺', name: 'Cara Suplicante', cat: 'face', tags: 'por favor tierno carita' },
  { char: '👍', name: 'Pulgar Arriba', cat: 'hand', tags: 'bien ok genial pulgar like' },
  { char: '🙌', name: 'Manos Celebrando', cat: 'hand', tags: 'fiesta manos celebrar aplauso' },
  { char: '💡', name: 'Bombilla / Idea', cat: 'obj', tags: 'idea luz pensar foco' },
  { char: '☕', name: 'Café Caliente', cat: 'obj', tags: 'cafe taza desayuno energia' },
  { char: '⚡', name: 'Rayo / Energía', cat: 'obj', tags: 'rayo trueno velocidad rapido' },
  { char: '💻', name: 'Laptop / Mac', cat: 'obj', tags: 'computadora mac pc laptop programar' },
];

// World clock cities
const WORLD_CITIES = [
  { id: 'tokyo', name: 'Tokio', country: 'Japón', tz: 'Asia/Tokyo', diff: '+12h', isDay: true },
  { id: 'new_york', name: 'Nueva York', country: 'EE.UU.', tz: 'America/New_York', diff: '-2h', isDay: true },
  { id: 'madrid', name: 'Madrid', country: 'España', tz: 'Europe/Madrid', diff: '+4h', isDay: true },
  { id: 'london', name: 'Londres', country: 'Reino Unido', tz: 'Europe/London', diff: '+3h', isDay: true },
  { id: 'buenos_aires', name: 'Buenos Aires', country: 'Argentina', tz: 'America/Argentina/Buenos_Aires', diff: 'Local', isDay: true },
  { id: 'sydney', name: 'Sídney', country: 'Australia', tz: 'Australia/Sydney', diff: '+14h', isDay: false },
  { id: 'paris', name: 'París', country: 'Francia', tz: 'Europe/Paris', diff: '+4h', isDay: true },
];

export const SplitInspector: React.FC<SplitInspectorProps> = ({
  result,
  deviceState,
  config,
  isMobilePhone = false,
  onUpdateDevice,
  onUpdateConfig,
  onCopyText,
  onExecutePrimary,
  onClose,
  onToggleFavorite,
  onTogglePin,
  onOpenActions,
  onQuickQuery,
  onStartDrag,
}) => {
  const brand = getAppBrand(result.id);
  const touchStartX = useRef<number | null>(null);

  // --- FUNCTION F7: MOVIES & SERIES FINDER STATE ---
  const [movieSearch, setMovieSearch] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState('interstellar');
  const [movieTypeFilter, setMovieTypeFilter] = useState<'all' | 'Película' | 'Serie'>('all');

  // --- FUNCTION F2: FLOATING STICKY NOTES STATE ---
  const [stickyTitle, setStickyTitle] = useState('Recordatorio rápido');
  const [stickyContent, setStickyContent] = useState(() => {
    const match = result.subtitle.match(/«(.+)»/);
    return match ? match[1] : 'Revisar pendientes de hoy y responder mensajes importantes.';
  });
  const [stickyColor, setStickyColor] = useState<StickyNoteItem['color']>('amber');

  const handleCreateFloatingSticky = () => {
    if (!onUpdateConfig || !stickyContent.trim()) return;
    const existing = config.floatingNotes || [];
    const offset = (existing.length % 4) * 26;
    const newSticky: StickyNoteItem = {
      id: `sticky-${Date.now()}`,
      title: stickyTitle.trim() || 'Nota Flotante',
      content: stickyContent.trim(),
      color: stickyColor,
      x: 28 + offset,
      y: 90 + offset,
    };
    onUpdateConfig({
      ...config,
      floatingNotes: [...existing, newSticky],
    });
    onCopyText?.('📌 Nota flotante desacoplada en pantalla');
  };

  // --- FUNCTION 1: SPOTIFY PERSISTENT MINI-PLAYER STATE ---
  const [activeTrackIdx, setActiveTrackIdx] = useState(0);
  const [activePlaylist, setActivePlaylist] = useState<'all' | 'synthwave' | 'focus' | 'favs'>('all');
  const [trackProgress, setTrackProgress] = useState(104);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(true);
  const [likedTracks, setLikedTracks] = useState<string[]>(['Midnight City', 'Resonance']);

  const currentTrack = INITIAL_TRACKS[activeTrackIdx] || INITIAL_TRACKS[0];
  const trackDuration = currentTrack.durationSecs;

  useEffect(() => {
    if (!deviceState.isPlaying) return;
    const timer = setInterval(() => {
      setTrackProgress(prev => {
        if (prev + 1 >= trackDuration) {
          if (isRepeat) return 0;
          setActiveTrackIdx(idx => (idx + 1) % INITIAL_TRACKS.length);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [deviceState.isPlaying, trackDuration, isRepeat]);

  const handleSelectTrack = (index: number) => {
    setActiveTrackIdx(index);
    setTrackProgress(0);
    onUpdateDevice({
      isPlaying: true,
      activeMediaTrack: {
        title: INITIAL_TRACKS[index].title,
        artist: INITIAL_TRACKS[index].artist,
        album: INITIAL_TRACKS[index].album,
      },
    });
  };

  const handleNextTrack = () => {
    const nextIdx = isShuffle
      ? Math.floor(Math.random() * INITIAL_TRACKS.length)
      : (activeTrackIdx + 1) % INITIAL_TRACKS.length;
    handleSelectTrack(nextIdx);
  };

  const handlePrevTrack = () => {
    if (trackProgress > 10) {
      setTrackProgress(0);
    } else {
      const prevIdx = (activeTrackIdx - 1 + INITIAL_TRACKS.length) % INITIAL_TRACKS.length;
      handleSelectTrack(prevIdx);
    }
  };

  // --- FUNCTION 2: WHATSAPP & TELEGRAM LIVE MESSAGING STATE ---
  const [activeContact, setActiveContact] = useState<'martin' | 'sofia' | 'grupo'>('martin');
  const [chatMessages, setChatMessages] = useState<
    Record<'martin' | 'sofia' | 'grupo', Array<{ sender: 'them' | 'me'; text: string; time: string; read?: boolean }>>
  >({
    martin: [
      { sender: 'them', text: '¿Ya probaste el nuevo predictor de texto sin prefijos?', time: '19:07' },
      { sender: 'them', text: 'Presionás Tab y te autocompleta al instante cualquier aplicación.', time: '19:08' },
    ],
    sofia: [
      { sender: 'them', text: '¡Genial! El traductor con voz y el reloj mundial andan de diez.', time: '18:42' },
    ],
    grupo: [
      { sender: 'them', text: 'Release limpia: nombres directos, emojis con mate argentino 🧉 y temporizador.', time: '17:30' },
    ],
  });
  const [replyText, setReplyText] = useState('');
  const [replySentToast, setReplySentToast] = useState(false);
  const [isTypingReply, setIsTypingReply] = useState(false);

  // --- FUNCTION 4: CLIPBOARD MANAGER STATE ---
  const [clipFilter, setClipFilter] = useState<'all' | 'pinned' | 'secrets' | 'code'>('all');
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});
  const [newClipText, setNewClipText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // --- FUNCTION 5: QUICK LOOK MULTI-PAGE & OCR STATE ---
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [ocrMode, setOcrMode] = useState(false);

  // --- CALCULATOR & CONVERTER STATE ---
  const [calcExpr, setCalcExpr] = useState('25% de 84000');

  // --- RAYCAST FRIENDLY TOOL 1: QUICK TRANSLATOR STATE ---
  const [transSourceLang, setTransSourceLang] = useState<'es' | 'en' | 'fr' | 'pt'>('es');
  const [transTargetLang, setTransTargetLang] = useState<'es' | 'en' | 'fr' | 'pt'>('en');
  const [transInputText, setTransInputText] = useState('Hola, ¿cómo estás?');

  // Simple, offline, instant dictionary for seamless zero-latency translation
  const translateDictionary: Record<string, Record<string, string>> = {
    'hola': { en: 'Hello', fr: 'Bonjour', pt: 'Olá', es: 'Hola' },
    'hola, ¿cómo estás?': { en: 'Hello, how are you?', fr: 'Bonjour, comment allez-vous ?', pt: 'Olá, como você está?', es: 'Hola, ¿cómo estás?' },
    'gracias': { en: 'Thank you', fr: 'Merci', pt: 'Obrigado', es: 'Gracias' },
    'buenos días': { en: 'Good morning', fr: 'Bonjour', pt: 'Bom dia', es: 'Buenos días' },
    'buenas noches': { en: 'Good night', fr: 'Bonne nuit', pt: 'Boa noite', es: 'Buenas noches' },
    'de nada': { en: "You're welcome", fr: 'De rien', pt: 'De nada', es: 'De nada' },
    'amigo': { en: 'Friend', fr: 'Ami', pt: 'Amigo', es: 'Amigo' },
    'música': { en: 'Music', fr: 'Musique', pt: 'Música', es: 'Música' },
  };

  const getTranslatedText = () => {
    const clean = transInputText.trim().toLowerCase();
    if (translateDictionary[clean] && translateDictionary[clean][transTargetLang]) {
      return translateDictionary[clean][transTargetLang];
    }
    if (transSourceLang === 'es' && transTargetLang === 'en') {
      return `[EN] ${transInputText}`;
    }
    if (transSourceLang === 'en' && transTargetLang === 'es') {
      return `[ES] ${transInputText}`;
    }
    return `${transInputText} (${transTargetLang.toUpperCase()})`;
  };

  const handleSpeakTranslation = (text: string, lang: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang === 'en' ? 'en-US' : lang === 'fr' ? 'fr-FR' : lang === 'pt' ? 'pt-BR' : 'es-ES';
      utter.rate = 0.95;
      window.speechSynthesis.speak(utter);
    }
  };

  // --- RAYCAST FRIENDLY TOOL 2: WORLD CLOCK STATE ---
  const [selectedCityId, setSelectedCityId] = useState('tokyo');
  const [currentClockTime, setCurrentClockTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentClockTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeCity = WORLD_CITIES.find(c => c.id === selectedCityId) || WORLD_CITIES[0];
  const cityFormattedTime = currentClockTime.toLocaleTimeString('es-ES', {
    timeZone: activeCity.tz,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const cityFormattedDate = currentClockTime.toLocaleDateString('es-ES', {
    timeZone: activeCity.tz,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  // --- RAYCAST FRIENDLY TOOL 3: EMOJIS & SYMBOLS STATE ---
  const [emojiSearch, setEmojiSearch] = useState('');
  const [activeEmojiCat, setActiveEmojiCat] = useState<'all' | 'arg' | 'pop' | 'face' | 'hand' | 'obj'>('all');
  const [copiedEmoji, setCopiedEmoji] = useState<string | null>(null);

  const handleCopyEmoji = (emojiChar: string, emojiName: string) => {
    navigator.clipboard?.writeText(emojiChar);
    setCopiedEmoji(emojiChar);
    onCopyText?.(`Emoji ${emojiChar} (${emojiName})`);
    setTimeout(() => setCopiedEmoji(null), 1500);
  };

  // --- RAYCAST FRIENDLY TOOL 4: VISUAL TIMER & STOPWATCH STATE ---
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(300); // 5 min default
  const [timerTotalDuration, setTimerTotalDuration] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'timer' | 'stopwatch'>('timer');
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        if (timerMode === 'timer') {
          setTimerSecondsLeft(prev => {
            if (prev <= 1) {
              setIsTimerRunning(false);
              onCopyText?.('⏰ ¡Tiempo cumplido!');
              return 0;
            }
            return prev - 1;
          });
        } else {
          setStopwatchSeconds(prev => prev + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerMode]);

  const setTimerPreset = (secs: number) => {
    setTimerTotalDuration(secs);
    setTimerSecondsLeft(secs);
    setIsTimerRunning(true);
  };

  // --- RAYCAST FRIENDLY TOOL 5: QR CODE GENERATOR STATE ---
  const [qrText, setQrText] = useState('https://github.com/bauti3311-sys/Spotlight-Next');
  const [qrCopied, setQrCopied] = useState(false);

  // App identifications
  const cleanAppId = result.id.replace('app:', '').replace('raycast:', '');
  const isFav = config.favorites.includes(cleanAppId);
  const isPinned = config.pins.includes(result.title) || config.pinnedSuggestions.includes(cleanAppId);

  const isSpotify = cleanAppId === 'spotify' || result.id.includes('music') || result.title.toLowerCase().includes('spotify');
  const isWhatsApp = cleanAppId === 'whatsapp' || result.id.startsWith('wa:') || result.title.toLowerCase().includes('whatsapp');
  const isTelegram = cleanAppId === 'telegram' || result.id.startsWith('tg:') || result.title.toLowerCase().includes('telegram');
  const isMessaging = isWhatsApp || isTelegram;
  const isClipboard = cleanAppId === 'clipboard' || result.category === 'Portapapeles' || result.id.startsWith('clip:') || result.id.startsWith('snippet:');
  const isFile = cleanAppId === 'files' || result.category === 'Archivos' || result.id.startsWith('file:');
  const isCalculator = cleanAppId === 'calc' || result.id.startsWith('calc:') || result.id.startsWith('online:currency:');

  // Friendly Raycast tools flags
  const isTranslator = cleanAppId === 'translator' || result.id.includes('translator') || result.title.toLowerCase().includes('traducir');
  const isClock = cleanAppId === 'clock' || result.id.includes('clock') || result.title.toLowerCase().includes('hora en') || result.title.toLowerCase().includes('reloj');
  const isEmojis = cleanAppId === 'emojis' || result.id.includes('emojis') || result.title.toLowerCase().includes('emoji');
  const isTimer = cleanAppId === 'timer' || result.id.includes('timer') || result.title.toLowerCase().includes('temporizador') || result.title.toLowerCase().includes('cronometro');
  const isQr = cleanAppId === 'qr' || result.id.includes('qr') || result.title.toLowerCase().includes('qr');
  const isMovies = cleanAppId === 'movies' || result.id.includes('movies') || result.title.toLowerCase().includes('película') || result.title.toLowerCase().includes('serie') || result.title.toLowerCase().includes('streaming');
  const isSticky = cleanAppId === 'sticky' || cleanAppId === 'notes' || result.id.includes('sticky') || result.title.toLowerCase().includes('nota flotante');

  // Universal Assistant Integrations Flags (YT1/YT3, GM1/GM2, MAP2, FIN1/FIN2, CAM1, SYS1)
  const isYouTube = cleanAppId === 'youtube' || result.id.startsWith('yt') || result.title.toLowerCase().includes('youtube');
  const isGmail = cleanAppId === 'gmail' || result.id.startsWith('gm') || result.title.toLowerCase().includes('gmail') || result.title.toLowerCase().includes('2fa');
  const isMaps = cleanAppId === 'maps' || result.id.startsWith('map') || result.title.toLowerCase().includes('google maps') || result.title.toLowerCase().includes('farmacia') || result.title.toLowerCase().includes('cercanos');
  const isFinanzas = cleanAppId === 'finanzas' || result.id.startsWith('fin') || result.title.toLowerCase().includes('finanzas') || result.title.toLowerCase().includes('alias') || result.title.toLowerCase().includes('asado') || result.title.toLowerCase().includes('mercado pago');
  const isCamera = cleanAppId === 'camara' || cleanAppId === 'camera' || result.id.startsWith('cam') || result.title.toLowerCase().includes('cámara') || result.title.toLowerCase().includes('espejo');
  const isControl = cleanAppId === 'control' || result.id.startsWith('sys') || result.title.toLowerCase().includes('centro de control');

  const handleSendReply = (customText?: string) => {
    const textToSend = (customText ?? replyText).trim();
    if (!textToSend) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const targetContact = activeContact;

    setChatMessages(prev => ({
      ...prev,
      [targetContact]: [
        ...prev[targetContact],
        { sender: 'me', text: textToSend, time: timeStr, read: true },
      ],
    }));
    if (!customText) setReplyText('');
    setReplySentToast(true);
    setTimeout(() => setReplySentToast(false), 1800);

    setIsTypingReply(true);
    setTimeout(() => {
      setIsTypingReply(false);
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const autoResponses: Record<'martin' | 'sofia' | 'grupo', string> = {
        martin: '¡Buenísimo, se lee súper limpio sin prefijos y el predictor ayuda un montón!',
        sofia: '¡Me encantó el reloj mundial y los emojis con mate 🧉!',
        grupo: 'Anotado para el siguiente despliegue 🚀',
      };
      setChatMessages(prev => ({
        ...prev,
        [targetContact]: [
          ...prev[targetContact],
          { sender: 'them', text: autoResponses[targetContact], time: replyTime },
        ],
      }));
    }, 1100);
  };

  const formatSecs = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isSecretClip = (text: string) => /^(sk_live_|pk_live_|ghp_|AIza|Bearer\s)/i.test(text.trim());
  const isCodeClip = (text: string) => text.includes('const ') || text.includes('export ') || text.includes('function ') || text.includes('{');
  const maskSecret = (text: string) => (text.length <= 12 ? '••••••••••••' : `${text.slice(0, 12)}••••••••••••••••••`);

  const handleCopyClip = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    onCopyText?.(text);
    setTimeout(() => setCopiedId(null), 1600);
  };

  const handleAddClip = () => {
    if (!newClipText.trim() || !onUpdateConfig) return;
    const newClip = {
      id: `clip-${Date.now()}`,
      text: newClipText.trim(),
      timestamp: Date.now(),
      isPinned: false,
    };
    onUpdateConfig({
      ...config,
      clips: [newClip, ...config.clips],
    });
    setNewClipText('');
  };

  const handleToggleClipPin = (id: string) => {
    if (!onUpdateConfig) return;
    onUpdateConfig({
      ...config,
      clips: config.clips.map(c => (c.id === id ? { ...c, isPinned: !c.isPinned } : c)),
    });
  };

  const handleDeleteClip = (id: string) => {
    if (!onUpdateConfig) return;
    onUpdateConfig({
      ...config,
      clips: config.clips.filter(c => c.id !== id),
    });
  };

  // Touch swipe-right on Inspector to go back on mobile Moto G86
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > 65 && isMobilePhone) {
      navigator.vibrate?.(10);
      onClose();
    }
    touchStartX.current = null;
  };

  const activeFile = QUICK_LOOK_FILES[selectedFileIdx] || QUICK_LOOK_FILES[0];
  const activePageObj = activeFile.pages[Math.min(currentPage - 1, activeFile.pages.length - 1)] || activeFile.pages[0];
  const liveCalcValue = Calculator.evaluate(calcExpr);

  const filteredMovies = MOVIES_CATALOG.filter(m => {
    if (movieTypeFilter !== 'all' && m.type !== movieTypeFilter) return false;
    if (!movieSearch.trim()) return true;
    const q = movieSearch.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      m.genre.toLowerCase().includes(q) ||
      m.director.toLowerCase().includes(q) ||
      m.platforms.some(p => p.name.toLowerCase().includes(q))
    );
  });
  const activeMovie = filteredMovies.find(m => m.id === selectedMovieId) || filteredMovies[0] || MOVIES_CATALOG[0];

  return (
    <aside
      aria-label="Inspector de detalles"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        borderLeftColor: `${brand.primaryColor}35`,
      }}
      className="flex flex-col h-full bg-black/35 border-l text-neutral-200 select-none overflow-hidden animate-slide-spring"
    >
      {/* E3: Free Drag Handle on Inspector Window */}
      {config.freeDrag !== false && onStartDrag && (
        <div
          onMouseDown={onStartDrag}
          onTouchStart={onStartDrag}
          title="Arrastrar ventana de Inspector libremente"
          className="w-full pt-1.5 pb-0.5 flex items-center justify-center cursor-grab active:cursor-grabbing group"
        >
          <div className="w-9 h-1 rounded-full bg-white/15 group-hover:bg-white/35 transition-colors" />
        </div>
      )}

      {/* Inspector Header with Dynamic Brand Accent */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/[0.04]">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
          {isMobilePhone && (
            <button
              onClick={onClose}
              className="mr-1 px-2 py-1 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
              title="Volver a la lista (o deslizá a la derecha)"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver</span>
            </button>
          )}

          <span
            style={{ backgroundColor: brand.primaryColor, boxShadow: `0 0 10px ${brand.glowColor}` }}
            className="w-2 h-2 rounded-full animate-pulse"
          />
          <span>INSPECTOR</span>
          <span>•</span>
          <span style={{ color: brand.primaryColor }}>
            {isMovies
              ? 'PELÍCULAS & STREAMING'
              : isSticky
              ? 'NOTAS FLOTANTES'
              : isTranslator
              ? 'TRADUCTOR RÁPIDO'
              : isClock
              ? 'RELOJ MUNDIAL'
              : isEmojis
              ? 'BUSCADOR DE EMOJIS'
              : isTimer
              ? 'TEMPORIZADOR & CRONO'
              : isQr
              ? 'GENERADOR QR'
              : isMessaging
              ? 'MENSAJERÍA EN VIVO'
              : isSpotify
              ? 'REPRODUCTOR SPOTIFY'
              : isClipboard
              ? 'PORTAPAPELES'
              : isFile
              ? 'QUICK LOOK + OCR'
              : isCalculator
              ? 'CALCULADORA & DIVISAS'
              : result.category.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onTogglePin(result.title)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isPinned ? 'text-sky-400 bg-sky-500/15' : 'text-neutral-400 hover:text-white hover:bg-white/10'
            }`}
            title={isPinned ? 'Desfijar' : 'Fijar'}
          >
            <Pin className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onToggleFavorite(cleanAppId)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isFav ? 'text-amber-400 bg-amber-500/15' : 'text-neutral-400 hover:text-white hover:bg-white/10'
            }`}
            title={isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          >
            <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
          </button>

          <button
            onClick={onOpenActions}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Más acciones (⌘K)"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Cerrar Inspector (Tab)"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Inspector Body */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 scrollbar-thin">
        {/* ============================================================
            F7: BUSCADOR DE PELÍCULAS, SERIES Y DÓNDE VERLAS
        ============================================================ */}
        {isMovies ? (
          <div className="space-y-3 animate-spring-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <IosAppIcon appId="movies" size={40} />
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">Películas, Series y Streaming</h4>
                  <p className="text-[11px] text-neutral-400">Puntaje IMDb, sinopsis y en qué plataforma verlas</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-[10px] font-mono text-rose-300 font-semibold">
                IMDb + JustWatch
              </span>
            </div>

            {/* Search & Filter Row */}
            <div className="flex items-center gap-1.5">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={movieSearch}
                  onChange={e => setMovieSearch(e.target.value)}
                  placeholder="Buscar película, serie o plataforma (ej: Netflix, Max, Darín)..."
                  className="w-full bg-black/40 border border-white/10 focus:border-rose-400 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 outline-none"
                />
              </div>
              {(['all', 'Película', 'Serie'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setMovieTypeFilter(type)}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold cursor-pointer transition-colors ${
                    movieTypeFilter === type
                      ? 'bg-rose-500 text-white'
                      : 'bg-white/5 text-neutral-400 hover:text-white border border-white/10'
                  }`}
                >
                  {type === 'all' ? 'Todo' : type}
                </button>
              ))}
            </div>

            {/* Horizontal Catalog Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {filteredMovies.map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedMovieId(item.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border ${
                    activeMovie.id === item.id
                      ? 'bg-rose-500/20 border-rose-400 text-white shadow-xs'
                      : 'bg-black/30 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.type === 'Película' ? <Film className="w-3 h-3 text-rose-400" /> : <Tv className="w-3 h-3 text-sky-400" />}
                  <span>{item.title}</span>
                  <span className="text-[10px] font-mono text-amber-400">★{item.imdb}</span>
                </button>
              ))}
            </div>

            {/* Active Movie / Series Detail Card */}
            {activeMovie && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-black/65 via-black/50 to-rose-950/25 border border-white/15 space-y-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-16 h-22 rounded-xl bg-gradient-to-br ${activeMovie.posterGradient} border border-white/20 flex flex-col items-center justify-center p-2 text-center shrink-0 shadow-lg`}
                  >
                    <Film className="w-5 h-5 text-white/80 mb-1" />
                    <span className="text-[9px] font-black uppercase tracking-tighter text-white leading-tight line-clamp-2">
                      {activeMovie.title}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="text-sm font-bold text-white truncate">{activeMovie.title}</h5>
                      <span className="px-2 py-0.5 rounded-lg bg-amber-400/20 border border-amber-400/40 text-amber-300 font-mono font-bold text-xs shrink-0">
                        ★ {activeMovie.imdb}
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-300 font-medium">
                      {activeMovie.year} • {activeMovie.type} • {activeMovie.duration}
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono">
                      {activeMovie.genre} • Dir: {activeMovie.director}
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed pt-1 line-clamp-3">
                      {activeMovie.synopsis}
                    </p>
                  </div>
                </div>

                {/* Streaming Platforms */}
                <div className="pt-2 border-t border-white/10 space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                    Disponible ahora en streaming:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeMovie.platforms.map(plat => (
                      <button
                        key={plat.name}
                        onClick={() =>
                          onCopyText?.(`${activeMovie.title} (${activeMovie.year}) disponible en ${plat.name} [${plat.badge}]`)
                        }
                        style={{
                          backgroundColor: `${plat.color}28`,
                          borderColor: `${plat.color}70`,
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold text-white hover:scale-103 active:scale-97 transition-transform cursor-pointer"
                      >
                        <span>▶ {plat.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/50 text-neutral-200">
                          {plat.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : isSticky ? (
          /* ============================================================
              F2: NOTAS FLOTANTES RÁPIDAS (STICKY NOTES)
          ============================================================ */
          <div className="space-y-3 animate-spring-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <IosAppIcon appId="sticky" size={40} />
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">Notas Flotantes (Post-it)</h4>
                  <p className="text-[11px] text-neutral-400">Desacoplá notas adhesivas siempre visibles en pantalla</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-[10px] font-mono text-amber-300 font-semibold">
                {(config.floatingNotes || []).length} activas
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/45 border border-amber-400/30 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={stickyTitle}
                  onChange={e => setStickyTitle(e.target.value)}
                  placeholder="Título de la nota..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-bold text-white outline-none focus:border-amber-400"
                />
                {/* Color Picker */}
                <div className="flex items-center gap-1">
                  {(
                    [
                      { id: 'amber', hex: '#f59e0b' },
                      { id: 'sky', hex: '#38bdf8' },
                      { id: 'emerald', hex: '#34d399' },
                      { id: 'rose', hex: '#fb7185' },
                      { id: 'purple', hex: '#c084fc' },
                    ] as const
                  ).map(c => (
                    <button
                      key={c.id}
                      onClick={() => setStickyColor(c.id)}
                      style={{ backgroundColor: c.hex }}
                      className={`w-5 h-5 rounded-full cursor-pointer transition-transform ${
                        stickyColor === c.id ? 'scale-120 ring-2 ring-white' : 'opacity-65 hover:opacity-100'
                      }`}
                      title={`Color ${c.id}`}
                    />
                  ))}
                </div>
              </div>

              <textarea
                rows={3}
                value={stickyContent}
                onChange={e => setStickyContent(e.target.value)}
                placeholder="Escribí un recordatorio, teléfono o tarea para dejar flotando..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-amber-400 resize-none"
              />

              <button
                onClick={handleCreateFloatingSticky}
                className="w-full py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 active:scale-98"
              >
                <StickyNote className="w-3.5 h-3.5" />
                <span>Desacoplar Nota Flotante en Pantalla 📌</span>
              </button>
            </div>

            {/* Active Floating Notes List */}
            {(config.floatingNotes || []).length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono uppercase text-neutral-400 px-1">
                  Notas flotando actualmente (podés arrastrarlas):
                </div>
                {(config.floatingNotes || []).map(note => (
                  <div
                    key={note.id}
                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs"
                  >
                    <div className="truncate pr-2">
                      <span className="font-bold text-amber-300">{note.title}: </span>
                      <span className="text-neutral-300">{note.content}</span>
                    </div>
                    <button
                      onClick={() => {
                        if (!onUpdateConfig) return;
                        onUpdateConfig({
                          ...config,
                          floatingNotes: (config.floatingNotes || []).filter(n => n.id !== note.id),
                        });
                      }}
                      className="text-neutral-400 hover:text-rose-400 p-1 cursor-pointer shrink-0"
                      title="Cerrar nota flotante"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : isTranslator ? (
          <div className="space-y-3 animate-spring-in">
            <div className="flex items-center gap-2.5">
              <IosAppIcon appId="translator" size={40} />
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">Traductor Instantáneo</h4>
                <p className="text-[11px] text-neutral-400">Traducción local con pronunciación en voz</p>
              </div>
            </div>

            {/* Language Switcher Bar */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/10 text-xs">
              <div className="flex items-center gap-1 font-semibold text-sky-300">
                <span>{transSourceLang === 'es' ? 'Español' : 'English'}</span>
              </div>
              <button
                onClick={() => {
                  const temp = transSourceLang;
                  setTransSourceLang(transTargetLang);
                  setTransTargetLang(temp);
                }}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                title="Intercambiar idiomas"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-sky-400" />
              </button>
              <div className="flex items-center gap-1 font-semibold text-sky-300">
                <span>{transTargetLang === 'en' ? 'Inglés' : transTargetLang === 'fr' ? 'Francés' : 'Portugués'}</span>
              </div>
            </div>

            {/* Input Box */}
            <div className="p-3 rounded-2xl bg-black/45 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                <span>Texto original:</span>
                <button
                  onClick={() => handleSpeakTranslation(transInputText, transSourceLang)}
                  className="hover:text-sky-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>Escuchar</span>
                </button>
              </div>
              <textarea
                value={transInputText}
                onChange={e => setTransInputText(e.target.value)}
                rows={2}
                placeholder="Escribe el texto a traducir..."
                className="w-full bg-transparent text-xs text-white placeholder-neutral-500 outline-none resize-none font-sans"
              />
            </div>

            {/* Translation Output Box */}
            <div className="p-3 rounded-2xl bg-sky-950/30 border border-sky-500/30 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-sky-400">
                <span>Traducción en {transTargetLang.toUpperCase()}:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSpeakTranslation(getTranslatedText(), transTargetLang)}
                    className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Pronunciar</span>
                  </button>
                  <button
                    onClick={() => handleCopyClip('trans', getTranslatedText())}
                    className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copiar</span>
                  </button>
                </div>
              </div>
              <div className="text-sm font-semibold text-sky-100 leading-relaxed">
                {getTranslatedText()}
              </div>
            </div>

            {/* Quick preset chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              {['Hola, ¿cómo estás?', 'Muchas gracias', 'Buenos días', '¿Dónde está el baño?'].map(phrase => (
                <button
                  key={phrase}
                  onClick={() => setTransInputText(phrase)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-neutral-300 transition-colors cursor-pointer shrink-0"
                >
                  {phrase}
                </button>
              ))}
            </div>
          </div>
        ) : isClock ? (
          /* ============================================================
              2. RAYCAST TOOL: WORLD CLOCK & TIMEZONES (RELOJ MUNDIAL)
          ============================================================ */
          <div className="space-y-3 animate-spring-in">
            <div className="flex items-center gap-2.5">
              <IosAppIcon appId="clock" size={40} />
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">Reloj Mundial</h4>
                <p className="text-[11px] text-neutral-400">Zonas horarias y diferencia con tu hora local</p>
              </div>
            </div>

            {/* City Selector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              {WORLD_CITIES.map(city => (
                <button
                  key={city.id}
                  onClick={() => setSelectedCityId(city.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 shrink-0 ${
                    selectedCityId === city.id
                      ? 'bg-orange-500 text-neutral-950 font-bold shadow-xs'
                      : 'bg-white/10 text-neutral-300 hover:bg-white/15'
                  }`}
                >
                  <span>{city.name}</span>
                  <span className="text-[10px] font-mono opacity-80">{city.diff}</span>
                </button>
              ))}
            </div>

            {/* Active City Clock Display */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-black/60 to-orange-950/20 border border-orange-500/30 flex flex-col items-center justify-center text-center space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-orange-400 font-mono font-semibold uppercase">
                {activeCity.isDay ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                <span>{activeCity.name}, {activeCity.country}</span>
                <span>• {activeCity.diff}</span>
              </div>

              {/* Digital Clock with Seconds */}
              <div className="text-3xl font-mono font-black text-white tracking-wider">
                {cityFormattedTime}
              </div>

              <div className="text-xs text-neutral-300 capitalize">
                {cityFormattedDate}
              </div>

              <button
                onClick={() => handleCopyClip('clock', `${activeCity.name}: ${cityFormattedTime}`)}
                className="mt-1 flex items-center gap-1 px-3 py-1 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 text-xs font-semibold cursor-pointer transition-colors"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedId === 'clock' ? '¡Hora copiada!' : 'Copiar hora'}</span>
              </button>
            </div>
          </div>
        ) : isEmojis ? (
          /* ============================================================
              3. RAYCAST TOOL: EMOJI & SYMBOL PICKER (BUSCADOR DE EMOJIS)
          ============================================================ */
          <div className="space-y-3 animate-spring-in">
            <div className="flex items-center gap-2.5">
              <IosAppIcon appId="emojis" size={40} />
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">Buscador de Emojis</h4>
                <p className="text-[11px] text-neutral-400">Toca cualquier emoji para copiarlo al portapapeles</p>
              </div>
            </div>

            {/* Search Input for Emojis */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={emojiSearch}
                onChange={e => setEmojiSearch(e.target.value)}
                placeholder="Filtrar emoji (ej: mate, fuego, corazon, carita)..."
                className="w-full bg-black/40 border border-white/10 focus:border-amber-400 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 outline-none"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'arg', label: '🇦🇷 Argentinas' },
                { id: 'pop', label: '🔥 Populares' },
                { id: 'face', label: '😀 Caritas' },
                { id: 'hand', label: '👍 Gestos' },
                { id: 'obj', label: '💡 Cosas' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveEmojiCat(cat.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer shrink-0 ${
                    activeEmojiCat === cat.id
                      ? 'bg-amber-400 text-neutral-950 font-bold shadow-xs'
                      : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Emoji Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-[220px] overflow-y-auto p-1 scrollbar-thin">
              {EMOJI_ITEMS.filter(e => activeEmojiCat === 'all' || e.cat === activeEmojiCat)
                .filter(
                  e =>
                    !emojiSearch ||
                    e.name.toLowerCase().includes(emojiSearch.toLowerCase()) ||
                    e.tags.toLowerCase().includes(emojiSearch.toLowerCase())
                )
                .map(emoji => (
                  <button
                    key={emoji.name}
                    onClick={() => handleCopyEmoji(emoji.char, emoji.name)}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-black/40 hover:bg-white/15 border border-white/10 transition-all cursor-pointer hover:scale-108 active:scale-95 group"
                    title={`Copiar ${emoji.char} (${emoji.name})`}
                  >
                    <span className="text-2xl leading-none">{emoji.char}</span>
                    <span className="text-[9px] text-neutral-400 truncate max-w-full mt-1 font-sans">
                      {emoji.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
            </div>
            {copiedEmoji && (
              <div className="text-center text-xs font-mono text-amber-300 animate-fade-in">
                ¡Emoji {copiedEmoji} copiado al portapapeles!
              </div>
            )}
          </div>
        ) : isTimer ? (
          /* ============================================================
              4. RAYCAST TOOL: VISUAL TIMER & STOPWATCH
          ============================================================ */
          <div className="space-y-3 animate-spring-in">
            <div className="flex items-center gap-2.5">
              <IosAppIcon appId="timer" size={40} />
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">Temporizador & Alarma</h4>
                <p className="text-[11px] text-neutral-400">Cuenta regresiva visual y cronómetro interactivo</p>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center justify-center p-1 rounded-xl bg-black/40 border border-white/10 max-w-xs mx-auto">
              <button
                onClick={() => {
                  setTimerMode('timer');
                  setIsTimerRunning(false);
                }}
                className={`flex-1 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  timerMode === 'timer' ? 'bg-red-500 text-white font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Temporizador
              </button>
              <button
                onClick={() => {
                  setTimerMode('stopwatch');
                  setIsTimerRunning(false);
                }}
                className={`flex-1 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  timerMode === 'stopwatch' ? 'bg-red-500 text-white font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Cronómetro
              </button>
            </div>

            {/* Visual Ring / Countdown Box */}
            <div className="p-4 rounded-2xl bg-black/45 border border-red-500/30 flex flex-col items-center justify-center space-y-3">
              <div className="text-4xl font-mono font-black text-white tracking-wider">
                {timerMode === 'timer' ? formatSecs(timerSecondsLeft) : formatSecs(stopwatchSeconds)}
              </div>

              {/* Transport Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-xs transition-all cursor-pointer shadow-lg shadow-red-500/20 active:scale-95"
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-white" />
                      <span>Pausar</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Iniciar</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    if (timerMode === 'timer') setTimerSecondsLeft(timerTotalDuration);
                    else setStopwatchSeconds(0);
                  }}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  title="Reiniciar"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Presets for Timer */}
            {timerMode === 'timer' && (
              <div className="flex items-center justify-center gap-2">
                {[
                  { label: '1 min', secs: 60 },
                  { label: '5 min', secs: 300 },
                  { label: '15 min', secs: 900 },
                  { label: '25 min (Pomodoro)', secs: 1500 },
                ].map(p => (
                  <button
                    key={p.label}
                    onClick={() => setTimerPreset(p.secs)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : isQr ? (
          /* ============================================================
              5. RAYCAST TOOL: QUICK QR CODE GENERATOR
          ============================================================ */
          <div className="space-y-3 animate-spring-in">
            <div className="flex items-center gap-2.5">
              <IosAppIcon appId="qr" size={40} />
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">Generador de Códigos QR</h4>
                <p className="text-[11px] text-neutral-400">Escaneable desde cualquier cámara de celular</p>
              </div>
            </div>

            {/* QR Content Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-neutral-400 uppercase">Enlace o texto del QR:</label>
              <input
                type="text"
                value={qrText}
                onChange={e => setQrText(e.target.value)}
                placeholder="https://..."
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-indigo-400 font-mono"
              />
            </div>

            {/* Generated QR Canvas/SVG Visual Mockup */}
            <div className="p-4 rounded-2xl bg-white flex flex-col items-center justify-center max-w-[190px] mx-auto shadow-2xl">
              <svg viewBox="0 0 100 100" className="w-36 h-36 text-neutral-950">
                {/* 3 Corner Anchor Boxes */}
                <rect x="5" y="5" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="6" rx="2" />
                <rect x="12" y="12" width="12" height="12" fill="currentColor" />
                <rect x="69" y="5" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="6" rx="2" />
                <rect x="76" y="12" width="12" height="12" fill="currentColor" />
                <rect x="5" y="69" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="6" rx="2" />
                <rect x="12" y="76" width="12" height="12" fill="currentColor" />
                {/* Matrix Pixel dots */}
                <rect x="38" y="8" width="6" height="6" fill="currentColor" />
                <rect x="48" y="14" width="6" height="6" fill="currentColor" />
                <rect x="58" y="8" width="6" height="6" fill="currentColor" />
                <rect x="38" y="24" width="6" height="6" fill="currentColor" />
                <rect x="48" y="24" width="6" height="6" fill="currentColor" />
                <rect x="8" y="38" width="6" height="6" fill="currentColor" />
                <rect x="18" y="48" width="6" height="6" fill="currentColor" />
                <rect x="28" y="38" width="6" height="6" fill="currentColor" />
                <rect x="38" y="44" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="4" />
                <rect x="46" y="52" width="8" height="8" fill="currentColor" />
                <rect x="68" y="38" width="6" height="6" fill="currentColor" />
                <rect x="78" y="48" width="6" height="6" fill="currentColor" />
                <rect x="88" y="38" width="6" height="6" fill="currentColor" />
                <rect x="38" y="74" width="6" height="6" fill="currentColor" />
                <rect x="48" y="80" width="6" height="6" fill="currentColor" />
                <rect x="58" y="74" width="6" height="6" fill="currentColor" />
                <rect x="74" y="74" width="16" height="16" fill="currentColor" rx="2" />
              </svg>
              <span className="text-[10px] text-neutral-600 font-mono mt-1 font-bold">Spotlight QR Code</span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(qrText);
                  setQrCopied(true);
                  onCopyText?.('Enlace copiado');
                  setTimeout(() => setQrCopied(false), 1500);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold cursor-pointer transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{qrCopied ? '¡Copiado!' : 'Copiar enlace'}</span>
              </button>
            </div>
          </div>
        ) : isSpotify ? (
          /* EXTENSIVE SPOTIFY STUDIO (SP1 + SP3 + SYNTH + LYRICS + EQ + SLEEP) */
          <ExtensiveSpotifyInspector
            deviceState={deviceState}
            brand={brand}
            onUpdateDevice={onUpdateDevice}
            onCopyText={onCopyText}
          />
        ) : isMessaging ? (
          /* EXTENSIVE WHATSAPP & TELEGRAM STUDIO (WA2 + VOICE NOTES + WA.ME + ALIAS) */
          <ExtensiveWhatsAppInspector
            isTelegram={isTelegram}
            brand={brand}
            config={config}
            onCopyText={onCopyText}
          />
        ) : isYouTube ? (
          /* YOUTUBE MINI-PLAYER, VELOCIDAD & SOLO AUDIO (YT1 + YT3) */
          <YouTubeInspectorPanel onCopyText={onCopyText} />
        ) : isGmail ? (
          /* GMAIL FAST INBOX, EXPRESS COMPOSE & 2FA OTP EXTRACTOR (GM1 + GM2) */
          <GmailInspectorPanel onCopyText={onCopyText} />
        ) : isMaps ? (
          /* GOOGLE MAPS NEARBY PLACES FINDER (MAP2) */
          <MapsInspectorPanel onCopyText={onCopyText} />
        ) : isFinanzas ? (
          /* FINANZAS, MI ALIAS/QR, DIVISOR DE ASADO & CUOTAS (FIN1 + FIN2) */
          <FinanzasInspectorPanel
            config={config}
            onUpdateConfig={onUpdateConfig}
            onCopyText={onCopyText}
          />
        ) : isCamera ? (
          /* CÁMARA, ESPEJO RÁPIDO & ESCÁNER QR (CAM1) */
          <CameraInspectorPanel onCopyText={onCopyText} />
        ) : isControl ? (
          /* CENTRO DE CONTROL DEL SISTEMA (SYS1) */
          <ControlCenterInspectorPanel
            deviceState={deviceState}
            onUpdateDevice={onUpdateDevice}
            onCopyText={onCopyText}
          />
        ) : isClipboard ? (
          /* CLIPBOARD MANAGER */
          <div className="space-y-3 animate-spring-in">
            <div className="flex items-center gap-2.5">
              <IosAppIcon appId="clipboard" size={40} />
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">Historial de Portapapeles</h4>
                <p className="text-[11px] text-neutral-400">{config.clips.length} elementos guardados</p>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'pinned', label: 'Fijados 📌' },
                { id: 'secrets', label: 'Claves 🔒' },
                { id: 'code', label: 'Código </>' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setClipFilter(tab.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer shrink-0 ${
                    clipFilter === tab.id
                      ? 'bg-violet-500 text-white font-bold shadow-xs'
                      : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Add New Clip */}
            <div className="flex gap-1.5">
              <input
                type="text"
                value={newClipText}
                onChange={e => setNewClipText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleAddClip();
                }}
                placeholder="Guardar texto en portapapeles..."
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-violet-400"
              />
              <button
                onClick={handleAddClip}
                className="px-2.5 py-1.5 rounded-xl bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 border border-violet-500/30 text-xs font-semibold cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Guardar</span>
              </button>
            </div>

            {/* Clips List */}
            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-0.5 scrollbar-thin">
              {config.clips
                .filter(c => {
                  if (clipFilter === 'pinned') return c.isPinned;
                  if (clipFilter === 'secrets') return isSecretClip(c.text);
                  if (clipFilter === 'code') return isCodeClip(c.text);
                  return true;
                })
                .map(clip => {
                  const secret = isSecretClip(clip.text);
                  const isRevealed = !!revealedSecrets[clip.id];
                  const isCopied = copiedId === clip.id;

                  return (
                    <div
                      key={clip.id}
                      className="p-2.5 rounded-xl bg-black/40 border border-white/10 hover:border-violet-500/40 transition-all space-y-2"
                    >
                      <div className="p-2 rounded-lg bg-black/60 border border-white/5 font-mono text-xs text-emerald-300 break-all whitespace-pre-wrap">
                        {secret && !isRevealed ? maskSecret(clip.text) : clip.text}
                      </div>

                      <div className="flex items-center justify-between pt-0.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopyClip(clip.id, clip.text)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 text-violet-200 border border-violet-500/30 text-[11px] font-semibold cursor-pointer transition-colors"
                          >
                            {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{isCopied ? '¡Copiado!' : 'Copiar'}</span>
                          </button>
                          {secret && (
                            <button
                              onClick={() => setRevealedSecrets(prev => ({ ...prev, [clip.id]: !prev[clip.id] }))}
                              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 text-[11px] cursor-pointer"
                            >
                              {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              <span>{isRevealed ? 'Ocultar' : 'Mostrar'}</span>
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggleClipPin(clip.id)}
                            className={`p-1 rounded-lg cursor-pointer transition-colors ${
                              clip.isPinned ? 'text-amber-400 bg-amber-500/15' : 'text-neutral-500 hover:text-white'
                            }`}
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClip(clip.id)}
                            className="p-1 rounded-lg text-neutral-500 hover:text-rose-400 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ) : isFile ? (
          /* QUICK LOOK + OCR */
          <div className="space-y-3 animate-spring-in">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              {QUICK_LOOK_FILES.map((f, i) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setSelectedFileIdx(i);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer shrink-0 ${
                    selectedFileIdx === i
                      ? 'bg-sky-500 text-neutral-950 font-bold shadow-xs'
                      : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl bg-black/55 border border-sky-500/25 min-h-[165px] flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                  <span className="font-bold text-sky-300">{activePageObj.heading}</span>
                  <button
                    onClick={() => setOcrMode(!ocrMode)}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 hover:bg-white/20 text-neutral-300 cursor-pointer"
                  >
                    {ocrMode ? 'Modo Normal' : 'Modo OCR'}
                  </button>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap">
                  {activePageObj.content}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-[11px] font-mono text-neutral-400">
                  Pág. {currentPage} / {activeFile.pages.length}
                </span>
                <button
                  onClick={() => handleCopyClip('ocr', `${activePageObj.heading}\n${activePageObj.content}`)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 text-[11px] font-semibold cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copiar OCR</span>
                </button>
              </div>
            </div>
          </div>
        ) : isCalculator ? (
          /* CALCULATOR & CURRENCY */
          <div className="space-y-3 animate-spring-in">
            <div className="flex items-center gap-2.5">
              <IosAppIcon appId="calc" size={40} />
              <div>
                <h4 className="text-sm font-bold text-white">Calculadora y Divisas</h4>
                <p className="text-[11px] text-neutral-400">Evaluación en tiempo real</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-black/45 border border-amber-500/30 space-y-2">
              <input
                type="text"
                value={calcExpr}
                onChange={e => setCalcExpr(e.target.value)}
                placeholder="25% de 84000..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono text-white outline-none focus:border-amber-400"
              />
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-neutral-400">Resultado:</span>
                <button
                  onClick={() => liveCalcValue && handleCopyClip('calc', liveCalcValue)}
                  className="text-lg font-black font-mono text-amber-400 hover:underline cursor-pointer flex items-center gap-1.5"
                >
                  <span>{liveCalcValue ?? '—'}</span>
                  <Copy className="w-3.5 h-3.5 opacity-70" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 pt-1 text-center font-mono text-xs">
              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <div className="text-[10px] text-neutral-400">100 USD en ARS</div>
                <div className="font-bold text-white">$118.000</div>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <div className="text-[10px] text-neutral-400">100 USD en EUR</div>
                <div className="font-bold text-white">€92.00</div>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <div className="text-[10px] text-neutral-400">100 USD en BRL</div>
                <div className="font-bold text-white">R$575.00</div>
              </div>
            </div>
          </div>
        ) : (
          /* STANDARD APP INSPECTOR WITH DYNAMIC BRAND ACCENT */
          <div className="space-y-4 animate-spring-in">
            <div className="flex items-center gap-3">
              <IosAppIcon appId={result.id} size={48} />
              <div className="min-w-0">
                <h4 className="text-base font-bold text-white tracking-tight">{result.title}</h4>
                <p className="text-xs text-neutral-400">{result.subtitle}</p>
              </div>
            </div>

            <button
              onClick={onExecutePrimary}
              style={{
                backgroundColor: brand.primaryColor,
                boxShadow: `0 8px 24px -4px ${brand.glowColor}`,
              }}
              className="w-full py-2.5 rounded-2xl text-neutral-950 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Abrir {result.title}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <div className="rounded-xl border border-white/10 bg-black/25 divide-y divide-white/5 overflow-hidden">
              <button
                onClick={onOpenActions}
                className="w-full flex items-center justify-between p-3 text-xs text-neutral-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer text-left"
              >
                <span>Ver todas las acciones de {result.title} (⌘K)</span>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </button>

              <button
                onClick={() => onQuickQuery(`buscar en ${result.title}`)}
                className="w-full flex items-center justify-between p-3 text-xs text-neutral-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer text-left"
              >
                <span>Búsqueda directa en {result.title}</span>
                <Search className="w-3.5 h-3.5 text-neutral-500" />
              </button>

              <button
                onClick={() => onToggleFavorite(cleanAppId)}
                className="w-full flex items-center justify-between p-3 text-xs text-neutral-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-2">
                  <span>{isFav ? 'En tus aplicaciones favoritas' : 'Añadir a favoritos'}</span>
                  {isFav && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Inspector Footer */}
      <div className="px-4 py-2 bg-black/40 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-500">
        <span>{isMobilePhone ? '← Deslizá a la derecha para volver' : `Herramienta: ${result.title}`}</span>
        <span style={{ color: brand.primaryColor }}>Aura: {brand.primaryColor}</span>
      </div>
    </aside>
  );
};
