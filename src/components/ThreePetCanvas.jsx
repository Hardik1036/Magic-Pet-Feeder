import React, { useEffect, useRef } from 'react';
import { initPet } from '../utils/threePet.js';

export default function ThreePetCanvas({
  petId = 'dino',
  isNearFood = false,
  expression = 'idle',
  accessories = ['crown', 'glasses'],
  onPet,
  onTease,
  onError,
  className = 'w-full h-full',
}) {
  const canvasRef = useRef(null);
  const controllerRef = useRef(null);
  const onPetRef = useRef(onPet);
  const onTeaseRef = useRef(onTease);
  const onErrorRef = useRef(onError);
  const petIdRef = useRef(petId);

  // Keep callbacks fresh in refs without re-running Three.js effect
  useEffect(() => {
    onPetRef.current = onPet;
  }, [onPet]);

  useEffect(() => {
    onTeaseRef.current = onTease;
  }, [onTease]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let animId = null;
    let renderer = null;
    let controller = null;
    let ro = null;

    // Gracefully handle WebGL context loss
    const handleContextLost = (e) => {
      e.preventDefault();
      console.warn('WebGL context lost on ThreePetCanvas, triggering fallback.');
      onErrorRef.current?.();
    };
    canvas.addEventListener('webglcontextlost', handleContextLost, false);

    // Safely wait for window.THREE if still loading from CDN
    const initScene = () => {
      if (disposed || !canvas) return;

      const THREE = window.THREE;
      if (!THREE) {
        // Retry in 50ms if script is still downloading
        setTimeout(initScene, 50);
        return;
      }

      const parent = canvas.parentElement;
      const width = parent?.clientWidth || 240;
      const height = parent?.clientHeight || 240;

      // Dedicated Scene & Camera for the avatar
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
      camera.position.set(0, 1.7, 5.2);
      camera.lookAt(0, 1.25, 0);

      // WebGL Renderer with graceful error handling & verification
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        });
        const gl = renderer.getContext();
        if (!gl || gl.isContextLost?.()) {
          throw new Error('WebGL context is null or lost');
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(width, height, false); // false prevents layout thrashing
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      } catch (err) {
        console.warn('WebGL initialization failed, falling back to 2D:', err);
        onErrorRef.current?.();
        return;
      }

      // Studio Lighting
      const ambient = new THREE.AmbientLight(0xffffff, 0.85);
      scene.add(ambient);

      const sun = new THREE.DirectionalLight(0xfffbeb, 1.3);
      sun.position.set(4, 7, 5);
      sun.castShadow = true;
      scene.add(sun);

      const rim = new THREE.PointLight(0x38bdf8, 2.2, 10);
      rim.position.set(-3, 3, -3);
      scene.add(rim);

      const warmFill = new THREE.PointLight(0xfbbf24, 1.5, 8);
      warmFill.position.set(3, 2, -2);
      scene.add(warmFill);

      // Ground shadow disk
      const shadowGeo = new THREE.CircleGeometry(1.6, 24);
      const shadowMat = new THREE.MeshBasicMaterial({ color: 0x0f172a, transparent: true, opacity: 0.28 });
      const shadowDisk = new THREE.Mesh(shadowGeo, shadowMat);
      shadowDisk.rotation.x = -Math.PI / 2;
      shadowDisk.position.y = -0.15;
      scene.add(shadowDisk);

      // Initialize the modular 3D Pet!
      controller = initPet(scene, camera, canvas, {
        petId: petIdRef.current || 'dino',
        onPet: () => onPetRef.current?.(),
        onTease: () => onTeaseRef.current?.(),
      });
      controllerRef.current = controller;

      // Stable 60fps Animation Loop
      const clock = new THREE.Clock();
      const animate = () => {
        if (disposed) return;
        animId = requestAnimationFrame(animate);

        const delta = Math.min(clock.getDelta(), 0.1);
        const elapsed = clock.getElapsedTime();

        if (controller && controller.update) {
          controller.update(delta, elapsed);
        }

        if (renderer && scene && camera) {
          try {
            renderer.render(scene, camera);
          } catch (e) {
            console.warn('Error during render loop:', e);
            onErrorRef.current?.();
          }
        }
      };
      animate();

      // Stable ResizeObserver without infinite loops
      let lastW = width;
      let lastH = height;
      if (window.ResizeObserver && parent) {
        ro = new ResizeObserver((entries) => {
          if (disposed || !renderer) return;
          for (const entry of entries) {
            const nw = Math.floor(entry.contentRect.width);
            const nh = Math.floor(entry.contentRect.height);
            if (nw > 20 && nh > 20 && (nw !== lastW || nh !== lastH)) {
              lastW = nw;
              lastH = nh;
              camera.aspect = nw / nh;
              camera.updateProjectionMatrix();
              renderer.setSize(nw, nh, false);
            }
          }
        });
        ro.observe(parent);
      }
    };

    initScene();

    // Clean teardown preventing context leaks & event accumulation
    return () => {
      disposed = true;
      if (animId) cancelAnimationFrame(animId);
      if (ro) ro.disconnect();
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      if (controller && controller.destroy) {
        try { controller.destroy(); } catch (e) {}
      }
      if (renderer) {
        try {
          renderer.dispose();
        } catch (e) {}
      }
      controllerRef.current = null;
    };
  }, []); // Run ONCE on mount, NEVER on prop changes!

  // Dynamically swap pet species if petId changes without tearing down WebGL!
  useEffect(() => {
    petIdRef.current = petId;
    if (controllerRef.current?.setPet) {
      controllerRef.current.setPet(petId);
    }
  }, [petId]);

  // Toggle crown & sunglasses accessories
  useEffect(() => {
    if (controllerRef.current?.toggleAccessories) {
      controllerRef.current.toggleAccessories(accessories && accessories.length > 0);
    }
  }, [accessories]);

  // React to prop updates smoothly without rebuilding the scene
  useEffect(() => {
    if (controllerRef.current?.setNearFood) {
      controllerRef.current.setNearFood(isNearFood);
    }
  }, [isNearFood]);

  useEffect(() => {
    if (controllerRef.current) {
      if (expression === 'chewing') {
        controllerRef.current.feedSnack?.();
      } else if (expression === 'happy' || expression === 'sparkle') {
        controllerRef.current.teaseHop?.();
      }
    }
  }, [expression]);

  return (
    <canvas
      ref={canvasRef}
      className={`touch-none select-none outline-none cursor-grab active:cursor-grabbing ${className}`}
      style={{ touchAction: 'none' }}
    />
  );
}
