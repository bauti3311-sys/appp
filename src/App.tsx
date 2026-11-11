import React, { useState, useEffect, useRef } from 'react';
import {
  AppConfig, SearchCategory, SearchResult, DeviceState,
  InfoCardData, LocalPlanData, ViewMode, StickyNoteItem
} from './types';
import { PreferencesStore, INITIAL_DEVICE_STATE } from './lib/preferences';
import { SearchEngine } from './lib/searchEngine';
import { OnlineTools } from './lib/onlineTools';
import { AndroidIntents } from './lib/androidIntents';
import { SpotlightBar } from './components/SpotlightBar';
import { ResultItem } from './components/ResultItem';
import { ActionPanel } from './components/ActionPanel';
import { SplitInspector } from './components/SplitInspector';
import { DashboardView } from './components/DashboardView';
import { OsSettingsBackground } from './components/OsSettingsBackground';
import { SecondaryActionsModal } from './components/SecondaryActionsModal';
import { PlanReviewModal } from './components/PlanReviewModal';
import { InfoCardModal } from './components/InfoCardModal';
import { FocusSessionModal } from './components/FocusSessionModal';
import { ComposeMessageModal } from './components/ComposeMessageModal';
import { NotesModal } from './components/NotesModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { SettingsModal } from './components/SettingsModal';
import { AndroidApkBuilderModal } from './components/AndroidApkBuilderModal';
import { InlineScopedSearch } from './components/InlineScopedSearch';
import { IosAppIcon, getAppBrand } from './components/IosAppIcon';
import {
  Sparkles, Command, Palette, Smartphone, Tablet, Monitor,
  Maximize2, Minimize2, Search, Play, RotateCcw, X, GripHorizontal, Eye, Download, Settings
} from 'lucide-react';

export type DeviceModel = 'moto_g86' | 'galaxy_tab' | 'responsive';
export type OverlaySurfaceStyle = 'liquid_glass' | 'oled_black' | 'obsidian';

