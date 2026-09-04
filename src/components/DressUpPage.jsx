import React, { useState, useEffect } from 'react';
import { User, Volume2, Camera, Check, X } from 'lucide-react';
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
  onUpdateStats,
  onUnlockBadge,
  onNavigate,
  onSwitchPet,
  onChangeProfile,
}) {
  const currentPet = PETS.find((p) => p.id === selectedPetId) || PETS[0];
  const petDisplayName = petNickname || currentPet.defaultName;

  const [activeAccessories, setActiveAccessories] = useState(unlockedAccessories);
  const [showPhotoFlash, setShowPhotoFlash] = useState(false);
  const [photoCard, setPhotoCard] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      speakPetText(
        `Welcome to the Dress-Up Salon! Pick your favorite costume for ${petDisplayName}!`,
        currentPet.voice
      );
    }, 200);
    return () => clearTimeout(timer);
  }, [currentPet, petDisplayName]);

  // Toggle costume accessory
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

    const compliments = ['So fancy!', 'Looking great!', 'Ooh, stylish!', 'Super cute!'];
    speakPetText(compliments[Math.floor(Math.random() * compliments.length)], currentPet.voice);
  };

  // Snapshot photo booth
  const handleTakePhoto = () => {
    sfx.shutter();
    setShowPhotoFlash(true);

    setTimeout(() => {
      setShowPhotoFlash(false);
      sfx.fanfare();
      setPhotoCard(true);

      const nextPhotos = (playerStats.photosTaken || 0) + 1;
      if (onUpdateStats) {
        onUpdateStats((prev) => ({
          ...prev,
          photosTaken: nextPhotos,
        }));
      }

      // Award Glamour Star badge on 3 photos!
      if (nextPhotos >= 3 && !unlockedBadges.includes('glamour_star')) {
        if (onUnlockBadge) onUnlockBadge('glamour_star');
        speakPetText(`Fabulous! You earned the Glamour Superstar trophy!`, currentPet.voice);
      } else {
        speakPetText(`Say cheese! What a gorgeous photo!`, currentPet.voice);
      }
    }, 200);
  };

  return (
    <div
      className="relative w-full min-h-screen bg-gradient-to-b from-rose-300 via-pink-100 to-purple-200 flex flex-col justify-between items-center p-3 sm:p-5 select-none overflow-hidden font-sans"
      style={{ touchAction: 'manipulation' }}
    >
      {/* Camera White Flash Effect */}
      {showPhotoFlash && (
        <div className="fixed inset-0 bg-white z-50 animate-fade pointer-events-none" />
      )}

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
            className="flex items-center gap-1 bg-white/85 px-2.5 py-1 rounded-full text-xs font-bold text-rose-900 border border-rose-200 shadow-sm active:scale-95"
          >
            <span>{currentPet.icon}</span>
            <span>{petDisplayName}</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1 rounded-full shadow-md border-2 border-rose-300">
          <span className="text-xs">📸</span>
          <span className="text-xs font-black text-rose-900">
            {playerStats.photosTaken || 0} / 3 Photos
          </span>
        </div>
      </header>

      {/* Task Prompt Banner */}
      <section className="w-full max-w-md my-1 z-20">
        <div className="bg-white/95 rounded-3xl p-3 shadow-xl border-4 border-rose-400 flex items-center justify-between">
          <div className="text-left">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-rose-700">
              👗 Dress-Up Salon:
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              Mix & Match Silly Outfits!
            </h2>
          </div>

          <button
            onClick={() => {
              sfx.pop();
              speakPetText(
                `Tap any costume below to dress up ${petDisplayName}, then snap a photo!`,
                currentPet.voice
              );
            }}
            className="w-11 h-11 bg-gradient-to-tr from-rose-400 to-pink-300 rounded-2xl shadow-md border-2 border-rose-500 flex items-center justify-center text-rose-950 active:scale-90"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Fashion Runway & Styled Pet */}
      <main className="relative my-auto flex flex-col items-center justify-center z-10 w-full max-w-sm h-64 sm:h-72">
        {/* Runway Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-56 h-56 bg-rose-400/20 rounded-full blur-2xl animate-pulse" />
        </div>

        {/* Pet Avatar with live costumes */}
        <div className="relative z-10">
          <PetAvatar
            petId={currentPet.id}
            stageIndex={stageIndex}
            feedCount={feedCount}
            expression="happy"
            accessories={activeAccessories}
          />
        </div>

        {/* Runway Stage Platform Graphic */}
        <div className="w-64 sm:w-72 h-12 bg-white/90 rounded-full border-4 border-rose-300 shadow-xl flex items-center justify-center gap-2 -mt-4 z-5">
          <span className="text-sm">✨</span>
          <span className="text-xs font-black text-rose-900 uppercase tracking-widest">
            FASHION RUNWAY
          </span>
          <span className="text-sm">✨</span>
        </div>
      </main>

      {/* Costume Wardrobe Selector & Camera Snap */}
      <footer className="w-full max-w-md flex flex-col gap-2 z-20">
        {/* Wardrobe Items Scroll */}
        <div className="bg-white/95 rounded-3xl p-2 shadow-lg border-2 border-rose-300 flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-2">
            <span className="text-[11px] font-black text-rose-900 uppercase tracking-wider">
              Wardrobe Rack ({activeAccessories.length} Equipped)
            </span>
            <button
              onClick={handleTakePhoto}
              className="flex items-center gap-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-md active:scale-90 transition-transform"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>SNAP PHOTO!</span>
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1 px-1">
            {ALL_SALON_ACCESSORIES.map((acc) => {
              const isEquipped = activeAccessories.includes(acc.id);
              return (
                <button
                  key={acc.id}
                  onClick={() => handleToggleAccessory(acc.id)}
                  className={`
                    relative flex flex-col items-center justify-center p-2 rounded-2xl min-w-[62px]
                    transition-all duration-200 active:scale-90 cursor-pointer
                    ${isEquipped ? 'bg-rose-500 text-white ring-3 ring-rose-300 shadow-md scale-105' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}
                  `}
                >
                  {isEquipped && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold shadow">
                      ✓
                    </div>
                  )}
                  <span className="text-2xl leading-none">{acc.icon}</span>
                  <span className="text-[9px] font-bold mt-1 truncate max-w-[58px]">
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

      {/* Souvenir Photo Card Modal */}
      {photoCard && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade">
          <div className="bg-white rounded-3xl p-5 max-w-xs w-full shadow-2xl border-4 border-rose-400 flex flex-col items-center text-center relative animate-bounce">
            <button
              onClick={() => setPhotoCard(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-3xl mb-1">📸 ✨</div>
            <h3 className="text-lg font-black text-rose-900">
              Souvenir Fashion Snapshot!
            </h3>
            <p className="text-xs font-semibold text-slate-600 mb-3">
              {playerName} & {petDisplayName} are superstars!
            </p>

            <div className="bg-gradient-to-tr from-pink-100 to-rose-200 p-4 rounded-2xl border-2 border-rose-300 w-full flex flex-col items-center shadow-inner">
              <span className="text-6xl my-2 filter drop-shadow">
                {currentPet.icon}
              </span>
              <div className="flex gap-1.5 mt-1">
                {activeAccessories.map((accId) => {
                  const acc = ALL_SALON_ACCESSORIES.find((a) => a.id === accId);
                  return acc ? (
                    <span key={accId} className="text-xl">
                      {acc.icon}
                    </span>
                  ) : null;
                })}
              </div>
            </div>

            <button
              onClick={() => setPhotoCard(false)}
              className="mt-4 w-full py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black text-sm shadow-md active:scale-95"
            >
              KEEP STYLING! 🎉
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
