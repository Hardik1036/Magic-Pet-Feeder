/**
 * 3D Interactive Virtual Pet Engine (Three.js)
 * High-Polish, Professional 3D Models for ALL 8 Pets:
 * - Rexy the Dino (Dragon / Dino)
 * - Fluffy the Bunny (Star Bunny)
 * - Barnaby the Pup (Golden Pup)
 * - Mochi the Kitten (Cozy Kitten)
 * - Bao the Panda (Baby Panda)
 * - Pip the Fox (Woodland Fox)
 * - Pebble the Penguin (Arctic Penguin)
 * - Nugget the Hamster (Chubby Hamster)
 *
 * Features:
 * - Physics-driven squash & stretch petting (conservation of volume)
 * - 3D Heart particle fountains
 * - Autonomous teasing hops, wiggles, and tail wags
 * - Cursor head & pupil tracking
 * - Species-tuned Web Audio synthesizers (purr, bark, meow, chirp, squeak, chomp)
 * - Accessories: Gold Jewel Crown & Cool Sunglasses
 */

// ==========================================
// SHARED WEB AUDIO CONTEXT SINGLETON
// ==========================================
let _sharedAudioContext = null;
function getSharedAudioContext() {
  if (!_sharedAudioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) _sharedAudioContext = new AudioCtx();
  }
  if (_sharedAudioContext && _sharedAudioContext.state === 'suspended') {
    _sharedAudioContext.resume().catch(() => {});
  }
  return _sharedAudioContext;
}

// ==========================================
// PURE WEB AUDIO SYNTHESIZER FOR ALL SPECIES
// ==========================================
class PetAudioEngine {
  constructor(species = 'dino') {
    this.species = species;
    this.ctx = null;
    this.isMuted = false;
    this.purrOsc = null;
    this.purrSub = null;
    this.purrLfo = null;
    this.purrGain = null;
    this.isPurring = false;
  }

  setSpecies(species) {
    this.species = species;
  }

  init() {
    this.ctx = getSharedAudioContext();
  }

  startPurr() {
    if (this.isMuted || this.isPurring) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      this.isPurring = true;

      // Species-tuned base purr frequency
      let baseFreq = 46;
      let lfoFreq = 22;
      if (this.species === 'kitten') { baseFreq = 52; lfoFreq = 25; }
      else if (this.species === 'puppy') { baseFreq = 62; lfoFreq = 16; }
      else if (this.species === 'bunny' || this.species === 'hamster') { baseFreq = 78; lfoFreq = 30; }
      else if (this.species === 'panda') { baseFreq = 38; lfoFreq = 18; }
      else if (this.species === 'fox') { baseFreq = 58; lfoFreq = 24; }
      else if (this.species === 'penguin') { baseFreq = 50; lfoFreq = 20; }

      this.purrOsc = this.ctx.createOscillator();
      this.purrOsc.type = 'triangle';
      this.purrOsc.frequency.setValueAtTime(baseFreq, now);

      this.purrSub = this.ctx.createOscillator();
      this.purrSub.type = 'sine';
      this.purrSub.frequency.setValueAtTime(baseFreq * 0.6, now);

      this.purrLfo = this.ctx.createOscillator();
      this.purrLfo.type = 'sine';
      this.purrLfo.frequency.setValueAtTime(lfoFreq, now);

      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(0.35, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);

      this.purrGain = this.ctx.createGain();
      this.purrGain.gain.setValueAtTime(0.001, now);
      this.purrGain.gain.linearRampToValueAtTime(0.22, now + 0.12);

      this.purrLfo.connect(lfoGain.gain);
      this.purrOsc.connect(filter);
      this.purrSub.connect(filter);
      filter.connect(this.purrGain);
      this.purrGain.connect(this.ctx.destination);

      this.purrOsc.start(now);
      this.purrSub.start(now);
      this.purrLfo.start(now);
    } catch (e) {}
  }

  stopPurr() {
    if (!this.isPurring || !this.purrGain || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      this.purrGain.gain.linearRampToValueAtTime(0.001, now + 0.1);
      setTimeout(() => {
        try { if (this.purrOsc) { this.purrOsc.stop(); this.purrOsc.disconnect(); } } catch (e) {}
        try { if (this.purrSub) { this.purrSub.stop(); this.purrSub.disconnect(); } } catch (e) {}
        try { if (this.purrLfo) { this.purrLfo.stop(); this.purrLfo.disconnect(); } } catch (e) {}
        this.isPurring = false;
      }, 120);
    } catch (e) {
      this.isPurring = false;
    }
  }

  playSqueak(pitchModifier = 1.0) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      let startFreq = 620;
      let endFreq = 950;

      if (this.species === 'puppy') {
        // Playful puppy yip / bark
        osc.type = 'sawtooth';
        startFreq = 340;
        endFreq = 480;
      } else if (this.species === 'kitten') {
        // Sweet kitten mew
        osc.type = 'sine';
        startFreq = 680;
        endFreq = 880;
      } else if (this.species === 'bunny' || this.species === 'hamster') {
        osc.type = 'triangle';
        startFreq = 820;
        endFreq = 1200;
      } else if (this.species === 'penguin') {
        osc.type = 'square';
        startFreq = 420;
        endFreq = 600;
      } else {
        osc.type = 'triangle';
      }

      osc.frequency.setValueAtTime(startFreq * pitchModifier, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq * pitchModifier, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 0.8 * pitchModifier, now + 0.16);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) {}
  }

  playBoing() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.14);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.3);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  }

  playChomp() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [0, 0.08].forEach((delay) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + delay;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(240, t);
        osc.frequency.exponentialRampToValueAtTime(120, t + 0.06);

        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.07);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.07);
      });
    } catch (e) {}
  }

  playHeartPop() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const pitch = 940 + Math.random() * 320;
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(pitch * 1.5, now + 0.05);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  }
}

// ==========================================
// ACCESSORY BUILDERS (Gold Crown & Sunglasses)
// ==========================================
function buildCrown(THREE) {
  const crownGroup = new THREE.Group();
  crownGroup.name = 'Crown';
  crownGroup.position.set(0, 0.95, 0);

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xb45309,
    emissiveIntensity: 0.28,
    roughness: 0.2,
    metalness: 0.9,
  });
  const rubyMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.1, metalness: 0.5 });
  const emeraldMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.1, metalness: 0.5 });

  // Circlet ring
  const circlet = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.48, 0.18, 24, 1, true), goldMat);
  crownGroup.add(circlet);

  // 5 Crown Points with glowing jewels
  const pointCount = 5;
  for (let i = 0; i < pointCount; i++) {
    const angle = (i / pointCount) * Math.PI * 2;
    const px = Math.sin(angle) * 0.5;
    const pz = Math.cos(angle) * 0.5;

    const point = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.32, 6), goldMat);
    point.position.set(px, 0.22, pz);
    point.rotation.y = angle;
    crownGroup.add(point);

    const jewelMat = i % 2 === 0 ? rubyMat : emeraldMat;
    const jewel = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), jewelMat);
    jewel.position.set(px, 0.38, pz);
    crownGroup.add(jewel);
  }

  return crownGroup;
}

