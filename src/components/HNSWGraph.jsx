import { useRef, useMemo, useState } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { PointMaterial } from '@react-three/drei';

extend({ PointMaterial });

const HNSWGraph = () => {
  console.log("HNSWGraph rendering");
  const count = 40;
  const nodes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      ),
      level: i < 5 ? 2 : i < 15 ? 1 : 0, // hierarchical levels
      connections: []
    }));
  }, []);

  // Create hierarchical connections (HNSW-style)
  useMemo(() => {
    nodes.forEach((node, i) => {
      // Connect to neighbors at the same level or lower
      const neighbors = nodes
        .map((n, idx) => ({ idx, dist: node.position.distanceTo(n.position), level: n.level }))
        .filter(n => n.idx !== i && n.level <= node.level)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 3);
      
      node.connections = neighbors.map(n => n.idx);
      
      // Ensure higher levels have entries to lower levels
      if (node.level > 0) {
        const lowerNeighbors = nodes
          .map((n, idx) => ({ idx, dist: node.position.distanceTo(n.position), level: n.level }))
          .filter(n => n.level < node.level)
          .sort((a, b) => a.dist - b.dist)
          .slice(0, 1);
        node.connections.push(...lowerNeighbors.map(n => n.idx));
      }
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
    if (phaseTime < 2) currentPhase = 'waiting';
    else if (phaseTime < 4) currentPhase = 'embedding';
    else currentPhase = 'searching';

    if (currentPhase !== searchState.phase) {
      setSearchState(s => {
        if (currentPhase === 'waiting') {
          const nextTarget = Math.floor(Math.random() * count);
          setVisitedNodes(new Set());
          setActivePath([]);
          return { ...s, phase: currentPhase, currentNodeIdx: s.targetNodeIdx, targetNodeIdx: nextTarget, path: [], step: 0 };
        } else if (currentPhase === 'searching') {
          // HNSW Multi-level Greedy Search Simulation
          const path = [s.currentNodeIdx];
          let curr = s.currentNodeIdx;
          const target = nodes[s.targetNodeIdx].position;
          
          for (let i = 0; i < 20; i++) {
            const neighbors = nodes[curr].connections;
            let bestNeighbor = curr;
            let minDist = nodes[curr].position.distanceTo(target);
            
            neighbors.forEach(nIdx => {
              const d = nodes[nIdx].position.distanceTo(target);
              if (d < minDist) {
                minDist = d;
                bestNeighbor = nIdx;
              }
            });
            
            if (bestNeighbor === curr) break;
            curr = bestNeighbor;
            path.push(curr);
            if (curr === s.targetNodeIdx) break;
          }
          return { ...s, phase: currentPhase, path, step: 0 };
        } else {
          return { ...s, phase: currentPhase };
        }
      });
    }

    // Animate searching phase
    if (searchState.phase === 'searching' && searchState.path.length > 0) {
      const searchStartTime = (Math.floor(t / cycleTime) * cycleTime) + 4;
      const totalSearchTime = cycleTime - 4.5; 
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

          // Update visited nodes and active path
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

  const { nodePositions, nodeColors } = useMemo(() => {
    const pos = new Float32Array(nodes.length * 3);
    const col = new Float32Array(nodes.length * 3);
    const color = new THREE.Color();
    nodes.forEach((n, i) => {
      pos.set([n.position.x, n.position.y, n.position.z], i * 3);
      
      let levelColor;
      if (i === searchState.targetNodeIdx) {
        levelColor = "#ff00ea"; // Target color
      } else if (visitedNodes.has(i)) {
        levelColor = "#00ffaa"; // Visited color
      } else {
        levelColor = n.level === 2 ? "#ffffff" : n.level === 1 ? "#00f2ff" : "#7000ff";
      }
      
      color.set(levelColor);
      col.set([color.r, color.g, color.b], i * 3);
    });
    return { nodePositions: pos, nodeColors: col };
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
        <PointMaterial size={0.2} vertexColors transparent opacity={0.9} sizeAttenuation />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={linePositions.length / 3} array={linePositions} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#00f2ff" transparent opacity={0.2} />
      </lineSegments>

      <mesh ref={searchPathRef}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
        <pointLight color="#00f2ff" intensity={10} distance={5} decay={2} />
      </mesh>

      {activeEdgePoints.length > 0 && (
        <line>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={2} array={activeEdgePoints} itemSize={3} />
          </bufferGeometry>
          <lineBasicMaterial color="#ff00ea" transparent opacity={1} linewidth={3} />
        </line>
      )}

      {pathLinePositions.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={pathLinePositions.length / 3} array={pathLinePositions} itemSize={3} />
          </bufferGeometry>
          <lineBasicMaterial color="#00ffaa" transparent opacity={0.8} linewidth={2} />
        </lineSegments>
      )}

      {/* Target Highlight */}
      <mesh position={nodes[searchState.targetNodeIdx].position}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#ff00ea" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

export default HNSWGraph;
