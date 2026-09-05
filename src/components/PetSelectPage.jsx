import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Volume2, Check, Heart, Trophy, Hand } from 'lucide-react';
import { PETS } from '../data/pets.js';
import ThreePetCanvas from './ThreePetCanvas.jsx';
import { sfx } from '../utils/audio.js';

export default function PetSelectPage({
  playerName,
  petsProgress = {},
  selectedPetId,
  onSelectPet,
  onOpenBadges,
  onBack,
}) {
  const [activePetId, setActivePetId] = useState(selectedPetId || PETS[0].id);
  const [pettingReact, setPettingReact] = useState('');

  const currentPet = PETS.find((p) => p.id === activePetId) || PETS[0];
  const petProg = petsProgress[currentPet.id];
  const displayName = petProg?.customName || currentPet.defaultName;

  const playVoicePreview = (pet) => {
    sfx.pop();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const prog = petsProgress[pet.id];
      const name = prog?.customName || pet.defaultName;
      const text = `Hi ${playerName}! I'm ${name}! ${pet.voice.greeting}`;
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
    sfx.fanfare();
    onSelectPet(pet.id);
  };

  const handlePetAvatar = () => {
    setPettingReact('❤️ Purr! You petted me!');
    setTimeout(() => setPettingReact(''), 2000);
  };

  return (
    <div
      className="relative w-full h-full max-h-[100dvh] bg-gradient-to-b from-sky-300 via-indigo-100 to-pink-200 flex flex-col justify-between items-center px-2 py-1 sm:px-3 sm:py-2 select-none overflow-hidden font-sans"
      style={{ touchAction: 'manipulation' }}
    >
      {/* Top Header Navigation */}
      <header className="w-full max-w-md flex items-center justify-between pt-0.5 flex-shrink-0 z-20">
        <button
          onClick={() => {
            sfx.pop();
            onBack();
          }}
          className="flex items-center gap-1.5 bg-white/90 active:scale-95 px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-md border-2 border-slate-200 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Profile</span>
        </button>

        <div className="flex items-center gap-1.5">
          {onOpenBadges && (
            <button
              onClick={() => {
                sfx.pop();
                onOpenBadges();
              }}
              className="flex items-center gap-1 bg-amber-400 text-amber-950 active:scale-95 px-2.5 py-1 rounded-full text-xs font-black shadow-md border-2 border-amber-500 transition-transform"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Trophies</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-white/90 px-2.5 py-1 rounded-full shadow-md border-2 border-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span className="text-xs font-black text-purple-900 uppercase">
              {playerName || 'Player'}'s World
            </span>
          </div>
        </div>
      </header>

      {/* ------------------------------------ */}
      {/* 3D AVATAR HERO SHOWCASE STAGE        */}
      {/* ------------------------------------ */}
      <section className="w-full max-w-md my-1 flex flex-col items-center relative z-10 flex-shrink-0">
        <div className="relative w-full h-44 sm:h-52 bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-1.5 shadow-xl border-3 border-amber-300 flex items-center justify-center overflow-hidden">
          {/* Ambient Spotlight Aura */}
          <div className="absolute inset-0 bg-gradient-to-t from-amber-100/60 via-transparent to-sky-100/50 pointer-events-none" />

          {/* 3D Interactive Canvas */}
          <div className="relative w-full h-full flex items-center justify-center">
            <ThreePetCanvas
              key="select_pet_canvas"
              petId={activePetId}
              expression="idle"
              isNearFood={false}
              accessories={['crown', 'sunglasses']}
              onPet={handlePetAvatar}
              className="w-full h-full"
            />
          </div>

          {/* Top-Left: Live 3D Badge */}
          <div className="absolute top-2 left-2.5 flex items-center gap-1 bg-slate-900/80 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-400/30 backdrop-blur-md shadow pointer-events-none">
            <Sparkles className="w-3 h-3 text-emerald-400 animate-spin" />
            <span>3D LIVE AVATAR</span>
          </div>

          {/* Top-Right: Hear Voice Button */}
          <button
            type="button"
            onClick={() => playVoicePreview(currentPet)}
            className="absolute top-2 right-2.5 flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-amber-950 text-[10px] font-black px-2 py-1 rounded-full shadow-md active:scale-90 transition-transform"
            title="Hear Voice"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Voice</span>
          </button>

          {/* Bottom Overlay: Active Pet Info Banner */}
          <div className="absolute bottom-1.5 inset-x-2 bg-slate-900/85 backdrop-blur-md text-white rounded-xl py-1 px-2.5 flex items-center justify-between border border-white/20 shadow">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm">{currentPet.icon}</span>
                <h2 className="text-xs sm:text-sm font-black text-amber-300 leading-tight">
                  {displayName}
                </h2>
                <span className="text-[9px] uppercase font-bold text-slate-300 tracking-wider">
                  • {currentPet.species}
                </span>
              </div>
              <p className="text-[9px] text-slate-300 font-medium leading-none line-clamp-1 mt-0.5">
                {pettingReact || currentPet.tagline}
              </p>
            </div>

            <div className="flex items-center gap-1 text-[9px] text-emerald-300 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <Hand className="w-3 h-3" />
              <span>Pet head!</span>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------ */}
      {/* 8 AVAILABLE PETS SELECTOR TRAY       */}
      {/* ------------------------------------ */}
      <main className="w-full max-w-md flex-1 min-h-0 my-0.5 grid grid-cols-4 gap-1.5 z-10 overflow-y-auto pr-0.5 pb-1">
        {PETS.map((pet) => {
          const isSelected = activePetId === pet.id;
          const prog = petsProgress[pet.id];
          const hasPlayed = prog && prog.feedCount > 0;
          const petDisplayName = prog?.customName || pet.defaultName;

          return (
            <div
              key={pet.id}
              onClick={() => {
                sfx.pop();
                setActivePetId(pet.id);
                playVoicePreview(pet);
              }}
              className={`
                relative bg-white/95 rounded-xl sm:rounded-2xl p-1 sm:p-1.5 flex flex-col items-center justify-between text-center
                cursor-pointer shadow-sm border-2 transition-all duration-200 active:scale-95
                ${
                  isSelected
                    ? 'border-amber-400 ring-2 ring-amber-300 shadow-md bg-gradient-to-b from-white to-amber-50 scale-[1.02]'
                    : 'border-slate-200 hover:border-indigo-300 opacity-90'
                }
              `}
            >
              {/* Selected Check Badge */}
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-black shadow-xs z-10">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}

              {/* Played Feeds Badge */}
              {hasPlayed && (
                <div className="absolute top-0.5 left-0.5 px-1 rounded-full bg-emerald-100 text-emerald-800 text-[7px] font-black border border-emerald-300">
                  ★{prog.feedCount}
                </div>
              )}

              {/* Icon Container */}
              <div
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-inner mt-0.5 bg-gradient-to-tr ${pet.bgColor} ${
                  isSelected ? 'animate-bounce' : ''
                }`}
              >
                {pet.icon}
              </div>

              {/* Pet Info */}
              <div className="mt-0.5 w-full">
                <h3 className="text-[10px] sm:text-xs font-black text-slate-800 leading-tight truncate">
                  {petDisplayName}
                </h3>
                <span className="text-[8px] font-extrabold text-indigo-600 block uppercase tracking-wider">
                  {pet.species}
                </span>
              </div>
            </div>
          );
        })}
      </main>

      {/* ------------------------------------ */}
      {/* CONFIRM SELECTION BUTTON             */}
      {/* ------------------------------------ */}
      <footer className="w-full max-w-md pt-1 pb-1 flex-shrink-0 z-20">
        <button
          onClick={() => handleConfirm(currentPet)}
          className="w-full py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm sm:text-base shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 border-b-4 border-teal-700"
        >
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white animate-pulse" />
          <span>PLAY WITH {displayName.toUpperCase()}! ➔</span>
        </button>
      </footer>
    </div>
  );
}
