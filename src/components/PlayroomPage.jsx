import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User, Volume2, Sparkles, RefreshCw, Check, Star, Trophy, Search, Award } from 'lucide-react';
import PetAvatar from './PetAvatar.jsx';
import ActivityNavBar from './ActivityNavBar.jsx';
import { PETS } from '../data/pets.js';
import { ALL_LETTERS, ALL_NUMBERS, ALL_SHAPES, ALL_COLORS } from '../data/shapes.js';
import { sfx, speakPetText } from '../utils/audio.js';

// ==========================================
// 1. EDUCATIONAL PHONICS WORDS
// ==========================================
const SPELLING_WORDS = [
  { word: 'CAT', icon: '🐱', hint: 'C - A - T spells Cat!' },
  { word: 'SUN', icon: '☀️', hint: 'S - U - N spells Sun!' },
  { word: 'DOG', icon: '🐶', hint: 'D - O - G spells Dog!' },
  { word: 'STAR', icon: '⭐', hint: 'S - T - A - R spells Star!' },
  { word: 'FISH', icon: '🐟', hint: 'F - I - S - H spells Fish!' },
  { word: 'BIRD', icon: '🐦', hint: 'B - I - R - D spells Bird!' },
  { word: 'BALL', icon: '⚽', hint: 'B - A - L - L spells Ball!' },
  { word: 'DUCK', icon: '🦆', hint: 'D - U - C - K spells Duck!' },
];

// ==========================================
// 2. SHAPE & COLOR MATCH ITEMS & SVG RENDERER
// ==========================================
const SHAPE_ITEMS = [
  {
    id: 'yellow_star',
    shape: 'Star',
    color: 'Yellow',
    hex: '#FACC15',
    stroke: '#CA8A04',
    bg: 'bg-amber-400 border-amber-500 text-amber-950',
    description: 'Bright yellow 5-point star',
  },
  {
    id: 'blue_circle',
    shape: 'Circle',
    color: 'Blue',
    hex: '#3B82F6',
    stroke: '#1D4ED8',
    bg: 'bg-blue-500 border-blue-600 text-white',
    description: 'Round ocean blue circle',
  },
  {
    id: 'red_heart',
    shape: 'Heart',
    color: 'Red',
    hex: '#EF4444',
    stroke: '#B91C1C',
    bg: 'bg-rose-500 border-rose-600 text-white',
    description: 'Warm ruby red heart',
  },
  {
    id: 'green_triangle',
    shape: 'Triangle',
    color: 'Green',
    hex: '#10B981',
    stroke: '#047857',
    bg: 'bg-emerald-500 border-emerald-600 text-white',
    description: 'Emerald green triangle',
  },
  {
    id: 'purple_diamond',
    shape: 'Diamond',
    color: 'Purple',
    hex: '#A855F7',
    stroke: '#7E22CE',
    bg: 'bg-purple-500 border-purple-600 text-white',
    description: 'Sparkly purple diamond',
  },
  {
    id: 'orange_square',
    shape: 'Square',
    color: 'Orange',
    hex: '#F97316',
    stroke: '#C2410C',
    bg: 'bg-orange-500 border-orange-600 text-white',
    description: 'Sunny orange square',
  },
];

function GeometricShapeSvg({ shape, hex, stroke, size = 52, className = '' }) {
  switch (shape) {
    case 'Star':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={`filter drop-shadow-md transition-transform ${className}`}
        >
          <polygon
            points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36"
            fill={hex}
            stroke={stroke}
            strokeWidth="5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'Circle':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={`filter drop-shadow-md transition-transform ${className}`}
        >
          <circle
            cx="50"
            cy="50"
            r="42"
            fill={hex}
            stroke={stroke}
            strokeWidth="5"
          />
        </svg>
      );
    case 'Heart':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={`filter drop-shadow-md transition-transform ${className}`}
        >
          <path
            d="M50 88 C20 60 5 40 5 24 C5 10 16 2 28 2 C38 2 46 8 50 16 C54 8 62 2 72 2 C84 2 95 10 95 24 C95 40 80 60 50 88 Z"
            fill={hex}
            stroke={stroke}
            strokeWidth="5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'Triangle':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={`filter drop-shadow-md transition-transform ${className}`}
        >
          <polygon
            points="50,8 94,88 6,88"
            fill={hex}
            stroke={stroke}
            strokeWidth="5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'Diamond':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={`filter drop-shadow-md transition-transform ${className}`}
        >
          <polygon
            points="50,6 94,50 50,94 6,50"
            fill={hex}
            stroke={stroke}
            strokeWidth="5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'Square':
    default:
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={`filter drop-shadow-md transition-transform ${className}`}
        >
          <rect
            x="10"
            y="10"
            width="80"
            height="80"
            rx="12"
            fill={hex}
            stroke={stroke}
            strokeWidth="5"
          />
        </svg>
      );
  }
}

// Color palette for floating numbers
const NUMBER_PALETTE = [
  'from-rose-400 to-pink-500 border-rose-300 text-white',
  'from-sky-400 to-blue-500 border-sky-300 text-white',
  'from-emerald-400 to-teal-500 border-emerald-300 text-white',
  'from-purple-400 to-indigo-500 border-purple-300 text-white',
  'from-teal-400 to-cyan-500 border-teal-300 text-white',
  'from-fuchsia-400 to-pink-500 border-fuchsia-300 text-white',
];

