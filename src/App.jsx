import React, { useState, useEffect } from 'react';
import WelcomePage from './components/WelcomePage.jsx';
import PetSelectPage from './components/PetSelectPage.jsx';
import PetNamingPage from './components/PetNamingPage.jsx';
import MagicPetFeeder from './components/MagicPetFeeder.jsx';
import BadgesPage from './components/BadgesPage.jsx';
import { PETS } from './data/pets.js';

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
};

export default function App() {
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

  // Navigation: 'welcome' | 'select_pet' | 'name_pet' | 'game' | 'badges'
  const [currentPage, setCurrentPage] = useState('welcome');
  const [hasExistingSave, setHasExistingSave] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
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

          if (saved.currentPage === 'game') {
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

  const handleUpdateStats = (updater) => {
    setPlayerStats((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveToStorage({ playerStats: next });
      return next;
    });
  };

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
    const updatedPets = {
      ...petsProgress,
      [selectedPetId]: {
        ...(petsProgress[selectedPetId] || {}),
        customName,
      },
    };
    setPetsProgress(updatedPets);
    setCurrentPage('game');
    saveToStorage({ petsProgress: updatedPets, currentPage: 'game' });
  };

  // In-Game: Save feed count & accessories for CURRENT pet without touching others!
  const handleSaveGameProgress = ({ feedCount, stageIndex, unlockedAccessories }) => {
    const currentPetData = petsProgress[selectedPetId] || {};
    const updatedPets = {
      ...petsProgress,
      [selectedPetId]: {
        ...currentPetData,
        feedCount,
        stageIndex,
        unlockedAccessories,
      },
    };
    setPetsProgress(updatedPets);
    saveToStorage({ petsProgress: updatedPets, currentPage: 'game' });
  };

  // In-Game: Award badge
  const handleUnlockBadge = (badgeId) => {
    if (!unlockedBadges.includes(badgeId)) {
      const nextBadges = [...unlockedBadges, badgeId];
      setUnlockedBadges(nextBadges);
      saveToStorage({ unlockedBadges: nextBadges });
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
  const activePetData = petsProgress[selectedPetId] || {
    customName: activePet.defaultName,
    feedCount: 0,
    stageIndex: 0,
    unlockedAccessories: [],
  };

  const totalFeeds = Object.values(petsProgress).reduce((acc, p) => acc + (p.feedCount || 0), 0);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full h-full max-w-md mx-auto relative overflow-hidden shadow-2xl">
        {/* PAGE 1: WELCOME & PLAYER NAME */}
        {currentPage === 'welcome' && (
          <WelcomePage
            initialPlayerName={playerName}
            hasExistingSave={hasExistingSave}
            savedPetName={activePetData.customName || activePet.defaultName}
            unlockedBadgesCount={unlockedBadges.length}
            onOpenBadges={() => setCurrentPage('badges')}
            onResumeExisting={() => {
              setCurrentPage('game');
              saveToStorage({ currentPage: 'game' });
            }}
            onProceed={handleWelcomeProceed}
          />
        )}

        {/* PAGE 2: CHOOSE FROM 8 ANIMALS */}
        {currentPage === 'select_pet' && (
          <PetSelectPage
            playerName={playerName}
            petsProgress={petsProgress}
            selectedPetId={selectedPetId}
            onSelectPet={handleSelectPet}
            onOpenBadges={() => setCurrentPage('badges')}
            onBack={() => setCurrentPage('welcome')}
          />
        )}

        {/* STEP 2.5: NAME YOUR PET */}
        {currentPage === 'name_pet' && (
          <PetNamingPage
            selectedPetId={selectedPetId}
            currentPetName={activePetData.customName}
            playerName={playerName}
            onConfirmName={handleConfirmPetName}
            onBack={() => setCurrentPage('select_pet')}
          />
        )}

        {/* PAGE 3: THE MAIN FEEDING GAME */}
        {currentPage === 'game' && (
          <MagicPetFeeder
            playerName={playerName}
            petNickname={activePetData.customName}
            selectedPetId={selectedPetId}
            initialFeedCount={activePetData.feedCount}
            initialAccessories={activePetData.unlockedAccessories}
            unlockedBadges={unlockedBadges}
            playerStats={playerStats}
            onUpdateStats={handleUpdateStats}
            totalFeeds={totalFeeds}
            onUnlockBadge={handleUnlockBadge}
            onOpenBadges={() => setCurrentPage('badges')}
            onSwitchPet={() => setCurrentPage('select_pet')}
            onChangeProfile={() => setCurrentPage('welcome')}
            onSaveProgress={handleSaveGameProgress}
          />
        )}

        {/* PAGE 4: BADGES & TROPHIES ROOM */}
        {currentPage === 'badges' && (
          <BadgesPage
            unlockedBadges={unlockedBadges}
            playerStats={playerStats}
            totalFeeds={totalFeeds}
            petVoice={activePet.voice}
            onBack={() => setCurrentPage(activePetData.feedCount > 0 ? 'game' : 'select_pet')}
          />
        )}
      </div>
    </div>
  );
}
