import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function Particles({ count = 100 }) {
  const mesh = useRef();
  const light = useRef();

  // Create random positions
  const particles = React.useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = THREE.MathUtils.randFloatSpread(50);
      const y = THREE.MathUtils.randFloatSpread(50);
      const z = THREE.MathUtils.randFloatSpread(50);
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    mesh.current.rotation.y = time * 0.05;
    mesh.current.rotation.x = time * 0.02;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#00E676"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

const Environment = () => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 20]} />
        <color attach="background" args={['#000505']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00E676" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#00B0FF" />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Particles count={200} />
        
        <fog attach="fog" args={['#000505', 10, 50]} />
      </Canvas>
    </div>
  );
};

export default Environment;
