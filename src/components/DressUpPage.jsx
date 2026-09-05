import React, { useState, useEffect, useRef } from 'react';
import { User, Volume2, Camera, Check, X, BookOpen, Download, Trash2 } from 'lucide-react';
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
  savedPhotos = [],
  onSavePhoto,
  onDeletePhoto,
}) {
  const currentPet = PETS.find((p) => p.id === selectedPetId) || PETS[0];
  const petDisplayName = petNickname || currentPet.defaultName;

  const [activeAccessories, setActiveAccessories] = useState(unlockedAccessories);
  const [showPhotoFlash, setShowPhotoFlash] = useState(false);
  const [photoCard, setPhotoCard] = useState(null);
  const [showScrapbook, setShowScrapbook] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      speakPetText(
        `Welcome to the Dress-Up Salon! Pick your favorite costume for ${petDisplayName}!`,
        currentPet.voice
      );
    }, 400);
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

    const photoRecord = {
      id: Date.now().toString(),
      petId: currentPet.id,
      petName: petDisplayName,
      accessories: [...activeAccessories],
      stageIndex,
      playerName: playerName || 'Friend',
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      time: new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }),
    };

    setTimeout(() => {
      setShowPhotoFlash(false);
      sfx.fanfare();
      setPhotoCard(photoRecord);

      if (onSavePhoto) {
        onSavePhoto(photoRecord);
      }

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
        speakPetText(`Say cheese! What a gorgeous photo saved to your scrapbook!`, currentPet.voice);
      }
    }, 280);
  };

  const handleDownloadPolaroid = (photo) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 500;
      const ctx = canvas.getContext('2d');

      // Polaroid white card background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 400, 500);

      // Inner photo background
      const grad = ctx.createLinearGradient(0, 0, 400, 360);
      grad.addColorStop(0, '#FBCFE8');
      grad.addColorStop(1, '#DDD6FE');
      ctx.fillStyle = grad;
      ctx.fillRect(25, 25, 350, 340);

      // Pet Icon / Graphic
      ctx.font = '96px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(currentPet.icon, 200, 180);

      // Costumes emoji line
      const accIcons = photo.accessories
        .map((aId) => ALL_SALON_ACCESSORIES.find((a) => a.id === aId)?.icon)
        .filter(Boolean)
        .join('  ');
      if (accIcons) {
        ctx.font = '32px sans-serif';
        ctx.fillText(accIcons, 200, 260);
      }

      // Polaroid handwritten style caption
      ctx.fillStyle = '#1E293B';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(`${photo.petName} ✨`, 200, 410);

      ctx.fillStyle = '#64748B';
      ctx.font = '14px sans-serif';
      ctx.fillText(`Styled by ${photo.playerName} • ${photo.date}`, 200, 445);

      const link = document.createElement('a');
      link.download = `${photo.petName}-fashion-snapshot.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      sfx.pop();
    } catch (e) {
      console.warn('Could not generate download image:', e);
    }
  };

  return (
    <div
      className="relative w-full h-full max-h-[100dvh] bg-gradient-to-b from-rose-300 via-pink-100 to-purple-200 flex flex-col justify-between items-center px-2 py-1 sm:px-4 sm:py-2.5 select-none overflow-hidden font-sans"
      style={{ touchAction: 'manipulation' }}
    >
      {/* Camera White Flash Effect */}
      {showPhotoFlash && (
        <div className="fixed inset-0 bg-white z-50 animate-fade pointer-events-none" />
      )}

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

          {/* Scrapbook Album Trigger Button */}
          <button
            onClick={() => {
              sfx.pop();
              setShowScrapbook(true);
            }}
            className="flex items-center gap-1.5 bg-white/95 px-3 py-1 rounded-full shadow-md border-2 border-rose-400 active:scale-95 transition-transform"
          >
            <BookOpen className="w-3.5 h-3.5 text-rose-600" />
            <span className="text-xs font-black text-rose-900">
              Album ({savedPhotos.length})
            </span>
          </button>
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
                `Tap any costume below to dress up ${petDisplayName}, then snap a photo to keep in your scrapbook!`,
                currentPet.voice
              );
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-tr from-rose-400 to-pink-300 rounded-xl shadow-md border border-rose-500 flex items-center justify-center text-rose-950 active:scale-90 flex-shrink-0"
          >
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </section>

      {/* Fashion Runway & Styled Pet */}
      <main className="relative my-auto flex-1 min-h-0 flex flex-col items-center justify-center z-10 w-full max-w-sm">
        {/* Runway Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-44 sm:w-56 h-44 sm:h-56 bg-rose-400/20 rounded-full blur-2xl animate-pulse" />
        </div>

        {/* Realistic Pet Avatar with live costumes */}
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
        <div className="w-52 sm:w-68 h-9 sm:h-11 bg-white/90 rounded-full border-2 sm:border-3 border-rose-300 shadow-lg flex items-center justify-center gap-1.5 -mt-2 sm:-mt-3 z-5">
          <span className="text-xs">✨</span>
          <span className="text-[9px] sm:text-xs font-black text-rose-900 uppercase tracking-widest">
            FASHION RUNWAY
          </span>
          <span className="text-xs">✨</span>
        </div>
      </main>

      {/* Costume Wardrobe Selector & Camera Snap */}
      <footer className="w-full max-w-md flex flex-col gap-1 z-20 pb-0.5 flex-shrink-0">
        {/* Wardrobe Items Scroll */}
        <div className="bg-white/95 rounded-2xl p-1.5 sm:p-2 shadow-md border-2 border-rose-300 flex flex-col gap-1">
          <div className="flex items-center justify-between px-1.5">
            <span className="text-[10px] font-black text-rose-900 uppercase tracking-wider">
              Wardrobe ({activeAccessories.length} Equipped)
            </span>
            <button
              onClick={handleTakePhoto}
              className="flex items-center gap-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-md active:scale-90 transition-transform"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>SNAP PHOTO!</span>
            </button>
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
                  <span className="text-xl leading-none">{acc.icon}</span>
                  <span className="text-[8.5px] font-bold mt-0.5 truncate max-w-[54px]">
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

      {/* ------------------------------------ */}
      {/* SOUVENIR SNAPSHOT MODAL              */}
      {/* ------------------------------------ */}
      {photoCard && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade">
          <div className="bg-white rounded-3xl p-4 max-w-xs w-full shadow-2xl border-4 border-rose-400 flex flex-col items-center text-center relative animate-bounce">
            <button
              onClick={() => setPhotoCard(null)}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-2xl mb-0.5">📸 ✨</div>
            <h3 className="text-base font-black text-rose-900 leading-tight">
              Snapshot Saved to Scrapbook!
            </h3>
            <p className="text-[11px] font-semibold text-slate-600 mb-2.5">
              {photoCard.petName} looks fabulous!
            </p>

            {/* Polaroid Frame Card Preview */}
            <div className="bg-gradient-to-tr from-pink-50 to-purple-50 p-3 rounded-2xl border-2 border-rose-300 w-full flex flex-col items-center shadow-inner">
              <div className="w-24 h-24 flex items-center justify-center">
                <PetAvatar
                  petId={currentPet.id}
                  stageIndex={photoCard.stageIndex}
                  feedCount={5}
                  expression="happy"
                  accessories={photoCard.accessories}
                />
              </div>
              <p className="text-xs font-black text-slate-800 mt-1">
                {photoCard.petName}
              </p>
              <p className="text-[10px] text-slate-500">
                {photoCard.date} at {photoCard.time}
              </p>
            </div>

            <div className="flex flex-col gap-1.5 w-full mt-3">
              <button
                onClick={() => handleDownloadPolaroid(photoCard)}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-black text-xs shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>DOWNLOAD POLAROID CARD</span>
              </button>

              <button
                onClick={() => {
                  setPhotoCard(null);
                  setShowScrapbook(true);
                }}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 active:scale-95"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>OPEN PHOTO SCRAPBOOK 📖</span>
              </button>

              <button
                onClick={() => setPhotoCard(null)}
                className="w-full py-1.5 rounded-lg text-slate-600 font-bold text-[11px] active:scale-95"
              >
                Keep Styling! 🎉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------ */}
      {/* PHOTO SCRAPBOOK / GALLERY MODAL 📖   */}
      {/* ------------------------------------ */}
      {showScrapbook && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 z-50 animate-fade">
          <div className="bg-gradient-to-b from-amber-50 to-pink-50 rounded-3xl p-3.5 sm:p-4 max-w-sm w-full max-h-[85vh] shadow-2xl border-4 border-amber-300 flex flex-col justify-between overflow-hidden relative">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-amber-200 flex-shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl">📖</span>
                <div>
                  <h3 className="text-base font-black text-amber-950 leading-tight">
                    Pet Scrapbook Album
                  </h3>
                  <p className="text-[10px] font-semibold text-slate-600">
                    {savedPhotos.length} photo{savedPhotos.length === 1 ? '' : 's'} saved
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowScrapbook(false)}
                className="w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-slate-700 shadow-sm font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Photos List Grid */}
            <div className="flex-1 min-h-0 overflow-y-auto py-2.5 flex flex-col gap-3">
              {savedPhotos.length === 0 ? (
                <div className="my-auto text-center py-8">
                  <span className="text-4xl mb-2 block">📷</span>
                  <h4 className="text-sm font-black text-slate-700">
                    No photos in your album yet!
                  </h4>
                  <p className="text-xs font-semibold text-slate-500 mt-1 max-w-xs mx-auto">
                    Dress up your pet with hats, glasses, and capes, then tap <strong>SNAP PHOTO!</strong> to start collecting memories!
                  </p>
                </div>
              ) : (
                savedPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="bg-white rounded-2xl p-3 shadow-md border-2 border-amber-200 flex flex-col items-center relative"
                  >
                    {/* Washi Tape Header Decorator */}
                    <div className="w-16 h-3.5 bg-amber-300/80 rounded-xs -mt-5 mb-1.5 shadow-xs rotate-1" />

                    {/* Miniature Pet Avatar in Photo */}
                    <div className="w-24 h-24 flex items-center justify-center bg-gradient-to-tr from-pink-50 to-indigo-50 rounded-xl p-1 border border-pink-200">
                      <PetAvatar
                        petId={photo.petId || currentPet.id}
                        stageIndex={photo.stageIndex ?? 1}
                        feedCount={5}
                        expression="happy"
                        accessories={photo.accessories || []}
                      />
                    </div>

                    <div className="w-full flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                      <div className="text-left">
                        <h5 className="text-xs font-black text-slate-800 leading-tight">
                          {photo.petName} ✨
                        </h5>
                        <p className="text-[9px] font-semibold text-slate-500">
                          {photo.date} • {photo.time}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDownloadPolaroid(photo)}
                          title="Download photo"
                          className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg active:scale-90"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        {onDeletePhoto && (
                          <button
                            onClick={() => {
                              sfx.pop();
                              onDeletePhoto(photo.id);
                            }}
                            title="Delete photo"
                            className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg active:scale-90"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Back Button */}
            <div className="pt-2 flex-shrink-0">
              <button
                onClick={() => setShowScrapbook(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black text-xs shadow-md active:scale-95"
              >
                CLOSE SCRAPBOOK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
