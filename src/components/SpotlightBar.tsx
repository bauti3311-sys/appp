import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Search, X, Mic, Minimize2, ArrowRight } from 'lucide-react';
import { AppConfig } from '../types';
import { AppBrandInfo } from './IosAppIcon';

export const SMART_PREDICTIONS = [
  'spotify',
  'spotify buscar Daft Punk',
  'spotify connect auriculares',
  'whatsapp',
  'nota de voz whatsapp',
  'whatsapp +5491145892103',
  'youtube',
  'youtube lofi hip hop beats',
  'gmail',
  'codigo 2fa mercado pago',
  'google maps cercanos',
  'farmacias de turno cerca de mi',
  'cafeterias abiertas cerca',
  'estaciones de servicio cerca',
  'finanzas y mercado pago',
  'mi alias mercado pago',
  'dividir gastos de asado',
  'calcular cuotas sin interes',
  'camara espejo y escaner qr',
  'centro de control del sistema',
  'encender linterna',
  'telegram',
  'traductor rapido',
  'traducir gracias al ingles',
  'traducir hello al español',
  'reloj mundial',
  'hora en Tokio',
  'hora en Nueva York',
  'hora en Madrid',
  'hora en Buenos Aires',
  'buscador de emojis',
  'emoji mate',
  'emoji fuego',
  'emoji corazon',
  'temporizador 5 minutos',
  'temporizador 10 minutos',
  'cronometro',
  'generador de codigos qr',
  'qr https://google.com',
  'portapapeles',
  'archivos y quick look',
  'calculadora y divisas',
  'figma',
  'google chrome',
  'notas y borradores',
  'calendario',
  'clima en Buenos Aires',
  'clima en Madrid',
  'peli Interstellar',
  'serie Arcane',
  'donde ver Dune',
  'nota flotante comprar yerba',
  '25% de 84000',
  '1500 * 1.21',
  '100 usd a eur',
  'bajar el brillo al 35% y abrir Spotify',
  'sesion pomodoro 25 minutos',
];

interface SpotlightBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  config: AppConfig;
  brand?: AppBrandInfo;
  activeTrackTitle?: string;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onToggleMiniPill?: () => void;
  onStartDrag?: (e: React.MouseEvent | React.TouchEvent) => void;
}

