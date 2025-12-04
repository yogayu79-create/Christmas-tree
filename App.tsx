import React, { useState } from 'react';
import { Scene } from './components/Scene';
import { Overlay } from './components/Overlay';
import { TreeState } from './types';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeState>(TreeState.SCATTERED);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Scene treeState={treeState} />
      </div>

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10">
        <Overlay treeState={treeState} setTreeState={setTreeState} />
      </div>
      
      {/* Loading/Fallback visual (handled by Suspense in Scene, but good to have bg color) */}
      <div className="absolute -z-10 inset-0 bg-[#000503]" />
    </div>
  );
};

export default App;