function buildSunglasses(THREE) {
  const sunglassGroup = new THREE.Group();
  sunglassGroup.name = 'Sunglasses';
  sunglassGroup.position.set(0, 0.08, 0.96);

  const glassesFrameMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.25, metalness: 0.7 });
  const glassesLensMat = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.05, metalness: 0.85, transparent: true, opacity: 0.94 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.2, metalness: 0.8 });

  const lensGeo = new THREE.BoxGeometry(0.42, 0.32, 0.06);
  const lensL = new THREE.Mesh(lensGeo, glassesLensMat);
  lensL.position.set(-0.34, 0, 0);
  const lensR = new THREE.Mesh(lensGeo, glassesLensMat);
  lensR.position.set(0.34, 0, 0);

  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.05, 0.05), goldMat);
  bridge.position.set(0, 0.05, -0.01);

  const templeL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.75), glassesFrameMat);
  templeL.position.set(-0.58, 0.03, -0.36);
  templeL.rotation.y = 0.2;

  const templeR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.75), glassesFrameMat);
  templeR.position.set(0.58, 0.03, -0.36);
  templeR.rotation.y = -0.2;

  sunglassGroup.add(lensL, lensR, bridge, templeL, templeR);
  return sunglassGroup;
}

// Helper: Pixar-style expressive eyes with specular highlights & eyelids
function createEyes(THREE, eyeSpacing = 0.44, eyeY = 0.08, eyeZ = 0.88, eyeScale = 0.28) {
  const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.12 });
  const eyePupilMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.08 });
  const eyeGlintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const blushMat = new THREE.MeshBasicMaterial({ color: 0xf472b6, transparent: true, opacity: 0.75 });

  const makeSingleEye = (side) => {
    const eyeCont = new THREE.Group();
    eyeCont.position.set(side * eyeSpacing, eyeY, eyeZ);

    const white = new THREE.Mesh(new THREE.SphereGeometry(eyeScale, 20, 16), eyeWhiteMat);
    white.scale.set(1.0, 1.15, 0.55);
    eyeCont.add(white);

    const pupilCont = new THREE.Group();
    pupilCont.position.set(0, 0, eyeScale * 0.5);
    eyeCont.add(pupilCont);

    const pupil = new THREE.Mesh(new THREE.SphereGeometry(eyeScale * 0.58, 16, 16), eyePupilMat);
    pupil.scale.set(1.0, 1.05, 0.25);
    pupilCont.add(pupil);

    const glint1 = new THREE.Mesh(new THREE.SphereGeometry(eyeScale * 0.22, 12, 12), eyeGlintMat);
    glint1.position.set(-eyeScale * 0.16, eyeScale * 0.2, eyeScale * 0.14);
    pupilCont.add(glint1);

    const glint2 = new THREE.Mesh(new THREE.SphereGeometry(eyeScale * 0.1, 10, 10), eyeGlintMat);
    glint2.position.set(eyeScale * 0.18, -eyeScale * 0.15, eyeScale * 0.14);
    pupilCont.add(glint2);

    const eyelid = new THREE.Mesh(new THREE.SphereGeometry(eyeScale * 1.05, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.52), eyePupilMat);
    eyelid.rotation.x = -Math.PI / 2;
    eyelid.position.set(0, eyeScale * 0.35, eyeScale * 0.1);
    eyelid.scale.set(1.0, 0.001, 1.0);
    eyeCont.add(eyelid);

    return { eyeCont, pupilCont, eyelid };
  };

  const leftEye = makeSingleEye(-1);
  const rightEye = makeSingleEye(1);

  // Blushing cheeks
  const blushGeo = new THREE.CircleGeometry(0.18, 16);
  const blushL = new THREE.Mesh(blushGeo, blushMat);
  blushL.position.set(-eyeSpacing * 1.35, eyeY - 0.24, eyeZ - 0.05);
  blushL.rotation.y = -0.3;

  const blushR = new THREE.Mesh(blushGeo, blushMat);
  blushR.position.set(eyeSpacing * 1.35, eyeY - 0.24, eyeZ - 0.05);
  blushR.rotation.y = 0.3;

  return { leftEye, rightEye, blushL, blushR };
}

