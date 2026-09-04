# 🌟 Magic Pet Feeder 🐾

A mobile-first, positive-reinforcement web game built with React, Vite, and Tailwind CSS designed specifically for a 4-year-old child!

![Magic Pet Feeder](https://img.shields.io/badge/Designed%20for-Toddlers%20%26%20Preschoolers-pink)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20TailwindCSS-blue)
![Audio](https://img.shields.io/badge/Audio-Web%20Audio%20API%20%2B%20SpeechSynthesis-green)

---

## 🎯 Target Audience & UX Principles

1. **Toddler-Friendly Touch Mechanics**:
   - Oversized buttons ($\ge 96\text{px} \times 96\text{px}$ hitboxes).
   - Generous drop radii and dual mechanics: supports both **drag-and-drop** AND **tap-to-feed** (ideal for toddlers who struggle with long screen drags).
   - Strict `touch-action: manipulation` and `touch-action: none` to prevent unintended browser zooming or scrolling.

2. **Positive Reinforcement Only**:
   - **Zero game-over screens**, no countdown timers, no harsh buzzers, and no red "X" icons.
   - Correct answers trigger cartoon munch sounds, starry confetti explosions, and happiness meter boosts.
   - Incorrect answers trigger a soft, playful cartoon boing and wobble animation with zero penalty.

3. **Voice & Audio Synthesis**:
   - Built-in `window.speechSynthesis` speaks prompts aloud in a high-pitch, friendly cartoon voice.
   - Pure **Web Audio API** sound engine generates pops, bites/munching, boings, and fanfare chords on the fly (100% self-contained with no external audio file dependencies).
   - Big audio replay button so children can listen to the prompt again anytime.

4. **Interactive SVG Pet & Silliness Rewards**:
   - Responsive pet avatar that breathes, smiles, opens its mouth wide when food comes near, and joyfully chews when fed.
   - Every **4 successful snacks**, an instant celebration modal pops up unlocking silly accessories (Party Hat, Cool Shades, Dapper Bowtie, Golden Crown, Magic Flower) that stay rendered directly onto the pet!

5. **2 Learning Modes**:
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
│       └── MagicPetFeeder.jsx  # Complete game component & Web Audio synthesizer
└── README.md
```

---

## 💖 Made for Early Childhood Learning
Designed to bring smiles, confidence, and joyful sensory learning to young toddlers!
