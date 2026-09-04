import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Volume2, Check, Heart } from 'lucide-react';
import { PETS } from '../data/pets.js';

export default function PetSelectPage({
  playerName,
  petNickname,
  selectedPetId,
  onSelectPet,
  onBack,
}) {
  const [activePetId, setActivePetId] = useState(selectedPetId || PETS[0].id);

  const playVoicePreview = (pet) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `Hi ${playerName}! I'm ${petNickname || pet.defaultName}! ${pet.voice.greeting}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = pet.voice.pitch;
      utterance.rate = pet.voice.rate;
      utterance.lang = 'en-US';

      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))
      );
      if (naturalVoice) utterance.voice = naturalVoice;

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleConfirm = (pet) => {
    onSelectPet(pet.id);
  };

  return (
    <div
      className="relative w-full min-h-screen bg-gradient-to-b from-sky-300 via-indigo-100 to-pink-200 flex flex-col justify-between items-center p-3 sm:p-5 select-none font-sans"
      style={{ touchAction: 'manipulation' }}
    >
      {/* Top Navigation */}
      <header className="w-full max-w-md flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 bg-white/85 active:scale-95 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 shadow-md border-2 border-slate-200 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-1 bg-white/85 px-3 py-1.5 rounded-full shadow-md border-2 border-purple-300">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span className="text-xs font-black text-purple-900 uppercase">
            Pick For {playerName || 'Player'}
          </span>
        </div>
      </header>

      {/* Main Title */}
      <div className="w-full max-w-md text-center my-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
          Choose Your Magic Pet!
        </h1>
        <p className="text-xs font-semibold text-slate-600">
          Tap each pet to hear its unique voice, then start your journey!
        </p>
      </div>

      {/* 4 Pet Cards Grid */}
      <main className="w-full max-w-md my-auto grid grid-cols-2 gap-3 z-10">
        {PETS.map((pet) => {
          const isSelected = activePetId === pet.id;

          return (
            <div
              key={pet.id}
              onClick={() => {
                setActivePetId(pet.id);
                playVoicePreview(pet);
              }}
              className={`
                relative bg-white/95 rounded-3xl p-3 sm:p-4 flex flex-col items-center justify-between text-center
                cursor-pointer shadow-lg border-4 transition-all duration-300 active:scale-95
                ${
                  isSelected
                    ? 'border-amber-400 scale-105 ring-4 ring-amber-200 shadow-xl bg-gradient-to-b from-white to-amber-50'
                    : 'border-slate-200 hover:border-indigo-300'
                }
              `}
            >
              {/* Selected Check Badge */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-black shadow-sm">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}

              {/* Big Mascot Icon */}
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-5xl sm:text-6xl shadow-inner bg-gradient-to-tr ${pet.bgColor} ${
                  isSelected ? 'animate-bounce' : ''
                }`}
              >
                {pet.icon}
              </div>

              {/* Pet Info */}
              <div className="mt-2 w-full">
                <h3 className="text-base sm:text-lg font-black text-slate-800 leading-tight">
                  {petNickname || pet.defaultName}
                </h3>
                <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">
                  {pet.species}
                </span>
                <p className="text-[10px] font-medium text-slate-600 line-clamp-2 mt-1 leading-snug">
                  {pet.tagline}
                </p>
              </div>

              {/* Hear Voice Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePetId(pet.id);
                  playVoicePreview(pet);
                }}
                className="mt-2 w-full py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold flex items-center justify-center gap-1 active:scale-90 transition-transform"
              >
                <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Hear Voice</span>
              </button>
            </div>
          );
        })}
      </main>

      {/* Confirm Selection Button */}
      <footer className="w-full max-w-md pt-2 pb-2">
        {(() => {
          const currentPet = PETS.find((p) => p.id === activePetId) || PETS[0];
          return (
            <button
              onClick={() => handleConfirm(currentPet)}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-lg shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <Heart className="w-6 h-6 fill-white text-white animate-pulse" />
              <span>I CHOOSE {currentPet.species.toUpperCase()}!</span>
            </button>
          );
        })()}
      </footer>
    </div>
  );
}
