import React, { useState, useEffect } from 'react';
import WelcomePage from './components/WelcomePage.jsx';
import PetSelectPage from './components/PetSelectPage.jsx';
import MagicPetFeeder from './components/MagicPetFeeder.jsx';
import { PETS } from './data/pets.js';

const STORAGE_KEY = 'magic_pet_feeder_save_v1';

export default function App() {
  // Saved profile and game state
  const [playerName, setPlayerName] = useState('Emma');
  const [petNickname, setPetNickname] = useState('Rexy');
  const [selectedPetId, setSelectedPetId] = useState('dino');
  const [feedCount, setFeedCount] = useState(0);
  const [unlockedAccessories, setUnlockedAccessories] = useState([]);

  // Navigation: 'welcome' | 'select_pet' | 'game'
  const [currentPage, setCurrentPage] = useState('welcome');
  const [hasExistingSave, setHasExistingSave] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved state from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && saved.playerName) {
          setPlayerName(saved.playerName);
          setPetNickname(saved.petNickname || '');
          setSelectedPetId(saved.selectedPetId || 'dino');
          setFeedCount(saved.feedCount || 0);
          setUnlockedAccessories(saved.unlockedAccessories || []);
          setHasExistingSave(true);

          // If the player had already begun playing, jump directly back into the game!
          if (saved.currentPage === 'game' || saved.feedCount > 0) {
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
        petNickname: updates.petNickname ?? petNickname,
        selectedPetId: updates.selectedPetId ?? selectedPetId,
        feedCount: updates.feedCount ?? feedCount,
        unlockedAccessories: updates.unlockedAccessories ?? unlockedAccessories,
        currentPage: updates.currentPage ?? currentPage,
        lastPlayed: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  };

  // Handler: Proceed from Welcome to Pet Selection
  const handleWelcomeProceed = (name, petName) => {
    setPlayerName(name);
    setPetNickname(petName);
    setCurrentPage('select_pet');
    saveToStorage({ playerName: name, petNickname: petName, currentPage: 'select_pet' });
  };

  // Handler: Resume existing game directly
  const handleResumeExisting = () => {
    setCurrentPage('game');
    saveToStorage({ currentPage: 'game' });
  };

  // Handler: Choose Pet and enter Game
  const handleSelectPet = (petId) => {
    setSelectedPetId(petId);
    setCurrentPage('game');
    saveToStorage({ selectedPetId: petId, currentPage: 'game' });
  };

  // Handler: In-game progress updates (feeds, accessories)
  const handleSaveProgress = ({ feedCount: newFeeds, unlockedAccessories: newAccs }) => {
    setFeedCount(newFeeds);
    setUnlockedAccessories(newAccs);
    saveToStorage({
      feedCount: newFeeds,
      unlockedAccessories: newAccs,
      currentPage: 'game',
    });
  };

  if (!isLoaded) {
    return (
      <div className="w-full min-h-screen bg-slate-900 flex items-center justify-center text-white font-bold text-lg">
        Loading Magic World...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full h-full max-w-md mx-auto relative overflow-hidden shadow-2xl">
        {/* PAGE 1: WELCOME & NAME ENTRY */}
        {currentPage === 'welcome' && (
          <WelcomePage
            initialPlayerName={playerName}
            initialPetName={petNickname}
            hasExistingSave={hasExistingSave}
            savedPetName={petNickname || 'Your pet'}
            onResumeExisting={handleResumeExisting}
            onProceed={handleWelcomeProceed}
          />
        )}

        {/* PAGE 2: MULTI-PET SELECTION */}
        {currentPage === 'select_pet' && (
          <PetSelectPage
            playerName={playerName}
            petNickname={petNickname}
            selectedPetId={selectedPetId}
            onSelectPet={handleSelectPet}
            onBack={() => setCurrentPage('welcome')}
          />
        )}

        {/* PAGE 3: MAIN FEEDING GAME */}
        {currentPage === 'game' && (
          <MagicPetFeeder
            playerName={playerName}
            petNickname={petNickname}
            selectedPetId={selectedPetId}
            initialFeedCount={feedCount}
            initialAccessories={unlockedAccessories}
            onSwitchPet={() => setCurrentPage('select_pet')}
            onChangeProfile={() => setCurrentPage('welcome')}
            onSaveProgress={handleSaveProgress}
          />
        )}
      </div>
    </div>
  );
}
