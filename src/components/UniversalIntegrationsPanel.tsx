import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, ExternalLink, Copy, Check, Mail, Send, KeyRound,
  MapPin, Navigation, Phone, Wallet, QrCode, Users, Calculator,
  Camera, RefreshCw, Sparkles, Wifi, Bluetooth, Flashlight, Moon,
  BatteryCharging, Radio, Volume2, Sun, Cpu, Plus, Trash2, Headphones
} from 'lucide-react';
import { AppConfig, DeviceState } from '../types';
import { IosAppIcon } from './IosAppIcon';

// ============================================================================
// 1. YOUTUBE MINI-PLAYER, VELOCIDAD & MODO SOLO AUDIO / PODCAST (YT1 & YT3)
// ============================================================================
interface YouTubeVideoItem {
  id: string;
  ytId: string;
  title: string;
  channel: string;
  duration: string;
  views: string;
  category: 'musica' | 'tech' | 'cine' | 'deportes';
}

const YOUTUBE_VIDEOS: YouTubeVideoItem[] = [
  {
    id: 'lofi',
    ytId: 'jfKfPfyJRdk',
    title: 'lofi hip hop radio 📚 beats to relax/study to',
    channel: 'Lofi Girl',
    duration: 'EN VIVO',
    views: '42K viendo',
    category: 'musica',
  },
  {
    id: 'synthwave',
    ytId: '4xDzrJKXOOY',
    title: 'Synthwave Radio 🌌 - chill synth / retro beats',
    channel: 'Lofi Girl Synthwave',
    duration: 'EN VIVO',
    views: '14K viendo',
    category: 'musica',
  },
  {
    id: 'interstellar',
    ytId: 'UDVtMYqUAyw',
    title: 'Interstellar Main Theme - Hans Zimmer (4K Concert)',
    channel: 'Hans Zimmer Official',
    duration: '4:49',
    views: '128M vistas',
    category: 'cine',
  },
  {
    id: 'typescript',
    ytId: 'zQnBQ4tB3ZA',
    title: 'TypeScript in 100 Seconds — Guía Rápida Pro',
    channel: 'Fireship',
    duration: '2:18',
    views: '2.1M vistas',
    category: 'tech',
  },
  {
    id: 'boiler',
    ytId: 'c0-hvjV2A5Y',
    title: 'Fred again.. | Boiler Room: London Set',
    channel: 'Boiler Room',
    duration: '1:09:20',
    views: '41M vistas',
    category: 'musica',
  },
];