export const SpotlightBar: React.FC<SpotlightBarProps> = ({
  query,
  onQueryChange,
  config,
  brand,
  activeTrackTitle,
  onKeyDown,
  onToggleMiniPill,
  onStartDrag,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const touchStartY = useRef<number | null>(null);
  const [clockStr, setClockStr] = useState(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  useEffect(() => {
    inputRef.current?.focus();
    const t = setInterval(() => {
      setClockStr(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 15000);
    return () => clearInterval(t);
  }, []);

  const accentColor = brand?.primaryColor || '#10b981';

  // --- PREDICTOR DE TEXTO ADAPTATIVO (PRIORIZA LO QUE BUSCA EL USUARIO) ---
  const adaptivePredictionPool = useMemo(() => {
    const history = config.searchHistory || [];
    const recentApps = config.recent || [];
    const combined = [
      ...history,
      ...recentApps,
      ...SMART_PREDICTIONS,
    ];
    // Deduplicate case-insensitively while preserving adaptive priority order
    const seen = new Set<string>();
    return combined.filter(item => {
      const lower = item.trim().toLowerCase();
      if (!lower || seen.has(lower)) return false;
      seen.add(lower);
      return true;
    });
  }, [config.searchHistory, config.recent]);

  const activePrediction = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed || trimmed.length < 1) return null;
    return (
      adaptivePredictionPool.find(
        p => p.toLowerCase().startsWith(trimmed) && p.toLowerCase() !== trimmed
      ) || null
    );
  }, [query, adaptivePredictionPool]);

  const ghostSuffix = activePrediction
    ? activePrediction.slice(query.length)
    : '';

  const handleApplyPrediction = (predText?: string) => {
    const target = predText || activePrediction;
    if (target) {
      onQueryChange(target);
      inputRef.current?.focus();
    }
  };

  // Keyboard navigation & Tab autocomplete
  const handleInternalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      activePrediction &&
      (e.key === 'Tab' ||
        (e.key === 'ArrowRight' && inputRef.current?.selectionStart === query.length))
    ) {
      e.preventDefault();
      handleApplyPrediction(activePrediction);
      return;
    }
    onKeyDown(e);
  };

  // Touch swipe down on search bar to clear or minimize to Mini Pill (Moto G86 gesture)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (deltaY > 45) {
      if (query) {
        onQueryChange('');
      } else if (onToggleMiniPill) {
        onToggleMiniPill();
      }
    }
    touchStartY.current = null;
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative flex flex-col px-2.5 pt-2 pb-2.5 border-b border-white/[0.07] select-none"
    >
      {/* E3: Free Drag Handle + E10: Dynamic Status Pill Header */}
      {(config.freeDrag || config.showStatusHeader) && (
        <div
          onMouseDown={config.freeDrag ? onStartDrag : undefined}
          className={`flex items-center justify-between px-2 pb-1.5 text-[10px] font-mono text-neutral-400 ${
            config.freeDrag ? 'cursor-grab active:cursor-grabbing' : ''
          }`}
          title={config.freeDrag ? 'Arrastrá desde acá para mover la ventana' : undefined}
        >
          <div className="flex items-center gap-2">
            {config.showStatusHeader && (
              <span className="font-semibold text-neutral-300">{clockStr}</span>
            )}
            {config.showStatusHeader && activeTrackTitle && (
              <span className="truncate max-w-[150px] text-neutral-400">
                • ♫ {activeTrackTitle}
              </span>
            )}
          </div>

          {config.freeDrag && (
            <div className="w-9 h-1 rounded-full bg-white/15 hover:bg-white/30 transition-colors mx-auto" />
          )}

          {config.showStatusHeader ? (
            <div className="flex items-center gap-1.5 text-neutral-400">
              <span>Wi-Fi</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-bold">
                88%
              </span>
            </div>
          ) : (
            <div className="w-8" />
          )}
        </div>
      )}

      <div className="flex items-center px-3.5 py-2.5 gap-3 rounded-2xl bg-[#1c222c]/95 border border-white/[0.09] shadow-inner">
        {/* Clean Subtle Search Icon */}
        <div
          style={{
            color: config.accentIntensity === 'vibrant' ? accentColor : '#9ca3af',
          }}
          className="flex items-center justify-center w-5 h-5 shrink-0 transition-colors duration-300"
        >
          <Search className="w-4 h-4" />
        </div>

        {/* Search Input with Layered Adaptive Ghost Text Predictor */}
        <div className="relative flex-1 flex items-center min-w-0">
          {ghostSuffix && (
            <div
              onClick={() => handleApplyPrediction()}
              className="absolute inset-0 flex items-center px-1 text-base md:text-lg font-medium pointer-events-auto cursor-pointer truncate"
              title="Presiona Tab o toca para autocompletar"
            >
              <span className="opacity-0 select-none">{query}</span>
              <span className="text-neutral-500/80 font-normal select-none">
                {ghostSuffix}
              </span>
            </div>
          )}

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            onKeyDown={handleInternalKeyDown}
            placeholder="Buscar aplicaciones y comandos..."
            className="relative z-10 w-full bg-transparent px-1 text-base md:text-lg font-medium text-neutral-100 placeholder-neutral-400/80 outline-none"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </div>

        {/* Subtle Tab / Tap Autocomplete Pill (Works on Desktop & Mobile without extra row) */}
        {activePrediction && (
          <button
            onClick={() => handleApplyPrediction()}
            style={{
              backgroundColor: `${accentColor}18`,
              borderColor: `${accentColor}35`,
              color: accentColor,
            }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-mono font-semibold transition-all cursor-pointer hover:opacity-90 active:scale-95 shrink-0"
            title={`Autocompletar "${activePrediction}" (Tab)`}
          >
            <span>Tab</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </button>
        )}

        {/* Voice query button */}
        {!query && (
          <button
            onClick={() => onQueryChange('spotify')}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Búsqueda por voz"
          >
            <Mic className="w-4 h-4" />
          </button>
        )}

        {/* Clear button if text exists */}
        {query && (
          <button
            onClick={() => {
              onQueryChange('');
              inputRef.current?.focus();
            }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Borrar texto (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Mini Pill Compact Mode Toggle */}
        {onToggleMiniPill && !query && (
          <button
            onClick={onToggleMiniPill}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/12 text-[11px] font-mono text-neutral-400 hover:text-white border border-white/10 transition-colors cursor-pointer shrink-0"
            title="Modo compacto flotante Mini Pill (Alt+M)"
          >
            <Minimize2 className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
