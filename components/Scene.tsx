import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { TreeParticles } from './TreeParticles';
import { Ornaments } from './Ornaments';
import { TreeStar } from './TreeStar';
import { TreeState } from '../types';

interface SceneProps {
  treeState: TreeState;
}

export const Scene: React.FC<SceneProps> = ({ treeState }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 25], fov: 45 }}
      gl={{ antialias: false, alpha: false }} // Optimization for post-processing
      dpr={[1, 2]} // Handle high DPI screens
    >
      <color attach="background" args={['#000503']} />
      
      {/* Lighting - Cinematic Setup */}
      <ambientLight intensity={0.2} color="#002211" />
      <spotLight 
        position={[10, 20, 10]} 
        angle={0.3} 
        penumbra={1} 
        intensity={2} 
        color="#fff0cc" 
        castShadow 
      />
      <pointLight position={[-10, -5, -10]} intensity={1} color="#004225" />
      <pointLight position={[0, 10, 5]} intensity={1.5} color="#ffd700" />

      {/* Environment for reflections */}
      <Environment preset="city" />

      <Suspense fallback={null}>
        <group position={[0, -2, 0]}>
            <TreeParticles treeState={treeState} />
            <Ornaments treeState={treeState} />
            <TreeStar treeState={treeState} />
        </group>
        
        {/* Background Atmosphere */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Suspense>

      <OrbitControls 
        enablePan={false} 
        maxPolarAngle={Math.PI / 1.5} 
        minPolarAngle={Math.PI / 3}
        maxDistance={40}
        minDistance={10}
        autoRotate={treeState === TreeState.SCATTERED}
        autoRotateSpeed={0.5}
      />

      {/* Post Processing for the "Luxurious Glow" */}
      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={0.8} // Only very bright things glow
          mipmapBlur 
          intensity={1.5} 
          radius={0.4}
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <Noise opacity={0.02} /> 
      </EffectComposer>
    </Canvas>
  );
};