export const YouTubeInspectorPanel: React.FC<{
  onCopyText?: (msg: string) => void;
}> = ({ onCopyText }) => {
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideoItem>(YOUTUBE_VIDEOS[0]);
  const [ytSearch, setYtSearch] = useState('');
  const [playbackSpeed, setPlaybackSpeed] = useState<'1x' | '1.25x' | '1.5x' | '2x'>('1x');
  const [audioOnlyMode, setAudioOnlyMode] = useState(false);
  const [videoNote, setVideoNote] = useState('');
  const [savedVideoNotes, setSavedVideoNotes] = useState<Array<{ time: string; text: string }>>([
    { time: '02:14', text: 'Excelente transición de sintetizador para concentrarse' },
  ]);

  const filteredVideos = YOUTUBE_VIDEOS.filter(
    v =>
      !ytSearch.trim() ||
      v.title.toLowerCase().includes(ytSearch.toLowerCase()) ||
      v.channel.toLowerCase().includes(ytSearch.toLowerCase())
  );

  const handleAddNote = () => {
    if (!videoNote.trim()) return;
    const min = Math.floor(Math.random() * 12)
      .toString()
      .padStart(2, '0');
    const sec = Math.floor(Math.random() * 59)
      .toString()
      .padStart(2, '0');
    setSavedVideoNotes(prev => [{ time: `${min}:${sec}`, text: videoNote.trim() }, ...prev]);
    setVideoNote('');
    onCopyText?.('Nota con marca de tiempo guardada');
  };

  return (
    <div className="space-y-3 animate-spring-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <IosAppIcon appId="youtube" size={38} />
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>YouTube Mini-Player</span>
              <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-[9px] font-mono">
                YT1 + YT3
              </span>
            </h4>
            <p className="text-[11px] text-neutral-400">Reproductor embebido, velocidad {playbackSpeed} y Modo Podcast</p>
          </div>
        </div>

        <button
          onClick={() => setAudioOnlyMode(!audioOnlyMode)}
          className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold cursor-pointer flex items-center gap-1.5 transition-all ${
            audioOnlyMode
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
              : 'bg-white/5 border-white/10 text-neutral-300 hover:text-white'
          }`}
          title="Modo Solo Audio / Podcast para ahorrar batería"
        >
          <Headphones className="w-3.5 h-3.5" />
          <span>{audioOnlyMode ? 'Modo Podcast ON' : 'Solo Audio (YT3)'}</span>
        </button>
      </div>

      {/* Video Player or Audio-Only Podcast Visualizer */}
      {!audioOnlyMode ? (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/15 shadow-xl">
          <iframe
            key={selectedVideo.ytId}
            src={`https://www.youtube-nocookie.com/embed/${selectedVideo.ytId}?autoplay=0&rel=0`}
            title={selectedVideo.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-red-950/50 via-black to-neutral-900 border border-red-500/35 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-400/40 flex items-center justify-center text-red-400 shrink-0">
              <Headphones className="w-6 h-6 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                ● YT3 Modo Solo Audio / Segundo Plano Activo (-65% Batería)
              </div>
              <div className="text-xs font-bold text-white truncate">{selectedVideo.title}</div>
              <div className="text-[11px] text-neutral-400">
                {selectedVideo.channel} • Velocidad: {playbackSpeed}
              </div>
            </div>
          </div>
          <button
            onClick={() => setAudioOnlyMode(false)}
            className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white font-semibold cursor-pointer shrink-0"
          >
            Mostrar Video
          </button>
        </div>
      )}

      {/* YT3: Speed Selector + Open in YouTube */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono text-neutral-400 mr-1">Velocidad (YT3):</span>
          {(['1x', '1.25x', '1.5x', '2x'] as const).map(sp => (
            <button
              key={sp}
              onClick={() => {
                setPlaybackSpeed(sp);
                onCopyText?.(`Velocidad de YouTube ajustada a ${sp}`);
              }}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold cursor-pointer ${
                playbackSpeed === sp
                  ? 'bg-red-500 text-white'
                  : 'bg-white/5 text-neutral-400 hover:text-white border border-white/10'
              }`}
            >
              {sp}
            </button>
          ))}
        </div>

        <a
          href={`https://www.youtube.com/watch?v=${selectedVideo.ytId}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-[11px] text-red-400 hover:underline font-semibold"
        >
          <span>Abrir en YouTube</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Search & Video Selector */}
      <div className="flex gap-1.5">
        <input
          type="text"
          value={ytSearch}
          onChange={e => setYtSearch(e.target.value)}
          placeholder="Filtrar o buscar en YouTube..."
          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-red-400"
        />
        {ytSearch.trim() && (
          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ytSearch)}`}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1 shrink-0"
          >
            <span>Buscar Web</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      <div className="divide-y divide-white/5 rounded-xl border border-white/10 bg-black/30 max-h-[120px] overflow-y-auto scrollbar-thin">
        {filteredVideos.map(v => {
          const isCurrent = v.id === selectedVideo.id;
          return (
            <div
              key={v.id}
              onClick={() => setSelectedVideo(v)}
              className={`flex items-center justify-between px-3 py-2 text-xs cursor-pointer transition-colors ${
                isCurrent ? 'bg-red-500/15 text-red-300 font-bold' : 'hover:bg-white/5 text-neutral-300'
              }`}
            >
              <div className="min-w-0 pr-2">
                <div className="truncate">{v.title}</div>
                <div className="text-[10px] text-neutral-500">
                  {v.channel} • {v.views}
                </div>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 shrink-0">
                {v.duration}
              </span>
            </div>
          );
        })}
      </div>

      {/* Quick Timestamp Note */}
      <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
        <div className="flex gap-1.5">
          <input
            type="text"
            value={videoNote}
            onChange={e => setVideoNote(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddNote()}
            placeholder="Anotar idea de este video con minuto exacto..."
            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-white outline-none"
          />
          <button
            onClick={handleAddNote}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] text-white font-semibold cursor-pointer"
          >
            + Nota
          </button>
        </div>
        {savedVideoNotes.slice(0, 2).map((n, i) => (
          <div key={i} className="text-[10px] text-neutral-400 flex items-center gap-1.5">
            <span className="font-mono text-red-400 font-bold">[{n.time}]</span>
            <span className="truncate">{n.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 2. GMAIL FAST INBOX, REDACTOR EXPRESS & EXTRACTOR 2FA / OTP (GM1 & GM2)
// ============================================================================
interface EmailItem {
  id: string;
  sender: string;
  subject: string;
  snippet: string;
  time: string;
  unread: boolean;
  category: '2fa' | 'facturas' | 'trabajo';
  otpCode?: string;
}

const INITIAL_EMAILS: EmailItem[] = [
  {
    id: 'em-1',
    sender: 'Mercado Pago Seguridad',
    subject: 'Tu código de verificación es 849201',
    snippet: 'Ingresá el código 849201 para autorizar tu transferencia en Mercado Pago. No lo compartas con nadie.',
    time: 'Hace 1 min',
    unread: true,
    category: '2fa',
    otpCode: '849201',
  },
  {
    id: 'em-2',
    sender: 'GitHub Authentication',
    subject: '[GitHub] Please verify your device: 392014',
    snippet: 'Verification code: 392014. A sign in attempt requires further verification on Moto G86.',
    time: 'Hace 8 min',
    unread: true,
    category: '2fa',
    otpCode: '392014',
  },
  {
    id: 'em-3',
    sender: 'Martín · Equipo Diseño',
    subject: 'Entrega final de iconos iOS 18 y Split View',
    snippet: 'Bauti, te adjunto el link de Figma con los ajustes del Inspector separado y las tarjetas de cristal.',
    time: '11:20',
    unread: false,
    category: 'trabajo',
  },
  {
    id: 'em-4',
    sender: 'Edenor / Facturación Digital',
    subject: 'Resumen de cuenta mensual disponible ($18.450)',
    snippet: 'Vencimiento: 18 de Noviembre. Podés abonar con código QR o Mercado Pago.',
    time: 'Ayer',
    unread: false,
    category: 'facturas',
  },
];

export const GmailInspectorPanel: React.FC<{
  onCopyText?: (msg: string) => void;
}> = ({ onCopyText }) => {
  const [emails, setEmails] = useState<EmailItem[]>(INITIAL_EMAILS);
  const [filter, setFilter] = useState<'all' | '2fa' | 'unread' | 'compose'>('all');
  const [copiedOtp, setCopiedOtp] = useState<string | null>(null);
  const [composeTo, setComposeTo] = useState('martin.diseno@estudio.com');
  const [composeSubject, setComposeSubject] = useState('Actualización Spotlight Universal v3');
  const [composeBody, setComposeBody] = useState('¡Hola Martín! Te paso los avances del asistente universal.');
  const [sentBanner, setSentBanner] = useState(false);

  const latestOtpEmail = emails.find(e => e.otpCode);

  const handleCopyOtp = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedOtp(code);
    onCopyText?.(`🔐 Código 2FA ${code} copiado`);
    setTimeout(() => setCopiedOtp(null), 1800);
  };

  const handleSendExpressEmail = () => {
    if (!composeTo.trim() || !composeSubject.trim()) return;
    setSentBanner(true);
    onCopyText?.(`✉️ Correo enviado a ${composeTo}`);
    setTimeout(() => {
      setSentBanner(false);
      setFilter('all');
    }, 1500);
  };

  return (
    <div className="space-y-3 animate-spring-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <IosAppIcon appId="gmail" size={38} />
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Gmail & Extractor 2FA</span>
              <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 border border-red-500/30 text-[9px] font-mono">
                GM1 + GM2
              </span>
            </h4>
            <p className="text-[11px] text-neutral-400">Detección instantánea de códigos OTP y bandeja rápida</p>
          </div>
        </div>
      </div>

      {/* GM2: Automatic 2FA / OTP Code Banner */}
      {latestOtpEmail && (
        <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-black/40 border border-emerald-400/40 flex items-center justify-between gap-2 shadow-lg">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-emerald-500/25 text-emerald-300 shrink-0">
              <KeyRound className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono uppercase text-emerald-300 font-bold">
                GM2 • Código 2FA Detectado ({latestOtpEmail.sender})
              </div>
              <div className="text-base font-mono font-black text-white tracking-widest">
                {latestOtpEmail.otpCode}
              </div>
            </div>
          </div>

          <button
            onClick={() => handleCopyOtp(latestOtpEmail.otpCode!)}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs cursor-pointer flex items-center gap-1.5 shrink-0 shadow-md"
          >
            {copiedOtp === latestOtpEmail.otpCode ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar {latestOtpEmail.otpCode}</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
        {[
          { id: 'all', label: 'Recibidos (4)' },
          { id: '2fa', label: '🔐 Códigos 2FA (2)' },
          { id: 'unread', label: 'No leídos' },
          { id: 'compose', label: '✍️ Redactar Express' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id as any)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold cursor-pointer transition-all shrink-0 ${
              filter === t.id
                ? 'bg-red-500 text-white font-bold shadow-xs'
                : 'bg-white/5 text-neutral-400 hover:text-white border border-white/10'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filter === 'compose' ? (
        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
          <div>
            <label className="text-[10px] font-mono text-neutral-400">PARA:</label>
            <input
              type="email"
              value={composeTo}
              onChange={e => setComposeTo(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none mt-0.5"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-neutral-400">ASUNTO:</label>
            <input
              type="text"
              value={composeSubject}
              onChange={e => setComposeSubject(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none mt-0.5"
            />
          </div>
          <div>
            <textarea
              rows={3}
              value={composeBody}
              onChange={e => setComposeBody(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none resize-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSendExpressEmail}
              className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{sentBanner ? '✓ ¡Correo Enviado!' : 'Enviar Correo Ahora'}</span>
            </button>
            <a
              href={`mailto:${composeTo}?subject=${encodeURIComponent(composeSubject)}&body=${encodeURIComponent(composeBody)}`}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-neutral-200 font-semibold flex items-center gap-1"
            >
              <span>App Nativa</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-0.5 scrollbar-thin">
          {emails
            .filter(e => {
              if (filter === '2fa') return !!e.otpCode;
              if (filter === 'unread') return e.unread;
              return true;
            })
            .map(em => (
              <div
                key={em.id}
                onClick={() =>
                  setEmails(prev => prev.map(x => (x.id === em.id ? { ...x, unread: false } : x)))
                }
                className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                  em.unread
                    ? 'bg-white/[0.06] border-red-500/35'
                    : 'bg-black/30 border-white/10 opacity-85'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {em.unread && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />}
                    <span className="text-xs font-bold text-white truncate">{em.sender}</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 shrink-0">{em.time}</span>
                </div>
                <div className="text-xs font-semibold text-neutral-200">{em.subject}</div>
                <p className="text-[11px] text-neutral-400 line-clamp-2">{em.snippet}</p>
                {em.otpCode && (
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleCopyOtp(em.otpCode!);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-[10px] font-mono font-bold cursor-pointer"
                    >
                      {copiedOtp === em.otpCode ? '✓ Copiado' : `🔐 Copiar código ${em.otpCode}`}
                    </button>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 3. GOOGLE MAPS NEARBY PLACES FINDER (MAP2)
// ============================================================================
interface NearbyPlaceItem {
  id: string;
  name: string;
  category: 'farmacia' | 'cafe' | 'nafta' | 'cajero' | 'comida';
  distance: string;
  walkTime: string;
  status: string;
  rating: string;
  address: string;
  phone: string;
}

const NEARBY_PLACES: NearbyPlaceItem[] = [
  {
    id: 'p1',
    name: 'Farmacity 24 Horas · Turno Activo',
    category: 'farmacia',
    distance: '240 m',
    walkTime: '3 min a pie',
    status: 'ABIERTO 24 HS',
    rating: '4.7 ★',
    address: 'Av. Santa Fe 3420',
    phone: '0800-666-4321',
  },
  {
    id: 'p2',
    name: 'Farmacia Azul · Guardia Nocturna',
    category: 'farmacia',
    distance: '510 m',
    walkTime: '6 min a pie',
    status: 'DE TURNO HOY',
    rating: '4.6 ★',
    address: 'Coronel Díaz 1890',
    phone: '11-4821-9032',
  },
  {
    id: 'p3',
    name: 'Cuervo Café · Especialidad & Wi-Fi Pro',
    category: 'cafe',
    distance: '180 m',
    walkTime: '2 min a pie',
    status: 'ABIERTO HASTA 21:00',
    rating: '4.9 ★',
    address: 'Costa Rica 5801',
    phone: '11-5231-0091',
  },
  {
    id: 'p4',
    name: 'La Birra Bar & Café',
    category: 'cafe',
    distance: '420 m',
    walkTime: '5 min a pie',
    status: 'ABIERTO AHORA',
    rating: '4.8 ★',
    address: 'Honduras 5200',
    phone: '11-4490-1122',
  },
  {
    id: 'p5',
    name: 'YPF Full 24 Horas (Infinia / GNC)',
    category: 'nafta',
    distance: '650 m',
    walkTime: '2 min en auto',
    status: 'ABIERTO 24 HS',
    rating: '4.6 ★',
    address: 'Av. Córdoba y Godoy Cruz',
    phone: '0800-122-2973',
  },
  {
    id: 'p6',
    name: 'Shell Select · Boxes & Café',
    category: 'nafta',
    distance: '890 m',
    walkTime: '3 min en auto',
    status: 'ABIERTO 24 HS',
    rating: '4.8 ★',
    address: 'Av. Juan B. Justo 2150',
    phone: '0800-999-7435',
  },
  {
    id: 'p7',
    name: 'Cajero Banelco / Santander Río (Con Efectivo)',
    category: 'cajero',
    distance: '310 m',
    walkTime: '4 min a pie',
    status: 'DISPONIBLE 24 HS',
    rating: '4.5 ★',
    address: 'Av. Scalabrini Ortiz 2400',
    phone: '0800-999-2400',
  },
  {
    id: 'p8',
    name: 'Guerrín / Pizzería al Corte',
    category: 'comida',
    distance: '450 m',
    walkTime: '5 min a pie',
    status: 'ABIERTO HASTA 01:00',
    rating: '4.9 ★',
    address: 'Thames 1840',
    phone: '11-4832-1190',
  },
];

export const MapsInspectorPanel: React.FC<{
  onCopyText?: (msg: string) => void;
}> = ({ onCopyText }) => {
  const [cat, setCat] = useState<'all' | 'farmacia' | 'cafe' | 'nafta' | 'cajero' | 'comida'>('all');
  const [customSearch, setCustomSearch] = useState('');

  const filtered = NEARBY_PLACES.filter(p => {
    if (cat !== 'all' && p.category !== cat) return false;
    if (customSearch.trim()) {
      const q = customSearch.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-3 animate-spring-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <IosAppIcon appId="maps" size={38} />
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Google Maps · Lugares Cercanos</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-mono">
                MAP2
              </span>
            </h4>
            <p className="text-[11px] text-neutral-400">Locales abiertos ahora cerca de tu ubicación con ruta en 1 toque</p>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
        {[
          { id: 'all', label: '📍 Todos' },
          { id: 'farmacia', label: '💊 Farmacias 24h' },
          { id: 'cafe', label: '☕ Cafeterías' },
          { id: 'nafta', label: '⛽ Nafta / YPF' },
          { id: 'cajero', label: '🏧 Cajeros' },
          { id: 'comida', label: '🍕 Comida' },
        ].map(c => (
          <button
            key={c.id}
            onClick={() => setCat(c.id as any)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold cursor-pointer transition-all shrink-0 ${
              cat === c.id
                ? 'bg-emerald-500 text-neutral-950 font-bold shadow-xs'
                : 'bg-white/5 text-neutral-300 hover:text-white border border-white/10'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Search Any Address */}
      <div className="flex gap-1.5">
        <input
          type="text"
          value={customSearch}
          onChange={e => setCustomSearch(e.target.value)}
          placeholder="Buscar calle, comercio o lugar en Google Maps..."
          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-emerald-400"
        />
        {customSearch.trim() && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(customSearch)}`}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-1 shrink-0"
          >
            <Navigation className="w-3 h-3" />
            <span>Ir</span>
          </a>
        )}
      </div>

      {/* Places List */}
      <div className="space-y-2 max-h-[235px] overflow-y-auto pr-0.5 scrollbar-thin">
        {filtered.map(place => (
          <div
            key={place.id}
            className="p-3 rounded-2xl bg-black/40 border border-white/10 hover:border-emerald-500/40 transition-all space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs font-bold text-white">{place.name}</div>
                <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>{place.address}</span>
                  <span>•</span>
                  <span className="text-amber-400 font-semibold">{place.rating}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold shrink-0">
                {place.distance} ({place.walkTime})
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/5">
              <span className="text-[10px] font-mono text-emerald-400 font-bold">● {place.status}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(`${place.name} - ${place.address}`);
                    onCopyText?.(`📍 Dirección copiada: ${place.address}`);
                  }}
                  className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[10px] text-neutral-300 cursor-pointer flex items-center gap-1"
                >
                  <Copy className="w-2.5 h-2.5" />
                  <span>Copiar</span>
                </button>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    `${place.name} ${place.address}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-[10px] flex items-center gap-1"
                >
                  <Navigation className="w-2.5 h-2.5" />
                  <span>Cómo llegar</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 4. FINANZAS, MI ALIAS/QR, DIVISOR DE ASADO & CUOTAS (FIN1 & FIN2)
// ============================================================================
interface FriendExpense {
  id: string;
  name: string;
  paid: number;
}

export const FinanzasInspectorPanel: React.FC<{
  config: AppConfig;
  onUpdateConfig?: (updated: AppConfig) => void;
  onCopyText?: (msg: string) => void;
}> = ({ config, onUpdateConfig, onCopyText }) => {
  const [subTab, setSubTab] = useState<'alias' | 'asado' | 'cuotas'>('alias');
  const [copiedAlias, setCopiedAlias] = useState(false);

  // FIN2: Divisor de Asado / Gastos entre Amigos
  const [friends, setFriends] = useState<FriendExpense[]>([
    { id: '1', name: 'Bauti (Carne y Carbón)', paid: 38000 },
    { id: '2', name: 'Martín (Bebidas)', paid: 16000 },
    { id: '3', name: 'Sofi (Picada y Hielo)', paid: 10000 },
    { id: '4', name: 'Lucas', paid: 0 },
  ]);
  const [newFriendName, setNewFriendName] = useState('');
  const [newFriendPaid, setNewFriendPaid] = useState('');

  // FIN2: Calculadora de Cuotas vs Efectivo
  const [cashPrice, setCashPrice] = useState(120000);
  const [installmentTotal, setInstallmentTotal] = useState(135000);
  const [months, setMonths] = useState<3 | 6 | 9 | 12>(6);
  const [monthlyInflation, setMonthlyInflation] = useState(4.0);

  const totalSpent = friends.reduce((acc, f) => acc + f.paid, 0);
  const perPerson = friends.length > 0 ? Math.round(totalSpent / friends.length) : 0;

  const userAlias = config.paymentAlias || 'bauti.spotlight.mp';
  const userCbu = config.paymentCbu || '0000003100084920194821';
  const userHolder = config.paymentHolder || 'Bautista Ayala';
  const userBank = config.paymentBank || 'Mercado Pago';

  const handleCopyAliasCard = () => {
    const formatted = `💳 *Datos para Transferencia*\n• Alias: *${userAlias}*\n• CVU/CBU: ${userCbu}\n• Titular: ${userHolder} (${userBank})`;
    navigator.clipboard?.writeText(formatted);
    setCopiedAlias(true);
    onCopyText?.(`💳 Alias ${userAlias} copiado para WhatsApp`);
    setTimeout(() => setCopiedAlias(false), 1800);
  };

  const handleAddFriend = () => {
    if (!newFriendName.trim()) return;
    setFriends(prev => [
      ...prev,
      { id: `fr-${Date.now()}`, name: newFriendName.trim(), paid: Number(newFriendPaid) || 0 },
    ]);
    setNewFriendName('');
    setNewFriendPaid('');
  };

  const buildAsadoSummaryText = () => {
    const lines = [
      `🥩 *Resumen de Gastos / Asado*`,
      `• Total gastado: $${totalSpent.toLocaleString('es-AR')}`,
      `• Ponemos cada uno (${friends.length}): *$${perPerson.toLocaleString('es-AR')}*`,
      ``,
      `*Saldos:*`,
      ...friends.map(f => {
        const diff = f.paid - perPerson;
        if (diff > 0) return `✅ ${f.name}: puso $${f.paid.toLocaleString('es-AR')} (recibe $${diff.toLocaleString('es-AR')})`;
        if (diff < 0) return `👉 ${f.name}: debe transferir *$${Math.abs(diff).toLocaleString('es-AR')}*`;
        return `👌 ${f.name}: está hecho`;
      }),
      ``,
      `💳 Alias para transferir: *${userAlias}*`,
    ];
    return lines.join('\n');
  };

  // Present Value calculation for Installments vs Cash
  const monthlyInstallment = installmentTotal / months;
  let presentValueSum = 0;
  for (let m = 1; m <= months; m++) {
    presentValueSum += monthlyInstallment / Math.pow(1 + monthlyInflation / 100, m);
  }
  const presentValueRounded = Math.round(presentValueSum);
  const installmentWins = presentValueRounded < cashPrice;
  const savingsAmount = Math.abs(cashPrice - presentValueRounded);

  return (
    <div className="space-y-3 animate-spring-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <IosAppIcon appId="finanzas" size={38} />
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Finanzas & Mercado Pago</span>
              <span className="px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[9px] font-mono">
                FIN1 + FIN2
              </span>
            </h4>
            <p className="text-[11px] text-neutral-400">Mi Alias/QR, Divisor de Asado y Calculadora de Cuotas</p>
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
        {[
          { id: 'alias', label: '💳 Mi Alias & QR' },
          { id: 'asado', label: '🥩 Dividir Asado' },
          { id: 'cuotas', label: '📊 ¿Cuotas o Efvo?' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id as any)}
            className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold cursor-pointer transition-all ${
              subTab === t.id
                ? 'bg-sky-500 text-neutral-950 font-bold shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {subTab === 'alias' && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-500/25 via-blue-950/40 to-black border border-sky-400/40 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-sky-300 font-bold">
                {userBank} • Cuenta Verificada
              </span>
              <QrCode className="w-4 h-4 text-sky-300" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] text-neutral-400 font-mono">MI ALIAS</label>
                <input
                  type="text"
                  value={userAlias}
                  onChange={e => onUpdateConfig?.({ ...config, paymentAlias: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-2.5 py-1.5 text-sm font-mono font-black text-white outline-none focus:border-sky-400 mt-0.5"
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 font-mono">TITULAR</label>
                <input
                  type="text"
                  value={userHolder}
                  onChange={e => onUpdateConfig?.({ ...config, paymentHolder: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-white outline-none focus:border-sky-400 mt-0.5"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-neutral-400 font-mono">CVU / CBU (22 DÍGITOS)</label>
              <input
                type="text"
                value={userCbu}
                onChange={e => onUpdateConfig?.({ ...config, paymentCbu: e.target.value })}
                className="w-full bg-black/40 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs font-mono text-sky-200 outline-none focus:border-sky-400 mt-0.5"
              />
            </div>

            <button
              onClick={handleCopyAliasCard}
              className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-neutral-950 font-bold text-xs cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20"
            >
              {copiedAlias ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>¡Alias y CVU Copiados para WhatsApp!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Tarjeta de Alias + CVU para WhatsApp</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {subTab === 'asado' && (
        <div className="space-y-2.5">
          <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-neutral-400 uppercase">Total del Asado / Salida</div>
              <div className="text-base font-mono font-black text-white">
                ${totalSpent.toLocaleString('es-AR')}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-mono text-emerald-400 uppercase">Ponen cada uno ({friends.length})</div>
              <div className="text-base font-mono font-black text-emerald-400">
                ${perPerson.toLocaleString('es-AR')}
              </div>
            </div>
          </div>

          <div className="space-y-1.5 max-h-[135px] overflow-y-auto pr-0.5 scrollbar-thin">
            {friends.map(f => {
              const diff = f.paid - perPerson;
              return (
                <div
                  key={f.id}
                  className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-white truncate">{f.name}</div>
                    <div className="text-[10px] text-neutral-400 font-mono">
                      Puso: ${f.paid.toLocaleString('es-AR')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        diff > 0
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : diff < 0
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-white/10 text-neutral-300'
                      }`}
                    >
                      {diff > 0
                        ? `Recibe $${diff.toLocaleString('es-AR')}`
                        : diff < 0
                        ? `Debe $${Math.abs(diff).toLocaleString('es-AR')}`
                        : 'Hecho'}
                    </span>
                    <button
                      onClick={() => setFriends(prev => prev.filter(x => x.id !== f.id))}
                      className="text-neutral-500 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-1.5">
            <input
              type="text"
              placeholder="Amigo (ej: Nico)"
              value={newFriendName}
              onChange={e => setNewFriendName(e.target.value)}
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none"
            />
            <input
              type="number"
              placeholder="Puso $"
              value={newFriendPaid}
              onChange={e => setNewFriendPaid(e.target.value)}
              className="w-24 bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono outline-none"
            />
            <button
              onClick={handleAddFriend}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => {
              const txt = buildAsadoSummaryText();
              navigator.clipboard?.writeText(txt);
              onCopyText?.('🥩 Resumen de gastos copiado para el grupo de WhatsApp');
            }}
            className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copiar Resumen con Mi Alias para WhatsApp</span>
          </button>
        </div>
      )}

      {subTab === 'cuotas' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
              <label className="text-[10px] font-mono text-neutral-400">PRECIO CONTADO ($)</label>
              <input
                type="number"
                value={cashPrice}
                onChange={e => setCashPrice(Number(e.target.value) || 0)}
                className="w-full bg-transparent text-sm font-mono font-bold text-white outline-none mt-0.5"
              />
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
              <label className="text-[10px] font-mono text-neutral-400">PRECIO TOTAL CUOTAS ($)</label>
              <input
                type="number"
                value={installmentTotal}
                onChange={e => setInstallmentTotal(Number(e.target.value) || 0)}
                className="w-full bg-transparent text-sm font-mono font-bold text-sky-300 outline-none mt-0.5"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              {([3, 6, 9, 12] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMonths(m)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer ${
                    months === m ? 'bg-sky-500 text-neutral-950' : 'bg-white/5 text-neutral-400'
                  }`}
                >
                  {m} cuotas
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-300">
              <span>Inflación mes:</span>
              <input
                type="number"
                step="0.5"
                value={monthlyInflation}
                onChange={e => setMonthlyInflation(Number(e.target.value) || 0)}
                className="w-14 bg-black/40 border border-white/15 rounded-lg px-1.5 py-0.5 text-center text-white"
              />
              <span>%</span>
            </div>
          </div>

          <div
            className={`p-3.5 rounded-2xl border ${
              installmentWins
                ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-200'
                : 'bg-amber-500/15 border-amber-400/40 text-amber-200'
            } space-y-1`}
          >
            <div className="text-xs font-black uppercase tracking-wide">
              {installmentWins ? '✅ CONVIENE COMPRAR EN CUOTAS' : '💵 CONVIENE PAGAR AL CONTADO'}
            </div>
            <div className="text-[11px]">
              {months} cuotas de <strong>${Math.round(monthlyInstallment).toLocaleString('es-AR')}</strong> equivalen hoy a{' '}
              <strong>${presentValueRounded.toLocaleString('es-AR')}</strong> ajustado por inflación.
            </div>
            <div className="text-[10px] font-mono opacity-90">
              Ahorro real estimado: ${savingsAmount.toLocaleString('es-AR')} ARS
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 5. CÁMARA, ESPEJO RÁPIDO & ESCÁNER QR (CAM1)
// ============================================================================
export const CameraInspectorPanel: React.FC<{
  onCopyText?: (msg: string) => void;
}> = ({ onCopyText }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true);
  const [ringLight, setRingLight] = useState(false);
  const [qrMode, setQrMode] = useState(false);
  const [capturedPhotoTime, setCapturedPhotoTime] = useState<string | null>(null);

  const startCamera = async () => {
    setCameraError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch {
      setCameraError(true);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  return (
    <div className="space-y-3 animate-spring-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <IosAppIcon appId="camara" size={38} />
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Cámara, Espejo & Escáner QR</span>
              <span className="px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[9px] font-mono">
                CAM1
              </span>
            </h4>
            <p className="text-[11px] text-neutral-400">Espejo rápido antes de videollamada y lector QR</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setRingLight(!ringLight)}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold cursor-pointer border ${
              ringLight
                ? 'bg-white text-neutral-950 border-white shadow-lg shadow-white/40'
                : 'bg-white/5 text-neutral-300 border-white/10'
            }`}
          >
            💡 Aro de Luz
          </button>
          <button
            onClick={() => setQrMode(!qrMode)}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold cursor-pointer border ${
              qrMode
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                : 'bg-white/5 text-neutral-300 border-white/10'
            }`}
          >
            Qr Escáner
          </button>
        </div>
      </div>

      {/* Camera Viewport */}
      <div
        className={`relative w-full h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-neutral-950 to-sky-950/60 flex items-center justify-center transition-all ${
          ringLight ? 'border-8 border-white shadow-[0_0_40px_rgba(255,255,255,0.65)]' : 'border border-white/15'
        }`}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${isMirrored ? 'scale-x-[-1]' : ''} ${
            cameraActive ? 'block' : 'hidden'
          }`}
        />

        {!cameraActive && (
          <div className="flex flex-col items-center justify-center text-center p-4 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Camera className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-white">
              {cameraError
                ? 'Modo Simulador de Cámara & Escáner QR Activo'
                : 'Iniciando Espejo WebRTC...'}
            </div>
            <p className="text-[11px] text-neutral-400 max-w-xs">
              Podés activar la cámara real del navegador o usar el lector QR instantáneo abajo.
            </p>
            <button
              onClick={startCamera}
              className="px-3 py-1 rounded-xl bg-sky-500 hover:bg-sky-400 text-neutral-950 font-bold text-xs cursor-pointer"
            >
              Conectar Cámara WebRTC
            </button>
          </div>
        )}

        {/* QR Framing Overlay */}
        {qrMode && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-black/30">
            <div className="w-32 h-32 border-2 border-emerald-400 rounded-2xl relative shadow-[0_0_24px_rgba(16,185,129,0.4)]">
              <div className="absolute inset-x-2 top-1/2 h-0.5 bg-emerald-400 animate-pulse" />
            </div>
            <span className="mt-2 px-2 py-0.5 rounded bg-black/75 text-emerald-300 text-[10px] font-mono">
              QR Detectado: https://mpago.la/spotlight-pro
            </span>
          </div>
        )}
      </div>

      {/* Camera Action Bar */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setIsMirrored(!isMirrored)}
          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-neutral-200 font-semibold cursor-pointer flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{isMirrored ? 'Modo Espejo' : 'Vista Real'}</span>
        </button>

        <button
          onClick={() => {
            const t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            setCapturedPhotoTime(t);
            onCopyText?.(`📸 Captura instantánea guardada (${t})`);
          }}
          className="flex-1 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-neutral-950 font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>{capturedPhotoTime ? `✓ Foto capturada (${capturedPhotoTime})` : 'Capturar Foto / Espejo'}</span>
        </button>

        {qrMode && (
          <button
            onClick={() => {
              navigator.clipboard?.writeText('https://mpago.la/spotlight-pro');
              onCopyText?.('Código QR copiado al portapapeles');
            }}
            className="px-3 py-1.5 rounded-xl bg-emerald-500 text-neutral-950 font-bold text-xs cursor-pointer"
          >
            Copiar QR
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 6. CENTRO DE CONTROL DEL SISTEMA (SYS1)
// ============================================================================
export const ControlCenterInspectorPanel: React.FC<{
  deviceState: DeviceState;
  onUpdateDevice: (partial: Partial<DeviceState>) => void;
  onCopyText?: (msg: string) => void;
}> = ({ deviceState, onUpdateDevice, onCopyText }) => {
  return (
    <div className="space-y-3 animate-spring-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <IosAppIcon appId="control" size={38} />
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Centro de Control del Sistema</span>
              <span className="px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[9px] font-mono">
                SYS1
              </span>
            </h4>
            <p className="text-[11px] text-neutral-400">
              Batería {deviceState.batteryLevel ?? 88}% • RAM {deviceState.ramUsageMb ?? 3420} MB • {deviceState.refreshRate || 120}Hz
            </p>
          </div>
        </div>
      </div>

      {/* Hardware Grid Tiles */}
      <div className="grid grid-cols-2 gap-2">
        {[
          {
            key: 'wifiEnabled',
            label: 'Wi-Fi 6E',
            sub: deviceState.wifiEnabled !== false ? 'Fibertel_5GHz' : 'Apagado',
            active: deviceState.wifiEnabled !== false,
            icon: Wifi,
            activeClass: 'bg-sky-500/25 border-sky-400 text-sky-200',
          },
          {
            key: 'bluetoothEnabled',
            label: 'Bluetooth 5.4',
            sub: deviceState.bluetoothEnabled !== false ? 'Sony WH-1000XM5' : 'Apagado',
            active: deviceState.bluetoothEnabled !== false,
            icon: Bluetooth,
            activeClass: 'bg-indigo-500/25 border-indigo-400 text-indigo-200',
          },
          {
            key: 'flashlightEnabled',
            label: 'Linterna Flash',
            sub: deviceState.flashlightEnabled ? 'Encendida' : 'Apagada',
            active: !!deviceState.flashlightEnabled,
            icon: Flashlight,
            activeClass: 'bg-amber-500/30 border-amber-400 text-amber-200',
          },
          {
            key: 'dndEnabled',
            label: 'No Molestar',
            sub: deviceState.dndEnabled ? 'Silencio Activo' : 'Desactivado',
            active: !!deviceState.dndEnabled,
            icon: Moon,
            activeClass: 'bg-purple-500/25 border-purple-400 text-purple-200',
          },
          {
            key: 'batterySaver',
            label: 'Ahorro Batería',
            sub: deviceState.batterySaver ? 'Modo Eco ON' : 'Normal',
            active: !!deviceState.batterySaver,
            icon: BatteryCharging,
            activeClass: 'bg-emerald-500/25 border-emerald-400 text-emerald-200',
          },
          {
            key: 'hotspotEnabled',
            label: 'Hotspot 5G',
            sub: deviceState.hotspotEnabled ? 'Activo (1 disp.)' : 'Apagado',
            active: !!deviceState.hotspotEnabled,
            icon: Radio,
            activeClass: 'bg-cyan-500/25 border-cyan-400 text-cyan-200',
          },
        ].map(tile => {
          const Icon = tile.icon;
          return (
            <button
              key={tile.key}
              onClick={() => {
                onUpdateDevice({ [tile.key]: !tile.active });
                onCopyText?.(`${tile.label}: ${!tile.active ? 'Activado' : 'Desactivado'}`);
              }}
              className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                tile.active ? tile.activeClass : 'bg-black/35 border-white/10 text-neutral-400 hover:text-white'
              }`}
            >
              <div className="p-2 rounded-xl bg-black/30 shrink-0">
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

      {/* Live Volume & Brightness Sliders */}
      <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="flex items-center gap-1 text-neutral-300 font-semibold">
              <Volume2 className="w-3.5 h-3.5 text-sky-400" /> Volumen del Sistema
            </span>
            <span className="font-mono text-sky-300 font-bold">{deviceState.volume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={deviceState.volume}
            onChange={e => onUpdateDevice({ volume: Number(e.target.value), isMuted: false })}
            className="w-full accent-sky-400 cursor-pointer h-1.5"
          />
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="flex items-center gap-1 text-neutral-300 font-semibold">
              <Sun className="w-3.5 h-3.5 text-amber-400" /> Brillo de Pantalla Real
            </span>
            <span className="font-mono text-amber-300 font-bold">{deviceState.brightness}%</span>
          </div>
          <input
            type="range"
            min="25"
            max="100"
            value={deviceState.brightness}
            onChange={e => onUpdateDevice({ brightness: Number(e.target.value) })}
            className="w-full accent-amber-400 cursor-pointer h-1.5"
          />
        </div>
      </div>

      {/* Refresh Rate & Audio Output */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          {([60, 90, 120] as const).map(hz => (
            <button
              key={hz}
              onClick={() => onUpdateDevice({ refreshRate: hz })}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold cursor-pointer ${
                (deviceState.refreshRate || 120) === hz
                  ? 'bg-sky-500 text-neutral-950'
                  : 'bg-white/5 text-neutral-400 border border-white/10'
              }`}
            >
              {hz}Hz
            </button>
          ))}
        </div>

        <select
          value={deviceState.audioOutputDevice || 'Parlante Moto G86'}
          onChange={e => onUpdateDevice({ audioOutputDevice: e.target.value })}
          className="bg-black/50 border border-white/15 rounded-xl px-2.5 py-1 text-[11px] text-white outline-none cursor-pointer"
        >
          <option value="Parlante Moto G86">🔊 Parlante Moto G86</option>
          <option value="Sony WH-1000XM5">🎧 Sony WH-1000XM5</option>
          <option value="Living TV Chromecast">📺 Living TV Chromecast</option>
          <option value="Auto Bluetooth">🚗 Auto Bluetooth</option>
        </select>
      </div>
    </div>
  );
};
