import React, { useState } from 'react';
import { Sparkles, Send, Copy, Check, X, ShieldAlert } from 'lucide-react';
import { AppConfig } from '../types';

interface AiAssistantModalProps {
  initialPrompt: string;
  config: AppConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  initialPrompt,
  config,
  isOpen,
  onClose,
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleAsk = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse(null);

    // Bounded synthesis response matching DirectAi.kt behavior
    await new Promise(r => setTimeout(r, 650));

    const simulatedAnswer = `Análisis de Inteligencia Híbrida para: «${prompt}»\n\n1. Resumen: Los puntos relevantes indican una estructura modular clara para la ejecución y automatización local.\n2. Acciones sugeridas: Puedes crear un plan inteligente combinando volumen, brillo o apertura de aplicaciones en una sola consulta.\n3. Privacidad: Los datos locales permanecen protegidos bajo las preferencias seleccionadas (${config.privateMode ? 'Modo Privado Activo' : 'Almacenamiento Local Seguro'}).`;

    setResponse(simulatedAnswer);
    setLoading(false);
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-neutral-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden glass-surface">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Inteligencia Híbrida</h3>
              <p className="text-xs text-neutral-400">Modelo: {config.aiModel} · Consentimiento explícito</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Query Input */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Consulta o Texto a Analizar
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Escribe tu pregunta o pega un texto..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 outline-none focus:border-sky-400 transition-colors resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAsk}
              disabled={loading || !prompt.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-medium text-xs shadow-lg shadow-sky-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Consultando…' : 'Consultar'}</span>
            </button>
          </div>

          {/* Response Box */}
          {response && (
            <div className="bg-black/30 border border-white/10 rounded-xl p-4 text-xs text-neutral-200 leading-relaxed whitespace-pre-wrap animate-fade-in">
              {response}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-black/40 border-t border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-neutral-500 text-[11px]">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Sin telemetría oculta</span>
          </div>

          <div className="flex items-center gap-2">
            {response && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
