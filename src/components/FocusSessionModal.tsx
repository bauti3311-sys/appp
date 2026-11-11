import React, { useState, useEffect } from 'react';
import { 
  Timer, Play, Pause, Square, Volume2, 
  CheckCircle2, X, RotateCcw, Sparkles 
} from 'lucide-react';
import { DeviceState } from '../types';

interface FocusSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  deviceState: DeviceState;
  onUpdateDevice: (partial: Partial<DeviceState>) => void;
  onSessionComplete?: () => void;
}

export const FocusSessionModal: React.FC<FocusSessionModalProps> = ({
  isOpen,
  onClose,
  deviceState,
  onUpdateDevice,
  onSessionComplete,
}) => {
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<'work' | 'break'>('work');
  const [completedCount, setCompletedCount] = useState(3);
  const [reduceVolume, setReduceVolume] = useState(true);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      if (phase === 'work') {
        setCompletedCount(c => c + 1);
        onSessionComplete?.();
        // Switch to 5m break
        setPhase('break');
        setSecondsLeft(5 * 60);
      } else {
        setPhase('work');
        setSecondsLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, phase, onSessionComplete]);

  if (!isOpen) return null;

  const startSession = () => {
    setIsRunning(true);
    if (reduceVolume) {
      onUpdateDevice({ volume: 20 });
    }
  };

  const pauseSession = () => {
    setIsRunning(false);
  };

  const resetSession = () => {
    setIsRunning(false);
    setSecondsLeft(minutes * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = 100 - (secondsLeft / (minutes * 60)) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-neutral-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden glass-surface">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Sesión de Concentración</h3>
              <p className="text-xs text-neutral-400">Modo productivo sin distracciones</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timer Display */}
        <div className="p-6 flex flex-col items-center">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Circular Progress Ring */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="84"
                className="text-white/10"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="96"
                cy="96"
                r="84"
                className={phase === 'work' ? 'text-sky-400' : 'text-emerald-400'}
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 84}
                strokeDashoffset={2 * Math.PI * 84 * (1 - progressPercent / 100)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>

            {/* Time inside */}
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-extrabold tracking-tighter text-white font-mono">
                {formatTime(secondsLeft)}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mt-1">
                {phase === 'work' ? 'Bloque de Estudio' : 'Descanso'}
              </span>
            </div>
          </div>

          {/* Quick preset selector when not running */}
          {!isRunning && secondsLeft === minutes * 60 && (
            <div className="flex items-center gap-2 mt-4">
              {[15, 25, 45, 60].map(m => (
                <button
                  key={m}
                  onClick={() => {
                    setMinutes(m);
                    setSecondsLeft(m * 60);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    minutes === m
                      ? 'bg-sky-500 text-white font-semibold'
                      : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {m} min
                </button>
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-3 mt-6">
            {!isRunning ? (
              <button
                onClick={startSession}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-medium text-sm shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Iniciar sesión</span>
              </button>
            ) : (
              <button
                onClick={pauseSession}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-medium text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Pause className="w-4 h-4 fill-white" />
                <span>Pausar</span>
              </button>
            )}

            <button
              onClick={resetSession}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title="Reiniciar temporizador"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Settings & Stats */}
        <div className="px-5 py-3.5 bg-black/40 border-t border-white/10 space-y-2 text-xs">
          <label className="flex items-center justify-between text-neutral-300 cursor-pointer">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-neutral-400" />
              <span>Reducir volumen al 20% automáticamente</span>
            </div>
            <input
              type="checkbox"
              checked={reduceVolume}
              onChange={e => setReduceVolume(e.target.checked)}
              className="w-4 h-4 rounded text-sky-500 focus:ring-0 cursor-pointer"
            />
          </label>

          <div className="flex items-center justify-between text-neutral-400 pt-1 border-t border-white/5 font-mono text-[11px]">
            <span>Sesiones completadas hoy:</span>
            <span className="font-bold text-emerald-400">{completedCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