export const App: React.FC = () => {
  const [config, setConfig] = useState<AppConfig>(PreferencesStore.load);
  const [deviceState, setDeviceState] = useState<DeviceState>(INITIAL_DEVICE_STATE);
  const [query, setQuery] = useState('');
  const [selectedCategory] = useState<SearchCategory>('Todo');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // View modes & Native Overlay Bar Visibility
  // Starts with ONLY the floating bar ('suggestions') and Settings closed (isSettingsPageOpen = false)
  const [viewMode, setViewMode] = useState<ViewMode>('suggestions');
  const [inlineScopedApp, setInlineScopedApp] = useState<string | null>(null);
  const [surfaceStyle] = useState<OverlaySurfaceStyle>('liquid_glass');
  const [isMiniPill, setIsMiniPill] = useState(false);
  const [isSpotlightHidden, setIsSpotlightHidden] = useState(false);
  const [isSettingsPageOpen, setIsSettingsPageOpen] = useState(false);

  // Device form factor: Moto G86 phone vs Galaxy Tab A9+ tablet vs Responsive
  const [deviceModel, setDeviceModel] = useState<DeviceModel>('galaxy_tab');
  const [mobileInspectorOpen, setMobileInspectorOpen] = useState(false);

  // E8: Focus Dimming state when interacting with Split Inspector
  const [isInspectorFocused, setIsInspectorFocused] = useState(false);

  // E3: Free Window Dragging offsets for Search Card and Inspector Card
  const [barOffset, setBarOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [inspectorOffset, setInspectorOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragTargetRef = useRef<{
    type: 'bar' | 'inspector' | 'sticky';
    stickyId?: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  // Modals state
  const [activePlan, setActivePlan] = useState<LocalPlanData | null>(null);
  const [secondaryActionResult, setSecondaryActionResult] = useState<SearchResult | null>(null);
  const [infoCardData, setInfoCardData] = useState<InfoCardData | null>(null);
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);
  const [composeData, setComposeData] = useState<{ channel: any; target: string; text: string } | null>(null);
  const [activeNote, setActiveNote] = useState<{ id?: string; title: string; content: string } | null>(null);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isApkBuilderOpen, setIsApkBuilderOpen] = useState(false);
  const [copyToast, setCopyToast] = useState<string | null>(null);

  const resultsListRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLElement>(null);

  // Subtle Web Audio UI Click sound when config.soundEffects is enabled
  const playUiSound = (freq = 520) => {
    if (!config.soundEffects || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Ignore audio context restrictions
    }
  };

  // Reactive Specular Highlight for Liquid Glass
  const handlePointerMove = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
    if (!mainCardRef.current) return;
    const rect = mainCardRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    mainCardRef.current.style.setProperty('--mouse-x', `${x}%`);
    mainCardRef.current.style.setProperty('--mouse-y', `${y}%`);
  };

  // Save config
  const handleUpdateConfig = (updated: AppConfig) => {
    setConfig(updated);
    PreferencesStore.save(updated);
    playUiSound(580);
  };

  const handleUpdateDevice = (partial: Partial<DeviceState>) => {
    setDeviceState(prev => ({ ...prev, ...partial }));
  };

  // E3 & F2: Global Pointer Move / Up for Window & Sticky Note Dragging
  useEffect(() => {
    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
      if (!dragTargetRef.current) return;
      const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
      const dx = clientX - dragTargetRef.current.startX;
      const dy = clientY - dragTargetRef.current.startY;

      if (dragTargetRef.current.type === 'bar') {
        setBarOffset({
          x: dragTargetRef.current.origX + dx,
          y: dragTargetRef.current.origY + dy,
        });
      } else if (dragTargetRef.current.type === 'inspector') {
        setInspectorOffset({
          x: dragTargetRef.current.origX + dx,
          y: dragTargetRef.current.origY + dy,
        });
      } else if (dragTargetRef.current.type === 'sticky' && dragTargetRef.current.stickyId) {
        const sid = dragTargetRef.current.stickyId;
        const nextNotes = (config.floatingNotes || []).map(n =>
          n.id === sid
            ? {
                ...n,
                x: Math.max(8, dragTargetRef.current!.origX + dx),
                y: Math.max(44, dragTargetRef.current!.origY + dy),
              }
            : n
        );
        setConfig(prev => ({ ...prev, floatingNotes: nextNotes }));
      }
    };

    const handleGlobalUp = () => {
      if (dragTargetRef.current?.type === 'sticky') {
        PreferencesStore.save(config);
      }
      dragTargetRef.current = null;
    };

    window.addEventListener('mousemove', handleGlobalMove);
    window.addEventListener('mouseup', handleGlobalUp);
    window.addEventListener('touchmove', handleGlobalMove);
    window.addEventListener('touchend', handleGlobalUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMove);
      window.removeEventListener('mouseup', handleGlobalUp);
      window.removeEventListener('touchmove', handleGlobalMove);
      window.removeEventListener('touchend', handleGlobalUp);
    };
  }, [config]);

  const startWindowDrag = (type: 'bar' | 'inspector', e: React.MouseEvent | React.TouchEvent) => {
    if (config.freeDrag === false) return;
    const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
    const orig = type === 'bar' ? barOffset : inspectorOffset;
    dragTargetRef.current = {
      type,
      startX: clientX,
      startY: clientY,
      origX: orig.x,
      origY: orig.y,
    };
  };

  const startStickyDrag = (note: StickyNoteItem, e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
    dragTargetRef.current = {
      type: 'sticky',
      stickyId: note.id,
      startX: clientX,
      startY: clientY,
      origX: note.x,
      origY: note.y,
    };
  };

  // Get search results (respecting config.suggestions when query is empty)
  const rawResults = SearchEngine.search(query, config, selectedCategory);
  const results = !query.trim() && config.suggestions === false ? [] : rawResults;

  // Selected result & active brand accent
  const selectedResult = results[selectedIndex] || rawResults[0];
  const activeBrand = getAppBrand(selectedResult ? selectedResult.id : 'default');

  // Keep index valid
  useEffect(() => {
    if (selectedIndex >= results.length) {
      setSelectedIndex(Math.max(0, results.length - 1));
    }
  }, [results.length, selectedIndex]);

  // Scroll into view
  useEffect(() => {
    const activeEl = resultsListRef.current?.children[selectedIndex + 1] as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // Global shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Alt+S to toggle Spotlight Bar visibility so user can touch background settings freely
      if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        setIsSpotlightHidden(prev => !prev);
        setIsMiniPill(false);
        return;
      }

      if (e.altKey && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        setIsSpotlightHidden(false);
        setIsMiniPill(prev => !prev);
        return;
      }

      if (e.key === 'Tab' && !e.metaKey && !e.ctrlKey && !isSpotlightHidden) {
        e.preventDefault();
        if (isMiniPill) {
          setIsMiniPill(false);
          setViewMode('split_inspector');
          return;
        }
        setViewMode(prev => (prev === 'split_inspector' ? 'suggestions' : 'split_inspector'));
        setMobileInspectorOpen(prev => !prev);
        return;
      }

      if (e.altKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        setIsSpotlightHidden(false);
        setIsMiniPill(false);
        setViewMode(prev => (prev === 'dashboard' ? 'split_inspector' : 'dashboard'));
        return;
      }

      if ((e.metaKey && e.key === 'j') || (e.ctrlKey && e.key === 'j')) {
        e.preventDefault();
        setAiPrompt(query || '¿Cómo puedo automatizar mis tareas en Spotlight Next?');
        return;
      }

      if ((e.metaKey && e.key === 'k') || (e.ctrlKey && e.key === 'k')) {
        e.preventDefault();
        if (results[selectedIndex]) {
          setSecondaryActionResult(prev => (prev ? null : results[selectedIndex]));
        }
        return;
      }

      if ((e.metaKey && e.key === ',') || (e.ctrlKey && e.key === ',')) {
        e.preventDefault();
        setIsSettingsPageOpen(prev => !prev);
        return;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [results, selectedIndex, query, isMiniPill, isSpotlightHidden]);

  // Search input keydown handler
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      playUiSound(480);
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      playUiSound(540);
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        executePrimaryAction(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      if (inlineScopedApp) {
        e.preventDefault();
        setInlineScopedApp(null);
      } else if (query) {
        e.preventDefault();
        setQuery('');
      } else if (viewMode === 'split_inspector' || viewMode === 'dashboard') {
        setViewMode('suggestions');
        setMobileInspectorOpen(false);
      } else {
        setIsSpotlightHidden(true);
      }
    }
  };

  const showToast = (message: string) => {
    setCopyToast(message);
    setTimeout(() => setCopyToast(null), 2200);
  };

  // Adaptive learning
  const recordAdaptiveUsage = (result: SearchResult, currentQuery: string) => {
    if (config.privateMode || !config.learning) return;
    const cleanId = result.id.replace(/^(?:app:|raycast:)/, '');
    const currentCounts = config.usageCounts || {};
    const newCounts = {
      ...currentCounts,
      [cleanId]: (currentCounts[cleanId] || 0) + 1,
    };
    const newRecent = [cleanId, ...config.recent.filter(id => id !== cleanId)].slice(0, 15);
    const trimmedQ = currentQuery.trim();
    const prevHistory = config.searchHistory || [];
    const newHistory =
      trimmedQ.length >= 2
        ? [trimmedQ, ...prevHistory.filter(q => q.toLowerCase() !== trimmedQ.toLowerCase())].slice(0, 15)
        : prevHistory;

    handleUpdateConfig({
      ...config,
      recent: newRecent,
      usageCounts: newCounts,
      searchHistory: newHistory,
    });
  };

  const executePrimaryAction = async (result: SearchResult) => {
    if (config.haptics !== false) {
      navigator.vibrate?.(10);
    }
    playUiSound(660);
    recordAdaptiveUsage(result, query);

    if (config.autoClearOnLaunch && query.trim().length > 0) {
      setQuery('');
    }

    const act = result.action;
    switch (act.type) {
      case 'launch': {
        if (act.appId === 'apk_builder') {
          setIsApkBuilderOpen(true);
          showToast('Abriendo Constructor de APK Nativo (Overlay)');
          break;
        }
        if (act.appId === 'settings') {
          setIsSettingsPageOpen(true);
          showToast('Ajustes de Spotlight abiertos');
          break;
        }
        if (act.appId === 'clipboard' || act.appId === 'emojis') {
          setInlineScopedApp(null);
          setViewMode('split_inspector');
          if (deviceModel === 'moto_g86') setMobileInspectorOpen(true);
          break;
        }
        if (act.appId === 'sticky' || act.appId === 'notes') {
          setActiveNote({ title: '', content: '' });
          setIsNotesModalOpen(true);
          break;
        }
        // Directly fire real Android URL schemes & Intents (intent://..., whatsapp://send, spotify://, https://www.google.com/search?q=)
        // via window.location.href so the native Android phone opens the real installed application
        AndroidIntents.launchAppById(act.appId, query, act.url);
        break;
      }

      case 'plan':
        setActivePlan(act.plan);
        break;

      case 'copy':
        try {
          await navigator.clipboard.writeText(act.text);
          showToast(`Copiado: ${act.text.slice(0, 40)}`);
        } catch {
          showToast('Copiado al portapapeles');
        }
        break;

      case 'restore_query':
        setQuery(act.query);
        setSelectedIndex(0);
        break;

      case 'routine':
        handleUpdateDevice({ volume: act.volume });
        setIsFocusModalOpen(true);
        break;

      case 'compose_message': {
        const cleanPhone = /^\+?\d{6,15}$/.test((act.target || '').replace(/[\s()-]/g, ''))
          ? act.target.replace(/[^\d]/g, '')
          : undefined;
        if (act.channel === 'whatsapp' || act.channel === 'whatsapp_business') {
          AndroidIntents.openWhatsApp({ phone: cleanPhone, text: act.text || '' });
        } else if (act.channel === 'telegram') {
          AndroidIntents.openTelegram(act.text || '');
        } else if (act.channel === 'email') {
          AndroidIntents.openGmail({ to: act.target, body: act.text || '' });
        } else {
          setComposeData({
            channel: act.channel,
            target: act.target,
            text: act.text || '',
          });
        }
        break;
      }

      case 'new_note':
        setActiveNote({ title: '', content: '' });
        setIsNotesModalOpen(true);
        break;

      case 'edit_note': {
        const note = config.notes.find(n => n.id === act.id);
        if (note) {
          setActiveNote(note);
          setIsNotesModalOpen(true);
        }
        break;
      }

      case 'expand_snippet': {
        const now = new Date();
        const expanded = act.template
          .replace(/\{fecha\}/g, now.toLocaleDateString())
          .replace(/\{hora\}/g, now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
          .replace(/\{nombre\}/g, 'Equipo')
          .replace(/\{asunto\}/g, 'Seguimiento');
        await navigator.clipboard.writeText(expanded);
        showToast('Snippet expandido y copiado');
        break;
      }

      case 'lookup': {
        showToast('Consultando en línea...');
        try {
          const card = await OnlineTools.lookup(act.lookupType, act.query);
          setInfoCardData(card);
        } catch {
          AndroidIntents.searchGoogle(act.query);
        }
        break;
      }

      case 'device': {
        const cmd = act.command;
        if (cmd.startsWith('volume:')) {
          const val = parseInt(cmd.replace('volume:', ''), 10);
          handleUpdateDevice({ volume: val, isMuted: val === 0 });
          AndroidIntents.triggerDeviceCommand(cmd);
        } else if (cmd.startsWith('brightness:')) {
          const val = parseInt(cmd.replace('brightness:', ''), 10);
          handleUpdateDevice({ brightness: val });
          AndroidIntents.triggerDeviceCommand(cmd);
        } else if (cmd === 'volume_up') {
          const nextVal = Math.min(100, deviceState.volume + 10);
          handleUpdateDevice({ volume: nextVal, isMuted: false });
          AndroidIntents.triggerDeviceCommand(cmd);
        } else if (cmd === 'volume_down') {
          const nextVal = Math.max(0, deviceState.volume - 10);
          handleUpdateDevice({ volume: nextVal, isMuted: nextVal === 0 });
          AndroidIntents.triggerDeviceCommand(cmd);
        } else if (cmd === 'mute') {
          handleUpdateDevice({ isMuted: true });
          AndroidIntents.triggerDeviceCommand(cmd);
        } else if (cmd === 'unmute') {
          handleUpdateDevice({ isMuted: false });
          AndroidIntents.triggerDeviceCommand(cmd);
        } else if (cmd === 'pause' || cmd === 'play_pause') {
          handleUpdateDevice({ isPlaying: !deviceState.isPlaying });
          showToast(deviceState.isPlaying ? 'Pausado' : 'Reproduciendo');
        } else if (cmd === 'encender linterna') {
          handleUpdateDevice({ flashlightEnabled: true });
          showToast('🔦 Linterna Flash encendida');
        } else if (cmd === 'apagar linterna') {
          handleUpdateDevice({ flashlightEnabled: false });
          showToast('🔦 Linterna Flash apagada');
        } else {
          AndroidIntents.triggerDeviceCommand(cmd);
        }
        break;
      }

      case 'ask_ai':
        setAiPrompt(act.prompt);
        break;
    }
  };

  // Determine viewport width style according to selected device model
  const isPhone = deviceModel === 'moto_g86';
  const isSplit = viewMode === 'split_inspector';
  const isDashboard = viewMode === 'dashboard';
  const isLightMode = config.theme === 'light';
  const isSpotlightVisible = !isSpotlightHidden && !isMiniPill;

  // Functional visual preset classes + inline styles (Glass, Raycast, macOS, iOS, Graphite, Hybrid)
  const getOverlaySurfaceClasses = () => {
    if (isLightMode) {
      return 'pearl-light-surface text-slate-900';
    }
    if (surfaceStyle === 'oled_black') {
      return 'bg-black/98 border-white/15';
    }
    switch (config.preset) {
      case 'glass':
        return 'bg-[#0c1422]/75 liquid-glass';
      case 'raycast':
        return 'bg-[#111216]/98 border-white/20';
      case 'macos':
        return 'bg-[#18202c]/90 liquid-glass';
      case 'ios':
        return 'bg-[#070a0f]/94 liquid-glass';
      case 'graphite':
        return 'bg-[#18181b]/96 border-neutral-700';
      case 'hybrid':
      default:
        return surfaceStyle === 'obsidian' ? 'bg-[#0b1017]/95 glass-surface' : 'bg-[#0d131c]/88 liquid-glass';
    }
  };

  const uiScale = config.uiScale ?? 1.0;
  const textScale = config.textScale ?? 1.0;
  const barWidth = config.barWidth ?? 440;
  const inspectorWidth = config.inspectorWidth ?? 485;
  const splitGap = config.splitGap ?? 18;
  const cornerRadius = isPhone
    ? 30
    : config.preset === 'raycast'
    ? Math.min(config.corner ?? 16, 16)
    : config.preset === 'ios'
    ? Math.max(config.corner ?? 28, 28)
    : config.corner ?? 22;
  const accentIntensity = config.accentIntensity || 'subtle';
  const borderWidthPx = config.borderWidth ?? 1;
  const blurPx = config.blur === false ? 0 : (config.glassIntensity ?? 28);

  const subtleBorderColor = isLightMode
    ? 'rgba(15, 23, 42, 0.14)'
    : accentIntensity === 'vibrant'
    ? `${activeBrand.primaryColor}50`
    : config.preset === 'raycast'
    ? 'rgba(255, 255, 255, 0.18)'
    : 'rgba(255, 255, 255, 0.12)';

  const shadowByElevation =
    config.shadowSize === 'soft'
      ? '0 14px 36px -8px rgba(0, 0, 0, 0.55)'
      : config.shadowSize === 'medium'
      ? '0 20px 52px -10px rgba(0, 0, 0, 0.72)'
      : '0 28px 75px -12px rgba(0, 0, 0, 0.86)';

  const subtleBoxShadow =
    accentIntensity === 'vibrant'
      ? `${shadowByElevation}, 0 0 28px -12px ${activeBrand.glowColor}`
      : `${shadowByElevation}, 0 0 1px 1px rgba(255, 255, 255, 0.05)`;

  const hasCustomWindowOffset = barOffset.x !== 0 || barOffset.y !== 0 || inspectorOffset.x !== 0 || inspectorOffset.y !== 0;

  const stickyBgByColor: Record<StickyNoteItem['color'], string> = {
    amber: 'bg-amber-400/95 text-neutral-950 border-amber-200',
    sky: 'bg-sky-400/95 text-neutral-950 border-sky-200',
    emerald: 'bg-emerald-400/95 text-neutral-950 border-emerald-200',
    rose: 'bg-rose-400/95 text-neutral-950 border-rose-200',
    purple: 'bg-purple-400/95 text-neutral-950 border-purple-200',
  };

  const standaloneBarWidth = Math.max(barWidth, 650);

  return (
    <div
      data-theme={config.theme || 'dark'}
      data-font={config.fontFamily || 'inter'}
      data-icon-style={config.iconStyle || 'original'}
      data-spring={config.springPhysics || 'smooth_ios'}
      onClick={e => {
        // Clicking the empty backdrop outside the bar when Settings is closed dismisses the bar like a native Android overlay
        if (e.target === e.currentTarget && !isSettingsPageOpen && !isSpotlightHidden) {
          setIsSpotlightHidden(true);
        }
      }}
      style={{
        background: 'transparent',
        backgroundColor: 'transparent',
        fontSize: `${textScale * 100}%`,
        filter: `brightness(${Math.max(0.45, (deviceState.brightness ?? 85) / 100 + 0.15)})`,
      }}
      className={`relative min-h-screen w-full bg-transparent flex flex-col items-center justify-start ${
        isSettingsPageOpen ? 'pt-12 md:pt-14' : 'pt-16 sm:pt-24 md:pt-28'
      } p-2 sm:p-4 text-neutral-100 overflow-hidden transition-all duration-300`}
    >
      {/* SYS1 Real Flashlight Screen Halo when Flashlight is ON */}
      {deviceState.flashlightEnabled && (
        <div className="fixed inset-0 pointer-events-none z-50 border-[10px] border-amber-100/90 shadow-[inset_0_0_90px_rgba(254,243,199,0.55)] animate-pulse" />
      )}

      {/* ============================================================
          ON-DEMAND OS SETTINGS SCREEN:
          CLOSED BY DEFAULT ("Que la app inicie SIEMPRE directamente en el modo 'Vista Overlay Pura (Sin Fondo)' con background: transparent")
      ============================================================ */}
      {isSettingsPageOpen && (
        <OsSettingsBackground
          config={config}
          deviceState={deviceState}
          isSpotlightVisible={isSpotlightVisible}
          onToggleSpotlightVisible={forceState => {
            if (typeof forceState === 'boolean') {
              setIsSpotlightHidden(!forceState);
              if (forceState) setIsMiniPill(false);
            } else {
              if (isSpotlightHidden || isMiniPill) {
                setIsSpotlightHidden(false);
                setIsMiniPill(false);
              } else {
                setIsSpotlightHidden(true);
              }
            }
          }}
          onUpdateConfig={handleUpdateConfig}
          onUpdateDevice={handleUpdateDevice}
          onClearHistory={() => {
            const cleared = PreferencesStore.clearHistory(config);
            setConfig(cleared);
            showToast('Historial y aprendizaje reiniciados');
          }}
          onOpenSpotlight={() => {
            setIsSpotlightHidden(false);
            setIsMiniPill(false);
          }}
          onOpenSettingsTab={() => setIsSettingsOpen(true)}
          onResetWindowPositions={() => {
            setBarOffset({ x: 0, y: 0 });
            setInspectorOffset({ x: 0, y: 0 });
            showToast('Posición de ventanas centrada');
          }}
          onOpenApkBuilder={() => setIsApkBuilderOpen(true)}
          onCloseSettings={() => {
            setIsSettingsPageOpen(false);
            setIsSpotlightHidden(false);
            showToast('Ajustes cerrados · Modo Overlay Puro (Sin Fondo)');
          }}
        />
      )}

      {/* ============================================================
          F2: FLOATING STICKY NOTES OVERLAY (DESACOPLADAS EN PANTALLA)
      ============================================================ */}
      {(config.floatingNotes || []).map(note => (
        <div
          key={note.id}
          style={{
            left: `${note.x}px`,
            top: `${note.y}px`,
          }}
          className={`fixed z-40 w-56 rounded-2xl border shadow-2xl p-3 select-none transition-shadow ${
            stickyBgByColor[note.color || 'amber']
          }`}
        >
          <div
            onMouseDown={e => startStickyDrag(note, e)}
            onTouchStart={e => startStickyDrag(note, e)}
            className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-black/15 cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center gap-1 font-bold text-xs truncate">
              <GripHorizontal className="w-3.5 h-3.5 opacity-60 shrink-0" />
              <span className="truncate">{note.title}</span>
            </div>
            <button
              onClick={() => {
                handleUpdateConfig({
                  ...config,
                  floatingNotes: (config.floatingNotes || []).filter(n => n.id !== note.id),
                });
                showToast('Nota flotante cerrada');
              }}
              className="p-0.5 rounded hover:bg-black/15 cursor-pointer"
              title="Cerrar nota flotante"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <textarea
            value={note.content}
            onChange={e => {
              const updatedNotes = (config.floatingNotes || []).map(n =>
                n.id === note.id ? { ...n, content: e.target.value } : n
              );
              handleUpdateConfig({ ...config, floatingNotes: updatedNotes });
            }}
            rows={3}
            className="w-full bg-transparent text-xs font-medium placeholder-black/50 outline-none resize-none leading-snug"
          />
        </div>
      ))}

      {/* Top Controls Bar ONLY shown when Settings Page is Open */}
      {isSettingsPageOpen && (
        <div className="fixed top-2 left-2 right-2 sm:left-4 sm:right-4 z-30 flex items-center justify-between text-xs font-mono text-neutral-400 select-none">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center p-0.5 rounded-full bg-black/75 border border-white/10 shadow-sm backdrop-blur-md">
              <button
                onClick={() => {
                  setDeviceModel('moto_g86');
                  showToast('Perfil Moto G86 (pOLED 120Hz + Gestos táctiles)');
                }}
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                  isPhone ? 'bg-white/15 text-white shadow-sm font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span>Moto G86</span>
              </button>

              <button
                onClick={() => {
                  setDeviceModel('galaxy_tab');
                  showToast('Perfil Galaxy Tab A9+ (Split Inspector separado)');
                }}
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                  deviceModel === 'galaxy_tab' ? 'bg-white/15 text-white shadow-sm font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Tablet className="w-3 h-3" />
                <span className="hidden sm:inline">Tab A9+</span>
              </button>

              <button
                onClick={() => setDeviceModel('responsive')}
                className={`p-1 rounded-full text-[11px] transition-all cursor-pointer ${
                  deviceModel === 'responsive' ? 'bg-white/15 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3 h-3" />
              </button>
            </div>

            <button
              onClick={() => {
                const order: Array<AppConfig['preset']> = ['hybrid', 'glass', 'raycast', 'macos', 'ios', 'graphite'];
                const nextPreset = order[(order.indexOf(config.preset) + 1) % order.length];
                handleUpdateConfig({ ...config, preset: nextPreset });
                showToast(`Preset: ${nextPreset.toUpperCase()}`);
              }}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/75 hover:bg-white/15 text-neutral-200 border border-white/10 cursor-pointer transition-colors backdrop-blur-md"
            >
              <Palette className="w-3 h-3 text-sky-400" />
              <span className="text-[11px] capitalize">Preset: {config.preset}</span>
            </button>

            <button
              onClick={() => {
                const nextTheme = config.theme === 'light' ? 'dark' : 'light';
                handleUpdateConfig({ ...config, theme: nextTheme });
                showToast(nextTheme === 'light' ? 'Modo Claro Perla activado' : 'Modo Oscuro activado');
              }}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/75 hover:bg-white/15 text-neutral-200 border border-white/10 cursor-pointer transition-colors backdrop-blur-md"
            >
              <span>{config.theme === 'light' ? '☀️ Claro' : '🌙 Oscuro'}</span>
            </button>

            <button
              onClick={() => setIsApkBuilderOpen(true)}
              className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold border border-emerald-300/40 cursor-pointer transition-all shadow-md shadow-emerald-500/20"
            >
              <Download className="w-3 h-3 stroke-[2.5]" />
              <span className="text-[11px]">Descargar APK (Overlay)</span>
            </button>

            {hasCustomWindowOffset && (
              <button
                onClick={() => {
                  setBarOffset({ x: 0, y: 0 });
                  setInspectorOffset({ x: 0, y: 0 });
                  showToast('Ventanas centradas');
                }}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="text-[11px]">Centrar</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isSpotlightHidden || isMiniPill) {
                  setIsSpotlightHidden(false);
                  setIsMiniPill(false);
                  showToast('Barra Spotlight visible sobre Ajustes');
                } else {
                  setIsSpotlightHidden(true);
                  showToast('Barra oculta • Tocá los ajustes libremente');
                }
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-[11px] cursor-pointer transition-all shadow-md ${
                isSpotlightHidden || isMiniPill
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-emerald-500/25'
                  : 'bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300'
              }`}
            >
              {isSpotlightHidden || isMiniPill ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Mostrar Barra Spotlight</span>
                </>
              ) : (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Ocultar Barra</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setIsSettingsPageOpen(false);
                setIsSpotlightHidden(false);
                showToast('Ajustes cerrados · Modo Barra Nativa');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500 hover:bg-sky-400 text-neutral-950 font-bold text-[11px] cursor-pointer transition-all shadow-md"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Volver a Solo la Barra</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================
          WHEN SPOTLIGHT BAR IS DISMISSED / HIDDEN:
          Minimal Native Invocation Trigger Pill (like Android Quick Tile / Gesture)
      ============================================================ */}
      {isSpotlightHidden ? (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 animate-spring-in">
          <button
            onClick={() => {
              setIsSpotlightHidden(false);
              setIsMiniPill(false);
            }}
            style={{
              backgroundColor: activeBrand.primaryColor,
              boxShadow: `0 12px 35px ${activeBrand.glowColor}`,
            }}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-full text-neutral-950 font-bold text-xs cursor-pointer hover:scale-105 active:scale-95 transition-all"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
            <span>Invocar Spotlight</span>
            <kbd className="px-2 py-0.5 rounded-full bg-black/20 text-[10px] font-mono">Alt+S</kbd>
          </button>

          {!isSettingsPageOpen && (
            <button
              onClick={() => setIsSettingsPageOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-[#161c26]/95 hover:bg-white/15 border border-white/15 text-neutral-200 font-semibold text-xs cursor-pointer shadow-xl backdrop-blur-md transition-all"
            >
              <Settings className="w-3.5 h-3.5 text-sky-400" />
              <span>Ajustes</span>
            </button>
          )}
        </div>
      ) : isMiniPill ? (
        /* ============================================================
           ESTÉTICA 5: MODO FLOTANTE COMPACTO ULTRA-MINIMALISTA (MINI PILL)
        ============================================================ */
        <div className="w-full flex flex-col items-center justify-center pt-4 z-20 animate-pill-bounce">
          <div
            onMouseMove={handlePointerMove}
            style={{
              borderColor: subtleBorderColor,
              borderWidth: `${borderWidthPx}px`,
              boxShadow: subtleBoxShadow,
              backdropFilter: blurPx > 0 ? `blur(${blurPx}px) saturate(190%)` : 'none',
            }}
            className={`relative flex items-center gap-3 px-4 py-2.5 rounded-full border transition-all duration-500 ${getOverlaySurfaceClasses()} max-w-md w-full shadow-2xl`}
          >
            <button
              onClick={() => setIsMiniPill(false)}
              className="shrink-0 hover:scale-105 transition-transform cursor-pointer"
              title="Expandir Spotlight Next"
            >
              <IosAppIcon appId={selectedResult ? selectedResult.id : 'spotify'} size={30} />
            </button>

            <div className="flex-1 flex items-center gap-2 min-w-0">
              <Search className="w-4 h-4 shrink-0 text-neutral-400" />
              <input
                type="text"
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setIsMiniPill(false);
                }}
                onFocus={() => setIsMiniPill(false)}
                placeholder="Spotlight Mini • Toca para expandir..."
                className="w-full bg-transparent text-xs font-medium text-white placeholder-neutral-400 outline-none"
              />
            </div>

            <button
              onClick={() => handleUpdateDevice({ isPlaying: !deviceState.isPlaying })}
              style={{
                backgroundColor: `${activeBrand.primaryColor}20`,
                borderColor: `${activeBrand.primaryColor}40`,
                color: activeBrand.primaryColor,
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono font-bold cursor-pointer hover:opacity-90 shrink-0"
              title="Play / Pause rápido"
            >
              {deviceState.isPlaying ? (
                <>
                  <div className="flex items-end gap-0.5 h-2.5">
                    <span style={{ backgroundColor: activeBrand.primaryColor }} className="w-0.5 rounded-full eq-bar-1" />
                    <span style={{ backgroundColor: activeBrand.primaryColor }} className="w-0.5 rounded-full eq-bar-2" />
                    <span style={{ backgroundColor: activeBrand.primaryColor }} className="w-0.5 rounded-full eq-bar-3" />
                  </div>
                  <span className="hidden xs:inline truncate max-w-[75px]">
                    {deviceState.activeMediaTrack?.title || 'Playing'}
                  </span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span>Play</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsMiniPill(false)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-200 transition-colors cursor-pointer shrink-0"
              title="Expandir barra completa (Alt+M)"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : isDashboard ? (
        /* ============================================================
           DASHBOARD OVERLAY CARD
        ============================================================ */
        <div
          style={{
            transform: `scale(${uiScale})`,
            transformOrigin: 'top center',
          }}
          className="w-full flex items-center justify-center transition-all duration-300 z-10"
        >
          <main
            ref={mainCardRef}
            onMouseMove={handlePointerMove}
            onTouchMove={handlePointerMove}
            style={{
              borderRadius: `${cornerRadius}px`,
              borderColor: subtleBorderColor,
              borderWidth: `${borderWidthPx}px`,
              boxShadow: subtleBoxShadow,
              opacity: config.opacity ?? 0.96,
              backdropFilter: blurPx > 0 ? `blur(${blurPx}px) saturate(190%)` : 'none',
            }}
            className={`relative w-full max-w-5xl transition-all duration-500 border overflow-hidden animate-spring-in ${
              config.topBevel !== false ? 'top-bevel-highlight' : ''
            } ${getOverlaySurfaceClasses()}`}
          >
            <div className="pointer-events-none absolute inset-0 liquid-specular z-0 transition-opacity duration-300" />
            <div className="relative z-10">
              <SpotlightBar
                query={query}
                onQueryChange={q => {
                  setQuery(q);
                  setSelectedIndex(0);
                  setViewMode('suggestions');
                }}
                config={config}
                activeTrackTitle={deviceState.activeMediaTrack?.title}
                brand={activeBrand}
                onKeyDown={handleInputKeyDown}
                onToggleMiniPill={() => setIsSpotlightHidden(true)}
              />
              <DashboardView
                deviceState={deviceState}
                config={config}
                onUpdateDevice={handleUpdateDevice}
                onSelectApp={appId => {
                  setQuery(appId);
                  setViewMode('split_inspector');
                  if (isPhone) setMobileInspectorOpen(true);
                }}
                onOpenSplitInspector={() => {
                  setViewMode('split_inspector');
                  if (isPhone) setMobileInspectorOpen(true);
                }}
                onOpenQuickLook={fileName => {
                  setInfoCardData({
                    title: fileName,
                    subtitle: 'Visor Quick Look Multipágina con OCR',
                    body: `Extracción de texto realizada con éxito para «${fileName}».\n\nContenido indexado:\n• Arquitectura modular Spotlight Next\n• Soporte para Moto G86 y Galaxy Tab A9+\n• Iconos iOS con acento sutil\n• Parser de lenguaje natural local`,
                  });
                }}
                onCopyText={text => {
                  navigator.clipboard.writeText(text);
                  showToast('¡Copiado!');
                }}
              />
              <ActionPanel
                selectedResult={selectedResult}
                totalCount={results.length}
                selectedIndex={selectedIndex}
                viewMode={viewMode}
                config={config}
                onToggleSplitInspector={() => setViewMode('split_inspector')}
                onToggleDashboard={() => setViewMode('suggestions')}
                onExecutePrimary={() => {
                  if (selectedResult) executePrimaryAction(selectedResult);
                }}
                onOpenActions={() => {
                  if (selectedResult) setSecondaryActionResult(selectedResult);
                }}
                onOpenSettings={() => setIsSettingsPageOpen(true)}
                onOpenInlineScope={appId => setInlineScopedApp(appId)}
              />
            </div>
          </main>
        </div>
      ) : (
        /* ============================================================
           NATIVE FLOATING BAR LAYOUT:
           - When invoked: ONLY the floating bar appears (standaloneBarWidth = 650px).
           - When user enters Inline Scope (e.g. Spotify): renders InlineScopedSearch inside the bar.
           - When user opens Inspector (Tab): Split Inspector appears side-by-side.
        ============================================================ */
        <div
          style={{
            gap: `${splitGap}px`,
            transform: `scale(${uiScale})`,
            transformOrigin: 'top center',
          }}
          className={`w-full max-w-[1140px] flex flex-col md:flex-row items-start justify-center transition-all duration-300 z-10 ${
            isPhone ? 'max-w-[420px]' : ''
          }`}
        >
          {/* WINDOW 1 (LEFT / MAIN): FLOATING SPOTLIGHT BAR */}
          <main
            ref={mainCardRef}
            onMouseMove={handlePointerMove}
            onTouchMove={handlePointerMove}
            onMouseEnter={() => setIsInspectorFocused(false)}
            style={{
              width: isPhone
                ? '100%'
                : isSplit
                ? `${barWidth}px`
                : `${standaloneBarWidth}px`,
              maxWidth: '100%',
              borderRadius: `${cornerRadius}px`,
              borderColor: subtleBorderColor,
              borderWidth: `${borderWidthPx}px`,
              boxShadow: subtleBoxShadow,
              transform: `translate3d(${barOffset.x}px, ${barOffset.y}px, 0)`,
              opacity:
                config.focusDimming && isInspectorFocused && isSplit
                  ? Math.max(0.65, (config.opacity ?? 0.96) - 0.22)
                  : config.opacity ?? 0.96,
              backdropFilter: blurPx > 0 ? `blur(${blurPx}px) saturate(190%)` : 'none',
            }}
            className={`relative shrink-0 ${
              isPhone && mobileInspectorOpen && isSplit ? 'hidden' : ''
            } transition-all duration-300 border overflow-hidden animate-spring-in ${
              config.topBevel !== false ? 'top-bevel-highlight' : ''
            } ${getOverlaySurfaceClasses()}`}
          >
            {/* Reactive Specular Highlight Overlay */}
            <div className="pointer-events-none absolute inset-0 liquid-specular z-0 transition-opacity duration-300" />

            {/* Moto G86 Top Speaker Mockup (When in Phone Mode) */}
            {isPhone && (
              <div className="relative z-10 w-full pt-2 pb-1 flex items-center justify-center select-none bg-black/40">
                <div className="w-12 h-1 bg-white/25 rounded-full mb-1" />
              </div>
            )}

            {inlineScopedApp ? (
              /* INLINE SCOPED SEARCH INSIDE THE BAR (Matches Screenshot_20261107_170643_ChatGPT_9c483b40.jpg) */
              <div className="relative z-10">
                <InlineScopedSearch
                  appId={inlineScopedApp}
                  config={config}
                  deviceState={deviceState}
                  onBack={() => setInlineScopedApp(null)}
                  onOpenInspector={() => {
                    setInlineScopedApp(null);
                    setViewMode('split_inspector');
                    if (isPhone) setMobileInspectorOpen(true);
                  }}
                  onOpenActionsMenu={() => {
                    if (selectedResult) {
                      setSecondaryActionResult(prev => (prev ? null : selectedResult));
                    }
                  }}
                  onOpenSettings={() => setIsSettingsPageOpen(true)}
                  onUpdateDevice={handleUpdateDevice}
                  onShowToast={showToast}
                />
              </div>
            ) : (
              <>
                {/* Spotlight Search Header Bar */}
                <div className="relative z-10">
                  <SpotlightBar
                    query={query}
                    onQueryChange={q => {
                      setQuery(q);
                      setSelectedIndex(0);
                      if (isPhone) setMobileInspectorOpen(false);
                    }}
                    config={config}
                    activeTrackTitle={deviceState.activeMediaTrack?.title}
                    brand={activeBrand}
                    onKeyDown={handleInputKeyDown}
                    onToggleMiniPill={() => setIsSpotlightHidden(true)}
                    onStartDrag={e => startWindowDrag('bar', e)}
                  />
                </div>

                {/* Adaptive Suggestions / Search Results List */}
                {results.length > 0 || query.trim().length > 0 ? (
                  <div
                    ref={resultsListRef}
                    className="relative z-10 max-h-[360px] overflow-y-auto py-1.5 space-y-0.5 scrollbar-thin"
                  >
                    {query && (
                      <div className="flex items-center justify-between px-4 pt-1.5 pb-1 text-[11px] font-medium text-neutral-400">
                        <span>Resultados adaptativos</span>
                        {isPhone && (
                          <span className="text-[10px] text-emerald-400 font-mono">
                            Toca para inspeccionar
                          </span>
                        )}
                      </div>
                    )}

                    {results.length > 0 ? (
                      results.map((item, idx) => (
                        <ResultItem
                          key={item.id}
                          result={item}
                          isSelected={idx === selectedIndex}
                          config={config}
                          isPlayingAudio={deviceState.isPlaying}
                          onSelect={() => {
                            setSelectedIndex(idx);
                            playUiSound(500);
                            if (query.trim().length > 0) {
                              recordAdaptiveUsage(item, query);
                            }
                            if (isPhone) setMobileInspectorOpen(true);
                          }}
                          onSwipeInspect={() => {
                            setSelectedIndex(idx);
                            setViewMode('split_inspector');
                            if (isPhone) setMobileInspectorOpen(true);
                          }}
                          onExecute={() => executePrimaryAction(item)}
                          onOpenActions={() => setSecondaryActionResult(item)}
                        />
                      ))
                    ) : (
                      <div className="py-10 px-6 text-center text-neutral-400">
                        <Command className="w-7 h-7 mx-auto mb-2 opacity-30" />
                        <p className="text-sm font-semibold text-neutral-300">
                          Sin resultados para «{query}»
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          Probá buscar una app, película, nota flotante o cálculo.
                        </p>
                      </div>
                    )}
                  </div>
                ) : null}

                {/* High-Contrast Footer Action Bar inside the Search Window */}
                <div className="relative z-10">
                  <ActionPanel
                    selectedResult={selectedResult}
                    totalCount={results.length}
                    selectedIndex={selectedIndex}
                    viewMode={viewMode}
                    config={config}
                    onToggleSplitInspector={() => {
                      if (isPhone) {
                        setViewMode('split_inspector');
                        setMobileInspectorOpen(!mobileInspectorOpen);
                      } else {
                        setViewMode(prev => (prev === 'split_inspector' ? 'suggestions' : 'split_inspector'));
                      }
                    }}
                    onToggleDashboard={() => {
                      setViewMode(prev => (prev === 'dashboard' ? 'suggestions' : 'dashboard'));
                    }}
                    onExecutePrimary={() => {
                      if (selectedResult) executePrimaryAction(selectedResult);
                    }}
                    onOpenActions={() => {
                      if (selectedResult) setSecondaryActionResult(prev => (prev ? null : selectedResult));
                    }}
                    onOpenSettings={() => setIsSettingsPageOpen(true)}
                    onOpenInlineScope={appId => setInlineScopedApp(appId)}
                  />
                </div>
              </>
            )}
          </main>

          {/* WINDOW 2 (RIGHT): INDEPENDENT FLOATING SPLIT INSPECTOR WINDOW (Only when Inspector is opened) */}
          {isSplit && (
            <aside
              onMouseMove={handlePointerMove}
              onTouchMove={handlePointerMove}
              onMouseEnter={() => setIsInspectorFocused(true)}
              onMouseLeave={() => setIsInspectorFocused(false)}
              style={{
                width: isPhone ? '100%' : `${inspectorWidth}px`,
                maxWidth: '100%',
                borderRadius: `${cornerRadius}px`,
                borderColor: subtleBorderColor,
                borderWidth: `${borderWidthPx}px`,
                boxShadow: subtleBoxShadow,
                transform: `translate3d(${inspectorOffset.x}px, ${inspectorOffset.y}px, 0)`,
                opacity: config.opacity ?? 0.96,
                backdropFilter: blurPx > 0 ? `blur(${blurPx}px) saturate(190%)` : 'none',
              }}
              className={`relative shrink-0 ${
                isPhone
                  ? mobileInspectorOpen
                    ? 'max-w-[420px] flex flex-col min-h-[430px] max-h-[510px]'
                    : 'hidden'
                  : 'md:mt-3 flex flex-col min-h-[380px] max-h-[490px]'
              } border overflow-hidden transition-all duration-300 animate-spring-in ${
                config.topBevel !== false ? 'top-bevel-highlight' : ''
              } ${getOverlaySurfaceClasses()}`}
            >
              <div className="pointer-events-none absolute inset-0 liquid-specular z-0 transition-opacity duration-300" />

              <div className="relative z-10 flex-1 flex flex-col h-full overflow-hidden">
                {selectedResult ? (
                  <SplitInspector
                    result={selectedResult}
                    deviceState={deviceState}
                    config={config}
                    isMobilePhone={isPhone}
                    onUpdateDevice={handleUpdateDevice}
                    onUpdateConfig={handleUpdateConfig}
                    onCopyText={text => showToast(text.slice(0, 38))}
                    onExecutePrimary={() => executePrimaryAction(selectedResult)}
                    onClose={() => {
                      if (isPhone) setMobileInspectorOpen(false);
                      else setViewMode('suggestions');
                    }}
                    onToggleFavorite={appId => {
                      const isFav = config.favorites.includes(appId);
                      const newFavs = isFav
                        ? config.favorites.filter(id => id !== appId)
                        : [...config.favorites, appId];
                      handleUpdateConfig({ ...config, favorites: newFavs });
                      showToast(isFav ? 'Eliminado de favoritos' : 'Añadido a favoritos');
                    }}
                    onTogglePin={title => {
                      const isPinned = config.pins.includes(title);
                      const newPins = isPinned
                        ? config.pins.filter(p => p !== title)
                        : [...config.pins, title];
                      handleUpdateConfig({ ...config, pins: newPins });
                      showToast(isPinned ? 'Desfijado de inicio' : 'Fijado en inicio');
                    }}
                    onOpenActions={() => setSecondaryActionResult(selectedResult)}
                    onQuickQuery={q => setQuery(q)}
                    onStartDrag={e => startWindowDrag('inspector', e)}
                  />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-neutral-500 text-xs">
                    <Command className="w-6 h-6 mb-2 opacity-40" />
                    <span>Selecciona un elemento para ver su inspector</span>
                  </div>
                )}
              </div>
            </aside>
          )}
        </div>
      )}

      {/* Floating Action Menu (••• Spotlight / Ctrl+K) - Non-blurring floating popover */}
      {secondaryActionResult && (
        <SecondaryActionsModal
          result={secondaryActionResult}
          config={config}
          isOpen={true}
          deviceState={deviceState}
          onClose={() => setSecondaryActionResult(null)}
          onExecutePrimary={() => executePrimaryAction(secondaryActionResult)}
          onToggleFavorite={appId => {
            const isFav = config.favorites.includes(appId);
            const newFavs = isFav ? config.favorites.filter(id => id !== appId) : [...config.favorites, appId];
            handleUpdateConfig({ ...config, favorites: newFavs });
            showToast(isFav ? 'Eliminado de favoritos' : 'Añadido a favoritos');
          }}
          onTogglePin={title => {
            const isPinned = config.pins.includes(title);
            const newPins = isPinned ? config.pins.filter(p => p !== title) : [...config.pins, title];
            handleUpdateConfig({ ...config, pins: newPins });
            showToast(isPinned ? 'Desfijado de inicio' : 'Fijado en inicio');
          }}
          onHideSuggestion={appId => {
            handleUpdateConfig({ ...config, hiddenSuggestions: [...config.hiddenSuggestions, appId] });
            showToast('Sugerencia oculta');
          }}
          onCopyText={async text => {
            await navigator.clipboard.writeText(text);
            showToast('¡Copiado!');
          }}
          onInspect={() => {
            setInlineScopedApp(null);
            setViewMode('split_inspector');
            if (isPhone) setMobileInspectorOpen(true);
          }}
          onQuickQuery={q => setQuery(q)}
          onUpdateDevice={handleUpdateDevice}
          onOpenComposer={(channel, target, text) => {
            setComposeData({ channel, target: target || '', text: text || '' });
          }}
          onOpenNewNote={() => {
            setActiveNote({ title: '', content: '' });
            setIsNotesModalOpen(true);
          }}
          onOpenAiPrompt={prompt => setAiPrompt(prompt)}
          onOpenQuickLook={fileName => {
            setInfoCardData({
              title: fileName,
              subtitle: 'Visor Quick Look Multipágina con OCR',
              body: `Lectura y extracción de texto realizada con éxito para «${fileName}».\n\nContenido indexado:\n• Arquitectura modular Spotlight Next\n• Soporte para Moto G86 y Galaxy Tab A9+\n• Menús de acciones dedicados por aplicación`,
            });
          }}
          onOpenSettings={() => setIsSettingsPageOpen(true)}
          onOpenApkBuilder={() => setIsApkBuilderOpen(true)}
          onOpenInlineScope={appId => setInlineScopedApp(appId)}
        />
      )}

      {/* Multi-step Plan Review Modal */}
      {activePlan && (
        <PlanReviewModal
          plan={activePlan}
          isOpen={true}
          deviceState={deviceState}
          onUpdateDevice={handleUpdateDevice}
          onSaveAsRoutine={(name, plan) => {
            handleUpdateConfig({
              ...config,
              aliases: [...config.aliases, { alias: name, target: plan.raw }],
            });
            showToast(`Comando «${name}» guardado`);
          }}
          onClose={() => setActivePlan(null)}
        />
      )}

      {/* Info Card Modal */}
      {infoCardData && (
        <InfoCardModal
          data={infoCardData}
          isOpen={true}
          onClose={() => setInfoCardData(null)}
          onCopyText={async text => {
            await navigator.clipboard.writeText(text);
            showToast('¡Copiado!');
          }}
        />
      )}

      {/* Focus & Productivity Session Modal */}
      <FocusSessionModal
        isOpen={isFocusModalOpen}
        onClose={() => setIsFocusModalOpen(false)}
        deviceState={deviceState}
        onUpdateDevice={handleUpdateDevice}
        onSessionComplete={() => showToast('¡Sesión de concentración finalizada con éxito!')}
      />

      {/* Compose Message Modal */}
      {composeData && (
        <ComposeMessageModal
          channel={composeData.channel}
          initialTarget={composeData.target}
          initialText={composeData.text}
          isOpen={true}
          onClose={() => setComposeData(null)}
          onSent={target => {
            showToast(`Mensaje preparado para ${target}`);
          }}
        />
      )}

      {/* Notes Modal */}
      <NotesModal
        note={activeNote as any}
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        onSave={noteData => {
          if (noteData.id) {
            const updated = config.notes.map(n =>
              n.id === noteData.id
                ? { ...n, title: noteData.title, content: noteData.content, updatedAt: Date.now() }
                : n
            );
            handleUpdateConfig({ ...config, notes: updated });
          } else {
            const newNote = {
              id: `note-${Date.now()}`,
              title: noteData.title,
              content: noteData.content,
              updatedAt: Date.now(),
            };
            handleUpdateConfig({ ...config, notes: [newNote, ...config.notes] });
          }
          showToast('Nota guardada');
        }}
        onDelete={id => {
          handleUpdateConfig({ ...config, notes: config.notes.filter(n => n.id !== id) });
          showToast('Nota eliminada');
        }}
      />

      {/* AI Assistant Modal */}
      {aiPrompt && (
        <AiAssistantModal
          initialPrompt={aiPrompt}
          config={config}
          isOpen={true}
          onClose={() => setAiPrompt(null)}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        config={config}
        isOpen={isSettingsOpen}
        deviceState={deviceState}
        onUpdateConfig={handleUpdateConfig}
        onUpdateDevice={handleUpdateDevice}
        onClearHistory={() => {
          const cleared = PreferencesStore.clearHistory(config);
          setConfig(cleared);
          showToast('Historial y hábitos eliminados');
        }}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Native Android Overlay APK Builder & Downloader Modal */}
      <AndroidApkBuilderModal
        isOpen={isApkBuilderOpen}
        config={config}
        isPureOverlayMode={!isSettingsPageOpen}
        onTogglePureOverlayMode={val => {
          setIsSettingsPageOpen(!val);
          if (val) setIsSpotlightHidden(false);
        }}
        onClose={() => setIsApkBuilderOpen(false)}
        onShowToast={showToast}
      />

      {/* Toast Feedback */}
      {copyToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-neutral-900 border border-white/20 text-white text-xs font-medium shadow-2xl glass-surface animate-spring-in flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{copyToast}</span>
        </div>
      )}
    </div>
  );
};

export default App;
