import React, { useState, useEffect } from 'react';
import { User, Volume2, Sparkles, RefreshCw, Dices, Wand2 } from 'lucide-react';
import PetAvatar from './PetAvatar.jsx';
import ActivityNavBar from './ActivityNavBar.jsx';
import { PETS } from '../data/pets.js';
import { sfx, speakPetText } from '../utils/audio.js';

const ALL_SALON_ACCESSORIES = [
  { id: 'party_hat', name: 'Party Hat', icon: '🎉', color: 'bg-pink-100 border-pink-300' },
  { id: 'golden_crown', name: 'Crown', icon: '👑', color: 'bg-amber-100 border-amber-300' },
  { id: 'cool_sunglasses', name: 'Shades', icon: '🕶️', color: 'bg-sky-100 border-sky-300' },
  { id: 'dapper_bowtie', name: 'Bowtie', icon: '🎀', color: 'bg-rose-100 border-rose-300' },
  { id: 'flower_clip', name: 'Flower', icon: '🌸', color: 'bg-emerald-100 border-emerald-300' },
  { id: 'wizard_hat', name: 'Wizard', icon: '🧙', color: 'bg-indigo-100 border-indigo-300' },
  { id: 'super_cape', name: 'Hero Cape', icon: '🦸', color: 'bg-red-100 border-red-300' },
];