// Helper: Generate Letter Detective swarm with multiple letters & numbers
function generateDetectiveRound() {
  const targetLetter = ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];
  
  // Pick 7 distinct decoy letters from the alphabet so kids must scan multiple letters!
  const otherLetters = ALL_LETTERS.filter((l) => l !== targetLetter);
  const pickedDecoyLetters = [...otherLetters].sort(() => 0.5 - Math.random()).slice(0, 7);

  // Pick 7 numbers to mix into the floating swarm
  const pickedNumbers = [...ALL_NUMBERS].sort(() => 0.5 - Math.random()).slice(0, 7);

  const rawList = [
    { type: 'letter', value: targetLetter, isTarget: true },
    ...pickedDecoyLetters.map((l) => ({ type: 'letter', value: l, isTarget: false })),
    ...pickedNumbers.map((n) => ({ type: 'number', value: n, isTarget: false })),
  ];

  // Shuffle all items so target letter has no predictable position or index
  const shuffled = rawList.sort(() => 0.5 - Math.random());

  const items = shuffled.map((item, idx) => {
    const col = idx % 4;
    const row = Math.floor(idx / 4);
    const baseX = 14 + col * 23 + (Math.random() - 0.5) * 6;
    const baseY = 14 + row * 21 + (Math.random() - 0.5) * 6;

    const vxDir = (idx % 2 === 0 ? 1 : -1) * (0.16 + Math.random() * 0.16);
    const vyDir = (idx % 3 === 0 ? 1 : -1) * (0.16 + Math.random() * 0.16);

    return {
      id: `${item.type}_${item.value}_${idx}`,
      type: item.type,
      value: item.value,
      isTarget: item.isTarget,
      x: Math.max(10, Math.min(90, baseX)),
      y: Math.max(12, Math.min(88, baseY)),
      vx: vxDir,
      vy: vyDir,
      // Uniform styling for ALL letters and numbers without giving away the target letter
      color: `${NUMBER_PALETTE[idx % NUMBER_PALETTE.length]} shadow-md font-black`,
    };
  });

  return { targetLetter, items };
}

