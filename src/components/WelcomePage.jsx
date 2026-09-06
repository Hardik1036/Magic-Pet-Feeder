import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, User, Volume2, Trophy } from 'lucide-react';
import { sfx, speakPetText, getAudioAccent, toggleAudioAccent } from '../utils/audio.js';

const POPULAR_PLAYER_NAMES = ['Emma', 'Leo', 'Maya', 'Noah', 'Zara', 'Lucas', 'Oliver', 'Chloe'];

export default function WelcomePage({
  initialPlayerName,
  onProceed,
  hasExistingSave,
  onResumeExisting,
  savedPetName,
  unlockedBadgesCount = 0,
  audioLanguage = 'en',
  onToggleLanguage,
  onOpenBadges,
}) {
  const [playerName, setPlayerName] = useState(initialPlayerName || '');
  const [currentAccent, setCurrentAccent] = useState(() => getAudioAccent());

  useEffect(() => {
    const handleAccentChange = (e) => {
      if (e?.detail?.accent) setCurrentAccent(e.detail.accent);
    };
    window.addEventListener('pet-accent-change', handleAccentChange);
    return () => window.removeEventListener('pet-accent-change', handleAccentChange);
  }, []);

  const handleToggleAccent = () => {
    sfx.pop();
    const next = toggleAudioAccent();
    setCurrentAccent(next);
    if (next === 'indian') {
      speakPetText('Namaste! Welcome to Magic Pet Feeder!', { pitch: 1.25, rate: 0.9 }, 'indian');
    } else {
      speakPetText('Hello! Welcome to Magic Pet Feeder!', { pitch: 1.25, rate: 0.9 }, 'us');
    }
  };

  const handleStart = (e) => {
    if (e) e.preventDefault();
    const finalPlayer = playerName.trim() || 'Little Friend';
    onProceed(finalPlayer);
  };

  const speakWelcome = () => {
    const text = playerName.trim()
      ? currentAccent === 'indian'
        ? `Namaste ${playerName}! Let's pick a magic pet!`
        : `Hi ${playerName}! Let's pick a magic pet!`
      : currentAccent === 'indian'
      ? 'Welcome to Magic Pet Feeder! What is your name?'
      : 'Welcome to Magic Pet Feeder! What is your name?';
    speakPetText(text, { pitch: 1.25, rate: 0.9 }, currentAccent);
  };

  return (
    <div
      className="relative w-full h-full max-h-[100dvh] bg-gradient-to-b from-sky-300 via-indigo-100 to-pink-200 flex flex-col justify-between items-center px-3 py-2 sm:p-4 select-none overflow-y-auto font-sans"
      style={{ touchAction: 'manipulation' }}
    >
      {/* Header Badge */}
      <header className="w-full max-w-md flex items-center justify-between pt-0.5 flex-shrink-0">
        <div className="flex items-center gap-1.5 bg-white/85 backdrop-blur-md px-3 py-1 rounded-full shadow-md border-2 border-emerald-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
          <span className="font-black text-emerald-800 text-xs sm:text-sm tracking-wide uppercase">
            Magic Pet Feeder
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleToggleAccent}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black shadow-sm border-2 transition-all active:scale-95 ${
              currentAccent === 'indian'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-300 ring-2 ring-emerald-200'
                : 'bg-white/95 text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title={currentAccent === 'indian' ? 'Audio Accent: Indian (en-IN). Click to switch to US Accent' : 'Audio Accent: US (en-US). Click to switch to Indian Accent'}
          >
            <span>{currentAccent === 'indian' ? '🇮🇳' : '🇺🇸'}</span>
            <span>{currentAccent === 'indian' ? 'Indian Accent' : 'US Accent'}</span>
          </button>

          {unlockedBadgesCount > 0 && onOpenBadges && (
            <button
              onClick={onOpenBadges}
              className="flex items-center gap-1 bg-amber-400 text-amber-950 px-2.5 py-1 rounded-full text-xs font-black shadow-md border-2 border-amber-500 active:scale-95 transition-transform"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>{unlockedBadgesCount}</span>
            </button>
          )}

          <button
            onClick={speakWelcome}
            aria-label="Listen to instructions"
            className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-400 text-amber-900 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform"
          >
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      {/* Main Form Card */}
      <main className="w-full max-w-md my-auto bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-2xl border-3 sm:border-4 border-amber-400 flex flex-col gap-3 sm:gap-4 text-center z-10">
        {/* Animated Mascot Preview Banner */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-emerald-400 via-teal-400 to-indigo-500 p-1 shadow-xl flex items-center justify-center animate-bounce border-3 border-white">
              <span className="text-4xl sm:text-5xl">🦖</span>
            </div>
            <span className="absolute -bottom-2 -right-2 bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-white shadow">
              PETS ✨
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight mt-3">
            Magic Pet Feeder
          </h1>
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-0.5 rounded-full text-xs font-black mt-1 border border-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
            <span>8 Interactive Pet Companions!</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
            Feed, play, groom & care for your animal friends!
          </p>
        </div>

        {/* Existing Save Resume Quick Button */}
        {hasExistingSave && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-2 sm:p-2.5 flex flex-col items-center gap-1">
            <p className="text-[11px] sm:text-xs font-bold text-amber-800">
              Welcome back! {savedPetName} is waiting for you!
            </p>
            <button
              onClick={onResumeExisting}
              className="w-full py-2 px-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-black text-xs sm:text-sm shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-1.5"
            >
              <span>Continue Saved Game</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <form onSubmit={handleStart} className="flex flex-col gap-3 text-left">
          <div>
            <label className="flex items-center gap-1.5 text-[11px] sm:text-xs font-black text-indigo-900 uppercase tracking-wider mb-1">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>What is your name?</span>
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="e.g. Emma"
              maxLength={20}
              className="w-full text-base sm:text-lg font-bold text-slate-800 px-3.5 py-2.5 rounded-xl sm:rounded-2xl bg-indigo-50/70 border-2 border-indigo-200 focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner"
            />

            {/* Quick Tap Name Chips */}
            <div className="flex flex-wrap gap-1 mt-2">
              {POPULAR_PLAYER_NAMES.map((name) => (
                <button
                  type="button"
                  key={name}
                  onClick={() => setPlayerName(name)}
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border transition-all ${
                    playerName === name
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white text-indigo-700 border-indigo-200 active:scale-95'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-base sm:text-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 mt-1"
          >
            <span>CHOOSE MY PET 🐾</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </form>
      </main>

      <footer className="w-full max-w-md pb-1 text-center text-[10px] sm:text-xs font-bold text-indigo-900/70 flex-shrink-0">
        ✨ Automatically saved on your device!
      </footer>
    </div>
  );
}
