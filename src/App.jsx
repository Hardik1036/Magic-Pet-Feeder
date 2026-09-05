import React, { useState, useEffect, useCallback } from 'react';
import WelcomePage from './components/WelcomePage.jsx';
import PetSelectPage from './components/PetSelectPage.jsx';
import PetNamingPage from './components/PetNamingPage.jsx';
import MagicPetFeeder from './components/MagicPetFeeder.jsx';
import BadgesPage from './components/BadgesPage.jsx';
import BathSpaPage from './components/BathSpaPage.jsx';
import PlayroomPage from './components/PlayroomPage.jsx';
import BedroomPage from './components/BedroomPage.jsx';
import DressUpPage from './components/DressUpPage.jsx';
import { PETS } from './data/pets.js';
import { setAudioLanguage, getAudioLanguage, speakPetText, sfx } from './utils/audio.js';

const STORAGE_KEY = 'magic_pet_feeder_save_v2';

const DEFAULT_STATS = {
  streak: 0,
  numbersFed: 0,
  tensFed: 0,
  lettersFed: 0,
  vowelsFed: [],
  shapesFed: 0,
  rareShapesFed: [],
  colorsFed: [],
  bubblesPopped: 0,
  ballsBounced: 0,
  starsCounted: 0,
  photosTaken: 0,
};

const EMPTY_ARRAY = Object.freeze([]);

