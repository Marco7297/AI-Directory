import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { 
  Sparkles, 
  Sliders, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Zap, 
  Waves, 
  Eye,
  Info
} from 'lucide-react';
import { reportAppError } from '../utils/errorReporting';

export type CreatureColorTheme = 'bioluminescent' | 'quantum' | 'plasma' | 'aurora' | 'chrome';

export interface NoomoLabsProps {
  className?: string;
  isBackground?: boolean;
  interactive?: boolean;
  initialTheme?: CreatureColorTheme;
  showControls?: boolean;
  onCloseFullscreen?: () => void;
}

const COLOR_PALETTES: Record<CreatureColorTheme, {
  name: string;
  primary: number;
  secondary: number;
  tertiary: number;
  particle: number;
  glowHex: string;
  badgeClass: string;
}> = {
  bioluminescent: {
    name: 'Bioluminescent Abyss',
    primary: 0x00f0ff,
    secondary: 0x0051ff,
    tertiary: 0x7b00ff,
    particle: 0x38bdf8,
    glowHex: '#00f0ff',
    badgeClass: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40'
  },
  quantum: {
    name: 'Quantum Nebula',
    primary: 0xd946ef,
    secondary: 0x8b5cf6,
    tertiary: 0x3b82f6,
    particle: 0xf472b6,
    glowHex: '#d946ef',
    badgeClass: 'text-fuchsia-400 border-fuchsia-500/40 bg-fuchsia-950/40'
  },
  plasma: {
    name: 'Solar Plasma',
    primary: 0xfbbf24,
    secondary: 0xf97316,
    tertiary: 0xef4444,
    particle: 0xfde047,
    glowHex: '#fbbf24',
    badgeClass: 'text-amber-400 border-amber-500/40 bg-amber-950/40'
  },
  aurora: {
    name: 'Cyber Aurora',
    primary: 0x10b981,
    secondary: 0x06b6d4,
    tertiary: 0x3b82f6,
    particle: 0x34d399,
    glowHex: '#10b981',
    badgeClass: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40'
  },
  chrome: {
    name: 'Prismatic Pearl',
    primary: 0xe0e7ff,
    secondary: 0xa5b4fc,
    tertiary: 0x38bdf8,
    particle: 0xffffff,
    glowHex: '#e0e7ff',
    badgeClass: 'text-indigo-200 border-indigo-400/40 bg-indigo-950/40'
  }
};

