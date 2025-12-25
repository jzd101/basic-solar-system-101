import React, { useRef } from 'react';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export const Sun = () => {
  const texture = useTexture('/textures/sun.jpg');
  const sunRef = useRef();

  useFrame((state, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <mesh ref={sunRef}>
      <sphereGeometry args={[2.5, 32, 32]} />
      <meshStandardMaterial map={texture} emissiveMap={texture} emissiveIntensity={0.6} emissive={0xffffff} />
      <pointLight position={[0, 0, 0]} intensity={1.5} distance={100} decay={2} color="white" />
    </mesh>
  );
};
