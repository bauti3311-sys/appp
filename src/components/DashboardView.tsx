import React, { useState } from 'react';
import { 
  Wifi, Bluetooth, Moon, Zap, Sun, Shield, 
  Copy, Eye, EyeOff, FileText, Smartphone, Check, 
  ArrowRight, HardDrive, RefreshCw, Sparkles 
} from 'lucide-react';
import { DeviceState, AppConfig } from '../types';
import { IconRenderer } from './IconRenderer';
import { IosAppIcon } from './IosAppIcon';

interface DashboardViewProps {
  deviceState: DeviceState;
  config: AppConfig;
  onUpdateDevice: (partial: Partial<DeviceState>) => void;
  onSelectApp: (appId: string) => void;
  onOpenSplitInspector: () => void;
  onOpenQuickLook: (fileName: string) => void;
  onCopyText: (text: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  deviceState,
  config,
  onUpdateDevice,
  onSelectApp,
  onOpenSplitInspector,
  onOpenQuickLook,
  onCopyText,
}) => {
  const [wifiActive, setWifiActive] = useState(true);
  const [bluetoothActive, setBluetoothActive] = useState(true);
  const [dndActive, setDndActive] = useState(false);
  const [hz90Active, setHz90Active] = useState(true);
  const [ramUsed, setRamUsed] = useState(4.6);
  const [isCleaningRam, setIsCleaningRam] = useState(false);
  const [ramCleanedToast, setRamCleanedToast] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  const secretKey = 'sp_live_99f38e77a21bc90a07e14dcf89a12e4b';

  const handleCleanRam = () => {
    setIsCleaningRam(true);
    setTimeout(() => {
      setRamUsed(3.1);
      setIsCleaningRam(false);
      setRamCleanedToast(true);
      setTimeout(() => setRamCleanedToast(false), 2500);
    }, 600);
  };

  const apps = [
    { id: 'spotify', name: 'Spotify', alias: 'sp', icon: 'Music2', desc: 'Reproductor multimedia • Midnight City', color: 'text-emerald-400 bg-emerald-500/20' },
    { id: 'whatsapp', name: 'WhatsApp', alias: 'wa', icon: 'MessageCircle', desc: 'Martín (Equipo Diseño): "¿Confirmam...', color: 'text-emerald-400 bg-emerald-500/20' },
    { id: 'telegram', name: 'Telegram', alias: 'tg', icon: 'Send', desc: 'Mensajería Cloud • 3 mensajes sin leer', color: 'text-sky-400 bg-sky-500/20' },
    { id: 'figma', name: 'Figma', alias: 'fg', icon: 'Figma', desc: 'RaycastOS Design System • Editado hace 12 min', color: 'text-purple-400 bg-purple-500/20' },
    { id: 'ai', name: 'Orquestador IA (Gemini ToolExecutor)', alias: 'ai', icon: 'Sparkles', desc: 'Planes encadenados D27 con confirmación', color: 'text-sky-400 bg-sky-500/20' },
    { id: 'translator', name: 'Traductor Local ML Kit', alias: 'tr', icon: 'Languages', desc: 'Traducción offline EN ↔ ES mediante ML Kit', color: 'text-amber-400 bg-amber-500/20' },
  ];

  const recentFiles = [
    { name: 'spotlight-architecture.pdf', size: '1.8 MB', desc: 'Quick Look Multipágina + Extracción OCR Local', isApk: false },
    { name: 'Spotlight-Next-Preview71-b8f8e26.apk', size: '70.2 MB', desc: '/Download • ARM64 Target SDK 35', isApk: true },
    { name: 'Spotlight-Core-Plugin.apk', size: '14.1 MB', desc: 'Módulo de Indexación Local', isApk: true },
  ];

  return (
    <div className="p-4 space-y-4 max-h-[520px] overflow-y-auto text-xs text-neutral-200 select-none animate-fade-in">
      {/* Top Grid: Apps Grid (Left) + System Control Widget (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Apps & Extensions Grid (Left, col-span-7) */}
        <div className="lg:col-span-7 p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-white uppercase tracking-wider text-xs">
                APLICACIONES Y EXTENSIONES
              </h4>
            </div>
            <span className="text-[10px] text-neutral-500 font-mono">
              Click tipea • 2° click abre Split Inspector
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {apps.map(app => (
              <div
                key={app.id}
                onClick={() => onSelectApp(app.id)}
                onDoubleClick={onOpenSplitInspector}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-all cursor-pointer flex items-center justify-between gap-2.5 active:scale-98"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <IosAppIcon appId={app.id} size={36} />
                  <div className="min-w-0">
                    <div className="font-semibold text-white truncate text-xs">{app.name}</div>
                    <div className="text-[10px] text-neutral-400 truncate">{app.desc}</div>
                  </div>
                </div>

                <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-neutral-400 shrink-0">
                  {app.alias}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
            <span className="text-neutral-500">
              Aliases activos: <strong className="text-neutral-300">sp, wa, tg, fg, tr, pdf, ai</strong>
            </span>

            <button
              onClick={onOpenSplitInspector}
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Abrir en Split Inspector</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Control Tab A9+ Widget (Right, col-span-5) */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-white uppercase tracking-wider text-xs">
                CONTROL TAB A9+
              </h4>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              One UI 6.1
            </span>
          </div>

          {/* Quick Toggle Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setWifiActive(!wifiActive)}
              className={`p-2 rounded-xl border flex items-center gap-2 transition-colors cursor-pointer ${
                wifiActive ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' : 'bg-white/5 border-white/10 text-neutral-400'
              }`}
            >
              <Wifi className="w-4 h-4" />
              <span className="text-xs font-medium">Wi-Fi 6</span>
            </button>

            <button
              onClick={() => setBluetoothActive(!bluetoothActive)}
              className={`p-2 rounded-xl border flex items-center gap-2 transition-colors cursor-pointer ${
                bluetoothActive ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' : 'bg-white/5 border-white/10 text-neutral-400'
              }`}
            >
              <Bluetooth className="w-4 h-4" />
              <span className="text-xs font-medium">Bluetooth</span>
            </button>

            <button
              onClick={() => setDndActive(!dndActive)}
              className={`p-2 rounded-xl border flex items-center gap-2 transition-colors cursor-pointer ${
                dndActive ? 'bg-amber-500/20 border-amber-500/30 text-amber-300' : 'bg-white/5 border-white/10 text-neutral-400'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span className="text-xs font-medium">No Molestar</span>
            </button>

            <button
              onClick={() => setHz90Active(!hz90Active)}
              className={`p-2 rounded-xl border flex items-center gap-2 transition-colors cursor-pointer ${
                hz90Active ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' : 'bg-white/5 border-white/10 text-neutral-400'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span className="text-xs font-medium">Pantalla 90Hz</span>
            </button>
          </div>

          {/* Brightness Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-neutral-300" />
                <span>Brillo de pantalla</span>
              </span>
              <span className="font-mono text-white font-semibold">{deviceState.brightness}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={deviceState.brightness}
              onChange={e => onUpdateDevice({ brightness: parseInt(e.target.value, 10) })}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* RAM Meter */}
          <div className="space-y-1.5 pt-1 border-t border-white/5">
            <div className="flex justify-between text-[11px]">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <HardDrive className="w-3.5 h-3.5" />
                <span>RAM</span>
              </span>
              <span className="font-mono font-semibold text-white">
                {ramUsed.toFixed(1)} / 8.0 GB <span className="text-neutral-400 text-[10px]">({Math.round((ramUsed / 8.0) * 100)}% en uso)</span>
              </span>
            </div>

            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${(ramUsed / 8.0) * 100}%` }}
              />
            </div>
            <div className="text-[10px] text-neutral-400 font-mono">
              Disponible: {(8.0 - ramUsed).toFixed(1)} GB
            </div>
          </div>

          {/* Liberar RAM Button */}
          <button
            onClick={handleCleanRam}
            disabled={isCleaningRam}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCleaningRam ? 'animate-spin' : ''}`} />
            <span>{isCleaningRam ? 'Liberando memoria…' : ramCleanedToast ? '¡1.5 GB de RAM liberados!' : 'Liberar RAM ⌥F'}</span>
          </button>
        </div>
      </div>

      {/* Bottom Grid: Clipboard History (Left) + Recent Files & Quick Look (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Clipboard Card */}
        <div className="lg:col-span-6 p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Copy className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-white uppercase tracking-wider text-xs">
                CLIPBOARD HISTORY
              </h4>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>Confidencial</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-2">
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>STRIPE LIVE SECRET KEY</span>
              <span>Hace 4 min • Termux</span>
            </div>

            <div className="font-mono text-xs text-emerald-400 tracking-wider overflow-x-auto py-1">
              {showSecretKey ? secretKey : `${secretKey.slice(0, 16)}••••••••••••••••`}
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-white/5">
              <button
                onClick={() => onCopyText(secretKey)}
                className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-medium text-xs flex items-center gap-1.5 cursor-pointer border border-emerald-500/30 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar</span>
              </button>

              <button
                onClick={() => setShowSecretKey(!showSecretKey)}
                className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 font-medium text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {showSecretKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showSecretKey ? 'Ocultar' : 'Mostrar'}</span>
              </button>

              <span className="text-[10px] text-neutral-500 ml-auto font-mono">
                Persistido en LocalStorage
              </span>
            </div>
          </div>
        </div>

        {/* Recent Files & Quick Look Card */}
        <div className="lg:col-span-6 p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-white uppercase tracking-wider text-xs">
                ARCHIVOS RECIENTES Y QUICK LOOK
              </h4>
            </div>
            <span className="text-[10px] text-neutral-500 font-mono">
              LOCAL STORAGE
            </span>
          </div>

          <div className="space-y-1.5">
            {recentFiles.map((file, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-white">
                    {file.isApk ? <Smartphone className="w-4 h-4 text-emerald-400" /> : <FileText className="w-4 h-4 text-rose-400" />}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-white truncate text-xs">{file.name}</div>
                    <div className="text-[10px] text-neutral-400 truncate">{file.size} • {file.desc}</div>
                  </div>
                </div>

                <button
                  onClick={() => onOpenQuickLook(file.name)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer shrink-0 transition-colors ${
                    file.isApk
                      ? 'bg-white/10 hover:bg-white/20 text-neutral-200'
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {file.isApk ? 'Inspeccionar' : 'Quick Look'}
                </button>
              </div>
            ))}
          </div>

          <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-neutral-500">
            <span>PDF Quick Look + OCR activo</span>
            <button
              onClick={onOpenSplitInspector}
              className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
            >
              Inspeccionar APK en Split View →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
