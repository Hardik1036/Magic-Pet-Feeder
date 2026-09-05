import React, { useState, useEffect } from 'react';
import { User, Volume2, Moon, Sun, RefreshCw, Sparkles, Music } from 'lucide-react';
import PetAvatar from './PetAvatar.jsx';
import ActivityNavBar from './ActivityNavBar.jsx';
import { PETS } from '../data/pets.js';
import { sfx, speakPetText } from '../utils/audio.js';

// 4-Step Bedtime Routine:
// 1. 'teddy': Give pet cuddly plush teddy bear to snuggle
// 2. 'milk': Feed pet warm bedtime milk cup (3 sips)
// 3. 'stars': Count 5 twinkling window stars for a starlight lullaby
// 4. 'tuck': Pull up cozy quilt blanket & switch off lamp for sweet dreams

export default function BedroomPage({
  playerName,
  petNickname,
  selectedPetId,
  stageIndex = 1,
  feedCount = 5,
  unlockedAccessories = [],
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

  // Active step: 'teddy' | 'milk' | 'stars' | 'tuck'
  const [activeBedStep, setActiveBedStep] = useState('teddy');

  // Step 1: Teddy snuggle
  const [hasTeddy, setHasTeddy] = useState(false);

  // Step 2: Warm milk fed (0..3)
  const [milkSips, setMilkSips] = useState(0);

  // Step 3: Stars counted (1..5)
  const [litStars, setLitStars] = useState([]);

  // Step 4: Blanket & lamp
  const [isTuckedIn, setIsTuckedIn] = useState(false);
  const [isNightMode, setIsNightMode] = useState(true);
  const [isSleepCompleted, setIsSleepCompleted] = useState(false);

  const [petExpression, setPetExpression] = useState('idle');
  const [petSparkle, setPetSparkle] = useState(false);

  // Welcome speech
  useEffect(() => {
    const timer = setTimeout(() => {
      speakPetText(
        `Yawn! It's cozy bedtime for ${petDisplayName}. Give ${petDisplayName} their soft teddy bear!`,
        currentPet.voice
      );
    }, 350);
    return () => clearTimeout(timer);
  }, [currentPet, petDisplayName]);

  // -------------------------------------------------------------
  // STEP 1: CUDDLE TEDDY BEAR
  // -------------------------------------------------------------
  const handleGiveTeddy = () => {
    if (hasTeddy) return;
    setHasTeddy(true);
    sfx.pop();
    setPetExpression('happy');

    setTimeout(() => {
      sfx.chime(2);
      speakPetText(
        `My teddy is so soft and cuddly! Now let's drink a warm cup of milk!`,
        currentPet.voice
      );
      setActiveBedStep('milk');
      setPetExpression('idle');
    }, 400);
  };

  // -------------------------------------------------------------
  // STEP 2: WARM BEDTIME MILK
  // -------------------------------------------------------------
  const handleDrinkMilk = () => {
    if (milkSips >= 3) return;
    sfx.munch();
    setPetExpression('happy');

    const nextSips = milkSips + 1;
    setMilkSips(nextSips);

    if (nextSips >= 3) {
      setTimeout(() => {
        sfx.chime(4);
        speakPetText(
          `Yummy warm milk! Now let's count the 5 twinkling window stars!`,
          currentPet.voice
        );
        setActiveBedStep('stars');
        setPetExpression('idle');
      }, 400);
    } else {
      setTimeout(() => setPetExpression('idle'), 300);
    }
  };

  // -------------------------------------------------------------
  // STEP 3: COUNT 5 WINDOW STARS
  // -------------------------------------------------------------
  const handleTapStar = (starNum) => {
    sfx.chime(starNum - 1);

    if (!litStars.includes(starNum)) {
      const nextLit = [...litStars, starNum];
      setLitStars(nextLit);

      const words = ['One', 'Two', 'Three', 'Four', 'Five'];
      speakPetText(words[starNum - 1], { ...currentPet.voice, rate: 0.95 });

      // Track total stars counted in player stats
      const nextCount = (playerStats.starsCounted || 0) + 1;
      if (onUpdateStats) {
        onUpdateStats((prev) => ({
          ...prev,
          starsCounted: nextCount,
        }));
      }

      // If all 5 stars lit, award Starlight Dreamer badge!
      if (nextLit.length >= 5) {
        if (!unlockedBadges.includes('starlight_dreamer') && onUnlockBadge) {
          onUnlockBadge('starlight_dreamer');
        }

        setTimeout(() => {
          sfx.fanfare();
          speakPetText(
            `Twinkle twinkle little star! Yawn... so sleepy... tuck me into bed and turn off the lamp!`,
            currentPet.voice
          );
          setActiveBedStep('tuck');
        }, 500);
      }
    }
  };

  // Play gentle lullaby melody
  const handlePlayLullaby = () => {
    sfx.chime(4);
    speakPetText(`Play a sweet lullaby for sweet dreams!`, currentPet.voice);
  };

  // -------------------------------------------------------------
  // STEP 4: TUCK IN BLANKET & NIGHT LAMP
  // -------------------------------------------------------------
  const handleToggleBlanket = () => {
    const nextState = !isTuckedIn;
    setIsTuckedIn(nextState);

    if (nextState) {
      sfx.snore();
      setPetExpression('sleeping');
      setIsSleepCompleted(true);
      setPetSparkle(true);
      speakPetText(`Good night, sweet dreams! Shubh raatri!`, {
        ...currentPet.voice,
        pitch: currentPet.voice.pitch * 0.9,
        rate: 0.88,
      });
    } else {
      sfx.pop();
      setPetExpression('idle');
      speakPetText(`Good morning sunshine!`, currentPet.voice);
    }
  };

  const handleToggleLamp = () => {
    sfx.pop();
    setIsNightMode((prev) => !prev);
  };

  // Reset bedtime routine to play again
  const handleResetBedtime = () => {
    sfx.pop();
    setHasTeddy(false);
    setMilkSips(0);
    setLitStars([]);
    setIsTuckedIn(false);
    setIsNightMode(true);
    setIsSleepCompleted(false);
    setPetSparkle(false);
    setActiveBedStep('teddy');
    speakPetText(`Good morning! Ready for another cozy bedtime routine!`, currentPet.voice);
  };

  return (
    <div
      className={`relative w-full h-full max-h-[100dvh] flex flex-col justify-between items-center px-2 py-1 sm:px-4 sm:py-2.5 select-none overflow-hidden font-sans transition-colors duration-700 ${
        isNightMode
          ? 'bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white'
          : 'bg-gradient-to-b from-indigo-300 via-purple-100 to-pink-200 text-slate-800'
      }`}
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
            className="flex items-center gap-1 bg-white/85 px-2.5 py-1 rounded-full text-xs font-bold text-indigo-900 border border-indigo-200 shadow-sm active:scale-95"
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
                audioLanguage === 'hinglish'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-300 ring-2 ring-emerald-200'
                  : 'bg-white/95 text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title={audioLanguage === 'hinglish' ? "Switch to English audio" : "Switch to Hinglish audio"}
            >
              <span>{audioLanguage === 'hinglish' ? '🇮🇳' : '🇬🇧'}</span>
              <span>{audioLanguage === 'hinglish' ? 'Hinglish' : 'English'}</span>
            </button>
          )}

          {/* Lamp Toggle Switch */}
          <button
            onClick={handleToggleLamp}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black shadow-sm border-2 transition-transform active:scale-95 ${
              isNightMode ? 'bg-amber-400 text-amber-950 border-amber-500' : 'bg-slate-800 text-amber-200 border-slate-600'
            }`}
            title="Toggle Bedroom Light"
          >
            {isNightMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span>{isNightMode ? 'Lights Off' : 'Lights On'}</span>
          </button>
        </div>
      </header>

      {/* Bedtime Step & Mission Banner */}
      <section className="w-full max-w-md my-0.5 z-20 flex-shrink-0">
        <div className="bg-white/95 rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 shadow-md border-2 sm:border-3 border-indigo-400 flex items-center justify-between text-slate-800">
          <div className="text-left">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 flex items-center gap-1">
              <span>🌙 Cozy Bedtime Routine:</span>
              <span className="text-indigo-500 font-bold">
                {activeBedStep === 'teddy' ? '(Step 1/4)' : activeBedStep === 'milk' ? '(Step 2/4)' : activeBedStep === 'stars' ? '(Step 3/4)' : '(Step 4/4)'}
              </span>
            </p>
            <h2 className="text-sm sm:text-lg font-black tracking-tight leading-tight">
              {isSleepCompleted
                ? '😴 Sweet Dreams, Shh... Goodnight! 💤'
                : activeBedStep === 'teddy'
                ? '1. Give Plush Teddy to Cuddle'
                : activeBedStep === 'milk'
                ? `2. Drink Warm Milk: ${milkSips} / 3 Sips`
                : activeBedStep === 'stars'
                ? `3. Count Window Stars: ${litStars.length} / 5 Lit`
                : '4. Pull Up Cozy Blanket to Tuck In'}
            </h2>
          </div>

          <button
            onClick={() => {
              sfx.pop();
              const hints = {
                teddy: `Tap the soft teddy bear to give it to ${petDisplayName}!`,
                milk: `Tap the warm cup of milk to drink bedtime sips!`,
                stars: `Tap all 5 twinkling window stars to play a lullaby!`,
                tuck: `Pull up the warm quilt blanket to tuck ${petDisplayName} in for sweet dreams!`,
              };
              speakPetText(hints[activeBedStep] || hints.teddy, currentPet.voice);
            }}
            aria-label="Listen to bedtime instructions"
            className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-tr from-indigo-500 to-purple-400 rounded-xl shadow-md border border-indigo-600 flex items-center justify-center text-white active:scale-90 flex-shrink-0"
          >
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </section>

      {/* Arched Window with 5 Twinkling Stars (Step 3) */}
      <div className="w-full max-w-sm flex items-center justify-center z-15 flex-shrink-0 my-0.5">
        <div className="w-full bg-slate-900/90 rounded-2xl border-2 border-indigo-400/80 shadow-md p-2 flex items-center justify-between px-3">
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-black">
            <span className="text-base animate-pulse">🌙</span>
            <span>Night Sky:</span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {[1, 2, 3, 4, 5].map((starNum) => {
              const isLit = litStars.includes(starNum);
              return (
                <button
                  key={starNum}
                  onClick={() => handleTapStar(starNum)}
                  className={`
                    flex flex-col items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl
                    transition-all duration-300 active:scale-80 cursor-pointer
                    ${
                      isLit
                        ? 'bg-amber-300 text-amber-950 scale-110 shadow-md ring-2 ring-amber-200 animate-pulse'
                        : 'bg-white/10 text-white/50 border border-white/20 hover:bg-white/20'
                    }
                  `}
                  title={`Star ${starNum}`}
                >
                  <span className="text-sm sm:text-base leading-none">⭐</span>
                  <span className="text-[8px] font-black leading-none mt-0.5">{starNum}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bed Area & Sleeping Pet */}
      <main className="relative my-auto flex-1 min-h-0 flex flex-col items-center justify-center z-10 w-full max-w-sm">
        {/* Soft Bed Headboard Graphic */}
        <div className="absolute top-6 w-56 sm:w-64 h-24 bg-gradient-to-b from-amber-700 to-amber-900 rounded-t-3xl border-3 border-amber-600 shadow-lg z-5 flex items-center justify-around px-4">
          <div className="w-2 h-16 bg-amber-600 rounded-full" />
          <div className="w-2 h-16 bg-amber-600 rounded-full" />
          <div className="w-2 h-16 bg-amber-600 rounded-full" />
          <div className="w-2 h-16 bg-amber-600 rounded-full" />
        </div>

        {/* Soft Pillow Behind Pet */}
        <div className="absolute top-16 w-44 sm:w-48 h-18 bg-white/95 rounded-3xl border-2 border-slate-200 shadow-inner z-8" />

        {/* Golden Dream Sparkles */}
        {petSparkle && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 animate-pulse">
            <span className="text-4xl animate-bounce">💤</span>
            <span className="text-4xl -mt-16 ml-12 animate-ping">✨</span>
            <span className="text-4xl mt-20 -ml-14 animate-bounce">🌙</span>
            <span className="text-3xl -mt-12 -ml-16 animate-ping">💖</span>
          </div>
        )}

        {/* Pet Avatar in Bed */}
        <div className="relative z-15 active:scale-98 transition-transform">
          <PetAvatar
            petId={currentPet.id}
            stageIndex={stageIndex}
            feedCount={feedCount}
            expression={isTuckedIn ? 'sleeping' : petExpression}
            accessories={unlockedAccessories}
          />

          {/* Plush Teddy Bear Snuggled in Arms (Step 1) */}
          {hasTeddy && (
            <div className="absolute left-2 bottom-6 w-16 h-16 bg-amber-500 rounded-full border-3 border-amber-700 shadow-lg flex items-center justify-center text-3xl z-25 animate-bounce">
              🧸
            </div>
          )}
        </div>

        {/* Warm Milk Cup on Nightstand (Step 2) */}
        {activeBedStep === 'milk' && (
          <button
            onClick={handleDrinkMilk}
            className="absolute left-4 sm:left-6 bottom-12 w-16 h-16 rounded-2xl bg-white/95 border-3 border-sky-300 shadow-xl flex flex-col items-center justify-center text-2xl active:scale-80 transition-transform animate-bounce z-30 cursor-pointer"
            title="Drink Warm Milk!"
          >
            <span>🥛</span>
            <span className="text-[9px] font-black text-sky-800 -mt-1">
              {milkSips}/3 Sips
            </span>
          </button>
        )}

        {/* Cuddle Teddy Button if Not Yet Snuggled (Step 1) */}
        {activeBedStep === 'teddy' && !hasTeddy && (
          <button
            onClick={handleGiveTeddy}
            className="absolute right-4 sm:right-6 bottom-12 w-16 h-16 rounded-full bg-amber-500 border-3 border-amber-300 shadow-xl flex items-center justify-center text-3xl active:scale-80 transition-transform animate-bounce z-30 cursor-pointer"
            title="Give Soft Teddy Bear!"
          >
            🧸
          </button>
        )}

        {/* Cozy Blanket Tuck (Step 4) */}
        <div
          onClick={handleToggleBlanket}
          className={`
            w-56 sm:w-68 rounded-t-3xl border-3 sm:border-4 border-indigo-400 shadow-2xl
            cursor-pointer active:scale-95 transition-all duration-500 z-20 -mt-14 sm:-mt-18
            flex flex-col items-center justify-center p-2.5
            ${
              isTuckedIn
                ? 'h-24 sm:h-28 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 ring-4 ring-indigo-300/60'
                : 'h-12 sm:h-14 bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-95'
            }
          `}
        >
          <div className="flex items-center gap-1.5 text-white font-black text-xs sm:text-sm">
            <span>{isTuckedIn ? '🛌 TUCKED IN COZY (TAP TO WAKE)' : '🛏️ PULL UP QUILT BLANKET!'}</span>
          </div>
          {isTuckedIn && (
            <p className="text-[9.5px] font-bold text-pink-200 mt-0.5 flex items-center gap-1">
              <span>💤</span>
              <span>Snoozing soundly... Sweet dreams!</span>
            </p>
          )}
        </div>

        {/* Wake Up & Play Again Button when Finished */}
        {isSleepCompleted && (
          <div className="mt-2 z-30 flex-shrink-0">
            <button
              onClick={handleResetBedtime}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-black text-xs px-5 py-2 rounded-full shadow-lg active:scale-95 transition-transform"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>☀️ WAKE UP & PLAY AGAIN!</span>
            </button>
          </div>
        )}
      </main>

      {/* 4-Step Bedtime Selector Bar */}
      <footer className="w-full max-w-md flex flex-col gap-1 z-20 pb-0.5 flex-shrink-0">
        <div className="flex items-center justify-around gap-1.5 bg-white/95 rounded-2xl p-1.5 shadow-md border-2 border-indigo-300 text-slate-800">
          {/* Step 1: Teddy */}
          <button
            onClick={() => {
              sfx.pop();
              setActiveBedStep('teddy');
              if (!hasTeddy) handleGiveTeddy();
            }}
            className={`flex-1 flex flex-col items-center py-1.5 px-0.5 rounded-xl transition-all active:scale-90 ${
              activeBedStep === 'teddy'
                ? 'bg-amber-400 text-amber-950 font-black shadow-md ring-2 ring-amber-300 scale-105'
                : 'bg-slate-100 text-slate-700 font-bold'
            }`}
          >
            <div className="relative">
              <span className="text-2xl">🧸</span>
              {hasTeddy && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold shadow">
                  ✓
                </span>
              )}
            </div>
            <span className="text-[9.5px] font-black mt-0.5">1. Teddy</span>
          </button>

          {/* Step 2: Milk */}
          <button
            onClick={() => {
              sfx.pop();
              setActiveBedStep('milk');
              handleDrinkMilk();
            }}
            className={`flex-1 flex flex-col items-center py-1.5 px-0.5 rounded-xl transition-all active:scale-90 ${
              activeBedStep === 'milk'
                ? 'bg-sky-400 text-sky-950 font-black shadow-md ring-2 ring-sky-300 scale-105'
                : 'bg-slate-100 text-slate-700 font-bold'
            }`}
          >
            <div className="relative">
              <span className="text-2xl">🥛</span>
              {milkSips >= 3 && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold shadow">
                  ✓
                </span>
              )}
            </div>
            <span className="text-[9.5px] font-black mt-0.5">2. Milk ({milkSips}/3)</span>
          </button>

          {/* Step 3: Stars */}
          <button
            onClick={() => {
              sfx.pop();
              setActiveBedStep('stars');
              speakPetText(`Count the 5 twinkling window stars for sweet dreams!`, currentPet.voice);
            }}
            className={`flex-1 flex flex-col items-center py-1.5 px-0.5 rounded-xl transition-all active:scale-90 ${
              activeBedStep === 'stars'
                ? 'bg-purple-500 text-white font-black shadow-md ring-2 ring-purple-300 scale-105'
                : 'bg-slate-100 text-slate-700 font-bold'
            }`}
          >
            <div className="relative">
              <span className="text-2xl">⭐</span>
              {litStars.length >= 5 && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold shadow">
                  ✓
                </span>
              )}
            </div>
            <span className="text-[9.5px] font-black mt-0.5">3. Stars ({litStars.length}/5)</span>
          </button>

          {/* Step 4: Tuck In */}
          <button
            onClick={() => {
              setActiveBedStep('tuck');
              handleToggleBlanket();
            }}
            className={`flex-1 flex flex-col items-center py-1.5 px-0.5 rounded-xl transition-all active:scale-90 ${
              activeBedStep === 'tuck' || isTuckedIn
                ? 'bg-indigo-600 text-white font-black shadow-md ring-2 ring-indigo-300 scale-105'
                : 'bg-slate-100 text-slate-700 font-bold'
            }`}
          >
            <div className="relative">
              <span className="text-2xl">{isTuckedIn ? '🛌' : '🛏️'}</span>
              {isTuckedIn && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold shadow">
                  ✓
                </span>
              )}
            </div>
            <span className="text-[9.5px] font-black mt-0.5">{isTuckedIn ? 'Snoozing' : '4. Tuck In'}</span>
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
