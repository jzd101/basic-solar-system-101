import React, { useRef, useState } from 'react';
import { useTexture, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PlanetRing = ({ texturePath, size }) => {
  const ringTexture = useTexture(texturePath);

  // Clone to avoid side effects if texture is reused (though unlikely here)
  // and set rotation in a useEffect or just once.
  // Since we can't easily use useEffect inside this component for a property assignment
  // that Three.js handles, doing it in render is "okay" for simple apps but
  // strictly React warns against side-effects.
  // Better: use the rotation prop on the mesh or material if possible,
  // but texture rotation is a property of the texture object.
  // However, `useTexture` caches the texture. modifying it globally affects all users.
  // We should clone it if we modify it.
  const texture = ringTexture.clone();
  texture.rotation = -Math.PI / 2;
  // texture.center.set(0.5, 0.5); // Usually needed for rotation to be around center

  return (
    <mesh rotation={[-Math.PI / 2 + 0.4, 0, 0]}>
      <ringGeometry args={[size * 1.4, size * 2.2, 64]} />
      <meshStandardMaterial
        map={ringTexture}
        side={THREE.DoubleSide}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};

export const Planet = ({
  name,
  size,
  distance,
  speed,
  texturePath,
  ringTexturePath,
  onFocus,
  orbitSpeedMultiplier = 1,
}) => {
  const texture = useTexture(texturePath);
  const planetRef = useRef();
  const orbitRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Random starting position
  // Fix impure useState initializer: Pass a function
  const [angle, setAngle] = useState(() => Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    // Rotation (Self)
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.2;
    }

    // Revolution (Orbit)
    if (orbitRef.current) {
      // Update angle
      const newAngle = angle + speed * delta * orbitSpeedMultiplier * 0.5;
      setAngle(newAngle);

      const x = Math.cos(newAngle) * distance;
      const z = Math.sin(newAngle) * distance;
      orbitRef.current.position.set(x, 0, z);
    }
  });

  return (
    <group>
      {/* Orbit Path (Visual Guide) */}
      <mesh rotation-x={Math.PI / 2}>
        <ringGeometry args={[distance - 0.05, distance + 0.05, 64]} />
        <meshBasicMaterial
          color="#333"
          side={THREE.DoubleSide}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Planet Container moving in orbit */}
      <group ref={orbitRef} position={[distance, 0, 0]}>
        <mesh
          ref={planetRef}
          onClick={(e) => {
            e.stopPropagation();
            onFocus([
              orbitRef.current.position.x,
              orbitRef.current.position.y,
              orbitRef.current.position.z,
            ]);
          }}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial map={texture} />
          {hovered && (
            <Html distanceFactor={15}>
              <div className="tooltip">{name}</div>
            </Html>
          )}
        </mesh>

        {/* Saturn Ring */}
        {ringTexturePath && (
          <PlanetRing texturePath={ringTexturePath} size={size} />
        )}
      </group>
    </group>
  );
};
