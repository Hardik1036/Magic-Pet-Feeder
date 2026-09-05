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
// HINDI & HINGLISH TRANSLATION DICTIONARY
// Supports both native Devanagari Hindi (hi-IN)
// and Phonetic Romanized Hindi (en-IN fallback)
// ==========================================
const HINDI_TRANSLATIONS = [
  // Welcome / Hats / Costumes
  {
    from: /welcome to the dress-up salon! pick your favorite costume for ([^!?.]+)[!?.]*/i,
    hi: 'ड्रेस-अप सैलून में आपका स्वागत है! $1 के लिए प्यारा सा कॉस्ट्यूम चुनो!',
    phonetic: 'Dress-Up Salon mein aapka swaagat hai! $1 ke liye pyara sa costume chuno!',
  },
  {
    from: /tap any costume below to mix and match silly outfits for ([^!?.]+)[!?.]*/i,
    hi: 'नीचे से कोई भी कॉस्ट्यूम चुनकर $1 को सुंदर कपड़े पहनाओ!',
    phonetic: 'Neeche se costume chun kar $1 ko stylish kapde pehnao!',
  },
  {
    from: /all fresh and cozy!?/i,
    hi: 'सारे कपड़े उतार दिए! एकदम ताज़ा और आरामदायक!',
    phonetic: 'Saare kapde utaar diye! Ekdum fresh!',
  },
  {
    from: /what would you like to name your new ([^!?.]+)[!?.]*/i,
    hi: 'आप अपने नए $1 का क्या नाम रखना चाहेंगे?',
    phonetic: 'Aap apne naye $1 ka kya naam rakhna chahenge?',
  },
  {
    from: /strike a pose! absolutely fabulous!?/i,
    hi: 'पोज़ मारो! एकदम शानदार लग रहे हो!',
    phonetic: 'Pose maaro! Ekdum hero lag rahe ho!',
  },
  {
    from: /fashion icon alert! looking stunning!?/i,
    hi: 'फैशन स्टार! बहुत सुंदर लग रहे हो!',
    phonetic: 'Fashion icon! Bohot sundar lag rahe ho!',
  },
  {
    from: /work that runway! super stylish!?/i,
    hi: 'रनवे पर जादू चला दिया! बहुत स्टाइलिश!',
    phonetic: 'Runway par aag laga di! Bohot stylish!',
  },
  {
    from: /ta-da! you look so gorgeous!?/i,
    hi: 'ता-दा! कितने प्यारे लग रहे हो!',
    phonetic: 'Ta-da! Kitne pyaare lag rahe ho!',
  },
  {
    from: /surprise lucky mix! look at this hilarious outfit!?/i,
    hi: 'सरप्राइज़ लकी मिक्स! देखो कितना मज़ेदार आउटफिट है!',
    phonetic: 'Surprise lucky mix! Dekho kitna mazedaar outfit hai!',
  },
  {
    from: /so fancy!?/i,
    hi: 'बहुत शानदार!',
    phonetic: 'Bohot shandaar!',
  },
  {
    from: /looking great!?/i,
    hi: 'बहुत अच्छे लग रहे हो!',
    phonetic: 'Bohot achhe lag rahe ho!',
  },
  {
    from: /ooh, stylish!?/i,
    hi: 'अरे वाह, क्या स्टाइल है!',
    phonetic: 'Arre waah, kya style hai!',
  },
  {
    from: /super cute!?/i,
    hi: 'कितना प्यारा लग रहा है!',
    phonetic: 'Kitna cute lag raha hai!',
  },
  {
    from: /badge unlocked:\s*([^!]+)!\s*(.*)/i,
    hi: 'बिल्ला अनलॉक हुआ: $1! $2',
    phonetic: 'Badge unlock ho gaya: $1! $2',
  },
  {
    from: /locked badge:\s*([^.]+)\.\s*goal:\s*(.*)/i,
    hi: 'लॉक बिल्ला: $1. लक्ष्य: $2',
    phonetic: 'Locked badge: $1. Goal: $2',
  },
  {
    from: /hi ([^!]+)!\s*i'm ([^!]+)!\s*(.*)/i,
    hi: 'नमस्ते $1! मैं हूँ $2! $3',
    phonetic: 'Namaste $1! Main hoon $2! $3',
  },
  {
    from: /say cheese! what a gorgeous photo saved to your scrapbook!?/i,
    hi: 'स्माइल प्लीज़! खूबसूरत फोटो स्क्रैपबुक में सेव हो गई!',
    phonetic: 'Say cheese! Photo scrapbook mein save ho gayi!',
  },
  {
    from: /say cheese! what a gorgeous photo!?/i,
    hi: 'स्माइल प्लीज़! कितनी प्यारी फोटो है!',
    phonetic: 'Say cheese! Kitni pyaari photo aayi hai!',
  },
  {
    from: /fabulous! you earned the glamour superstar trophy!?/i,
    hi: 'अरे वाह! आपको ग्लैमर सुपरस्टार ट्रॉफी मिल गई!',
    phonetic: 'Arre waah! Aapko Glamour Superstar trophy mil gayi!',
  },
  {
    from: /splish splash! let's take a warm bubble bath! grab the scrub sponge to clean the mud off ([^!?.]+)[!?.]*/i,
    hi: 'छप-छप! चलो एक गर्म बबल बाथ लेते हैं! स्पंज से $1 के कीचड़ के दाग साफ़ करो!',
    phonetic: 'Splish splash! Chalo warm bubble bath lete hain! Sponge se $1 ke mud spots saaf karo!',
  },
  {
    from: /ready for another bubbly spa session! scrub the mud spots!?/i,
    hi: 'चलो बबल स्पा करते हैं! कीचड़ के दाग साफ़ करो!',
    phonetic: 'Chalo bubbly spa karte hain! Mud spots saaf karo!',
  },
  {
    from: /rub the soft sponge over the mud spots!?/i,
    hi: 'मुलायम स्पंज से कीचड़ साफ़ करो!',
    phonetic: 'Soft sponge se keechad saaf karo!',
  },
  {
    from: /rub shampoo to make fluffy bubbles!?/i,
    hi: 'शैम्पू लगाओ और ढेर सारे बबल्स बनाओ!',
    phonetic: 'Shampoo lagao aur dher saare bubbles banao!',
  },
  {
    from: /rub with the fluffy towel to dry clean!?/i,
    hi: 'नरम तौलिये से सुखा दो!',
    phonetic: 'Naram towel se pet ko sukha do!',
  },
  {
    from: /ah, warm water feels so good! washing away the bubbles!?/i,
    hi: 'आहा, गरम पानी! सारे बबल्स धो दिए!',
    phonetic: 'Aaha, garam paani! Saare bubbles dho diye!',
  },
  {
    from: /hooray! you earned the bubble champion trophy!?/i,
    hi: 'शाबाश! आप बन गए बबल चैंपियन!',
    phonetic: 'Shabash! Aap ban gaye Bubble Champion!',
  },
  {
    from: /turn off the lamp so ([^!?.]+) can sleep[!?.]*/i,
    hi: 'नाईट लैम्प बंद करो ताकि $1 सो सके!',
    phonetic: 'Night lamp band karo taaki $1 so sake!',
  },
  {
    from: /play a sweet lullaby for sweet dreams!?/i,
    hi: 'प्यारी सी लोरी बजाओ ताकि मीठे सपने आएं!',
    phonetic: 'Pyari si lori bajao taaki meethe sapne aayein!',
  },
  {
    from: /good night, sweet dreams!?/i,
    hi: 'शुभ रात्रि! मीठे सपने!',
    phonetic: 'Good night, sweet dreams! Shubh raatri!',
  },
  {
    from: /give ([^!?.]+) cozy bedtime cuddles[!?.]*/i,
    hi: '$1 को प्यार से सहलाओ!',
    phonetic: '$1 ko pyar se thap-thapao!',
  },
  {
    from: /tap the blanket to tuck ([^!?.]+) in[!?.]*/i,
    hi: 'कंबल ओढ़ाओ ताकि $1 सो जाए!',
    phonetic: 'Blanket odhao taaki $1 so jaye!',
  },
  {
    from: /([^!?.]+) is getting sleepy! give bedtime cuddles[!?.]*/i,
    hi: '$1 को नींद आ रही है! प्यार से सुलाओ!',
    phonetic: '$1 ko neend aa rahi hai! Pyar se sulao!',
  },

  // Playroom: Detective
  {
    from: /detective ([^!]+)! search through the moving numbers to find letter ([^!?.]+)[!?.]*/i,
    hi: 'जासूस $1! डिब्बे में से अक्षर $2 ढूंढो!',
    phonetic: 'Detective $1! Box mein se letter $2 dhoondo!',
  },
  {
    from: /detective ([^!]+)! search the moving numbers to find letter ([^!?.]+)[!?.]*/i,
    hi: 'जासूस $1! डिब्बे में से अक्षर $2 ढूंढो!',
    phonetic: 'Detective $1! Box mein se letter $2 dhoondo!',
  },
  {
    from: /search through the moving numbers to find letter ([^!?.]+)[!?.]*/i,
    hi: 'घूमते नंबरों में से अक्षर $1 ढूंढो!',
    phonetic: 'Moving numbers mein se letter $1 dhoondo!',
  },
  {
    from: /search the moving numbers to find letter ([^!?.]+)[!?.]*/i,
    hi: 'घूमते नंबरों में से अक्षर $1 ढूंढो!',
    phonetic: 'Moving numbers mein se letter $1 dhoondo!',
  },
  {
    from: /incredible! you earned the alphabet master trophy!?/i,
    hi: 'कमाल कर दिया! अल्फ़ाबेट मास्टर ट्रॉफी आपकी हुई!',
    phonetic: 'Kamaal kar diya! Alphabet Master trophy aapki hui!',
  },
  {
    from: /great detective work! you found letter ([^!?.]+)[!?.]*/i,
    hi: 'बहुत बढ़िया! आपने अक्षर $1 ढूंढ लिया!',
    phonetic: 'Bohot badhiya! Aapne letter $1 dhoond liya!',
  },
  {
    from: /that's number ([^!]+)! keep looking for letter ([^!?.]+)[!?.]*/i,
    hi: 'यह तो नंबर $1 है! अक्षर $2 ढूंढो!',
    phonetic: 'Yeh toh number $1 hai! Letter $2 dhoondo!',
  },
  {
    from: /that's letter ([^!]+)! find letter ([^!?.]+)[!?.]*/i,
    hi: 'यह अक्षर $1 है! हमें अक्षर $2 चाहिए!',
    phonetic: 'Yeh letter $1 hai! Humein letter $2 chahiye!',
  },

  // Playroom: Word Speller
  {
    from: /let's spell the word ([^!]+)! find letter ([^!?.]+)[!?.]*/i,
    hi: 'चलो शब्द $1 बनाते हैं! अक्षर $2 ढूंढो!',
    phonetic: "Let's spell the word $1! Find letter $2!",
  },
  {
    from: /we are spelling ([^!]+)! find the letter ([^!?.]+)[!?.]*/i,
    hi: 'हम शब्द $1 बना रहे हैं! अक्षर $2 ढूंढो!',
    phonetic: 'Hum spell kar rahe hain $1! Letter $2 dhoondo!',
  },
  {
    from: /spelling ([^!]+)! look for ([^!?.]+)[!?.]*/i,
    hi: '$1 की स्पेलिंग! अक्षर $2 को टैप करो!',
    phonetic: '$1 ki spelling! Letter $2 ko tap karo!',
  },
  {
    from: /amazing spelling! you spelled ([^!?.]+)[!?.]*/i,
    hi: 'वाह शाबाश! आपने $1 बना लिया!',
    phonetic: 'Waah shabash! Aapne $1 spell kar liya!',
  },
  {
    from: /that's ([^!]+)! we need ([^!?.]+) next[!?.]*/i,
    hi: 'यह $1 है! अब हमें $2 चाहिए!',
    phonetic: 'Yeh $1 hai! Abhi humein $2 chahiye!',
  },

  // Playroom: Counting
  {
    from: /pop the number balloons in order from 1 to 5! tap number ([^!?.]+)[!?.]*/i,
    hi: 'गुब्बारों को 1 से 5 के क्रम में फोड़ो! नंबर $1 पर टैप करो!',
    phonetic: 'Balloons ko 1 se 5 ke order mein pop karo! Number $1 tap karo!',
  },
  {
    from: /pop balloons in order from 1 to 5! tap number ([^!?.]+)[!?.]*/i,
    hi: 'गुब्बारों को 1 से 5 के क्रम में फोड़ो! नंबर $1 पर टैप करो!',
    phonetic: 'Balloons ko 1 se 5 ke order mein pop karo! Number $1 tap karo!',
  },
  {
    from: /pop balloon #?([^!?.]+) next[!?.]*/i,
    hi: 'अब गुब्बारा नंबर $1 फोड़ो!',
    phonetic: 'Ab balloon number $1 pop karo!',
  },
  {
    from: /super counting! you popped all 5 balloons!?/i,
    hi: 'कमाल कर दिया! सारे 5 गुब्बारे फोड़ दिए!',
    phonetic: 'Kamaal kar diya! Saare 5 balloons pop kar diye!',
  },
  {
    from: /pop balloon ([^!?.]+) first[!?.]*/i,
    hi: 'पहले गुब्बारा $1 फोड़ो!',
    phonetic: 'Pehle balloon $1 pop karo!',
  },

  // Playroom: Shapes
  {
    from: /find the ([^!]+) and put it in my toy box[!?.]*/i,
    hi: '$1 ढूंढो और मेरे खिलौनों के डिब्बे में डालो!',
    phonetic: '$1 dhoondo aur mere toy box mein daalo!',
  },
  {
    from: /yes! you found the ([^!]+)! into the toy box[!?.]*/i,
    hi: 'सही पकड़े! $1 मिल गया! खिलौनों के डिब्बे में डालो!',
    phonetic: 'Sahi pakde! $1 mil gaya! Toy box ke andar!',
  },
  {
    from: /that's a ([^!]+)! look for the ([^!?.]+)[!?.]*/i,
    hi: 'यह $1 है! हमें $2 ढूंढना है!',
    phonetic: 'Yeh $1 hai! Humein $2 dhoondna hai!',
  },

  // Playroom: Ball
  {
    from: /tap the beach ball to play catch with ([^!?.]+)[!?.]*/i,
    hi: 'बीच बॉल पर टैप करो और $1 के साथ कैच-कैच खेलो!',
    phonetic: 'Beach ball tap karo aur $1 ke saath catch-catch khelo!',
  },
  {
    from: /incredible! you earned the ball juggler trophy!?/i,
    hi: 'कमाल कर दिया! बॉल जगलर ट्रॉफी आपकी हुई!',
    phonetic: 'Kamaal kar diya! Ball Juggler trophy aapki hui!',
  },
  {
    from: /awesome catch!?/i,
    hi: 'वाह, क्या कैच है!',
    phonetic: 'Waah, kya catch hai!',
  },
  {
    from: /bounce bounce!?/i,
    hi: 'उछलो उछलो!',
    phonetic: 'Uchhlo uchhlo!',
  },
  {
    from: /wheee!?/i,
    hi: 'मज़ा आ गया!',
    phonetic: 'Wheee! Maza aa gaya!',
  },

  // Feeding & Kitchen
  {
    from: /touch the ([^!?.]+)[!?.]*/i,
    hi: '$1 को छुओ!',
    phonetic: '$1 ko touch karo!',
  },
  {
    from: /feed the ([^!?.]+)[!?.]*/i,
    hi: '$1 खिलाओ!',
    phonetic: '$1 khilao!',
  },
  {
    from: /find the letter ([^!?.]+)[!?.]*/i,
    hi: 'अक्षर $1 ढूंढो और खिलाओ!',
    phonetic: 'Letter $1 dhoondo aur khilao!',
  },
  {
    from: /find the number ([^!?.]+)[!?.]*/i,
    hi: 'नंबर $1 ढूंढो और खिलाओ!',
    phonetic: 'Number $1 dhoondo aur khilao!',
  },
  {
    from: /find the ([^!?.]+)[!?.]*/i,
    hi: '$1 ढूंढो!',
    phonetic: '$1 dhoondo!',
  },
  {
    from: /wow! the egg hatched! welcome ([^!?.]+)[!?.]*/i,
    hi: 'अरे वाह! अंडा फूट गया! स्वागत है $1!',
    phonetic: 'Arre waah! Anda phoot gaya! Welcome $1!',
  },
  {
    from: /hooray! ([^!]+) grew into a playful kid[!?.]*/i,
    hi: 'शाबाश! $1 अब बड़ा और नटखट हो गया है!',
    phonetic: 'Hooray! $1 ab bada ho gaya hai!',
  },
  {
    from: /amazing! ([^!]+) is now a full grown adult[!?.]*/i,
    hi: 'कमाल है! $1 अब पूरा बड़ा हो गया है!',
    phonetic: 'Kamaal hai! $1 ab bada ban gaya!',
  },
  {
    from: /i'm hungry! feed me ([^!?.]+)[!?.]*/i,
    hi: 'मुझे भूख लगी है! मुझे $1 खिलाओ!',
    phonetic: 'Mujhe bhookh lagi hai! $1 khilao!',
  },
  {
    from: /yum yum, delicious!?/i,
    hi: 'यम यम! बहुत स्वादिष्ट!',
    phonetic: 'Yum yum, bohot tasty hai!',
  },
  {
    from: /delicious!?/i,
    hi: 'बहुत स्वादिष्ट!',
    phonetic: 'Bohot swaadisht!',
  },
  {
    from: /yummy!?/i,
    hi: 'मज़ेदार!',
    phonetic: 'Mazedaar!',
  },
  {
    from: /great job!?/i,
    hi: 'शाबाश!',
    phonetic: 'Shabash!',
  },
  {
    from: /awesome!?/i,
    hi: 'बहुत बढ़िया!',
    phonetic: 'Bohot badhiya!',
  },
  {
    from: /super!?/i,
    hi: 'कमाल!',
    phonetic: 'Kamaal!',
  },
  {
    from: /hooray!?/i,
    hi: 'हुर्रे!',
    phonetic: 'Hooray!',
  },
  {
    from: /oops, try again!?/i,
    hi: 'अरे, दोबारा कोशिश करो!',
    phonetic: 'Arre, dubara try karo!',
  },
  {
    from: /try another one!?/i,
    hi: 'कोई और चुनो!',
    phonetic: 'Koi aur try karo!',
  },
  {
    from: /oopsie! let's find ([^!?.]+)[!?.]*/i,
    hi: 'अरे! चलो $1 ढूंढें!',
    phonetic: 'Arre! Chalo $1 dhoondein!',
  },
  {
    from: /hehe, that tickles! try ([^!?.]+)[!?.]*/i,
    hi: 'गुदगुदी हुई! $1 खिलाओ!',
    phonetic: 'Hehe, gudgudi hui! $1 try karo!',
  },
  {
    from: /almost! can you find ([^!?.]+)[!?.]*/i,
    hi: 'बहुत करीब! क्या आप $1 ढूंढ सकते हैं?',
    phonetic: 'Bohot paas! Kya aap $1 dhoond sakte ho?',
  },

  // Pet greetings & sounds
  { from: /roar! let's eat tasty snacks!?/i, hi: 'रोर! चलो स्वादिष्ट खाना खाते हैं!', phonetic: 'Roar! Chalo yummy snacks khate hain!' },
  { from: /hop hop! i love yummy treats!?/i, hi: 'हॉप हॉप! मुझे खाना बहुत पसंद है!', phonetic: 'Hop hop! Mujhe treats bohot pasand hain!' },
  { from: /woof woof! i love treats!?/i, hi: 'वूफ़ वूफ़! मुझे खाना खिलाओ!', phonetic: 'Woof woof! Mujhe tasty treats khilao!' },
  { from: /meow meow! purrfect snack!?/i, hi: 'म्याऊँ म्याऊँ! बहुत बढ़िया खाना!', phonetic: 'Meow meow! Bohot mazedaar snack!' },
  { from: /chomp chomp! tasty bamboo!?/i, hi: 'चॉम्प चॉम्प! स्वादिष्ट बैम्बू!', phonetic: 'Chomp chomp! Tasty bamboo khilao!' },
  { from: /yip yip! yummy berries!?/i, hi: 'यिप यिप! रसीली बेरियां!', phonetic: 'Yip yip! Yummy berries khilao!' },
  { from: /waddle waddle! tasty fish!?/i, hi: 'वैडल वैडल! स्वादिष्ट मछली!', phonetic: 'Waddle waddle! Tasty fish khilao!' },
  { from: /squeak squeak! crunchy seeds!?/i, hi: 'स्क्वीक स्क्वीक! कुरकुरे बीज!', phonetic: 'Squeak squeak! Crunchy seeds khilao!' },
  { from: /nom nom roar!?/i, hi: 'नम नम रोर! मज़ा आ गया!', phonetic: 'Nom nom roar! Mazaa aa gaya!' },
  { from: /munch munch squeak!?/i, hi: 'मंच मंच! बहुत स्वादिष्ट!', phonetic: 'Munch munch! Mazedaar!' },
];

export function toHindi(text, devanagari = true) {
  if (!text || typeof text !== 'string') return text;
  const str = text.trim();

  for (const item of HINDI_TRANSLATIONS) {
    if (item.from.test(str)) {
      const template = devanagari ? item.hi : item.phonetic;
      return str.replace(item.from, template);
    }
  }

  // Phonics hints: e.g. "C - A - T spells Cat!"
  const phonicsMatch = str.match(/^([A-Z]\s*-\s*[A-Z].*?)\s+spells\s+([A-Za-z]+)!?$/i);
  if (phonicsMatch) {
    const word = phonicsMatch[2];
    const hindiWord =
      {
        cat: devanagari ? 'बिल्ली' : 'Billi',
        dog: devanagari ? 'कुत्ता' : 'Kutta',
        sun: devanagari ? 'सूरज' : 'Sun',
        star: devanagari ? 'तारा' : 'Star',
        fish: devanagari ? 'मछली' : 'Machhli',
        bird: devanagari ? 'चिड़िया' : 'Chidiya',
        ball: devanagari ? 'गेंद' : 'Ball',
        duck: devanagari ? 'बतख' : 'Batakh',
      }[word.toLowerCase()] || word;

    if (devanagari) {
      return `${phonicsMatch[1]} बनता है ${word}, यानी ${hindiWord}!`;
    }
    return `${phonicsMatch[1]} banta hai ${word}, yaani ${hindiWord}!`;
  }

  return str;
}

// Backward compatibility helper
export function toHinglish(text) {
  return toHindi(text, false);
}

// ==========================================
// VOICE SYNTHESIS ENGINE
// Seamlessly handles:
// 1. Native Hindi (hi-IN) with Devanagari text
// 2. Indian English (en-IN) with Phonetic text
// 3. Fallback English with error recovery
// 4. Chrome audio resume & GC protection
// ==========================================

let cachedHindiVoice = null;
let cachedIndianEnglishVoice = null;
let cachedEnglishVoice = null;
let currentLanguage = 'en';

try {
  if (typeof window !== 'undefined') {
    const savedLang = localStorage.getItem('magic_pet_feeder_lang');
    if (savedLang === 'hi' || savedLang === 'hindi' || savedLang === 'hinglish') {
      currentLanguage = 'hi';
    } else if (savedLang === 'en') {
      currentLanguage = 'en';
    }
  }
} catch (e) {}

export function setAudioLanguage(lang) {
  currentLanguage = lang === 'hi' || lang === 'hindi' || lang === 'hinglish' ? 'hi' : 'en';
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('magic_pet_feeder_lang', currentLanguage);
    }
  } catch (e) {}
}

