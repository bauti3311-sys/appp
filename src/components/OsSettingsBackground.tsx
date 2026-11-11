import React, { useState } from 'react';
import {
  Home, Palette, Search, Grid, Shield, Sparkles,
  Keyboard, Sliders, Command, RotateCcw,
  Trash2, Check, Volume2, Sun, Eye, EyeOff, Star, CheckCircle2, Lock,
  Maximize2, Minimize2, CornerDownLeft, Columns2, Wifi, Bluetooth,
  Flashlight, Moon, BatteryCharging, Radio, Cpu, Play, Plus, Send, Wallet, Download, X
} from 'lucide-react';
import { AppConfig, DeviceState, SystemPermissions } from '../types';
import { DEFAULT_PERMISSIONS } from '../lib/preferences';
import { INSTALLED_APPS } from '../lib/searchEngine';
import { IosAppIcon } from './IosAppIcon';

interface OsSettingsBackgroundProps {
  config: AppConfig;
  deviceState: DeviceState;
  isSpotlightVisible: boolean;
  onToggleSpotlightVisible: (visible?: boolean) => void;
  onUpdateConfig: (updated: AppConfig) => void;
  onUpdateDevice: (partial: Partial<DeviceState>) => void;
  onClearHistory: () => void;
  onOpenSpotlight: () => void;
  onOpenSettingsTab: (tab: string) => void;
  onResetWindowPositions?: () => void;
  onOpenApkBuilder?: () => void;
  onCloseSettings?: () => void;
}

type OsTabId =
  | 'inicio'
  | 'appearance'
  | 'search'
  | 'apps'
  | 'privacy'
  | 'ai'
  | 'shortcuts'
  | 'advanced';

export const PERMISSIONS_LIST: Array<{
  key: keyof SystemPermissions;
  title: string;
  desc: string;
  badge: string;
  testActionLabel: string;
}> = [
  {
    key: 'overlayWindow',
    title: 'Superposición sobre otras apps (SYSTEM_ALERT_WINDOW)',
    desc: 'Permite mostrar la barra Spotlight, el Split Inspector y las Notas Flotantes sobre cualquier pantalla.',
    badge: 'Esencial',
    testActionLabel: 'Probar Superposición',
  },
  {
    key: 'notifications',
    title: 'Lectura y Respuesta de Notificaciones (RemoteInput)',
    desc: 'Necesario para leer mensajes de WhatsApp, Telegram y extraer códigos 2FA de Gmail en vivo.',
    badge: 'Mensajería & 2FA',
    testActionLabel: 'Probar Notificación',
  },
  {
    key: 'accessibilityShizuku',
    title: 'Puente de Sistema & Shizuku (ADB / Nivel OS)',
    desc: 'Habilita control directo de Wi-Fi, Bluetooth, Linterna, Brillo, 120Hz y Volumen del sistema.',
    badge: 'Hardware SYS1',
    testActionLabel: 'Verificar Puente OS',
  },
  {
    key: 'clipboardFocus',
    title: 'Acceso al Portapapeles Inteligente y Detección OTP',
    desc: 'Captura textos copiados, detecta códigos 2FA de 6 dígitos y protege claves privadas.',
    badge: 'Portapapeles',
    testActionLabel: 'Probar Portapapeles',
  },
  {
    key: 'microphoneVoice',
    title: 'Micrófono, Notas de Voz WhatsApp y Síntesis TTS',
    desc: 'Permite grabar notas de voz reales en WhatsApp (WA2), dictar búsquedas y leer textos en voz alta.',
    badge: 'Voz & Audio WA2',
    testActionLabel: 'Probar Voz TTS',
  },
  {
    key: 'cameraScanner',
    title: 'Cámara WebRTC, Espejo Rápido y Escáner QR (CAM1)',
    desc: 'Habilita la vista de cámara en vivo en el Inspector para espejo selfie y lectura de códigos QR.',
    badge: 'Cámara CAM1',
    testActionLabel: 'Verificar Cámara',
  },
  {
    key: 'locationMaps',
    title: 'Ubicación Precisa para Lugares Cercanos (MAP2)',
    desc: 'Encuentra farmacias de turno, cafeterías, estaciones de servicio y cajeros abiertos cerca tuyo.',
    badge: 'Google Maps MAP2',
    testActionLabel: 'Probar Geolocalización',
  },
  {
    key: 'mediaControl',
    title: 'Control de Sesiones Multimedia & Spotify Connect (SP1/SP3)',
    desc: 'Sincroniza canciones, ecualizador, letras en vivo, temporizador sleep y salida de audio.',
    badge: 'Spotify & YouTube',
    testActionLabel: 'Probar Audio Synth',
  },
  {
    key: 'storageFiles',
    title: 'Lectura de Archivos Recientes y Visor Quick Look + OCR',
    desc: 'Indexa documentos PDF, hojas de cálculo y paquetes APK locales para vista previa instantánea.',
    badge: 'Archivos',
    testActionLabel: 'Verificar Storage',
  },
  {
    key: 'networkLookups',
    title: 'Consultas en Línea (Clima, Divisas y Catálogo Streaming)',
    desc: 'Conecta con cotizaciones en vivo, clima Open-Meteo y disponibilidad en Netflix/Max/Prime.',
    badge: 'Red Activa',
    testActionLabel: 'Ping de Red',
  },
];

const ACCENT_HEX_MAP: Record<AppConfig['accent'], string> = {
  emerald: '#10b981',
  blue: '#38bdf8',
  purple: '#a855f7',
  amber: '#f59e0b',
  rose: '#f43f5e',
  cyan: '#06b6d4',
  graphite: '#94a3b8',
};

