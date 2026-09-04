import React, { useState, useEffect } from 'react';
import { User, Volume2, Moon, Sun } from 'lucide-react';
import PetAvatar from './PetAvatar.jsx';
import ActivityNavBar from './ActivityNavBar.jsx';
import { PETS } from '../data/pets.js';
import { sfx, speakPetText } from '../utils/audio.js';

export default function BedroomPage({
  playerName,
  petNickname,
  selectedPetId,
  stageIndex = 1,
  feedCount = 5,
  unlockedAccessories = [],
  unlockedBadges = [],
  playerStats = {},
  onUpdateStats,
  onUnlockBadge,
  onNavigate,
  onSwitchPet,
  onChangeProfile,
}) {
  const currentPet = PETS.find((p) => p.id === selectedPetId) || PETS[0];
  const petDisplayName = petNickname || currentPet.defaultName;

  const [isNightMode, setIsNightMode] = useState(true);
  const [isTuckedIn, setIsTuckedIn] = useState(false);
  const [litStars, setLitStars] = useState([]); // array of lit star numbers 1..5

  useEffect(() => {
    const timer = setTimeout(() => {
      speakPetText(
        `Yawn! It's bedtime for ${petDisplayName}. Let's count 5 twinkling stars!`,
        { ...currentPet.voice, rate: 1.05 }
      );
    }, 200);
    return () => clearTimeout(timer);
  }, [currentPet, petDisplayName]);

  // Handle tapping a star (1 to 5)
  const handleTapStar = (starNum) => {
    sfx.chime(starNum - 1);

    if (!litStars.includes(starNum)) {
      const nextLit = [...litStars, starNum];
      setLitStars(nextLit);

      const words = ['One', 'Two', 'Three', 'Four', 'Five'];
      speakPetText(words[starNum - 1], { ...currentPet.voice, rate: 1.08 });

      // Track total stars counted in player stats
      const nextCount = (playerStats.starsCounted || 0) + 1;
      if (onUpdateStats) {
        onUpdateStats((prev) => ({
          ...prev,
          starsCounted: nextCount,
        }));
      }

      // If all 5 stars lit, award Starlight Dreamer badge!
      if (nextLit.length >= 5 && !unlockedBadges.includes('starlight_dreamer')) {
        setTimeout(() => {
          if (onUnlockBadge) onUnlockBadge('starlight_dreamer');
          sfx.fanfare();
          speakPetText(`Hooray! You counted all 5 stars and earned the Starlight Dreamer trophy!`, currentPet.voice);
        }, 400);
      }
    }
  };

  // Toggle blanket tuck
  const handleToggleBlanket = () => {
    const nextState = !isTuckedIn;
    setIsTuckedIn(nextState);

    if (nextState) {
      sfx.snore();
      speakPetText(`Shh... sweet dreams, ${petDisplayName}!`, {
        ...currentPet.voice,
        pitch: currentPet.voice.pitch * 0.9,
        rate: 0.8,
      });
    } else {
      sfx.pop();
      speakPetText(`Good morning sunshine!`, currentPet.voice);
    }
  };

  // Toggle lamp
  const handleToggleLamp = () => {
    sfx.pop();
    setIsNightMode((prev) => !prev);
  };

  return (
    <div
      className={`relative w-full min-h-screen flex flex-col justify-between items-center p-3 sm:p-5 select-none overflow-hidden font-sans transition-colors duration-700 ${
        isNightMode
          ? 'bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white'
          : 'bg-gradient-to-b from-indigo-300 via-purple-100 to-pink-200 text-slate-800'
      }`}
      style={{ touchAction: 'manipulation' }}
    >
      {/* Top Header */}
      <header className="w-full max-w-md flex items-center justify-between px-1 pt-1 z-20">
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
            className="flex items-center gap-1 bg-white/85 px-2.5 py-1 rounded-full text-xs font-bold text-indigo-900 border border-indigo-200 shadow-sm active:scale-95"
          >
            <span>{currentPet.icon}</span>
            <span>{petDisplayName}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Lamp Toggle */}
          <button
            onClick={handleToggleLamp}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform ${
              isNightMode ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300' : 'bg-slate-700 text-white'
            }`}
            title="Toggle Night Lamp"
          >
            {isNightMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1 rounded-full shadow-md border-2 border-indigo-300">
            <span className="text-xs">⭐</span>
            <span className="text-xs font-black text-indigo-900">
              {litStars.length} / 5 Stars
            </span>
          </div>
        </div>
      </header>

      {/* Task Prompt Banner */}
      <section className="w-full max-w-md my-1 z-20">
        <div className="bg-white/95 rounded-3xl p-3 shadow-xl border-4 border-indigo-400 flex items-center justify-between text-slate-800">
          <div className="text-left">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700">
              🌙 Cozy Bedtime:
            </p>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {isTuckedIn ? '😴 Sweet Dreams, Shh...' : 'Count the 5 Window Stars!'}
            </h2>
          </div>

          <button
            onClick={() => {
              sfx.pop();
              speakPetText(
                isTuckedIn
                  ? `${petDisplayName} is sound asleep dreaming of yummy treats!`
                  : `Tap each of the 5 window stars to hear sweet chime notes, then tuck ${petDisplayName} into bed!`,
                currentPet.voice
              );
            }}
            className="w-11 h-11 bg-gradient-to-tr from-indigo-500 to-purple-400 rounded-2xl shadow-md border-2 border-indigo-600 flex items-center justify-center text-white active:scale-90"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Bedroom Window with 5 Twinkling Stars */}
      <div className="w-full max-w-sm flex items-center justify-around py-1 px-3 z-15">
        {[1, 2, 3, 4, 5].map((starNum) => {
          const isLit = litStars.includes(starNum);
          return (
            <button
              key={starNum}
              onClick={() => handleTapStar(starNum)}
              className={`
                flex flex-col items-center justify-center w-12 h-12 rounded-2xl
                transition-all duration-300 active:scale-90 cursor-pointer
                ${
                  isLit
                    ? 'bg-amber-300 text-amber-950 scale-110 shadow-lg ring-4 ring-amber-200/80 animate-pulse'
                    : 'bg-white/15 text-white/60 border border-white/25 hover:bg-white/25'
                }
              `}
            >
              <span className="text-xl leading-none">⭐</span>
              <span className="text-[10px] font-black">{starNum}</span>
            </button>
          );
        })}
      </div>

      {/* Bed Area & Sleeping Pet */}
      <main className="relative my-auto flex flex-col items-center justify-center z-10 w-full max-w-sm h-64 sm:h-72">
        {/* Sleeping Pet Avatar */}
        <div className="relative z-10">
          <PetAvatar
            petId={currentPet.id}
            stageIndex={stageIndex}
            feedCount={feedCount}
            expression={isTuckedIn ? 'sleeping' : 'idle'}
            accessories={unlockedAccessories}
          />
        </div>

        {/* Cozy Blanket Graphic */}
        <div
          onClick={handleToggleBlanket}
          className={`
            w-60 sm:w-68 rounded-t-3xl border-4 border-indigo-400 shadow-2xl
            cursor-pointer active:scale-95 transition-all duration-500 z-20 -mt-16 sm:-mt-20
            flex flex-col items-center justify-center p-3
            ${
              isTuckedIn
                ? 'h-28 bg-gradient-to-tr from-indigo-600 via-purple-500 to-pink-500 ring-4 ring-indigo-300'
                : 'h-14 bg-gradient-to-tr from-indigo-500 to-purple-400 opacity-90'
            }
          `}
        >
          <div className="flex items-center gap-2 text-white font-black text-xs sm:text-sm">
            <span>{isTuckedIn ? '🛌 TUCKED IN (TAP TO WAKE)' : '🛏️ PULL UP BLANKET!'}</span>
          </div>
          {isTuckedIn && (
            <p className="text-[10px] font-bold text-pink-200 mt-1">
              💤 Snoozing happily...
            </p>
          )}
        </div>
      </main>

      {/* Bedtime Controls */}
      <footer className="w-full max-w-md flex flex-col gap-2 z-20">
        <div className="flex items-center justify-around gap-2 bg-white/95 rounded-3xl p-2 shadow-lg border-2 border-indigo-300 text-slate-800">
          <button
            onClick={handleToggleBlanket}
            className={`flex-1 flex flex-col items-center py-2 px-1 rounded-2xl transition-all active:scale-90 ${
              isTuckedIn
                ? 'bg-purple-500 text-white font-black ring-2 ring-purple-300'
                : 'bg-indigo-600 text-white font-black'
            }`}
          >
            <span className="text-2xl">{isTuckedIn ? '💤' : '🛌'}</span>
            <span className="text-[11px]">{isTuckedIn ? 'Wake Pet' : 'Tuck Pet In'}</span>
          </button>

          <button
            onClick={() => {
              sfx.chime(0);
              setTimeout(() => sfx.chime(2), 200);
              setTimeout(() => sfx.chime(4), 400);
              speakPetText(`Twinkle, twinkle, little star! Goodnight!`, {
                ...currentPet.voice,
                rate: 0.85,
              });
            }}
            className="flex-1 flex flex-col items-center py-2 px-1 rounded-2xl bg-amber-400 text-amber-950 font-black ring-2 ring-amber-300 active:scale-90"
          >
            <span className="text-2xl">🎵</span>
            <span className="text-[11px]">Lullaby</span>
          </button>

          <button
            onClick={handleToggleLamp}
            className="flex-1 flex flex-col items-center py-2 px-1 rounded-2xl bg-slate-200 text-slate-800 font-bold active:scale-90"
          >
            <span className="text-2xl">{isNightMode ? '💡' : '🌙'}</span>
            <span className="text-[11px]">{isNightMode ? 'Night Lamp' : 'Day Light'}</span>
          </button>
        </div>

        {/* Activity Navigation Dock */}
        <ActivityNavBar
          currentActivity="bedroom"
          onSelectActivity={onNavigate}
          unlockedBadgesCount={unlockedBadges.length}
        />
      </footer>
    </div>
  );
}
