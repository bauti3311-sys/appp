import React, { useEffect, useRef, useState } from 'react';
import {
  Play, Copy, Star, Pin, EyeOff, Info, Share2,
  ExternalLink, X, Search, Pause, SkipForward,
  SkipBack, Volume2, MessageSquare, Send,
  Plus, Calendar, Calculator, Sparkles,
  Terminal, Settings, Globe, Zap, Eye,
  ShieldCheck, ChevronRight, ChevronDown, Download
} from 'lucide-react';
import { SearchResult, AppConfig, DeviceState } from '../types';
import { getAppBrand } from './IosAppIcon';

interface SecondaryActionsModalProps {
  result: SearchResult;
  config: AppConfig;
  isOpen: boolean;
  deviceState: DeviceState;
  onClose: () => void;
  onExecutePrimary: () => void;
  onToggleFavorite: (id: string) => void;
  onTogglePin: (id: string) => void;
  onHideSuggestion: (id: string) => void;
  onCopyText: (text: string) => void;
  onInspect: (result: SearchResult) => void;
  onQuickQuery: (query: string) => void;
  onUpdateDevice: (partial: Partial<DeviceState>) => void;
  onOpenComposer: (channel: any, target?: string, text?: string) => void;
  onOpenNewNote: () => void;
  onOpenAiPrompt: (prompt: string) => void;
  onOpenQuickLook: (fileName: string) => void;
  onOpenSettings?: () => void;
  onOpenApkBuilder?: () => void;
  onOpenInlineScope?: (appId: string) => void;
}