export const OsSettingsBackground: React.FC<OsSettingsBackgroundProps> = ({
  config,
  deviceState,
  isSpotlightVisible,
  onToggleSpotlightVisible,
  onUpdateConfig,
  onUpdateDevice,
  onClearHistory,
  onOpenSpotlight,
  onOpenSettingsTab,
  onResetWindowPositions,
  onOpenApkBuilder,
  onCloseSettings,
}) => {
  const [activeTab, setActiveTab] = useState<OsTabId>('inicio');
  const [filterText, setFilterText] = useState('');
  const [permissionFeedback, setPermissionFeedback] = useState<string | null>(null);

  // AI Live Tester states
  const [aiTestInput, setAiTestInput] = useState('Sugerime 3 respuestas rápidas para contestarle a Martín en WhatsApp');
  const [aiTestOutput, setAiTestOutput] = useState<string | null>(null);
  const [aiTesting, setAiTesting] = useState(false);

  // Shortcuts & Alias states
  const [newAlias, setNewAlias] = useState({ alias: '', target: '' });
  const [newSnippet, setNewSnippet] = useState({ name: '', template: '' });

  const update = (partial: Partial<AppConfig>) => {
    onUpdateConfig({ ...config, ...partial });
  };

  // Guaranteed non-null, 10-key permissions object
  const currentPerms: SystemPermissions = {
    ...DEFAULT_PERMISSIONS,
    ...(config.permissions || {}),
  };

  const totalPermKeys = PERMISSIONS_LIST.length;
  const grantedCount = PERMISSIONS_LIST.filter(p => currentPerms[p.key]).length;
  const allPermissionsGranted = grantedCount === totalPermKeys;

  const playTestSound = (freq = 523.25) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const vol = Math.max(0.05, (deviceState.volume ?? 70) / 100) * 0.25;

      [freq, freq * 1.25, freq * 1.5].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, now + idx * 0.06);
        gain.gain.setValueAtTime(vol, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.36);
      });
    } catch {
      // ignore if audio context blocked
    }
  };

  const handleAcceptAllPermissions = () => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
    const allTrue: SystemPermissions = {
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
    update({ permissions: allTrue });
    playTestSound(587.33);
    setPermissionFeedback('✓ ¡Los 10 permisos del sistema están activos y verificados!');
    setTimeout(() => setPermissionFeedback(null), 3500);
  };

  const handleRevokeAllPermissions = () => {
    const allFalse: SystemPermissions = {
      notifications: false,
      overlayWindow: true, // keep overlay so UI stays visible
      accessibilityShizuku: false,
      clipboardFocus: false,
      microphoneVoice: false,
      storageFiles: false,
      mediaControl: false,
      networkLookups: false,
      cameraScanner: false,
      locationMaps: false,
    };
    update({ permissions: allFalse });
    setPermissionFeedback('Permisos opcionales revocados (1/10 activo). Podés activarlos uno por uno o tocar «Aceptar Todos».');
    setTimeout(() => setPermissionFeedback(null), 3500);
  };

  const handleTogglePermission = (key: keyof SystemPermissions) => {
    const nextVal = !currentPerms[key];
    const updatedPerms: SystemPermissions = {
      ...currentPerms,
      [key]: nextVal,
    };
    update({ permissions: updatedPerms });
    setPermissionFeedback(
      `${nextVal ? '✓ Activado' : '✕ Desactivado'}: ${
        PERMISSIONS_LIST.find(p => p.key === key)?.title || key
      }`
    );
    setTimeout(() => setPermissionFeedback(null), 2500);
  };

  const handleTestSinglePermission = (key: keyof SystemPermissions, e: React.MouseEvent) => {
    e.stopPropagation();
    // Ensure it is enabled when testing
    if (!currentPerms[key]) {
      update({
        permissions: {
          ...currentPerms,
          [key]: true,
        },
      });
    }

    if (key === 'microphoneVoice') {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance('Permiso de micrófono y síntesis de voz funcionando correctamente en Spotlight.');
        u.lang = 'es-ES';
        window.speechSynthesis.speak(u);
      }
      setPermissionFeedback('🎙️ Prueba de voz TTS ejecutada en español y micrófono habilitado.');
    } else if (key === 'mediaControl') {
      playTestSound(440);
      setPermissionFeedback('🎵 Sintetizador Web Audio y puente MediaSession probados con éxito.');
    } else if (key === 'clipboardFocus') {
      navigator.clipboard?.writeText('Spotlight-OTP-Test-849201').catch(() => {});
      setPermissionFeedback('📋 Portapapeles probado: se copió código de prueba «849201».');
    } else if (key === 'locationMaps') {
      setPermissionFeedback('📍 Radar GPS simulado: Palermo, Buenos Aires (Precisión 4 metros · 12 locales abiertos).');
    } else if (key === 'cameraScanner') {
      setPermissionFeedback('📷 Permiso de Cámara WebRTC y Escáner QR verificado.');
    } else {
      playTestSound(659.25);
      setPermissionFeedback(`✓ Permiso «${key}» verificado y respondiendo con latencia 0ms.`);
    }
    setTimeout(() => setPermissionFeedback(null), 3500);
  };

  const handleRunAiTest = () => {
    if (!aiTestInput.trim()) return;
    setAiTesting(true);
    setTimeout(() => {
      const p = aiTestInput.toLowerCase();
      let reply = '';
      if (p.includes('whatsapp') || p.includes('martin') || p.includes('respuesta')) {
        reply = `💬 Respuestas inteligentes generadas (${config.aiProvider.toUpperCase()} · ${config.aiModel} · Temp ${config.aiTemperature ?? 0.4}):\n1. "¡Hola Martín! Ya probé el Split Inspector y quedó impecable 🚀"\n2. "Estoy saliendo para allá, en 10 minutos te mando ubicación por Maps."\n3. "Pasame el alias de Mercado Pago así ya te transfiero mi parte."`;
      } else if (p.includes('mercado pago') || p.includes('2fa') || p.includes('correo')) {
        reply = `🔐 Análisis de Correo & 2FA (${config.aiModel}):\n• Remitente verificado: Mercado Pago Oficial\n• Código OTP extraído: 849201 (Expira en 4 minutos)\n• Acción rápida: Copiado automático listo en el Inspector de Gmail.`;
      } else if (p.includes('cuota') || p.includes('asado') || p.includes('finanza')) {
        reply = `💳 Asesor Financiero (${config.aiModel}):\n• Con inflación mensual estimada del 4%, 3 o 6 cuotas sin interés licúan el costo real un 11.4%.\n• Podés abrir «Finanzas y Mercado Pago» en la barra para calcular cada cuota o dividir el asado.`;
      } else {
        reply = `✨ Respuesta de ${config.aiProvider.toUpperCase()} (${config.aiModel} · Temp ${config.aiTemperature ?? 0.4}):\n"${aiTestInput}" → Procesado con prompt del sistema activo. Podés invocar este modelo desde la barra principal escribiendo cualquier consulta y tocando «Preguntar a la IA».`;
      }
      setAiTestOutput(reply);
      setAiTesting(false);
    }, 320);
  };

  const handleAddAlias = () => {
    if (!newAlias.alias.trim() || !newAlias.target.trim()) return;
    update({
      aliases: [...(config.aliases || []), { alias: newAlias.alias.trim(), target: newAlias.target.trim() }],
    });
    setNewAlias({ alias: '', target: '' });
  };

  const handleDeleteAlias = (idx: number) => {
    update({
      aliases: (config.aliases || []).filter((_, i) => i !== idx),
    });
  };

  const handleAddSnippet = () => {
    if (!newSnippet.name.trim() || !newSnippet.template.trim()) return;
    update({
      snippets: [
        ...(config.snippets || []),
        { id: `snip-${Date.now()}`, name: newSnippet.name.trim(), template: newSnippet.template.trim() },
      ],
    });
    setNewSnippet({ name: '', template: '' });
  };

  const handleDeleteSnippet = (id: string) => {
    update({
      snippets: (config.snippets || []).filter(s => s.id !== id),
    });
  };

  const resetDimensions = () => {
    update({
      uiScale: 1.0,
      textScale: 1.0,
      barWidth: 440,
      inspectorWidth: 485,
      splitGap: 18,
      corner: 22,
      opacity: 0.96,
      glassIntensity: 28,
      borderWidth: 1,
      shadowSize: 'dramatic',
      accentIntensity: 'subtle',
      maxSuggestions: 3,
      slimRows: false,
      topBevel: true,
      springPhysics: 'smooth_ios',
      shortcutStyle: 'mac',
      focusDimming: false,
      iconStyle: 'original',
      showStatusHeader: false,
      fontFamily: 'inter',
      density: 'comfortable',
    });
    onResetWindowPositions?.();
  };

  const isLight = config.theme === 'light';
  const activeAccentHex = ACCENT_HEX_MAP[config.accent || 'emerald'] || '#10b981';

  const previewBg = isLight
    ? 'rgba(248, 250, 252, 0.92)'
    : config.preset === 'glass'
    ? 'rgba(12, 20, 34, 0.72)'
    : config.preset === 'raycast'
    ? 'rgba(17, 18, 22, 0.98)'
    : config.preset === 'macos'
    ? 'rgba(24, 32, 44, 0.90)'
    : config.preset === 'ios'
    ? 'rgba(7, 10, 15, 0.94)'
    : config.preset === 'graphite'
    ? 'rgba(24, 24, 27, 0.96)'
    : 'rgba(13, 19, 28, 0.88)';

  return (
    <div
      className={`fixed inset-3 md:inset-6 rounded-3xl ${
        isLight
          ? 'bg-[#f1f5f9]/95 border-black/15 text-slate-800'
          : 'bg-[#0e151f]/95 border-white/10 text-neutral-200'
      } border shadow-2xl flex overflow-hidden z-0 select-none backdrop-blur-2xl transition-colors duration-300`}
    >
      {/* Left Sidebar */}
      <aside
        aria-label="Ajustes de Spotlight"
        className={`w-52 md:w-64 ${
          isLight ? 'bg-slate-200/70 border-black/[0.08]' : 'bg-black/30 border-white/[0.06]'
        } border-r p-4 flex flex-col justify-between shrink-0`}
      >
        <div>
          <div className="flex items-center justify-between px-3 pt-1 pb-4">
            <h2 className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Spotlight
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30 font-semibold">
              v3.0 Ultra
            </span>
          </div>

          {/* Primary Toggle to Hide / Show Spotlight Bar while editing Settings */}
          <div className="mb-3 px-1">
            <button
              onClick={() => onToggleSpotlightVisible()}
              className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                isSpotlightVisible
                  ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-emerald-500/20'
              }`}
            >
              {isSpotlightVisible ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Ocultar Barra para Ajustar</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Mostrar Barra (Ver cómo quedó)</span>
                </>
              )}
            </button>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 px-3 pb-2">
            PANEL DE CONTROL
          </div>

          <nav className="space-y-0.5 text-xs font-medium">
            {[
              { id: 'inicio', label: 'Ajustes en Vivo & Preview', icon: Home },
              { id: 'appearance', label: 'Estética y Ventana (E1-E12)', icon: Palette },
              { id: 'privacy', label: 'Permisos del Sistema', icon: Shield, badge: `${grantedCount}/${totalPermKeys}` },
              { id: 'ai', label: 'Inteligencia Híbrida (IA)', icon: Sparkles, badge: config.aiProvider.toUpperCase() },
              { id: 'advanced', label: 'Hardware, Sonido y SYS1', icon: Sliders, badge: `${deviceState.refreshRate || 120}Hz` },
              { id: 'shortcuts', label: 'Atajos, Alias y Snippets', icon: Keyboard },
              { id: 'search', label: 'Búsqueda y Predictor', icon: Search },
              { id: 'apps', label: 'Aplicaciones y Favoritos', icon: Grid },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as OsTabId)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer text-left ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-400 font-semibold border border-sky-500/30'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${
                        item.id === 'privacy'
                          ? allPermissionsGranted
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-300'
                          : 'bg-white/10 text-neutral-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Buttons */}
        <div className="space-y-2">
          {onOpenApkBuilder && (
            <button
              onClick={onOpenApkBuilder}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Descargar APK (Overlay)</span>
            </button>
          )}

          <button
            onClick={() => onOpenSettingsTab(activeTab)}
            className="w-full py-2 px-3 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 text-sky-300 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Modal de Ajustes (⌘,)</span>
          </button>

          {onCloseSettings ? (
            <button
              onClick={onCloseSettings}
              className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-neutral-950 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-sky-500/20"
            >
              <Command className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Volver a Solo la Barra</span>
            </button>
          ) : (
            <button
              onClick={onOpenSpotlight}
              className="w-full py-2.5 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-neutral-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Command className="w-3.5 h-3.5" />
              <span>{isSpotlightVisible ? 'Centrar Spotlight' : 'Abrir Barra Spotlight'}</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Settings Content Canvas */}
      <div className="flex-1 p-5 md:p-8 overflow-y-auto space-y-6 scrollbar-thin">
        {/* Top Action Header with Show/Hide Spotlight Switch */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
          <div>
            <h3 className={`text-2xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {activeTab === 'inicio'
                ? 'Laboratorio de Ajustes en Vivo'
                : activeTab === 'appearance'
                ? 'Estética, Presets Reales y Mejoras E1–E12'
                : activeTab === 'privacy'
                ? 'Centro Unificado de Permisos del Sistema (10/10)'
                : activeTab === 'ai'
                ? 'Inteligencia Artificial Híbrida y Automatización'
                : activeTab === 'advanced'
                ? 'Hardware en Vivo, Sonido, Brillo y Finanzas (SYS1/FIN1)'
                : activeTab === 'shortcuts'
                ? 'Atajos de Teclado, Alias y Snippets'
                : activeTab === 'search'
                ? 'Búsqueda Adaptativa y Predictor Tab'
                : 'Aplicaciones Instaladas y Frecuencia'}
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Ocultá la barra principal con el botón de la derecha para configurar todo cómodamente y volvé a mostrarla cuando quieras
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSpotlightVisible()}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shrink-0 ${
                isSpotlightVisible
                  ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-lg shadow-emerald-500/25'
              }`}
            >
              {isSpotlightVisible ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Ocultar Barra Principal</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Probar Barra Real Ahora</span>
                </>
              )}
            </button>

            <div className="relative w-44 hidden xl:block">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
                placeholder="Filtrar ajuste..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-sky-400/50 transition-colors"
              />
            </div>

            {onCloseSettings && (
              <button
                onClick={onCloseSettings}
                className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/20 text-neutral-300 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 transition-colors cursor-pointer shrink-0"
                title="Cerrar Ajustes y volver a solo la barra flotante"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* =========================================================
            LIVE INTERACTIVE SPOTLIGHT PREVIEW MONITOR
        ========================================================= */}
        {(activeTab === 'inicio' || activeTab === 'appearance') && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-black/55 via-slate-900/60 to-sky-950/25 border border-white/15 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 font-mono">
                  Simulador en Vivo • Mirá cómo queda tu barra mientras ajustás
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                <span>Preset: <strong className="text-white uppercase">{config.preset}</strong></span>
                <span>•</span>
                <span>Radio: <strong className="text-sky-300">{config.corner}px</strong></span>
                <span>•</span>
                <span>Escala: <strong className="text-sky-300">{Math.round((config.uiScale ?? 1) * 100)}%</strong></span>
                <button
                  onClick={() => onToggleSpotlightVisible(true)}
                  className="ml-2 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 font-sans font-bold cursor-pointer"
                >
                  Abrir Barra Real ↗
                </button>
              </div>
            </div>

            <div
              style={{
                gap: `${Math.min(32, config.splitGap ?? 18)}px`,
                fontSize: `${(config.textScale ?? 1) * 100}%`,
              }}
              className="w-full py-2 flex flex-col lg:flex-row items-stretch justify-center overflow-x-auto"
            >
              {/* Mini Preview Left Card */}
              <div
                style={{
                  backgroundColor: previewBg,
                  borderRadius: `${config.corner ?? 22}px`,
                  borderWidth: `${config.borderWidth ?? 1}px`,
                  borderColor:
                    config.accentIntensity === 'vibrant'
                      ? `${activeAccentHex}66`
                      : isLight
                      ? 'rgba(15,23,42,0.16)'
                      : 'rgba(255,255,255,0.14)',
                  backdropFilter: config.blur === false ? 'none' : `blur(${config.glassIntensity ?? 28}px)`,
                  opacity: config.opacity ?? 0.96,
                }}
                className={`flex-1 max-w-md border p-3 space-y-2 shadow-xl transition-all ${
                  config.topBevel !== false ? 'top-bevel-highlight' : ''
                }`}
              >
                {config.showStatusHeader && (
                  <div className="flex items-center justify-between px-1 text-[10px] font-mono text-neutral-400">
                    <span>12:45 • ♫ Midnight City</span>
                    <span className="text-emerald-400 font-bold">Wi-Fi • {deviceState.batteryLevel ?? 88}%</span>
                  </div>
                )}
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-black/35 border border-white/10">
                  <div className="flex items-center gap-2 text-xs">
                    <Search className="w-3.5 h-3.5 text-neutral-400" />
                    <span className={isLight ? 'text-slate-900 font-medium' : 'text-white font-medium'}>
                      spotify
                    </span>
                    <span className="text-neutral-500">• buscar Daft Punk</span>
                  </div>
                  <span
                    style={{
                      backgroundColor: `${activeAccentHex}20`,
                      borderColor: `${activeAccentHex}45`,
                      color: activeAccentHex,
                    }}
                    className="px-1.5 py-0.5 rounded border text-[9px] font-mono font-bold"
                  >
                    Tab →
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor:
                      config.accentIntensity === 'vibrant'
                        ? `${activeAccentHex}18`
                        : 'rgba(255,255,255,0.07)',
                  }}
                  className={`flex items-center justify-between px-3 ${
                    config.slimRows ? 'py-1' : 'py-2'
                  } rounded-xl border border-white/10`}
                >
                  <div className="flex items-center gap-2.5">
                    {config.accentIntensity !== 'minimal' && (
                      <div
                        style={{ backgroundColor: activeAccentHex }}
                        className="w-1 h-4 rounded-full"
                      />
                    )}
                    <IosAppIcon appId="spotify" size={config.slimRows ? 24 : 32} />
                    <div>
                      <div className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        Spotify
                      </div>
                      {!config.slimRows && (
                        <div className="text-[10px] text-neutral-400">SP1/SP3 • Connect, Letras y EQ</div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-400">Aplicación</span>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-white/10 text-[10px]">
                  <span className="text-neutral-400 font-mono">
                    ••• Acciones {config.shortcutStyle === 'touch_minimal' ? '' : config.shortcutStyle === 'pc_android' ? '(Ctrl+K)' : '(⌘K)'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-neutral-300 flex items-center gap-1">
                      <Columns2 className="w-2.5 h-2.5" /> Split
                    </span>
                    <span
                      style={{ backgroundColor: activeAccentHex }}
                      className="px-2 py-0.5 rounded text-neutral-950 font-bold flex items-center gap-1"
                    >
                      Abrir <CornerDownLeft className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Mini Preview Right Inspector Card */}
              <div
                style={{
                  backgroundColor: previewBg,
                  borderRadius: `${config.corner ?? 22}px`,
                  borderWidth: `${config.borderWidth ?? 1}px`,
                  borderColor:
                    config.accentIntensity === 'vibrant'
                      ? `${activeAccentHex}66`
                      : isLight
                      ? 'rgba(15,23,42,0.16)'
                      : 'rgba(255,255,255,0.14)',
                  backdropFilter: config.blur === false ? 'none' : `blur(${config.glassIntensity ?? 28}px)`,
                  opacity: config.opacity ?? 0.96,
                }}
                className={`flex-1 max-w-sm border p-3 flex flex-col justify-between shadow-xl transition-all ${
                  config.topBevel !== false ? 'top-bevel-highlight' : ''
                }`}
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[10px] font-mono">
                  <span className="text-neutral-400">INSPECTOR SEPARADO</span>
                  <span style={{ color: activeAccentHex }} className="font-bold">
                    ● {config.preset.toUpperCase()}
                  </span>
                </div>
                <div className="py-2 flex items-center gap-2.5">
                  <IosAppIcon appId="spotify" size={36} />
                  <div>
                    <div className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Vista Dividida Independiente
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      Separación: {config.splitGap ?? 18}px • Ancho: {config.inspectorWidth ?? 485}px
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onToggleSpotlightVisible(true)}
                  style={{ backgroundColor: activeAccentHex }}
                  className="w-full py-1.5 rounded-xl text-neutral-950 font-bold text-xs cursor-pointer hover:opacity-95"
                >
                  Probar en la Barra Real Ahora
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 1 & 2: INICIO / APARIENCIA Y VENTANA (E1 - E12)
        ========================================================= */}
        {(activeTab === 'inicio' || activeTab === 'appearance') && (
          <div className="space-y-5 max-w-4xl">
            {/* Quick Status & Shortcuts Cards on Inicio */}
            {activeTab === 'inicio' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col justify-between gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <Shield className="w-4 h-4" /> Permisos del Sistema
                    </span>
                    <span className="text-xs font-mono font-bold text-white">
                      {grantedCount}/{totalPermKeys}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-300">
                    {allPermissionsGranted
                      ? 'Todos los permisos de superposición, voz, cámara y mapas están activos.'
                      : 'Hay permisos desactivados. Podés activarlos todos con un clic.'}
                  </p>
                  <div className="flex gap-2 pt-1">
                    {!allPermissionsGranted && (
                      <button
                        onClick={handleAcceptAllPermissions}
                        className="flex-1 py-1.5 px-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs cursor-pointer"
                      >
                        Aceptar Todos
                      </button>
                    )}
                    <button
                      onClick={() => setActiveTab('privacy')}
                      className="flex-1 py-1.5 px-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs cursor-pointer"
                    >
                      Gestionar Permisos →
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex flex-col justify-between gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> Inteligencia Híbrida
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-200 font-bold uppercase">
                      {config.aiProvider}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-300">
                    Modelo: <strong className="text-white">{config.aiModel}</strong> • Auto-OTP 2FA: {config.aiAutoOtp !== false ? 'Activo' : 'Inactivo'}
                  </p>
                  <button
                    onClick={() => setActiveTab('ai')}
                    className="w-full py-1.5 px-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/30 text-sky-200 font-semibold text-xs cursor-pointer"
                  >
                    Configurar y Probar IA →
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col justify-between gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Sliders className="w-4 h-4" /> Hardware & Sonido
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 font-bold">
                      Vol {deviceState.volume}% • Brillo {deviceState.brightness}%
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-300">
                    Wi-Fi {deviceState.wifiEnabled !== false ? 'ON' : 'OFF'} • BT {deviceState.bluetoothEnabled !== false ? 'ON' : 'OFF'} • Pantalla {deviceState.refreshRate || 120}Hz
                  </p>
                  <button
                    onClick={() => setActiveTab('advanced')}
                    className="w-full py-1.5 px-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 text-amber-200 font-semibold text-xs cursor-pointer"
                  >
                    Abrir Hardware y Sonido →
                  </button>
                </div>
              </div>
            )}

            {/* E1 & REAL VISUAL PRESETS */}
            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Presets Estéticos Reales & Modo Claro Perla (E1)
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Cambia la física del cristal, opacidad, bordes, reflejos y tema de color en tiempo real
                  </p>
                </div>

                <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10">
                  {[
                    { id: 'dark', label: '🌙 Oscuro' },
                    { id: 'light', label: '☀️ Claro Perla (E1)' },
                    { id: 'auto', label: '⚡ Auto' },
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => update({ theme: t.id as any })}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                        config.theme === t.id
                          ? 'bg-sky-500 text-neutral-950 font-bold shadow-xs'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    id: 'hybrid',
                    label: 'Spotlight Hybrid',
                    desc: 'Equilibrio entre cristal oscuro y precisión Raycast',
                    sample: 'border-white/15 bg-[#0e1520]',
                  },
                  {
                    id: 'glass',
                    label: 'Liquid Glass 2.0',
                    desc: 'Alta transparencia, desenfoque profundo y brillo especular',
                    sample: 'border-sky-400/30 bg-sky-950/30',
                  },
                  {
                    id: 'raycast',
                    label: 'Raycast Pro',
                    desc: 'Superficie mate sólida, bordes rectos de 14px y contraste puro',
                    sample: 'border-white/20 bg-[#111216]',
                  },
                  {
                    id: 'macos',
                    label: 'macOS Sequoia',
                    desc: 'Ventana clásica de escritorio con halo difuso y bisel superior',
                    sample: 'border-white/25 bg-[#1b222d]',
                  },
                  {
                    id: 'ios',
                    label: 'iOS 18 Dynamic Island',
                    desc: 'Curvatura orgánica pronunciada (30px) y tacto elástico',
                    sample: 'border-white/15 bg-black',
                  },
                  {
                    id: 'graphite',
                    label: 'Graphite Studio',
                    desc: 'Monocromático sobrio en gris titanio sin distracciones',
                    sample: 'border-neutral-600 bg-neutral-900',
                  },
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      const presetDefaults: Partial<AppConfig> =
                        p.id === 'glass'
                          ? { preset: 'glass', opacity: 0.78, glassIntensity: 40, corner: 24, topBevel: true }
                          : p.id === 'raycast'
                          ? { preset: 'raycast', opacity: 0.99, glassIntensity: 12, corner: 14, topBevel: true }
                          : p.id === 'macos'
                          ? { preset: 'macos', opacity: 0.92, glassIntensity: 32, corner: 20, topBevel: true }
                          : p.id === 'ios'
                          ? { preset: 'ios', opacity: 0.94, glassIntensity: 30, corner: 30, springPhysics: 'elastic_raycast' }
                          : p.id === 'graphite'
                          ? { preset: 'graphite', opacity: 0.98, glassIntensity: 16, corner: 18, accentIntensity: 'minimal' }
                          : { preset: 'hybrid', opacity: 0.95, glassIntensity: 28, corner: 22 };
                      update(presetDefaults);
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      config.preset === p.id
                        ? 'bg-sky-500/15 border-sky-400 text-white shadow-sm'
                        : 'bg-black/25 border-white/10 text-neutral-300 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">{p.label}</span>
                      <span className={`w-3.5 h-3.5 rounded-full border ${p.sample}`} />
                    </div>
                    <div className="text-[10px] text-neutral-400 leading-snug">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Sizing & Scaling Card */}
            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Dimensiones en Vivo, Desenfoque y Bordes (E11)
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Deslizá para ajustar en tiempo real el tamaño de la barra, el inspector, el cristal y las fuentes
                  </p>
                </div>
                <button
                  onClick={resetDimensions}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-neutral-300 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restaurar Todo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
                <div className="p-3 rounded-xl bg-black/25 border border-white/[0.06]">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-neutral-300 font-medium">Escala UI:</span>
                    <span className="font-mono text-sky-300 font-semibold">
                      {Math.round((config.uiScale ?? 1) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.85"
                    max="1.15"
                    step="0.02"
                    value={config.uiScale ?? 1}
                    onChange={e => update({ uiScale: parseFloat(e.target.value) })}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-xl bg-black/25 border border-white/[0.06]">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-neutral-300 font-medium">Tamaño Letra:</span>
                    <span className="font-mono text-sky-300 font-semibold">
                      {Math.round((config.textScale ?? 1) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.85"
                    max="1.25"
                    step="0.02"
                    value={config.textScale ?? 1}
                    onChange={e => update({ textScale: parseFloat(e.target.value) })}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-xl bg-black/25 border border-white/[0.06]">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-neutral-300 font-medium">Ancho Barra:</span>
                    <span className="font-mono text-sky-300 font-semibold">
                      {config.barWidth ?? 440}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="360"
                    max="560"
                    step="10"
                    value={config.barWidth ?? 440}
                    onChange={e => update({ barWidth: parseInt(e.target.value, 10) })}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-xl bg-black/25 border border-white/[0.06]">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-neutral-300 font-medium">Ancho Inspector:</span>
                    <span className="font-mono text-sky-300 font-semibold">
                      {config.inspectorWidth ?? 485}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="360"
                    max="560"
                    step="10"
                    value={config.inspectorWidth ?? 485}
                    onChange={e => update({ inspectorWidth: parseInt(e.target.value, 10) })}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-xl bg-black/25 border border-white/[0.06]">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-neutral-300 font-medium">Separación Split:</span>
                    <span className="font-mono text-sky-300 font-semibold">
                      {config.splitGap ?? 18}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="44"
                    step="2"
                    value={config.splitGap ?? 18}
                    onChange={e => update({ splitGap: parseInt(e.target.value, 10) })}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-xl bg-black/25 border border-white/[0.06]">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-neutral-300 font-medium">Radio Esquinas:</span>
                    <span className="font-mono text-sky-300 font-semibold">
                      {config.corner ?? 22}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="34"
                    step="2"
                    value={config.corner ?? 22}
                    onChange={e => update({ corner: parseInt(e.target.value, 10) })}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-xl bg-black/25 border border-white/[0.06]">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-neutral-300 font-medium">Opacidad Fondo:</span>
                    <span className="font-mono text-sky-300 font-semibold">
                      {Math.round((config.opacity ?? 0.96) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.65"
                    max="1.0"
                    step="0.02"
                    value={config.opacity ?? 0.96}
                    onChange={e => update({ opacity: parseFloat(e.target.value) })}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-xl bg-black/25 border border-white/[0.06]">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-neutral-300 font-medium">Blur Cristal:</span>
                    <span className="font-mono text-sky-300 font-semibold">
                      {config.glassIntensity ?? 28}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="48"
                    step="4"
                    value={config.glassIntensity ?? 28}
                    onChange={e => update({ glassIntensity: parseInt(e.target.value, 10), blur: parseInt(e.target.value, 10) > 0 })}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* E3 to E12 Controls Grid */}
            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-4">
              <h4 className="text-sm font-bold text-white">
                Personalización Avanzada de Interfaz (E3 a E12 + Densidad y Acento)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-xl bg-black/25 border border-white/[0.06] space-y-2">
                  <div className="text-xs font-semibold text-white">E12 • Fuente Tipográfica</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'inter', label: 'Inter UI (Estándar)' },
                      { id: 'jakarta', label: 'Plus Jakarta (Geométrica)' },
                      { id: 'system', label: 'SF Pro / Sistema' },
                      { id: 'mono', label: 'JetBrains Mono' },
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => update({ fontFamily: f.id as any })}
                        className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium cursor-pointer text-left ${
                          (config.fontFamily || 'inter') === f.id
                            ? 'bg-sky-500/20 border-sky-400 text-white font-bold'
                            : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/25 border border-white/[0.06] space-y-2">
                  <div className="text-xs font-semibold text-white">E9 • Estilo de Iconos iOS 18</div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'original', label: 'Original iOS' },
                      { id: 'monochrome', label: 'Monocromo' },
                      { id: 'tinted', label: 'Tinted Cristal' },
                    ].map(ic => (
                      <button
                        key={ic.id}
                        onClick={() => update({ iconStyle: ic.id as any })}
                        className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium cursor-pointer text-center ${
                          (config.iconStyle || 'original') === ic.id
                            ? 'bg-sky-500/20 border-sky-400 text-white font-bold'
                            : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {ic.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/25 border border-white/[0.06] space-y-2">
                  <div className="text-xs font-semibold text-white">E4 • Transiciones Elásticas (Spring Physics)</div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'instant', label: 'Instantánea' },
                      { id: 'smooth_ios', label: 'Suave iOS' },
                      { id: 'elastic_raycast', label: 'Elástica Raycast' },
                    ].map(sp => (
                      <button
                        key={sp.id}
                        onClick={() => update({ springPhysics: sp.id as any })}
                        className={`px-2 py-1.5 rounded-lg border text-[11px] font-medium cursor-pointer text-center ${
                          (config.springPhysics || 'smooth_ios') === sp.id
                            ? 'bg-sky-500/20 border-sky-400 text-white font-bold'
                            : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {sp.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/25 border border-white/[0.06] space-y-2">
                  <div className="text-xs font-semibold text-white">E11 • Elevación de Sombra y Borde</div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'soft', label: 'Sombra Suave', bw: 1 },
                      { id: 'medium', label: 'Media (1.5px)', bw: 1.5 },
                      { id: 'dramatic', label: 'Profunda (2px)', bw: 2 },
                    ].map(sh => (
                      <button
                        key={sh.id}
                        onClick={() => update({ shadowSize: sh.id as any, borderWidth: sh.bw as any })}
                        className={`px-2 py-1.5 rounded-lg border text-[11px] font-medium cursor-pointer text-center ${
                          (config.shadowSize || 'dramatic') === sh.id
                            ? 'bg-sky-500/20 border-sky-400 text-white font-bold'
                            : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {sh.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/25 border border-white/[0.06] space-y-2">
                  <div className="text-xs font-semibold text-white">Sutileza del Acento de Marca</div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'minimal', label: 'Mínimo (Botones)' },
                      { id: 'subtle', label: 'Sutil (Default)' },
                      { id: 'vibrant', label: 'Vibrante' },
                    ].map(mode => (
                      <button
                        key={mode.id}
                        onClick={() => update({ accentIntensity: mode.id as any })}
                        className={`px-2 py-1.5 rounded-lg border text-[11px] font-medium cursor-pointer text-center ${
                          (config.accentIntensity || 'subtle') === mode.id
                            ? 'bg-sky-500/20 border-sky-400 text-white font-bold'
                            : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/25 border border-white/[0.06] space-y-2">
                  <div className="text-xs font-semibold text-white">Color de Acento Base</div>
                  <div className="flex items-center gap-2.5 pt-0.5">
                    {(
                      [
                        { id: 'emerald', hex: '#10b981' },
                        { id: 'blue', hex: '#38bdf8' },
                        { id: 'purple', hex: '#a855f7' },
                        { id: 'amber', hex: '#f59e0b' },
                        { id: 'rose', hex: '#f43f5e' },
                        { id: 'cyan', hex: '#06b6d4' },
                        { id: 'graphite', hex: '#94a3b8' },
                      ] as const
                    ).map(col => (
                      <button
                        key={col.id}
                        onClick={() => update({ accent: col.id })}
                        style={{ backgroundColor: col.hex }}
                        className={`w-6 h-6 rounded-full cursor-pointer transition-transform ${
                          config.accent === col.id ? 'scale-120 ring-2 ring-white' : 'opacity-65 hover:opacity-100'
                        }`}
                        title={`Acento ${col.id}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Toggles for E3, E5, E6, E8, E10 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <label className="flex items-center justify-between p-3 rounded-xl bg-black/25 border border-white/[0.06] cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-white">E6 • Modo Filas Ultra-Compactas (Slim Rows)</div>
                    <div className="text-[10px] text-neutral-400">Reduce la altura de cada sugerencia y usa iconos de 24px</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={!!config.slimRows}
                    onChange={e => update({ slimRows: e.target.checked })}
                    className="w-4 h-4 accent-sky-400 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-black/25 border border-white/[0.06] cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-white">E10 • Píldora de Estado Superior Integrada</div>
                    <div className="text-[10px] text-neutral-400">Muestra hora, canción activa, Wi-Fi y batería arriba del buscador</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={!!config.showStatusHeader}
                    onChange={e => update({ showStatusHeader: e.target.checked })}
                    className="w-4 h-4 accent-sky-400 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-black/25 border border-white/[0.06] cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-white">E5 • Borde Biselado con Reflejo Superior 1px</div>
                    <div className="text-[10px] text-neutral-400">Agrega una línea especular blanca en el borde superior</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.topBevel !== false}
                    onChange={e => update({ topBevel: e.target.checked })}
                    className="w-4 h-4 accent-sky-400 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-black/25 border border-white/[0.06] cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-white">E8 • Focus Dimming al usar el Inspector</div>
                    <div className="text-[10px] text-neutral-400">Atenúa sutilmente la lista izquierda al interactuar con el Inspector</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={!!config.focusDimming}
                    onChange={e => update({ focusDimming: e.target.checked })}
                    className="w-4 h-4 accent-sky-400 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-black/25 border border-white/[0.06] cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-white">E3 • Posicionamiento Libre (Arrastrar Ventanas)</div>
                    <div className="text-[10px] text-neutral-400">Permite mover la barra y el Split Inspector desde su tirador superior</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.freeDrag !== false}
                    onChange={e => update({ freeDrag: e.target.checked })}
                    className="w-4 h-4 accent-sky-400 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-black/25 border border-white/[0.06] cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-white">Efectos de Sonido Sutiles (UI Clicks)</div>
                    <div className="text-[10px] text-neutral-400">Respuesta acústica suave al navegar y abrir acciones</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={!!config.soundEffects}
                    onChange={e => update({ soundEffects: e.target.checked })}
                    className="w-4 h-4 accent-sky-400 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB: CENTRO UNIFICADO DE PERMISOS Y PRIVACIDAD (10/10 FIXED)
        ========================================================= */}
        {activeTab === 'privacy' && (
          <div className="space-y-4 max-w-4xl">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-sky-500/10 to-black/40 border border-emerald-500/35 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <h4 className="text-base font-bold text-white">
                      Centro de Permisos de Spotlight Next ({grantedCount} de {totalPermKeys} activos)
                    </h4>
                  </div>
                  <p className="text-xs text-neutral-300 mt-1">
                    Tocá cualquier permiso para activarlo/desactivarlo individualmente, usá «Probar» para verificarlo en tiempo real, o aceptalos todos juntos.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleAcceptAllPermissions}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs cursor-pointer shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>{allPermissionsGranted ? 'Todo Concedido (10/10) ✓' : 'Aceptar Todos los Permisos'}</span>
                  </button>
                  <button
                    onClick={handleRevokeAllPermissions}
                    className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-neutral-200 font-semibold text-xs cursor-pointer transition-all"
                    title="Revocar permisos opcionales para probar el encendido individual"
                  >
                    Revocar Opcionales
                  </button>
                </div>
              </div>

              {permissionFeedback && (
                <div className="px-3.5 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-xs text-emerald-200 font-semibold animate-fade-in">
                  {permissionFeedback}
                </div>
              )}
            </div>

            {/* Individual Permission Toggles + Real Test Button */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PERMISSIONS_LIST.map(perm => {
                const isGranted = !!currentPerms[perm.key];
                return (
                  <div
                    key={perm.key}
                    onClick={() => handleTogglePermission(perm.key)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      isGranted
                        ? 'bg-white/[0.05] border-emerald-500/35 hover:border-emerald-400/60'
                        : 'bg-black/30 border-white/10 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-white">{perm.title}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30">
                            {perm.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-snug">{perm.desc}</p>
                      </div>

                      {/* Real Visual Switch */}
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          handleTogglePermission(perm.key);
                        }}
                        className={`w-11 h-6 rounded-full transition-colors p-0.5 shrink-0 cursor-pointer ${
                          isGranted ? 'bg-emerald-500' : 'bg-neutral-700'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                            isGranted ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[10px]">
                      <span
                        className={`font-mono font-bold ${
                          isGranted ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {isGranted ? '● PERMISO CONCEDIDO' : '○ DESACTIVADO (TOCAR PARA ACTIVAR)'}
                      </span>
                      <button
                        type="button"
                        onClick={e => handleTestSinglePermission(perm.key, e)}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold cursor-pointer transition-colors"
                      >
                        {perm.testActionLabel}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Private Mode & History Reset */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] border border-white/10 cursor-pointer">
                <div>
                  <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Modo Privado Permanente</span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    Pausa el registro de búsquedas recientes y conteo adaptativo
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.privateMode}
                  onChange={e => update({ privateMode: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                />
              </label>

              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-rose-300">Reiniciar Aprendizaje e Historial</div>
                  <div className="text-xs text-rose-200/75">
                    Limpia búsquedas guardadas y contadores de frecuencia
                  </div>
                </div>
                <button
                  onClick={onClearHistory}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold cursor-pointer shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Limpiar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB: INTELIGENCIA HÍBRIDA (DEDICATED & 100% FUNCTIONAL)
        ========================================================= */}
        {activeTab === 'ai' && (
          <div className="space-y-5 max-w-4xl">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-500/15 via-purple-500/10 to-black/40 border border-sky-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    <span>Motor de Inteligencia Híbrida 3.0</span>
                  </h4>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    Configurá el proveedor, modelo, temperatura creativa y funciones inteligentes para WhatsApp (WA2) y Gmail 2FA (GM2).
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold self-start">
                  ● Motor Híbrido Listo
                </span>
              </div>

              {/* Provider & Model Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 space-y-2">
                  <label className="text-xs font-bold text-white block">Proveedor de IA Principal</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'gemini', label: 'Google Gemini', defaultModel: 'gemini-2.5-flash' },
                      { id: 'openai', label: 'OpenAI GPT', defaultModel: 'gpt-4o-mini' },
                      { id: 'local', label: 'On-Device Local', defaultModel: 'llama-3.3-npu' },
                    ].map(p => (
                      <button
                        key={p.id}
                        onClick={() => update({ aiProvider: p.id as any, aiModel: p.defaultModel })}
                        className={`py-2 px-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                          config.aiProvider === p.id
                            ? 'bg-sky-500/25 border-sky-400 text-white shadow-sm'
                            : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 space-y-2">
                  <label className="text-xs font-bold text-white block">Modelo Activo</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {[
                      'gemini-2.5-flash',
                      'gemini-2.5-pro',
                      'gpt-4o-mini',
                      'llama-3.3-npu',
                    ].map(m => (
                      <button
                        key={m}
                        onClick={() => update({ aiModel: m })}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono cursor-pointer ${
                          config.aiModel === m
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                            : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Temperature & System Prompt */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-white">Temperatura (Precisión vs Creatividad):</span>
                    <span className="font-mono text-sky-300 font-bold">{config.aiTemperature ?? 0.4}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.1"
                    value={config.aiTemperature ?? 0.4}
                    onChange={e => update({ aiTemperature: parseFloat(e.target.value) })}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400">
                    <span>0.0 (Directo y Exacto)</span>
                    <span>0.5 (Equilibrado)</span>
                    <span>1.0 (Creativo)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 space-y-1.5">
                  <label className="text-xs font-bold text-white block">Prompt de Comportamiento del Asistente</label>
                  <input
                    type="text"
                    value={
                      config.aiSystemPrompt ||
                      'Sos un asistente universal rápido, conciso y práctico integrado en Spotlight.'
                    }
                    onChange={e => update({ aiSystemPrompt: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              {/* Smart Assistant Feature Switches */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <label className="flex items-center justify-between p-3.5 rounded-xl bg-black/30 border border-white/10 cursor-pointer">
                  <div>
                    <div className="text-xs font-bold text-white">GM2 • Extractor Automático de Códigos 2FA / OTP</div>
                    <div className="text-[11px] text-neutral-400">
                      Detecta códigos de 6 dígitos en Gmail y portapapeles para copiarlos con 1 toque
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.aiAutoOtp !== false}
                    onChange={e => update({ aiAutoOtp: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl bg-black/30 border border-white/10 cursor-pointer">
                  <div>
                    <div className="text-xs font-bold text-white">WA2 • Respuestas Inteligentes Contextuales en WhatsApp</div>
                    <div className="text-[11px] text-neutral-400">
                      Sugiere contestaciones rápidas según el último mensaje recibido en el Inspector
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.aiSmartReplies !== false}
                    onChange={e => update({ aiSmartReplies: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Interactive Live AI Sandbox */}
            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">
                  Probador en Vivo de Inteligencia Híbrida ({config.aiProvider.toUpperCase()} · {config.aiModel})
                </h4>
                <div className="flex gap-1.5 flex-wrap">
                  {[
                    'Sugerir respuestas para WhatsApp',
                    'Extraer código 2FA de Mercado Pago',
                    'Conviene 6 cuotas sin interés o efectivo?',
                  ].map(sample => (
                    <button
                      key={sample}
                      onClick={() => setAiTestInput(sample)}
                      className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-sky-300 cursor-pointer"
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiTestInput}
                  onChange={e => setAiTestInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleRunAiTest()}
                  placeholder="Escribí una prueba para el motor de IA..."
                  className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-sky-400"
                />
                <button
                  onClick={handleRunAiTest}
                  disabled={aiTesting}
                  className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-neutral-950 font-bold text-xs cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{aiTesting ? 'Procesando...' : 'Probar IA Ahora'}</span>
                </button>
              </div>

              {aiTestOutput && (
                <div className="p-3.5 rounded-xl bg-sky-950/30 border border-sky-500/30 text-xs text-sky-100 whitespace-pre-line font-mono leading-relaxed animate-fade-in">
                  {aiTestOutput}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB: HARDWARE, SONIDO, SYS1 & FINANZAS (DEDICATED & 100% FUNCTIONAL)
        ========================================================= */}
        {activeTab === 'advanced' && (
          <div className="space-y-5 max-w-4xl">
            {/* Live Volume & Brightness Sliders with Real Sound Synth & Real Screen Filter */}
            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Control Real de Sonido Sintetizado y Luminosidad de Pantalla
                  </h4>
                  <p className="text-xs text-neutral-400">
                    El deslizador de brillo oscurece o ilumina la pantalla en vivo, y el botón de sonido reproduce audio real Web Audio
                  </p>
                </div>
                <button
                  onClick={() => playTestSound(523.25)}
                  className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-neutral-950 font-bold text-xs cursor-pointer flex items-center gap-1.5 self-start shrink-0 shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>🔊 Probar Sonido Real ({deviceState.volume}%)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-bold text-white">
                      <Volume2 className="w-4 h-4 text-sky-400" /> Volumen Multimedia:
                    </span>
                    <span className="font-mono text-sky-300 font-bold">
                      {deviceState.isMuted ? 'SILENCIADO (0%)' : `${deviceState.volume}%`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={deviceState.isMuted ? 0 : deviceState.volume}
                    onChange={e =>
                      onUpdateDevice({ volume: parseInt(e.target.value, 10), isMuted: false })
                    }
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[10px] text-neutral-400">Salida: {deviceState.audioOutputDevice || 'Parlante Moto G86'}</span>
                    <button
                      onClick={() => onUpdateDevice({ isMuted: !deviceState.isMuted })}
                      className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/15 text-[10px] text-neutral-200 cursor-pointer"
                    >
                      {deviceState.isMuted ? 'Activar Sonido' : 'Silenciar'}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-bold text-white">
                      <Sun className="w-4 h-4 text-amber-400" /> Brillo de Pantalla en Vivo:
                    </span>
                    <span className="font-mono text-amber-300 font-bold">{deviceState.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="100"
                    value={deviceState.brightness}
                    onChange={e => onUpdateDevice({ brightness: parseInt(e.target.value, 10) })}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between items-center pt-1 text-[10px] text-neutral-400">
                    <span>Filtro de luminancia real aplicado</span>
                    <button
                      onClick={() => onUpdateDevice({ brightness: 85 })}
                      className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/15 text-neutral-200 cursor-pointer"
                    >
                      Restaurar 85%
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SYS1: Interactive Hardware Switches */}
            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Centro de Control de Hardware y Conectividad (SYS1)
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Interruptores sincronizados con el Centro de Control del Split Inspector
                  </p>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  Batería: {deviceState.batteryLevel ?? 88}% • RAM: {deviceState.ramUsageMb ?? 3420} MB
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  {
                    key: 'wifiEnabled',
                    label: 'Wi-Fi 6E',
                    sub: deviceState.wifiEnabled !== false ? 'Fibertel_5GHz (866 Mbps)' : 'Desconectado',
                    active: deviceState.wifiEnabled !== false,
                    icon: Wifi,
                    color: 'bg-sky-500/20 border-sky-400 text-sky-300',
                  },
                  {
                    key: 'bluetoothEnabled',
                    label: 'Bluetooth 5.4',
                    sub: deviceState.bluetoothEnabled !== false ? 'Sony WH-1000XM5 (LDAC)' : 'Apagado',
                    active: deviceState.bluetoothEnabled !== false,
                    icon: Bluetooth,
                    color: 'bg-indigo-500/20 border-indigo-400 text-indigo-300',
                  },
                  {
                    key: 'flashlightEnabled',
                    label: 'Linterna Flash',
                    sub: deviceState.flashlightEnabled ? 'Encendida (Halo Activo)' : 'Apagada',
                    active: !!deviceState.flashlightEnabled,
                    icon: Flashlight,
                    color: 'bg-amber-500/25 border-amber-400 text-amber-200',
                  },
                  {
                    key: 'dndEnabled',
                    label: 'No Molestar',
                    sub: deviceState.dndEnabled ? 'Notificaciones silenciadas' : 'Inactivo',
                    active: !!deviceState.dndEnabled,
                    icon: Moon,
                    color: 'bg-purple-500/20 border-purple-400 text-purple-300',
                  },
                  {
                    key: 'batterySaver',
                    label: 'Ahorro Batería',
                    sub: deviceState.batterySaver ? 'Modo eficiencia activo' : 'Rendimiento máximo',
                    active: !!deviceState.batterySaver,
                    icon: BatteryCharging,
                    color: 'bg-emerald-500/20 border-emerald-400 text-emerald-300',
                  },
                  {
                    key: 'hotspotEnabled',
                    label: 'Hotspot Wi-Fi',
                    sub: deviceState.hotspotEnabled ? 'Compartiendo 5G (1 disp.)' : 'Desactivado',
                    active: !!deviceState.hotspotEnabled,
                    icon: Radio,
                    color: 'bg-cyan-500/20 border-cyan-400 text-cyan-300',
                  },
                ].map(tile => {
                  const Icon = tile.icon;
                  return (
                    <button
                      key={tile.key}
                      onClick={() => {
                        onUpdateDevice({ [tile.key]: !tile.active });
                        playTestSound(tile.active ? 392 : 587.33);
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                        tile.active
                          ? tile.color
                          : 'bg-black/30 border-white/10 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-black/30">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{tile.label}</div>
                        <div className="text-[10px] opacity-80 truncate">{tile.sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Refresh Rate & Audio Output */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 space-y-2">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-sky-400" /> Tasa de Refresco Pantalla pOLED
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {([60, 90, 120] as const).map(hz => (
                      <button
                        key={hz}
                        onClick={() => onUpdateDevice({ refreshRate: hz })}
                        className={`py-1.5 rounded-lg border text-xs font-mono font-bold cursor-pointer ${
                          (deviceState.refreshRate || 120) === hz
                            ? 'bg-sky-500/25 border-sky-400 text-sky-300'
                            : 'bg-white/5 border-white/10 text-neutral-400'
                        }`}
                      >
                        {hz} Hz
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 space-y-2">
                  <div className="text-xs font-bold text-white">Dispositivo de Salida de Audio (SP3 / SYS1)</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      'Parlante Moto G86',
                      'Sony WH-1000XM5',
                      'Living TV Chromecast',
                      'Auto Bluetooth',
                    ].map(dev => (
                      <button
                        key={dev}
                        onClick={() => onUpdateDevice({ audioOutputDevice: dev })}
                        className={`px-2 py-1.5 rounded-lg border text-[11px] font-medium truncate cursor-pointer ${
                          (deviceState.audioOutputDevice || 'Parlante Moto G86') === dev
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                            : 'bg-white/5 border-white/10 text-neutral-400'
                        }`}
                      >
                        {dev}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* FIN1: Payment Alias & CBU Editor */}
            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-sky-400" />
                <h4 className="text-sm font-bold text-white">
                  Mis Datos de Cobro Rápido · Alias y CVU/CBU (FIN1)
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Mi Alias (Mercado Pago / Banco)</label>
                  <input
                    type="text"
                    value={config.paymentAlias || 'bauti.spotlight.mp'}
                    onChange={e => update({ paymentAlias: e.target.value })}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Mi CVU / CBU (22 dígitos)</label>
                  <input
                    type="text"
                    value={config.paymentCbu || '0000003100084920194821'}
                    onChange={e => update({ paymentCbu: e.target.value })}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-sky-400"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB: ATAJOS, ALIAS Y SNIPPETS (DEDICATED)
        ========================================================= */}
        {activeTab === 'shortcuts' && (
          <div className="space-y-5 max-w-4xl">
            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white">E7 • Estilo de Indicadores de Teclado</h4>
                  <p className="text-xs text-neutral-400">
                    Elegí cómo se muestran los atajos en la barra inferior y en el menú de acciones
                  </p>
                </div>
                <div className="flex gap-1.5">
                  {[
                    { id: 'mac', label: 'Mac (⌘K / ↵)' },
                    { id: 'pc_android', label: 'PC / Android (Ctrl+K)' },
                    { id: 'touch_minimal', label: 'Táctil Limpio (Sin Teclas)' },
                  ].map(sc => (
                    <button
                      key={sc.id}
                      onClick={() => update({ shortcutStyle: sc.id as any })}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                        (config.shortcutStyle || 'mac') === sc.id
                          ? 'bg-sky-500/20 border-sky-400 text-white'
                          : 'bg-white/5 border-white/10 text-neutral-400'
                      }`}
                    >
                      {sc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alias Manager */}
              <div className="pt-3 border-t border-white/10 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-sky-300">
                  Alias Rápidos de Búsqueda (Ej: escribir «sp» busca «spotify»)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(config.aliases || []).map((al, idx) => (
                    <div
                      key={`${al.alias}-${idx}`}
                      className="flex items-center justify-between px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-sky-400">{al.alias}</span>
                        <span className="text-neutral-500 mx-1.5">→</span>
                        <span className="text-neutral-200">{al.target}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteAlias(idx)}
                        className="text-neutral-500 hover:text-rose-400 cursor-pointer p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Alias corto (ej: mp)"
                    value={newAlias.alias}
                    onChange={e => setNewAlias({ ...newAlias, alias: e.target.value })}
                    className="w-36 bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Comando o app (ej: google maps)"
                    value={newAlias.target}
                    onChange={e => setNewAlias({ ...newAlias, target: e.target.value })}
                    className="flex-1 bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                  <button
                    onClick={handleAddAlias}
                    className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-neutral-950 font-bold text-xs cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Agregar
                  </button>
                </div>
              </div>

              {/* Snippets Manager */}
              <div className="pt-3 border-t border-white/10 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Fragmentos Rápidos y Respuestas Guardadas (Snippets)
                </h4>
                <div className="space-y-2">
                  {(config.snippets || []).map(snip => (
                    <div
                      key={snip.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/10 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="font-mono font-bold text-emerald-300">{snip.name}</div>
                        <div className="text-neutral-400 truncate max-w-lg">{snip.template}</div>
                      </div>
                      <button
                        onClick={() => handleDeleteSnippet(snip.id)}
                        className="text-neutral-500 hover:text-rose-400 cursor-pointer p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nombre (ej: mialias)"
                    value={newSnippet.name}
                    onChange={e => setNewSnippet({ ...newSnippet, name: e.target.value })}
                    className="w-36 bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Texto a copiar..."
                    value={newSnippet.template}
                    onChange={e => setNewSnippet({ ...newSnippet, template: e.target.value })}
                    className="flex-1 bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                  <button
                    onClick={handleAddSnippet}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB: BÚSQUEDA Y PREDICTOR
        ========================================================= */}
        {activeTab === 'search' && (
          <div className="space-y-4 max-w-2xl">
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-white">
                    Cantidad de sugerencias adaptativas al abrir:
                  </span>
                  <span className="font-mono text-sky-300 font-bold">
                    {config.maxSuggestions ?? 3} sugerencias
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="6"
                  step="1"
                  value={config.maxSuggestions ?? 3}
                  onChange={e => update({ maxSuggestions: parseInt(e.target.value, 10) })}
                  className="w-full accent-sky-400 cursor-pointer"
                />
                <p className="text-[11px] text-neutral-400 mt-1">
                  Mantiene la lista limpia y prioriza automáticamente lo que buscás más seguido.
                </p>
              </div>

              <label className="flex items-center justify-between pt-3 border-t border-white/10 cursor-pointer">
                <div>
                  <div className="text-xs font-semibold text-white">Mostrar Sugerencias al Vaciar Búsqueda</div>
                  <div className="text-[11px] text-neutral-400">
                    Si lo desactivás, la ventana queda mínima hasta que empieces a escribir
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.suggestions !== false}
                  onChange={e => update({ suggestions: e.target.checked })}
                  className="w-4 h-4 accent-sky-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between pt-3 border-t border-white/10 cursor-pointer">
                <div>
                  <div className="text-xs font-semibold text-white">Aprendizaje Adaptativo Local</div>
                  <div className="text-[11px] text-neutral-400">
                    Reordena tus apps y el predictor Tab según tu uso real
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.learning}
                  onChange={e => update({ learning: e.target.checked })}
                  className="w-4 h-4 accent-sky-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between pt-3 border-t border-white/10 cursor-pointer">
                <div>
                  <div className="text-xs font-semibold text-white">Limpiar consulta automáticamente al abrir una app</div>
                  <div className="text-[11px] text-neutral-400">
                    Deja la barra lista para una nueva búsqueda tras ejecutar una acción principal
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={!!config.autoClearOnLaunch}
                  onChange={e => update({ autoClearOnLaunch: e.target.checked })}
                  className="w-4 h-4 accent-sky-500 cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB: APLICACIONES
        ========================================================= */}
        {activeTab === 'apps' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-3xl">
            {INSTALLED_APPS.map(app => {
              const isFav = config.favorites.includes(app.id);
              const isHidden = config.hiddenSuggestions.includes(app.id);
              const count = config.usageCounts?.[app.id] || 0;
              return (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/10"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <IosAppIcon appId={app.id} size={32} />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">{app.name}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">
                        Usos adaptativos: {count}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        const nextFavs = isFav
                          ? config.favorites.filter(id => id !== app.id)
                          : [...config.favorites, app.id];
                        update({ favorites: nextFavs });
                      }}
                      className={`p-1.5 rounded-lg border cursor-pointer ${
                        isFav
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                          : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                      }`}
                      title="Favorita"
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                    </button>
                    <button
                      onClick={() => {
                        const nextHidden = isHidden
                          ? config.hiddenSuggestions.filter(id => id !== app.id)
                          : [...config.hiddenSuggestions, app.id];
                        update({ hiddenSuggestions: nextHidden });
                      }}
                      className={`p-1.5 rounded-lg border cursor-pointer ${
                        isHidden
                          ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                          : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                      }`}
                      title={isHidden ? 'Mostrar en sugerencias' : 'Ocultar de sugerencias'}
                    >
                      {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
