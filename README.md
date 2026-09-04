# 🌟 Magic Pet Feeder 🐾

A vibrant, positive-reinforcement, multi-room educational web game built with **React**, **Vite**, and **Tailwind CSS**, designed specifically for a 4-year-old child! 

[![Designed for Toddlers](https://img.shields.io/badge/Designed%20For-Toddlers%20%26%20Preschoolers-pink?style=for-the-badge&logo=heart)](https://github.com/Hardik1036/Magic-Pet-Feeder)
[![8 Pets](https://img.shields.io/badge/Pets-8%20Unique%20Species-emerald?style=for-the-badge)](https://github.com/Hardik1036/Magic-Pet-Feeder)
[![5 Rooms](https://img.shields.io/badge/Rooms-5%20Interactive%20Tasks-cyan?style=for-the-badge)](https://github.com/Hardik1036/Magic-Pet-Feeder)
[![28 Badges](https://img.shields.io/badge/Trophies-28%20Round%20Medals-amber?style=for-the-badge)](https://github.com/Hardik1036/Magic-Pet-Feeder)
[![Speech Synthesis](https://img.shields.io/badge/Audio-Web%20Audio%20%2B%20Speech-indigo?style=for-the-badge)](https://github.com/Hardik1036/Magic-Pet-Feeder)
[![Independent Saves](https://img.shields.io/badge/Progress-Independent%20Pet%20Saves-orange?style=for-the-badge)](https://github.com/Hardik1036/Magic-Pet-Feeder)

---

## 🗺️ Quick Room & Feature Overview

Click on any room below to explore interactive mechanics, audio feedback, and learning goals:

<details open>
<summary><h3>🍽️ Room 1: Feeding Kitchen & Growth Stages</h3></summary>

The core learning hub where toddlers feed their magic creature letters, numbers, and shapes while watching them evolve from egg to majestic adult!

- **4 Evolution Stages**:
  - 🥚 **Magic Egg** (Feeds 0–2): Feed the egg to create cracks and hatch with a joyful crackle!
  - 🐣 **Baby Pet** (Feeds 3–6): Tiny and hungry baby pet ready to learn.
  - 🐾 **Playful Kid** (Feeds 7–10): Bouncy, smiling kid pet.
  - 👑 **Majestic Adult** (Feeds 11+): Full-grown creature with glowing golden wings!
- **3 Dynamic Learning Modes**:
  - 🔢 **Numbers (1 to 10)**: Displays complete ten-frame visual counting sprinkle dots without truncation.
  - 🔤 **Phonics & Letters (A to Z)**: Bold alphabet cookies across all 26 letters.
  - 🎨 **10 Geometric & Nature Shapes**: Star, Heart, Triangle, Square, Circle, Diamond, Crescent Moon, Oval, Flower, Cloud across 8 distinct colors.
- **Child-Friendly Mechanics**:
  - Large drag-and-drop or single direct tap (minimum 80x80px touch target).
  - Gentle misses trigger playful wobble and encouraging voice reminders without red Xs or game overs.
</details>

<details>
<summary><h3>🛁 Room 2: Bubble Bath & Spa Room</h3></summary>

A warm, soapy spa where toddlers care for their pet's hygiene:

- **Interactive Tools**:
  - 🧽 **Soapy Sponge**: Tap or scrub muddy spots on the pet to wash them with bubbly foam.
  - 🚿 **Shower Sprayer**: Warm water splash effect (`sfx.splash()`) that rinses away dirt.
  - 🫧 **Bubble Wand**: Blows floating iridescent soap bubbles that toddlers can tap to **POP** with realistic synthetic pop sounds (`sfx.bubblePop()`).
  - 🧴 **Fluffy Towel**: Dries the pet, making them sparkle with star auras and giggles!
- **Dedicated Quest**: **Bubble Champion (`bubble_champ`)** — Pop 15 floating soap bubbles in the spa!
</details>

<details>
<summary><h3>⚽ Room 3: Toy Playroom & Catch Playground</h3></summary>

An energetic playroom for motor-skill development and joyful bonding:

- **Interactive Mini-Games**:
  - ⚽ **Bouncy Beach Ball**: Tap or swipe the multi-color beach ball. The pet tracks it, jumps, and catches it with authentic bounce acoustics (`sfx.bounce()`) and cheerful cries.
  - 🐥 **Squeaky Duck**: Tap the yellow rubber duck for funny squeaking sounds (`sfx.squeak()`).
  - 🎈 **Star Balloons**: Floating star balloons that pop with confetti when tapped.
- **Dedicated Quest**: **Ball Juggler (`ball_juggler`)** — Play catch and bounce the ball 10 times!
</details>

<details>
<summary><h3>🌙 Room 4: Cozy Bedroom & Bedtime Lullaby</h3></summary>

A calming, bedtime routine room designed for evening wind-down:

- **Interactive Bedtime Steps**:
  - 💡 **Nightstand Lamp**: Tap to toggle between day lighting and serene dark-purple starry night mode.
  - ⭐ **5 Twinkling Window Stars**: Tap stars 1 to 5 to hear sweet melodic chime notes (`sfx.chime()`) and count along in speech ("One, Two, Three, Four, Five!").
  - 🛌 **Blanket Tuck**: Pull up the cozy duvet; the pet closes its eyes, snores cute cartoon "Zzz" (`sfx.snore()`), and dreams of sweets.
- **Dedicated Quest**: **Starlight Dreamer (`starlight_dreamer`)** — Count all 5 window stars and tuck pet into bed!
</details>

<details>
<summary><h3>👗 Room 5: Dress-Up Salon & Photo Booth</h3></summary>

A fashion runway for creative styling and memorable souvenirs:

- **Costume Accessories**:
  - 🎉 Party Hat
  - 👑 Golden Crown
  - 🕶️ Cool Sunglasses
  - 🎀 Dapper Bowtie
  - 🌸 Magic Flower Clip
  - 🧙 Wizard Hat
  - 🦸 Super Hero Cape
- **Photo Booth**:
  - Tap **SNAP PHOTO!** to trigger a camera flash animation, shutter click (`sfx.shutter()`), and celebratory fanfares.
  - Generates a keepsake postcard featuring the player's name and styled pet!
- **Dedicated Quest**: **Glamour Superstar (`glamour_star`)** — Style your pet and snap 3 photo postcards!
</details>

<details>
<summary><h3>🏆 Room 6: Round Medallion Trophy Showcase (28 Badges)</h3></summary>

A 3-column trophy room of 3D-styled round gold medallions with glossy reflections and checkmark seals:

- **Challenging, Engaging Quests**: No more spamming badges after every feed. Children earn badges through genuine dedication (e.g. 5-streak without miss, feeding #10 three times, collecting all 5 vowels, raising pets to Kid stage).
- **Live Progress Pills**: Displays live counters for Streak, Math (x/10), Letters (x/12), Shapes (x/12), Bubbles (x/15), Bounces (x/10), Stars (x/5), and Photos (x/3).
- **Voice Goals**: Tapping any locked medal reads its exact quest goal aloud!
</details>

---

## 🐾 8 Lovable Animals (Voice Profiles)

Every pet species features distinct color palettes, unique species eggs, and tuned browser Speech Synthesis profiles:

| Animal | Species | Default Name | Voice Pitch | Speed | Sound Effect | Greeting Catchphrase |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| 🦖 **Dino** | Magic Dino | Rexy | `1.15` | `0.88` | Chomp / Roar | *"Roar! Let's eat tasty snacks!"* |
| 🐰 **Bunny** | Star Bunny | Fluffy | `1.48` | `0.95` | Squeak / Hop | *"Hop hop! I love yummy treats!"* |
| 🐶 **Pup** | Golden Pup | Barnaby | `1.25` | `0.92` | Woof / Wag | *"Woof woof! Ready to snack with you!"* |
| 🐱 **Kitten** | Cozy Kitten | Mochi | `1.35` | `0.88` | Purr / Meow | *"Meow! Can we find my favorite snack?"* |
| 🐼 **Panda** | Baby Panda | Bao | `1.08` | `0.85` | Nom / Cuddle | *"Yum yum! Bamboo cookies are the best!"* |
| 🦊 **Fox** | Woodland Fox | Pip | `1.38` | `0.92` | Yip / Explore | *"Yip yip! Let's go on an adventure!"* |
| 🐧 **Penguin**| Arctic Penguin | Pebble | `1.30` | `0.90` | Flap / Waddler | *"Honk honk! Time for cool tasty treats!"* |
| 🐹 **Hamster**| Golden Hamster | Nugget | `1.55` | `0.98` | Ultra-Squeak | *"Squeak squeak! Pack my cheeks with food!"* |

---

## 💾 Independent Per-Pet Persistence (Zero Lost Progress)

Switching pets never wipes past achievements:
- **Independent Records**: Each animal maintains its own custom nickname, feed count, evolution stage index, and equipped costumes in `localStorage`.
- **Global Profile**: Player name, quest badges, and gameplay challenge stats are safely preserved across browser reloads and device reboots.

---

## 🏆 28 Round Quest Badges Checklist

<details>
<summary><b>Click to view all 28 badge quest requirements</b></summary>

| ID | Badge Title | Icon | Category | Challenge Requirement |
| :--- | :--- | :---: | :---: | :--- |
| `first_snack` | Snack Explorer | 🍪 | Milestone | Feed 3 snacks to begin your journey |
| `egg_cracker` | Egg Cracker | 🐣 | Milestone | Feed the magic egg until it cracks and hatches |
| `kid_growth` | Growing Tall! | 🐾 | Milestone | Raise pet past baby stage into a Kid (7 feeds) |
| `adult_majesty`| Majestic Adult | 👑 | Milestone | Raise pet into a full-grown Adult (11 feeds) |
| `super_feeder` | Super Feeder | 🌟 | Milestone | Feed 15 total snacks across all pets |
| `mega_feeder` | Snack Champion | 🚀 | Milestone | Feed 30 total treats across all pets |
| `high_five` | Flawless 5 Streak | ✋ | Fun | Score 5 correct answers in a row without a single miss |
| `rainbow_belly`| Rainbow Feast | 🌈 | Fun | Feed treats in all 8 different colors |
| `number_whiz` | Math Explorer | 🔢 | Learning | Feed 10 number snacks |
| `ten_frame_master` | Ten-Frame Master | 🔟 | Learning | Find and feed the number 10 at least 3 times |
| `alphabet_champ`| Alphabet Master | 🔤 | Learning | Feed 12 alphabet letter cookies |
| `vowel_superstar`| Vowel Wizard | ⭐ | Learning | Find and feed all 5 vowels: A, E, I, O, and U |
| `shape_master` | Shape Expert | 🎨 | Learning | Feed 12 colorful shapes |
| `gem_collector`| Treasure Hunter | 💎 | Learning | Feed all 4 rare shapes: Diamond, Moon, Flower, Cloud |
| `dino_tamer` | Dino Master | 🦖 | Animal | Bond with Rexy by raising him to Kid stage (7 feeds) |
| `bunny_buddy` | Bunny Champion | 🐰 | Animal | Bond with Fluffy by raising her to Kid stage (7 feeds) |
| `puppy_pal` | Best Pup Pal | 🐶 | Animal | Bond with Barnaby by raising him to Kid stage (7 feeds) |
| `kitty_cuddle` | Cat Whisperer | 🐱 | Animal | Bond with Mochi by raising her to Kid stage (7 feeds) |
| `bamboo_master`| Panda Guardian | 🐼 | Animal | Bond with Bao by raising him to Kid stage (7 feeds) |
| `fox_explorer` | Fox Companion | 🦊 | Animal | Bond with Pip by raising him to Kid stage (7 feeds) |
| `penguin_dancer`| Arctic Hero | 🐧 | Animal | Bond with Pebble by raising him to Kid stage (7 feeds) |
| `hamster_cheeks`| Hamster Hero | 🐹 | Animal | Bond with Nugget by raising him to Kid stage (7 feeds) |
| `fashion_icon` | Wardrobe Master | 🎩 | Fun | Unlock and wear at least 3 silly costume accessories |
| `party_animal` | Grand Festival | 🎉 | Fun | Rare confetti surprise festival drop after 15 feeds |
| `bubble_champ` | Bubble Champion | 🫧 | Spa | Pop 15 floating soap bubbles in the Bubble Bath Spa |
| `ball_juggler` | Ball Juggler | ⚽ | Play | Play catch and bounce the playroom ball 10 times |
| `starlight_dreamer`| Starlight Dreamer | ⭐ | Sleep | Count all 5 window stars and tuck pet into bed |
| `glamour_star` | Glamour Superstar | 📸 | Salon | Dress up your pet and take 3 photo snapshots |

</details>

---

## 🧠 Toddler-First UX & Design Principles

1. **Zero Negative Reinforcement**: No game-over screens, no countdown clocks, no buzzing error noises, and no red "X" icons.
2. **Generous Touch Targets**: Minimum `80x80px` interactive hitboxes with `touch-action: manipulation` to eliminate unintended zooms or scrolling on mobile tablets.
3. **Pure Synthetic Audio**: All sound effects (pops, munches, bounces, chimes, camera shutter) are generated on the fly via the **Web Audio API**—zero asset loading latency or missing file glitches.
4. **Rich Multi-Sensory Feedback**: Speech synthesis, confetti particle cannons, bouncing animations, and glowing sparkles celebrate every toddler milestone.

---

## 🚀 Quick Start & Development

### 1. Clone & Install
```bash
git clone https://github.com/Hardik1036/Magic-Pet-Feeder.git
cd Magic-Pet-Feeder
npm install
```

### 2. Start Dev Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser (or use Chrome DevTools Mobile Emulation with touch enabled).

### 3. Production Build
```bash
npm run build
```

---

## 🛠️ Technology Stack
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide-React + Custom Animated SVGs
- **Audio**: Native Web Audio API + Web SpeechSynthesis API
- **Persistence**: Browser `localStorage` (Schema v2)

---

Enjoy playing and caring with **Magic Pet Feeder**! 🐾✨