// ==========================================
// MASTER 3D PET FACTORY (ALL 8 SPECIES)
// ==========================================
export function buildPet(THREE, petId = 'dino') {
  const petGroup = new THREE.Group();
  petGroup.name = `Pet_${petId}`;

  // Species Color Definitions
  const PALETTES = {
    dino: { skin: 0x10b981, belly: 0xbbf7d0, accent: 0xf97316, dark: 0x065f46 },
    bunny: { skin: 0xf472b6, belly: 0xffffff, accent: 0xfb7185, dark: 0x831843 },
    puppy: { skin: 0xf59e0b, belly: 0xfef3c7, accent: 0xb45309, dark: 0x451a03 },
    kitten: { skin: 0xa855f7, belly: 0xf3e8ff, accent: 0xc084fc, dark: 0x3b0764 },
    panda: { skin: 0xf8fafc, belly: 0xffffff, accent: 0x0f172a, dark: 0x0f172a },
    fox: { skin: 0xea580c, belly: 0xffffff, accent: 0x0f172a, dark: 0x7c2d12 },
    penguin: { skin: 0x0f172a, belly: 0xffffff, accent: 0xf97316, dark: 0x0284c7 },
    hamster: { skin: 0xd97706, belly: 0xfef3c7, accent: 0xfde68a, dark: 0x78350f },
  };

  const pal = PALETTES[petId] || PALETTES.dino;

  const skinMat = new THREE.MeshStandardMaterial({ color: pal.skin, roughness: 0.36, metalness: 0.05 });
  const bellyMat = new THREE.MeshStandardMaterial({ color: pal.belly, roughness: 0.4, metalness: 0.02 });
  const accentMat = new THREE.MeshStandardMaterial({ color: pal.accent, roughness: 0.32, metalness: 0.08 });
  const darkMat = new THREE.MeshStandardMaterial({ color: pal.dark, roughness: 0.3 });
  const noseMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.2 });
  const pinkMat = new THREE.MeshStandardMaterial({ color: 0xfb7185, roughness: 0.4 });

  const root = new THREE.Group();
  petGroup.add(root);

  // --- Body ---
  const bodyGroup = new THREE.Group();
  root.add(bodyGroup);

  const bodyScale = petId === 'hamster' || petId === 'panda' ? [1.18, 1.15, 1.1] : [1.05, 1.16, 0.96];
  const bodyMesh = new THREE.Mesh(new THREE.SphereGeometry(1.0, 32, 24), skinMat);
  bodyMesh.scale.set(...bodyScale);
  bodyMesh.position.set(0, 1.22, 0);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  bodyGroup.add(bodyMesh);

  // Belly
  const bellyMesh = new THREE.Mesh(new THREE.SphereGeometry(0.74, 24, 18), bellyMat);
  bellyMesh.scale.set(0.85, 1.05, 0.42);
  bellyMesh.position.set(0, 1.12, 0.65);
  bodyGroup.add(bellyMesh);

  // Species-specific body details
  if (petId === 'dino') {
    // Dorsal dinosaur spots
    [[-0.4, 1.55, -0.65], [0.42, 1.4, -0.68], [-0.3, 1.1, -0.75], [0.3, 1.0, -0.72]].forEach((p) => {
      const spot = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), accentMat);
      spot.scale.set(1.0, 0.7, 0.3);
      spot.position.set(...p);
      bodyGroup.add(spot);
    });
  } else if (petId === 'panda') {
    // Panda black shoulder vest
    const vest = new THREE.Mesh(new THREE.CylinderGeometry(1.08, 1.12, 0.65, 24, 1, true), darkMat);
    vest.position.set(0, 1.35, 0);
    bodyGroup.add(vest);
  }

  // --- PROPER ARMS & HANDS AVATAR RIGGING ---
  const clawMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.22, metalness: 0.1 });
  const pawPadMat = (petId === 'fox' || petId === 'panda' || petId === 'penguin') ? pinkMat : (petId === 'dino' ? accentMat : pinkMat);

  function buildArm(side) {
    const armGroup = new THREE.Group();
    armGroup.name = side === -1 ? 'Arm_L' : 'Arm_R';
    armGroup.position.set(side * 0.82, 1.44, 0.14);
    root.add(armGroup);

    // Shoulder deltoid joint
    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 14), armMat);
    shoulder.castShadow = true;
    armGroup.add(shoulder);

    if (petId === 'penguin') {
      // Articulated penguin flipper arm with elbow and wing-tip fingers
      const upperWing = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.22, 0.42, 12), darkMat);
      upperWing.position.set(0, -0.2, 0);
      upperWing.scale.set(0.4, 1.0, 1.1);
      upperWing.castShadow = true;
      armGroup.add(upperWing);

      const elbowGroup = new THREE.Group();
      elbowGroup.position.set(0, -0.38, 0);
      armGroup.add(elbowGroup);

      const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.2, 0.44, 12), darkMat);
      forearm.position.set(0, -0.22, 0);
      forearm.scale.set(0.35, 1.0, 1.2);
      forearm.castShadow = true;
      elbowGroup.add(forearm);

      const handGroup = new THREE.Group();
      handGroup.position.set(0, -0.42, 0);
      elbowGroup.add(handGroup);

      [-0.06, 0, 0.06].forEach((fx, fi) => {
        const finger = new THREE.Mesh(new THREE.ConeGeometry(0.042, 0.16 + fi * 0.02, 8), darkMat);
        finger.position.set(fx, -0.06, 0);
        finger.rotation.z = Math.PI;
        handGroup.add(finger);
      });

      return { armGroup, elbowGroup, handGroup };
    }

    // Upper arm (humerus)
    const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.36, 14), armMat);
    upperArm.position.set(0, -0.18, 0);
    upperArm.castShadow = true;
    armGroup.add(upperArm);

    // Elbow Joint (hinge)
    const elbowGroup = new THREE.Group();
    elbowGroup.position.set(0, -0.36, 0.02);
    armGroup.add(elbowGroup);

    const elbowMesh = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 12), armMat);
    elbowMesh.castShadow = true;
    elbowGroup.add(elbowMesh);

    // Forearm
    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.32, 14), armMat);
    forearm.position.set(0, -0.16, 0.04);
    forearm.rotation.x = -0.15;
    forearm.castShadow = true;
    elbowGroup.add(forearm);

    // Wrist & Hand Group
    const handGroup = new THREE.Group();
    handGroup.position.set(0, -0.32, 0.08);
    elbowGroup.add(handGroup);

    // Palm / Hand Base
    const palm = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 14), armMat);
    palm.scale.set(1.1, 0.8, 0.7);
    palm.castShadow = true;
    handGroup.add(palm);

    // Large central paw pad
    const palmPad = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 10), pawPadMat);
    palmPad.scale.set(1.1, 0.85, 0.3);
    palmPad.position.set(0, -0.02, 0.12);
    handGroup.add(palmPad);

    // Thumb with thumb pad / claw
    const thumbGroup = new THREE.Group();
    thumbGroup.position.set(side * -0.14, 0.02, 0.06);
    thumbGroup.rotation.z = side * -0.4;
    thumbGroup.rotation.x = -0.2;
    handGroup.add(thumbGroup);

    const thumbPhalanx = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 10), armMat);
    thumbPhalanx.scale.set(0.9, 1.2, 0.9);
    thumbGroup.add(thumbPhalanx);

    if (petId === 'dino') {
      const thumbClaw = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.14, 8), clawMat);
      thumbClaw.rotation.x = -Math.PI / 2;
      thumbClaw.position.set(0, -0.06, 0.08);
      thumbGroup.add(thumbClaw);
    } else {
      const thumbPad = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), pawPadMat);
      thumbPad.position.set(0, 0, 0.07);
      thumbGroup.add(thumbPad);
    }

    // 3 Articulated Fingers
    [-0.1, 0, 0.1].forEach((fx, fi) => {
      const fingerGroup = new THREE.Group();
      fingerGroup.position.set(fx, -0.14, 0.04);
      fingerGroup.rotation.x = -0.2;
      handGroup.add(fingerGroup);

      const phalanx = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), armMat);
      phalanx.scale.set(0.9, 1.3, 0.85);
      phalanx.position.set(0, -0.04, 0);
      fingerGroup.add(phalanx);

      if (petId === 'dino') {
        const fingerClaw = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.15, 8), clawMat);
        fingerClaw.rotation.x = -Math.PI / 2 - 0.2;
        fingerClaw.position.set(0, -0.1, 0.06);
        fingerGroup.add(fingerClaw);
      } else {
        const toeBean = new THREE.Mesh(new THREE.SphereGeometry(0.042, 8, 8), pawPadMat);
        toeBean.position.set(0, -0.04, 0.06);
        fingerGroup.add(toeBean);
      }
    });

    return { armGroup, elbowGroup, handGroup };
  }

  // --- PROPER LEGS & FEET AVATAR RIGGING ---
  function buildLeg(side) {
    const legGroup = new THREE.Group();
    legGroup.name = side === -1 ? 'Leg_L' : 'Leg_R';
    legGroup.position.set(side * 0.62, 0.68, 0.08);
    root.add(legGroup);

    // Smooth hip socket
    const hip = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 14), footColorMat);
    hip.castShadow = true;
    legGroup.add(hip);

    // Thigh (femur)
    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.4, 14), footColorMat);
    thigh.position.set(0, -0.18, 0);
    thigh.castShadow = true;
    legGroup.add(thigh);

    // Knee joint (patella)
    const kneeGroup = new THREE.Group();
    kneeGroup.position.set(0, -0.38, 0.04);
    legGroup.add(kneeGroup);

    const kneeMesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 12), footColorMat);
    kneeMesh.castShadow = true;
    kneeGroup.add(kneeMesh);

    // Shin (tibia / lower leg)
    const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.34, 14), footColorMat);
    shin.position.set(0, -0.16, 0.02);
    shin.castShadow = true;
    kneeGroup.add(shin);

    // Ankle & Foot Group
    const footGroup = new THREE.Group();
    footGroup.position.set(0, -0.32, 0.08);
    kneeGroup.add(footGroup);

    if (petId === 'penguin') {
      // 3 Webbed penguin toes
      const footBase = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.12, 0.72), accentMat);
      footBase.position.set(0, 0, 0.2);
      footBase.castShadow = true;
      footGroup.add(footBase);

      [-0.18, 0, 0.18].forEach((tx, ti) => {
        const toe = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.32, 8), accentMat);
        toe.rotation.x = Math.PI / 2;
        toe.position.set(tx, -0.02, 0.52);
        footGroup.add(toe);
      });

      return { legGroup, kneeGroup, footGroup };
    }

    // Foot base with heel & arch
    const heel = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 14), footColorMat);
    heel.scale.set(0.9, 0.55, 1.25);
    heel.position.set(0, -0.02, 0.15);
    heel.castShadow = true;
    footGroup.add(heel);

    // Bottom main paw pad
    const bottomPad = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 10), pawPadMat);
    bottomPad.scale.set(1.2, 0.25, 1.0);
    bottomPad.position.set(0, -0.11, 0.15);
    footGroup.add(bottomPad);

    // 3 Articulated forward toes
    [-0.15, 0, 0.15].forEach((tx, ti) => {
      const toeGroup = new THREE.Group();
      toeGroup.position.set(tx, -0.02, 0.38);
      footGroup.add(toeGroup);

      const toeMesh = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 10), footColorMat);
      toeMesh.scale.set(0.95, 0.75, 1.25);
      toeGroup.add(toeMesh);

      if (petId === 'dino') {
        const talon = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.25, 8), clawMat);
        talon.rotation.x = Math.PI / 2 + 0.15;
        talon.position.set(0, -0.04, 0.2);
        talon.castShadow = true;
        toeGroup.add(talon);
      } else {
        const toeBean = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), pawPadMat);
        toeBean.position.set(0, -0.08, 0.06);
        toeGroup.add(toeBean);
      }
    });

    return { legGroup, kneeGroup, footGroup };
  }

  const armL = buildArm(-1);
  const armR = buildArm(1);
  const legL = buildLeg(-1);
  const legR = buildLeg(1);

  const armGroupL = armL.armGroup;
  const armGroupR = armR.armGroup;
  const elbowGroupL = armL.elbowGroup;
  const elbowGroupR = armR.elbowGroup;
  const handGroupL = armL.handGroup;
  const handGroupR = armR.handGroup;

  const legGroupL = legL.legGroup;
  const legGroupR = legR.legGroup;
  const kneeGroupL = legL.kneeGroup;
  const kneeGroupR = legR.kneeGroup;
  const footGroupL = legL.footGroup;
  const footGroupR = legR.footGroup;

  // --- Tail ---
  const tailRoot = new THREE.Group();
  tailRoot.position.set(0, 0.85, -0.72);
  root.add(tailRoot);

  const tailMid = new THREE.Group();
  tailMid.position.set(0, -0.05, -0.45);
  tailRoot.add(tailMid);

  const tailTip = new THREE.Group();
  tailTip.position.set(0, 0.05, -0.4);
  tailMid.add(tailTip);

  let earL = null;
  let earR = null;

  if (petId === 'dino') {
    // Tapered spiked dino tail
    const t1 = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.52, 0.55, 14), skinMat);
    t1.rotation.x = -Math.PI / 2;
    tailRoot.add(t1);

    const t2 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.32, 0.5, 14), skinMat);
    t2.rotation.x = -Math.PI / 2;
    tailMid.add(t2);

    const t3 = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.45, 12), skinMat);
    t3.rotation.x = -Math.PI / 2;
    tailTip.add(t3);

    // Orange dorsal tail spikes
    const sGeo = new THREE.ConeGeometry(0.11, 0.26, 8);
    const s1 = new THREE.Mesh(sGeo, accentMat);
    s1.position.set(0, 0.32, -0.18);
    s1.rotation.x = -0.3;
    tailRoot.add(s1);

    const s2 = new THREE.Mesh(sGeo, accentMat);
    s2.position.set(0, 0.22, -0.15);
    s2.rotation.x = -0.4;
    tailMid.add(s2);
  } else if (petId === 'bunny') {
    // Fluffy round white cotton-ball tail
    const cottonTail = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), bellyMat);
    cottonTail.position.set(0, 0.1, -0.15);
    tailRoot.add(cottonTail);
  } else if (petId === 'puppy') {
    // Wagging golden puppy tail with white tip
    const pupTail = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.18, 0.65, 12), skinMat);
    pupTail.rotation.x = -Math.PI / 3;
    pupTail.position.set(0, 0.25, -0.25);
    tailRoot.add(pupTail);

    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), bellyMat);
    tip.position.set(0, 0.52, -0.4);
    tailRoot.add(tip);
  } else if (petId === 'kitten') {
    // Curled graceful cat tail
    const catTail = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.09, 12, 24, Math.PI * 0.9), skinMat);
    catTail.rotation.y = Math.PI / 2;
    catTail.position.set(0, 0.32, -0.2);
    tailRoot.add(catTail);
  } else if (petId === 'fox') {
    // Giant bushy orange tail with white tip
    const foxTail = new THREE.Mesh(new THREE.SphereGeometry(0.36, 18, 16), skinMat);
    foxTail.scale.set(1.0, 1.4, 2.2);
    foxTail.rotation.x = -0.6;
    foxTail.position.set(0, 0.25, -0.45);
    tailRoot.add(foxTail);

    const foxTip = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.45, 14), bellyMat);
    foxTip.rotation.x = -Math.PI / 2 - 0.4;
    foxTip.position.set(0, 0.52, -0.9);
    tailRoot.add(foxTip);
  } else if (petId === 'penguin' || petId === 'panda' || petId === 'hamster') {
    // Cute stubby tail
    const stubTail = new THREE.Mesh(new THREE.SphereGeometry(0.18, 14, 14), petId === 'panda' ? darkMat : skinMat);
    stubTail.position.set(0, 0.1, -0.15);
    tailRoot.add(stubTail);
  }

  // --- Big Cute Head (Interactive Patting Target) ---
  const headPivot = new THREE.Group();
  headPivot.position.set(0, 2.12, 0.15);
  root.add(headPivot);

  const headGroup = new THREE.Group();
  headPivot.add(headGroup);

  const headScale = petId === 'hamster' ? [1.25, 1.02, 1.1] : [1.14, 1.02, 1.08];
  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.96, 32, 24), skinMat);
  headMesh.scale.set(...headScale);
  headMesh.castShadow = true;
  headMesh.userData.isHead = true; // Raycasting hit target
  headGroup.add(headMesh);

  // Eyes & Blush
  const eyeSetup = createEyes(THREE, 0.44, 0.08, 0.88, 0.28);
  headGroup.add(
    eyeSetup.leftEye.eyeCont,
    eyeSetup.rightEye.eyeCont,
    eyeSetup.blushL,
    eyeSetup.blushR
  );

  // --- Species Specific Head Features (Ears, Muzzle, Cheeks, Beak) ---
  if (petId === 'dino') {
    // Dino Snout
    const snout = new THREE.Mesh(new THREE.SphereGeometry(0.68, 24, 20), skinMat);
    snout.scale.set(0.88, 0.65, 0.95);
    snout.position.set(0, -0.2, 0.85);
    snout.userData.isHead = true;
    headGroup.add(snout);

    // Nostrils
    [-0.18, 0.18].forEach((x) => {
      const nos = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), darkMat);
      nos.position.set(x, -0.08, 1.42);
      headGroup.add(nos);
    });

    // 2 Soft Orange Hornlets
    [-0.45, 0.45].forEach((x) => {
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.38, 8), accentMat);
      horn.position.set(x, 0.82, -0.1);
      horn.rotation.z = x > 0 ? -0.3 : 0.3;
      headGroup.add(horn);
    });
  } else if (petId === 'bunny') {
    // Tall Floppy Rabbit Ears
    const earGeo = new THREE.CylinderGeometry(0.11, 0.16, 1.35, 16);
    earGeo.scale(0.8, 1.0, 0.45);

    const earMeshL = new THREE.Mesh(earGeo, skinMat);
    earMeshL.position.set(-0.48, 1.35, -0.15);
    earMeshL.rotation.set(-0.25, 0, 0.25);

    const innerL = new THREE.Mesh(earGeo, pinkMat);
    innerL.scale.set(0.55, 0.85, 0.3);
    innerL.position.set(-0.48, 1.35, -0.11);
    innerL.rotation.set(-0.25, 0, 0.25);

    const earMeshR = new THREE.Mesh(earGeo, skinMat);
    earMeshR.position.set(0.48, 1.35, -0.15);
    earMeshR.rotation.set(-0.25, 0, -0.25);

    const innerR = new THREE.Mesh(earGeo, pinkMat);
    innerR.scale.set(0.55, 0.85, 0.3);
    innerR.position.set(0.48, 1.35, -0.11);
    innerR.rotation.set(-0.25, 0, -0.25);

    earL = earMeshL;
    earR = earMeshR;
    headGroup.add(earMeshL, innerL, earMeshR, innerR);

    // Cute pink bunny nose
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), pinkMat);
    nose.position.set(0, -0.12, 1.02);
    headGroup.add(nose);
  } else if (petId === 'puppy') {
    // Floppy puppy ears draping down
    const earGeo = new THREE.SphereGeometry(0.38, 18, 16);
    earGeo.scale(0.55, 1.15, 0.7);

    const earMeshL = new THREE.Mesh(earGeo, accentMat);
    earMeshL.position.set(-0.85, 0.45, 0.1);
    earMeshL.rotation.set(0.3, 0, 0.5);

    const earMeshR = new THREE.Mesh(earGeo, accentMat);
    earMeshR.position.set(0.85, 0.45, 0.1);
    earMeshR.rotation.set(0.3, 0, -0.5);

    earL = earMeshL;
    earR = earMeshR;
    headGroup.add(earMeshL, earMeshR);

    // Puppy snout with dark button nose
    const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.45, 18, 16), bellyMat);
    muzzle.scale.set(0.9, 0.65, 0.85);
    muzzle.position.set(0, -0.18, 0.88);
    headGroup.add(muzzle);

    const pupNose = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), noseMat);
    pupNose.position.set(0, -0.06, 1.16);
    headGroup.add(pupNose);

    // Playful pink tongue peeking out
    const tongue = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), pinkMat);
    tongue.scale.set(0.8, 0.35, 1.0);
    tongue.position.set(0.04, -0.28, 1.12);
    headGroup.add(tongue);
  } else if (petId === 'kitten') {
    // Perky triangular cat ears
    const earGeo = new THREE.ConeGeometry(0.32, 0.58, 4);
    earGeo.scale(1.0, 1.0, 0.5);

    const earMeshL = new THREE.Mesh(earGeo, skinMat);
    earMeshL.position.set(-0.58, 0.85, 0.05);
    earMeshL.rotation.set(-0.1, 0, 0.35);

    const earMeshR = new THREE.Mesh(earGeo, skinMat);
    earMeshR.position.set(0.58, 0.85, 0.05);
    earMeshR.rotation.set(-0.1, 0, -0.35);

    earL = earMeshL;
    earR = earMeshR;
    headGroup.add(earMeshL, earMeshR);

    // Kitten tiny pink heart nose
    const catNose = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), pinkMat);
    catNose.position.set(0, -0.1, 1.02);
    headGroup.add(catNose);
  } else if (petId === 'panda') {
    // Round glossy black panda ears
    const earGeo = new THREE.SphereGeometry(0.32, 16, 16);
    const earMeshL = new THREE.Mesh(earGeo, darkMat);
    earMeshL.position.set(-0.72, 0.78, 0);

    const earMeshR = new THREE.Mesh(earGeo, darkMat);
    earMeshR.position.set(0.72, 0.78, 0);

    earL = earMeshL;
    earR = earMeshR;
    headGroup.add(earMeshL, earMeshR);

    // Panda black eye patches
    [-0.44, 0.44].forEach((x) => {
      const patch = new THREE.Mesh(new THREE.SphereGeometry(0.34, 16, 12), darkMat);
      patch.scale.set(1.0, 1.15, 0.35);
      patch.position.set(x, 0.08, 0.78);
      patch.rotation.z = x > 0 ? -0.35 : 0.35;
      headGroup.add(patch);
    });

    const pandaNose = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), noseMat);
    pandaNose.position.set(0, -0.14, 1.02);
    headGroup.add(pandaNose);
  } else if (petId === 'fox') {
    // Pointed fox ears with dark tips
    const earGeo = new THREE.ConeGeometry(0.36, 0.7, 4);
    earGeo.scale(0.9, 1.0, 0.5);

    const earMeshL = new THREE.Mesh(earGeo, skinMat);
    earMeshL.position.set(-0.55, 0.88, 0.05);
    earMeshL.rotation.set(-0.15, 0, 0.32);

    const earMeshR = new THREE.Mesh(earGeo, skinMat);
    earMeshR.position.set(0.55, 0.88, 0.05);
    earMeshR.rotation.set(-0.15, 0, -0.32);

    earL = earMeshL;
    earR = earMeshR;
    headGroup.add(earMeshL, earMeshR);

    // White tapered fox muzzle
    const muzzle = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.65, 16), bellyMat);
    muzzle.rotation.x = Math.PI / 2;
    muzzle.position.set(0, -0.16, 1.05);
    headGroup.add(muzzle);

    const foxNose = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), darkMat);
    foxNose.position.set(0, -0.16, 1.38);
    headGroup.add(foxNose);
  } else if (petId === 'penguin') {
    // Penguin bright orange beak
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.45, 12), accentMat);
    beak.rotation.x = Math.PI / 2 + 0.1;
    beak.position.set(0, -0.15, 1.08);
    headGroup.add(beak);
  } else if (petId === 'hamster') {
    // Huge round puffy hamster cheeks
    const cheekGeo = new THREE.SphereGeometry(0.48, 18, 16);
    const cheekL = new THREE.Mesh(cheekGeo, accentMat);
    cheekL.position.set(-0.52, -0.22, 0.75);

    const cheekR = new THREE.Mesh(cheekGeo, accentMat);
    cheekR.position.set(0.52, -0.22, 0.75);
    headGroup.add(cheekL, cheekR);

    // Tiny pink hamster ears
    const earGeo = new THREE.SphereGeometry(0.22, 14, 12);
    const earMeshL = new THREE.Mesh(earGeo, pinkMat);
    earMeshL.position.set(-0.65, 0.72, 0.1);

    const earMeshR = new THREE.Mesh(earGeo, pinkMat);
    earMeshR.position.set(0.65, 0.72, 0.1);

    earL = earMeshL;
    earR = earMeshR;
    headGroup.add(earMeshL, earMeshR);

    const hamNose = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), pinkMat);
    hamNose.position.set(0, -0.08, 1.08);
    headGroup.add(hamNose);
  }

  // Accessories: Gold Crown & Sunglasses
  const crownGroup = buildCrown(THREE);
  const sunglassGroup = buildSunglasses(THREE);
  headGroup.add(crownGroup, sunglassGroup);

  return {
    group: petGroup,
    root,
    bodyGroup,
    headPivot,
    headGroup,
    headMesh,
    legGroupL,
    legGroupR,
    armGroupL,
    armGroupR,
    elbowGroupL,
    elbowGroupR,
    handGroupL,
    handGroupR,
    kneeGroupL,
    kneeGroupR,
    footGroupL,
    footGroupR,
    tailRoot,
    tailMid,
    tailTip,
    leftEye: eyeSetup.leftEye,
    rightEye: eyeSetup.rightEye,
    crownGroup,
    sunglassGroup,
    earL,
    earR,
  };
}