export default function DressUpPage({
  playerName,
  petNickname,
  selectedPetId,
  stageIndex = 1,
  feedCount = 5,
  unlockedAccessories = [],
  onUpdateAccessories,
  unlockedBadges = [],
  playerStats = {},
  audioLanguage = 'en',
  onToggleLanguage,
  onUpdateStats,
  onUnlockBadge,
  onNavigate,
  onSwitchPet,
  onChangeProfile,
}) {
  const currentPet = PETS.find((p) => p.id === selectedPetId) || PETS[0];
  const petDisplayName = petNickname || currentPet.defaultName;

  const [activeAccessories, setActiveAccessories] = useState(unlockedAccessories);
  const [isPosing, setIsPosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      speakPetText(
        `Welcome to the Dress-Up Salon! Pick your favorite costume for ${petDisplayName}!`,
        currentPet.voice
      );
    }, 400);
    return () => clearTimeout(timer);
  }, [currentPet, petDisplayName]);

  // Toggle single costume accessory
  const handleToggleAccessory = (accId) => {
    sfx.pop();
    let nextAccs;
    if (activeAccessories.includes(accId)) {
      nextAccs = activeAccessories.filter((id) => id !== accId);
    } else {
      nextAccs = [...activeAccessories, accId];
      sfx.sparkle();
    }
    setActiveAccessories(nextAccs);
    if (onUpdateAccessories) onUpdateAccessories(nextAccs);

    const nextStyled = (playerStats.outfitsStyled || 0) + 1;
    if (onUpdateStats) {
      onUpdateStats((prev) => ({
        ...prev,
        outfitsStyled: nextStyled,
      }));
    }

    // Award Glamour Star badge when wearing 4 accessories!
    if (nextAccs.length >= 4 && !unlockedBadges.includes('glamour_star')) {
      if (onUnlockBadge) onUnlockBadge('glamour_star');
      sfx.fanfare();
      speakPetText(`Fabulous! You earned the Glamour Superstar trophy!`, currentPet.voice);
    } else {
      const compliments = ['So fancy!', 'Looking great!', 'Ooh, stylish!', 'Super cute!'];
      speakPetText(compliments[Math.floor(Math.random() * compliments.length)], currentPet.voice);
    }
  };

  // Strike a pose / twirl on the fashion runway
  const handlePose = () => {
    sfx.fanfare();
    setIsPosing(true);
    setTimeout(() => setIsPosing(false), 900);

    const poseCompliments = [
      'Strike a pose! Absolutely fabulous!',
      'Fashion icon alert! Looking stunning!',
      'Work that runway! Super stylish!',
      'Ta-da! You look so gorgeous!'
    ];
    speakPetText(poseCompliments[Math.floor(Math.random() * poseCompliments.length)], currentPet.voice);
  };

  // Surprise randomizer: equips random combination of fun accessories
  const handleLuckyMix = () => {
    sfx.sparkle();
    const shuffled = [...ALL_SALON_ACCESSORIES].sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * 3) + 2; // 2, 3, or 4 accessories
    const picked = shuffled.slice(0, count).map((a) => a.id);
    setActiveAccessories(picked);
    if (onUpdateAccessories) onUpdateAccessories(picked);

    const nextStyled = (playerStats.outfitsStyled || 0) + 1;
    if (onUpdateStats) {
      onUpdateStats((prev) => ({
        ...prev,
        outfitsStyled: nextStyled,
      }));
    }

    if (picked.length >= 4 && !unlockedBadges.includes('glamour_star')) {
      if (onUnlockBadge) onUnlockBadge('glamour_star');
      sfx.fanfare();
      speakPetText(`Fabulous! You earned the Glamour Superstar trophy!`, currentPet.voice);
    } else {
      speakPetText(`Surprise lucky mix! Look at this hilarious outfit!`, currentPet.voice);
    }
  };

  // Reset all outfits back to natural clean pet
  const handleClearAll = () => {
    sfx.pop();
    setActiveAccessories([]);
    if (onUpdateAccessories) onUpdateAccessories([]);
    speakPetText('All fresh and cozy!', currentPet.voice);
  };

  return (
    <div
      className="relative w-full h-full max-h-[100dvh] bg-gradient-to-b from-rose-300 via-pink-100 to-purple-200 flex flex-col justify-between items-center px-2 py-1 sm:px-4 sm:py-2.5 select-none overflow-hidden font-sans"
      style={{ touchAction: 'manipulation' }}
    >
      {/* Top Header */}
      <header className="w-full max-w-md flex items-center justify-between px-1 pt-0.5 z-20 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onChangeProfile}
            className="flex items-center gap-1 bg-white/85 px-2.5 py-1 rounded-full text-xs font-bold text-indigo-900 border border-indigo-200 shadow-sm active:scale-95"
          >
            <User className="w-3.5 h-3.5 text-indigo-600" />
            <span>{playerName}</span>
          </button>
          <button
            onClick={onSwitchPet}
            className="flex items-center gap-1 bg-white/85 px-2.5 py-1 rounded-full text-xs font-bold text-rose-900 border border-rose-200 shadow-sm active:scale-95"
          >
            <span>{currentPet.icon}</span>
            <span>{petDisplayName}</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {onToggleLanguage && (
            <button
              type="button"
              onClick={onToggleLanguage}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black shadow-sm border-2 transition-all active:scale-95 ${
                audioLanguage === 'hi' || audioLanguage === 'hinglish'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-300 ring-2 ring-emerald-200'
                  : 'bg-white/95 text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title={audioLanguage === 'hi' || audioLanguage === 'hinglish' ? "Switch to English audio" : "Switch to Hindi audio"}
            >
              <span>{audioLanguage === 'hi' || audioLanguage === 'hinglish' ? '🇮🇳' : '🇬🇧'}</span>
              <span>{audioLanguage === 'hi' || audioLanguage === 'hinglish' ? 'हिंदी' : 'English'}</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-white/90 px-2.5 py-1 rounded-full shadow-md border-2 border-rose-300">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span className="text-xs font-black text-rose-900">
              {activeAccessories.length} / {ALL_SALON_ACCESSORIES.length} Worn
            </span>
          </div>
        </div>
      </header>

      {/* Task Prompt Banner */}
      <section className="w-full max-w-md my-0.5 z-20 flex-shrink-0">
        <div className="bg-white/95 rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 shadow-md border-2 border-rose-400 flex items-center justify-between">
          <div className="text-left">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700">
              👗 Dress-Up Salon:
            </p>
            <h2 className="text-base sm:text-xl font-black text-slate-800 tracking-tight leading-tight">
              Mix & Match Silly Outfits!
            </h2>
          </div>

          <button
            onClick={() => {
              sfx.pop();
              speakPetText(
                `Tap any costume below to mix and match silly outfits for ${petDisplayName}!`,
                currentPet.voice
              );
            }}
            aria-label="Listen to instructions"
            className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-tr from-rose-400 to-pink-300 rounded-xl shadow-md border border-rose-500 flex items-center justify-center text-rose-950 active:scale-90 flex-shrink-0"
          >
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </section>

      {/* Fashion Runway & Styled Pet */}
      <main className="relative my-auto flex-1 min-h-0 flex flex-col items-center justify-center z-10 w-full max-w-sm">
        {/* Spotlights & Runway Sparkle Effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-52 sm:w-64 h-52 sm:h-64 bg-gradient-to-tr from-pink-400/25 via-rose-300/20 to-purple-400/25 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Posing Sparkles Explosion */}
        {isPosing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 animate-pulse">
            <span className="text-5xl animate-bounce -mt-16 -ml-16">✨</span>
            <span className="text-4xl animate-ping mt-16 ml-16">💖</span>
            <span className="text-5xl animate-bounce -mt-12 ml-14">🌟</span>
            <span className="text-4xl animate-ping mt-14 -ml-16">💃</span>
          </div>
        )}

        {/* Realistic Pet Avatar with live costumes (clickable to pose) */}
        <div
          onClick={handlePose}
          className={`relative z-10 cursor-pointer active:scale-105 transition-all duration-500 ${
            isPosing ? 'scale-115 -translate-y-3 rotate-3' : ''
          }`}
          title="Tap to Strike a Pose!"
        >
          <PetAvatar
            petId={currentPet.id}
            stageIndex={stageIndex}
            feedCount={feedCount}
            expression="happy"
            accessories={activeAccessories}
          />
        </div>

        {/* Runway Stage Platform Graphic */}
        <div className="w-56 sm:w-72 h-10 sm:h-12 bg-white/95 rounded-full border-3 border-rose-300 shadow-xl flex items-center justify-between px-4 -mt-3 sm:-mt-4 z-5">
          <span className="text-sm animate-bounce">✨</span>
          <span className="text-[10px] sm:text-xs font-black text-rose-900 uppercase tracking-widest">
            FASHION RUNWAY
          </span>
          <span className="text-sm animate-bounce">✨</span>
        </div>

        {/* Runway Interactive Actions Dock */}
        <div className="flex items-center gap-2 mt-2 z-20">
          <button
            onClick={handlePose}
            className="flex items-center gap-1.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-md active:scale-95 transition-transform"
          >
            <span>💃</span>
            <span>Strike a Pose!</span>
          </button>

          <button
            onClick={handleLuckyMix}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-amber-950 font-black text-xs px-3.5 py-1.5 rounded-full shadow-md active:scale-95 transition-transform"
          >
            <Dices className="w-3.5 h-3.5" />
            <span>Lucky Mix!</span>
          </button>
        </div>
      </main>

      {/* Costume Wardrobe Selector */}
      <footer className="w-full max-w-md flex flex-col gap-1 z-20 pb-0.5 flex-shrink-0">
        {/* Wardrobe Items Scroll */}
        <div className="bg-white/95 rounded-2xl p-1.5 sm:p-2 shadow-md border-2 border-rose-300 flex flex-col gap-1">
          <div className="flex items-center justify-between px-1.5">
            <span className="text-[10px] font-black text-rose-900 uppercase tracking-wider">
              Wardrobe ({activeAccessories.length} Equipped)
            </span>
            {activeAccessories.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1 bg-rose-100 hover:bg-rose-200 text-rose-800 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold active:scale-95 transition-transform"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 px-0.5">
            {ALL_SALON_ACCESSORIES.map((acc) => {
              const isEquipped = activeAccessories.includes(acc.id);
              return (
                <button
                  key={acc.id}
                  onClick={() => handleToggleAccessory(acc.id)}
                  className={`
                    relative flex flex-col items-center justify-center p-1.5 rounded-xl min-w-[58px]
                    transition-all duration-200 active:scale-90 cursor-pointer
                    ${isEquipped ? 'bg-rose-500 text-white ring-2 ring-rose-300 shadow-md scale-105' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}
                  `}
                >
                  {isEquipped && (
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold shadow">
                      ✓
                    </div>
                  )}
                  <span className="text-2xl leading-none">{acc.icon}</span>
                  <span className="text-[8.5px] font-black mt-0.5 truncate max-w-[54px]">
                    {acc.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Activity Navigation Dock */}
        <ActivityNavBar
          currentActivity="dressup"
          onSelectActivity={onNavigate}
          unlockedBadgesCount={unlockedBadges.length}
        />
      </footer>
    </div>
  );
}
