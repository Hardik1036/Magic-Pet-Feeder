import React, { useState, useRef } from 'react';
import { ArrowLeft, Sparkles, Volume2, Check, Heart, Trophy, Hand } from 'lucide-react';
import { PETS } from '../data/pets.js';
import PetAvatar from './PetAvatar.jsx';
import { sfx, speakPetText } from '../utils/audio.js';

export default function PetSelectPage({
  playerName,
  petsProgress = {},
  selectedPetId,
  audioLanguage = 'en',
  onToggleLanguage,
  onSelectPet,
  onOpenBadges,
  onBack,
}) {
  const [activePetId, setActivePetId] = useState(selectedPetId || PETS[0].id);
  const [pettingReact, setPettingReact] = useState('');
  const [isPetting, setIsPetting] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [loveCount, setLoveCount] = useState(0);
  const [pointerDown, setPointerDown] = useState(false);

  const lastPetTimeRef = useRef(0);
  const stageRef = useRef(null);

  const currentPet = PETS.find((p) => p.id === activePetId) || PETS[0];
  const petProg = petsProgress[currentPet.id];
  const displayName = petProg?.customName || currentPet.defaultName;

  const PETTING_PHRASES = [
    '❤️ Purrrr! That tickles!',
    '🥰 You are my best friend!',
    '✨ So soft and warm!',
    '💖 I love gentle strokes!',
    '🐾 More tummy rubs, please!',
    '🌟 Hehe, that feels so nice!',
    '💕 You give the best pets!',
  ];

  const playVoicePreview = (pet) => {
    sfx.pop();
    const prog = petsProgress[pet.id];
    const name = prog?.customName || pet.defaultName;
    const text = `Hi ${playerName}! I'm ${name}! ${pet.voice.greeting}`;
    speakPetText(text, pet.voice);
  };

  const handleConfirm = (pet) => {
    sfx.fanfare();
    onSelectPet(pet.id);
  };

  // Interactive Petting Engine
  const triggerPetting = (clientX, clientY) => {
    const now = Date.now();
    if (now - lastPetTimeRef.current < 170) return;
    lastPetTimeRef.current = now;

    // Purr / chime audio
    if (typeof sfx.purr === 'function') {
      sfx.purr();
    } else {
      sfx.chime(loveCount % 6);
    }

    setIsPetting(true);
    setLoveCount((c) => c + 1);

    // Random cute phrase
    const randomPhrase = PETTING_PHRASES[Math.floor(Math.random() * PETTING_PHRASES.length)];
    setPettingReact(randomPhrase);

    // Compute relative coordinates for floating hearts
    let heartX = 50;
    let heartY = 42;
    if (stageRef.current && clientX != null && clientY != null) {
      const rect = stageRef.current.getBoundingClientRect();
      heartX = Math.max(15, Math.min(85, ((clientX - rect.left) / rect.width) * 100));
      heartY = Math.max(15, Math.min(80, ((clientY - rect.top) / rect.height) * 100));
    } else {
      heartX = 35 + Math.random() * 30;
      heartY = 30 + Math.random() * 25;
    }

    const heartIcons = ['❤️', '💖', '✨', '🥰', '💕', '🐾', '🌸'];
    const heartIcon = heartIcons[Math.floor(Math.random() * heartIcons.length)];
    const heartId = Date.now() + Math.random();

    setHearts((prev) => [...prev.slice(-7), { id: heartId, x: heartX, y: heartY, icon: heartIcon }]);

    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== heartId));
    }, 1200);

    setTimeout(() => {
      if (Date.now() - lastPetTimeRef.current >= 1900) {
        setIsPetting(false);
        setPettingReact('');
      }
    }, 2100);
  };

  const handlePointerDown = (e) => {
    setPointerDown(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    triggerPetting(clientX, clientY);
  };

  const handlePointerMove = (e) => {
    if (!pointerDown) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    triggerPetting(clientX, clientY);
  };

  const handlePointerUp = () => {
    setPointerDown(false);
  };

  return (
    <div
      className="relative w-full h-full max-h-[100dvh] bg-gradient-to-b from-sky-300 via-indigo-100 to-pink-200 flex flex-col justify-between items-center px-2 py-1 sm:px-3 sm:py-2 select-none overflow-hidden font-sans"
      style={{ touchAction: 'manipulation' }}
      onPointerUp={handlePointerUp}
    >
      {/* Top Header Navigation */}
      <header className="w-full max-w-md flex items-center justify-between pt-0.5 flex-shrink-0 z-20">
        <button
          type="button"
          onClick={() => {
            sfx.pop();
            onBack();
          }}
          className="flex items-center gap-1.5 bg-white/90 active:scale-95 px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-md border-2 border-slate-200 transition-transform cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Profile</span>
        </button>

        <div className="flex items-center gap-1.5">
          {onToggleLanguage && (
            <button
              type="button"
              onClick={onToggleLanguage}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black shadow-sm border-2 transition-all active:scale-95 cursor-pointer ${
                audioLanguage === 'hi' || audioLanguage === 'hinglish'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-300 ring-2 ring-emerald-200'
                  : 'bg-white/95 text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title={audioLanguage === 'hi' || audioLanguage === 'hinglish' ? 'Switch to English audio' : 'Switch to Hindi audio'}
            >
              <span>{audioLanguage === 'hi' || audioLanguage === 'hinglish' ? '🇮🇳' : '🇬🇧'}</span>
              <span>{audioLanguage === 'hi' || audioLanguage === 'hinglish' ? 'हिंदी' : 'English'}</span>
            </button>
          )}

          {onOpenBadges && (
            <button
              type="button"
              onClick={() => {
                sfx.pop();
                onOpenBadges();
              }}
              className="flex items-center gap-1 bg-amber-400 text-amber-950 active:scale-95 px-2.5 py-1 rounded-full text-xs font-black shadow-md border-2 border-amber-500 transition-transform cursor-pointer"
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

      {/* ------------------------------------------------------------- */}
      {/* 1. REST OF THE SCREEN: HUGE INTERACTIVE PETTING PREVIEW ARENA */}
      {/* ------------------------------------------------------------- */}
      <section
        ref={stageRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        className="w-full max-w-md sm:max-w-lg flex-1 min-h-0 relative my-1.5 rounded-3xl bg-gradient-to-b from-white/95 via-sky-50/90 to-amber-50/90 backdrop-blur-md border-3 border-amber-300 shadow-2xl flex flex-col items-center justify-between p-2.5 sm:p-3 overflow-hidden select-none cursor-pointer z-10"
        title="Rub, stroke, or tap to pet your pet!"
      >
        {/* Ambient Radial Spotlight Aura */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(254,240,138,0.45)_0%,rgba(186,230,253,0.2)_60%,transparent_100%)] pointer-events-none" />

        {/* Top Info Banner in Stage */}
        <div className="w-full flex items-center justify-between z-20 flex-shrink-0">
          <div className="flex items-center gap-1.5 bg-slate-900/80 text-white text-xs font-black px-3 py-1 rounded-full border border-white/20 backdrop-blur-md shadow-sm">
            <span className="text-sm">{currentPet.icon}</span>
            <span className="text-amber-300">{displayName}</span>
            <span className="text-[10px] text-slate-300 font-bold uppercase">• {currentPet.species}</span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playVoicePreview(currentPet);
            }}
            className="flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs font-black px-3 py-1 rounded-full shadow-md border border-amber-500 active:scale-90 transition-transform cursor-pointer"
            title="Hear Pet's Voice"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Voice</span>
          </button>
        </div>

        {/* Center: Large Interactive Pet Avatar */}
        <div className="relative w-full flex-1 flex items-center justify-center my-auto">
          {/* Reaction Bubble over Pet */}
          {pettingReact && (
            <div className="absolute -top-3 sm:-top-5 z-30 bg-white/95 backdrop-blur-xs px-3.5 py-1 rounded-full shadow-xl border-2 border-pink-400 text-xs sm:text-sm font-black text-pink-700 animate-bounce flex items-center gap-1.5 pointer-events-none">
              <span>{pettingReact}</span>
            </div>
          )}

          {/* Floating Hearts from Petting */}
          {hearts.map((h) => (
            <div
              key={h.id}
              style={{
                left: `${h.x}%`,
                top: `${h.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute pointer-events-none text-2xl sm:text-3xl animate-bounce z-35 transition-all duration-700 opacity-90 select-none"
            >
              {h.icon}
            </div>
          ))}

          {/* Scaled-up Pet Avatar */}
          <div
            className={`w-52 h-52 sm:w-64 sm:h-64 flex items-center justify-center transform-gpu transition-transform duration-200 ${
              isPetting ? 'scale-110 sm:scale-120' : 'scale-100 sm:scale-110'
            }`}
          >
            <PetAvatar
              petId={activePetId}
              stageIndex={petProg?.stageIndex ?? 1}
              feedCount={petProg?.feedCount || 0}
              expression={isPetting ? 'happy' : 'idle'}
              accessories={petProg?.unlockedAccessories || []}
              onPet={() => triggerPetting(null, null)}
            />
          </div>

          {/* Cozy shadow under pet feet */}
          <div className="absolute bottom-2 w-44 sm:w-56 h-6 bg-amber-900/15 rounded-full blur-xs pointer-events-none" />
        </div>

        {/* Bottom Stage Footer: Affection & Petting Prompt */}
        <div className="w-full flex items-center justify-between z-20 bg-slate-900/80 backdrop-blur-md rounded-2xl px-3 py-1.5 text-white border border-white/20 shadow-md flex-shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-200">
            <Hand className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="text-[11px] sm:text-xs">
              {isPetting ? 'Petting buddy!' : `Stroke or tap to pet ${displayName}!`}
            </span>
          </div>

          {/* Mini Affection Heart Rating */}
          <div className="flex items-center gap-0.5 text-xs" title="Pet love meter">
            <span className="text-[10px] font-black uppercase text-pink-300 mr-1">Love:</span>
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`transition-transform duration-200 ${
                  i < (loveCount % 6) ? 'scale-110 animate-pulse' : 'opacity-30'
                }`}
              >
                ❤️
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. SQUARE PET SELECTION BUTTONS TRAY & CONFIRMATION           */}
      {/* ------------------------------------------------------------- */}
      <footer className="w-full max-w-md flex flex-col gap-1.5 z-20 pb-0.5 flex-shrink-0">
        {/* Horizontal Scrollable Row of SQUARE Pet Selection Buttons */}
        <div className="w-full flex items-center gap-2 overflow-x-auto py-1 px-0.5 no-scrollbar">
          {PETS.map((pet) => {
            const isSelected = activePetId === pet.id;
            const prog = petsProgress[pet.id];
            const hasPlayed = prog && prog.feedCount > 0;
            const petDisplayName = prog?.customName || pet.defaultName;

            return (
              <button
                key={pet.id}
                type="button"
                onClick={() => {
                  sfx.pop();
                  setActivePetId(pet.id);
                  playVoicePreview(pet);
                }}
                className={`
                  relative aspect-square w-13 h-13 sm:w-15 sm:h-15 flex-shrink-0 rounded-2xl flex flex-col items-center justify-center
                  transition-all duration-200 cursor-pointer active:scale-90 shadow-sm
                  ${
                    isSelected
                      ? 'bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 border-3 border-white ring-3 ring-amber-400 shadow-md scale-105 z-10'
                      : 'bg-white/95 hover:bg-white border-2 border-slate-200 hover:border-amber-300 opacity-85 hover:opacity-100'
                  }
                `}
                title={`Select ${petDisplayName}`}
              >
                {/* Checkmark indicator for selected pet */}
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black shadow-xs z-10">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}

                {/* Star badge for played pet */}
                {hasPlayed && !isSelected && (
                  <div className="absolute top-0.5 left-0.5 px-1 rounded-full bg-emerald-100 text-emerald-800 text-[7px] font-black border border-emerald-300">
                    ★
                  </div>
                )}

                {/* Pet Icon */}
                <span className={`text-2xl sm:text-3xl leading-none ${isSelected ? 'animate-bounce' : ''}`}>
                  {pet.icon}
                </span>

                {/* Mini Label */}
                <span
                  className={`text-[8px] sm:text-[9px] font-black uppercase tracking-tight -mt-0.5 truncate max-w-[90%] ${
                    isSelected ? 'text-amber-950 font-black' : 'text-slate-600 font-bold'
                  }`}
                >
                  {pet.species.split(' ')[0]}
                </span>
              </button>
            );
          })}

          {/* SQUARE Quick Play Button Right in the Dock */}
          <button
            type="button"
            onClick={() => handleConfirm(currentPet)}
            className="aspect-square w-13 h-13 sm:w-15 sm:h-15 flex-shrink-0 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-500 to-emerald-600 text-white flex flex-col items-center justify-center font-black shadow-lg border-2 border-emerald-300 active:scale-90 transition-all cursor-pointer ring-2 ring-emerald-200"
            title={`Play with ${displayName}!`}
          >
            <Heart className="w-4 h-4 fill-white text-white animate-pulse" />
            <span className="text-[8.5px] font-black uppercase tracking-tight">PLAY ➔</span>
          </button>
        </div>

        {/* Primary Play with Pet Button */}
        <button
          type="button"
          onClick={() => handleConfirm(currentPet)}
          className="w-full py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm sm:text-base shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 border-b-4 border-teal-700 cursor-pointer"
        >
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white animate-pulse" />
          <span>PLAY WITH {displayName.toUpperCase()}! ➔</span>
        </button>
      </footer>
    </div>
  );
}
