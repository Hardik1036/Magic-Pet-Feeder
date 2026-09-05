// ==========================================
// CENTRAL AUDIO & VOICE SYNTHESIZER
// Web Audio API Synthetic FX + Speech Synthesis
// ==========================================

class SoundFX {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  pop() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  crack() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [0, 0.04, 0.08].forEach((offset, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + offset;

      osc.type = 'square';
      osc.frequency.setValueAtTime(600 + idx * 120, t);
      osc.frequency.exponentialRampToValueAtTime(200, t + 0.03);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.04);
    });
  }

  munch() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bites = [0, 0.12, 0.24];

    bites.forEach((offset, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + offset;

      osc.type = idx % 2 === 0 ? 'triangle' : 'square';
      osc.frequency.setValueAtTime(440 - idx * 40, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.08);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.09);
    });
  }

  boing() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.28);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.28);
  }

  grow() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.45);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  fanfare() {
    this.init();
    if (!this.ctx) return;
    const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99];
    const now = this.ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + i * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.28);
    });
  }

  // --- NEW SOUNDS FOR SPA, PLAYROOM, BEDROOM & SALON ---

  bubblePop() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const startFreq = 400 + Math.random() * 200;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(startFreq * 2.2, now + 0.06);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  }

  splash() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [0, 0.03, 0.07].forEach((delay, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + delay;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300 - idx * 40, t);
      osc.frequency.exponentialRampToValueAtTime(650, t + 0.1);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.12);
    });
  }

  showerStream() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [0, 0.05, 0.1, 0.15, 0.2].forEach((offset, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + offset;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320 + idx * 30, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.18);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.18);
    });
  }

  scrub() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.linearRampToValueAtTime(320, now + 0.08);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  squeak() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.06);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.14);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  bounce() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.2);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  chime(noteIdx = 0) {
    this.init();
    if (!this.ctx) return;
    // Pentatonic scale notes (C5, D5, E5, G5, A5, C6)
    const scale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
    const freq = scale[noteIdx % scale.length];
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
  }

  shutter() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Quick snap
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.04);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);

    // Motor whirr
    setTimeout(() => {
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(300, t);
      osc2.frequency.linearRampToValueAtTime(450, t + 0.15);
      gain2.gain.setValueAtTime(0.15, t);
      gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(t);
      osc2.stop(t + 0.15);
    }, 60);
  }

  snore() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.linearRampToValueAtTime(140, now + 0.3);
    osc.frequency.linearRampToValueAtTime(95, now + 0.7);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.7);
  }

  sparkle() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [0, 0.05, 0.1, 0.15, 0.2].forEach((offset, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + offset;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200 + idx * 250, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.12);
    });
  }
}

export const sfx = new SoundFX();

