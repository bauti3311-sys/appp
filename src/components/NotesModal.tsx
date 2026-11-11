import React, { useState } from 'react';
import { Notebook, Save, Trash2, X, Copy, Check } from 'lucide-react';

interface NoteItem {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

interface NotesModalProps {
  note?: NoteItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: { id?: string; title: string; content: string }) => void;
  onDelete?: (id: string) => void;
}

export const NotesModal: React.FC<NotesModalProps> = ({
  note,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;
    onSave({
      id: note?.id,
      title: title.trim() || 'Nota sin título',
      content: content.trim(),
    });
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${title}\n\n${content}`);
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
              <Notebook className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {note ? 'Editar Nota' : 'Nueva Nota Rápida'}
              </h3>
              <p className="text-xs text-neutral-400">Almacenamiento local persistente</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Note Form */}
        <div className="p-5 space-y-3.5">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Título de la nota..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-base font-semibold text-white placeholder-neutral-500 outline-none focus:border-sky-400 transition-colors"
          />

          <textarea
            rows={8}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Escribe el contenido de la nota aquí..."
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm text-neutral-200 placeholder-neutral-500 outline-none focus:border-sky-400 transition-colors resize-none leading-relaxed"
          />
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-black/40 border-t border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {note && onDelete && (
              <button
                onClick={() => {
                  onDelete(note.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-neutral-300 hover:bg-white/10 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-medium shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar nota</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
