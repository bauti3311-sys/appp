import React, { useState } from 'react';
import {
  Palette, Search, Sparkles, Sliders, Shield,
  HardDrive, X, Check, Trash2, Download, Plus, CheckCircle2, Play
} from 'lucide-react';
import { AppConfig, DeviceState, SystemPermissions } from '../types';
import { DEFAULT_PERMISSIONS } from '../lib/preferences';
import { PERMISSIONS_LIST } from './OsSettingsBackground';

interface SettingsModalProps {
  config: AppConfig;
  isOpen: boolean;
  deviceState: DeviceState;
  onUpdateConfig: (updated: AppConfig) => void;
  onUpdateDevice: (partial: Partial<DeviceState>) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

type TabType = 'appearance' | 'permissions' | 'search' | 'productivity' | 'ai' | 'system';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  config,
  isOpen,
  deviceState,
  onUpdateConfig,
  onUpdateDevice,
  onClearHistory,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('appearance');
  const [confirmClear, setConfirmClear] = useState(false);
  const [newAlias, setNewAlias] = useState({ alias: '', target: '' });
  const [newSnippet, setNewSnippet] = useState({ name: '', template: '' });
  const [acceptedBanner, setAcceptedBanner] = useState(false);

  if (!isOpen) return null;

  const update = (partial: Partial<AppConfig>) => {
    onUpdateConfig({ ...config, ...partial });
  };

  const currentPerms: SystemPermissions = {
    ...DEFAULT_PERMISSIONS,
    ...(config.permissions || {}),
  };

  const totalPerms = PERMISSIONS_LIST.length;
  const grantedCount = PERMISSIONS_LIST.filter(p => currentPerms[p.key]).length;
  const allGranted = grantedCount === totalPerms;

