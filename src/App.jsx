import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import { Sun } from './components/Sun';
import { Planet } from './components/Planet';
import * as THREE from 'three';

// Planet Data (Exaggerated for visibility)
// Distance and size are not 1:1 scientific but relative order is preserved
const planetsData = [
  { name: 'Mercury', size: 0.4, distance: 4, speed: 1.5, texture: '/textures/mercury.jpg' },
  { name: 'Venus', size: 0.7, distance: 7, speed: 1.2, texture: '/textures/venus.jpg' },
  { name: 'Earth', size: 0.75, distance: 10, speed: 1, texture: '/textures/earth.jpg' },
  { name: 'Mars', size: 0.5, distance: 13, speed: 0.8, texture: '/textures/mars.jpg' },
  { name: 'Jupiter', size: 2.2, distance: 19, speed: 0.5, texture: '/textures/jupiter.jpg' },
  { name: 'Saturn', size: 1.8, distance: 26, speed: 0.4, texture: '/textures/saturn.jpg', ring: '/textures/saturn_ring.png' },
  { name: 'Uranus', size: 1.2, distance: 32, speed: 0.3, texture: '/textures/uranus.jpg' },
  { name: 'Neptune', size: 1.1, distance: 38, speed: 0.2, texture: '/textures/neptune.jpg' },
];

const CameraController = ({ focusTarget }) => {
  const { camera, controls } = useThree();
  const vec = new THREE.Vector3();

  useEffect(() => {
    if (focusTarget) {
      // Smoothly move camera close to the target
      // This is a simplified approach; in a real loop useFrame is better for smooth animation
      // But OrbitControls usually handles damping.
      // We just set the target of OrbitControls.

      if(controls) {
          controls.target.set(focusTarget[0], focusTarget[1], focusTarget[2]);
          controls.update();

          // Optionally move camera closer if needed, but just looking at it might be enough
      }
    }
  }, [focusTarget, controls]);

  return null;
};

const SolarSystem = ({ speedMultiplier, onFocus }) => {
  return (
    <>
      <ambientLight intensity={0.1} />
      <Sun />
      {planetsData.map((planet) => (
        <Planet
          key={planet.name}
          name={planet.name}
          size={planet.size}
          distance={planet.distance}
          speed={planet.speed}
          texturePath={planet.texture}
          ringTexturePath={planet.ring}
          orbitSpeedMultiplier={speedMultiplier}
          onFocus={onFocus}
        />
      ))}
      <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </>
  );
};

function App() {
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [focusTarget, setFocusTarget] = useState(null);

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black' }}>
      <Canvas camera={{ position: [0, 20, 45], fov: 45 }}>
        <CameraController focusTarget={focusTarget} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        <SolarSystem speedMultiplier={speedMultiplier} onFocus={setFocusTarget} />
      </Canvas>

      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        color: 'white',
        fontFamily: 'sans-serif',
        background: 'rgba(0,0,0,0.5)',
        padding: '10px',
        borderRadius: '5px',
        pointerEvents: 'none' // Allow clicks to pass through container generally
      }}>
         <h2 style={{ margin: '0 0 10px 0' }}>ระบบสุริยะ (Solar System)</h2>
         <p style={{ fontSize: '0.8rem', margin: '0 0 10px 0' }}>คลิกที่ดาวเพื่อโฟกัส (Click planet to focus)</p>

         <div style={{ pointerEvents: 'auto' }}>
            <label htmlFor="speed">ความเร็วโคจร (Orbit Speed): {speedMultiplier.toFixed(1)}x</label>
            <br />
            <input
              id="speed"
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={speedMultiplier}
              onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
         </div>
      </div>

      <style>{`
        .tooltip {
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-family: sans-serif;
          font-size: 12px;
          pointer-events: none;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}

export default App;