// ==========================================
// HINGLISH TRANSLATION & PHRASING DICTIONARY
// ==========================================
export function toHinglish(text) {
  if (!text || typeof text !== 'string') return text;

  let str = text.trim();

  const directPhrases = [
    // Welcome / Hats / Photos
    { from: /welcome to the dress-up salon! pick your favorite costume for ([^!?.]+)[!?.]*/i, to: 'Dress-Up Salon mein aapka swaagat hai! $1 ke liye pyara sa costume chuno!' },
    { from: /what would you like to name your new ([^!?.]+)[!?.]*/i, to: 'Aap apne naye $1 ka kya naam rakhna chahenge?' },
    { from: /so fancy!?/i, to: 'Bohot shandaar!' },
    { from: /looking great!?/i, to: 'Bohot achhe lag rahe ho!' },
    { from: /ooh, stylish!?/i, to: 'Arre waah, kya style hai!' },
    { from: /super cute!?/i, to: 'Kitna cute lag raha hai!' },
    { from: /badge unlocked:\s*([^!]+)!\s*(.*)/i, to: 'Badge unlock ho gaya: $1! $2' },
    { from: /locked badge:\s*([^.]+)\.\s*goal:\s*(.*)/i, to: 'Locked badge: $1. Goal: $2' },
    { from: /hi ([^!]+)!\s*i'm ([^!]+)!\s*(.*)/i, to: 'Namaste $1! Main hoon $2! $3' },
    { from: /say cheese! what a gorgeous photo saved to your scrapbook!?/i, to: 'Say cheese! Photo scrapbook mein save ho gayi!' },
    { from: /say cheese! what a gorgeous photo!?/i, to: 'Say cheese! Kitni pyaari photo aayi hai!' },
    { from: /fabulous! you earned the glamour superstar trophy!?/i, to: 'Arre waah! Aapko Glamour Superstar trophy mil gayi!' },
    { from: /ready for another bubbly spa session! scrub the mud spots!?/i, to: 'Chalo bubbly spa karte hain! Mud spots saaf karo!' },
    { from: /rub the soft sponge over the mud spots!?/i, to: 'Soft sponge se keechad saaf karo!' },
    { from: /rub shampoo to make fluffy bubbles!?/i, to: 'Shampoo lagao aur dher saare bubbles banao!' },
    { from: /rub with the fluffy towel to dry clean!?/i, to: 'Naram towel se pet ko sukha do!' },
    { from: /ah, warm water feels so good! washing away the bubbles!?/i, to: 'Aaha, garam paani! Saare bubbles dho diye!' },
    { from: /hooray! you earned the bubble champion trophy!?/i, to: 'Shabash! Aap ban gaye Bubble Champion!' },
    { from: /turn off the lamp so ([^!?.]+) can sleep[!?.]*/i, to: 'Night lamp band karo taaki $1 so sake!' },
    { from: /play a sweet lullaby for sweet dreams!?/i, to: 'Pyari si lori bajao taaki meethe sapne aayein!' },
    { from: /good night, sweet dreams!?/i, to: 'Good night, sweet dreams! Shubh raatri!' },
    { from: /give ([^!?.]+) cozy bedtime cuddles[!?.]*/i, to: '$1 ko pyar se thap-thapao!' },
    { from: /tap the blanket to tuck ([^!?.]+) in[!?.]*/i, to: 'Blanket odhao taaki $1 so jaye!' },
    { from: /([^!?.]+) is getting sleepy! give bedtime cuddles[!?.]*/i, to: '$1 ko neend aa rahi hai! Pyar se sulao!' },

    // Playroom: Detective
    { from: /detective ([^!]+)! search the moving numbers to find letter ([^!?.]+)[!?.]*/i, to: 'Detective $1! Box mein se letter $2 dhoondo!' },
    { from: /search the moving numbers to find letter ([^!?.]+)[!?.]*/i, to: 'Moving numbers mein se letter $1 dhoondo!' },
    { from: /incredible! you earned the alphabet master trophy!?/i, to: 'Kamaal kar diya! Alphabet Master trophy aapki hui!' },
    { from: /great detective work! you found letter ([^!?.]+)[!?.]*/i, to: 'Bohot badhiya! Aapne letter $1 dhoond liya!' },
    { from: /that's number ([^!]+)! keep looking for letter ([^!?.]+)[!?.]*/i, to: 'Yeh toh number $1 hai! Letter $2 dhoondo!' },
    { from: /that's letter ([^!]+)! find letter ([^!?.]+)[!?.]*/i, to: 'Yeh letter $1 hai! Humein letter $2 chahiye!' },

    // Playroom: Word Speller
    { from: /we are spelling ([^!]+)! find the letter ([^!?.]+)[!?.]*/i, to: 'Hum spell kar rahe hain $1! Letter $2 dhoondo!' },
    { from: /spelling ([^!]+)! look for ([^!?.]+)[!?.]*/i, to: '$1 ki spelling! Letter $2 ko tap karo!' },
    { from: /amazing spelling! you spelled ([^!?.]+)[!?.]*/i, to: 'Waah shabash! Aapne $1 spell kar liya!' },
    { from: /that's ([^!]+)! we need ([^!?.]+) next[!?.]*/i, to: 'Yeh $1 hai! Abhi humein $2 chahiye!' },

    // Playroom: Counting
    { from: /pop balloons in order from 1 to 5! tap number ([^!?.]+)[!?.]*/i, to: 'Balloons ko 1 se 5 ke order mein pop karo! Number $1 tap karo!' },
    { from: /pop balloon #?([^!?.]+) next[!?.]*/i, to: 'Ab balloon number $1 pop karo!' },
    { from: /super counting! you popped all 5 balloons!?/i, to: 'Kamaal kar diya! Saare 5 balloons pop kar diye!' },
    { from: /pop balloon ([^!?.]+) first[!?.]*/i, to: 'Pehle balloon $1 pop karo!' },

    // Playroom: Shapes
    { from: /find the ([^!]+) and put it in my toy box[!?.]*/i, to: '$1 dhoondo aur mere toy box mein daalo!' },
    { from: /yes! you found the ([^!]+)! into the toy box[!?.]*/i, to: 'Sahi pakde! $1 mil gaya! Toy box ke andar!' },
    { from: /that's a ([^!]+)! look for the ([^!?.]+)[!?.]*/i, to: 'Yeh $1 hai! Humein $2 dhoondna hai!' },

    // Playroom: Ball
    { from: /tap the beach ball to play catch with ([^!?.]+)[!?.]*/i, to: 'Beach ball tap karo aur $1 ke saath catch-catch khelo!' },
    { from: /incredible! you earned the ball juggler trophy!?/i, to: 'Kamaal kar diya! Ball Juggler trophy aapki hui!' },
    { from: /awesome catch!?/i, to: 'Waah, kya catch hai!' },
    { from: /bounce bounce!?/i, to: 'Uchhlo uchhlo!' },
    { from: /wheee!?/i, to: 'Wheee! Maza aa gaya!' },

    // MagicPetFeeder prompts
    { from: /touch the ([^!?.]+)[!?.]*/i, to: '$1 ko touch karo!' },
    { from: /feed the ([^!?.]+)[!?.]*/i, to: '$1 khilao!' },
    { from: /find the letter ([^!?.]+)[!?.]*/i, to: 'Letter $1 dhoondo aur khilao!' },
    { from: /find the number ([^!?.]+)[!?.]*/i, to: 'Number $1 dhoondo aur khilao!' },
    { from: /find the ([^!?.]+)[!?.]*/i, to: '$1 dhoondo!' },
    { from: /wow! the egg hatched! welcome ([^!?.]+)[!?.]*/i, to: 'Arre waah! Anda phoot gaya! Welcome $1!' },
    { from: /hooray! ([^!]+) grew into a playful kid[!?.]*/i, to: 'Hooray! $1 ab bada ho gaya hai!' },
    { from: /amazing! ([^!]+) is now a full grown adult[!?.]*/i, to: 'Kamaal hai! $1 ab bada dragon ban gaya!' },
    { from: /i'm hungry! feed me ([^!?.]+)[!?.]*/i, to: 'Mujhe bhookh lagi hai! $1 khilao!' },
    { from: /yum yum, delicious!?/i, to: 'Yum yum, bohot tasty hai!' },
    { from: /delicious!?/i, to: 'Bohot swaadisht!' },
    { from: /yummy!?/i, to: 'Mazedaar!' },
    { from: /great job!?/i, to: 'Shabash!' },
    { from: /awesome!?/i, to: 'Bohot badhiya!' },
    { from: /super!?/i, to: 'Kamaal!' },
    { from: /hooray!?/i, to: 'Hooray!' },
    { from: /oops, try again!?/i, to: 'Arre, dubara try karo!' },
    { from: /try another one!?/i, to: 'Koi aur try karo!' },
    { from: /oopsie! let's find ([^!?.]+)[!?.]*/i, to: 'Arre! Chalo $1 dhoondein!' },
    { from: /hehe, that tickles! try ([^!?.]+)[!?.]*/i, to: 'Hehe, gudgudi hui! $1 try karo!' },
    { from: /almost! can you find ([^!?.]+)[!?.]*/i, to: 'Bohot paas! Kya aap $1 dhoond sakte ho?' },

    // Pet greetings
    { from: /roar! let's eat tasty snacks!?/i, to: 'Roar! Chalo yummy snacks khate hain!' },
    { from: /hop hop! i love yummy treats!?/i, to: 'Hop hop! Mujhe treats bohot pasand hain!' },
    { from: /woof woof! i love treats!?/i, to: 'Woof woof! Mujhe tasty treats khilao!' },
    { from: /meow meow! purrfect snack!?/i, to: 'Meow meow! Bohot mazedaar snack!' },
    { from: /chomp chomp! tasty bamboo!?/i, to: 'Chomp chomp! Tasty bamboo khilao!' },
    { from: /yip yip! yummy berries!?/i, to: 'Yip yip! Yummy berries khilao!' },
    { from: /waddle waddle! tasty fish!?/i, to: 'Waddle waddle! Tasty fish khilao!' },
    { from: /squeak squeak! crunchy seeds!?/i, to: 'Squeak squeak! Crunchy seeds khilao!' },
    { from: /nom nom roar!?/i, to: 'Nom nom roar! Mazaa aa gaya!' },
    { from: /munch munch squeak!?/i, to: 'Munch munch! Mazedaar!' },
  ];

  for (const { from, to } of directPhrases) {
    if (from.test(str)) {
      return str.replace(from, to);
    }
  }

  // Phonics hints: e.g. "C - A - T spells Cat!"
  const phonicsMatch = str.match(/^([A-Z]\s*-\s*[A-Z].*?)\s+spells\s+([A-Za-z]+)!?$/i);
  if (phonicsMatch) {
    const word = phonicsMatch[2];
    const hindiWord = {
      cat: 'Billi',
      dog: 'Kutta',
      sun: 'Sun',
      star: 'star',
      fish: 'Machhli',
      bird: 'Chidiya',
      ball: 'ball',
      duck: 'Batakh',
    }[word.toLowerCase()] || word;
    return `${phonicsMatch[1]} banta hai ${word}, yaani ${hindiWord}!`;
  }

  return str;
}

// Voice synthesis helper with pet custom pitch, speed, and Hinglish language support
let cachedEnglishVoice = null;
let cachedHinglishVoice = null;

let currentLanguage = 'en';
try {
  if (typeof window !== 'undefined') {
    const savedLang = localStorage.getItem('magic_pet_feeder_lang');
    if (savedLang === 'hinglish' || savedLang === 'en') {
      currentLanguage = savedLang;
    }
  }
} catch (e) {
  // LocalStorage unavailable
}

export function setAudioLanguage(lang) {
  currentLanguage = lang === 'hinglish' ? 'hinglish' : 'en';
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('magic_pet_feeder_lang', currentLanguage);
    }
  } catch (e) { }
}

export function getAudioLanguage() {
  return currentLanguage;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const loadVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    // Best English voice
    cachedEnglishVoice =
      voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))
      ) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      null;

    // Best Hindi / Indian voice for Hinglish
    cachedHinglishVoice =
      voices.find((v) => v.lang === 'hi-IN' || v.lang === 'hi_IN' || v.lang.startsWith('hi')) ||
      voices.find((v) => v.lang === 'en-IN' || v.lang === 'en_IN') ||
      voices.find(
        (v) =>
          v.name.includes('Hindi') ||
          v.name.includes('India') ||
          v.name.includes('Kalpana') ||
          v.name.includes('Hemant') ||
          v.name.includes('Swara') ||
          v.name.includes('Ravi') ||
          v.name.includes('Heera') ||
          v.name.includes('Neerja') ||
          v.name.includes('Veena') ||
          v.name.includes('Rishi') ||
          v.name.includes('Lekha')
      ) ||
      cachedEnglishVoice;
  };

  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

export function speakPetText(text, petVoice, langOverride) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    const isHinglish = (langOverride || currentLanguage) === 'hinglish';
    const spokenText = isHinglish ? toHinglish(text) : text;

    window.speechSynthesis.cancel();
    setTimeout(() => {
      try {
        const utterance = new SpeechSynthesisUtterance(spokenText);
        utterance.pitch = petVoice?.pitch || 1.2;
        utterance.rate = isHinglish ? 0.90 : (petVoice?.rate || 0.96);

        if (isHinglish && cachedHinglishVoice) {
          utterance.voice = cachedHinglishVoice;
          utterance.lang = cachedHinglishVoice.lang || 'hi-IN';
        } else if (cachedEnglishVoice) {
          utterance.voice = cachedEnglishVoice;
          utterance.lang = 'en-US';
        } else {
          utterance.lang = isHinglish ? 'hi-IN' : 'en-US';
        }

        window.speechSynthesis.speak(utterance);
      } catch (innerErr) {
        console.warn('Speech utterance error:', innerErr);
      }
    }, 15);
  } catch (e) {
    console.warn('Speech error:', e);
  }
}
