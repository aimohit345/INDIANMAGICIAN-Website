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

// Inner Card Mesh component with authentic rounded corners
function FloatingKingCard() {
  const meshRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);

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
  const cornerRadius = 0.08; // Classic playing card rounded corner radius
  const cardDepth = 0.016;

  // Build rounded geometries and normalized UVs
  const { frontGeo, backGeo, edgeGeo, materials } = useMemo(() => {
    const shape = createRoundedCardShape(cardWidth, cardHeight, cornerRadius);

    const fGeo = new THREE.ShapeGeometry(shape, 16);
    const bGeo = new THREE.ShapeGeometry(shape, 16);

    // Apply exact [0, 1] normalized UV coordinates across rounded card surface
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
      color: 0xf5f3ea, // Clean white cardstock core
      roughness: 0.5,
      metalness: 0.05,
    });

    const frontMat = new THREE.MeshStandardMaterial({
      map: frontTexture,
      roughness: 0.35,
      metalness: 0.08,
      side: THREE.FrontSide,
    });

    const backMat = new THREE.MeshStandardMaterial({
      map: backTexture,
      roughness: 0.35,
      metalness: 0.08,
      side: THREE.FrontSide,
    });

    return {
      frontGeo: fGeo,
      backGeo: bGeo,
      edgeGeo: eGeo,
      materials: { edgeMat, frontMat, backMat },
    };
  }, [frontTexture, backTexture]);

  // Listen to mouse movement for 3D tilt
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const s = scrollRef.current; // 0 to 1
    const mx = mouse.current.x;
    const my = mouse.current.y;

    // In Hero, place card right in the middle between the magician's hands
    const isMobile = window.innerWidth < 768;
    const heroCenterX = isMobile ? 0 : 0.05;
    const heroCenterY = isMobile ? -0.7 : -0.72;
    const heroCenterZ = 0.25;

    // Section-aware trajectory across the entire page
    let scrolledX, scrolledY, scrolledZ;
    let scrollRotX, scrollRotY, scrollRotZ;

    if (s < 0.2) {
      // 1. HERO SECTION (Centered floating between hands)
      scrolledX = heroCenterX;
      scrolledY = heroCenterY;
      scrolledZ = heroCenterZ;
      scrollRotX = 0.12;
      scrollRotY = 0.0; // Facing front towards viewer
      scrollRotZ = 0.0;
    } else if (s < 0.5) {
      // 2. ABOUT SECTION (Rises to right side)
      const p = (s - 0.2) / 0.3;
      scrolledX = THREE.MathUtils.lerp(heroCenterX, 1.15, p);
      scrolledY = THREE.MathUtils.lerp(heroCenterY, 0.2, p);
      scrolledZ = THREE.MathUtils.lerp(heroCenterZ, 0.0, p);
      scrollRotX = THREE.MathUtils.lerp(0.12, 0.4, p);
      scrollRotY = THREE.MathUtils.lerp(0.0, Math.PI * 1.2, p);
      scrollRotZ = THREE.MathUtils.lerp(0.0, 0.15, p);
    } else if (s < 0.78) {
      // 3. VIDEOS SECTION (Tumbles to left flank)
      const p = (s - 0.5) / 0.28;
      scrolledX = THREE.MathUtils.lerp(1.15, -0.95, p);
      scrolledY = THREE.MathUtils.lerp(0.2, -0.15, p);
      scrolledZ = THREE.MathUtils.lerp(0.0, 0.1, p);
      scrollRotX = THREE.MathUtils.lerp(0.4, 0.6, p);
      scrollRotY = THREE.MathUtils.lerp(Math.PI * 1.2, Math.PI * 2.8, p);
      scrollRotZ = THREE.MathUtils.lerp(0.15, -0.2, p);
    } else {
      // 4. NEWS & FOOTER SECTION (Floats prominently at eye level, fully visible!)
      const p = Math.min((s - 0.78) / 0.22, 1);
      scrolledX = THREE.MathUtils.lerp(-0.95, 0.85, p);
      scrolledY = THREE.MathUtils.lerp(-0.15, 0.15, p); // Kept comfortably elevated above footer bottom
      scrolledZ = THREE.MathUtils.lerp(0.1, 0.35, p);
      scrollRotX = THREE.MathUtils.lerp(0.6, 0.1, p);
      scrollRotY = THREE.MathUtils.lerp(Math.PI * 2.8, Math.PI * 4.0 + Math.sin(time * 0.8) * 0.2, p);
      scrollRotZ = THREE.MathUtils.lerp(-0.2, 0.05, p);
    }

    if (isMobile) {
      if (s < 0.2) {
        // Hero: Centered between magician's hands
        scrolledX = 0;
        scrolledY = -0.76;
        scrolledZ = 0.25;
      } else if (s < 0.85) {
        // Content sections: gracefully float at bottom-right edge so text is 100% readable
        scrolledX = 0.62;
        scrolledY = -0.80;
        scrolledZ = 0.1;
      } else {
        // Footer: Center stage finale
        scrolledX = 0;
        scrolledY = 0.15;
        scrolledZ = 0.25;
      }
    }

    // Add continuous subtle levitation hover
    const hoverBob = Math.sin(time * 2.2) * 0.035;

    const targetX = scrolledX;
    const targetY = scrolledY + hoverBob;
    const targetZ = scrolledZ;

    const targetRotX = scrollRotX + my * 0.25;
    const targetRotY = scrollRotY + mx * 0.35;
    const targetRotZ = scrollRotZ + Math.sin(time * 1.5) * 0.02;

    // Responsive scale: compact on mobile, moderate on tablet, full on desktop
    const targetScale = isMobile ? 0.72 : (window.innerWidth < 1024 ? 0.86 : 1.0);
    meshRef.current.scale.set(
      THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1),
      THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale, 0.1),
      THREE.MathUtils.lerp(meshRef.current.scale.z, targetScale, 0.1)
    );

    // Snappy, responsive lerp with silky physics
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.14);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.14);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.14);

    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.14);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.14);
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRotZ, 0.14);
  });

  return (
    <group ref={meshRef} position={[0.05, -0.72, 0.25]}>
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

  useFrame((state) => {
    if (!particlesRef.current) return;
    const time = state.clock.getElapsedTime();
    const pos = particlesRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += Math.sin(time + i) * 0.002;
      pos[i * 3] += Math.cos(time * 0.5 + i) * 0.0015;
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
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
