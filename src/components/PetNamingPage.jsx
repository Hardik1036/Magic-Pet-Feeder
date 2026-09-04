import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, Volume2, PawPrint } from 'lucide-react';
import { PETS } from '../data/pets.js';

export default function PetNamingPage({
  selectedPetId,
  currentPetName,
  playerName,
  onConfirmName,
  onBack,
}) {
  const currentPet = PETS.find((p) => p.id === selectedPetId) || PETS[0];
  const [name, setName] = useState(currentPetName || currentPet.defaultName);

  const speakPrompt = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `What would you like to name your new ${currentPet.species}?`;
      const u = new SpeechSynthesisUtterance(text);
      u.pitch = currentPet.voice.pitch;
      u.rate = currentPet.voice.rate;
      window.speechSynthesis.speak(u);
    }
  };

  const handleStart = (e) => {
    if (e) e.preventDefault();
    const finalName = name.trim() || currentPet.defaultName;
    onConfirmName(finalName);
  };

  return (
    <div
      className="relative w-full h-full max-h-[100dvh] bg-gradient-to-b from-sky-300 via-indigo-100 to-pink-200 flex flex-col justify-between items-center px-3 py-2 sm:p-4 select-none overflow-y-auto font-sans"
      style={{ touchAction: 'manipulation' }}
    >
      {/* Top Navigation */}
      <header className="w-full max-w-md flex items-center justify-between pt-0.5 flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 bg-white/85 active:scale-95 px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-md border-2 border-slate-200 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Choose Another</span>
        </button>

        <button
          onClick={speakPrompt}
          aria-label="Listen to voice"
          className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-400 text-amber-950 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform"
        >
          <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </header>

      {/* Main Content Card */}
      <main className="w-full max-w-md my-auto bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-2xl border-3 sm:border-4 border-amber-400 flex flex-col gap-3 sm:gap-4 text-center z-10">
        {/* Mascot Avatar Preview */}
        <div className="flex flex-col items-center">
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl shadow-inner bg-gradient-to-tr ${currentPet.bgColor} animate-bounce`}
          >
            {currentPet.icon}
          </div>
          <span className="text-[10px] sm:text-xs font-black text-amber-600 uppercase tracking-widest mt-1.5">
            You picked {currentPet.species}!
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight mt-0.5">
            Give Your Pet A Name!
          </h1>
          <p className="text-[11px] sm:text-xs font-semibold text-slate-600">
            {playerName}, what would you like to call your new friend?
          </p>
        </div>

        <form onSubmit={handleStart} className="flex flex-col gap-3 text-left">
          <div>
            <label className="flex items-center gap-1.5 text-[11px] sm:text-xs font-black text-purple-900 uppercase tracking-wider mb-1">
              <PawPrint className="w-3.5 h-3.5 text-purple-600" />
              <span>Pet Nickname:</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={currentPet.defaultName}
              maxLength={20}
              autoFocus
              className="w-full text-lg sm:text-xl font-black text-slate-800 px-3.5 py-2.5 rounded-xl sm:rounded-2xl bg-purple-50/70 border-2 border-purple-300 focus:border-purple-500 focus:bg-white outline-none transition-all shadow-inner text-center"
            />

            {/* Quick Tap Suggested Names */}
            <div className="flex flex-wrap gap-1 justify-center mt-2">
              {currentPet.suggestedNames.map((sug) => (
                <button
                  type="button"
                  key={sug}
                  onClick={() => setName(sug)}
                  className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border transition-all ${
                    name === sug
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs scale-105'
                      : 'bg-white text-purple-700 border-purple-200 active:scale-95'
                  }`}
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-base sm:text-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 mt-1"
          >
            <span>LET'S FEED {name.trim().toUpperCase() || currentPet.defaultName.toUpperCase()}!</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </form>
      </main>

      <footer className="w-full max-w-md pb-1 text-center text-[10px] sm:text-xs font-bold text-indigo-900/70 flex-shrink-0">
        💖 Your pet will remember you whenever you return!
      </footer>
    </div>
  );
}
