import React from 'react';
import { ArrowLeft, Award, Sparkles, Volume2, Star, Check } from 'lucide-react';
import { BADGES } from '../data/badges.js';

export default function BadgesPage({
  unlockedBadges = [],
  onBack,
  petVoice,
}) {
  const speakBadge = (badge, isUnlocked) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = isUnlocked
        ? `Badge Unlocked: ${badge.title}! ${badge.description}`
        : `Locked Badge: ${badge.title}. Feed your pet snacks to earn this badge!`;
      const u = new SpeechSynthesisUtterance(text);
      u.pitch = petVoice?.pitch || 1.25;
      u.rate = petVoice?.rate || 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  const unlockedCount = unlockedBadges.length;

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
          <span>Back to Game</span>
        </button>

        <div className="flex items-center gap-1.5 bg-white/85 px-3 py-1 rounded-full shadow-md border-2 border-amber-300">
          <Award className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-black text-amber-900">
            {unlockedCount} / {BADGES.length} BADGES
          </span>
        </div>
      </header>

      {/* Header Banner */}
      <div className="w-full max-w-md text-center my-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-400 text-amber-950 text-3xl shadow-lg border-2 border-amber-500 mb-1 animate-bounce">
          🏆
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
          My Badges & Trophies!
        </h1>
        <p className="text-xs font-semibold text-slate-600">
          Tap any badge to hear what you accomplished!
        </p>
      </div>

      {/* Badges Grid */}
      <main className="w-full max-w-md my-auto grid grid-cols-2 gap-2.5 z-10 max-h-[58vh] overflow-y-auto pr-1 pb-1">
        {BADGES.map((badge) => {
          const isUnlocked = unlockedBadges.includes(badge.id);

          return (
            <div
              key={badge.id}
              onClick={() => speakBadge(badge, isUnlocked)}
              className={`
                relative rounded-3xl p-3 flex flex-col items-center justify-between text-center
                cursor-pointer shadow-md border-3 transition-all duration-200 active:scale-95
                ${
                  isUnlocked
                    ? `${badge.bg} border-2 shadow-lg hover:scale-105 ring-2 ring-amber-300/50`
                    : 'bg-white/60 border-slate-200 opacity-60'
                }
              `}
            >
              {/* Star Badge Icon */}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${
                  isUnlocked ? 'bg-white/80 animate-pulse' : 'bg-slate-100 grayscale'
                }`}
              >
                {isUnlocked ? badge.icon : '🔒'}
              </div>

              {/* Title & Description */}
              <div className="mt-1.5 w-full">
                <h3 className="text-sm font-black text-slate-800 leading-tight">
                  {badge.title}
                </h3>
                <p className="text-[10px] font-medium text-slate-600 mt-0.5 leading-snug">
                  {isUnlocked ? badge.description : 'Mystery Badge! Keep feeding!'}
                </p>
              </div>

              {/* Status Badge */}
              <div className="mt-2">
                {isUnlocked ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300">
                    <Check className="w-3 h-3" />
                    <span>Unlocked</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    Locked
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </main>

      {/* Back to Game button */}
      <footer className="w-full max-w-md pt-2 pb-1">
        <button
          onClick={onBack}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 text-white font-black text-base shadow-lg active:scale-95 transition-transform"
        >
          KEEP PLAYING & COLLECTING! 🎉
        </button>
      </footer>
    </div>
  );
}
