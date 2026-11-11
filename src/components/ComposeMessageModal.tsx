import React, { useState } from 'react';
import { Send, MessageSquare, X, Check } from 'lucide-react';
import { AndroidIntents } from '../lib/androidIntents';

interface ComposeMessageModalProps {
  channel: 'whatsapp' | 'whatsapp_business' | 'telegram' | 'email' | 'sms';
  initialTarget: string;
  initialText: string;
  isOpen: boolean;
  onClose: () => void;
  onSent: (target: string, text: string) => void;
}

export const ComposeMessageModal: React.FC<ComposeMessageModalProps> = ({
  channel,
  initialTarget,
  initialText,
  isOpen,
  onClose,
  onSent,
}) => {
  const [target, setTarget] = useState(initialTarget);
  const [text, setText] = useState(initialText);
  const [status, setStatus] = useState<'idle' | 'ready' | 'sent'>('idle');

  if (!isOpen) return null;

  const handleSend = () => {
    setStatus('sent');
    const cleanPhone = /^\+?\d{6,15}$/.test(target.replace(/[\s()-]/g, ''))
      ? target.replace(/[^\d]/g, '')
      : undefined;

    if (channel === 'whatsapp' || channel === 'whatsapp_business') {
      AndroidIntents.openWhatsApp({ phone: cleanPhone, text });
    } else if (channel === 'telegram') {
      AndroidIntents.openTelegram(text);
    } else if (channel === 'email') {
      AndroidIntents.openGmail({ to: target, body: text });
    } else if (channel === 'sms') {
      AndroidIntents.triggerUri(`sms:${cleanPhone || ''}?body=${encodeURIComponent(text)}`);
    }
    onSent(target, text);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const getChannelName = () => {
    switch (channel) {
      case 'whatsapp':
        return 'WhatsApp';
      case 'whatsapp_business':
        return 'WhatsApp Business';
      case 'telegram':
        return 'Telegram';
      case 'email':
        return 'Correo Electrónico';
      case 'sms':
        return 'Mensaje SMS';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-neutral-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden glass-surface">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Redactar Mensaje</h3>
              <p className="text-xs text-neutral-400">Canal: {getChannelName()}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-3.5">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-200">
            <strong>Revisión de seguridad:</strong> Spotlight nunca envía mensajes de manera automática o silenciosa. Verifica el destinatario y el contenido antes de enviar.
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Destinatario / Contacto
            </label>
            <input
              type="text"
              value={target}
              onChange={e => setTarget(e.target.value)}
              placeholder="Nombre o número de teléfono"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none focus:border-sky-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Mensaje
            </label>
            <textarea
              rows={4}
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none focus:border-sky-400 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-black/40 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 text-xs font-medium transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            onClick={handleSend}
            disabled={!target.trim() || !text.trim() || status === 'sent'}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-lg shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {status === 'sent' ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>¡Mensaje preparado!</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Enviar vía {getChannelName()}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
