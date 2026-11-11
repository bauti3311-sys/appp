import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Heart,
  Volume2, Search, ExternalLink, Radio, Sliders, Mic, MicOff,
  Send, Check, CheckCheck, Phone, MapPin, Wallet, Sparkles, Clock
} from 'lucide-react';
import { AppConfig, DeviceState } from '../types';
import { IosAppIcon, AppBrandInfo } from './IosAppIcon';

// ============================================================================
// 1. EXTENSIVE SPOTIFY STUDIO (SP1 + SP3 + SYNTH AUDIO + LYRICS + EQ + SLEEP)
// ============================================================================
export interface ExtensiveTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  durationSecs: number;
  mood: 'synthwave' | 'focus' | 'gym' | 'lofi';
  coverText: string;
  coverGradient: string;
  bpm: number;
  baseFreq: number;
  lyrics: string[];
}

export const SPOTIFY_TRACK_CATALOG: ExtensiveTrack[] = [
  {
    id: 'midnight-city',
    title: 'Midnight City',
    artist: 'M83',
    album: "Hurry Up, We're Dreaming",
    duration: '4:03',
    durationSecs: 243,
    mood: 'synthwave',
    coverText: 'M83',
    coverGradient: 'from-emerald-600 via-teal-800 to-neutral-950',
    bpm: 105,
    baseFreq: 261.63,
    lyrics: [
      '♪ Waiting in a car...',
      '♪ Waiting for a ride in the dark...',
      '♪ The night city grows, look and see her eyes, they glow...',
      '♪ Waiting in a car, waiting for a ride in the dark...',
      '🎷 [Solo icónico de sintetizador y saxofón en vivo]',
    ],
  },
  {
    id: 'veridis-quo',
    title: 'Veridis Quo',
    artist: 'Daft Punk',
    album: 'Discovery',
    duration: '5:45',
    durationSecs: 345,
    mood: 'focus',
    coverText: 'DP',
    coverGradient: 'from-amber-500 via-orange-800 to-neutral-950',
    bpm: 110,
    baseFreq: 293.66,
    lyrics: [
      '🎹 [Arpegio barroco analógico de Daft Punk]',
      '♪ Progresión melódica continua para concentración profunda...',
      '♪ Capas de sintetizador vintage y bajo cálido...',
      '♪ Ritmo hipnótico Discovery Studio Session...',
    ],
  },
  {
    id: 'nightcall',
    title: 'Nightcall',
    artist: 'Kavinsky',
    album: 'OutRun',
    duration: '4:18',
    durationSecs: 258,
    mood: 'synthwave',
    coverText: 'KV',
    coverGradient: 'from-rose-600 via-purple-900 to-neutral-950',
    bpm: 91,
    baseFreq: 220.0,
    lyrics: [
      "♪ I'm giving you a night call to tell you how I feel...",
      '♪ We’re going to drive you through the night, down the hills...',
      "♪ I'm gonna tell you something you don't want to hear...",
      "♪ There's something inside you, it's hard to explain...",
    ],
  },
  {
    id: 'starboy',
    title: 'Starboy (feat. Daft Punk)',
    artist: 'The Weeknd',
    album: 'Starboy',
    duration: '3:50',
    durationSecs: 230,
    mood: 'gym',
    coverText: 'TW',
    coverGradient: 'from-red-600 via-rose-950 to-black',
    bpm: 186,
    baseFreq: 329.63,
    lyrics: [
      "♪ I'm tryna put you in the worst mood, ah...",
      '♪ House so empty, need a centerpiece...',
      "♪ Look what you've done! I'm a motherfuckin' Starboy...",
      '♪ Every day aibrand new whip, switch lanes...',
    ],
  },
  {
    id: 'resonance',
    title: 'Resonance',
    artist: 'HOME',
    album: 'Odyssey',
    duration: '3:32',
    durationSecs: 212,
    mood: 'lofi',
    coverText: 'HM',
    coverGradient: 'from-cyan-500 via-indigo-900 to-neutral-950',
    bpm: 85,
    baseFreq: 246.94,
    lyrics: [
      '🌊 [Pads analógicos nostálgicos Chillwave]',
      '♪ Frecuencias cálidas para programar o descansar...',
      '♪ Sintetizadores reverberados en estéreo...',
      '♪ Odyssey Tape Loops 1996...',
    ],
  },
  {
    id: 'blinding-lights',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: '3:20',
    durationSecs: 200,
    mood: 'gym',
    coverText: 'AH',
    coverGradient: 'from-red-500 via-amber-900 to-black',
    bpm: 171,
    baseFreq: 349.23,
    lyrics: [
      "♪ I've been tryna call, I've been on my own for long enough...",
      '♪ Sin City’s cold and empty, no one’s around to judge me...',
      "♪ I said, ooh, I'm blinded by the lights...",
      "♪ No, I can't sleep until I feel your touch...",
    ],
  },
  {
    id: 'musica-ligera',
    title: 'De Música Ligera (Remaster)',
    artist: 'Soda Stereo',
    album: 'Canción Animal',
    duration: '3:32',
    durationSecs: 212,
    mood: 'gym',
    coverText: 'SS',
    coverGradient: 'from-amber-500 via-red-900 to-black',
    bpm: 124,
    baseFreq: 392.0,
    lyrics: [
      '♪ Ella durmió al calor de las masas...',
      '♪ Y yo desperté queriendo soñarla...',
      '♪ Algún tiempo atrás pensé en escribirle...',
      '♪ De aquel amor de música ligera, nada nos libra...',
    ],
  },
];

