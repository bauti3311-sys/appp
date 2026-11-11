import React, { useEffect, useState } from 'react';
import { 
  Wifi, Battery, Volume2, VolumeX, Sun, Play, 
  Pause, SkipForward, SkipBack, X, ExternalLink, Music2 
} from 'lucide-react';
import { DeviceState } from '../types';

interface DeviceSimulatorProps {
  deviceState: DeviceState;
  onUpdateDevice: (partial: Partial<DeviceState>) => void;
  onCloseAppWindow: () => void;
}

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({
  deviceState,
  onUpdateDevice,
  onCloseAppWindow,
}) => {
  const [time, setTime] = useState('');
  const [showVolumeToast, setShowVolumeToast] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  // Show volume toast briefly when volume changes
  useEffect(() => {
    setShowVolumeToast(true);
    const timer = setTimeout(() => setShowVolumeToast(false), 1800);
    return () => clearTimeout(timer);
  }, [deviceState.volume, deviceState.isMuted]);

  return (
    <>
      {/* Top Simulated System Status Bar */}
      <header className="fixed top-0 left-0 right-0 h-8 px-5 flex items-center justify-between text-[11px] font-medium text-neutral-400 z-30 select-none bg-black/40 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-neutral-200">{time}</span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-neutral-300">
            Spotlight OS 2.0
          </span>
        </div>

        {/* Media mini indicator in status bar */}
        {deviceState.activeMediaTrack && (
          <div className="hidden md:flex items-center gap-2 text-[11px] text-neutral-300 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
            <Music2 className="w-3 h-3 text-sky-400 animate-pulse" />
            <span className="truncate max-w-[200px]">
              {deviceState.activeMediaTrack.title} · {deviceState.activeMediaTrack.artist}
            </span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Sun className="w-3.5 h-3.5 text-neutral-400" />
            <span className="font-mono text-[10px]">{deviceState.brightness}%</span>
          </div>

          <div className="flex items-center gap-1">
            {deviceState.isMuted || deviceState.volume === 0 ? (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-neutral-400" />
            )}
            <span className="font-mono text-[10px]">
              {deviceState.isMuted ? 'Mute' : `${deviceState.volume}%`}
            </span>
          </div>

          <Wifi className="w-3.5 h-3.5 text-neutral-400" />
          <div className="flex items-center gap-1">
            <Battery className="w-3.5 h-3.5 text-neutral-400" />
            <span className="font-mono text-[10px]">98%</span>
          </div>
        </div>
      </header>

      {/* Volume HUD Toast overlay */}
      {showVolumeToast && (
        <div className="fixed top-12 left-1/2 transform -translate-x-1/2 z-40 bg-neutral-900/90 border border-white/20 px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-3 glass-surface animate-fade-in pointer-events-none">
          {deviceState.isMuted || deviceState.volume === 0 ? (
            <VolumeX className="w-4 h-4 text-rose-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-sky-400" />
          )}
          <div className="w-28 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-400 transition-all duration-200 rounded-full"
              style={{ width: `${deviceState.isMuted ? 0 : deviceState.volume}%` }}
            />
          </div>
          <span className="font-mono text-xs font-semibold text-white">
            {deviceState.isMuted ? '0%' : `${deviceState.volume}%`}
          </span>
        </div>
      )}

      {/* Simulated App Window (when user opens Spotify, Chrome, Camera, Terminal, etc.) */}
      {deviceState.openAppWindow && (
        <div className="fixed inset-x-4 top-14 bottom-14 md:inset-x-20 md:top-16 md:bottom-16 z-40 bg-neutral-900/95 border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden glass-surface animate-fade-in">
          {/* Window Titlebar */}
          <div className="px-4 py-2.5 bg-white/5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 font-semibold text-xs text-white">
                {deviceState.openAppWindow.name}
              </span>
            </div>

            <button
              onClick={onCloseAppWindow}
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Window Content */}
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center overflow-y-auto">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-4 text-white shadow-inner">
              <ExternalLink className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              {deviceState.openAppWindow.name}
            </h3>
            <p className="text-sm text-neutral-400 max-w-md mb-6 leading-relaxed">
              Esta aplicación se ha lanzado desde Spotlight Next mediante acción nativa con resolución de permisos e intención explícita.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={onCloseAppWindow}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors cursor-pointer"
              >
                Volver a Spotlight
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