const areArraysEqual = (a = [], b = []) => {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

const VALID_PAGES = ['welcome', 'select_pet', 'name_pet', 'game', 'bath', 'playroom', 'bedroom', 'dressup', 'badges'];

// Comprehensive Error Boundary ensuring no black screens ever occur
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Game ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-screen bg-gradient-to-b from-sky-400 via-indigo-300 to-pink-300 flex flex-col items-center justify-center p-4 text-center select-none font-sans">
          <div className="bg-white/95 text-slate-900 rounded-3xl p-6 shadow-2xl max-w-sm flex flex-col items-center gap-3 border-4 border-amber-400">
            <span className="text-5xl animate-bounce">🦖</span>
            <h2 className="text-xl font-black text-slate-800">Magic Pet World</h2>
            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              Your pet companions are ready! Tap below to jump straight in!
            </p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full py-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-black rounded-2xl shadow-lg active:scale-95 transition text-base"
            >
              Play with Pets! 🌟
            </button>
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.removeItem(STORAGE_KEY);
                } catch (e) {}
                window.location.reload();
              }}
              className="text-xs text-slate-400 hover:text-rose-500 font-bold underline"
            >
              New Game Reset
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  // Global player profile
  const [playerName, setPlayerName] = useState('Emma');
  const [selectedPetId, setSelectedPetId] = useState('dino');

  // Gameplay challenge stats
  const [playerStats, setPlayerStats] = useState(() => ({ ...DEFAULT_STATS }));

  // Independent per-pet progress dictionary!
  // { [petId]: { customName: '', feedCount: 0, stageIndex: 0, unlockedAccessories: [] } }
  const [petsProgress, setPetsProgress] = useState(() => {
    const initial = {};
    PETS.forEach((p) => {
      initial[p.id] = {
        customName: p.defaultName,
        feedCount: 0,
        stageIndex: 0,
        unlockedAccessories: [],
      };
    });
    return initial;
  });

  // Global unlocked badges list
  const [unlockedBadges, setUnlockedBadges] = useState([]);

  // Dressed pet photos scrapbook album
  const [savedPhotos, setSavedPhotos] = useState(() => {
    try {
      const raw = localStorage.getItem('magic_pet_feeder_photos_v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const handleSavePhoto = (photoData) => {
    setSavedPhotos((prev) => {
      const updated = [photoData, ...prev];
      try {
        localStorage.setItem('magic_pet_feeder_photos_v1', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save photo to storage:', e);
      }
      return updated;
    });
  };

  const handleDeletePhoto = (photoId) => {
    setSavedPhotos((prev) => {
      const updated = prev.filter((p) => p.id !== photoId);
      try {
        localStorage.setItem('magic_pet_feeder_photos_v1', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not update photos storage:', e);
      }
      return updated;
    });
  };

  // Navigation: 'welcome' | 'select_pet' | 'name_pet' | 'game' | 'bath' | 'playroom' | 'bedroom' | 'dressup' | 'badges'
  const [currentPage, setCurrentPage] = useState('welcome');
  const [hasExistingSave, setHasExistingSave] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage safely
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && saved.playerName) {
          setPlayerName(saved.playerName);
          setSelectedPetId(saved.selectedPetId || 'dino');
          if (saved.petsProgress) {
            setPetsProgress((prev) => ({
              ...prev,
              ...saved.petsProgress,
            }));
          }
          if (saved.unlockedBadges) {
            setUnlockedBadges(saved.unlockedBadges);
          }
          if (saved.playerStats) {
            setPlayerStats((prev) => ({
              ...prev,
              ...saved.playerStats,
            }));
          }
          setHasExistingSave(true);

          if (saved.currentPage && VALID_PAGES.includes(saved.currentPage)) {
            setCurrentPage(saved.currentPage);
          } else {
            setCurrentPage('game');
          }
        }
      }
    } catch (e) {
      console.warn('Could not load save from localStorage:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save changes to localStorage
  const saveToStorage = (updates = {}) => {
    try {
      const dataToSave = {
        playerName: updates.playerName ?? playerName,
        selectedPetId: updates.selectedPetId ?? selectedPetId,
        petsProgress: updates.petsProgress ?? petsProgress,
        unlockedBadges: updates.unlockedBadges ?? unlockedBadges,
        playerStats: updates.playerStats ?? playerStats,
        currentPage: updates.currentPage ?? currentPage,
        lastPlayed: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  };

  const handleUpdateStats = useCallback((updater) => {
    setPlayerStats((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveToStorage({ playerStats: next });
      return next;
    });
  }, []);

  // Step 1: Welcome page -> Choose Pet
  const handleWelcomeProceed = (name) => {
    setPlayerName(name);
    setCurrentPage('select_pet');
    saveToStorage({ playerName: name, currentPage: 'select_pet' });
  };

  // Step 2: Choose Animal Species -> Pet Naming page
  const handleSelectPet = (petId) => {
    setSelectedPetId(petId);
    setCurrentPage('name_pet');
    saveToStorage({ selectedPetId: petId, currentPage: 'name_pet' });
  };

  // Step 3: Confirm Pet Name -> Enter Feeding Game
  const handleConfirmPetName = (customName) => {
    setPetsProgress((prev) => {
      const updatedPets = {
        ...prev,
        [selectedPetId]: {
          ...(prev[selectedPetId] || {}),
          customName,
        },
      };
      saveToStorage({ petsProgress: updatedPets, currentPage: 'game' });
      return updatedPets;
    });
    setCurrentPage('game');
  };

  // In-Game: Save feed count & accessories for CURRENT pet with strict equality guard!
  const handleSaveGameProgress = useCallback(
    ({ feedCount, stageIndex, unlockedAccessories }) => {
      setPetsProgress((prev) => {
        const currentPetData = prev[selectedPetId] || {};
        // Guard against infinite loop: do not trigger state update if values haven't changed!
        if (
          currentPetData.feedCount === feedCount &&
          currentPetData.stageIndex === stageIndex &&
          areArraysEqual(currentPetData.unlockedAccessories, unlockedAccessories)
        ) {
          return prev;
        }

        const updatedPets = {
          ...prev,
          [selectedPetId]: {
            ...currentPetData,
            feedCount,
            stageIndex,
            unlockedAccessories: Array.isArray(unlockedAccessories)
              ? [...unlockedAccessories]
              : EMPTY_ARRAY,
          },
        };
        saveToStorage({ petsProgress: updatedPets, currentPage: 'game' });
        return updatedPets;
      });
    },
    [selectedPetId]
  );

  // In-Game: Award badge
  const handleUnlockBadge = useCallback((badgeId) => {
    setUnlockedBadges((prev) => {
      if (!prev.includes(badgeId)) {
        const nextBadges = [...prev, badgeId];
        saveToStorage({ unlockedBadges: nextBadges });
        return nextBadges;
      }
      return prev;
    });
  }, []);

  // Update accessories across pet save
  const handleUpdateAccessories = (unlockedAccessories) => {
    const currentPetData = petsProgress[selectedPetId] || {};
    const updatedPets = {
      ...petsProgress,
      [selectedPetId]: {
        ...currentPetData,
        unlockedAccessories,
      },
    };
    setPetsProgress(updatedPets);
    saveToStorage({ petsProgress: updatedPets });
  };

  // Navigate between rooms and activities
  const handleNavigateActivity = (activityId) => {
    if (activityId === 'kitchen') {
      setCurrentPage('game');
      saveToStorage({ currentPage: 'game' });
    } else {
      setCurrentPage(activityId);
      saveToStorage({ currentPage: activityId });
    }
  };

  if (!isLoaded) {
    return (
      <div className="w-full min-h-screen bg-slate-900 flex items-center justify-center text-white font-bold text-lg">
        Loading Magic World...
      </div>
    );
  }

  const activePet = PETS.find((p) => p.id === selectedPetId) || PETS[0];

  // Audio language: 'en' | 'hinglish'
  const [audioLanguage, setAudioLanguageState] = useState(() => getAudioLanguage());

  const handleToggleLanguage = useCallback(() => {
    const nextLang = audioLanguage === 'hinglish' ? 'en' : 'hinglish';
    setAudioLanguage(nextLang);
    setAudioLanguageState(nextLang);
    sfx.pop();
    if (nextLang === 'hinglish') {
      speakPetText('Arre waah! Hinglish voice shuru ho gayi!', activePet.voice, 'hinglish');
    } else {
      speakPetText('Awesome! English voice is on!', activePet.voice, 'en');
    }
  }, [audioLanguage, activePet.voice]);

  const activePetData = petsProgress[selectedPetId] || {
    customName: activePet.defaultName,
    feedCount: 0,
    stageIndex: 0,
    unlockedAccessories: EMPTY_ARRAY,
  };

  const totalFeeds = Object.values(petsProgress).reduce((acc, p) => acc + (p.feedCount || 0), 0);
  const safeAccessories = Array.isArray(activePetData.unlockedAccessories) ? activePetData.unlockedAccessories : EMPTY_ARRAY;
  const effectivePage = VALID_PAGES.includes(currentPage)
    ? currentPage
    : (hasExistingSave ? 'game' : 'welcome');

  return (
    <div className="w-full h-[100dvh] flex items-center justify-center bg-slate-950 overflow-hidden select-none">
      <div className="w-full h-full max-h-[100dvh] max-w-md mx-auto relative overflow-hidden flex flex-col shadow-2xl bg-slate-900">
        {/* PAGE 1: WELCOME & PLAYER NAME */}
        {effectivePage === 'welcome' && (
          <WelcomePage
            initialPlayerName={playerName}
            hasExistingSave={hasExistingSave}
            savedPetName={activePetData.customName || activePet.defaultName}
            unlockedBadgesCount={unlockedBadges.length}
            audioLanguage={audioLanguage}
            onToggleLanguage={handleToggleLanguage}
            onOpenBadges={() => setCurrentPage('badges')}
            onResumeExisting={() => {
              setCurrentPage('game');
              saveToStorage({ currentPage: 'game' });
            }}
            onProceed={handleWelcomeProceed}
          />
        )}

        {/* PAGE 2: CHOOSE FROM 8 ANIMALS */}
        {effectivePage === 'select_pet' && (
          <PetSelectPage
            playerName={playerName}
            petsProgress={petsProgress}
            selectedPetId={selectedPetId}
            audioLanguage={audioLanguage}
            onToggleLanguage={handleToggleLanguage}
            onSelectPet={handleSelectPet}
            onOpenBadges={() => setCurrentPage('badges')}
            onBack={() => setCurrentPage('welcome')}
          />
        )}

        {/* STEP 2.5: NAME YOUR PET */}
        {effectivePage === 'name_pet' && (
          <PetNamingPage
            selectedPetId={selectedPetId}
            currentPetName={activePetData.customName}
            playerName={playerName}
            audioLanguage={audioLanguage}
            onToggleLanguage={handleToggleLanguage}
            onConfirmName={handleConfirmPetName}
            onBack={() => setCurrentPage('select_pet')}
          />
        )}

        {/* ACTIVITY 1: FEEDING KITCHEN */}
        {effectivePage === 'game' && (
          <MagicPetFeeder
            key={selectedPetId}
            playerName={playerName}
            petNickname={activePetData.customName}
            selectedPetId={selectedPetId}
            initialFeedCount={activePetData.feedCount}
            initialAccessories={safeAccessories}
            unlockedBadges={unlockedBadges}
            playerStats={playerStats}
            audioLanguage={audioLanguage}
            onToggleLanguage={handleToggleLanguage}
            onUpdateStats={handleUpdateStats}
            totalFeeds={totalFeeds}
            onUnlockBadge={handleUnlockBadge}
            onOpenBadges={() => setCurrentPage('badges')}
            onNavigate={handleNavigateActivity}
            onSwitchPet={() => setCurrentPage('select_pet')}
            onChangeProfile={() => setCurrentPage('welcome')}
            onSaveProgress={handleSaveGameProgress}
          />
        )}

        {/* ACTIVITY 2: BUBBLE BATH SPA */}
        {effectivePage === 'bath' && (
          <BathSpaPage
            playerName={playerName}
            petNickname={activePetData.customName}
            selectedPetId={selectedPetId}
            stageIndex={activePetData.stageIndex}
            feedCount={activePetData.feedCount}
            unlockedAccessories={safeAccessories}
            unlockedBadges={unlockedBadges}
            playerStats={playerStats}
            audioLanguage={audioLanguage}
            onToggleLanguage={handleToggleLanguage}
            onUpdateStats={handleUpdateStats}
            onUnlockBadge={handleUnlockBadge}
            onNavigate={handleNavigateActivity}
            onSwitchPet={() => setCurrentPage('select_pet')}
            onChangeProfile={() => setCurrentPage('welcome')}
          />
        )}

        {/* ACTIVITY 3: TOY PLAYROOM */}
        {effectivePage === 'playroom' && (
          <PlayroomPage
            playerName={playerName}
            petNickname={activePetData.customName}
            selectedPetId={selectedPetId}
            stageIndex={activePetData.stageIndex}
            feedCount={activePetData.feedCount}
            unlockedAccessories={safeAccessories}
            unlockedBadges={unlockedBadges}
            playerStats={playerStats}
            audioLanguage={audioLanguage}
            onToggleLanguage={handleToggleLanguage}
            onUpdateStats={handleUpdateStats}
            onUnlockBadge={handleUnlockBadge}
            onNavigate={handleNavigateActivity}
            onSwitchPet={() => setCurrentPage('select_pet')}
            onChangeProfile={() => setCurrentPage('welcome')}
          />
        )}

        {/* ACTIVITY 4: COZY BEDROOM BEDTIME */}
        {effectivePage === 'bedroom' && (
          <BedroomPage
            playerName={playerName}
            petNickname={activePetData.customName}
            selectedPetId={selectedPetId}
            stageIndex={activePetData.stageIndex}
            feedCount={activePetData.feedCount}
            unlockedAccessories={safeAccessories}
            unlockedBadges={unlockedBadges}
            playerStats={playerStats}
            audioLanguage={audioLanguage}
            onToggleLanguage={handleToggleLanguage}
            onUpdateStats={handleUpdateStats}
            onUnlockBadge={handleUnlockBadge}
            onNavigate={handleNavigateActivity}
            onSwitchPet={() => setCurrentPage('select_pet')}
            onChangeProfile={() => setCurrentPage('welcome')}
          />
        )}

        {/* ACTIVITY 5: DRESS-UP SALON */}
        {effectivePage === 'dressup' && (
          <DressUpPage
            playerName={playerName}
            petNickname={activePetData.customName}
            selectedPetId={selectedPetId}
            stageIndex={activePetData.stageIndex}
            feedCount={activePetData.feedCount}
            unlockedAccessories={safeAccessories}
            onUpdateAccessories={handleUpdateAccessories}
            unlockedBadges={unlockedBadges}
            playerStats={playerStats}
            audioLanguage={audioLanguage}
            onToggleLanguage={handleToggleLanguage}
            onUpdateStats={handleUpdateStats}
            onUnlockBadge={handleUnlockBadge}
            onNavigate={handleNavigateActivity}
            onSwitchPet={() => setCurrentPage('select_pet')}
            onChangeProfile={() => setCurrentPage('welcome')}
            savedPhotos={savedPhotos}
            onSavePhoto={handleSavePhoto}
            onDeletePhoto={handleDeletePhoto}
          />
        )}

        {/* PAGE 6: BADGES & TROPHIES ROOM */}
        {effectivePage === 'badges' && (
          <BadgesPage
            unlockedBadges={unlockedBadges}
            playerStats={playerStats}
            totalFeeds={totalFeeds}
            petVoice={activePet.voice}
            audioLanguage={audioLanguage}
            onToggleLanguage={handleToggleLanguage}
            onBack={() => setCurrentPage('game')}
          />
        )}

        {/* FALLBACK SAFETY CONTAINER: Prevents any black screen */}
        {!VALID_PAGES.includes(effectivePage) && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-white text-center bg-gradient-to-b from-sky-400 to-indigo-500">
            <span className="text-5xl mb-3 animate-bounce">🐾</span>
            <h2 className="text-xl font-black mb-2">Magic Pet World</h2>
            <p className="text-xs text-white/90 font-medium mb-4">
              Your pet is excited to play!
            </p>
            <button
              type="button"
              onClick={() => setCurrentPage('game')}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 active:scale-95 text-amber-950 font-black rounded-2xl shadow-xl transition text-sm"
            >
              Play with Pets! 🌟
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