export const NoomoLabs3D: React.FC<NoomoLabsProps> = ({
  className = '',
  isBackground = false,
  interactive = true,
  initialTheme = 'bioluminescent',
  showControls = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Lab customization states
  const [theme, setTheme] = useState<CreatureColorTheme>(initialTheme);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [particleDensity, setParticleDensity] = useState<'low' | 'med' | 'high'>('med');
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);
  const [isHUDOpen, setIsHUDOpen] = useState<boolean>(!isBackground);
  const [isShockwaveActive, setIsShockwaveActive] = useState<boolean>(false);

  // Web Audio Context reference for organic sound synthesis
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play subtle organic synth chime
  const playInteractionChime = useCallback((freq = 440, type: OscillatorType = 'sine') => {
    if (!isAudioEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        void ctx.resume().catch((error: unknown) => reportAppError('Audio playback', error));
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.6);

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, ctx.currentTime + 0.5);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (error) {
      reportAppError('Audio synthesis', error);
    }
  }, [isAudioEnabled]);

  // Main Three.js Scene Setup & Animation Loop
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animationFrameId: number;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // 3. Dynamic Studio Lighting (Noomo Labs style)
    const ambientLight = new THREE.AmbientLight(0x050814, 2.5);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(COLOR_PALETTES[theme].primary, 8, 20);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(COLOR_PALETTES[theme].secondary, 10, 20);
    rimLight.position.set(-5, -4, -2);
    scene.add(rimLight);

    const coreLight = new THREE.PointLight(COLOR_PALETTES[theme].tertiary, 6, 15);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // 4. Group for the Creature
    const creatureGroup = new THREE.Group();
    scene.add(creatureGroup);

    // =========================================================================
    // CREATURE HEAD (ORGANIC TRANSLUCENT JELLYFISH BELL)
    // =========================================================================
    const headSegments = isWireframe ? 36 : 64;
    const headGeom = new THREE.SphereGeometry(1.6, headSegments, headSegments, 0, Math.PI * 2, 0, Math.PI * 0.65);
    
    // Store original vertex coordinates for continuous wave deformation
    const headPosAttr = headGeom.attributes.position;
    const originalHeadPositions = new Float32Array(headPosAttr.count * 3);
    for (let i = 0; i < headPosAttr.count * 3; i++) {
      originalHeadPositions[i] = headPosAttr.array[i];
    }

    const headMat = new THREE.MeshPhysicalMaterial({
      color: COLOR_PALETTES[theme].primary,
      emissive: COLOR_PALETTES[theme].secondary,
      emissiveIntensity: 0.35,
      metalness: 0.1,
      roughness: 0.15,
      transmission: 0.65,
      thickness: 1.2,
      transparent: true,
      opacity: 0.88,
      wireframe: isWireframe,
      side: THREE.DoubleSide
    });

    const headMesh = new THREE.Mesh(headGeom, headMat);
    headMesh.rotation.x = Math.PI; // Invert to bell dome shape
    creatureGroup.add(headMesh);

    // Internal Glowing Core (Heart/Nucleus)
    const coreGeom = new THREE.IcosahedronGeometry(0.55, 3);
    const coreMat = new THREE.MeshStandardMaterial({
      color: COLOR_PALETTES[theme].tertiary,
      emissive: COLOR_PALETTES[theme].primary,
      emissiveIntensity: 2.2,
      roughness: 0.2,
      metalness: 0.8
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    coreMesh.position.y = 0.2;
    creatureGroup.add(coreMesh);

    // Internal Core Glow Halo (Wireframe lattice)
    const haloGeom = new THREE.IcosahedronGeometry(0.85, 2);
    const haloMat = new THREE.MeshBasicMaterial({
      color: COLOR_PALETTES[theme].primary,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const haloMesh = new THREE.Mesh(haloGeom, haloMat);
    haloMesh.position.y = 0.2;
    creatureGroup.add(haloMesh);

    // =========================================================================
    // FLOWING TENTACLES (Procedural dynamic bezier tubes trailing below bell)
    // =========================================================================
    const NUM_TENTACLES = 12;
    const tentacleMeshes: THREE.Mesh[] = [];
    const tentacleBases: { x: number; z: number; phase: number; length: number }[] = [];

    const tentacleMat = new THREE.MeshStandardMaterial({
      color: COLOR_PALETTES[theme].secondary,
      emissive: COLOR_PALETTES[theme].primary,
      emissiveIntensity: 0.5,
      roughness: 0.3,
      metalness: 0.2,
      wireframe: isWireframe,
      transparent: true,
      opacity: 0.75
    });

    for (let i = 0; i < NUM_TENTACLES; i++) {
      const angle = (i / NUM_TENTACLES) * Math.PI * 2;
      const radius = 0.7 + (i % 2) * 0.45;
      const baseX = Math.cos(angle) * radius;
      const baseZ = Math.sin(angle) * radius;
      const length = 2.4 + (i % 3) * 0.8;

      tentacleBases.push({
        x: baseX,
        z: baseZ,
        phase: i * 0.5,
        length
      });

      // Simple cylinder that will be distorted dynamically
      const geom = new THREE.CylinderGeometry(0.04, 0.008, length, 8, 24);
      geom.translate(0, -length / 2, 0); // Origin at top attachment point
      const mesh = new THREE.Mesh(geom, tentacleMat);
      mesh.position.set(baseX, -0.1, baseZ);
      creatureGroup.add(mesh);
      tentacleMeshes.push(mesh);
    }

    // =========================================================================
    // BIOLUMINESCENT VOLUMETRIC PARTICLE CONSTELLATION
    // =========================================================================
    const particleCount = particleDensity === 'low' ? 700 : particleDensity === 'med' ? 1600 : 3200;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const baseColor = new THREE.Color(COLOR_PALETTES[theme].particle);
    const accentColor = new THREE.Color(COLOR_PALETTES[theme].primary);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      // Spherical distribution around creature
      const r = 1.2 + Math.random() * 6.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      particlePositions[idx] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[idx + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[idx + 2] = r * Math.cos(phi);

      particleVelocities[idx] = (Math.random() - 0.5) * 0.005;
      particleVelocities[idx + 1] = (Math.random() - 0.5) * 0.005;
      particleVelocities[idx + 2] = (Math.random() - 0.5) * 0.005;

      const mixed = baseColor.clone().lerp(accentColor, Math.random());
      particleColors[idx] = mixed.r;
      particleColors[idx + 1] = mixed.g;
      particleColors[idx + 2] = mixed.b;
    }

    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeom.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    // Circular particle texture generator
    const createParticleTexture = () => {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(0.3, 'rgba(255,255,255,0.7)');
        grad.addColorStop(0.7, 'rgba(255,255,255,0.15)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
      }
      return new THREE.CanvasTexture(c);
    };

    const particleMat = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      map: createParticleTexture(),
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // =========================================================================
    // INTERACTIVE MOUSE & TOUCH PHYSICS ENGINE
    // =========================================================================
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      velocity: 0,
      lastX: 0,
      lastY: 0
    };

    let shockwaveIntensity = 0;
    let clock = new THREE.Clock();

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);

      mouse.targetX = normX;
      mouse.targetY = normY;

      // Calculate cursor velocity
      const dx = clientX - mouse.lastX;
      const dy = clientY - mouse.lastY;
      mouse.velocity = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.05, 3.0);
      mouse.lastX = clientX;
      mouse.lastY = clientY;
    };

    const handlePointerDown = () => {
      if (!interactive) return;
      shockwaveIntensity = 1.8;
      setIsShockwaveActive(true);
      playInteractionChime(580 + Math.random() * 240, 'triangle');
      setTimeout(() => setIsShockwaveActive(false), 800);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    container.addEventListener('mousedown', handlePointerDown);
    container.addEventListener('touchstart', handlePointerDown, { passive: true });

    // Handle container resize
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // =========================================================================
    // RENDER ANIMATION TICK (60FPS procedural physics)
    // =========================================================================
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const delta = clock.getDelta();

      // 1. Smooth mouse damping / lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      // 2. Shockwave falloff
      if (shockwaveIntensity > 0.01) {
        shockwaveIntensity *= 0.94;
      } else {
        shockwaveIntensity = 0;
      }

      // 3. Creature Swimming Motion & Cursor Tracking
      // Creature swims gently and turns towards cursor direction
      const swimCycle = Math.sin(elapsedTime * 2.2);
      const swimExpansion = 1.0 + Math.max(0, swimCycle) * 0.18 + shockwaveIntensity * 0.35;
      const swimContraction = 1.0 - Math.max(0, -swimCycle) * 0.12;

      // Target position influenced by cursor
      const targetPosX = mouse.x * 1.8;
      const targetPosY = mouse.y * 1.2 + Math.sin(elapsedTime * 1.5) * 0.25;
      
      creatureGroup.position.x += (targetPosX - creatureGroup.position.x) * 0.04;
      creatureGroup.position.y += (targetPosY - creatureGroup.position.y) * 0.04;
      creatureGroup.position.z = Math.sin(elapsedTime * 0.8) * 0.3;

      // Tilt and roll according to movement speed
      const targetRotZ = -mouse.x * 0.6;
      const targetRotX = mouse.y * 0.45;
      creatureGroup.rotation.z += (targetRotZ - creatureGroup.rotation.z) * 0.05;
      creatureGroup.rotation.x += (targetRotX - creatureGroup.rotation.x) * 0.05;
      creatureGroup.rotation.y = elapsedTime * 0.25 + mouse.x * 0.4;

      // 4. Procedural Organic Vertex Deformation on Bell
      const pos = headMesh.geometry.attributes.position;
      const count = pos.count;
      for (let i = 0; i < count; i++) {
        const ox = originalHeadPositions[i * 3];
        const oy = originalHeadPositions[i * 3 + 1];
        const oz = originalHeadPositions[i * 3 + 2];

        // Multi-octave wave ripple
        const wave1 = Math.sin(ox * 2.5 + elapsedTime * 3.5) * 0.08;
        const wave2 = Math.cos(oz * 2.5 + elapsedTime * 3.0) * 0.08;
        const pulse = (oy < 0 ? (1.0 + Math.sin(elapsedTime * 3.0) * 0.15) : 1.0);
        const shock = shockwaveIntensity * Math.sin(ox * 8 + oz * 8 - elapsedTime * 12) * 0.25;

        pos.setXYZ(
          i,
          ox * swimExpansion * pulse + wave1 + shock,
          oy * swimContraction,
          oz * swimExpansion * pulse + wave2 + shock
        );
      }
      pos.needsUpdate = true;
      headMesh.geometry.computeVertexNormals();

      // 5. Nucleus Core Pulse & Rotation
      coreMesh.rotation.y += 0.02 + mouse.velocity * 0.01;
      coreMesh.rotation.x += 0.015;
      const corePulse = 1.0 + Math.sin(elapsedTime * 4.0) * 0.25 + shockwaveIntensity * 0.5;
      coreMesh.scale.set(corePulse, corePulse, corePulse);
      haloMesh.rotation.y -= 0.01;
      haloMesh.rotation.z += 0.012;

      // 6. Dynamic Flowing Tentacles
      for (let i = 0; i < NUM_TENTACLES; i++) {
        const tMesh = tentacleMeshes[i];
        const tBase = tentacleBases[i];
        const lagPhase = elapsedTime * 3.0 + tBase.phase;
        
        // Fluid inertia bend
        const bendX = Math.sin(lagPhase) * 0.25 - creatureGroup.rotation.z * 0.5;
        const bendZ = Math.cos(lagPhase) * 0.25 + creatureGroup.rotation.x * 0.5;

        tMesh.rotation.z = bendX;
        tMesh.rotation.x = bendZ;
        
        // Elastic stretch during swimming
        const stretchY = 1.0 + Math.sin(lagPhase * 0.7) * 0.2 + shockwaveIntensity * 0.4;
        tMesh.scale.set(1.0, stretchY, 1.0);
      }

      // 7. Particle Swarm Physics with Cursor Repulsion & Drift
      const pPositions = particleGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        
        // Natural rotational drift
        pPositions[idx] += particleVelocities[idx] + Math.sin(elapsedTime + i) * 0.002;
        pPositions[idx + 1] += particleVelocities[idx + 1] + Math.cos(elapsedTime + i) * 0.002;
        pPositions[idx + 2] += particleVelocities[idx + 2];

        // Cursor magnetic interaction
        const dx = pPositions[idx] - creatureGroup.position.x;
        const dy = pPositions[idx + 1] - creatureGroup.position.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < 4.0) {
          const force = (4.0 - distSq) * 0.012;
          pPositions[idx] += dx * force;
          pPositions[idx + 1] += dy * force;
        }

        // Keep inside bounding sphere
        const curR = Math.sqrt(pPositions[idx] ** 2 + pPositions[idx + 1] ** 2 + pPositions[idx + 2] ** 2);
        if (curR > 8.0) {
          pPositions[idx] *= 0.8;
          pPositions[idx + 1] *= 0.8;
          pPositions[idx + 2] *= 0.8;
        }
      }
      particleGeom.attributes.position.needsUpdate = true;
      particles.rotation.y = elapsedTime * 0.03;

      // 8. Lights Choreography
      keyLight.position.x = 4 + Math.sin(elapsedTime * 0.8) * 2;
      keyLight.position.y = 5 + Math.cos(elapsedTime * 0.9) * 2;
      rimLight.color.setHex(COLOR_PALETTES[theme].secondary);
      keyLight.color.setHex(COLOR_PALETTES[theme].primary);
      coreLight.color.setHex(COLOR_PALETTES[theme].tertiary);

      renderer.render(scene, camera);
    };

    animate();

    // =========================================================================
    // CLEANUP PROTOCOL
    // =========================================================================
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      container.removeEventListener('mousedown', handlePointerDown);
      container.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('resize', handleResize);

      // Dispose Three.js objects
      headGeom.dispose();
      headMat.dispose();
      coreGeom.dispose();
      coreMat.dispose();
      haloGeom.dispose();
      haloMat.dispose();
      tentacleMeshes.forEach(m => m.geometry.dispose());
      tentacleMat.dispose();
      particleGeom.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [theme, isWireframe, particleDensity, interactive, playInteractionChime]);

  const currentPalette = COLOR_PALETTES[theme];

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full overflow-hidden select-none ${className}`}
    >
      {/* 3D WebGL Canvas */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block cursor-grab active:cursor-grabbing"
      />

      {/* Floating Shockwave Ripple Indicator */}
      {isShockwaveActive && (
        <div 
          className="absolute inset-0 pointer-events-none border border-cyan-400/30 rounded-full animate-ping"
          style={{ borderColor: currentPalette.glowHex }}
        />
      )}

      {/* Interactive HUD & Laboratory Controls (Noomo Labs Style) */}
      {showControls && (
        <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          {/* Left: Species Palette Selector */}
          <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 bg-[#060810]/80 backdrop-blur-md border border-white/15 rounded-lg shadow-xl text-xs font-mono">
            <span className="text-[10px] text-neutral-400 px-2 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              AURA:
            </span>
            {(Object.keys(COLOR_PALETTES) as CreatureColorTheme[]).map((tKey) => (
              <button
                key={tKey}
                onClick={() => {
                  setTheme(tKey);
                  playInteractionChime(420 + Math.random() * 200);
                }}
                className={`px-2.5 py-1 rounded text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                  theme === tKey
                    ? `${COLOR_PALETTES[tKey].badgeClass} font-semibold shadow-[0_0_12px_rgba(0,240,255,0.4)]`
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tKey}
              </button>
            ))}
          </div>

          {/* Right: Laboratory Controls (Audio, Wireframe, Particles) */}
          <div className="pointer-events-auto flex items-center gap-2 p-1.5 bg-[#060810]/80 backdrop-blur-md border border-white/15 rounded-lg shadow-xl text-xs font-mono">
            {/* Audio Feedback Synth Toggle */}
            <button
              onClick={() => {
                const nextState = !isAudioEnabled;
                setIsAudioEnabled(nextState);
                if (nextState) playInteractionChime(520, 'sine');
              }}
              className={`p-1.5 rounded transition-all cursor-pointer flex items-center gap-1 text-[11px] ${
                isAudioEnabled
                  ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
              title={isAudioEnabled ? "Mute interactive audio chime" : "Enable Noomo interactive audio synthesis"}
            >
              {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="text-[10px] uppercase hidden sm:inline">SYNTH</span>
            </button>

            {/* Wireframe Mesh Switcher */}
            <button
              onClick={() => {
                setIsWireframe(prev => !prev);
                playInteractionChime(480);
              }}
              className={`p-1.5 rounded transition-all cursor-pointer flex items-center gap-1 text-[11px] ${
                isWireframe
                  ? 'text-amber-300 bg-amber-950/60 border border-amber-500/40'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
              title="Toggle wireframe topology"
            >
              <Waves className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase hidden sm:inline">MESH</span>
            </button>

            {/* Particle Density */}
            <button
              onClick={() => {
                const modes: ('low' | 'med' | 'high')[] = ['low', 'med', 'high'];
                const next = modes[(modes.indexOf(particleDensity) + 1) % modes.length];
                setParticleDensity(next);
                playInteractionChime(620);
              }}
              className="p-1.5 rounded text-neutral-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-[10px] uppercase"
              title="Cycle particle density"
            >
              DUST: <strong className="text-cyan-400">{particleDensity}</strong>
            </button>

            {/* Interaction Hint */}
            <div className="hidden lg:flex items-center gap-1.5 pl-2 border-l border-white/10 text-[10px] text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>DRAG TO ROTATE · CLICK TO PULSE</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
