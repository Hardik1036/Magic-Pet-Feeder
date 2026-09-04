import React, { useState } from 'react';
import { Sparkles, ArrowRight, User, Volume2, Trophy } from 'lucide-react';

const POPULAR_PLAYER_NAMES = ['Emma', 'Leo', 'Maya', 'Noah', 'Zara', 'Lucas', 'Oliver', 'Chloe'];

export default function WelcomePage({
  initialPlayerName,
  onProceed,
  hasExistingSave,
  onResumeExisting,
  savedPetName,
  unlockedBadgesCount = 0,
  onOpenBadges,
}) {
  const [playerName, setPlayerName] = useState(initialPlayerName || '');

  const handleStart = (e) => {
    if (e) e.preventDefault();
    const finalPlayer = playerName.trim() || 'Little Friend';
    onProceed(finalPlayer);
  };

  const speakWelcome = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = playerName.trim()
        ? `Hi ${playerName}! Let's pick a magic pet!`
        : "Welcome to Magic Pet Feeder! What is your name?";
      const u = new SpeechSynthesisUtterance(text);
      u.pitch = 1.3;
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div
      className="relative w-full min-h-screen bg-gradient-to-b from-sky-300 via-indigo-100 to-pink-200 flex flex-col justify-between items-center p-4 select-none font-sans"
      style={{ touchAction: 'manipulation' }}
    >
      {/* Header Badge */}
      <header className="w-full max-w-md flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 bg-white/85 backdrop-blur-md px-4 py-1.5 rounded-full shadow-md border-2 border-emerald-300">
          <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
          <span className="font-black text-emerald-800 text-xs sm:text-sm tracking-wide uppercase">
            Magic Pet Feeder
          </span>
        </div>

        <div className="flex items-center gap-2">
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
            className="w-10 h-10 bg-amber-400 text-amber-900 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Form Card */}
      <main className="w-full max-w-md my-auto bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl border-4 border-amber-400 flex flex-col gap-5 text-center">
        {/* Animated Mascot Preview */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-400 via-purple-300 to-emerald-300 p-1 shadow-inner flex items-center justify-center animate-bounce">
            <span className="text-5xl">🥚</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight mt-2">
            Welcome, Adventurer!
          </h1>
          <p className="text-sm font-semibold text-slate-600">
            Feed, care, and watch your magic pets hatch and grow!
          </p>
        </div>

        {/* Existing Save Resume Quick Button */}
        {hasExistingSave && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 flex flex-col items-center gap-1.5">
            <p className="text-xs font-bold text-amber-800">
              Welcome back! {savedPetName} is waiting for you!
            </p>
            <button
              onClick={onResumeExisting}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-black text-sm shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <span>Continue Saved Game</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleStart} className="flex flex-col gap-4 text-left">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-black text-indigo-900 uppercase tracking-wider mb-1">
              <User className="w-4 h-4 text-indigo-600" />
              <span>What is your name?</span>
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="e.g. Emma"
              maxLength={20}
              className="w-full text-lg font-bold text-slate-800 px-4 py-3 rounded-2xl bg-indigo-50/70 border-2 border-indigo-200 focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner"
            />

            {/* Quick Tap Name Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {POPULAR_PLAYER_NAMES.map((name) => (
                <button
                  type="button"
                  key={name}
                  onClick={() => setPlayerName(name)}
                  className={`text-xs font-bold px-2.5 py-1 rounded-full border transition-all ${
                    playerName === name
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
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
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-lg shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2 mt-2"
          >
            <span>CHOOSE MY PET 🐾</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </main>

      <footer className="w-full max-w-md pb-2 text-center text-xs font-bold text-indigo-900/70">
        ✨ Automatically saved on your device!
      </footer>
    </div>
  );
}
