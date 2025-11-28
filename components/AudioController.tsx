
import React, { useState, useEffect, useRef } from 'react';
import { MusicMood, AmbienceType } from '../types';
import { MUSIC_TRACKS, AMBIENCE_TRACKS } from '../constants';
import { Volume2, VolumeX, Music, Waves } from 'lucide-react';

interface AudioControllerProps {
  musicMood: MusicMood;
  ambience: AmbienceType;
}

const AudioController: React.FC<AudioControllerProps> = ({ musicMood, ambience }) => {
  const [isEnabled, setIsEnabled] = useState(false); // Browser autoplay policy requires user interaction
  const [isMuted, setIsMuted] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.4);
  
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const ambienceRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio Objects
  useEffect(() => {
    musicRef.current = new Audio();
    musicRef.current.loop = true;
    
    ambienceRef.current = new Audio();
    ambienceRef.current.loop = true;

    return () => {
      if (musicRef.current) musicRef.current.pause();
      if (ambienceRef.current) ambienceRef.current.pause();
    };
  }, []);

  // Handle Music Change
  useEffect(() => {
    if (!isEnabled || !musicRef.current) return;

    const track = MUSIC_TRACKS[musicMood];
    if (!track) return;

    // Prevent restart if already playing same track
    // Note: Using a simple src check might fail if src is relative, but works for this concept
    if (musicRef.current.src.endsWith(track.src)) return;

    const playNewTrack = async () => {
        if (musicRef.current) {
            // Simple crossfade simulation: pause old, swap src, play new
            // In a real engine, we'd fade volume out/in
            musicRef.current.src = track.src;
            musicRef.current.volume = isMuted ? 0 : musicVolume;
            try {
                await musicRef.current.play();
            } catch (e) {
                console.warn("Audio playback failed (likely missing file):", e);
            }
        }
    };

    playNewTrack();
  }, [musicMood, isEnabled, isMuted, musicVolume]);

  // Handle Ambience Change
  useEffect(() => {
    if (!isEnabled || !ambienceRef.current) return;

    const track = AMBIENCE_TRACKS[ambience];
    
    const playAmbience = async () => {
        if (ambienceRef.current) {
             if (track.src === '') {
                 ambienceRef.current.pause();
                 return;
             }
             
             if (!ambienceRef.current.src.endsWith(track.src)) {
                 ambienceRef.current.src = track.src;
                 ambienceRef.current.volume = isMuted ? 0 : musicVolume * 0.8; // Ambience slightly quieter
                 try {
                    await ambienceRef.current.play();
                 } catch (e) {
                    console.warn("Ambience playback failed:", e);
                 }
             }
        }
    };
    playAmbience();
  }, [ambience, isEnabled, isMuted, musicVolume]);

  // Handle Volume/Mute Toggle
  useEffect(() => {
    if (musicRef.current) musicRef.current.volume = isMuted ? 0 : musicVolume;
    if (ambienceRef.current) ambienceRef.current.volume = isMuted ? 0 : (musicVolume * 0.8);
  }, [isMuted, musicVolume]);

  const toggleAudio = () => {
    if (!isEnabled) {
        setIsEnabled(true); // First interaction enables audio context
        // Trigger initial play
        if (musicRef.current && MUSIC_TRACKS[musicMood]) {
             musicRef.current.src = MUSIC_TRACKS[musicMood].src;
             musicRef.current.play().catch(e => console.log("Waiting for interaction"));
        }
    } else {
        setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 pointer-events-auto">
      {isEnabled && (
        <div className="bg-slate-900/90 border border-slate-700 rounded-lg p-3 backdrop-blur-md shadow-xl w-64 transition-all">
          <div className="flex items-center gap-3 mb-2">
             <Music size={16} className="text-emerald-400 animate-pulse" />
             <div className="overflow-hidden">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Now Playing</p>
                <p className="text-xs text-white whitespace-nowrap font-display">{MUSIC_TRACKS[musicMood]?.title || 'Silence'}</p>
             </div>
          </div>
          
          {ambience !== 'none' && (
            <div className="flex items-center gap-3 mb-3">
                <Waves size={16} className="text-blue-400" />
                 <div className="overflow-hidden">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Ambience</p>
                    <p className="text-xs text-slate-300 whitespace-nowrap">{AMBIENCE_TRACKS[ambience]?.title}</p>
                 </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Volume2 size={14} className="text-slate-400"/>
            <input 
              type="range" 
              min="0" max="1" step="0.1" 
              value={musicVolume} 
              onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>
      )}

      <button 
        onClick={toggleAudio}
        className={`p-3 rounded-full shadow-lg transition-all transform hover:scale-105 ${isEnabled && !isMuted ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'}`}
        title={isEnabled ? (isMuted ? "Unmute" : "Mute") : "Enable Audio"}
      >
        {isEnabled && !isMuted ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>
    </div>
  );
};

export default AudioController;
