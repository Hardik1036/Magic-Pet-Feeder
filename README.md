# 🌟 Magic Pet Feeder 🐾

A mobile-first, positive-reinforcement web game built with React, Vite, and Tailwind CSS designed specifically for a 4-year-old child! Watch your pet grow from a magical egg to a full adult creature through joyful feeding!

![Magic Pet Feeder](https://img.shields.io/badge/Designed%20for-Toddlers%20%26%20Preschoolers-pink)
![Pet Evolution](https://img.shields.io/badge/Evolution-Egg%20to%20Adult-purple)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20TailwindCSS-blue)
![Audio](https://img.shields.io/badge/Audio-Web%20Audio%20API%20%2B%20SpeechSynthesis-green)

---

## 🐣 Pet Evolution Stages

As children feed the pet with correct letters and shapes, the pet visibly grows across 4 life stages:

1. **Stage 1: The Magic Egg 🥚** (0–2 feeds):
   - A sparkling purple egg with glowing yellow spots that wobbles and rocks.
   - Feeding snacks creates glowing cracks on the shell with a realistic crunch/crack sound!
   - At 3 feeds, the egg bursts open with golden confetti and hatches!

2. **Stage 2: Baby Dino 🐣** (3–6 feeds):
   - A tiny, super cute baby hatchling wearing a pastel bib with big innocent kawaii eyes.
   - Needs nourishing snacks to grow stronger!

3. **Stage 3: Playful Kid 🦖** (7–10 feeds):
   - Medium-sized, high-energy pet bouncing joyfully with playful horns and a wide toothy grin.
   - Can wear fun accessories like sunglasses, party hats, and bowties.

4. **Stage 4: Majestic Adult Dragon 🦕👑** (11+ feeds):
   - A full-grown, loving giant pet with golden dragon wings, shiny scales, royal crown, and warm protective aura.
   - Reaching adult status triggers a grand celebration fanfare!

---

## 🎯 Target Audience & UX Principles

1. **Toddler-Friendly Touch Mechanics**:
   - Oversized buttons ($\ge 96\text{px} \times 96\text{px}$ hitboxes).
   - Generous drop radii and dual mechanics: supports both **drag-and-drop** AND **tap-to-feed** (ideal for toddlers who struggle with long screen drags).
   - Strict `touch-action: manipulation` and `touch-action: none` to prevent unintended browser zooming or scrolling.

2. **Positive Reinforcement Only**:
   - **Zero game-over screens**, no countdown timers, no harsh buzzers, and no red "X" icons.
   - Correct answers trigger cartoon munch/crack sounds, starry confetti explosions, and growth progress.
   - Incorrect answers trigger a soft, playful cartoon boing and wobble animation with zero penalty.

3. **Voice & Audio Synthesis**:
   - Built-in `window.speechSynthesis` speaks prompts aloud in a high-pitch, friendly cartoon voice.
   - Pure **Web Audio API** sound engine generates pops, bites/munching, egg cracks, growth swells, and fanfare chords on the fly (100% self-contained with no external audio file dependencies).
   - Big audio replay button so children can listen to the prompt again anytime.

4. **2 Learning Modes**:
   - **Phonics & Letter Matching**: Matching big, bold letters with spoken prompts.
   - **Colors & Shapes**: Identifying geometric shapes (stars, hearts, circles, triangles, squares) and bright primary colors.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser (or open it on a tablet/phone on your local network).

### 3. Build for Production
```bash
npm run build
```

---

## 📁 Project Structure

```text
magic-pet-feeder/
├── index.html                  # HTML entry point
├── package.json                # Project dependencies & scripts
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind styling & toddler animations
├── postcss.config.js           # PostCSS configuration
├── src/
│   ├── App.jsx                 # App root container
│   ├── main.jsx                # React DOM render entry
│   ├── index.css               # Base Tailwind directives & keyframe animations
│   └── components/
│       └── MagicPetFeeder.jsx  # Complete game component, 4 evolution stages & Web Audio synthesizer
└── README.md
```

---

## 💖 Made for Early Childhood Learning
Designed to bring smiles, confidence, and joyful sensory learning to young toddlers!
