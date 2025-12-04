import React, { useMemo, useRef, useLayoutEffect } from 'react';
import { InstancedMesh, Object3D, Vector3, MathUtils, DynamicDrawUsage } from 'three';
import { useFrame } from '@react-three/fiber';
import { TreeState, ParticleData } from '../types';
import { CONFIG, COLORS, ANIMATION_SPEED } from '../constants';

interface TreeParticlesProps {
  treeState: TreeState;
}

const tempObject = new Object3D();
const tempVec3 = new Vector3();

export const TreeParticles: React.FC<TreeParticlesProps> = ({ treeState }) => {
  const meshRef = useRef<InstancedMesh>(null);
  const targetFactor = useRef(0); // 0 = Scattered, 1 = Tree
  const currentFactor = useRef(0);

  // Generate data once
  const data: ParticleData[] = useMemo(() => {
    const particles: ParticleData[] = [];
    
    for (let i = 0; i < CONFIG.particleCount; i++) {
      // 1. Scatter Position (Random inside sphere)
      const r = Math.cbrt(Math.random()) * CONFIG.scatterRadius;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const scatterPos = new Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );

      // 2. Tree Position (Cone shape)
      // Height normalized 0 to 1 (bottom to top)
      const hNorm = Math.random();
      const y = hNorm * CONFIG.treeHeight - (CONFIG.treeHeight / 2);
      // Radius at this height (tapers to top)
      const coneR = (1 - hNorm) * CONFIG.treeRadius;
      
      // Spiral distribution for elegance
      const spiralAngle = hNorm * 25 + Math.random() * Math.PI * 2;
      // Add slight randomness to radius for "fluffy" look
      const finalR = coneR * (0.8 + Math.random() * 0.4);
      
      const treePos = new Vector3(
        Math.cos(spiralAngle) * finalR,
        y,
        Math.sin(spiralAngle) * finalR
      );

      // 3. Rotation (Point outwards from center for tree mode)
      const rot = new Vector3(
        (Math.random() - 0.5) * 0.5,
        Math.random() * Math.PI * 2,
        (Math.random() - 0.5) * 0.5
      );

      particles.push({
        scatterPosition: scatterPos,
        treePosition: treePos,
        rotation: rot,
        scale: 0.5 + Math.random() * 0.5,
        color: Math.random() > 0.7 ? COLORS.EMERALD_LIGHT : COLORS.EMERALD_DEEP
      });
    }
    return particles;
  }, []);

  useLayoutEffect(() => {
    if (meshRef.current) {
      // Initialize colors
      data.forEach((particle, i) => {
        meshRef.current!.setColorAt(i, particle.color);
      });
      meshRef.current.instanceColor!.needsUpdate = true;
    }
  }, [data]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Determine target based on state prop
    const target = treeState === TreeState.TREE_SHAPE ? 1 : 0;
    
    // Smooth lerp for the factor
    // Using a slightly faster ease-out feel
    const diff = target - currentFactor.current;
    currentFactor.current += diff * (delta * 2 + ANIMATION_SPEED); 

    // Safety clamp
    currentFactor.current = MathUtils.clamp(currentFactor.current, 0, 1);

    const isMoving = Math.abs(diff) > 0.001;

    // Optimization: Only update loop if we are transitioning or in motion
    // However, to keep the floating effect in SCATTERED state, we always run
    if (isMoving || currentFactor.current < 1) {
       // Time for floating animation
       const t = state.clock.elapsedTime;

       for (let i = 0; i < data.length; i++) {
         const particle = data[i];

         // Calculate Current Position
         // Lerp between Scatter and Tree
         tempVec3.lerpVectors(particle.scatterPosition, particle.treePosition, currentFactor.current);

         // Add floating noise when scattered
         // As factor approaches 1 (Tree), noise reduces to 0 for stability
         const floatIntensity = (1 - currentFactor.current) * 0.5;
         tempVec3.y += Math.sin(t + i) * floatIntensity * 0.1;
         tempVec3.x += Math.cos(t * 0.5 + i) * floatIntensity * 0.1;

         tempObject.position.copy(tempVec3);
         
         // Rotation logic:
         // When scattered: Random tumbling
         // When tree: Oriented somewhat normally
         tempObject.rotation.set(
           particle.rotation.x + t * floatIntensity * 0.2,
           particle.rotation.y + t * floatIntensity * 0.1,
           particle.rotation.z
         );

         // Look at center when forming tree for better needle orientation
         if (currentFactor.current > 0.5) {
            tempObject.lookAt(0, tempObject.position.y, 0);
         }

         tempObject.scale.setScalar(particle.scale);
         tempObject.updateMatrix();
         meshRef.current.setMatrixAt(i, tempObject.matrix);
       }
       meshRef.current.instanceMatrix.needsUpdate = true;
    }
    
    // Slowly rotate the whole tree when formed
    if (currentFactor.current > 0.8) {
        meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <instancedMesh 
      ref={meshRef} 
      args={[undefined, undefined, CONFIG.particleCount]} 
      usage={DynamicDrawUsage}
    >
      <capsuleGeometry args={[0.05, 0.4, 4, 8]} />
      <meshStandardMaterial 
        roughness={0.8} 
        metalness={0.1}
        color="#003311"
      />
    </instancedMesh>
  );
};