export function getAudioLanguage() {
  return currentLanguage === 'hinglish' || currentLanguage === 'hindi' ? 'hi' : currentLanguage;
}

function refreshVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return;

  // 1. Check for native Hindi voice (hi-IN, hi_IN, or name containing Hindi)
  cachedHindiVoice =
    voices.find(
      (v) =>
        (v.lang && (v.lang === 'hi-IN' || v.lang === 'hi_IN' || v.lang.toLowerCase().startsWith('hi'))) ||
        /hindi|kalpana|hemant|swara/i.test(v.name)
    ) || null;

  // 2. Check for Indian English voice (en-IN, or name indicating Indian origin)
  cachedIndianEnglishVoice =
    voices.find(
      (v) =>
        (v.lang && (v.lang === 'en-IN' || v.lang === 'en_IN' || v.lang.toLowerCase().startsWith('en-in'))) ||
        /india|neerja|heera|ravi|veena|rishi|lekha/i.test(v.name)
    ) || null;

  // 3. High quality English voice
  cachedEnglishVoice =
    voices.find(
      (v) =>
        v.lang &&
        v.lang.toLowerCase().startsWith('en') &&
        (v.name.includes('Natural') ||
          v.name.includes('Google') ||
          v.name.includes('Samantha') ||
          v.name.includes('Zira'))
    ) ||
    voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('en')) ||
    voices[0] ||
    null;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  refreshVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = refreshVoices;
  }
}