  const handleAcceptAll = () => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
    update({
      permissions: {
        notifications: true,
        overlayWindow: true,
        accessibilityShizuku: true,
        clipboardFocus: true,
        microphoneVoice: true,
        storageFiles: true,
        mediaControl: true,
        networkLookups: true,
        cameraScanner: true,
        locationMaps: true,
      },
    });
    setAcceptedBanner(true);
    setTimeout(() => setAcceptedBanner(false), 2600);
  };

  const handleAddAlias = () => {
    if (!newAlias.alias.trim() || !newAlias.target.trim()) return;
    update({
      aliases: [...(config.aliases || []), { alias: newAlias.alias.trim(), target: newAlias.target.trim() }],
    });
    setNewAlias({ alias: '', target: '' });
  };

  const handleDeleteAlias = (index: number) => {
    update({
      aliases: (config.aliases || []).filter((_, idx) => idx !== index),
    });
  };

  const handleAddSnippet = () => {
    if (!newSnippet.name.trim() || !newSnippet.template.trim()) return;
    update({
      snippets: [
        ...(config.snippets || []),
        {
          id: `snip-${Date.now()}`,
          name: newSnippet.name.trim(),
          template: newSnippet.template.trim(),
        },
      ],
    });
    setNewSnippet({ name: '', template: '' });
  };

  const handleDeleteSnippet = (id: string) => {
    update({
      snippets: (config.snippets || []).filter(s => s.id !== id),
    });
  };

  const exportDiagnostics = () => {
    const data = {
      app: 'Spotlight Next Web',
      version: '3.0.0',
      timestamp: new Date().toISOString(),
      preset: config.preset,
      theme: config.theme,
      accent: config.accent,
      permissions: currentPerms,
      aiProvider: config.aiProvider,
      aiModel: config.aiModel,
      deviceState,
      userAgent: navigator.userAgent,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spotlight-diagnostics-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 animate-fade-in">
      <div className="w-full max-w-2xl bg-[#141a23]/98 border border-white/15 rounded-2xl shadow-[0_28px_80px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col max-h-[86vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 bg-white/[0.03] flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base font-bold text-white">Ajustes Completos de Spotlight Next</h3>
            <p className="text-xs text-neutral-400">
              Presets reales, Centro de Permisos (10/10), IA Híbrida y Hardware en Vivo
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-1 px-4 py-2 bg-black/30 border-b border-white/10 overflow-x-auto text-xs shrink-0">
          {[
            { id: 'appearance', label: 'Estética & E1–E12', icon: Palette },
            { id: 'permissions', label: `Permisos (${grantedCount}/${totalPerms})`, icon: Shield },
            { id: 'ai', label: 'IA Híbrida', icon: Sparkles },
            { id: 'system', label: 'Hardware & SYS1', icon: HardDrive },
            { id: 'search', label: 'Búsqueda', icon: Search },
            { id: 'productivity', label: 'Alias & Snippets', icon: Sliders },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40 font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-neutral-300 scrollbar-thin">
          {/* TAB 1: ESTÉTICA & TAMAÑOS */}
          {activeTab === 'appearance' && (
            <div className="space-y-5">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-white">Preset Visual & Tema Claro/Oscuro (E1)</label>
                  <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                    {[
                      { id: 'dark', label: '🌙 Oscuro' },
                      { id: 'light', label: '☀️ Claro Perla' },
                      { id: 'auto', label: 'Auto' },
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => update({ theme: t.id as any })}
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold cursor-pointer ${
                          config.theme === t.id ? 'bg-sky-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'hybrid', label: 'Spotlight Hybrid', desc: 'Equilibrio cristal + Raycast' },
                    { id: 'glass', label: 'Liquid Glass 2.0', desc: 'Cristal translúcido profundo' },
                    { id: 'raycast', label: 'Raycast Pro', desc: 'Mate sólido y bordes de 14px' },
                    { id: 'macos', label: 'macOS Sequoia', desc: 'Ventana flotante con halo' },
                    { id: 'ios', label: 'iOS 18 Island', desc: 'Curvas de 30px y rebote elástico' },
                    { id: 'graphite', label: 'Graphite Studio', desc: 'Monocromático sobrio' },
                  ].map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        const presetDefaults: Partial<AppConfig> =
                          preset.id === 'glass'
                            ? { preset: 'glass', opacity: 0.78, glassIntensity: 40, corner: 24, topBevel: true }
                            : preset.id === 'raycast'
                            ? { preset: 'raycast', opacity: 0.99, glassIntensity: 12, corner: 14, topBevel: true }
                            : preset.id === 'macos'
                            ? { preset: 'macos', opacity: 0.92, glassIntensity: 32, corner: 20, topBevel: true }
                            : preset.id === 'ios'
                            ? { preset: 'ios', opacity: 0.94, glassIntensity: 30, corner: 30, springPhysics: 'elastic_raycast' }
                            : preset.id === 'graphite'
                            ? { preset: 'graphite', opacity: 0.98, glassIntensity: 16, corner: 18, accentIntensity: 'minimal' }
                            : { preset: 'hybrid', opacity: 0.95, glassIntensity: 28, corner: 22 };
                        update(presetDefaults);
                      }}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        config.preset === preset.id
                          ? 'bg-sky-500/15 border-sky-400 text-white'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 text-neutral-300'
                      }`}
                    >
                      <div className="font-semibold text-xs">{preset.label}</div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">{preset.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/[0.06]">
                    <div className="flex justify-between mb-1">
                      <span>Tamaño de Interfaz:</span>
                      <span className="font-mono text-sky-300 font-bold">
                        {Math.round((config.uiScale ?? 1) * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.85"
                      max="1.15"
                      step="0.02"
                      value={config.uiScale ?? 1}
                      onChange={e => update({ uiScale: parseFloat(e.target.value) })}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/[0.06]">
                    <div className="flex justify-between mb-1">
                      <span>Tamaño de Letra:</span>
                      <span className="font-mono text-sky-300 font-bold">
                        {Math.round((config.textScale ?? 1) * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.85"
                      max="1.25"
                      step="0.02"
                      value={config.textScale ?? 1}
                      onChange={e => update({ textScale: parseFloat(e.target.value) })}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CENTRO UNIFICADO DE PERMISOS (10/10) */}
          {activeTab === 'permissions' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-sky-500/10 to-transparent border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Permisos del Sistema ({grantedCount} de {totalPerms} activos)</span>
                  </div>
                  <p className="text-[11px] text-neutral-300 mt-0.5">
                    Aceptá todos los permisos con un clic o activalos individualmente.
                  </p>
                </div>

                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs cursor-pointer shadow-lg shadow-emerald-500/25 shrink-0 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{allGranted ? 'Todo Concedido ✓' : 'Aceptar Todos'}</span>
                </button>
              </div>

              {acceptedBanner && (
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-center font-semibold">
                  ✓ ¡Los 10 permisos han sido aceptados y activados!
                </div>
              )}

              <div className="space-y-2">
                {PERMISSIONS_LIST.map(perm => {
                  const isGranted = !!currentPerms[perm.key];
                  return (
                    <div
                      key={perm.key}
                      onClick={() =>
                        update({
                          permissions: {
                            ...currentPerms,
                            [perm.key]: !isGranted,
                          },
                        })
                      }
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isGranted
                          ? 'bg-white/[0.05] border-emerald-500/30'
                          : 'bg-black/30 border-white/10 opacity-70'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-white text-xs">{perm.title}</div>
                        <div className="text-[11px] text-neutral-400">{perm.desc}</div>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold shrink-0 ${
                          isGranted
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-white/10 text-neutral-400'
                        }`}
                      >
                        {isGranted ? 'CONCEDIDO' : 'ACTIVAR'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-rose-300">Restablecer Historial y Aprendizaje</div>
                  <div className="text-[11px] text-neutral-400">Borra búsquedas recientes y conteo de uso</div>
                </div>
                {!confirmClear ? (
                  <button
                    onClick={() => setConfirmClear(true)}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 cursor-pointer"
                  >
                    Limpiar historial
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onClearHistory();
                      setConfirmClear(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold cursor-pointer"
                  >
                    Confirmar borrado
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: INTELIGENCIA HÍBRIDA */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-3.5 text-xs text-sky-200">
                <strong>Inteligencia Híbrida 3.0:</strong> Configurá el proveedor, modelo, temperatura y extracción automática de códigos 2FA (GM2) o respuestas inteligentes de WhatsApp (WA2).
              </div>

              <div>
                <label className="block font-semibold text-white mb-1.5">Proveedor de IA</label>
                <div className="flex gap-2">
                  {[
                    { id: 'gemini', model: 'gemini-2.5-flash' },
                    { id: 'openai', model: 'gpt-4o-mini' },
                    { id: 'local', model: 'llama-3.3-npu' },
                  ].map(prov => (
                    <button
                      key={prov.id}
                      onClick={() => update({ aiProvider: prov.id as any, aiModel: prov.model })}
                      className={`flex-1 py-2 rounded-xl border capitalize cursor-pointer transition-colors ${
                        config.aiProvider === prov.id
                          ? 'bg-sky-500/20 border-sky-400 text-white font-semibold'
                          : 'bg-white/5 border-white/10 text-neutral-400'
                      }`}
                    >
                      {prov.id}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-white mb-1">Modelo Seleccionado</label>
                <input
                  type="text"
                  value={config.aiModel}
                  onChange={e => update({ aiModel: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-white">Temperatura Creativa:</span>
                  <span className="font-mono text-sky-300 font-bold">{config.aiTemperature ?? 0.4}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.aiTemperature ?? 0.4}
                  onChange={e => update({ aiTemperature: parseFloat(e.target.value) })}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                <div>
                  <div className="font-semibold text-white">GM2 • Detección Automática 2FA / OTP</div>
                  <div className="text-[10px] text-neutral-400">Extrae códigos de verificación de Gmail y portapapeles</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.aiAutoOtp !== false}
                  onChange={e => update({ aiAutoOtp: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                <div>
                  <div className="font-semibold text-white">WA2 • Respuestas Inteligentes WhatsApp</div>
                  <div className="text-[10px] text-neutral-400">Sugiere contestaciones rápidas en el Inspector</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.aiSmartReplies !== false}
                  onChange={e => update({ aiSmartReplies: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500 cursor-pointer"
                />
              </label>
            </div>
          )}

          {/* TAB 4: HARDWARE & SISTEMA */}
          {activeTab === 'system' && (
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                <h4 className="font-semibold text-white">Controles de Hardware en Vivo (SYS1)</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Volumen Multimedia:</span>
                      <span className="font-mono text-sky-300 font-bold">{deviceState.volume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={deviceState.volume}
                      onChange={e => onUpdateDevice({ volume: parseInt(e.target.value, 10), isMuted: false })}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Brillo de Pantalla Real:</span>
                      <span className="font-mono text-amber-300 font-bold">{deviceState.brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="25"
                      max="100"
                      value={deviceState.brightness}
                      onChange={e => onUpdateDevice({ brightness: parseInt(e.target.value, 10) })}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                    {[
                      { k: 'wifiEnabled', l: 'Wi-Fi 6E', v: deviceState.wifiEnabled !== false },
                      { k: 'bluetoothEnabled', l: 'Bluetooth 5.4', v: deviceState.bluetoothEnabled !== false },
                      { k: 'flashlightEnabled', l: 'Linterna Flash', v: !!deviceState.flashlightEnabled },
                      { k: 'dndEnabled', l: 'No Molestar', v: !!deviceState.dndEnabled },
                      { k: 'batterySaver', l: 'Ahorro Batería', v: !!deviceState.batterySaver },
                      { k: 'hotspotEnabled', l: 'Hotspot Wi-Fi', v: !!deviceState.hotspotEnabled },
                    ].map(sw => (
                      <button
                        key={sw.k}
                        onClick={() => onUpdateDevice({ [sw.k]: !sw.v })}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer ${
                          sw.v
                            ? 'bg-emerald-500/20 border-emerald-400 text-white font-bold'
                            : 'bg-black/30 border-white/10 text-neutral-400'
                        }`}
                      >
                        <div className="text-xs">{sw.l}</div>
                        <div className="text-[10px] font-mono opacity-80">{sw.v ? 'ACTIVO' : 'APAGADO'}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={exportDiagnostics}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-200 border border-white/10 text-xs font-medium cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar diagnóstico JSON</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: BÚSQUEDA */}
          {activeTab === 'search' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-white">Cantidad máxima de sugerencias adaptativas:</span>
                  <span className="font-mono text-sky-300 font-bold">{config.maxSuggestions ?? 3} sugerencias</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="6"
                  step="1"
                  value={config.maxSuggestions ?? 3}
                  onChange={e => update({ maxSuggestions: parseInt(e.target.value, 10) })}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                <div>
                  <div className="font-medium text-white">Aprendizaje adaptativo local</div>
                  <div className="text-[11px] text-neutral-400">Adaptar sugerencias y el predictor Tab según lo que buscás y ejecutás</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.learning}
                  onChange={e => update({ learning: e.target.checked })}
                  className="w-4 h-4 rounded text-sky-500 cursor-pointer"
                />
              </label>
            </div>
          )}

          {/* TAB 6: ALIAS & SNIPPETS */}
          {activeTab === 'productivity' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-2">Alias Rápidos de Búsqueda</h4>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {(config.aliases || []).map((al, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
                    >
                      <span className="font-mono font-semibold text-sky-400">{al.alias}</span>
                      <span className="text-neutral-400">→</span>
                      <span className="text-neutral-200">{al.target}</span>
                      <button
                        onClick={() => handleDeleteAlias(idx)}
                        className="text-neutral-500 hover:text-rose-400 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Alias (ej: sp)"
                    value={newAlias.alias}
                    onChange={e => setNewAlias({ ...newAlias, alias: e.target.value })}
                    className="w-28 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-white outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Objetivo (ej: spotify)"
                    value={newAlias.target}
                    onChange={e => setNewAlias({ ...newAlias, target: e.target.value })}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-white outline-none"
                  />
                  <button
                    onClick={handleAddAlias}
                    className="px-3 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-medium cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <h4 className="font-semibold text-white mb-1.5">Textos Guardados (Snippets)</h4>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {(config.snippets || []).map(snip => (
                    <div
                      key={snip.id}
                      className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-start justify-between gap-2"
                    >
                      <div>
                        <div className="font-mono font-semibold text-sky-300">{snip.name}</div>
                        <div className="text-[11px] text-neutral-300 truncate max-w-sm mt-0.5">{snip.template}</div>
                      </div>
                      <button
                        onClick={() => handleDeleteSnippet(snip.id)}
                        className="text-neutral-500 hover:text-rose-400 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={newSnippet.name}
                    onChange={e => setNewSnippet({ ...newSnippet, name: e.target.value })}
                    className="w-32 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-white outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Plantilla de texto..."
                    value={newSnippet.template}
                    onChange={e => setNewSnippet({ ...newSnippet, template: e.target.value })}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-white outline-none"
                  />
                  <button
                    onClick={handleAddSnippet}
                    className="px-3 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-medium cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-black/40 border-t border-white/10 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-medium text-xs shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
          >
            Guardar y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
