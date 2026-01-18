import React, { useState, useRef } from 'react';
import { Play, Pause, Music, Volume2 } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'White Noise', type: 'Soothing', color: 'slate', url: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_0788523c95.mp3' }, 
  { id: 2, title: 'Gentle Lullaby', type: 'Sleep', color: 'indigo', url: 'https://cdn.pixabay.com/download/audio/2021/11/24/audio_c36f01c8eb.mp3' },
  { id: 3, title: 'Forest Rain', type: 'Nature', color: 'teal', url: 'https://cdn.pixabay.com/download/audio/2022/02/10/audio_fc8c44f809.mp3' },
  { id: 4, title: 'Soft Piano', type: 'Relaxing', color: 'pink', url: 'https://cdn.pixabay.com/download/audio/2020/09/14/audio_344196c5d1.mp3' }
];

const LullabyPlayer = () => {
  const [playing, setPlaying] = useState(null);
  const audioRef = useRef(new Audio());

  const togglePlay = (track) => {
    if (playing?.id === track.id) {
       audioRef.current.pause();
       setPlaying(null);
    } else {
       if (playing) audioRef.current.pause();
       audioRef.current.src = track.url;
       audioRef.current.loop = true;
       audioRef.current.play().catch(e => console.error("Playback error:", e));
       setPlaying(track);
    }
  };

  return (
    <div className="pb-24 animate-in slide-in-from-right duration-500">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
          <Music size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-800">Soothing Sounds</h2>
        <p className="text-slate-400 text-sm">Help your baby sleep better</p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden relative border border-slate-100 p-6">
        {/* Visualizer Animation Placeholder */}
        <div className="absolute top-0 left-0 w-full h-[200px] opacity-10 pointer-events-none">
           <div className={`w-full h-full bg-gradient-to-b from-${playing ? playing.color : 'slate'}-500 to-transparent transition-colors duration-1000`}></div>
        </div>

        {playing && (
          <div className="text-center mb-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={`w-12 h-12 mx-auto bg-${playing.color}-100 text-${playing.color}-600 rounded-full flex items-center justify-center mb-4 animate-bounce`}>
              <Volume2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">{playing.title}</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Now Playing</p>
          </div>
        )}

        <div className="grid gap-4 relative z-10">
          {TRACKS.map(track => (
            <button
              key={track.id}
              onClick={() => togglePlay(track)}
              className={`flex items-center p-4 rounded-2xl transition-all border ${
                playing?.id === track.id 
                 ? 'bg-slate-900 text-white border-transparent shadow-lg scale-[1.02]' 
                 : 'bg-slate-50 hover:bg-slate-100 border-transparent text-slate-600'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                playing?.id === track.id ? 'bg-white/20' : `bg-${track.color}-100 text-${track.color}-600`
              }`}>
                {playing?.id === track.id ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-sm">{track.title}</p>
                <p className={`text-[10px] uppercase font-bold tracking-wider ${
                    playing?.id === track.id ? 'text-slate-400' : 'text-slate-400'
                }`}>{track.type}</p>
              </div>
              {playing?.id === track.id && (
                <div className="flex gap-1 items-end h-4">
                  <div className="w-1 bg-teal-400 animate-[pulse_0.5s_infinite] h-2"></div>
                  <div className="w-1 bg-teal-400 animate-[pulse_0.7s_infinite] h-4"></div>
                  <div className="w-1 bg-teal-400 animate-[pulse_0.6s_infinite] h-3"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LullabyPlayer;
