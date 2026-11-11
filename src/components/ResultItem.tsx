import React, { useState, useRef } from 'react';
import { Star, Pin, MoreHorizontal, ChevronRight } from 'lucide-react';
import { SearchResult, AppConfig } from '../types';
import { IosAppIcon, getAppBrand } from './IosAppIcon';

interface ResultItemProps {
  result: SearchResult;
  isSelected: boolean;
  config: AppConfig;
  isPlayingAudio?: boolean;
  onSelect: () => void;
  onExecute: () => void;
  onOpenActions: () => void;
  onSwipeInspect?: () => void;
}

export const ResultItem: React.FC<ResultItemProps> = ({
  result,
  isSelected,
  config,
  isPlayingAudio = false,
  onSelect,
  onExecute,
  onOpenActions,
  onSwipeInspect,
}) => {
  const brand = getAppBrand(result.id);
  const touchStartX = useRef<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);

  const isSpotifyItem = result.id.includes('spotify');

  const intensity = config.accentIntensity || 'subtle';

  // Subtle, non-neon selection style (matches Screenshot_20261107_213932)
  const dynamicSelectedStyle: React.CSSProperties = isSelected
    ? {
        backgroundColor:
          intensity === 'vibrant'
            ? `${brand.primaryColor}16`
            : 'rgba(42, 54, 74, 0.55)',
        borderColor:
          intensity === 'vibrant'
            ? `${brand.primaryColor}40`
            : 'rgba(255, 255, 255, 0.08)',
        transform: swipeOffset ? `translateX(${swipeOffset}px)` : undefined,
      }
    : {
        transform: swipeOffset ? `translateX(${swipeOffset}px)` : undefined,
      };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.touches[0].clientX - touchStartX.current;
    // Allow left swipe up to -72px to trigger Split Inspector
    if (deltaX < 0) {
      setSwipeOffset(Math.max(-72, deltaX * 0.75));
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset < -42) {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(12);
      }
      onSelect();
      if (onSwipeInspect) onSwipeInspect();
    }
    setSwipeOffset(0);
    touchStartX.current = null;
  };

  const isSlim = Boolean(config.slimRows || config.density === 'compact');
  const isSpacious = config.density === 'spacious' && !config.slimRows;
  const iconSize = isSlim ? 24 : isSpacious ? 38 : 32;

  return (
    <div className="flex flex-col">
      {result.groupLabel && (
        <div className="px-4 pt-2 pb-1 text-[11px] font-medium text-neutral-400 select-none">
          {result.groupLabel}
        </div>
      )}

      <div
        onClick={onSelect}
        onDoubleClick={onExecute}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={dynamicSelectedStyle}
        className={`group relative flex items-center gap-2.5 mx-2 rounded-2xl transition-all duration-150 ease-out cursor-pointer border ${
          isSlim ? 'px-3 py-1.5 min-h-[38px]' : isSpacious ? 'px-4 py-3.5 min-h-[58px]' : 'px-3.5 py-2.5 min-h-[48px]'
        } ${
          isSelected
            ? 'text-white'
            : 'text-neutral-300 border-transparent hover:bg-white/[0.04] hover:text-white'
        } active:scale-[0.99] touch-manipulation`}
      >
        {/* Subtle Left Accent Indicator (No neon glow) */}
        {isSelected && (
          <div
            style={{
              backgroundColor:
                intensity === 'minimal' ? '#3b82f6' : brand.primaryColor,
            }}
            className="absolute left-1 top-2.5 bottom-2.5 w-1 rounded-full transition-colors duration-300 opacity-90"
          />
        )}

        {/* Authentic iOS Icon with Squircle Radius & Microinteraction */}
        <div className="shrink-0 transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
          <IosAppIcon appId={result.id} size={iconSize} />
        </div>

        {/* Title & Inline Subtitle */}
        <div className="flex-1 min-w-0 pr-1 flex items-center gap-2">
          <span className={`${isSlim ? 'text-xs' : 'text-sm'} font-semibold truncate tracking-tight text-neutral-100 shrink-0 max-w-[180px] sm:max-w-[215px]`}>
            {result.title}
          </span>

          {result.subtitle && (isSlim || !isSelected) && (
            <span className="text-xs text-neutral-400/90 truncate font-normal">
              {result.subtitle}
            </span>
          )}

          {/* Animated Equalizer Bars if Spotify is playing */}
          {isSpotifyItem && isPlayingAudio && (
            <div className="flex items-end gap-0.5 h-3.5 px-1 shrink-0" title="Reproduciendo ahora">
              <span style={{ backgroundColor: brand.primaryColor }} className="w-0.5 rounded-full eq-bar-1" />
              <span style={{ backgroundColor: brand.primaryColor }} className="w-0.5 rounded-full eq-bar-2" />
              <span style={{ backgroundColor: brand.primaryColor }} className="w-0.5 rounded-full eq-bar-3" />
            </div>
          )}
        </div>

        {/* Swipe Hint on Touch Drag */}
        {swipeOffset < -15 && (
          <div
            style={{ color: brand.primaryColor }}
            className="flex items-center gap-0.5 text-[10px] font-mono font-bold shrink-0 animate-pulse"
          >
            <span>Inspector</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        )}

        {/* Right Category & Star Indicator */}
        <div className="flex items-center gap-1.5 shrink-0 text-xs text-neutral-400">
          <span className="text-[11px] text-neutral-400 font-normal">
            {result.category === 'Aplicaciones' ? 'Aplicación' : result.category}
          </span>

          {result.isFavorite && (
            <span title="Favorito">
              <Star className="w-3.5 h-3.5 text-neutral-400 hover:text-amber-400 transition-colors shrink-0" />
            </span>
          )}

          {result.isPinned && !result.isFavorite && (
            <span title="Fijado en inicio">
              <Pin className="w-3 h-3 text-sky-400 shrink-0" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
