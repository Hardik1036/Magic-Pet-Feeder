import React, { useState } from 'react';
import { ArrowLeft, Award, Volume2, Check, Lock } from 'lucide-react';
import { BADGES } from '../data/badges.js';

export default function BadgesPage({
  unlockedBadges = [],
  playerStats = {},
  totalFeeds = 0,
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
        : `Locked Badge: ${badge.title}. Goal: ${badge.requirement || badge.description}`;
      const u = new SpeechSynthesisUtterance(text);
      u.pitch = petVoice?.pitch || 1.25;
      u.rate = petVoice?.rate || 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  const unlockedCount = unlockedBadges.length;

  return (
    <div
      className="relative w-full h-full max-h-[100dvh] bg-gradient-to-b from-sky-300 via-indigo-100 to-pink-200 flex flex-col justify-between items-center p-2.5 sm:p-4 select-none font-sans overflow-hidden"
      style={{ touchAction: 'manipulation' }}
    >
      {/* Top Navigation */}
      <header className="w-full max-w-md flex items-center justify-between pt-0.5 flex-shrink-0">
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

      {/* Header Banner & Live Quest Progress */}
      <div className="w-full max-w-md text-center my-1 flex-shrink-0">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 text-xl shadow-lg border-2 border-amber-500 mb-0.5 animate-bounce">
          🏆
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-tight">
          Round Badge Showcase!
        </h1>
        <p className="text-[11px] font-semibold text-slate-600">
          Tap any round medal to hear your achievement or quest!
        </p>

        {/* Live Quest Progress Chips */}
        <div className="flex items-center justify-center gap-1 flex-wrap mt-1.5 max-w-sm mx-auto">
          <span className="text-[9px] font-black bg-white/85 px-1.5 py-0.5 rounded-full border border-sky-300 text-sky-800 shadow-xs">
            🔥 Streak: {playerStats.streak || 0}
          </span>
          <span className="text-[9px] font-black bg-white/85 px-1.5 py-0.5 rounded-full border border-blue-300 text-blue-800 shadow-xs">
            🔢 Math: {playerStats.numbersFed || 0}/10
          </span>
          <span className="text-[9px] font-black bg-white/85 px-1.5 py-0.5 rounded-full border border-emerald-300 text-emerald-800 shadow-xs">
            🔤 Letters: {playerStats.lettersFed || 0}/12
          </span>
          <span className="text-[9px] font-black bg-white/85 px-1.5 py-0.5 rounded-full border border-pink-300 text-pink-800 shadow-xs">
            🎨 Shapes: {playerStats.shapesFed || 0}/12
          </span>
          <span className="text-[9px] font-black bg-white/85 px-1.5 py-0.5 rounded-full border border-cyan-300 text-cyan-800 shadow-xs">
            🫧 Bubbles: {playerStats.bubblesPopped || 0}/15
          </span>
          <span className="text-[9px] font-black bg-white/85 px-1.5 py-0.5 rounded-full border border-emerald-300 text-emerald-800 shadow-xs">
            ⚽ Bounces: {playerStats.ballsBounced || 0}/10
          </span>
          <span className="text-[9px] font-black bg-white/85 px-1.5 py-0.5 rounded-full border border-indigo-300 text-indigo-800 shadow-xs">
            ⭐ Stars: {playerStats.starsCounted || 0}/5
          </span>
          <span className="text-[9px] font-black bg-white/85 px-1.5 py-0.5 rounded-full border border-rose-300 text-rose-800 shadow-xs">
            📸 Photos: {playerStats.photosTaken || 0}/3
          </span>
        </div>
      </div>

      {/* 3-Column Round Medallions Grid */}
      <main className="w-full max-w-md flex-1 min-h-0 grid grid-cols-3 gap-2.5 z-10 overflow-y-auto p-1 my-1">
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
                  relative w-18 h-18 sm:w-22 sm:h-22 rounded-full flex flex-col items-center justify-center
                  shadow-lg transition-all duration-300
                  ${
                    isUnlocked
                      ? 'bg-gradient-to-tr from-amber-200 via-white to-amber-100 border-3 border-amber-400 ring-3 ring-amber-200/70 hover:scale-105 shadow-amber-300/50'
                      : 'bg-slate-200/70 border-3 border-dashed border-slate-300 opacity-55'
                  }
                  ${isInspected ? 'ring-4 ring-purple-400 scale-105' : ''}
                `}
              >
                {/* Shiny Curved Gloss Highlight on Top Edge */}
                {isUnlocked && (
                  <div className="absolute top-1 left-2.5 w-8 h-3 bg-white/70 rounded-full blur-[0.5px] -rotate-12 pointer-events-none" />
                )}

                {/* Main Medallion Icon */}
                <div
                  className={`text-2xl sm:text-3xl filter ${
                    isUnlocked ? 'drop-shadow-md animate-pulse' : 'grayscale'
                  }`}
                >
                  {isUnlocked ? badge.icon : '🔒'}
                </div>

                {/* Small Checkmark Seal on bottom edge */}
                {isUnlocked && (
                  <div className="absolute -bottom-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-black border border-white shadow">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Badge Title Under Medallion */}
              <span className="text-[10px] font-black text-slate-800 text-center leading-tight mt-1 line-clamp-2 max-w-[80px]">
                {badge.title}
              </span>
            </div>
          );
        })}
      </main>

      {/* Inspected Badge Details Drawer */}
      {selectedBadge && (
        <div className="w-full max-w-md bg-white/95 rounded-xl p-2 shadow-md border-2 border-amber-300 flex items-center justify-between gap-2 my-0.5 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">{selectedBadge.icon}</span>
            <div className="text-left">
              <h4 className="text-xs font-black text-slate-800 leading-tight">
                {selectedBadge.title}
              </h4>
              <p className="text-[10px] font-semibold text-slate-600 leading-snug">
                {selectedBadge.description}
              </p>
              {selectedBadge.requirement && (
                <span className="inline-block mt-0.5 text-[8px] font-extrabold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-full border border-amber-200">
                  🎯 Goal: {selectedBadge.requirement}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => speakBadge(selectedBadge, unlockedBadges.includes(selectedBadge.id))}
            className="w-7 h-7 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shrink-0 active:scale-90"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Back to Game button */}
      <footer className="w-full max-w-md pt-1 pb-0.5 flex-shrink-0">
        <button
          onClick={onBack}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 text-white font-black text-sm shadow-md active:scale-95 transition-transform"
        >
          KEEP PLAYING & COLLECTING! 🎉
        </button>
      </footer>
    </div>
  );
}
