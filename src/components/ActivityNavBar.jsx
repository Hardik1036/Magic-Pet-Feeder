import React from 'react';
import { Utensils, Droplets, Gamepad2, Moon, Sparkles, Award } from 'lucide-react';
import { sfx } from '../utils/audio.js';

export default function ActivityNavBar({
  currentActivity = 'kitchen',
  onSelectActivity,
  unlockedBadgesCount = 0,
}) {
  const activities = [
    {
      id: 'kitchen',
      label: 'Feed',
      icon: Utensils,
      emoji: '🍽️',
      activeBg: 'bg-amber-500 text-white shadow-amber-300 ring-2 ring-amber-300',
      idleBg: 'bg-white/90 text-amber-900 hover:bg-amber-50',
    },
    {
      id: 'bath',
      label: 'Bath',
      icon: Droplets,
      emoji: '🛁',
      activeBg: 'bg-sky-500 text-white shadow-sky-300 ring-2 ring-sky-300',
      idleBg: 'bg-white/90 text-sky-900 hover:bg-sky-50',
    },
    {
      id: 'playroom',
      label: 'Play',
      icon: Gamepad2,
      emoji: '⚽',
      activeBg: 'bg-emerald-500 text-white shadow-emerald-300 ring-2 ring-emerald-300',
      idleBg: 'bg-white/90 text-emerald-900 hover:bg-emerald-50',
    },
    {
      id: 'bedroom',
      label: 'Sleep',
      icon: Moon,
      emoji: '🌙',
      activeBg: 'bg-indigo-600 text-white shadow-indigo-300 ring-2 ring-indigo-300',
      idleBg: 'bg-white/90 text-indigo-900 hover:bg-indigo-50',
    },
    {
      id: 'dressup',
      label: 'Dress',
      icon: Sparkles,
      emoji: '👗',
      activeBg: 'bg-rose-500 text-white shadow-rose-300 ring-2 ring-rose-300',
      idleBg: 'bg-white/90 text-rose-900 hover:bg-rose-50',
    },
    {
      id: 'badges',
      label: 'Medals',
      icon: Award,
      emoji: '🏆',
      activeBg: 'bg-yellow-500 text-yellow-950 shadow-yellow-300 ring-2 ring-yellow-300',
      idleBg: 'bg-white/90 text-yellow-900 hover:bg-yellow-50',
      badgeCount: unlockedBadgesCount,
    },
  ];

  return (
    <nav
      className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-1.5 shadow-xl border-2 border-slate-200 flex items-center justify-around gap-1 z-30 select-none"
      style={{ touchAction: 'manipulation' }}
    >
      {activities.map((act) => {
        const isActive = currentActivity === act.id;
        const IconComponent = act.icon;

        return (
          <button
            key={act.id}
            onClick={() => {
              sfx.pop();
              if (onSelectActivity) onSelectActivity(act.id);
            }}
            className={`
              relative flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl flex-1
              transition-all duration-200 active:scale-90
              ${isActive ? `${act.activeBg} font-black scale-105 shadow-md` : `${act.idleBg} font-bold opacity-80`}
            `}
          >
            {/* Medals Count Badge */}
            {act.badgeCount !== undefined && act.badgeCount > 0 && (
              <span className="absolute -top-1.5 -right-1 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white shadow">
                {act.badgeCount}
              </span>
            )}

            <span className="text-base sm:text-lg leading-none mb-0.5">{act.emoji}</span>
            <span className="text-[10px] tracking-tight leading-tight">{act.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
