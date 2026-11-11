import React, { useState } from 'react';
import { 
  Play, CheckCircle2, ArrowUp, ArrowDown, 
  BookmarkPlus, X, Sun, Volume2, ExternalLink, Music2, Sliders 
} from 'lucide-react';
import { LocalPlanData, DeviceState } from '../types';
import { AndroidIntents } from '../lib/androidIntents';

interface PlanReviewModalProps {
  plan: LocalPlanData;
  isOpen: boolean;
  deviceState: DeviceState;
  onUpdateDevice: (partial: Partial<DeviceState>) => void;
  onSaveAsRoutine: (name: string, plan: LocalPlanData) => void;
  onClose: () => void;
}

export const PlanReviewModal: React.FC<PlanReviewModalProps> = ({
  plan: initialPlan,
  isOpen,
  deviceState,
  onUpdateDevice,
  onSaveAsRoutine,
  onClose,
}) => {
  const [steps, setSteps] = useState(initialPlan.steps);
  const [isExecuting, setIsExecuting] = useState(false);
  const [routineName, setRoutineName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleStep = (id: string) => {
    setSteps(prev =>
      prev.map(s => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= steps.length) return;
    const newSteps = [...steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIndex];
    newSteps[targetIndex] = temp;
    setSteps(newSteps);
  };

  const executePlan = async () => {
    setIsExecuting(true);

    for (let i = 0; i < steps.length; i++) {
      const stepItem = steps[i];
      if (!stepItem.enabled) continue;

      // Mark step as running
      setSteps(prev =>
        prev.map((s, idx) => (idx === i ? { ...s, status: 'pending' } : s))
      );

      // Simulate execution time per step
      await new Promise(r => setTimeout(r, 350));

      const step = stepItem.step;
      if (step.type === 'brightness') {
        const val = Math.max(20, Math.min(100, step.percent));
        onUpdateDevice({ brightness: val });
      } else if (step.type === 'relative_brightness') {
        const val = Math.max(20, Math.min(100, deviceState.brightness + step.delta));
        onUpdateDevice({ brightness: val });
      } else if (step.type === 'volume') {
        const val = Math.max(0, Math.min(100, step.percent));
        onUpdateDevice({ volume: val, isMuted: val === 0 });
      } else if (step.type === 'relative_volume') {
        const val = Math.max(0, Math.min(100, deviceState.volume + step.delta));
        onUpdateDevice({ volume: val, isMuted: val === 0 });
      } else if (step.type === 'media') {
        if (step.command === 'pause') onUpdateDevice({ isPlaying: false });
        if (step.command === 'play') onUpdateDevice({ isPlaying: true });
      } else if (step.type === 'open') {
        const cleanId = step.name.toLowerCase().trim();
        AndroidIntents.launchAppById(cleanId, step.name);
      }

      // Mark step completed
      setSteps(prev =>
        prev.map((s, idx) => (idx === i ? { ...s, status: 'success' } : s))
      );
    }

    setIsExecuting(false);
  };

  const handleSaveRoutine = () => {
    if (!routineName.trim()) return;
    onSaveAsRoutine(routineName.trim(), { raw: initialPlan.raw, steps });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowSaveInput(false);
    }, 1500);
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'brightness':
      case 'relative_brightness':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'volume':
      case 'relative_volume':
        return <Volume2 className="w-4 h-4 text-sky-400" />;
      case 'open':
        return <ExternalLink className="w-4 h-4 text-emerald-400" />;
      case 'media':
        return <Music2 className="w-4 h-4 text-purple-400" />;
      default:
        return <Sliders className="w-4 h-4 text-neutral-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-neutral-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden glass-surface">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Plan Inteligente
              </span>
              <h3 className="text-base font-semibold text-white">Revisión de Pasos</h3>
            </div>
            <p className="text-xs text-neutral-400 mt-1 font-mono">
              «{initialPlan.raw}»
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps List */}
        <div className="p-4 space-y-2.5 max-h-[380px] overflow-y-auto">
          <p className="text-xs text-neutral-400 mb-2">
            Verificá cada paso antes de ejecutar. Podés habilitar/deshabilitar o reordenar los pasos:
          </p>

          {steps.map((item, idx) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                item.enabled
                  ? 'bg-white/5 border-white/15 text-white'
                  : 'bg-black/20 border-white/5 text-neutral-500 opacity-60'
              }`}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={item.enabled}
                onChange={() => toggleStep(item.id)}
                className="w-4 h-4 rounded border-neutral-600 text-sky-500 focus:ring-sky-500/30 cursor-pointer"
              />

              {/* Step Icon */}
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                {getStepIcon(item.step.type)}
              </div>

              {/* Step Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.status === 'success' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </div>
                {item.note && (
                  <p className="text-[11px] text-neutral-400">{item.note}</p>
                )}
              </div>

              {/* Move up / down controls */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  disabled={idx === 0}
                  onClick={() => moveStep(idx, 'up')}
                  className="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/10 disabled:opacity-20 cursor-pointer"
                  title="Subir paso"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={idx === steps.length - 1}
                  onClick={() => moveStep(idx, 'down')}
                  className="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/10 disabled:opacity-20 cursor-pointer"
                  title="Bajar paso"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Save as Custom Routine section */}
        <div className="px-5 py-2.5 bg-black/30 border-t border-white/10">
          {!showSaveInput ? (
            <button
              onClick={() => setShowSaveInput(true)}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-sky-300 transition-colors cursor-pointer"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>Guardar este plan como comando personalizado</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={routineName}
                onChange={e => setRoutineName(e.target.value)}
                placeholder="Nombre del comando (ej: relax, estudio)"
                className="flex-1 bg-white/10 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white placeholder-neutral-500 outline-none focus:border-sky-400"
              />
              <button
                onClick={handleSaveRoutine}
                disabled={!routineName.trim()}
                className="px-3 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-medium disabled:opacity-50 cursor-pointer"
              >
                {saveSuccess ? '¡Guardado!' : 'Guardar'}
              </button>
              <button
                onClick={() => setShowSaveInput(false)}
                className="p-1 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-5 py-3.5 bg-black/40 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 text-xs font-medium transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            onClick={executePlan}
            disabled={isExecuting || !steps.some(s => s.enabled)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-medium text-xs shadow-lg shadow-sky-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isExecuting ? 'Ejecutando pasos…' : 'Ejecutar plan ahora'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
