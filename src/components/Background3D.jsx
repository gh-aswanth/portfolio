import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import HNSWGraph from './HNSWGraph';

extend({ PointMaterial });

function StarBackground(props) {
  const ref = useRef();
  const [sphere] = useMemo(() => {
    try {
      return [random.inSphere(new Float32Array(3000), { radius: 1.5 })];
    } catch (e) {
      console.error("Error generating sphere points:", e);
      return [new Float32Array(0)];
    }
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#00f2ff"
          size={0.001}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.4}
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
    <div className="fixed inset-0 z-0 bg-[#030303]">
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#030303]" />
      <CanvasErrorBoundary fallback={<div className="absolute inset-0 bg-[#030303]" />}>
        <Canvas 
          camera={{ position: [0, 0, 5] }} 
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