// ==========================================
// MODULAR initPet FUNCTION
// ==========================================
export function initPet(scene, camera, canvas, options = {}) {
  const THREE = window.THREE || options.THREE;
  if (!THREE || !scene || !camera || !canvas) {
    console.error('initPet requires Three.js, scene, camera, and canvas!');
    return null;
  }

  let currentPetId = options.petId || 'dino';
  const audio = new PetAudioEngine(currentPetId);
  let pet = buildPet(THREE, currentPetId);
  scene.add(pet.group);

  if (options.position) pet.group.position.copy(options.position);
  if (options.scale) pet.group.scale.setScalar(options.scale);

  // 3D Extruded Heart Particles
  const heartShape = new THREE.Shape();
  heartShape.moveTo(0, 0.3);
  heartShape.bezierCurveTo(0, 0.3, -0.3, 0.8, -0.7, 0.8);
  heartShape.bezierCurveTo(-1.1, 0.8, -1.1, 0.3, -1.1, 0.3);
  heartShape.bezierCurveTo(-1.1, -0.2, -0.6, -0.65, 0, -1.1);
  heartShape.bezierCurveTo(0.6, -0.65, 1.1, -0.2, 1.1, 0.3);
  heartShape.bezierCurveTo(1.1, 0.3, 1.1, 0.8, 0.7, 0.8);
  heartShape.bezierCurveTo(0.3, 0.8, 0, 0.3, 0, 0.3);

  const heartGeo = new THREE.ExtrudeGeometry(heartShape, {
    depth: 0.14,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.05,
    bevelThickness: 0.05,
  });
  heartGeo.scale(0.18, 0.18, 0.18);
  heartGeo.center();

  const heartColors = [0xf43f5e, 0xec4899, 0xfb7185, 0xfbbf24, 0xa855f7];
  const heartMats = heartColors.map(
    (c) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.45, roughness: 0.25 })
  );

  const activeHearts = [];
  const spawnHeart = (pos) => {
    const mat = heartMats[Math.floor(Math.random() * heartMats.length)];
    const heart = new THREE.Mesh(heartGeo, mat);
    heart.position.copy(pos);
    heart.position.x += (Math.random() - 0.5) * 0.7;
    heart.position.y += (Math.random() - 0.2) * 0.5;
    heart.position.z += (Math.random() - 0.5) * 0.7;
    heart.scale.setScalar(0.01);
    scene.add(heart);

    activeHearts.push({
      mesh: heart,
      vx: (Math.random() - 0.5) * 0.035,
      vy: 0.045 + Math.random() * 0.04,
      vz: (Math.random() - 0.5) * 0.035,
      rotSpeedX: (Math.random() - 0.5) * 0.08,
      rotSpeedY: (Math.random() - 0.5) * 0.08,
      targetScale: 0.4 + Math.random() * 0.5,
      life: 1.0,
      age: 0,
    });
    audio.playHeartPop();
  };

  // State
  let isPointerDown = false;
  let isPetting = false;
  let isTeasing = false;
  let teaseTime = 0;
  let targetSquashY = 1.0;
  let currentSquashY = 1.0;
  let targetLookX = 0;
  let targetLookY = 0;
  let lastHeartTime = 0;
  let autonomousTimer = 0;
  let nextTeaseInterval = 7.0 + Math.random() * 6.0;

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const checkHead = (evt) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((evt.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((evt.clientY - rect.top) / rect.height) * 2 + 1;
    mouse.set(x, y);

    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(pet.headGroup.children, true);
    return hits.some((h) => {
      let obj = h.object;
      while (obj) {
        if (obj.userData && obj.userData.isHead) return true;
        obj = obj.parent;
      }
      return false;
    });
  };

  const handlePointerDown = (evt) => {
    audio.init();
    isPointerDown = true;
    if (checkHead(evt)) {
      startPetting();
    } else {
      triggerTease();
    }
  };

  const handlePointerMove = (evt) => {
    const rect = canvas.getBoundingClientRect();
    const nx = ((evt.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -((evt.clientY - rect.top) / rect.height) * 2 + 1;
    mouse.set(nx, ny);

    targetLookY = THREE.MathUtils.clamp(nx * 0.55, -0.65, 0.65);
    targetLookX = THREE.MathUtils.clamp(-ny * 0.45, -0.45, 0.45);

    if (isPointerDown) {
      const onHead = checkHead(evt);
      if (onHead && !isPetting) {
        startPetting();
      } else if (!onHead && isPetting) {
        stopPetting();
      }
    }
  };

  const handlePointerUp = () => {
    isPointerDown = false;
    stopPetting();
  };

  function startPetting() {
    if (isPetting) return;
    isPetting = true;
    targetSquashY = 0.76;
    audio.startPurr();
    if (options.onPet) options.onPet();
  }

  function stopPetting() {
    if (!isPetting) return;
    isPetting = false;
    targetSquashY = 1.0;
    audio.stopPurr();
  }

  function triggerTease() {
    if (isTeasing) return;
    isTeasing = true;
    teaseTime = 0;
    audio.playSqueak(1.1);
    audio.playBoing();
    if (options.onTease) options.onTease();
  }

  canvas.addEventListener('pointerdown', handlePointerDown);
  window.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('pointerup', handlePointerUp);

  // Per-frame animation update
  const update = (delta, elapsed) => {
    autonomousTimer += delta;
    if (autonomousTimer > nextTeaseInterval && !isPetting && !isTeasing) {
      autonomousTimer = 0;
      nextTeaseInterval = 8.0 + Math.random() * 8.0;
      triggerTease();
    }

    // Heart particles
    for (let i = activeHearts.length - 1; i >= 0; i--) {
      const h = activeHearts[i];
      h.age += delta;
      h.mesh.position.x += h.vx;
      h.mesh.position.y += h.vy;
      h.mesh.position.z += h.vz;
      h.mesh.rotation.x += h.rotSpeedX;
      h.mesh.rotation.y += h.rotSpeedY;

      if (h.age < 0.2) {
        h.mesh.scale.setScalar((h.age / 0.2) * h.targetScale);
      } else {
        h.life -= delta * 0.9;
        h.mesh.scale.setScalar(Math.max(0.001, h.life * h.targetScale));
      }
      if (h.life <= 0 || h.mesh.position.y > 6.0) {
        scene.remove(h.mesh);
        activeHearts.splice(i, 1);
      }
    }

    if (isPetting && elapsed - lastHeartTime > 0.15) {
      spawnHeart(pet.headPivot.position);
      lastHeartTime = elapsed;
    }

    // Volume-preserving squash & stretch
    currentSquashY += (targetSquashY - currentSquashY) * 0.16;
    const vol = 1.0 / Math.sqrt(currentSquashY);
    pet.headPivot.scale.set(vol, currentSquashY, vol);

    // Look tracking
    pet.headGroup.rotation.y += (targetLookY - pet.headGroup.rotation.y) * 0.08;
    pet.headGroup.rotation.x += (targetLookX - pet.headGroup.rotation.x) * 0.08;

    // Pupil shifts
    if (pet.leftEye && pet.leftEye.pupilCont) {
      pet.leftEye.pupilCont.position.x = THREE.MathUtils.clamp(targetLookY * 0.12, -0.06, 0.06);
      pet.leftEye.pupilCont.position.y = THREE.MathUtils.clamp(-targetLookX * 0.1, -0.05, 0.05);
    }
    if (pet.rightEye && pet.rightEye.pupilCont) {
      pet.rightEye.pupilCont.position.x = THREE.MathUtils.clamp(targetLookY * 0.12, -0.06, 0.06);
      pet.rightEye.pupilCont.position.y = THREE.MathUtils.clamp(-targetLookX * 0.1, -0.05, 0.05);
    }

    // Squinting on pat
    if (isPetting) {
      if (pet.leftEye) pet.leftEye.eyelid.scale.y = 1.0;
      if (pet.rightEye) pet.rightEye.eyelid.scale.y = 1.0;
    } else {
      if (pet.leftEye) pet.leftEye.eyelid.scale.y = 0.001;
      if (pet.rightEye) pet.rightEye.eyelid.scale.y = 0.001;
    }

    // Subtle natural breathing
    const breath = Math.sin(elapsed * 2.2) * 0.032;
    pet.bodyGroup.scale.set(1.0 - breath * 0.4, 1.0 + breath, 1.0);

    // --- PROPER ARMS & HANDS ANIMATION ---
    if (isTeasing) {
      // Arms raised high waving happily
      pet.armGroupL.rotation.set(0, 0, 1.45 + Math.sin(elapsed * 12.0) * 0.25);
      pet.armGroupR.rotation.set(0, 0, -1.45 - Math.sin(elapsed * 12.0) * 0.25);
      if (pet.elbowGroupL) pet.elbowGroupL.rotation.x = -0.2;
      if (pet.elbowGroupR) pet.elbowGroupR.rotation.x = -0.2;
      if (pet.handGroupL) pet.handGroupL.rotation.z = Math.sin(elapsed * 18.0) * 0.4;
      if (pet.handGroupR) pet.handGroupR.rotation.z = -Math.sin(elapsed * 18.0) * 0.4;
    } else if (isNearFoodState) {
      // Reaching forward eagerly for the food treat!
      pet.armGroupL.rotation.set(-1.1 + Math.sin(elapsed * 6.0) * 0.08, 0, 0.2);
      pet.armGroupR.rotation.set(-1.1 - Math.sin(elapsed * 6.0) * 0.08, 0, -0.2);
      if (pet.elbowGroupL) pet.elbowGroupL.rotation.x = -0.25;
      if (pet.elbowGroupR) pet.elbowGroupR.rotation.x = -0.25;
      if (pet.handGroupL) pet.handGroupL.rotation.set(-0.35, 0, 0);
      if (pet.handGroupR) pet.handGroupR.rotation.set(-0.35, 0, 0);
    } else if (isPetting) {
      // Hands held gently at sides in bliss
      pet.armGroupL.rotation.set(0, 0, 0.55);
      pet.armGroupR.rotation.set(0, 0, -0.55);
      if (pet.elbowGroupL) pet.elbowGroupL.rotation.x = -0.5;
      if (pet.elbowGroupR) pet.elbowGroupR.rotation.x = -0.5;
    } else {
      // Idle natural breathing arm & hand sway
      pet.armGroupL.rotation.set(-0.18 + Math.sin(elapsed * 1.8) * 0.04, 0, 0.32 + Math.sin(elapsed * 2.2) * 0.04);
      pet.armGroupR.rotation.set(-0.18 - Math.sin(elapsed * 1.8) * 0.04, 0, -0.32 - Math.sin(elapsed * 2.2) * 0.04);
      if (pet.elbowGroupL) pet.elbowGroupL.rotation.x = -0.42 + Math.sin(elapsed * 2.2 + 0.3) * 0.04;
      if (pet.elbowGroupR) pet.elbowGroupR.rotation.x = -0.42 + Math.sin(elapsed * 2.2 + 0.3) * 0.04;
      if (pet.handGroupL) pet.handGroupL.rotation.y = Math.sin(elapsed * 1.6) * 0.06;
      if (pet.handGroupR) pet.handGroupR.rotation.y = -Math.sin(elapsed * 1.6) * 0.06;
    }

    // --- PROPER LEGS & FEET ANIMATION ---
    if (isTeasing) {
      teaseTime += delta * 4.6;
      const jump = Math.sin(teaseTime * Math.PI) * 1.35;
      if (jump > 0) {
        pet.root.position.y = jump;
        pet.root.rotation.y += delta * 3.8;
        pet.legGroupL.rotation.x = 0.5;
        pet.legGroupR.rotation.x = 0.5;
        if (pet.kneeGroupL) pet.kneeGroupL.rotation.x = 0.6;
        if (pet.kneeGroupR) pet.kneeGroupR.rotation.x = 0.6;
      } else {
        pet.root.position.y = 0;
        pet.legGroupL.rotation.x = 0;
        pet.legGroupR.rotation.x = 0;
        if (pet.kneeGroupL) pet.kneeGroupL.rotation.x = 0;
        if (pet.kneeGroupR) pet.kneeGroupR.rotation.x = 0;
        isTeasing = false;
      }
    } else if (isPetting) {
      // Squat knees slightly under head pat
      if (pet.kneeGroupL) pet.kneeGroupL.rotation.x = 0.35;
      if (pet.kneeGroupR) pet.kneeGroupR.rotation.x = 0.35;
      pet.legGroupL.position.y = 0.64;
      pet.legGroupR.position.y = 0.64;
    } else if (isNearFoodState) {
      // Excited little tippy-taps
      pet.legGroupL.position.y = 0.68 + Math.max(0, Math.sin(elapsed * 10.0) * 0.08);
      pet.legGroupR.position.y = 0.68 + Math.max(0, -Math.sin(elapsed * 10.0) * 0.08);
      if (pet.kneeGroupL) pet.kneeGroupL.rotation.x = 0.1;
      if (pet.kneeGroupR) pet.kneeGroupR.rotation.x = 0.1;
    } else {
      // Planted feet with subtle weight shift
      pet.legGroupL.position.y = 0.68 + Math.sin(elapsed * 2.2) * 0.01;
      pet.legGroupR.position.y = 0.68 - Math.sin(elapsed * 2.2) * 0.01;
      if (pet.kneeGroupL) pet.kneeGroupL.rotation.x = 0;
      if (pet.kneeGroupR) pet.kneeGroupR.rotation.x = 0;
    }

    // Tail Wag
    if (pet.tailRoot) {
      const wagSpeed = isPetting ? 12.0 : 3.8;
      pet.tailRoot.rotation.y = Math.sin(elapsed * wagSpeed) * 0.28;
      if (pet.tailMid) pet.tailMid.rotation.y = Math.sin(elapsed * wagSpeed - 0.5) * 0.35;
      if (pet.tailTip) pet.tailTip.rotation.y = Math.sin(elapsed * wagSpeed - 1.0) * 0.45;
    }

    // Ear wiggles on hops & pets
    if (pet.earL && pet.earR) {
      const earWiggle = Math.sin(elapsed * 3.5) * 0.06;
      pet.earL.rotation.z += (earWiggle - pet.earL.rotation.z) * 0.1;
      pet.earR.rotation.z += (-earWiggle - pet.earR.rotation.z) * 0.1;
    }
  };

  let isNearFoodState = false;

  // Controller API
  return {
    petGroup: pet.group,
    pet,
    audio,
    update,
    pat: startPetting,
    stopPat: stopPetting,
    teaseHop: triggerTease,
    feedSnack: () => {
      audio.playChomp();
      audio.playSqueak(0.9);
      targetSquashY = 0.82;
      setTimeout(() => { targetSquashY = 1.0; }, 280);
      spawnHeart(pet.headPivot.position);
    },
    setNearFood: (isNear) => {
      isNearFoodState = !!isNear;
      if (isNear) {
        pet.headGroup.rotation.x = -0.32;
      }
    },
    setPet: (newPetId) => {
      if (newPetId === currentPetId) return;
      currentPetId = newPetId;
      audio.setSpecies(newPetId);

      scene.remove(pet.group);
      pet = buildPet(THREE, newPetId);
      scene.add(pet.group);
    },
    toggleAccessories: (show) => {
      const s = show ? 1.0 : 0.001;
      if (pet.crownGroup) pet.crownGroup.scale.setScalar(s);
      if (pet.sunglassGroup) pet.sunglassGroup.scale.setScalar(s);
    },
    destroy: () => {
      audio.stopPurr();
      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      scene.remove(pet.group);
      activeHearts.forEach((h) => scene.remove(h.mesh));
    },
  };
}
