import React from 'react';
import { TreeState } from '../types';

interface OverlayProps {
  treeState: TreeState;
  setTreeState: (state: TreeState) => void;
}

export const Overlay: React.FC<OverlayProps> = ({ treeState, setTreeState }) => {
  const isTree = treeState === TreeState.TREE_SHAPE;

  const toggle = () => {
    setTreeState(isTree ? TreeState.SCATTERED : TreeState.TREE_SHAPE);
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 z-10">
      {/* Header */}
      <header className="flex flex-col items-center pt-4 opacity-90 transition-opacity duration-1000">
        <h1 className="font-serif text-3xl md:text-5xl text-arix-gold tracking-widest uppercase mb-2 drop-shadow-[0_0_10px_rgba(212,175,55,0.5)] text-center">
          Arix Signature
        </h1>
        <div className="w-24 h-[1px] bg-arix-gold opacity-50 mb-2"></div>
        <p className="font-sans text-xs md:text-sm text-arix-goldLight tracking-[0.3em] uppercase">
          Interactive Holiday Experience
        </p>
      </header>

      {/* Controls */}
      <div className="flex flex-col items-center pb-8 pointer-events-auto">
        <button
          onClick={toggle}
          className={`
            group relative px-8 py-3 
            overflow-hidden transition-all duration-500 ease-out
            border border-arix-gold/30 hover:border-arix-gold
            backdrop-blur-sm bg-black/20
          `}
        >
          {/* Animated Background */}
          <div className="absolute inset-0 w-full h-full bg-arix-gold/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          
          <span className="relative font-serif text-lg text-arix-gold group-hover:text-white transition-colors duration-300">
            {isTree ? 'Release Magic' : 'Gather Spirit'}
          </span>
        </button>
        
        <p className="mt-4 font-sans text-[10px] text-arix-goldLight/40 tracking-wider">
          {isTree ? 'Tap to scatter the elements' : 'Tap to form the signature tree'}
        </p>
      </div>

      {/* Corner Watermark */}
      <div className="absolute bottom-6 right-6 opacity-30">
        <div className="text-[10px] font-sans text-arix-gold text-right">
          EST. 2024<br/>LIMITED EDITION
        </div>
      </div>
    </div>
  );
};
