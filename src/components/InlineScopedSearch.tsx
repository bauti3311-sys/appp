import React, { useState, useRef, useEffect } from 'react';
import {
  CornerUpLeft, Play, Pause, Columns2,
  Send, Radio, ExternalLink
} from 'lucide-react';
import { AppConfig, DeviceState } from '../types';
import { IosAppIcon, getAppBrand } from './IosAppIcon';
import { AndroidIntents } from '../lib/androidIntents';

interface InlineScopedSearchProps {
  appId: string;
  config: AppConfig;
  deviceState: DeviceState;
  onBack: () => void;
  onOpenInspector: () => void;
  onOpenActionsMenu: () => void;
  onOpenSettings: () => void;
  onUpdateDevice: (partial: Partial<DeviceState>) => void;
  onShowToast: (msg: string) => void;
}

type SpotifyScopeFilter = 'Tema' | 'Artista' | 'Álbum' | 'Lista';

const SPOTIFY_QUICK_TRACKS = [
  { id: 'sp-1', title: 'Instant Crush', artist: 'Daft Punk ft. Julian Casablancas', album: 'Random Access Memories', type: 'Tema', freq: 440 },
  { id: 'sp-2', title: 'Starboy', artist: 'The Weeknd, Daft Punk', album: 'Starboy', type: 'Tema', freq: 523.25 },
  { id: 'sp-3', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', type: 'Tema', freq: 587.33 },
  { id: 'sp-4', title: 'De Música Ligera', artist: 'Soda Stereo', album: 'Canción Animal', type: 'Artista', freq: 493.88 },
  { id: 'sp-5', title: 'Random Access Memories', artist: 'Daft Punk', album: 'Álbum Completo', type: 'Álbum', freq: 392.0 },
  { id: 'sp-6', title: 'Coding & Focus Lofi Beats', artist: 'Spotlight Curated', album: '48 canciones', type: 'Lista', freq: 349.23 },
];

export const InlineScopedSearch: React.FC<InlineScopedSearchProps> = ({
  appId,
  config,
  deviceState,
  onBack,
  onOpenInspector,
  onOpenActionsMenu,
  onOpenSettings,
  onUpdateDevice,
  onShowToast,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [subQuery, setSubQuery] = useState('');
  const [spotifyFilter, setSpotifyFilter] = useState<SpotifyScopeFilter>('Tema');
  const [waFilter, setWaFilter] = useState<'Mensaje' | 'Nota de Voz' | 'Sin Agendar (wa.me)' | 'Enviar Alias'>('Mensaje');
  const [waTarget, setWaTarget] = useState('Martín');

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 20);
  }, [appId]);

  const brand = getAppBrand(appId);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      if (subQuery) setSubQuery('');
      else onBack();
    } else if (e.key === 'Backspace' && !subQuery) {
      onBack();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      onOpenInspector();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handlePrimarySubmit();
    }
  };

  const handlePrimarySubmit = () => {
    if (appId === 'spotify') {
      const q = subQuery.trim();
      AndroidIntents.openSpotify(q);
    } else if (appId === 'whatsapp') {
      if (waFilter === 'Sin Agendar (wa.me)') {
        const cleanPhone = subQuery.replace(/\D/g, '') || '5491145892103';
        AndroidIntents.openWhatsApp({ phone: cleanPhone });
      } else if (waFilter === 'Enviar Alias') {
        const alias = config.paymentAlias || 'bauti.spotlight.mp';
        const cbu = config.paymentCbu || '0000003100084920194821';
        navigator.clipboard?.writeText(alias).catch(() => {});
        AndroidIntents.openWhatsApp({
          text: `Te paso mi alias para transferir:\nAlias: ${alias}\nCVU: ${cbu}`,
        });
      } else {
        AndroidIntents.openWhatsApp({
          text: subQuery.trim() || `¡Hola ${waTarget}!`,
        });
      }
    } else {
      AndroidIntents.launchAppById(appId, subQuery);
    }
  };

  const filteredSpotifyTracks = SPOTIFY_QUICK_TRACKS.filter(t => {
    const matchesQ =
      !subQuery.trim() ||
      t.title.toLowerCase().includes(subQuery.toLowerCase()) ||
      t.artist.toLowerCase().includes(subQuery.toLowerCase());
    const matchesFilter = !subQuery.trim() ? t.type === spotifyFilter || spotifyFilter === 'Tema' : true;
    return matchesQ && matchesFilter;
  }).slice(0, 3);

  return (
    <div className="flex flex-col w-full select-none animate-spring-in">
      {/* =====================================================================
          1. SCOPED HEADER (Matches Screenshot_20261107_170643_ChatGPT_9c483b40.jpg)
             Left: ↩ Back button + App small icon + App colored title + Input
             Right: ••• Menu button
      ===================================================================== */}
      <div className="p-2.5 border-b border-white/[0.08]">
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[#1a2029]/95 border border-white/[0.09] shadow-inner">
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            <button
              onClick={onBack}
              className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              title="Volver a la barra principal (Esc)"
            >
              <CornerUpLeft className="w-4 h-4" />
            </button>

            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <IosAppIcon appId={appId} size={16} />
                <span
                  style={{ color: brand.primaryColor }}
                  className="text-xs font-semibold tracking-tight"
                >
                  {appId === 'spotify'
                    ? 'Spotify'
                    : appId === 'whatsapp'
                    ? 'WhatsApp'
                    : appId === 'youtube'
                    ? 'YouTube'
                    : appId === 'gmail'
                    ? 'Gmail y 2FA'
                    : 'Aplicación'}
                </span>
              </div>

              <input
                ref={inputRef}
                type="text"
                value={subQuery}
                onChange={e => setSubQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  appId === 'spotify'
                    ? 'Buscar canción o artista'
                    : appId === 'whatsapp'
                    ? waFilter === 'Sin Agendar (wa.me)'
                      ? 'Ingresá número (ej: +54 9 11 4589-2103)...'
                      : `Escribir mensaje para ${waTarget}...`
                    : 'Escribir comando o búsqueda...'
                }
                className="w-full bg-transparent text-base md:text-lg font-medium text-neutral-100 placeholder-neutral-400/80 outline-none"
                autoFocus
                spellCheck={false}
              />
            </div>
          </div>

          <button
            onClick={onOpenActionsMenu}
            className="px-2.5 py-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer font-mono text-xs tracking-widest shrink-0"
            title="Opciones y acciones (Ctrl+K)"
          >
            •••
          </button>
        </div>
      </div>

      {/* =====================================================================
          2. SCOPED BODY CONTAINER (Matches Screenshot_20261107_170643_ChatGPT_9c483b40.jpg)
      ===================================================================== */}
      <div className="p-2.5">
        {appId === 'spotify' ? (
          <div className="rounded-2xl bg-[#1a2029]/90 border border-white/[0.09] p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white tracking-tight">
                Buscar en Spotify
              </h4>
              {deviceState.activeMediaTrack && (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span className="truncate max-w-[200px]">
                    {deviceState.activeMediaTrack.title} · {deviceState.activeMediaTrack.artist}
                  </span>
                </div>
              )}
            </div>

            {/* Filter Chips: Tema | Artista | Álbum | Lista */}
            <div className="flex items-center gap-2 flex-wrap">
              {(['Tema', 'Artista', 'Álbum', 'Lista'] as SpotifyScopeFilter[]).map(filter => {
                const isSelected = spotifyFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setSpotifyFilter(filter)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/45 shadow-xs'
                        : 'bg-white/[0.04] hover:bg-white/[0.09] text-neutral-300 border-white/10'
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>

            {/* Quick Playable Results when user types or browses */}
            {subQuery.trim().length > 0 && (
              <div className="space-y-1 pt-1">
                {filteredSpotifyTracks.map(track => (
                  <button
                    key={track.id}
                    onClick={() => {
                      AndroidIntents.openSpotify(`${track.title} ${track.artist}`);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-black/30 hover:bg-emerald-500/15 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer text-left group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Play className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <div className="truncate">
                        <span className="text-xs font-semibold text-white">{track.title}</span>
                        <span className="text-[11px] text-neutral-400 ml-2">{track.artist}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 opacity-80 group-hover:opacity-100">
                      Abrir en Spotify
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Action Pills Row */}
            <div className="flex items-center justify-between gap-2 pt-0.5 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrimarySubmit}
                  className="px-4 py-2 rounded-full bg-white/[0.12] hover:bg-emerald-500 hover:text-neutral-950 text-neutral-200 font-semibold text-xs transition-all cursor-pointer border border-white/10"
                >
                  Buscar en Spotify
                </button>

                <button
                  onClick={() => AndroidIntents.openSpotify()}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-neutral-300 text-xs font-medium transition-colors cursor-pointer border border-white/10"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Abrir App Spotify</span>
                </button>
              </div>

              <button
                onClick={onOpenInspector}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold transition-colors cursor-pointer"
                title="Abrir Inspector Studio lateral con Letras, Connect y Ecualizador (Tab)"
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span>Abrir Inspector Studio</span>
              </button>
            </div>
          </div>
        ) : appId === 'whatsapp' ? (
          <div className="rounded-2xl bg-[#1a2029]/90 border border-white/[0.09] p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white tracking-tight">
                Acción directa en WhatsApp
              </h4>
              <div className="flex items-center gap-1">
                {['Martín', 'Sofi (Facu)', 'Grupo Asado'].map(contact => (
                  <button
                    key={contact}
                    onClick={() => setWaTarget(contact)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold cursor-pointer transition-colors ${
                      waTarget === contact
                        ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40'
                        : 'bg-white/5 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {contact}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {(['Mensaje', 'Nota de Voz', 'Sin Agendar (wa.me)', 'Enviar Alias'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setWaFilter(mode)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                    waFilter === mode
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/45'
                      : 'bg-white/[0.04] hover:bg-white/[0.09] text-neutral-300 border-white/10'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between gap-2 pt-0.5">
              <button
                onClick={handlePrimarySubmit}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.12] hover:bg-emerald-500 hover:text-neutral-950 text-neutral-200 font-semibold text-xs transition-all cursor-pointer border border-white/10"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {waFilter === 'Sin Agendar (wa.me)'
                    ? 'Abrir Chat Directo wa.me'
                    : waFilter === 'Enviar Alias'
                    ? `Enviar Mi Alias (${config.paymentAlias || 'bauti.spotlight.mp'})`
                    : `Enviar a ${waTarget}`}
                </span>
              </button>

              <button
                onClick={onOpenInspector}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold transition-colors cursor-pointer"
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span>Abrir Inspector WhatsApp</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-[#1a2029]/90 border border-white/[0.09] p-4 flex items-center justify-between">
            <span className="text-xs text-neutral-300">
              Presiona <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px]">Enter</kbd> o abre el Inspector lateral para controles avanzados.
            </span>
            <button
              onClick={onOpenInspector}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/35 text-xs font-semibold cursor-pointer"
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>Abrir Inspector</span>
            </button>
          </div>
        )}
      </div>

      {/* =====================================================================
          3. HIGH-CONTRAST FOOTER (Matches Screenshot_20261107_170643_ChatGPT_9c483b40.jpg)
      ===================================================================== */}
      <footer className="flex items-center justify-between px-4 py-2.5 bg-[#10151d]/95 border-t border-white/15 text-xs text-neutral-300">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-neutral-300 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Conexión autorizada</span>
          </span>
          <button
            onClick={onOpenSettings}
            className="text-[11px] text-neutral-400 hover:text-white underline-offset-2 hover:underline cursor-pointer"
          >
            Ajustes
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-neutral-400 hover:text-white text-xs font-medium cursor-pointer transition-colors"
          >
            Volver
          </button>
          <button
            onClick={handlePrimarySubmit}
            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs cursor-pointer transition-colors"
          >
            Buscar
          </button>
        </div>
      </footer>
    </div>
  );
};