export function speakPetText(text, petVoice, langOverride) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    const requestedLang = langOverride || currentLanguage;
    const isHindi = requestedLang === 'hi' || requestedLang === 'hindi' || requestedLang === 'hinglish';

    refreshVoices();

    // Chrome audio engine unpause
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.cancel();

    setTimeout(() => {
      try {
        let chosenVoice = null;
        let chosenLang = 'en-US';
        let finalText = text;

        if (isHindi) {
          if (cachedHindiVoice) {
            // Native Hindi voice -> speak real Devanagari Hindi!
            chosenVoice = cachedHindiVoice;
            chosenLang = cachedHindiVoice.lang || 'hi-IN';
            finalText = toHindi(text, true);
          } else if (cachedIndianEnglishVoice) {
            // Indian English accent -> speak phonetic Hindi/Hinglish
            chosenVoice = cachedIndianEnglishVoice;
            chosenLang = cachedIndianEnglishVoice.lang || 'en-IN';
            finalText = toHindi(text, false);
          } else {
            // General English fallback -> speak phonetic Hindi
            chosenVoice = cachedEnglishVoice;
            chosenLang = cachedEnglishVoice?.lang || 'en-US';
            finalText = toHindi(text, false);
          }
        } else {
          chosenVoice = cachedEnglishVoice;
          chosenLang = cachedEnglishVoice?.lang || 'en-US';
          finalText = text;
        }

        const utterance = new SpeechSynthesisUtterance(finalText);
        if (chosenVoice) utterance.voice = chosenVoice;
        utterance.lang = chosenLang;
        utterance.pitch = petVoice?.pitch || 1.15;
        utterance.rate = isHindi ? 0.90 : (petVoice?.rate || 0.96);

        // Keep reference on window to prevent Chrome V8 garbage collection during speech
        window.__activePetUtterance = utterance;

        utterance.onend = () => {
          window.__activePetUtterance = null;
        };

        utterance.onerror = (errEvent) => {
          window.__activePetUtterance = null;
          console.warn('SpeechSynthesis playback warning:', errEvent);
          // Graceful fallback if device rejected Hindi language tag
          if (isHindi && (errEvent.error === 'language-unavailable' || errEvent.error === 'voice-unavailable')) {
            try {
              const fallbackUtterance = new SpeechSynthesisUtterance(toHindi(text, false));
              if (cachedEnglishVoice) fallbackUtterance.voice = cachedEnglishVoice;
              fallbackUtterance.lang = 'en-US';
              window.speechSynthesis.speak(fallbackUtterance);
            } catch (fbErr) {}
          }
        };

        window.speechSynthesis.speak(utterance);
      } catch (innerErr) {
        console.warn('Speech utterance error:', innerErr);
      }
    }, 20);
  } catch (e) {
    console.warn('Speech error:', e);
  }
}
