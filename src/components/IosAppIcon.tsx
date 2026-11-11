import React from 'react';

export interface AppBrandInfo {
  primaryColor: string;
  bgGradient: string;
  glowColor: string;
  badgeBg: string;
}

export const APP_BRANDS: Record<string, AppBrandInfo> = {
  spotify: {
    primaryColor: '#1ed760',
    bgGradient: 'from-emerald-500 to-green-600',
    glowColor: 'rgba(30, 215, 96, 0.35)',
    badgeBg: 'bg-[#1ed760]/20 text-[#1ed760] border-[#1ed760]/30',
  },
  whatsapp: {
    primaryColor: '#25d366',
    bgGradient: 'from-emerald-600 to-green-500',
    glowColor: 'rgba(37, 211, 102, 0.35)',
    badgeBg: 'bg-[#25d366]/20 text-[#25d366] border-[#25d366]/30',
  },
  youtube: {
    primaryColor: '#ff0033',
    bgGradient: 'from-red-600 to-rose-700',
    glowColor: 'rgba(255, 0, 51, 0.35)',
    badgeBg: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
  gmail: {
    primaryColor: '#ea4335',
    bgGradient: 'from-red-500 via-amber-500 to-blue-500',
    glowColor: 'rgba(234, 67, 53, 0.35)',
    badgeBg: 'bg-red-500/20 text-red-300 border-red-500/30',
  },
  maps: {
    primaryColor: '#34a853',
    bgGradient: 'from-emerald-500 via-sky-500 to-amber-500',
    glowColor: 'rgba(52, 168, 83, 0.35)',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  finanzas: {
    primaryColor: '#00b1ea',
    bgGradient: 'from-sky-400 to-blue-600',
    glowColor: 'rgba(0, 177, 234, 0.35)',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  },
  control: {
    primaryColor: '#38bdf8',
    bgGradient: 'from-sky-500 to-indigo-600',
    glowColor: 'rgba(56, 189, 248, 0.35)',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  },
  chrome: {
    primaryColor: '#4285f4',
    bgGradient: 'from-blue-600 via-emerald-600 to-amber-500',
    glowColor: 'rgba(66, 133, 244, 0.35)',
    badgeBg: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  telegram: {
    primaryColor: '#229ed9',
    bgGradient: 'from-sky-400 to-blue-600',
    glowColor: 'rgba(34, 158, 217, 0.35)',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  },
  figma: {
    primaryColor: '#a259ff',
    bgGradient: 'from-purple-600 to-pink-500',
    glowColor: 'rgba(162, 89, 255, 0.35)',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  },
  calc: {
    primaryColor: '#ff9f0a',
    bgGradient: 'from-amber-500 to-orange-600',
    glowColor: 'rgba(255, 159, 10, 0.35)',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  notes: {
    primaryColor: '#ffd60a',
    bgGradient: 'from-yellow-500 to-amber-600',
    glowColor: 'rgba(255, 214, 10, 0.35)',
    badgeBg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  },
  calendar: {
    primaryColor: '#ff3b30',
    bgGradient: 'from-red-500 to-rose-600',
    glowColor: 'rgba(255, 59, 48, 0.35)',
    badgeBg: 'bg-red-500/20 text-red-300 border-red-500/30',
  },
  camera: {
    primaryColor: '#38bdf8',
    bgGradient: 'from-neutral-700 to-neutral-800',
    glowColor: 'rgba(56, 189, 248, 0.35)',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  },
  files: {
    primaryColor: '#007aff',
    bgGradient: 'from-blue-500 to-indigo-600',
    glowColor: 'rgba(0, 122, 255, 0.35)',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
  terminal: {
    primaryColor: '#30d158',
    bgGradient: 'from-emerald-600 to-teal-700',
    glowColor: 'rgba(48, 209, 88, 0.35)',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  settings: {
    primaryColor: '#a2a2a6',
    bgGradient: 'from-neutral-600 to-neutral-700',
    glowColor: 'rgba(162, 162, 166, 0.35)',
    badgeBg: 'bg-neutral-500/20 text-neutral-300 border-neutral-500/30',
  },
  ai: {
    primaryColor: '#38bdf8',
    bgGradient: 'from-sky-500 via-indigo-500 to-purple-600',
    glowColor: 'rgba(56, 189, 248, 0.35)',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  },
  weather: {
    primaryColor: '#00c7be',
    bgGradient: 'from-sky-400 to-blue-500',
    glowColor: 'rgba(0, 199, 190, 0.35)',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  },
  clipboard: {
    primaryColor: '#8b5cf6',
    bgGradient: 'from-violet-500 to-purple-600',
    glowColor: 'rgba(139, 92, 246, 0.35)',
    badgeBg: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  },
  translator: {
    primaryColor: '#0ea5e9',
    bgGradient: 'from-sky-500 to-blue-600',
    glowColor: 'rgba(14, 165, 233, 0.35)',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  },
  clock: {
    primaryColor: '#f97316',
    bgGradient: 'from-orange-500 to-amber-600',
    glowColor: 'rgba(249, 115, 22, 0.35)',
    badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  },
  emojis: {
    primaryColor: '#eab308',
    bgGradient: 'from-yellow-400 to-amber-500',
    glowColor: 'rgba(234, 179, 8, 0.35)',
    badgeBg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  },
  timer: {
    primaryColor: '#ef4444',
    bgGradient: 'from-red-500 to-rose-600',
    glowColor: 'rgba(239, 68, 68, 0.35)',
    badgeBg: 'bg-red-500/20 text-red-300 border-red-500/30',
  },
  qr: {
    primaryColor: '#6366f1',
    bgGradient: 'from-indigo-500 to-purple-600',
    glowColor: 'rgba(99, 102, 241, 0.35)',
    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  },
  movies: {
    primaryColor: '#e11d48',
    bgGradient: 'from-rose-500 to-red-700',
    glowColor: 'rgba(225, 29, 72, 0.35)',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  },
  sticky: {
    primaryColor: '#f59e0b',
    bgGradient: 'from-amber-400 to-yellow-600',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  default: {
    primaryColor: '#10b981',
    bgGradient: 'from-emerald-500 to-teal-600',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
};

export function getAppBrand(appIdOrKey: string): AppBrandInfo {
  const clean = appIdOrKey.toLowerCase().replace('app:', '').replace('cmd:', '').replace('online:', '').replace('raycast:', '');
  if (clean.includes('spotify') || clean.includes('music')) return APP_BRANDS.spotify;
  if (clean.includes('whatsapp') || clean.includes('wa:')) return APP_BRANDS.whatsapp;
  if (clean.includes('youtube') || clean.includes('yt')) return APP_BRANDS.youtube;
  if (clean.includes('gmail') || clean.includes('correo') || clean.includes('otp') || clean.includes('2fa')) return APP_BRANDS.gmail;
  if (clean.includes('maps') || clean.includes('mapa') || clean.includes('cerca') || clean.includes('farmacia')) return APP_BRANDS.maps;
  if (clean.includes('finanza') || clean.includes('alias') || clean.includes('cbu') || clean.includes('asado') || clean.includes('cuota') || clean.includes('mp')) return APP_BRANDS.finanzas;
  if (clean.includes('control') || clean.includes('sys')) return APP_BRANDS.control;
  if (clean.includes('camara') || clean.includes('camera') || clean.includes('espejo')) return APP_BRANDS.camera;
  if (clean.includes('chrome') || clean.includes('web:')) return APP_BRANDS.chrome;
  if (clean.includes('telegram') || clean.includes('tg:')) return APP_BRANDS.telegram;
  if (clean.includes('figma')) return APP_BRANDS.figma;
  if (clean.includes('calc') || clean.includes('currency')) return APP_BRANDS.calc;
  if (clean.includes('clip') || clean.includes('portapapeles') || clean.includes('snippet')) return APP_BRANDS.clipboard;
  if (clean.includes('translat') || clean.includes('traductor')) return APP_BRANDS.translator;
  if (clean.includes('clock') || clean.includes('reloj') || clean.includes('hora')) return APP_BRANDS.clock;
  if (clean.includes('emoji') || clean.includes('mate')) return APP_BRANDS.emojis;
  if (clean.includes('timer') || clean.includes('temporizador') || clean.includes('crono')) return APP_BRANDS.timer;
  if (clean.includes('qr')) return APP_BRANDS.qr;
  if (clean.includes('movie') || clean.includes('peli') || clean.includes('serie') || clean.includes('cine')) return APP_BRANDS.movies;
  if (clean.includes('sticky') || clean.includes('flotante')) return APP_BRANDS.sticky;
  if (clean.includes('note')) return APP_BRANDS.notes;
  if (clean.includes('calendar') || clean.includes('agenda')) return APP_BRANDS.calendar;
  if (clean.includes('file') || clean.includes('pdf') || clean.includes('apk')) return APP_BRANDS.files;
  if (clean.includes('terminal') || clean.includes('termux')) return APP_BRANDS.terminal;
  if (clean.includes('setting') || clean.includes('ajuste')) return APP_BRANDS.settings;
  if (clean.includes('ai') || clean.includes('gemini')) return APP_BRANDS.ai;
  if (clean.includes('weather') || clean.includes('clima')) return APP_BRANDS.weather;
  return APP_BRANDS.default;
}

interface IosAppIconProps {
  appId: string;
  className?: string;
  size?: number;
}

export const IosAppIcon: React.FC<IosAppIconProps> = ({ appId, className = 'w-9 h-9', size = 36 }) => {
  const clean = appId.toLowerCase().replace('app:', '').replace('cmd:', '').replace('online:', '').replace('raycast:', '');
  const radius = Math.round(size * 0.225);

  // SPOTIFY iOS Icon
  if (clean.includes('spotify') || clean.includes('music')) {
    return (
      <div
        style={{ width: size, height: size, borderRadius: radius }}
        className={`ios-app-icon relative bg-[#121212] flex items-center justify-center shadow-md overflow-hidden shrink-0 border border-white/10 ${className}`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#1ed760] to-[#1db954] flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-[68%] h-[68%] text-black">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.58 14.42c-.18.3-.57.4-.87.22-2.39-1.46-5.4-1.79-8.94-.98-.34.08-.68-.14-.76-.48-.08-.34.14-.68.48-.76 3.88-.89 7.22-.51 9.87 1.12.3.19.4.58.22.88zm1.22-2.72c-.23.38-.73.5-1.11.27-2.74-1.68-6.91-2.17-10.15-1.18-.42.13-.87-.11-1-.53-.13-.42.11-.87.53-1 3.7-1.12 8.3-.58 11.46 1.34.38.23.5.73.27 1.1zm.11-2.83C14.63 8.98 9.22 8.8 6.09 9.75c-.5.15-1.04-.13-1.19-.63s.13-1.04.63-1.19c3.6-1.09 9.57-.88 13.34 1.35.45.27.6.86.33 1.31-.27.45-.86.6-1.26.33z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    );
  }

  // WHATSAPP iOS Icon
  if (clean.includes('whatsapp') || clean.includes('wa:')) {
    return (
      <div
        style={{ width: size, height: size, borderRadius: radius }}
        className={`ios-app-icon relative bg-gradient-to-b from-[#2be16f] to-[#128c7e] flex items-center justify-center shadow-md overflow-hidden shrink-0 border border-white/10 ${className}`}
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-[66%] h-[66%] text-white">
          <path
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413z"
            fill="currentColor"
          />
        </svg>
      </div>
    );
  }

  // YOUTUBE iOS Icon
  if (clean.includes('youtube') || clean.includes('yt')) {
    return (
      <div
        style={{ width: size, height: size, borderRadius: radius }}
        className={`ios-app-icon relative bg-gradient-to-b from-[#ff0033] to-[#cc0000] flex items-center justify-center shadow-md overflow-hidden shrink-0 border border-white/10 ${className}`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-[66%] h-[66%] text-white">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      </div>
    );
  }

  // GMAIL & 2FA iOS Icon (GM1, GM2)
  if (clean.includes('gmail') || clean.includes('correo') || clean.includes('otp') || clean.includes('2fa')) {
    return (
      <div
        style={{ width: size, height: size, borderRadius: radius }}
        className={`ios-app-icon relative bg-white flex items-center justify-center shadow-md overflow-hidden shrink-0 border border-white/20 ${className}`}
      >
        <svg viewBox="0 0 24 24" className="w-[68%] h-[68%]">
          <path fill="#EA4335" d="M12 13.5L3 6.75V18c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.75L12 13.5z" fillOpacity="0.12" />
          <path fill="#4285F4" d="M3 6.75V18c0 .55.45 1 1 1h2V9.8L3 6.75z" />
          <path fill="#34A853" d="M21 6.75V18c0 .55-.45 1-1 1h-2V9.8l3-3.05z" />
          <path fill="#EA4335" d="M20 5H4c-.55 0-1 .45-1 1v.75l9 6.75 9-6.75V6c0-.55-.45-1-1-1z" />
        </svg>
      </div>
    );
  }

  // GOOGLE MAPS & LUGARES CERCANOS iOS Icon (MAP2)
  if (clean.includes('maps') || clean.includes('mapa') || clean.includes('cerca') || clean.includes('farmacia')) {
    return (
      <div
        style={{ width: size, height: size, borderRadius: radius }}
        className={`ios-app-icon relative bg-gradient-to-br from-[#34a853] via-[#4285f4] to-[#fbbc05] flex items-center justify-center shadow-md overflow-hidden shrink-0 border border-white/20 ${className}`}
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-[66%] h-[66%] text-white drop-shadow">
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
            fill="#EA4335"
            stroke="white"
            strokeWidth="1.2"
          />
        </svg>
      </div>
    );
  }

  // FINANZAS / MERCADO PAGO / DIVISOR DE GASTOS iOS Icon (FIN1, FIN2)
  if (clean.includes('finanza') || clean.includes('alias') || clean.includes('cbu') || clean.includes('asado') || clean.includes('cuota') || clean.includes('mp')) {
    return (
      <div
        style={{ width: size, height: size, borderRadius: radius }}
        className={`ios-app-icon relative bg-gradient-to-b from-[#00b1ea] to-[#007eb5] flex items-center justify-center shadow-md overflow-hidden shrink-0 border border-white/20 ${className}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" className="w-[64%] h-[64%] text-white">
          <rect x="2" y="5" width="20" height="14" rx="3" fill="currentColor" fillOpacity="0.18" />
          <path d="M2 10h20" />
          <circle cx="17" cy="14.5" r="1.5" fill="currentColor" />
        </svg>
      </div>
    );
  }

  // SYSTEM CONTROL CENTER iOS/Android Icon (SYS1)
  if (clean.includes('control') || clean.includes('sys')) {
    return (
      <div
        style={{ width: size, height: size, borderRadius: radius }}
        className={`ios-app-icon relative bg-gradient-to-b from-[#0284c7] to-[#1e3a8a] flex items-center justify-center shadow-md overflow-hidden shrink-0 border border-white/20 ${className}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" className="w-[64%] h-[64%] text-white">
          <rect x="3" y="4" width="18" height="6" rx="3" fill="currentColor" fillOpacity="0.25" />
          <circle cx="17" cy="7" r="2" fill="currentColor" />
          <rect x="3" y="14" width="18" height="6" rx="3" />
          <circle cx="7" cy="17" r="2" fill="currentColor" />
        </svg>
      </div>
    );
  }

  // TELEGRAM iOS Icon
  if (clean.includes('telegram')) {
    return (
      <div
        style={{ width: size, height: size, borderRadius: radius }}
        className={`ios-app-icon relative bg-gradient-to-b from-[#2aabee] to-[#229ed9] flex items-center justify-center shadow-md overflow-hidden shrink-0 border border-white/10 ${className}`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-[64%] h-[64%] text-white translate-x-[-1px] translate-y-[-1px]">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
        </svg>
      </div>
    );
  }

  // FIGMA iOS Icon
  if (clean.includes('figma')) {
    return (
      <div
        style={{ width: size, height: size, borderRadius: radius }}
        className={`ios-app-icon relative bg-[#1e1e1e] flex items-center justify-center shadow-md overflow-hidden shrink-0 border border-white/10 ${className}`}
      >
        <svg viewBox="0 0 38 57" className="w-[60%] h-[60%]">
          <path fill="#F24E1E" d="M19 28.5a9.5 9.5 0 1 1 0-19h9.5v19H19z" />
          <path fill="#FF7262" d="M0 19A9.5 9.5 0 0 1 9.5 9.5H19v19H9.5A9.5 9.5 0 0 1 0 19z" />
          <path fill="#A259FF" d="M0 28.5A9.5 9.5 0 0 1 9.5 19H19v19H9.5A9.5 9.5 0 0 1 0 28.5z" />
          <path fill="#1ABCFE" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" />
          <path fill="#0ACF83" d="M38 28.5a9.5 9.5 0 1 1-19 0 9.5 9.5 0 0 1 19 0z" />
        </svg>
      </div>
    );
  }

  // GOOGLE CHROME iOS Icon
  if (clean.includes('chrome')) {
    return (
      <div
        style={{ width: size, height: size, borderRadius: radius }}
        className={`ios-app-icon relative bg-white flex items-center justify-center shadow-md overflow-hidden shrink-0 border border-white/10 ${className}`}
      >
        <svg viewBox="0 0 24 24" className="w-[70%] h-[70%]">
          <path fill="#EA4335" d="M12 2C6.48 2 2 6.48 2 12c0 2.21.72 4.25 1.94 5.91L8.35 9.5A5.992 5.992 0 0 1 12 6h9.52A9.957 9.957 0 0 0 12 2z" />
          <path fill="#34A853" d="M2 12c0 3.73 2.05 6.98 5.08 8.68l4.41-8.41a6.002 6.002 0 0 1-3.14-2.77L2 12z" />
          <path fill="#FBBC05" d="M12 18a5.98 5.98 0 0 1-4.92-2.58l-4.41 8.41A9.97 9.97 0 0 0 12 22c4.11 0 7.68-2.49 9.24-6.08H12v2.08z" />
          <path fill="#4285F4" d="M21.52 6H12v6h9.24A9.96 9.96 0 0 0 22 12c0-2.21-.72-4.25-1.94-5.91L21.52 6z" />
          <circle cx="12" cy="12" r="3.6" fill="#FFFFFF" />
          <circle cx="12" cy="12" r="2.8" fill="#1a73e8" />
        </svg>
      </div>
    );
  }

  // CALCULATOR iOS Icon
  if (clean.includes('calc')) {
    return (
      <div
        style={{ width: size, height: size, borderRadius: radius }}
        className={`ios-app-icon relative bg-[#1c1c1e] flex flex-col items-center justify-center shadow-md overflow-hidden shrink-0 border border-white/10 ${className}`}
      >
        <div className="w-[70%] h-[70%] grid grid-cols-2 grid-rows-2 gap-1 text-[11px] font-bold text-white">
          <div className="bg-[#ff9f0a] rounded flex items-center justify-center">÷</div>
          <div className="bg-[#ff9f0a] rounded flex items-center justify-center">×</div>
          <div className="bg-[#ff9f0a] rounded flex items-center justify-center">−</div>
          <div className="bg-[#ff9f0a] rounded flex items-center justify-center">+</div>
        </div>
      </div>
    );
  }

  // NOTES iOS Icon
  if (clean.includes('note')) {
    return (
      <div
        style={{ width: size, height: size, borderRadius: radius }}
        className={`ios-app-icon relative bg-[#fff9c4] flex flex-col shadow-md overflow-hidden shrink-0 border border-amber-300/30 ${className}`}
      >
        <div className="h-[25%] bg-[#f59e0b] w-full" />
        <div className="flex-1 p-1 space-y-1">
          <div className="h-0.5 w-[75%] bg-amber-400/50 rounded" />
          <div className="h-0.5 w-[60%] bg-amber-400/40 rounded" />
          <div className="h-0.5 w-[85%] bg-amber-400/40 rounded" />
        </div>
      </div>
    );
  }

  // CALENDAR iOS Icon
  if (clean.includes('calendar') || clean.includes('agenda')) {
    const today = new Date();
    const dayName = today.toLocaleDateString('es', { weekday: 'short' }).slice(0, 3).toUpperCase();
    const dayNumber = today.getDate();

    return (
      <div
        style={{ width: size, height: size, borderRadius: radius }}
        className={`ios-app-icon relative bg-white text-black flex flex-col items-center shadow-md overflow-hidden shrink-0 border border-white/20 ${className}`}
      >
        <div className="h-[30%] bg-[#ff3b30] w-full flex items-center justify-center text-[8px] font-extrabold text-white tracking-widest uppercase">
          {dayName}
        </div>
        <div className="flex-1 flex items-center justify-center text-black font-extrabold text-sm tracking-tighter">
          {dayNumber}
        </div>
      </div>
    );
  }

  // FILES iOS Icon
  if (clean.includes('file')) {
    return (
      <div
        style={{ width: size, height: size, borderRadius: radius }}
        className={`ios-app-icon relative bg-gradient-to-b from-[#42a5f5] to-[#1e88e5] flex items-center justify-center shadow-md overflow-hidden shrink-0 border border-white/10 ${className}`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-[66%] h-[66%] text-white">
          <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-1.5V9a3 3 0 0 0-3-3h-4.086a3 3 0 0 1-2.121-.879L7.364 3.697A3 3 0 0 0 5.243 3H4.5A3 3 0 0 0 1.5 6v12a3 3 0 0 0 3 3h15z" />
        </svg>
      </div>
    );
  }

  // CAMERA iOS Icon (CAM1)
  if (clean.includes('camera') || clean.includes('camara') || clean.includes('espejo')) {
    return (
      <div
        style={{ width: size, height: size, borderRadius: radius }}
        className={`ios-app-icon relative bg-gradient-to-b from-[#3a3a3c] to-[#1c1c1e] flex items-center justify-center shadow-md overflow-hidden shrink-0 border border-white/15 ${className}`}
      >
        <div className="w-[64%] h-[64%] rounded-full bg-neutral-950 border-2 border-neutral-500 flex items-center justify-center relative">
          <div className="w-[54%] h-[54%] rounded-full bg-gradient-to-tr from-sky-600/80 to-indigo-400/80 border border-sky-300/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute -top-1 -right-1" />
        </div>
      </div>
    );
  }

  // TERMINAL iOS Icon
  if (clean.includes('terminal') || clean.includes('termux')) {
    return (
      <div
        style={{ width: size, height: size, borderRadius: radius }}
        className={`ios-app-icon relative bg-[#000000] flex items-center justify-center shadow-md overflow-hidden shrink-0 border border-emerald-500/30 ${className}`}
      >
        <div className="font-mono font-bold text-emerald-400 text-xs">
          &gt;_
        </div>
      </div>
    );
  }

  // SETTINGS iOS Icon
  if (clean.includes('setting') || clean.includes('ajuste')) {
    return (
      <div
        style={{ width: size, height: size, borderRadius: radius }}
        className={`ios-app-icon relative bg-gradient-to-b from-[#8e8e93] to-[#636366] flex items-center justify-center shadow-md overflow-hidden shrink-0 border border-white/10 ${className}`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-[66%] h-[66%] text-neutral-200 animate-spin-slow">
          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
          <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
        </svg>
      </div>
    );
  }

  // AI Orchestrator Icon
  if (clean.includes('ai') || clean.includes('gemini') || clean.includes('orquestador')) {
    return (
      <div
        style={{ width: size, height: size, borderRadius: radius }}
        className={`ios-app-icon relative bg-gradient-to-tr from-[#3b82f6] via-[#8b5cf6] to-[#ec4899] flex items-center justify-center shadow-md overflow-hidden shrink-0 border border-white/15 ${className}`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-[64%] h-[64%] text-white">
          <path d="M12 2l2.4 7.2L21.6 12l-7.2 2.4L12 21.6l-2.4-7.2L2.4 12l7.2-2.4z" />
        </svg>
      </div>
    );
  }

  // CLIPBOARD MANAGER iOS Icon
  if (clean.includes('clip') || clean.includes('portapapeles') || clean.includes('snippet')) {
    return (
      <div
        style={{ width: size, height: size, borderRadius: radius }}
        className={`ios-app-icon relative bg-gradient-to-b from-[#a855f7] to-[#6d28d9] flex items-center justify-center shadow-md overflow-hidden shrink-0 border border-white/15 ${className}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" className="w-[62%] h-[62%] text-white">
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" fill="currentColor" fillOpacity="0.25" />
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <path d="M9 12h6" strokeLinecap="round" />
          <path d="M9 16h4" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // TRANSLATOR iOS Icon
  if (clean.includes('translat') || clean.includes('traductor')) {
    return (
      <div
        style={{ width: size, height: size, borderRadius: radius }}
        className={`ios-app-icon relative bg-gradient-to-b from-[#38bdf8] to-[#0284c7] flex items-center justify-center shadow-md overflow-hidden shrink-0 border border-white/15 ${className}`}
      >
        <span className="text-white font-extrabold text-sm select-none tracking-tighter">
          A文
        </span>
      </div>
    );
  }

  // WORLD CLOCK iOS Icon
  if (clean.includes('clock') || clean.includes('reloj') || clean.includes('hora')) {
    return (
      <div
        style={{ width: size, height: size, borderRadius: radius }}
        className={`ios-app-icon relative bg-[#000000] flex items-center justify-center shadow-md overflow-hidden shrink-0 border border-white/20 ${className}`}
      >
        <div className="w-[70%] h-[70%] rounded-full border border-white/50 relative flex items-center justify-center">
          <div className="w-0.5 h-2.5 bg-white absolute top-1.5 rounded-full" />
          <div className="w-2.5 h-0.5 bg-white absolute right-1.5 rounded-full" />
          <div className="w-3 h-[1px] bg-orange-500 absolute rotate-45 rounded-full" />
          <div className="w-1 h-1 rounded-full bg-orange-500 z-10" />
        </div>
      </div>
    );
  }

  // EMOJIS & SYMBOLS iOS Icon
  if (clean.includes('emoji') || clean.includes('mate')) {
    return (
      <div
        style={{ width: size, height: size, borderRadius: radius }}
        className={`ios-app-icon relative bg-gradient-to-b from-[#fde047] to-[#eab308] flex items-center justify-center shadow-md overflow-hidden shrink-0 border border-amber-300/40 ${className}`}
      >
        <span className="text-xl select-none leading-none">
          🧉
        </span>
      </div>
    );
  }

  // TIMER & ALARM iOS Icon
  if (clean.includes('timer') || clean.includes('temporizador') || clean.includes('crono')) {
    return (
      <div
        style={{ width: size, height: size, borderRadius: radius }}
        className={`ios-app-icon relative bg-gradient-to-b from-[#ef4444] to-[#b91c1c] flex items-center justify-center shadow-md overflow-hidden shrink-0 border border-white/15 ${className}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-[62%] h-[62%] text-white">
          <circle cx="12" cy="14" r="8" />
          <path d="M12 2v4" />
          <path d="M12 14l3-3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // QR CODE GENERATOR iOS Icon
  if (clean.includes('qr')) {
    return (
      <div
        style={{ width: size, height: size, borderRadius: radius }}
        className={`ios-app-icon relative bg-gradient-to-b from-[#6366f1] to-[#4338ca] flex items-center justify-center shadow-md overflow-hidden shrink-0 border border-white/15 ${className}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[62%] h-[62%] text-white">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      </div>
    );
  }

  // MOVIES & SERIES FINDER (F7) iOS Icon
  if (clean.includes('movie') || clean.includes('peli') || clean.includes('serie') || clean.includes('cine')) {
    return (
      <div
        style={{ width: size, height: size, borderRadius: radius }}
        className={`ios-app-icon relative bg-gradient-to-b from-[#f43f5e] to-[#be123c] flex items-center justify-center shadow-md overflow-hidden shrink-0 border border-white/15 ${className}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" className="w-[62%] h-[62%] text-white">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M7 4v16M17 4v16M2 8h5M17 8h5M2 12h20M2 16h5M17 16h5" />
        </svg>
      </div>
    );
  }

  // FLOATING STICKY NOTES (F2) iOS Icon
  if (clean.includes('sticky') || clean.includes('flotante')) {
    return (
      <div
        style={{ width: size, height: size, borderRadius: radius }}
        className={`ios-app-icon relative bg-gradient-to-b from-[#fbbf24] to-[#d97706] flex items-center justify-center shadow-md overflow-hidden shrink-0 border border-white/20 ${className}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" className="w-[60%] h-[60%] text-neutral-950">
          <path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z" />
          <path d="M15 3v6h6" />
        </svg>
      </div>
    );
  }

  // DEFAULT
  return (
    <div
      style={{ width: size, height: size, borderRadius: radius }}
      className={`ios-app-icon relative bg-gradient-to-b from-[#10b981] to-[#059669] flex items-center justify-center shadow-md overflow-hidden shrink-0 border border-white/10 ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-[60%] h-[60%] text-white">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v18" />
        <path d="M3 12h18" />
      </svg>
    </div>
  );
};