export default function PlayroomPage({
  playerName,
  petNickname,
  selectedPetId,
  stageIndex = 1,
  feedCount = 5,
  unlockedAccessories = [],
  unlockedBadges = [],
  playerStats = {},
  audioLanguage = 'en',
  onToggleLanguage,
  onUpdateStats,
  onUnlockBadge,
  onNavigate,
  onSwitchPet,
  onChangeProfile,
}) {
  const currentPet = PETS.find((p) => p.id === selectedPetId) || PETS[0];
  const petDisplayName = petNickname || currentPet.defaultName;

  // Active Educational Game: 'detective' | 'word' | 'count' | 'shape' | 'ball'
  const [activeGame, setActiveGame] = useState('detective');

  // Overall Learning Stars & Celebrations
  const [learningStars, setLearningStars] = useState(0);
  const [petExpression, setPetExpression] = useState('idle');
  const [petSparkle, setPetSparkle] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');

  // -------------------------------------------------------------
  // GAME 1: LETTER DETECTIVE (Find letter among moving numbers)
  // -------------------------------------------------------------
  const [detectiveData, setDetectiveData] = useState(() => generateDetectiveRound());
  const [detectiveFoundCount, setDetectiveFoundCount] = useState(0);

  // -------------------------------------------------------------
  // GAME 2: WORD SPELLER & PHONICS
  // -------------------------------------------------------------
  const [wordRoundIndex, setWordRoundIndex] = useState(0);
  const activeWordObj = SPELLING_WORDS[wordRoundIndex % SPELLING_WORDS.length];
  const [spelledLetters, setSpelledLetters] = useState([]);
  const [wordBubbles, setWordBubbles] = useState([]);

  // -------------------------------------------------------------
  // GAME 3: NUMBER COUNTING SEQUENCE (1 to 5)
  // -------------------------------------------------------------
  const [countTarget, setCountTarget] = useState(1);
  const [countBalloons, setCountBalloons] = useState(() => [
    { num: 1, color: 'bg-rose-400 border-rose-500', x: 22, y: 26, popped: false },
    { num: 2, color: 'bg-amber-400 border-amber-500', x: 78, y: 24, popped: false },
    { num: 3, color: 'bg-emerald-400 border-emerald-500', x: 25, y: 68, popped: false },
    { num: 4, color: 'bg-sky-400 border-sky-500', x: 75, y: 66, popped: false },
    { num: 5, color: 'bg-purple-400 border-purple-500', x: 50, y: 22, popped: false },
  ]);

  // -------------------------------------------------------------
  // GAME 4: SHAPE & COLOR MATCH
  // -------------------------------------------------------------
  const [shapeTarget, setShapeTarget] = useState(() => SHAPE_ITEMS[0]);
  const [shapeItemsList, setShapeItemsList] = useState(() =>
    SHAPE_ITEMS.map((item, idx) => ({
      ...item,
      x: 20 + (idx % 3) * 30,
      y: 22 + Math.floor(idx / 3) * 38,
      matched: false,
    }))
  );

  // -------------------------------------------------------------
  // GAME 5: BOUNCY BEACH BALL CATCH
  // -------------------------------------------------------------
  const [ballCatches, setBallCatches] = useState(0);
  const [ballPos, setBallPos] = useState({ x: 50, y: 68 });
  const [isBallFlying, setIsBallFlying] = useState(false);
  
  // Animation Frame ref for continuous smooth drifting of moving items
  const animFrameRef = useRef(null);
  const detectiveItemsRef = useRef(detectiveData.items);
  const detectiveItemEls = useRef({});

  useEffect(() => {
    detectiveItemsRef.current = detectiveData.items;
  }, [detectiveData]);

  // Auto-speak on game change or shape target change
  const lastSpokenGameRef = useRef('');
  useEffect(() => {
    const speakKey = activeGame === 'shape' ? `shape_${shapeTarget.id}` : activeGame;
    if (lastSpokenGameRef.current === speakKey) return;
    lastSpokenGameRef.current = speakKey;

    const timer = setTimeout(() => {
      if (activeGame === 'detective') {
        speakPetText(
          `Detective ${playerName}! Search through all the moving letters and numbers to find letter ${detectiveData.targetLetter}!`,
          currentPet.voice
        );
      } else if (activeGame === 'word') {
        speakPetText(
          `Let's spell the word ${activeWordObj.word}! Find letter ${activeWordObj.word[spelledLetters.length]}!`,
          currentPet.voice
        );
      } else if (activeGame === 'count') {
        speakPetText(
          `Pop the number balloons in order from 1 to 5! Tap number ${countTarget}!`,
          currentPet.voice
        );
      } else if (activeGame === 'shape') {
        speakPetText(
          `Shape and Color Match! Find the ${shapeTarget.color} ${shapeTarget.shape}! Tap the floating ${shapeTarget.color} ${shapeTarget.shape} to collect it in the toy box!`,
          currentPet.voice
        );
      } else if (activeGame === 'ball') {
        speakPetText(
          `Tap the beach ball to play catch with ${petDisplayName}!`,
          currentPet.voice
        );
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [activeGame, playerName, petDisplayName, currentPet.voice, detectiveData.targetLetter, activeWordObj.word, spelledLetters.length, countTarget, shapeTarget.id, shapeTarget.color, shapeTarget.shape]);

  // Continuous smooth physics loop for Letter Detective moving numbers (60 FPS direct DOM update, 0 React re-renders)
  useEffect(() => {
    if (activeGame !== 'detective') return;

    let isRunning = true;

    const updatePhysics = () => {
      if (!isRunning) return;

      const items = detectiveItemsRef.current;
      if (items && items.length > 0) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          let nx = item.x + item.vx;
          let ny = item.y + item.vy;
          let nvx = item.vx;
          let nvy = item.vy;

          // Bounce off left/right bounds inside playable box
          if (nx <= 8) {
            nx = 8;
            nvx = Math.abs(nvx);
          } else if (nx >= 92) {
            nx = 92;
            nvx = -Math.abs(nvx);
          }

          // Bounce off top/bottom bounds inside playable box
          if (ny <= 10) {
            ny = 10;
            nvy = Math.abs(nvy);
          } else if (ny >= 90) {
            ny = 90;
            nvy = -Math.abs(nvy);
          }

          item.x = nx;
          item.y = ny;
          item.vx = nvx;
          item.vy = nvy;

          const el = detectiveItemEls.current[item.id];
          if (el) {
            el.style.left = `${nx}%`;
            el.style.top = `${ny}%`;
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeGame]);

  // Setup Word Speller bubbles when round changes
  useEffect(() => {
    if (activeGame !== 'word') return;

    const neededLetters = activeWordObj.word.split('');
    const extraDecoys = ['A', 'B', 'M', 'S', 'T', 'O', 'P'].filter(
      (l) => !neededLetters.includes(l)
    );
    const bubbleLetters = [
      ...neededLetters,
      extraDecoys[0] || 'X',
      extraDecoys[1] || 'Z',
    ].sort(() => 0.5 - Math.random());

    const positions = [
      { x: 20, y: 22 },
      { x: 50, y: 18 },
      { x: 80, y: 22 },
      { x: 22, y: 70 },
      { x: 78, y: 70 },
      { x: 50, y: 74 },
    ];

    setWordBubbles(
      bubbleLetters.map((char, i) => ({
        id: `wb_${char}_${i}`,
        letter: char,
        x: positions[i % positions.length].x,
        y: positions[i % positions.length].y,
        color: NUMBER_PALETTE[i % NUMBER_PALETTE.length],
      }))
    );
    setSpelledLetters([]);
  }, [wordRoundIndex, activeGame, activeWordObj.word]);

  // -------------------------------------------------------------
  // HANDLERS FOR GAME 1: LETTER DETECTIVE
  // -------------------------------------------------------------
  const handleTapDetectiveItem = (item) => {
    if (item.isTarget) {
      // Correct target letter!
      sfx.sparkle();
      sfx.fanfare();
      setPetExpression('happy');
      setPetSparkle(true);
      setCelebrationMessage(`🎉 Found Letter ${item.value}! Super Detective!`);

      const nextStars = learningStars + 1;
      setLearningStars(nextStars);
      setDetectiveFoundCount((c) => c + 1);

      // Update global learning stats
      if (onUpdateStats) {
        onUpdateStats((prev) => ({
          ...prev,
          lettersFed: (prev.lettersFed || 0) + 1,
          starsCounted: (prev.starsCounted || 0) + 1,
        }));
      }

      // Check badge unlock for 12 letters
      if ((playerStats.lettersFed || 0) + 1 >= 12 && !unlockedBadges.includes('alphabet_champ')) {
        if (onUnlockBadge) onUnlockBadge('alphabet_champ');
        speakPetText(`Incredible! You earned the Alphabet Master trophy!`, currentPet.voice);
      } else {
        speakPetText(
          `Hooray! You found letter ${item.value}! You're an amazing detective, ${playerName}!`,
          currentPet.voice
        );
      }

      // Next detective round after short celebration
      setTimeout(() => {
        setDetectiveData(generateDetectiveRound());
        setPetExpression('idle');
        setPetSparkle(false);
        setCelebrationMessage('');
      }, 1300);
    } else if (item.type === 'number') {
      // Tapped a number
      sfx.bounce();
      sfx.squeak();
      setPetExpression('hungry');
      speakPetText(
        `That's the number ${item.value}! Keep looking for the letter ${detectiveData.targetLetter}!`,
        currentPet.voice
      );
      setTimeout(() => setPetExpression('idle'), 600);
    } else {
      // Tapped a decoy letter
      sfx.pop();
      speakPetText(
        `That's letter ${item.value}! We are searching for letter ${detectiveData.targetLetter}!`,
        currentPet.voice
      );
    }
  };

  // -------------------------------------------------------------
  // HANDLERS FOR GAME 2: WORD SPELLER
  // -------------------------------------------------------------
  const handleTapWordBubble = (bubble) => {
    const nextNeededLetter = activeWordObj.word[spelledLetters.length];

    if (bubble.letter === nextNeededLetter) {
      sfx.chime(spelledLetters.length + 1);
      setPetExpression('happy');

      const nextSpelled = [...spelledLetters, bubble.letter];
      setSpelledLetters(nextSpelled);

      // Phonics sound praise
      speakPetText(`${bubble.letter}! Great job!`, currentPet.voice);

      // Remove the clicked bubble
      setWordBubbles((prev) => prev.filter((b) => b.id !== bubble.id));

      if (nextSpelled.length === activeWordObj.word.length) {
        // Complete word spelled!
        setTimeout(() => {
          sfx.sparkle();
          sfx.fanfare();
          setPetSparkle(true);
          setCelebrationMessage(`🌟 Spelled ${activeWordObj.word}!`);
          setLearningStars((s) => s + 2);

          speakPetText(
            `${activeWordObj.hint} You're a spelling superstar, ${playerName}!`,
            currentPet.voice
          );

          if (onUpdateStats) {
            onUpdateStats((prev) => ({
              ...prev,
              lettersFed: (prev.lettersFed || 0) + nextSpelled.length,
              starsCounted: (prev.starsCounted || 0) + 2,
            }));
          }

          setTimeout(() => {
            setWordRoundIndex((idx) => idx + 1);
            setPetSparkle(false);
            setPetExpression('idle');
            setCelebrationMessage('');
          }, 1800);
        }, 300);
      } else {
        setTimeout(() => setPetExpression('idle'), 400);
      }
    } else {
      sfx.squeak();
      speakPetText(
        `That's letter ${bubble.letter}! Find letter ${nextNeededLetter} to spell ${activeWordObj.word}!`,
        currentPet.voice
      );
    }
  };

  // -------------------------------------------------------------
  // HANDLERS FOR GAME 3: NUMBER COUNTING (1 to 5)
  // -------------------------------------------------------------
  const handleTapCountBalloon = (balloon) => {
    if (balloon.popped) return;

    if (balloon.num === countTarget) {
      sfx.bubblePop();
      setPetExpression('happy');

      setCountBalloons((prev) =>
        prev.map((b) => (b.num === balloon.num ? { ...b, popped: true } : b))
      );

      const countWords = ['One', 'Two', 'Three', 'Four', 'Five'];
      const spokenNum = countWords[balloon.num - 1] || balloon.num;
      speakPetText(`${spokenNum}!`, currentPet.voice);

      const nextTarget = countTarget + 1;
      setCountTarget(nextTarget);

      if (nextTarget > 5) {
        // All 5 balloons popped in order!
        setTimeout(() => {
          sfx.fanfare();
          sfx.sparkle();
          setPetSparkle(true);
          setCelebrationMessage('🎈 Counted 1 to 5 Champion!');
          setLearningStars((s) => s + 1);

          speakPetText(
            `One, Two, Three, Four, Five! You counted all 5 balloons, ${playerName}!`,
            currentPet.voice
          );

          if (onUpdateStats) {
            onUpdateStats((prev) => ({
              ...prev,
              numbersFed: (prev.numbersFed || 0) + 5,
              starsCounted: (prev.starsCounted || 0) + 1,
            }));
          }

          setTimeout(() => {
            setCountTarget(1);
            setCountBalloons((prev) => prev.map((b) => ({ ...b, popped: false })));
            setPetSparkle(false);
            setPetExpression('idle');
            setCelebrationMessage('');
          }, 1800);
        }, 350);
      } else {
        setTimeout(() => setPetExpression('idle'), 350);
      }
    } else {
      sfx.bounce();
      speakPetText(
        `That's number ${balloon.num}! Find number ${countTarget} first!`,
        currentPet.voice
      );
    }
  };

  // -------------------------------------------------------------
  // HANDLERS FOR GAME 4: SHAPE & COLOR MATCH
  // -------------------------------------------------------------
  const handleTapShapeItem = (item) => {
    if (item.matched) return;

    if (item.id === shapeTarget.id) {
      sfx.pop();
      sfx.sparkle();
      setPetExpression('happy');
      setPetSparkle(true);
      setCelebrationMessage(`💎 Found ${shapeTarget.color} ${shapeTarget.shape}!`);
      setLearningStars((s) => s + 1);

      speakPetText(
        `Yes! You found the ${shapeTarget.color} ${shapeTarget.shape}! Into the toy box!`,
        currentPet.voice
      );

      setShapeItemsList((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, matched: true } : it))
      );

      if (onUpdateStats) {
        onUpdateStats((prev) => ({
          ...prev,
          shapesFed: (prev.shapesFed || 0) + 1,
          starsCounted: (prev.starsCounted || 0) + 1,
        }));
      }

      // Check badge for shapes
      if ((playerStats.shapesFed || 0) + 1 >= 12 && !unlockedBadges.includes('shape_master')) {
        if (onUnlockBadge) onUnlockBadge('shape_master');
      }

      setTimeout(() => {
        // Pick next unmatched shape
        const remaining = SHAPE_ITEMS.filter((s) => s.id !== shapeTarget.id);
        const nextShape = remaining[Math.floor(Math.random() * remaining.length)] || SHAPE_ITEMS[0];
        setShapeTarget(nextShape);
        setShapeItemsList(
          SHAPE_ITEMS.map((it, idx) => ({
            ...it,
            x: 20 + (idx % 3) * 30,
            y: 22 + Math.floor(idx / 3) * 38,
            matched: false,
          }))
        );
        setPetSparkle(false);
        setPetExpression('idle');
        setCelebrationMessage('');
        speakPetText(
          `Now find the ${nextShape.color} ${nextShape.shape}! Tap the ${nextShape.color} ${nextShape.shape}!`,
          currentPet.voice
        );
      }, 1500);
    } else {
      sfx.squeak();
      speakPetText(
        `That is the ${item.color} ${item.shape}! Look for the ${shapeTarget.color} ${shapeTarget.shape}!`,
        currentPet.voice
      );
    }
  };

  // -------------------------------------------------------------
  // HANDLERS FOR GAME 5: BOUNCY BALL CATCH
  // -------------------------------------------------------------
  const handleThrowBall = useCallback(() => {
    if (isBallFlying) return;
    setIsBallFlying(true);
    sfx.bounce();
    setPetExpression('happy');

    setBallPos({ x: 50, y: 28 });

    setTimeout(() => {
      sfx.squeak();
      setBallPos({ x: 50, y: 68 });
      setIsBallFlying(false);

      const nextCatches = ballCatches + 1;
      setBallCatches(nextCatches);

      const nextBounces = (playerStats.ballsBounced || 0) + 1;
      if (onUpdateStats) {
        onUpdateStats((prev) => ({
          ...prev,
          ballsBounced: nextBounces,
        }));
      }

      if (nextBounces >= 10 && !unlockedBadges.includes('ball_juggler')) {
        if (onUnlockBadge) onUnlockBadge('ball_juggler');
        sfx.fanfare();
        speakPetText(`Incredible! You earned the Ball Juggler trophy!`, currentPet.voice);
      } else {
        const praises = ['Awesome catch!', 'Wheee!', 'Bounce bounce!'];
        speakPetText(praises[Math.floor(Math.random() * praises.length)], currentPet.voice);
      }

      setTimeout(() => setPetExpression('idle'), 400);
    }, 450);
  }, [isBallFlying, ballCatches, currentPet, playerStats, onUpdateStats, unlockedBadges, onUnlockBadge]);

  // Voice replay button
  const handleReplayPrompt = () => {
    sfx.pop();
    if (activeGame === 'detective') {
      speakPetText(
        `Detective ${playerName}! Search through all the moving letters and numbers to spot letter ${detectiveData.targetLetter}!`,
        currentPet.voice
      );
    } else if (activeGame === 'word') {
      speakPetText(
        `We are spelling ${activeWordObj.word}! Find the letter ${activeWordObj.word[spelledLetters.length]}!`,
        currentPet.voice
      );
    } else if (activeGame === 'count') {
      speakPetText(
        `Pop balloons in order from 1 to 5! Tap number ${countTarget}!`,
        currentPet.voice
      );
    } else if (activeGame === 'shape') {
      speakPetText(
        `We are looking for the ${shapeTarget.color} ${shapeTarget.shape}! Look around the play box and tap the ${shapeTarget.color} ${shapeTarget.shape} to collect it in the toy box!`,
        currentPet.voice
      );
    } else if (activeGame === 'ball') {
      speakPetText(
        `Tap the beach ball to play catch with ${petDisplayName}!`,
        currentPet.voice
      );
    }
  };

  return (
    <div
      className="relative w-full h-full max-h-[100dvh] bg-gradient-to-b from-teal-200 via-sky-100 to-emerald-200 flex flex-col justify-between items-center px-2 py-1 sm:px-4 sm:py-2.5 select-none overflow-hidden font-sans"
      style={{ touchAction: 'manipulation' }}
    >
      {/* Top Header */}
      <header className="w-full max-w-md flex items-center justify-between px-1 pt-0.5 z-20 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onChangeProfile}
            className="flex items-center gap-1 bg-white/90 px-2.5 py-1 rounded-full text-xs font-bold text-indigo-900 border border-indigo-200 shadow-sm active:scale-95"
          >
            <User className="w-3.5 h-3.5 text-indigo-600" />
            <span>{playerName}</span>
          </button>
          <button
            type="button"
            onClick={onSwitchPet}
            className="flex items-center gap-1 bg-white/90 px-2.5 py-1 rounded-full text-xs font-bold text-emerald-900 border border-emerald-200 shadow-sm active:scale-95"
          >
            <span>{currentPet.icon}</span>
            <span>{petDisplayName}</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-white/95 px-2.5 py-1 rounded-full shadow-md border-2 border-amber-300 animate-pulse">
            <span className="text-sm">⭐</span>
            <span className="text-xs font-black text-amber-900">
              {learningStars}
            </span>
          </div>
        </div>
      </header>

      {/* Educational Mission Card */}
      <section className="w-full max-w-md my-0.5 z-20 flex-shrink-0">
        <div className="bg-white/95 rounded-2xl p-2 sm:p-2.5 shadow-lg border-2 border-teal-400 flex items-center justify-between gap-2">
          <div className="flex-1 text-left">
            {activeGame === 'detective' && (
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs">🔍</span>
                  <p className="text-[10px] font-black uppercase tracking-wider text-teal-700">
                    Letter Detective:
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs sm:text-sm font-black text-slate-800">
                    Find Letter:
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-teal-500 text-white font-black text-base sm:text-lg shadow-sm border border-teal-600">
                    {detectiveData.targetLetter}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold hidden sm:inline">
                    (hidden among moving letters & numbers!)
                  </span>
                </div>
              </div>
            )}

            {activeGame === 'word' && (
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs">{activeWordObj.icon}</span>
                  <p className="text-[10px] font-black uppercase tracking-wider text-purple-700">
                    Phonics Speller:
                  </p>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {activeWordObj.word.split('').map((char, idx) => {
                    const isFilled = idx < spelledLetters.length;
                    const isNext = idx === spelledLetters.length;
                    return (
                      <span
                        key={idx}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-black text-sm sm:text-base border-2 transition-all ${
                          isFilled
                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                            : isNext
                            ? 'bg-amber-300 text-amber-950 border-amber-400 ring-2 ring-amber-300 animate-pulse'
                            : 'bg-slate-100 text-slate-400 border-slate-200'
                        }`}
                      >
                        {isFilled ? char : isNext ? '?' : '_'}
                      </span>
                    );
                  })}
                  <span className="text-[11px] font-extrabold text-purple-900 ml-1">
                    {activeWordObj.hint}
                  </span>
                </div>
              </div>
            )}

            {activeGame === 'count' && (
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs">🔢</span>
                  <p className="text-[10px] font-black uppercase tracking-wider text-sky-700">
                    Number Counting:
                  </p>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-xs sm:text-sm font-black text-slate-800 mr-1">
                    Pop Next:
                  </span>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-black text-xs border ${
                        n < countTarget
                          ? 'bg-emerald-500 text-white border-emerald-600'
                          : n === countTarget
                          ? 'bg-amber-400 text-amber-950 border-amber-500 ring-2 ring-amber-300 animate-bounce'
                          : 'bg-slate-200 text-slate-500 border-slate-300'
                      }`}
                    >
                      {n < countTarget ? '✓' : n}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeGame === 'shape' && (
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs">🎨</span>
                  <p className="text-[10px] font-black uppercase tracking-wider text-purple-700">
                    Shape & Color Match:
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                  <span className="text-xs sm:text-sm font-black text-slate-800">
                    Find:
                  </span>
                  <span className={`px-2.5 py-1 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-sm border-2 ${shapeTarget.bg}`}>
                    <GeometricShapeSvg
                      shape={shapeTarget.shape}
                      hex={shapeTarget.hex}
                      stroke={shapeTarget.stroke}
                      size={20}
                    />
                    <span>
                      {shapeTarget.color} {shapeTarget.shape}
                    </span>
                  </span>
                  <span className="text-[10px] font-black text-slate-800 bg-white/95 px-2 py-0.5 rounded-full border border-slate-300 shadow-sm flex items-center gap-1">
                    <span>👉</span>
                    <span>Tap the floating {shapeTarget.color.toLowerCase()} {shapeTarget.shape.toLowerCase()}!</span>
                  </span>
                </div>
              </div>
            )}

            {activeGame === 'ball' && (
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs">⚽</span>
                  <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                    Beach Ball Catch:
                  </p>
                </div>
                <p className="text-xs sm:text-sm font-black text-slate-800 mt-0.5">
                  Toss Ball to {petDisplayName}! ({ballCatches} Catches)
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleReplayPrompt}
            className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-tr from-teal-400 to-emerald-300 rounded-xl shadow-md border border-teal-500 flex items-center justify-center text-teal-950 active:scale-90 flex-shrink-0"
            title="Hear instructions again"
          >
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* DEDICATED PLAYABLE GAME BOX                                   */}
      {/* 100% Unobstructed, high contrast, clean interactive arena     */}
      {/* ------------------------------------------------------------- */}
      <main className="relative flex-1 min-h-[210px] max-h-[360px] w-full max-w-sm sm:max-w-md my-1 bg-gradient-to-b from-sky-50/95 via-white to-teal-50/90 rounded-3xl border-4 border-teal-400 shadow-xl overflow-hidden flex flex-col items-center justify-center p-2 z-10 select-none">
        {/* Subtle decorative playful arena pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#0d9488_1.5px,transparent_1.5px)] [background-size:16px_16px]" />

        {/* Play arena badge */}
        <div className="absolute top-2 left-2.5 px-2 py-0.5 rounded-full bg-teal-100/90 border border-teal-300 text-[10px] font-black text-teal-800 flex items-center gap-1 pointer-events-none z-10">
          <span>🎮</span>
          <span className="uppercase tracking-wider">Play Box</span>
        </div>

        {/* Big Celebration Banner */}
        {celebrationMessage && (
          <div className="absolute top-2 z-40 px-4 py-1.5 bg-white/95 border-2 border-amber-400 rounded-full shadow-2xl text-amber-950 font-black text-xs sm:text-sm animate-bounce flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{celebrationMessage}</span>
          </div>
        )}

        {/* Floating Sparkles on Win */}
        {petSparkle && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 animate-pulse">
            <span className="text-4xl animate-bounce">🎉</span>
            <span className="text-4xl -mt-16 ml-14 animate-ping">✨</span>
            <span className="text-4xl mt-20 -ml-16 animate-bounce">🌟</span>
            <span className="text-3xl -mt-12 -ml-18 animate-ping">💖</span>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* GAME 1: LETTER DETECTIVE (Swarm of Moving Numbers + Letter)   */}
        {/* ------------------------------------------------------------- */}
        {activeGame === 'detective' && (
          <div className="absolute inset-0 z-20 pointer-events-auto">
            {detectiveData.items.map((item) => (
              <button
                key={item.id}
                ref={(el) => {
                  if (el) detectiveItemEls.current[item.id] = el;
                }}
                type="button"
                onClick={() => handleTapDetectiveItem(item)}
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-gradient-to-tr ${item.color} border-2 flex items-center justify-center text-lg sm:text-xl active:scale-125 transition-transform duration-100 select-none cursor-pointer drop-shadow-md`}
              >
                <span>{item.value}</span>
              </button>
            ))}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* GAME 2: PHONICS WORD SPELLER BUBBLES                          */}
        {/* ------------------------------------------------------------- */}
        {activeGame === 'word' && (
          <div className="absolute inset-0 z-20 pointer-events-auto">
            {wordBubbles.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => handleTapWordBubble(b)}
                style={{
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr ${b.color} border-2 flex items-center justify-center text-xl sm:text-2xl font-black active:scale-130 transition-transform select-none cursor-pointer drop-shadow-lg animate-float`}
              >
                <span>{b.letter}</span>
              </button>
            ))}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* GAME 3: NUMBER COUNTING BALLOONS (1 to 5)                    */}
        {/* ------------------------------------------------------------- */}
        {activeGame === 'count' && (
          <div className="absolute inset-0 z-20 pointer-events-auto">
            {countBalloons.map(
              (b) =>
                !b.popped && (
                  <button
                    key={b.num}
                    type="button"
                    onClick={() => handleTapCountBalloon(b)}
                    style={{
                      left: `${b.x}%`,
                      top: `${b.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className={`absolute w-12 h-15 sm:w-14 sm:h-17 rounded-full ${b.color} border-2 text-white shadow-xl flex flex-col items-center justify-center text-xl sm:text-2xl font-black active:scale-130 transition-transform animate-float select-none cursor-pointer`}
                  >
                    <span>{b.num}</span>
                    <div className="w-1 h-2 bg-white/70 rounded-full mt-0.5" />
                  </button>
                )
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* GAME 4: SHAPE & COLOR TOY BOX                                 */}
        {/* ------------------------------------------------------------- */}
        {activeGame === 'shape' && (
          <div className="absolute inset-0 z-20 pointer-events-auto">
            {shapeItemsList.map(
              (item) =>
                !item.matched && (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTapShapeItem(item)}
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className="absolute p-2 bg-transparent border-0 outline-none flex items-center justify-center cursor-pointer active:scale-135 hover:scale-120 transition-transform animate-float select-none group"
                    title={`${item.color} ${item.shape}`}
                  >
                    <GeometricShapeSvg
                      shape={item.shape}
                      hex={item.hex}
                      stroke={item.stroke}
                      size={54}
                      className="group-hover:rotate-6 group-active:scale-110"
                    />
                  </button>
                )
            )}

            {/* Toy Box graphic on the floor */}
            <div className="absolute right-2.5 bottom-2.5 bg-gradient-to-tr from-amber-600 to-amber-700 text-white rounded-2xl px-3 py-1.5 shadow-lg border-2 border-amber-300 flex items-center gap-2 z-20">
              <span className="text-2xl animate-bounce">📦</span>
              <div className="text-left leading-tight">
                <p className="text-[9px] font-bold text-amber-200 uppercase tracking-wide">Put in Toy Box:</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <GeometricShapeSvg
                    shape={shapeTarget.shape}
                    hex={shapeTarget.hex}
                    stroke={shapeTarget.stroke}
                    size={20}
                  />
                  <span className="text-xs font-black text-white">
                    {shapeTarget.color} {shapeTarget.shape}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* GAME 5: BOUNCY BEACH BALL                                     */}
        {/* ------------------------------------------------------------- */}
        {activeGame === 'ball' && (
          <button
            type="button"
            onClick={handleThrowBall}
            style={{
              left: `${ballPos.x}%`,
              top: `${ballPos.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className={`absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-2xl flex items-center justify-center border-4 border-amber-300 z-30 cursor-pointer active:scale-90 transition-all duration-300 ${
              isBallFlying ? 'animate-spin scale-110' : 'animate-bounce'
            }`}
            title="Toss Ball to Pet!"
          >
            <div className="w-full h-full rounded-full overflow-hidden relative bg-gradient-to-tr from-rose-400 via-amber-300 to-sky-400 flex items-center justify-center">
              <span className="text-3xl filter drop-shadow">⚽</span>
            </div>
          </button>
        )}
      </main>

      {/* ------------------------------------------------------------- */}
      {/* PEEKING PET SHELF (Looking Up into Playable Box from Bottom)  */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full max-w-sm sm:max-w-md flex items-center justify-between px-2 -mt-1 mb-1 z-20 flex-shrink-0">
        {/* Interactive Speech Bubble Cheering Player */}
        <div className="flex-1 mr-2 bg-white/95 rounded-2xl rounded-br-sm px-3 py-1.5 shadow-md border-2 border-teal-300 text-left transition-all">
          <p className="text-[10px] font-black text-teal-800 uppercase tracking-wider flex items-center gap-1">
            <span>{currentPet.icon}</span>
            <span>{petDisplayName}</span>
          </p>
          <p className="text-xs font-black text-slate-800 leading-tight mt-0.5 truncate sm:whitespace-normal">
            {petExpression === 'happy'
              ? '🌟 Great job! You found it!'
              : activeGame === 'detective'
              ? `Find letter ${detectiveData.targetLetter} in the box!`
              : activeGame === 'word'
              ? `Look for letter ${activeWordObj.word[spelledLetters.length]}!`
              : activeGame === 'count'
              ? `Pop balloon #${countTarget} next!`
              : activeGame === 'shape'
              ? `Find and tap the ${shapeTarget.color} ${shapeTarget.shape}! 🎨`
              : `Tap ball to play catch with me! ⚽`}
          </p>
        </div>

        {/* Peeking Pet Avatar - resting paws on ledge, looking up */}
        <div
          onClick={() => {
            sfx.squeak();
            setPetSparkle(true);
            setPetExpression('happy');
            setTimeout(() => {
              setPetSparkle(false);
              setPetExpression('idle');
            }, 1000);
          }}
          className="relative flex flex-col items-center justify-end cursor-pointer group active:scale-95 transition-transform flex-shrink-0"
          title={`Tap ${petDisplayName} to cheer!`}
        >
          {/* Peeking Avatar window - top half visible, looking up into box */}
          <div className="w-24 h-18 sm:w-28 sm:h-20 overflow-hidden flex items-start justify-center relative">
            <div className="transform scale-[0.58] sm:scale-[0.66] origin-top -mt-2.5">
              <PetAvatar
                petId={currentPet.id}
                stageIndex={stageIndex}
                feedCount={feedCount}
                expression={petExpression}
                accessories={unlockedAccessories}
              />
            </div>
          </div>

          {/* Cute Ledge Border with Front Paws */}
          <div className="relative -mt-2 w-24 sm:w-28 h-2.5 bg-gradient-to-r from-teal-400 via-teal-300 to-teal-400 rounded-full shadow-md flex items-center justify-center gap-6 z-30">
            {/* Cute Front Paws Over Ledge */}
            <div
              className="w-4 h-3 rounded-full border-2 border-teal-800 shadow-sm -mt-1 transition-transform group-hover:-translate-y-0.5"
              style={{ backgroundColor: currentPet.themeColor || '#10B981' }}
            />
            <div
              className="w-4 h-3 rounded-full border-2 border-teal-800 shadow-sm -mt-1 transition-transform group-hover:-translate-y-0.5"
              style={{ backgroundColor: currentPet.themeColor || '#10B981' }}
            />
          </div>
          <span className="text-[9px] font-extrabold text-teal-800 mt-0.5">
            Tap to pet! ✨
          </span>
        </div>
      </div>

      {/* Mode Switcher Dock (5 Learning Modes) */}
      <footer className="w-full max-w-md flex flex-col gap-1 z-20 pb-0.5 flex-shrink-0">

        {/* 5 Educational Game Tabs */}
        <div className="flex items-center justify-between gap-1 bg-white/95 rounded-2xl p-1 shadow-md border-2 border-teal-300">
          {/* 1. Letter Detective */}
          <button
            type="button"
            onClick={() => {
              sfx.pop();
              setActiveGame('detective');
            }}
            className={`flex-1 flex flex-col items-center py-1 px-0.5 rounded-xl transition-all active:scale-95 ${
              activeGame === 'detective'
                ? 'bg-amber-400 text-amber-950 font-black shadow-md ring-2 ring-amber-300 scale-102'
                : 'bg-slate-100 text-slate-700 font-bold hover:bg-slate-200'
            }`}
          >
            <span className="text-base sm:text-lg">🔍</span>
            <span className="text-[9px] leading-tight mt-0.5 font-extrabold">Letters</span>
          </button>

          {/* 2. Word Speller */}
          <button
            type="button"
            onClick={() => {
              sfx.pop();
              setActiveGame('word');
            }}
            className={`flex-1 flex flex-col items-center py-1 px-0.5 rounded-xl transition-all active:scale-95 ${
              activeGame === 'word'
                ? 'bg-purple-500 text-white font-black shadow-md ring-2 ring-purple-300 scale-102'
                : 'bg-slate-100 text-slate-700 font-bold hover:bg-slate-200'
            }`}
          >
            <span className="text-base sm:text-lg">🔤</span>
            <span className="text-[9px] leading-tight mt-0.5 font-extrabold">Words</span>
          </button>

          {/* 3. Number Count */}
          <button
            type="button"
            onClick={() => {
              sfx.pop();
              setActiveGame('count');
            }}
            className={`flex-1 flex flex-col items-center py-1 px-0.5 rounded-xl transition-all active:scale-95 ${
              activeGame === 'count'
                ? 'bg-sky-500 text-white font-black shadow-md ring-2 ring-sky-300 scale-102'
                : 'bg-slate-100 text-slate-700 font-bold hover:bg-slate-200'
            }`}
          >
            <span className="text-base sm:text-lg">🔢</span>
            <span className="text-[9px] leading-tight mt-0.5 font-extrabold">Count</span>
          </button>

          {/* 4. Shapes */}
          <button
            type="button"
            onClick={() => {
              sfx.pop();
              setActiveGame('shape');
            }}
            className={`flex-1 flex flex-col items-center py-1 px-0.5 rounded-xl transition-all active:scale-95 ${
              activeGame === 'shape'
                ? 'bg-rose-500 text-white font-black shadow-md ring-2 ring-rose-300 scale-102'
                : 'bg-slate-100 text-slate-700 font-bold hover:bg-slate-200'
            }`}
          >
            <span className="text-base sm:text-lg">🎨</span>
            <span className="text-[9px] leading-tight mt-0.5 font-extrabold">Shapes</span>
          </button>

          {/* 5. Ball */}
          <button
            type="button"
            onClick={() => {
              sfx.pop();
              setActiveGame('ball');
            }}
            className={`flex-1 flex flex-col items-center py-1 px-0.5 rounded-xl transition-all active:scale-95 ${
              activeGame === 'ball'
                ? 'bg-emerald-500 text-white font-black shadow-md ring-2 ring-emerald-300 scale-102'
                : 'bg-slate-100 text-slate-700 font-bold hover:bg-slate-200'
            }`}
          >
            <span className="text-base sm:text-lg">⚽</span>
            <span className="text-[9px] leading-tight mt-0.5 font-extrabold">Ball</span>
          </button>
        </div>

        {/* Activity Navigation Dock */}
        <ActivityNavBar
          currentActivity="playroom"
          onSelectActivity={onNavigate}
          unlockedBadgesCount={unlockedBadges.length}
        />
      </footer>
    </div>
  );
}
