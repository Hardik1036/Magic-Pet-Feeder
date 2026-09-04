import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Volume2, Check, Heart, Trophy } from 'lucide-react';
import { PETS } from '../data/pets.js';

export default function PetSelectPage({
  playerName,
  petsProgress = {},
  selectedPetId,
  onSelectPet,
  onOpenBadges,
  onBack,
}) {
  const [activePetId, setActivePetId] = useState(selectedPetId || PETS[0].id);

  const playVoicePreview = (pet) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const petProg = petsProgress[pet.id];
      const displayName = petProg?.customName || pet.defaultName;
      const text = `Hi ${playerName}! I'm ${displayName}! ${pet.voice.greeting}`;
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
      className="relative w-full h-full max-h-[100dvh] bg-gradient-to-b from-sky-300 via-indigo-100 to-pink-200 flex flex-col justify-between items-center px-2 py-1.5 sm:px-4 sm:py-3 select-none overflow-hidden font-sans"
      style={{ touchAction: 'manipulation' }}
    >
      {/* Top Navigation */}
      <header className="w-full max-w-md flex items-center justify-between pt-0.5 flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 bg-white/85 active:scale-95 px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-md border-2 border-slate-200 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Profile</span>
        </button>

        <div className="flex items-center gap-1.5">
          {onOpenBadges && (
            <button
              onClick={onOpenBadges}
              className="flex items-center gap-1 bg-amber-400 text-amber-950 active:scale-95 px-2.5 py-1 rounded-full text-xs font-black shadow-md border-2 border-amber-500 transition-transform"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Trophies</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-white/85 px-2.5 py-1 rounded-full shadow-md border-2 border-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span className="text-xs font-black text-purple-900 uppercase">
              {playerName || 'Player'}'s Pets
            </span>
          </div>
        </div>
      </header>

      {/* Main Title */}
      <div className="w-full max-w-md text-center my-0.5 flex-shrink-0">
        <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
          Choose Your Magic Pet!
        </h1>
        <p className="text-[11px] sm:text-xs font-semibold text-slate-600">
          Tap any pet to hear its voice! Each animal keeps its own progress!
        </p>
      </div>

      {/* 8 Pets Grid */}
      <main className="w-full max-w-md flex-1 min-h-0 my-1 grid grid-cols-2 gap-2 z-10 overflow-y-auto pr-0.5 pb-1">
        {PETS.map((pet) => {
          const isSelected = activePetId === pet.id;
          const prog = petsProgress[pet.id];
          const hasPlayed = prog && prog.feedCount > 0;
          const petDisplayName = prog?.customName || pet.defaultName;

          return (
            <div
              key={pet.id}
              onClick={() => {
                setActivePetId(pet.id);
                playVoicePreview(pet);
              }}
              className={`
                relative bg-white/95 rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 flex flex-col items-center justify-between text-center
                cursor-pointer shadow-md border-2 sm:border-3 transition-all duration-200 active:scale-95
                ${
                  isSelected
                    ? 'border-amber-400 ring-2 sm:ring-4 ring-amber-200 shadow-lg bg-gradient-to-b from-white to-amber-50'
                    : 'border-slate-200 hover:border-indigo-300'
                }
              `}
            >
              {/* Selected Check Badge */}
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-black shadow-xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              {/* Saved Progress Chip if pet was played */}
              {hasPlayed && (
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[8px] sm:text-[9px] font-black border border-emerald-300">
                  Feeds: {prog.feedCount}
                </div>
              )}

              {/* Big Mascot Icon */}
              <div
                className={`w-14 h-14 sm:w-18 sm:h-18 rounded-xl sm:rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-inner mt-1 bg-gradient-to-tr ${pet.bgColor} ${
                  isSelected ? 'animate-bounce' : ''
                }`}
              >
                {pet.icon}
              </div>

              {/* Pet Info */}
              <div className="mt-1 w-full">
                <h3 className="text-xs sm:text-sm font-black text-slate-800 leading-tight">
                  {petDisplayName}
                </h3>
                <span className="text-[9px] font-bold text-slate-500 block uppercase tracking-wider">
                  {pet.species}
                </span>
                <p className="text-[8px] font-medium text-slate-600 line-clamp-1 mt-0.5 leading-snug">
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
                className="mt-1 w-full py-0.5 px-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-extrabold flex items-center justify-center gap-1 active:scale-90 transition-transform"
              >
                <Volume2 className="w-3 h-3 text-indigo-600" />
                <span>Hear Voice</span>
              </button>
            </div>
          );
        })}
      </main>

      {/* Confirm Selection Button */}
      <footer className="w-full max-w-md pt-1 pb-1 flex-shrink-0">
        {(() => {
          const currentPet = PETS.find((p) => p.id === activePetId) || PETS[0];
          const petProg = petsProgress[currentPet.id];
          const displayName = petProg?.customName || currentPet.defaultName;

          return (
            <button
              onClick={() => handleConfirm(currentPet)}
              className="w-full py-3 px-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-base sm:text-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5 fill-white text-white animate-pulse" />
              <span>SELECT {displayName.toUpperCase()}! ➔</span>
            </button>
          );
        })()}
      </footer>
    </div>
  );
}
