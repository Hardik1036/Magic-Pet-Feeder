import React, { useState } from 'react';
import { ArrowLeft, Award, Volume2, Check, Lock } from 'lucide-react';
import { BADGES } from '../data/badges.js';

export default function BadgesPage({
  unlockedBadges = [],
  onBack,
  petVoice,
}) {
  const [selectedBadge, setSelectedBadge] = useState(null);

  const speakBadge = (badge, isUnlocked) => {
    setSelectedBadge(badge);
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

        <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1 rounded-full shadow-md border-2 border-amber-300">
          <Award className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-black text-amber-900">
            {unlockedCount} / {BADGES.length} BADGES
          </span>
        </div>
      </header>

      {/* Header Banner */}
      <div className="w-full max-w-md text-center my-1.5">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 text-2xl shadow-lg border-2 border-amber-500 mb-1 animate-bounce">
          🏆
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
          Round Badge Showcase!
        </h1>
        <p className="text-xs font-semibold text-slate-600">
          Tap any round medal to hear your achievement!
        </p>
      </div>

      {/* 3-Column Round Medallions Grid */}
      <main className="w-full max-w-md my-auto grid grid-cols-3 gap-3 z-10 max-h-[58vh] overflow-y-auto p-2">
        {BADGES.map((badge) => {
          const isUnlocked = unlockedBadges.includes(badge.id);
          const isInspected = selectedBadge?.id === badge.id;

          return (
            <div
              key={badge.id}
              onClick={() => speakBadge(badge, isUnlocked)}
              className="flex flex-col items-center cursor-pointer group active:scale-95 transition-transform"
            >
              {/* Circular Medallion */}
              <div
                className={`
                  relative w-22 h-22 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center
                  shadow-lg transition-all duration-300
                  ${
                    isUnlocked
                      ? 'bg-gradient-to-tr from-amber-200 via-white to-amber-100 border-4 border-amber-400 ring-4 ring-amber-200/70 hover:scale-105 shadow-amber-300/50'
                      : 'bg-slate-200/70 border-4 border-dashed border-slate-300 opacity-55'
                  }
                  ${isInspected ? 'ring-4 ring-purple-400 scale-105' : ''}
                `}
              >
                {/* Shiny Curved Gloss Highlight on Top Edge */}
                {isUnlocked && (
                  <div className="absolute top-1.5 left-3 w-10 h-4 bg-white/70 rounded-full blur-[0.5px] -rotate-12 pointer-events-none" />
                )}

                {/* Main Medallion Icon */}
                <div
                  className={`text-3xl sm:text-4xl filter ${
                    isUnlocked ? 'drop-shadow-md animate-pulse' : 'grayscale'
                  }`}
                >
                  {isUnlocked ? badge.icon : '🔒'}
                </div>

                {/* Small Checkmark Seal on bottom edge */}
                {isUnlocked && (
                  <div className="absolute -bottom-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black border-2 border-white shadow">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Badge Title Under Medallion */}
              <span className="text-[11px] font-black text-slate-800 text-center leading-tight mt-1.5 line-clamp-2 max-w-[85px]">
                {badge.title}
              </span>
            </div>
          );
        })}
      </main>

      {/* Inspected Badge Details Drawer */}
      {selectedBadge && (
        <div className="w-full max-w-md bg-white/95 rounded-2xl p-2.5 shadow-md border-2 border-amber-300 flex items-center justify-between gap-2 mt-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{selectedBadge.icon}</span>
            <div className="text-left">
              <h4 className="text-xs font-black text-slate-800 leading-tight">
                {selectedBadge.title}
              </h4>
              <p className="text-[10px] font-semibold text-slate-600 leading-snug">
                {selectedBadge.description}
              </p>
            </div>
          </div>
          <button
            onClick={() => speakBadge(selectedBadge, unlockedBadges.includes(selectedBadge.id))}
            className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shrink-0 active:scale-90"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      )}

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
