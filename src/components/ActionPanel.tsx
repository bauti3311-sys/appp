import React from 'react';
import { CornerDownLeft, Columns2, Settings, Search } from 'lucide-react';
import { AppConfig, SearchResult, ViewMode } from '../types';
import { getAppBrand } from './IosAppIcon';

interface ActionPanelProps {
  selectedResult?: SearchResult;
  totalCount: number;
  selectedIndex: number;
  viewMode: ViewMode;
  config?: AppConfig;
  onToggleSplitInspector: () => void;
  onToggleDashboard: () => void;
  onExecutePrimary: () => void;
  onOpenActions: () => void;
  onOpenSettings?: () => void;
  onOpenInlineScope?: (appId: string) => void;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({
  selectedResult,
  viewMode,
  config,
  onToggleSplitInspector,
  onExecutePrimary,
  onOpenActions,
  onOpenSettings,
  onOpenInlineScope,
}) => {
  const brand = getAppBrand(selectedResult ? selectedResult.id : 'default');
  const shortcutStyle = config?.shortcutStyle || 'mac';
  const showKeys = shortcutStyle !== 'touch_minimal';

  const actionsShortcut = shortcutStyle === 'pc_android' ? 'Ctrl+K' : '⌘K';
  const splitShortcut = 'Tab';
  const openShortcut = shortcutStyle === 'pc_android' ? 'Enter' : '↵';

  const cleanAppId = selectedResult?.id
    .replace('app:', '')
    .replace('cmd:', '')
    .replace('online:', '')
    .replace('raycast:', '') || '';

  const supportsInlineScope = cleanAppId === 'spotify' || cleanAppId === 'whatsapp';

  return (
    <footer
      aria-label="Barra de acciones"
      className="flex items-center justify-between px-4 py-2.5 bg-[#10151d]/95 border-t border-white/15 text-xs text-neutral-200 select-none"
    >
      {/* Left: ••• Spotlight menu + Direct Ajustes button */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onOpenActions}
          className="flex items-center gap-2 px-2.5 py-1 rounded-lg hover:bg-white/12 text-neutral-200 hover:text-white transition-colors cursor-pointer font-medium"
          title="Menú contextual y opciones de Spotlight (Ctrl+K)"
        >
          <span className="font-mono text-xs tracking-widest text-neutral-300">•••</span>
          <span>Spotlight</span>
          {showKeys && (
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] font-mono text-neutral-300">
              {actionsShortcut}
            </kbd>
          )}
        </button>

        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/15 border border-white/10 text-neutral-200 hover:text-white transition-colors cursor-pointer font-medium"
            title="Abrir Ajustes de Spotlight (⌘,)"
          >
            <Settings className="w-3.5 h-3.5 text-sky-400" />
            <span>Ajustes</span>
          </button>
        )}
      </div>

      {/* Right: Inline Search / Split Inspector / Primary Open */}
      <div className="flex items-center gap-1.5 font-mono text-[11px] shrink-0">
        {supportsInlineScope && onOpenInlineScope && (
          <button
            onClick={() => onOpenInlineScope(cleanAppId)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.07] hover:bg-white/15 text-neutral-200 border border-white/12 transition-colors cursor-pointer font-sans font-medium"
            title={`Buscar directamente en ${selectedResult?.title} dentro de la barra`}
          >
            <Search className="w-3 h-3 text-emerald-400" />
            <span>{cleanAppId === 'spotify' ? 'Buscar en Spotify' : 'Acción rápida'}</span>
          </button>
        )}

        {/* Split Inspector Toggle */}
        <button
          onClick={onToggleSplitInspector}
          style={
            viewMode === 'split_inspector'
              ? {
                  backgroundColor: `${brand.primaryColor}24`,
                  borderColor: `${brand.primaryColor}55`,
                  color: brand.primaryColor,
                }
              : {}
          }
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-sans ${
            viewMode === 'split_inspector'
              ? 'font-semibold shadow-xs'
              : 'bg-white/[0.06] hover:bg-white/12 text-neutral-200 border-white/12'
          }`}
          title="Abrir o cerrar el Inspector lateral separado (Tab)"
        >
          <Columns2 className="w-3.5 h-3.5" />
          <span>Inspector</span>
          {showKeys && (
            <kbd className="hidden md:inline px-1 py-0.2 rounded bg-black/30 text-[9px] font-mono opacity-80">
              {splitShortcut}
            </kbd>
          )}
        </button>

        {/* Primary Action Button */}
        <button
          onClick={onExecutePrimary}
          style={{
            backgroundColor: brand.primaryColor,
            boxShadow: `0 2px 10px ${brand.glowColor}`,
          }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-neutral-950 font-sans font-bold transition-all cursor-pointer hover:opacity-95 active:scale-95"
          title="Ejecutar acción principal (Enter)"
        >
          <span>Abrir</span>
          {showKeys ? (
            <span className="text-[10px] font-mono opacity-85">{openShortcut}</span>
          ) : (
            <CornerDownLeft className="w-3 h-3" />
          )}
        </button>
      </div>
    </footer>
  );
};
