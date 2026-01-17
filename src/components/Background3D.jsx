import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import * as random from 'maath/random/dist/maath-random.esm';
import HNSWGraph from './HNSWGraph';

extend({ PointMaterial });

function SpikeEffect() {
  const count = 20;
  const spikes = useMemo(() => {
    return Array.from({ length: count }, () => {
      const dir = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize();
      
      const colors = ['#00f2ff', '#7000ff', '#ff00ea', '#ffffff'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      return {
        dir,
        color,
        speed: 0.5 + Math.random() * 2,
        length: 2 + Math.random() * 4,
        offset: Math.random() * Math.PI * 2
      };
    });
  }, []);

  const linesRef = useRef([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    linesRef.current.forEach((line, i) => {
      if (line) {
        const spike = spikes[i];
        // Pulsing length and scale
        const scale = Math.sin(t * spike.speed + spike.offset) * 0.5 + 0.5;
        line.scale.set(scale, scale, scale);
        
        // Randomly "firing" spikes
        if (scale > 0.9) {
          line.visible = true;
        } else if (scale < 0.1) {
          line.visible = Math.random() > 0.3; // Randomly hide some
        }
        
        line.rotation.y = t * 0.5;
        line.rotation.x = Math.sin(t * 0.3) * 0.5;
      }
    });
  });

  return (
    <group>
      {spikes.map((spike, i) => (
        <group key={i} ref={(el) => (linesRef.current[i] = el)} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
          <mesh position={[0, spike.length / 2, 0]}>
            <cylinderGeometry args={[0.005, 0.02, spike.length, 8]} />
            <meshBasicMaterial 
              color={spike.color} 
              transparent 
              opacity={0.6} 
            />
          </mesh>
          <pointLight 
            position={[0, spike.length, 0]} 
            color={spike.color} 
            intensity={0.5} 
            distance={2} 
          />
        </group>
      ))}
    </group>
  );
}

function StarBackground(props) {
  const ref = useRef();
  const [points] = useMemo(() => {
    try {
      // Use inBox instead of inSphere to avoid the spherical look
      return [random.inBox(new Float32Array(2000), { sides: [15, 15, 15] })];
    } catch (e) {
      console.error("Error generating box points:", e);
      return [new Float32Array(0)];
    }
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 30;
      ref.current.rotation.y -= delta / 40;
    }
  });

  return (
    <group>
      <Points ref={ref} positions={points} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#00f2ff"
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
}

class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Three.js Canvas Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

const Background3D = () => {
  console.log("Background3D rendering");
  return (
    <div className="fixed inset-0 z-[-20] bg-transparent">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
      <CanvasErrorBoundary fallback={<div className="absolute inset-0 bg-[#030303]" />}>
        <Canvas 
          camera={{ position: [0, 0, 8] }} 
          gl={{ antialias: true, alpha: true }}
          onCreated={() => console.log("Three.js Canvas created")}
          onError={(e) => console.error("Three.js Canvas error:", e)}
        >
          <StarBackground />
          <HNSWGraph />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
};

export default Background3D;
