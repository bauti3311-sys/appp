import React from 'react';
import { 
  X, Copy, ExternalLink, CloudSun, DollarSign, 
  BookOpen, Trophy, Sparkles, Check 
} from 'lucide-react';
import { InfoCardData } from '../types';

interface InfoCardModalProps {
  data: InfoCardData | null;
  isOpen: boolean;
  onClose: () => void;
  onCopyText: (text: string) => void;
}

export const InfoCardModal: React.FC<InfoCardModalProps> = ({
  data,
  isOpen,
  onClose,
  onCopyText,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !data) return null;

  const handleCopy = () => {
    onCopyText(data.copyText || data.body || data.title);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-neutral-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden glass-surface">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <div className="min-w-0 pr-4">
            <h3 className="text-lg font-bold text-white tracking-tight truncate">
              {data.title}
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5 truncate">
              {data.subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 max-h-[420px] overflow-y-auto space-y-4">
          {data.body && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap font-sans">
              {data.body}
            </div>
          )}

          {/* Rows table (e.g. 5-day weather or currency conversions) */}
          {data.rows && data.rows.length > 0 && (
            <div className="bg-black/30 border border-white/10 rounded-xl overflow-hidden">
              <div className="divide-y divide-white/5">
                {data.rows.map((row, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3.5 py-2 text-xs"
                  >
                    <span className="text-neutral-400 font-medium">{row.label}</span>
                    <span className="text-neutral-200 font-semibold">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-black/40 border-t border-white/10 flex items-center justify-between text-xs">
          {data.url ? (
            <a
              href={data.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-medium transition-colors"
            >
              <span>Ver fuente oficial</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="text-neutral-500 font-mono text-[11px]">
              Spotlight Next Online Tools
            </span>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-medium transition-colors cursor-pointer"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
