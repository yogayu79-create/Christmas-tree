import React, { useRef } from 'react';
import { Mesh, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { TreeState } from '../types';
import { CONFIG, COLORS } from '../constants';
import { Float } from '@react-three/drei';

interface TreeStarProps {
    treeState: TreeState;
}

export const TreeStar: React.FC<TreeStarProps> = ({ treeState }) => {
  const meshRef = useRef<Mesh>(null);
  const currentPos = useRef(new Vector3(0, 20, 0)); // Start high up
  const treeTopPos = new Vector3(0, CONFIG.treeHeight / 2 + 0.5, 0);
  
  useFrame((state, delta) => {
    if(!meshRef.current) return;

    const targetPos = treeState === TreeState.TREE_SHAPE ? treeTopPos : new Vector3(0, 15, 0);
    currentPos.current.lerp(targetPos, delta * 2);

    meshRef.current.position.copy(currentPos.current);
    
    // Scale up when formed
    const scaleTarget = treeState === TreeState.TREE_SHAPE ? 1 : 0.1;
    meshRef.current.scale.lerp(new Vector3(scaleTarget, scaleTarget, scaleTarget), delta * 2);

    meshRef.current.rotation.y += delta * 0.5;
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef}>
            <octahedronGeometry args={[0.8, 0]} />
            <meshStandardMaterial 
                color={COLORS.GOLD_LIGHT}
                emissive={COLORS.GOLD_LIGHT}
                emissiveIntensity={2}
                toneMapped={false}
            />
            {/* Inner light for bloom */}
            <pointLight distance={5} intensity={5} color={COLORS.GOLD_LIGHT} />
        </mesh>
    </Float>
  );
};
