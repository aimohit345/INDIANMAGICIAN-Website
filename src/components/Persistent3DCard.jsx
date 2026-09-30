import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

// Helper to create a classic playing card shape with rounded corners
function createRoundedCardShape(w, h, r) {
  const shape = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;

  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);

  return shape;
}

// Independent randomized trajectories and personalities for each card in the flourish
const INDEPENDENT_CARDS = [
  // Card 0: The Anchor / Master Leader (Smoothly navigates the primary arc)
  {
    offsetX: 0, offsetY: 0, offsetZ: 0,
    driftFreqX: 1.0, driftFreqY: 1.2, driftAmpX: 0.15, driftAmpY: 0.12,
    spinSpeed: 0.8, tumbleFreq: 0.6,
    phase: 0, scale: 1.0,
  },
  // Card 1: The Left Glider (Swoops wide to the left, banking into turns)
  {
    offsetX: -0.55, offsetY: 0.22, offsetZ: -0.18,
    driftFreqX: 2.1, driftFreqY: 1.7, driftAmpX: 0.45, driftAmpY: 0.32,
    spinSpeed: -1.3, tumbleFreq: 1.2,
    phase: 1.4, scale: 0.92,
  },
  // Card 2: The High Sky Floater (Floats higher up, drifting in wide arcs)
  {
    offsetX: 0.52, offsetY: 0.42, offsetZ: -0.12,
    driftFreqX: 1.6, driftFreqY: 2.3, driftAmpX: 0.40, driftAmpY: 0.38,
    spinSpeed: 1.4, tumbleFreq: 0.9,
    phase: 2.8, scale: 0.94,
  },
  // Card 3: The Deep Abyss Tumbler (Dives deep in Z-axis, rolling on diagonal axis)
  {
    offsetX: -0.28, offsetY: -0.38, offsetZ: -0.52,
    driftFreqX: 2.6, driftFreqY: 1.4, driftAmpX: 0.50, driftAmpY: 0.28,
    spinSpeed: -1.7, tumbleFreq: 1.6,
    phase: 4.2, scale: 0.84,
  },
  // Card 4: The Wide Right Flanker (Sweeps wide to the right, tumbling edge-first)
  {
    offsetX: 0.88, offsetY: -0.18, offsetZ: -0.25,
    driftFreqX: 1.8, driftFreqY: 2.6, driftAmpX: 0.48, driftAmpY: 0.42,
    spinSpeed: 1.2, tumbleFreq: 1.3,
    phase: 5.1, scale: 0.88,
  },
  // Card 5: The Mystery Rider (Spins with Bicycle Red Rider Back showing, undulating gently)
  {
    offsetX: -0.12, offsetY: 0.30, offsetZ: -0.38,
    driftFreqX: 2.3, driftFreqY: 1.9, driftAmpX: 0.38, driftAmpY: 0.35,
    spinSpeed: 1.1, tumbleFreq: 1.4,
    phase: 3.5, scale: 0.86, isReversed: true,
  },
];

