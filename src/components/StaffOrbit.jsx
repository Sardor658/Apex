import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Image, Text, Float, Billboard } from '@react-three/drei';
import * as THREE from 'three';

const StaffProfile = ({ position, name, salary, image, rotationY }) => {
  const groupRef = useRef();

  useFrame((state) => {
    groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() + position[0]) * 0.2;
  });

  return (
    <group ref={groupRef} position={position}>
      <Billboard>
        {/* Profile Circle */}
        <mesh>
          <circleGeometry args={[1.2, 32]} />
          <meshBasicMaterial color="rgba(255,255,255,0.1)" transparent opacity={0.2} />
        </mesh>
        
        {/* Profile Image (Placeholder for now) */}
        <mesh position={[0, 0, 0.01]}>
          <circleGeometry args={[1.1, 32]} />
          <meshBasicMaterial color="#00E676" wireframe />
        </mesh>

        <Text
          position={[0, -1.8, 0]}
          fontSize={0.3}
          color="white"
          font="https://fonts.gstatic.com/s/orbitron/v25/yV0P94zK-9RAnH7v4f-f.woff"
        >
          {name}
        </Text>
        
        {/* Floating Salary Bubble */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <group position={[1.2, 0.8, 0]}>
            <mesh>
              <capsuleGeometry args={[0.2, 0.8, 4, 16]} />
              <meshBasicMaterial color="#00E676" transparent opacity={0.2} />
            </mesh>
            <Text
              position={[0, 0, 0.1]}
              fontSize={0.2}
              color="#00E676"
              fontWeight="bold"
            >
              ${salary}
            </Text>
          </group>
        </Float>
      </Billboard>
    </group>
  );
};

const StaffCarousel = ({ staff }) => {
  const groupRef = useRef();
  const radius = 6;

  useFrame((state) => {
    groupRef.current.rotation.y += 0.005;
  });

  return (
    <group ref={groupRef}>
      {staff.map((member, i) => {
        const angle = (i / staff.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <StaffProfile
            key={member.id}
            position={[x, 0, z]}
            name={member.name}
            salary={member.salary}
            image={member.image}
          />
        );
      })}
    </group>
  );
};

const StaffOrbit = ({ staff }) => {
  return (
    <div className="glass glow-edge-green" style={{
      width: '400px',
      height: '500px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <h3 className="orbitron" style={{ fontSize: '1rem', marginBottom: '10px', color: 'var(--accent-green)' }}>Staff Orbit</h3>
      <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>Real-time payroll & performance tracking</p>
      
      <div style={{ flex: 1 }}>
        <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} color="#00E676" />
          <StaffCarousel staff={staff} />
        </Canvas>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '10px', 
        borderTop: '1px solid var(--glass-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '0.8rem' }}>
          <div style={{ color: 'var(--text-secondary)' }}>Total Payroll</div>
          <div style={{ fontWeight: '600', color: 'var(--accent-green)' }}>
            ${staff.reduce((acc, curr) => acc + curr.salary, 0).toLocaleString()} /mo
          </div>
        </div>
        <button className="btn btn-outline" style={{ padding: '5px 10px', fontSize: '0.7rem' }}>View All</button>
      </div>
    </div>
  );
};

export default StaffOrbit;
