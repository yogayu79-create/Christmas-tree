import React, { useMemo, useRef, useLayoutEffect } from 'react';
import { InstancedMesh, Object3D, Vector3, MathUtils, DynamicDrawUsage, Color } from 'three';
import { useFrame } from '@react-three/fiber';
import { TreeState, ParticleData } from '../types';
import { CONFIG, COLORS, ANIMATION_SPEED } from '../constants';

interface OrnamentsProps {
  treeState: TreeState;
}

const tempObject = new Object3D();
const tempVec3 = new Vector3();

export const Ornaments: React.FC<OrnamentsProps> = ({ treeState }) => {
  const meshRef = useRef<InstancedMesh>(null);
  const currentFactor = useRef(0);

  const data: ParticleData[] = useMemo(() => {
    const items: ParticleData[] = [];
    
    for (let i = 0; i < CONFIG.ornamentCount; i++) {
      // Scatter
      const r = Math.cbrt(Math.random()) * CONFIG.scatterRadius * 1.2;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const scatterPos = new Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );

      // Tree Position - Must be on the surface or slightly inset
      const hNorm = Math.random();
      const y = hNorm * CONFIG.treeHeight - (CONFIG.treeHeight / 2);
      const coneR = (1 - hNorm) * CONFIG.treeRadius;
      
      // Spiral distribution but distinct from needles
      const spiralAngle = hNorm * 15 + (Math.PI) + Math.random() * Math.PI * 2;
      // Ornaments sit near the edge
      const finalR = coneR * 0.9; 
      
      const treePos = new Vector3(
        Math.cos(spiralAngle) * finalR,
        y,
        Math.sin(spiralAngle) * finalR
      );

      items.push({
        scatterPosition: scatterPos,
        treePosition: treePos,
        rotation: new Vector3(0,0,0),
        scale: 0.2 + Math.random() * 0.3,
        color: Math.random() > 0.5 ? COLORS.GOLD_METALLIC : COLORS.GOLD_ROSE
      });
    }
    return items;
  }, []);

  useLayoutEffect(() => {
    if (meshRef.current) {
      data.forEach((item, i) => {
        meshRef.current!.setColorAt(i, item.color);
      });
      meshRef.current.instanceColor!.needsUpdate = true;
    }
  }, [data]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const target = treeState === TreeState.TREE_SHAPE ? 1 : 0;
    const diff = target - currentFactor.current;
    
    // Ornaments lag slightly behind needles for a layered effect
    currentFactor.current += diff * (delta * 1.5 + ANIMATION_SPEED); 
    currentFactor.current = MathUtils.clamp(currentFactor.current, 0, 1);

    const t = state.clock.elapsedTime;

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      tempVec3.lerpVectors(item.scatterPosition, item.treePosition, currentFactor.current);
      
      // Floating effect when scattered
      const floatIntensity = (1 - currentFactor.current);
      tempVec3.y += Math.sin(t * 1.5 + i) * floatIntensity * 0.2;

      tempObject.position.copy(tempVec3);
      tempObject.rotation.set(t * 0.5, t * 0.3, 0); // Gentle spin
      tempObject.scale.setScalar(item.scale);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;

    // Rotate group with tree
    if (currentFactor.current > 0.8) {
        meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <instancedMesh 
      ref={meshRef} 
      args={[undefined, undefined, CONFIG.ornamentCount]} 
      usage={DynamicDrawUsage}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial 
        roughness={0.1} 
        metalness={1}
        emissive={COLORS.GOLD_METALLIC}
        emissiveIntensity={0.2}
        color={COLORS.GOLD_METALLIC}
      />
    </instancedMesh>
  );
};