// Inner Card Mesh component with authentic rounded corners
function FloatingKingCard() {
  const cardRefs = useRef([]);
  const mouse = useRef({ x: 0, y: 0 });

  // Load the authentic King of Diamonds front and Rider Back textures
  const [frontTexture, backTexture] = useLoader(THREE.TextureLoader, [
    '/king-front.png',
    '/king-back.png',
  ]);

  useMemo(() => {
    if (frontTexture) {
      frontTexture.colorSpace = THREE.SRGBColorSpace;
      frontTexture.anisotropy = 16;
      frontTexture.generateMipmaps = true;
      frontTexture.minFilter = THREE.LinearMipmapLinearFilter;
    }
    if (backTexture) {
      backTexture.colorSpace = THREE.SRGBColorSpace;
      backTexture.anisotropy = 16;
      backTexture.generateMipmaps = true;
      backTexture.minFilter = THREE.LinearMipmapLinearFilter;
    }
  }, [frontTexture, backTexture]);

  // Card dimensions: authentic playing card ratio (1 : 1.4) with rounded corners
  const cardWidth = 1.15;
  const cardHeight = 1.61;
  const cornerRadius = 0.08;
  const cardDepth = 0.016;

  // Build rounded geometries and normalized UVs
  const { frontGeo, backGeo, edgeGeo, materials } = useMemo(() => {
    const shape = createRoundedCardShape(cardWidth, cardHeight, cornerRadius);

    const fGeo = new THREE.ShapeGeometry(shape, 16);
    const bGeo = new THREE.ShapeGeometry(shape, 16);

    const applyUVs = (geo) => {
      const pos = geo.attributes.position;
      const uvs = new Float32Array(pos.count * 2);
      for (let i = 0; i < pos.count; i++) {
        const px = pos.getX(i);
        const py = pos.getY(i);
        uvs[i * 2] = (px + cardWidth / 2) / cardWidth;
        uvs[i * 2 + 1] = (py + cardHeight / 2) / cardHeight;
      }
      geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    };

    applyUVs(fGeo);
    applyUVs(bGeo);

    // Extruded rounded paper-core edge
    const eGeo = new THREE.ExtrudeGeometry(shape, {
      depth: cardDepth,
      bevelEnabled: false,
      steps: 1,
      curveSegments: 16,
    });
    eGeo.translate(0, 0, -cardDepth / 2);

    const edgeMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3ea,
      roughness: 0.5,
      metalness: 0.05,
      transparent: true,
      opacity: 1,
    });

    const frontMat = new THREE.MeshStandardMaterial({
      map: frontTexture,
      roughness: 0.35,
      metalness: 0.08,
      side: THREE.FrontSide,
      transparent: true,
      opacity: 1,
    });

    const backMat = new THREE.MeshStandardMaterial({
      map: backTexture,
      roughness: 0.35,
      metalness: 0.08,
      side: THREE.FrontSide,
      transparent: true,
      opacity: 1,
    });

    return {
      frontGeo: fGeo,
      backGeo: bGeo,
      edgeGeo: eGeo,
      materials: { edgeMat, frontMat, backMat },
    };
  }, [frontTexture, backTexture]);

  // Listen to mouse movement and scroll
  const scrollYRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const scrollY = scrollYRef.current || 0;
    const mx = mouse.current.x;
    const my = mouse.current.y;

    // Unchanged exact starting position in Hero (between magician's hands)
    const isMobile = window.innerWidth < 768;
    const heroCenterX = isMobile ? 0 : 0.05;
    const heroCenterY = isMobile ? -0.7 : -0.72;
    const heroCenterZ = 0.25;

    const bannerHeight = window.innerHeight || 800;
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const totalProgress = THREE.MathUtils.clamp(scrollY / maxScroll, 0, 1);

    // 1. Multiplication flourish factor:
    // When scrollY < 40 (inside Hero banner), factor = 0 (strictly 1 single card)
    // As you scroll below the hero banner, factor blooms smoothly from 0 to 1 (multiplies into 6 cards)
    // As you scroll back up, factor reverts to 0 (collapses back into single card)
    const multiplyProgress = THREE.MathUtils.clamp((scrollY - 40) / (bannerHeight * 0.65), 0, 1);
    const multiplyFactor = THREE.MathUtils.smoothstep(multiplyProgress, 0, 1);

    // 2. Drowning immersion factor: 0 at top of hero banner (surface level), 1.0 once below banner (submerged deep)
    const drownFactor = THREE.MathUtils.clamp(scrollY / (bannerHeight * 0.75), 0, 1);

    // Z-DEPTH: Submerges backwards into the website depths (from +0.25 surface down to -0.95 deep abyss)
    const masterZ = THREE.MathUtils.lerp(heroCenterZ, -0.95, drownFactor);

    // Drowning plunge dip when passing below the banner
    const drownDip = Math.sin(drownFactor * Math.PI) * -0.55;
    const drownTiltX = Math.sin(drownFactor * Math.PI * 1.6) * 0.45;
    const drownTiltZ = Math.sin(drownFactor * Math.PI * 2.0) * 0.25;

    // Master trajectory across the entire website
    let siteX, siteY, siteRotY;
    if (totalProgress < 0.35) {
      // About Section: drifts to right flank, visible through frosted glass
      const p = THREE.MathUtils.clamp((totalProgress - 0.05) / 0.3, 0, 1);
      siteX = THREE.MathUtils.lerp(heroCenterX, isMobile ? 0.58 : 1.15, p);
      siteY = THREE.MathUtils.lerp(heroCenterY, isMobile ? -0.7 : 0.15, p);
      siteRotY = p * Math.PI * 1.4;
    } else if (totalProgress < 0.72) {
      // Videos Section: glides gracefully to left flank
      const p = THREE.MathUtils.clamp((totalProgress - 0.35) / 0.37, 0, 1);
      siteX = THREE.MathUtils.lerp(isMobile ? 0.58 : 1.15, isMobile ? -0.5 : -0.95, p);
      siteY = THREE.MathUtils.lerp(isMobile ? -0.7 : 0.15, isMobile ? -0.65 : -0.1, p);
      siteRotY = Math.PI * 1.4 + p * Math.PI * 1.6;
    } else {
      // News & Footer: Center-right majestic finale
      const p = THREE.MathUtils.clamp((totalProgress - 0.72) / 0.28, 0, 1);
      siteX = THREE.MathUtils.lerp(isMobile ? -0.5 : -0.95, isMobile ? 0.45 : 0.85, p);
      siteY = THREE.MathUtils.lerp(isMobile ? -0.65 : -0.1, 0.15, p);
      siteRotY = Math.PI * 3.0 + p * Math.PI * 1.2;
    }

    const baseScale = isMobile ? 0.72 : (window.innerWidth < 1024 ? 0.86 : 1.0);
    const spreadWidthFactor = isMobile ? 0.55 : 1.0;

    // Animate every card in the independent flock
    INDEPENDENT_CARDS.forEach((cfg, idx) => {
      const card = cardRefs.current[idx];
      if (!card) return;

      // 1. Dynamic independent drift as you scroll down:
      // Each card wanders along its own harmonic wave path!
      const scrollDriftX = (
        Math.sin(totalProgress * Math.PI * cfg.driftFreqX + cfg.phase) * cfg.driftAmpX +
        Math.cos(totalProgress * Math.PI * 0.9 + cfg.phase * 0.5) * (cfg.driftAmpX * 0.4)
      ) * spreadWidthFactor * multiplyFactor;

      const scrollDriftY = (
        Math.cos(totalProgress * Math.PI * cfg.driftFreqY + cfg.phase) * cfg.driftAmpY +
        Math.sin(totalProgress * Math.PI * 1.3 + cfg.phase * 0.7) * (cfg.driftAmpY * 0.35)
      ) * multiplyFactor;

      const scrollDriftZ = (
        Math.sin(totalProgress * Math.PI * 1.5 + cfg.phase) * 0.22
      ) * multiplyFactor;

      // 2. Base flourish initial split offset
      const baseX = cfg.offsetX * spreadWidthFactor * multiplyFactor;
      const baseY = cfg.offsetY * multiplyFactor;
      const baseZ = cfg.offsetZ * multiplyFactor;

      // 3. Individual asynchronous floating wave bob (never in sync!)
      const indBob = Math.sin(time * (1.8 + idx * 0.35) + cfg.phase) * 0.03 * multiplyFactor;
      const indSway = Math.cos(time * (1.5 + idx * 0.28) + cfg.phase) * 0.02 * multiplyFactor;
      const masterBob = Math.sin(time * 2.0) * 0.035;

      // Final coordinates:
      const targetCardX = siteX + baseX + scrollDriftX + indSway;
      const targetCardY = siteY + drownDip + masterBob + baseY + scrollDriftY + indBob;
      const targetCardZ = masterZ + baseZ + scrollDriftZ;

      // 4. Independent tumbling 3D rotations for each card:
      // Each card tumbles at different speeds, directions, and angles as you scroll!
      const revOffset = cfg.isReversed ? Math.PI : 0;
      const rotSpinY = (totalProgress * Math.PI * 2.8 * cfg.spinSpeed + revOffset) * multiplyFactor;
      const rotTumbleX = (Math.sin(totalProgress * Math.PI * cfg.tumbleFreq + cfg.phase) * 0.65) * multiplyFactor;
      const rotTiltZ = (Math.cos(totalProgress * Math.PI * cfg.driftFreqX + cfg.phase) * 0.45) * multiplyFactor;

      const targetCardRotX = 0.12 + drownTiltX + rotTumbleX + my * 0.2;
      const targetCardRotY = siteRotY + rotSpinY + mx * 0.3;
      const targetCardRotZ = drownTiltZ + rotTiltZ;

      const targetCardScale = baseScale * (1 - drownFactor * 0.18) * (1 + (cfg.scale - 1) * multiplyFactor);

      // Lerp card smoothly
      card.position.x = THREE.MathUtils.lerp(card.position.x, targetCardX, 0.11);
      card.position.y = THREE.MathUtils.lerp(card.position.y, targetCardY, 0.11);
      card.position.z = THREE.MathUtils.lerp(card.position.z, targetCardZ, 0.11);

      card.rotation.x = THREE.MathUtils.lerp(card.rotation.x, targetCardRotX, 0.11);
      card.rotation.y = THREE.MathUtils.lerp(card.rotation.y, targetCardRotY, 0.11);
      card.rotation.z = THREE.MathUtils.lerp(card.rotation.z, targetCardRotZ, 0.11);

      card.scale.set(
        THREE.MathUtils.lerp(card.scale.x, targetCardScale, 0.1),
        THREE.MathUtils.lerp(card.scale.y, targetCardScale, 0.1),
        THREE.MathUtils.lerp(card.scale.z, targetCardScale, 0.1)
      );
    });
  });

  return (
    <group>
      {INDEPENDENT_CARDS.map((cfg, idx) => (
        <group
          key={idx}
          ref={(el) => (cardRefs.current[idx] = el)}
          position={[0.05, -0.72, 0.25]}
        >
          {/* 1. Rounded Cardstock Core Edge */}
          <mesh geometry={edgeGeo} material={materials.edgeMat} castShadow receiveShadow />

          {/* 2. Rounded Front Face: Authentic King of Diamonds */}
          <mesh
            position={[0, 0, cardDepth / 2 + 0.0005]}
            geometry={frontGeo}
            material={materials.frontMat}
            castShadow
          />

          {/* 3. Rounded Back Face: Authentic Red Rider Back */}
          <mesh
            position={[0, 0, -cardDepth / 2 - 0.0005]}
            rotation={[0, Math.PI, 0]}
            geometry={backGeo}
            material={materials.backMat}
            castShadow
          />
        </group>
      ))}
    </group>
  );
}

// Subtle Magical Stardust Particles around the card
function MagicStardust() {
  const particlesRef = useRef();
  const count = 45;

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return [pos];
  }, []);

  const matRef = useRef();

  useFrame((state) => {
    if (!particlesRef.current) return;
    const time = state.clock.getElapsedTime();
    const pos = particlesRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += Math.sin(time + i) * 0.002;
      pos[i * 3] += Math.cos(time * 0.5 + i) * 0.0015;
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;

    if (matRef.current) {
      matRef.current.opacity = 0.45;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.045}
        color={0xffd700}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function Persistent3DCard() {
  return (
    <div
      className="fixed inset-0 pointer-events-none transition-opacity duration-700"
      style={{ zIndex: 5 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.3} />
        <directionalLight position={[4, 5, 5]} intensity={2.2} color="#fff6d6" />
        <pointLight position={[-3, -2, -1]} intensity={2.5} color="#00e599" distance={12} />
        <pointLight position={[1, -1, 2]} intensity={2.0} color="#ffd700" distance={8} />

        <Suspense fallback={null}>
          <FloatingKingCard />
        </Suspense>
        <MagicStardust />
      </Canvas>
    </div>
  );
}
