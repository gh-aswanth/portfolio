import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { PointMaterial } from '@react-three/drei';

extend({ PointMaterial });

const BeatPulse = ({ position, color, nodeIdx }) => {
  const meshRef = useRef();
  const ringRef = useRef();
  const sonarRef = useRef();
  const lightRef = useRef();
  const [lastNodeIdx, setLastNodeIdx] = useState(nodeIdx);
  const [startTime, setStartTime] = useState(0);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    if (nodeIdx !== lastNodeIdx) {
      setLastNodeIdx(nodeIdx);
      setStartTime(t);
    }

    const elapsed = t - startTime;
    const duration = 2.0;
    const progress = Math.min(elapsed / duration, 1.0);

    if (meshRef.current) {
      // Main Dot
      const s = 1.0;
      meshRef.current.scale.set(s, s, s);
      meshRef.current.material.opacity = (1 - progress) * 0.8;
    }

    if (ringRef.current) {
      // Outer Ring
      const s = 1 + progress * 2;
      ringRef.current.scale.set(s, s, s);
      ringRef.current.material.opacity = (1 - progress) * 0.5;
    }

    if (sonarRef.current) {
      // Pulsing Sonar
      const s = 1 + progress * 5;
      sonarRef.current.scale.set(s, s, s);
      sonarRef.current.material.opacity = (1 - progress) * 0.2;
    }
    
    if (lightRef.current) {
      lightRef.current.intensity = (1 - progress) * 10;
    }
  });

  return (
    <group position={position}>
      {/* Main Dot */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>
      {/* Outer Ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.12, 0.14, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      {/* Sonar Effect */}
      <mesh ref={sonarRef}>
        <ringGeometry args={[0.2, 0.22, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
      <pointLight ref={lightRef} color={color} distance={4} intensity={0} />
    </group>
  );
};

const HNSWGraph = () => {
  console.log("HNSWGraph rendering");
  const count = 60; // Increased node count for more complexity
  const nodes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 20, // Wider distribution
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 15
      ),
      level: i < 5 ? 2 : i < 20 ? 1 : 0, 
      connections: []
    }));
  }, []);

  // Create random graph connections
  useMemo(() => {
    nodes.forEach((node, i) => {
      // Connect each node to 2-4 random neighbors to make it look like a random graph
      const numConns = 2 + Math.floor(Math.random() * 3);
      const candidates = nodes
        .map((n, idx) => ({ idx, dist: node.position.distanceTo(n.position) }))
        .filter(n => n.idx !== i)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 10); // Look at 10 nearest neighbors
      
      // Pick random ones from the nearest candidates
      const shuffled = candidates.sort(() => 0.5 - Math.random());
      node.connections = shuffled.slice(0, numConns).map(n => n.idx);
    });
  }, [nodes]);

  const linesRef = useRef();
  const pointsRef = useRef();
  const groupRef = useRef();
  const trailPointsRef = useRef();
  const searchPathRef = useRef();
  const [activeEdgePoints, setActiveEdgePoints] = useState(new Float32Array(0));

  const [searchState, setSearchState] = useState({
    currentNodeIdx: 0,
    targetNodeIdx: Math.floor(Math.random() * count),
    path: [],
    step: 0,
    phase: 'waiting' // 'waiting', 'embedding', 'searching'
  });

  const [visitedNodes, setVisitedNodes] = useState(new Set());
  const [activePath, setActivePath] = useState([]);
  const [beatingNodeIdx, setBeatingNodeIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBeatingNodeIdx(Math.floor(Math.random() * count));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05;
      groupRef.current.rotation.x = Math.sin(t * 0.03) * 0.1;
    }
    
    // Cycle search phases
    const cycleTime = 10; 
    const phaseTime = t % cycleTime;
    
    let currentPhase = 'waiting';
    if (phaseTime < 1) currentPhase = 'waiting';
    else if (phaseTime < 3) currentPhase = 'embedding';
    else currentPhase = 'searching';

    if (currentPhase !== searchState.phase) {
      setSearchState(s => {
        if (currentPhase === 'waiting') {
          const nextTarget = Math.floor(Math.random() * count);
          setVisitedNodes(new Set());
          setActivePath([]);
          return { ...s, phase: currentPhase, currentNodeIdx: s.targetNodeIdx, targetNodeIdx: nextTarget, path: [], step: 0 };
        } else if (currentPhase === 'searching') {
          // Find path to target using BFS/Greedy search
          const path = [s.currentNodeIdx];
          let curr = s.currentNodeIdx;
          const targetIdx = s.targetNodeIdx;
          const visited = new Set([curr]);
          
          for (let i = 0; i < 20; i++) {
            const neighbors = nodes[curr].connections.filter(n => !visited.has(n));
            if (neighbors.length === 0) break;
            
            // Pick neighbor closest to target
            let best = neighbors[0];
            let minDist = nodes[best].position.distanceTo(nodes[targetIdx].position);
            
            neighbors.forEach(n => {
              const d = nodes[n].position.distanceTo(nodes[targetIdx].position);
              if (d < minDist) {
                minDist = d;
                best = n;
              }
            });
            
            curr = best;
            visited.add(curr);
            path.push(curr);
            if (curr === targetIdx) break;
          }
          return { ...s, phase: currentPhase, path, step: 0 };
        } else {
          return { ...s, phase: currentPhase };
        }
      });
    }

    // Animate searching phase
    if (searchState.phase === 'searching' && searchState.path.length > 0) {
      const searchStartTime = (Math.floor(t / cycleTime) * cycleTime) + 3;
      const totalSearchTime = cycleTime - 3.5; 
      const stepDuration = totalSearchTime / searchState.path.length;
      const progress = (t - searchStartTime) / stepDuration;
      const currentStep = Math.floor(progress);
      const stepProgress = progress % 1;

      if (currentStep < searchState.path.length - 1) {
        const startIdx = searchState.path[currentStep];
        const endIdx = searchState.path[currentStep + 1];
        
        if (nodes[startIdx] && nodes[endIdx]) {
          const startNode = nodes[startIdx];
          const endNode = nodes[endIdx];
          
          if (searchPathRef.current) {
            searchPathRef.current.position.lerpVectors(startNode.position, endNode.position, stepProgress);
            const edgePos = new Float32Array([
              startNode.position.x, startNode.position.y, startNode.position.z,
              endNode.position.x, endNode.position.y, endNode.position.z
            ]);
            setActiveEdgePoints(edgePos);
          }

          if (currentStep >= activePath.length) {
            setVisitedNodes(prev => new Set(prev).add(startIdx));
            setActivePath(searchState.path.slice(0, currentStep + 2));
          }
        }
      } else {
        const finalIdx = searchState.path[searchState.path.length - 1];
        if (nodes[finalIdx] && searchPathRef.current) {
          searchPathRef.current.position.copy(nodes[finalIdx].position);
          setActiveEdgePoints(new Float32Array(0));
          if (visitedNodes.size < searchState.path.length) {
            setVisitedNodes(prev => new Set(prev).add(finalIdx));
          }
        }
      }
    } else {
      setActiveEdgePoints(new Float32Array(0));
      if (searchPathRef.current && nodes[searchState.currentNodeIdx]) {
        searchPathRef.current.position.copy(nodes[searchState.currentNodeIdx].position);
      }
    }
  });

  const { nodePositions, nodeColors, nodeSizes } = useMemo(() => {
    const pos = new Float32Array(nodes.length * 3);
    const col = new Float32Array(nodes.length * 3);
    const size = new Float32Array(nodes.length);
    const color = new THREE.Color();
    nodes.forEach((n, i) => {
      pos.set([n.position.x, n.position.y, n.position.z], i * 3);
      
      let levelColor;
      let nodeSize = 0.15;
      
      if (i === searchState.targetNodeIdx) {
        levelColor = "#ff00ea"; 
        nodeSize = 0.3;
      } else if (visitedNodes.has(i)) {
        levelColor = "#00ffaa"; 
        nodeSize = 0.2;
      } else {
        levelColor = n.level === 2 ? "#ffffff" : n.level === 1 ? "#00f2ff" : "#7000ff";
        nodeSize = n.level === 2 ? 0.25 : n.level === 1 ? 0.18 : 0.08;
      }
      
      color.set(levelColor);
      col.set([color.r, color.g, color.b], i * 3);
      size[i] = nodeSize;
    });
    return { nodePositions: pos, nodeColors: col, nodeSizes: size };
  }, [nodes, visitedNodes, searchState.targetNodeIdx]);

  const linePositions = useMemo(() => {
    const pos = [];
    nodes.forEach((node) => {
      node.connections.forEach(connIdx => {
        pos.push(node.position.x, node.position.y, node.position.z);
        pos.push(nodes[connIdx].position.x, nodes[connIdx].position.y, nodes[connIdx].position.z);
      });
    });
    return new Float32Array(pos);
  }, [nodes]);

  const pathLinePositions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < activePath.length - 1; i++) {
      const start = nodes[activePath[i]].position;
      const end = nodes[activePath[i+1]].position;
      pos.push(start.x, start.y, start.z, end.x, end.y, end.z);
    }
    return new Float32Array(pos);
  }, [activePath, nodes]);

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={nodes.length} array={nodePositions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={nodes.length} array={nodeColors} itemSize={3} />
        </bufferGeometry>
        <PointMaterial 
          size={0.25} 
          vertexColors 
          transparent 
          opacity={0.8} 
          sizeAttenuation 
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={linePositions.length / 3} array={linePositions} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#00f2ff" transparent opacity={0.4} />
      </lineSegments>

      <mesh ref={searchPathRef}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
        <pointLight color="#00ffaa" intensity={15} distance={10} decay={2} />
      </mesh>

      {activeEdgePoints.length > 0 && (
        <line>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={2} array={activeEdgePoints} itemSize={3} />
          </bufferGeometry>
          <lineBasicMaterial color="#00ffaa" transparent opacity={1} linewidth={3} />
          <pointLight color="#00ffaa" intensity={20} distance={5} />
        </line>
      )}

      {pathLinePositions.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={pathLinePositions.length / 3} array={pathLinePositions} itemSize={3} />
          </bufferGeometry>
          <lineBasicMaterial color="#00ffaa" transparent opacity={0.6} linewidth={2} />
        </lineSegments>
      )}

      {/* Target Pulse */}
      <mesh position={nodes[searchState.targetNodeIdx].position}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#ff00ea" />
      </mesh>
      <group position={nodes[searchState.targetNodeIdx].position}>
        <mesh>
          <ringGeometry args={[0.15, 0.17, 32]} />
          <meshBasicMaterial color="#ff00ea" transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
        <pointLight color="#ff00ea" intensity={10} distance={5} />
      </group>

      {/* Neon Beat Effect */}
      <BeatPulse 
        position={nodes[beatingNodeIdx].position} 
        color={nodes[beatingNodeIdx].level === 2 ? "#ffffff" : nodes[beatingNodeIdx].level === 1 ? "#00f2ff" : "#7000ff"} 
        nodeIdx={beatingNodeIdx}
      />
    </group>
  );
};

export default HNSWGraph;