const CONNECT_DEVICES = [
  { id: 'Parlante Moto G86', label: '📱 Este Dispositivo (Moto G86 Dolby Atmos)', type: 'Smartphone' },
  { id: 'Sony WH-1000XM5', label: '🎧 Sony WH-1000XM5 (Bluetooth LDAC)', type: 'Auriculares' },
  { id: 'Living TV Chromecast', label: '📺 Living TV 4K (Spotify Connect)', type: 'TV / Barra' },
  { id: 'MacBook Pro Studio', label: '💻 MacBook Pro · Escritorio', type: 'Computadora' },
  { id: 'Auto Bluetooth', label: '🚗 Android Auto / Estéreo Vehículo', type: 'Vehículo' },
];

export const ExtensiveSpotifyInspector: React.FC<{
  deviceState: DeviceState;
  brand: AppBrandInfo;
  onUpdateDevice: (partial: Partial<DeviceState>) => void;
  onCopyText?: (msg: string) => void;
}> = ({ deviceState, brand, onUpdateDevice, onCopyText }) => {
  const [subTab, setSubTab] = useState<'player' | 'connect' | 'lyrics' | 'eq'>('player');
  const [tracks, setTracks] = useState<ExtensiveTrack[]>(SPOTIFY_TRACK_CATALOG);
  const [activeTrackIdx, setActiveTrackIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMood, setActiveMood] = useState<'all' | 'synthwave' | 'focus' | 'gym' | 'lofi'>('all');
  const [trackProgress, setTrackProgress] = useState(64);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(true);
  const [likedTracks, setLikedTracks] = useState<string[]>(['Midnight City', 'De Música Ligera (Remaster)']);

  // Real Web Audio Synth preview toggle so user hears actual music when playing!
  const [realSynthEnabled, setRealSynthEnabled] = useState(false);

  // EQ & Sleep Timer
  const [eqPreset, setEqPreset] = useState<'bass' | 'vocal' | 'electronic' | 'flat'>('electronic');
  const [eqBands, setEqBands] = useState<number[]>([6, 4, 1, 5, 7]);
  const [sleepTimerMins, setSleepTimerMins] = useState<number | null>(null);

  const currentTrack = tracks[activeTrackIdx] || tracks[0];
  const trackDuration = currentTrack.durationSecs;

  // Progress timer + Optional Web Audio Ambient Synth Chords
  useEffect(() => {
    if (!deviceState.isPlaying) return;
    const timer = setInterval(() => {
      setTrackProgress(prev => {
        if (prev + 1 >= trackDuration) {
          if (isRepeat) return 0;
          setActiveTrackIdx(idx => (idx + 1) % tracks.length);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [deviceState.isPlaying, trackDuration, isRepeat, tracks.length]);

  useEffect(() => {
    if (!deviceState.isPlaying || !realSynthEnabled || deviceState.isMuted) return;
    let ctx: AudioContext | null = null;
    let step = 0;
    const ratios = [1, 1.25, 1.5, 1.875, 1.5, 1.25];
    const playStep = () => {
      try {
        if (!ctx) {
          const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          ctx = new AudioCtx();
        }
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const freq = currentTrack.baseFreq * ratios[step % ratios.length];
        step++;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        const vol = Math.max(0.02, (deviceState.volume ?? 70) / 100) * 0.12;
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.58);
      } catch {
        // ignore audio errors
      }
    };
    playStep();
    const synthInterval = setInterval(playStep, 650);
    return () => {
      clearInterval(synthInterval);
      ctx?.close().catch(() => {});
    };
  }, [deviceState.isPlaying, realSynthEnabled, currentTrack.baseFreq, deviceState.volume, deviceState.isMuted]);

  const formatSecs = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectTrack = (index: number) => {
    setActiveTrackIdx(index);
    setTrackProgress(0);
    onUpdateDevice({
      isPlaying: true,
      activeMediaTrack: {
        title: tracks[index].title,
        artist: tracks[index].artist,
        album: tracks[index].album,
      },
    });
  };

  const handleNextTrack = () => {
    const nextIdx = isShuffle
      ? Math.floor(Math.random() * tracks.length)
      : (activeTrackIdx + 1) % tracks.length;
    handleSelectTrack(nextIdx);
  };

  const handlePrevTrack = () => {
    if (trackProgress > 10) {
      setTrackProgress(0);
    } else {
      const prevIdx = (activeTrackIdx - 1 + tracks.length) % tracks.length;
      handleSelectTrack(prevIdx);
    }
  };

  const handleAddCustomSearchedSong = () => {
    if (!searchQuery.trim()) return;
    const customSong: ExtensiveTrack = {
      id: `custom-${Date.now()}`,
      title: searchQuery.trim(),
      artist: 'Spotify Instant Stream',
      album: 'Búsqueda Directa SP1',
      duration: '3:42',
      durationSecs: 222,
      mood: 'synthwave',
      coverText: searchQuery.trim().slice(0, 2).toUpperCase(),
      coverGradient: 'from-emerald-500 via-teal-900 to-black',
      bpm: 118,
      baseFreq: 311.13,
      lyrics: [
        `♪ Reproduciendo «${searchQuery.trim()}» en alta definición...`,
        '♪ Sincronizado mediante Spotify Instant Bridge (SP1)...',
        '♪ Audio de 24 bits / 96kHz sin pérdidas activo...',
      ],
    };
    setTracks(prev => [customSong, ...prev]);
    setActiveTrackIdx(0);
    setTrackProgress(0);
    onUpdateDevice({
      isPlaying: true,
      activeMediaTrack: {
        title: customSong.title,
        artist: customSong.artist,
        album: customSong.album,
      },
    });
    setSearchQuery('');
    onCopyText?.(`🎵 Reproduciendo «${customSong.title}»`);
  };

  const filteredTracks = tracks
    .map((song, idx) => ({ song, idx }))
    .filter(({ song }) => {
      if (activeMood !== 'all' && song.mood !== activeMood) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          song.title.toLowerCase().includes(q) ||
          song.artist.toLowerCase().includes(q) ||
          song.album.toLowerCase().includes(q)
        );
      }
      return true;
    });

  const activeLyricIndex = Math.floor((trackProgress / Math.max(1, trackDuration)) * currentTrack.lyrics.length);

  return (
    <div className="space-y-3 animate-spring-in">
      {/* Top Sub-Navigation Pills */}
      <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-black/45 border border-white/10 text-[10px]">
        {[
          { id: 'player', label: '🎵 Buscador SP1' },
          { id: 'connect', label: '📡 Connect SP3' },
          { id: 'lyrics', label: '🎤 Letras' },
          { id: 'eq', label: '🎚️ EQ & Sleep' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id as any)}
            className={`py-1.5 px-1.5 rounded-lg font-semibold cursor-pointer transition-all truncate ${
              subTab === t.id
                ? 'bg-[#1ed760] text-neutral-950 font-bold shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Persistent Player Card */}
      <div
        style={{
          borderColor: `${brand.primaryColor}35`,
          boxShadow: `0 12px 32px -12px ${brand.glowColor}`,
        }}
        className="p-3.5 rounded-2xl bg-gradient-to-b from-white/[0.07] to-black/55 border space-y-2.5"
      >
        <div className="flex items-center gap-3">
          <div
            className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${currentTrack.coverGradient} border border-white/15 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-md overflow-hidden`}
          >
            <span>{currentTrack.coverText}</span>
            {deviceState.isPlaying && (
              <div className="absolute bottom-1 right-1 flex items-end gap-0.5 h-3 px-1 py-0.5 rounded bg-black/60">
                <span className="w-0.5 bg-[#1ed760] rounded-full eq-bar-1" />
                <span className="w-0.5 bg-[#1ed760] rounded-full eq-bar-2" />
                <span className="w-0.5 bg-[#1ed760] rounded-full eq-bar-3" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold text-white truncate">{currentTrack.title}</span>
              <button
                onClick={() =>
                  setLikedTracks(prev =>
                    prev.includes(currentTrack.title)
                      ? prev.filter(t => t !== currentTrack.title)
                      : [...prev, currentTrack.title]
                  )
                }
                className="text-neutral-400 hover:text-[#1ed760] transition-colors cursor-pointer shrink-0"
              >
                <Heart
                  className={`w-4 h-4 ${
                    likedTracks.includes(currentTrack.title) ? 'fill-[#1ed760] text-[#1ed760]' : ''
                  }`}
                />
              </button>
            </div>
            <div className="text-xs text-neutral-300 truncate">
              {currentTrack.artist} • <span className="text-neutral-400">{currentTrack.album}</span>
            </div>
            <div className="flex items-center justify-between gap-1.5 mt-1">
              <span className="text-[10px] text-[#1ed760] font-mono truncate">
                📡 {deviceState.audioOutputDevice || 'Parlante Moto G86'}
              </span>
              <button
                onClick={() => {
                  const nextSynth = !realSynthEnabled;
                  setRealSynthEnabled(nextSynth);
                  if (nextSynth && !deviceState.isPlaying) {
                    onUpdateDevice({ isPlaying: true });
                  }
                }}
                className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold cursor-pointer border ${
                  realSynthEnabled
                    ? 'bg-[#1ed760]/25 border-[#1ed760] text-[#1ed760]'
                    : 'bg-white/5 border-white/15 text-neutral-400 hover:text-white'
                }`}
                title="Activar sintetizador Web Audio para escuchar melodía real"
              >
                {realSynthEnabled ? '🔊 Audio Real ON' : '🔈 Audio Real Synth'}
              </button>
            </div>
          </div>
        </div>

        {/* Scrubber */}
        <div className="space-y-1">
          <input
            type="range"
            min={0}
            max={trackDuration}
            value={trackProgress}
            onChange={e => setTrackProgress(Number(e.target.value))}
            style={{ accentColor: brand.primaryColor }}
            className="w-full h-1.5 bg-white/15 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
            <span>{formatSecs(trackProgress)}</span>
            <span>{currentTrack.bpm} BPM • Lossless</span>
            <span>-{formatSecs(Math.max(0, trackDuration - trackProgress))}</span>
          </div>
        </div>

        {/* Transport Controls */}
        <div className="flex items-center justify-between px-1">
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isShuffle ? 'text-[#1ed760] bg-[#1ed760]/15' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevTrack}
              className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => onUpdateDevice({ isPlaying: !deviceState.isPlaying })}
              style={{
                backgroundColor: brand.primaryColor,
                boxShadow: `0 4px 16px ${brand.glowColor}`,
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-neutral-950 font-bold text-xs transition-all cursor-pointer hover:opacity-95 active:scale-95"
            >
              {deviceState.isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-neutral-950" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-neutral-950" />
                  <span>Play</span>
                </>
              )}
            </button>

            <button
              onClick={handleNextTrack}
              className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsRepeat(!isRepeat)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isRepeat ? 'text-[#1ed760] bg-[#1ed760]/15' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: SP1 SEARCH & QUEUE */}
      {subTab === 'player' && (
        <div className="space-y-2.5">
          {/* SP1 Search Input */}
          <div className="flex gap-1.5">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddCustomSearchedSong()}
                placeholder="Buscar canción, artista o pegar nombre para reproducir (SP1)..."
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-[#1ed760]"
              />
            </div>
            {searchQuery.trim() && (
              <button
                onClick={handleAddCustomSearchedSong}
                className="px-3 py-1.5 rounded-xl bg-[#1ed760] text-neutral-950 font-bold text-xs cursor-pointer shrink-0"
              >
                ▶ Reproducir
              </button>
            )}
          </div>

          {/* Mood Filter Pills */}
          <div className="flex items-center justify-between gap-1.5 overflow-x-auto pb-0.5">
            <div className="flex items-center gap-1">
              {[
                { id: 'all', label: 'Todo' },
                { id: 'synthwave', label: '🚗 Ruta Nocturna' },
                { id: 'focus', label: '💻 Programar' },
                { id: 'gym', label: '🔥 Entrenar' },
                { id: 'lofi', label: '🌧️ Lofi' },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setActiveMood(m.id as any)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold cursor-pointer shrink-0 ${
                    activeMood === m.id
                      ? 'bg-[#1ed760]/25 border border-[#1ed760] text-[#1ed760] font-bold'
                      : 'bg-white/5 text-neutral-400 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <a
              href={`https://open.spotify.com/search/${encodeURIComponent(searchQuery || currentTrack.title)}`}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-[#1ed760] hover:underline flex items-center gap-1 shrink-0 font-semibold"
            >
              <span>App Spotify</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          {/* Track Queue */}
          <div className="divide-y divide-white/5 rounded-xl border border-white/10 bg-black/30 max-h-[140px] overflow-y-auto scrollbar-thin">
            {filteredTracks.map(({ song, idx }) => {
              const isCurrent = idx === activeTrackIdx;
              return (
                <div
                  key={song.id}
                  onClick={() => handleSelectTrack(idx)}
                  className={`flex items-center justify-between px-3 py-2 text-xs cursor-pointer transition-colors ${
                    isCurrent ? 'bg-[#1ed760]/15 text-[#1ed760] font-semibold' : 'hover:bg-white/5 text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {isCurrent ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1ed760] shrink-0 animate-ping" />
                    ) : (
                      <span className="text-[10px] font-mono text-neutral-500 w-3">{idx + 1}</span>
                    )}
                    <span className="truncate">{song.title}</span>
                    <span className="text-[11px] text-neutral-500 truncate">• {song.artist}</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono ml-2">{song.duration}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SP3 SPOTIFY CONNECT & MOOD MIXERS */}
      {subTab === 'connect' && (
        <div className="space-y-2.5">
          <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <div className="text-[11px] font-bold text-[#1ed760] uppercase font-mono flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" />
              <span>SP3 • Spotify Connect (Transferir Audio en 1 Toque)</span>
            </div>
            <div className="space-y-1.5">
              {CONNECT_DEVICES.map(dev => {
                const isSelected = (deviceState.audioOutputDevice || 'Parlante Moto G86') === dev.id;
                return (
                  <button
                    key={dev.id}
                    onClick={() => {
                      onUpdateDevice({ audioOutputDevice: dev.id });
                      onCopyText?.(`📡 Audio transferido a ${dev.id}`);
                    }}
                    className={`w-full px-3 py-2 rounded-xl border text-left flex items-center justify-between text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#1ed760]/20 border-[#1ed760] text-white font-bold'
                        : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
                    }`}
                  >
                    <span>{dev.label}</span>
                    <span className="text-[10px] font-mono text-[#1ed760]">
                      {isSelected ? '● SONANDO ACÁ' : 'Conectar'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SYNCHRONIZED KARAOKE LYRICS */}
      {subTab === 'lyrics' && (
        <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-950/40 to-black/60 border border-[#1ed760]/30 space-y-2.5 min-h-[155px] flex flex-col justify-center">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#1ed760]">
            <span>🎤 LETRAS SINCRONIZADAS EN VIVO</span>
            <span>{currentTrack.title}</span>
          </div>
          <div className="space-y-2 py-1">
            {currentTrack.lyrics.map((line, i) => {
              const isCurrentLine = i === activeLyricIndex;
              return (
                <div
                  key={i}
                  onClick={() =>
                    setTrackProgress(Math.floor((i / currentTrack.lyrics.length) * trackDuration))
                  }
                  className={`cursor-pointer transition-all ${
                    isCurrentLine
                      ? 'text-sm font-black text-[#1ed760] scale-[1.01]'
                      : 'text-xs text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {line}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: 5-BAND EQUALIZER & SLEEP TIMER */}
      {subTab === 'eq' && (
        <div className="p-3.5 rounded-2xl bg-black/45 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#1ed760]" /> Ecualizador 5 Bandas
            </span>
            <div className="flex gap-1">
              {[
                { id: 'bass', label: 'Bass Boost', vals: [9, 7, 2, 3, 5] },
                { id: 'vocal', label: 'Vocal', vals: [1, 3, 8, 7, 4] },
                { id: 'electronic', label: 'Synth', vals: [7, 5, 1, 6, 8] },
                { id: 'flat', label: 'Plano', vals: [4, 4, 4, 4, 4] },
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setEqPreset(p.id as any);
                    setEqBands(p.vals);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                    eqPreset === p.id ? 'bg-[#1ed760] text-neutral-950 font-bold' : 'bg-white/10 text-neutral-300'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 pt-1 text-center">
            {['60Hz', '230Hz', '910Hz', '3.6kHz', '14kHz'].map((band, i) => (
              <div key={band} className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={eqBands[i]}
                  onChange={e => {
                    const next = [...eqBands];
                    next[i] = Number(e.target.value);
                    setEqBands(next);
                  }}
                  style={{ accentColor: '#1ed760' }}
                  className="w-full cursor-pointer"
                />
                <div className="text-[9px] font-mono text-neutral-400">{band}</div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-neutral-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Sleep Timer:
            </span>
            <div className="flex gap-1">
              {[15, 30, 45].map(mins => (
                <button
                  key={mins}
                  onClick={() => {
                    setSleepTimerMins(sleepTimerMins === mins ? null : mins);
                    onCopyText?.(`🌙 Sleep Timer programado en ${mins} minutos`);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                    sleepTimerMins === mins
                      ? 'bg-amber-500 text-neutral-950 font-bold'
                      : 'bg-white/10 text-neutral-300'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 2. EXTENSIVE WHATSAPP & TELEGRAM STUDIO (WA2 + VOICE NOTES + WA.ME + ALIAS)
// ============================================================================
interface ChatMessageItem {
  sender: 'them' | 'me';
  text: string;
  time: string;
  isVoiceNote?: boolean;
  voiceDuration?: string;
}

export const ExtensiveWhatsAppInspector: React.FC<{
  isTelegram: boolean;
  brand: AppBrandInfo;
  config: AppConfig;
  onCopyText?: (msg: string) => void;
}> = ({ isTelegram, brand, config, onCopyText }) => {
  const [subTab, setSubTab] = useState<'chat' | 'wame' | 'templates'>('chat');
  const [activeContact, setActiveContact] = useState<'martin' | 'sofia' | 'grupo'>('martin');
  const [chatMessages, setChatMessages] = useState<Record<'martin' | 'sofia' | 'grupo', ChatMessageItem[]>>({
    martin: [
      { sender: 'them', text: '¿Ya probaste las notas de voz WA2 y el divisor de asado?', time: '19:07' },
      { sender: 'them', text: 'Pasame tu Alias de Mercado Pago cuando puedas así te transfiero.', time: '19:08' },
    ],
    sofia: [
      { sender: 'them', text: '¡Genial! Avisame cuando estés saliendo para el café.', time: '18:42' },
    ],
    grupo: [
      { sender: 'them', text: 'Viernes 21:30 asado confirmado 🥩🧉. ¿Quién compra carbón?', time: '17:30' },
    ],
  });

  const [replyText, setReplyText] = useState('');
  const [isTypingReply, setIsTypingReply] = useState(false);

  // WA2: Voice Note Recorder state
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [playingVoiceIdx, setPlayingVoiceIdx] = useState<number | null>(null);

  // Click-to-Chat sin agendar (wa.me)
  const [directPhone, setDirectPhone] = useState('+54 9 11 4589-2103');
  const [directMessage, setDirectMessage] = useState('¡Hola! Te escribo directamente desde Spotlight.');

  useEffect(() => {
    if (!isRecordingVoice) return;
    const t = setInterval(() => setRecordSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [isRecordingVoice]);

  const formatSecs = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (customText?: string, isVoice = false, durationStr?: string) => {
    const textToSend = (customText ?? replyText).trim();
    if (!textToSend) return;
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const target = activeContact;

    setChatMessages(prev => ({
      ...prev,
      [target]: [
        ...prev[target],
        {
          sender: 'me',
          text: textToSend,
          time: nowStr,
          isVoiceNote: isVoice,
          voiceDuration: durationStr,
        },
      ],
    }));
    if (!customText) setReplyText('');

    setIsTypingReply(true);
    setTimeout(() => {
      setIsTypingReply(false);
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const autoReply = isVoice
        ? '🎧 ¡Escuché tu nota de voz! Perfecto, coordinamos así.'
        : textToSend.includes('Alias:')
        ? '💸 ¡Recibido el Alias! Ahí mismo te hice la transferencia por Mercado Pago.'
        : '¡Impecable, gracias por avisar al toque! 🚀';
      setChatMessages(prev => ({
        ...prev,
        [target]: [...prev[target], { sender: 'them', text: autoReply, time: replyTime }],
      }));
    }, 1000);
  };

  const handleToggleVoiceRecord = () => {
    if (!isRecordingVoice) {
      setRecordSeconds(0);
      setIsRecordingVoice(true);
    } else {
      const dur = formatSecs(Math.max(2, recordSeconds));
      setIsRecordingVoice(false);
      handleSendMessage(`🎤 Nota de voz grabada (${dur})`, true, dur);
      onCopyText?.(`🎤 Nota de voz (${dur}) enviada por WhatsApp`);
    }
  };

  const handleReadMessagesAloud = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msgs = chatMessages[activeContact]
        .slice(-2)
        .map(m => `${m.sender === 'me' ? 'Vos dijiste' : activeContact}: ${m.text}`)
        .join('. ');
      const u = new SpeechSynthesisUtterance(msgs);
      u.lang = 'es-ES';
      window.speechSynthesis.speak(u);
      onCopyText?.('🔊 Leyendo mensajes en voz alta (Manos Libres)');
    }
  };

  const smartRepliesByContact: Record<'martin' | 'sofia' | 'grupo', string[]> = {
    martin: [
      `💳 Mi Alias es ${config.paymentAlias || 'bauti.spotlight.mp'}`,
      '¡Ya probé las notas de voz WA2!',
      'En 5 min me sumo a la call',
    ],
    sofia: [
      '📍 Estoy saliendo, llego en 10 min',
      '¿Nos vemos en Cuervo Café?',
      'Te mando nota de voz en 1 min',
    ],
    grupo: [
      'Yo llevo el carbón y las bebidas 🔥',
      'Después dividimos gastos con FIN2',
      '¡Confirmado 21:30! 🥩🧉',
    ],
  };

  const cleanPhoneForWa = directPhone.replace(/[^\d]/g, '');

  return (
    <div className="space-y-3 animate-spring-in">
      {/* Header + Sub-tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <IosAppIcon appId={isTelegram ? 'telegram' : 'whatsapp'} size={38} />
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>{isTelegram ? 'Telegram Cloud' : 'WhatsApp Universal'}</span>
              <span
                style={{
                  backgroundColor: `${brand.primaryColor}20`,
                  color: brand.primaryColor,
                  borderColor: `${brand.primaryColor}40`,
                }}
                className="px-1.5 py-0.2 rounded-full text-[9px] font-mono border"
              >
                WA2 Activo
              </span>
            </h4>
            <p className="text-[11px] text-neutral-400">Notas de voz, Click-to-Chat (wa.me) y Respuestas IA</p>
          </div>
        </div>

        <button
          onClick={handleReadMessagesAloud}
          className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-[10px] text-neutral-200 font-semibold cursor-pointer flex items-center gap-1"
          title="Leer últimos mensajes en voz alta (Manos Libres)"
        >
          <Volume2 className="w-3 h-3 text-emerald-400" />
          <span>🔊 Leer Chat</span>
        </button>
      </div>

      {/* Sub-navigation */}
      <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-black/45 border border-white/10 text-[10px]">
        {[
          { id: 'chat', label: '💬 Chat & Voz WA2' },
          { id: 'wame', label: '📱 Sin Agendar (wa.me)' },
          { id: 'templates', label: '⚡ Enviar Alias / GPS' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id as any)}
            style={
              subTab === t.id ? { backgroundColor: brand.primaryColor, color: '#050505' } : {}
            }
            className={`py-1.5 px-2 rounded-lg font-semibold cursor-pointer transition-all truncate ${
              subTab === t.id ? 'font-bold shadow-xs' : 'text-neutral-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {subTab === 'chat' && (
        <div className="space-y-2.5">
          {/* Contact Switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {[
              { id: 'martin', label: 'Martín (Diseño)', unread: 2 },
              { id: 'sofia', label: 'Sofía (Producto)', unread: 1 },
              { id: 'grupo', label: 'Grupo Asado 🥩', unread: 0 },
            ].map(c => (
              <button
                key={c.id}
                onClick={() => setActiveContact(c.id as any)}
                style={
                  activeContact === c.id
                    ? { backgroundColor: brand.primaryColor, color: '#050505' }
                    : {}
                }
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-all flex items-center gap-1.5 shrink-0 ${
                  activeContact === c.id
                    ? 'font-bold shadow-xs'
                    : 'bg-white/10 text-neutral-300 hover:bg-white/15'
                }`}
              >
                <span>{c.label}</span>
              </button>
            ))}
          </div>

          {/* Chat Feed */}
          <div className="p-3 rounded-2xl bg-black/45 border border-white/10 space-y-2 min-h-[140px] max-h-[175px] overflow-y-auto scrollbar-thin">
            {chatMessages[activeContact].map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
              >
                <div
                  style={
                    msg.sender === 'me'
                      ? { backgroundColor: isTelegram ? '#229ed9' : '#128c7e' }
                      : {}
                  }
                  className={`max-w-[88%] rounded-2xl px-3 py-1.5 text-xs leading-relaxed ${
                    msg.sender === 'me'
                      ? 'text-white rounded-br-xs shadow-sm'
                      : 'bg-white/10 text-neutral-200 rounded-bl-xs border border-white/10'
                  }`}
                >
                  {msg.isVoiceNote ? (
                    <div className="flex items-center gap-2 py-0.5">
                      <button
                        onClick={() => {
                          setPlayingVoiceIdx(playingVoiceIdx === idx ? null : idx);
                          if ('speechSynthesis' in window) {
                            window.speechSynthesis.cancel();
                            const u = new SpeechSynthesisUtterance('Hola Martín, te mando esta nota de voz desde Spotlight.');
                            u.lang = 'es-ES';
                            window.speechSynthesis.speak(u);
                          }
                        }}
                        className="w-6 h-6 rounded-full bg-white text-neutral-950 flex items-center justify-center cursor-pointer shrink-0"
                      >
                        {playingVoiceIdx === idx ? (
                          <Pause className="w-3 h-3 fill-current" />
                        ) : (
                          <Play className="w-3 h-3 fill-current" />
                        )}
                      </button>
                      <div className="flex items-center gap-0.5 h-3">
                        {[4, 9, 6, 11, 8, 12, 5, 9, 7, 10, 6].map((h, i) => (
                          <span
                            key={i}
                            style={{ height: `${h}px` }}
                            className="w-0.5 bg-emerald-300 rounded-full"
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono font-bold">{msg.voiceDuration || '0:05'}</span>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
                <div className="flex items-center gap-1 text-[9px] text-neutral-500 mt-0.5 px-1 font-mono">
                  <span>{msg.time}</span>
                  {msg.sender === 'me' && <CheckCheck className="w-3 h-3 text-sky-400" />}
                </div>
              </div>
            ))}

            {isTypingReply && (
              <div className="text-[10px] text-emerald-400 font-mono animate-pulse">
                Escribiendo respuesta...
              </div>
            )}
          </div>

          {/* Contextual AI Smart Replies */}
          {config.aiSmartReplies !== false && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
              {smartRepliesByContact[activeContact].map(quick => (
                <button
                  key={quick}
                  onClick={() => handleSendMessage(quick)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-[10px] text-emerald-200 transition-colors cursor-pointer shrink-0"
                >
                  {quick}
                </button>
              ))}
            </div>
          )}

          {/* Input + WA2 Voice Note Recorder Button */}
          <div className="flex items-center gap-1.5">
            {isRecordingVoice ? (
              <div className="flex-1 flex items-center justify-between px-3 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-200 font-mono">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  Grabando nota de voz... {formatSecs(recordSeconds)}
                </span>
                <button
                  onClick={() => setIsRecordingVoice(false)}
                  className="text-[10px] underline text-neutral-300 cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <input
                type="text"
                placeholder="Escribir mensaje o tocar 🎤 para grabar nota de voz..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none focus:border-emerald-400"
              />
            )}

            {/* WA2 Voice Recorder Button */}
            <button
              onClick={handleToggleVoiceRecord}
              className={`px-3 py-2 rounded-xl font-bold text-xs cursor-pointer flex items-center gap-1 shrink-0 transition-all ${
                isRecordingVoice
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 animate-pulse'
                  : 'bg-white/10 hover:bg-white/15 text-emerald-400 border border-white/10'
              }`}
              title="Grabar y enviar Nota de Voz (WA2)"
            >
              {isRecordingVoice ? (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Audio</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5" />
                  <span>Voz</span>
                </>
              )}
            </button>

            {!isRecordingVoice && (
              <button
                onClick={() => handleSendMessage()}
                disabled={!replyText.trim()}
                style={{ backgroundColor: brand.primaryColor }}
                className="px-3.5 py-2 rounded-xl text-neutral-950 font-bold text-xs cursor-pointer disabled:opacity-40 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CLICK-TO-CHAT SIN AGENDAR (wa.me/+549...) */}
      {subTab === 'wame' && (
        <div className="p-3.5 rounded-2xl bg-black/45 border border-emerald-500/30 space-y-3">
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Chatear con Número sin Agendar en Contactos (wa.me)</span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Ideal para escribir a envíos, comercios o números temporales sin guardarlos en tu agenda
            </p>
          </div>

          <div className="space-y-2">
            <div>
              <label className="text-[10px] font-mono text-neutral-400">NÚMERO CON CÓDIGO DE PAÍS:</label>
              <input
                type="text"
                value={directPhone}
                onChange={e => setDirectPhone(e.target.value)}
                placeholder="+54 9 11 4589-2103"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono text-white outline-none mt-0.5"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-neutral-400">MENSAJE INICIAL:</label>
              <input
                type="text"
                value={directMessage}
                onChange={e => setDirectMessage(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none mt-0.5"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <a
              href={`https://wa.me/${cleanPhoneForWa}?text=${encodeURIComponent(directMessage)}`}
              target="_blank"
              rel="noreferrer"
              style={{ backgroundColor: brand.primaryColor }}
              className="flex-1 py-2 rounded-xl text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
            >
              <span>Abrir Chat Directo en WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: 1-TAP SHARE ALIAS / LOCATION / QUICK TEMPLATES */}
      {subTab === 'templates' && (
        <div className="space-y-2">
          <button
            onClick={() => {
              const txt = `💳 Te paso mis datos para transferir:\n• Alias: ${config.paymentAlias || 'bauti.spotlight.mp'}\n• CVU: ${config.paymentCbu || '0000003100084920194821'}\n• Titular: ${config.paymentHolder || 'Bautista Ayala'}`;
              handleSendMessage(txt);
              setSubTab('chat');
            }}
            className="w-full p-3 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/35 text-left flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Wallet className="w-4 h-4 text-sky-400" />
              <div>
                <div className="text-xs font-bold text-white">Enviar Mi Alias y CVU de Mercado Pago</div>
                <div className="text-[10px] text-sky-300 font-mono">{config.paymentAlias || 'bauti.spotlight.mp'}</div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-sky-300">Enviar al Chat →</span>
          </button>

          <button
            onClick={() => {
              handleSendMessage('📍 Mi ubicación actual en tiempo real: https://maps.google.com/?q=-34.588,-58.430 (Palermo, CABA)');
              setSubTab('chat');
            }}
            className="w-full p-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/35 text-left flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-white">Enviar Mi Ubicación Actual (Google Maps)</div>
                <div className="text-[10px] text-emerald-300">Precisión GPS 4m • Palermo, Buenos Aires</div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-300">Enviar al Chat →</span>
          </button>
        </div>
      )}
    </div>
  );
};