export const SecondaryActionsModal: React.FC<SecondaryActionsModalProps> = ({
  result,
  config,
  isOpen,
  deviceState,
  onClose,
  onExecutePrimary,
  onToggleFavorite,
  onTogglePin,
  onHideSuggestion,
  onCopyText,
  onInspect,
  onQuickQuery,
  onUpdateDevice,
  onOpenComposer,
  onOpenNewNote,
  onOpenAiPrompt,
  onOpenQuickLook,
  onOpenSettings,
  onOpenApkBuilder,
  onOpenInlineScope,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [actionQuery, setActionQuery] = useState('');
  const [copySubmenuOpen, setCopySubmenuOpen] = useState(false);
  const [permissionsExpanded, setPermissionsExpanded] = useState(false);

  const brand = getAppBrand(result.id);

  useEffect(() => {
    if (isOpen) {
      setActionQuery('');
      setCopySubmenuOpen(false);
      setPermissionsExpanded(false);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [isOpen, result.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanAppId = result.id
    .replace('app:', '')
    .replace('cmd:', '')
    .replace('online:', '')
    .replace('raycast:', '');
  const isFav = config.favorites.includes(cleanAppId);
  const isPinned =
    config.pins.includes(result.title) || config.pinnedSuggestions.includes(cleanAppId);

  const getAndroidPackageName = () => {
    if (cleanAppId.includes('spotify')) return 'com.spotify.music';
    if (cleanAppId.includes('whatsapp')) return 'com.whatsapp';
    if (cleanAppId.includes('telegram')) return 'org.telegram.messenger';
    if (cleanAppId.includes('chrome')) return 'com.android.chrome';
    if (cleanAppId.includes('youtube')) return 'com.google.android.youtube';
    if (cleanAppId.includes('figma')) return 'com.figma.mirror';
    return `dev.bautista.spotlight.${cleanAppId}`;
  };

  // Contextual App-specific actions
  const getAppSpecificActions = () => {
    if (cleanAppId.includes('spotify')) {
      return [
        {
          id: 'sp-search',
          label: 'Buscar canción o artista en Spotify',
          icon: Search,
          onClick: () => {
            if (onOpenInlineScope) {
              onOpenInlineScope('spotify');
            } else {
              onQuickQuery('spotify ');
            }
            onClose();
          },
        },
        {
          id: 'sp-toggle',
          label: deviceState.isPlaying ? 'Pausar reproducción' : 'Reanudar reproducción',
          icon: deviceState.isPlaying ? Pause : Play,
          onClick: () => {
            onUpdateDevice({ isPlaying: !deviceState.isPlaying });
            onClose();
          },
        },
        {
          id: 'sp-next',
          label: 'Siguiente canción',
          icon: SkipForward,
          onClick: () => {
            onUpdateDevice({ isPlaying: true });
            onClose();
          },
        },
        {
          id: 'sp-prev',
          label: 'Canción anterior',
          icon: SkipBack,
          onClick: () => {
            onUpdateDevice({ isPlaying: true });
            onClose();
          },
        },
      ];
    }

    if (cleanAppId.includes('whatsapp') || cleanAppId.includes('wa:')) {
      return [
        {
          id: 'wa-compose',
          label: 'Enviar mensaje rápido por WhatsApp',
          icon: MessageSquare,
          onClick: () => {
            onOpenComposer('whatsapp', '', '');
            onClose();
          },
        },
        {
          id: 'wa-inspector',
          label: 'Ver chats recientes en Split Inspector',
          icon: Send,
          onClick: () => {
            onInspect(result);
            onClose();
          },
        },
      ];
    }

    if (cleanAppId.includes('telegram')) {
      return [
        {
          id: 'tg-compose',
          label: 'Enviar mensaje por Telegram',
          icon: Share2,
          onClick: () => {
            onOpenComposer('telegram', 'Contacto', '');
            onClose();
          },
        },
        {
          id: 'tg-inspect',
          label: 'Abrir chat en Split Inspector',
          icon: Send,
          onClick: () => {
            onInspect(result);
            onClose();
          },
        },
      ];
    }

    if (cleanAppId.includes('calc')) {
      return [
        {
          id: 'calc-new',
          label: 'Nuevo cálculo matemático',
          icon: Calculator,
          onClick: () => {
            onQuickQuery('150 * 1.21');
            onClose();
          },
        },
        {
          id: 'calc-currency',
          label: 'Convertir divisas en vivo',
          icon: Globe,
          onClick: () => {
            onQuickQuery('100 USD a EUR');
            onClose();
          },
        },
      ];
    }

    if (cleanAppId.includes('note')) {
      return [
        {
          id: 'note-new',
          label: 'Crear nueva nota rápida',
          icon: Plus,
          onClick: () => {
            onOpenNewNote();
            onClose();
          },
        },
      ];
    }

    if (cleanAppId.includes('calendar')) {
      return [
        {
          id: 'cal-event',
          label: 'Crear nuevo evento en agenda',
          icon: Calendar,
          onClick: () => {
            onQuickQuery('evento Reunión mañana 10:00');
            onClose();
          },
        },
      ];
    }

    if (cleanAppId.includes('file') || result.category === 'Archivos') {
      return [
        {
          id: 'file-quicklook',
          label: 'Abrir Quick Look con OCR',
          icon: Eye,
          onClick: () => {
            onOpenQuickLook(result.title);
            onClose();
          },
        },
        {
          id: 'file-ai',
          label: 'Resumir documento con IA',
          icon: Sparkles,
          onClick: () => {
            onOpenAiPrompt(`Explicar puntos clave de ${result.title}`);
            onClose();
          },
        },
      ];
    }

    if (cleanAppId.includes('terminal')) {
      return [
        {
          id: 'term-ram',
          label: 'Liberar memoria RAM',
          icon: Zap,
          onClick: () => {
            onQuickQuery('liberar ram');
            onClose();
          },
        },
        {
          id: 'term-diag',
          label: 'Diagnóstico del sistema',
          icon: Terminal,
          onClick: () => {
            onQuickQuery('diagnostico');
            onClose();
          },
        },
      ];
    }

    if (cleanAppId.includes('setting')) {
      return [
        {
          id: 'set-sound',
          label: 'Ajustes de Sonido y Volumen',
          icon: Volume2,
          onClick: () => {
            onQuickQuery('ajustes de sonido');
            onClose();
          },
        },
        {
          id: 'set-screen',
          label: 'Ajustes de Pantalla y Brillo',
          icon: Settings,
          onClick: () => {
            onQuickQuery('ajustes de pantalla');
            onClose();
          },
        },
      ];
    }

    return [
      {
        id: 'app-open',
        label: `Abrir ${result.title}`,
        icon: ExternalLink,
        onClick: () => {
          onExecutePrimary();
          onClose();
        },
      },
    ];
  };

  const appActions = getAppSpecificActions();
  const q = actionQuery.trim().toLowerCase();

  const matchesQuery = (text: string) => !q || text.toLowerCase().includes(q);

  return (
    <>
      {/* Transparent click-away overlay (NO blur, NO dark screen dimming!) */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-transparent"
        aria-hidden="true"
      />

      {/* Floating Popover Menu anchored like Screenshot_20261107_213932 */}
      <div
        role="dialog"
        aria-label={`Acciones de ${result.title}`}
        className="fixed z-50 top-[195px] left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-[max(1.5rem,calc(50%-280px))] w-[315px] sm:w-[330px] rounded-[24px] bg-[#1a2029]/98 border border-white/15 shadow-[0_28px_70px_rgba(0,0,0,0.85)] p-3 text-neutral-200 select-none animate-spring-in backdrop-blur-xl"
      >
        {/* Top Search Pill inside Popover (Matches Screenshot_20261107_213932) */}
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-[#242b37] border border-white/15 mb-2">
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={actionQuery}
            onChange={e => setActionQuery(e.target.value)}
            placeholder={`Buscar acciones de ${result.title}...`}
            className="w-full bg-transparent text-xs font-medium text-neutral-100 placeholder-neutral-400 outline-none"
          />
          <button
            onClick={() => {
              if (actionQuery) setActionQuery('');
              else onClose();
            }}
            className="text-neutral-400 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Cerrar menú de acciones (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Actions List */}
        <div className="max-h-[340px] overflow-y-auto space-y-0.5 pr-0.5 scrollbar-thin">
          {/* 1. Favorite Toggle (Quitar favorita / Añadir a favorita) */}
          {matchesQuery(isFav ? 'Quitar favorita' : 'Añadir a favorita') && (
            <button
              onClick={() => {
                onToggleFavorite(cleanAppId);
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-neutral-200 hover:bg-white/[0.08] transition-colors cursor-pointer text-left"
            >
              <Star className={`w-4 h-4 shrink-0 ${isFav ? 'text-amber-400 fill-amber-400' : 'text-neutral-400'}`} />
              <span>{isFav ? 'Quitar favorita' : 'Añadir a favorita'}</span>
            </button>
          )}

          {/* 2. Copiar... expandable row with chevron > */}
          {matchesQuery('Copiar nombre paquete comando') && (
            <div>
              <button
                onClick={() => setCopySubmenuOpen(prev => !prev)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-neutral-200 hover:bg-white/[0.08] transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <Copy className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>Copiar...</span>
                </div>
                {copySubmenuOpen ? (
                  <ChevronDown className="w-4 h-4 text-neutral-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                )}
              </button>

              {copySubmenuOpen && (
                <div className="ml-6 pl-2 border-l border-white/10 space-y-0.5 my-1 animate-fade-in">
                  <button
                    onClick={() => {
                      onCopyText(result.title);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] text-neutral-300 hover:bg-white/10 hover:text-white cursor-pointer text-left"
                  >
                    <span>Copiar nombre («{result.title}»)</span>
                  </button>
                  <button
                    onClick={() => {
                      onCopyText(getAndroidPackageName());
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] text-neutral-300 hover:bg-white/10 hover:text-white cursor-pointer text-left"
                  >
                    <span className="font-mono">{getAndroidPackageName()}</span>
                  </button>
                  <button
                    onClick={() => {
                      onCopyText(`${result.title} — ${result.subtitle}`);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] text-neutral-300 hover:bg-white/10 hover:text-white cursor-pointer text-left"
                  >
                    <span>Copiar descripción completa</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 3. App-specific contextual actions */}
          {appActions
            .filter(act => matchesQuery(act.label))
            .map(act => {
              const Icon = act.icon;
              return (
                <button
                  key={act.id}
                  onClick={act.onClick}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-neutral-200 hover:bg-white/[0.08] transition-colors cursor-pointer text-left"
                >
                  <Icon className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span className="truncate">{act.label}</span>
                </button>
              );
            })}

          {/* 4. Pin / Hide options if searching or managing */}
          {q && matchesQuery(isPinned ? 'Desfijar' : 'Fijar en inicio') && (
            <button
              onClick={() => {
                onTogglePin(result.title);
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-neutral-200 hover:bg-white/[0.08] transition-colors cursor-pointer text-left"
            >
              <Pin className="w-4 h-4 text-neutral-400 shrink-0" />
              <span>{isPinned ? 'Desfijar de inicio' : 'Fijar en inicio'}</span>
            </button>
          )}

          {q && matchesQuery('Ocultar sugerencia') && (
            <button
              onClick={() => {
                onHideSuggestion(cleanAppId);
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
            >
              <EyeOff className="w-4 h-4 shrink-0" />
              <span>Ocultar esta sugerencia</span>
            </button>
          )}

          {/* 5. SISTEMA SECTION (Matches Screenshot_20261107_213932) */}
          <div className="pt-2 mt-1 border-t border-white/[0.08]">
            <div className="px-3 py-1 text-[11px] font-medium text-neutral-400">
              Sistema
            </div>

            {matchesQuery('Permisos y componentes públicos') && (
              <div>
                <button
                  onClick={() => setPermissionsExpanded(prev => !prev)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-neutral-200 hover:bg-white/[0.08] transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span>Permisos y componentes públicos</span>
                  </div>
                </button>

                {permissionsExpanded && (
                  <div className="mx-3 my-1 p-2.5 rounded-xl bg-black/40 border border-white/10 text-[11px] font-mono text-neutral-300 space-y-1 animate-fade-in">
                    <div className="text-neutral-400">Paquete: {getAndroidPackageName()}</div>
                    <div>• INTERNET, FOREGROUND_SERVICE</div>
                    <div>• POST_NOTIFICATIONS (Autorizado)</div>
                    <div>• MainActivity (exported=true)</div>
                  </div>
                )}
              </div>
            )}

            {matchesQuery('Información de la app Intervención en Android') && (
              <button
                onClick={() => {
                  onInspect(result);
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-neutral-200 hover:bg-white/[0.08] transition-colors cursor-pointer text-left"
              >
                <Info className="w-4 h-4 text-neutral-400 shrink-0" />
                <div>
                  <div className="text-xs font-medium text-neutral-100">Información de la app</div>
                  <div className="text-[11px] text-neutral-400">Intervención en Android</div>
                </div>
              </button>
            )}

            {onOpenSettings && matchesQuery('Ajustes de Spotlight Configuración') && (
              <button
                onClick={() => {
                  onOpenSettings();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-sky-300 hover:bg-sky-500/15 transition-colors cursor-pointer text-left mt-0.5"
              >
                <Settings className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Abrir Ajustes de Spotlight</span>
              </button>
            )}

            {onOpenApkBuilder && matchesQuery('Descargar APK Nativo Android Overlay') && (
              <button
                onClick={() => {
                  onOpenApkBuilder();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-emerald-300 hover:bg-emerald-500/15 transition-colors cursor-pointer text-left"
              >
                <Download className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Descargar APK y ZIP (Overlay)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
