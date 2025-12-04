import { Color } from 'three';
import { SceneConfig } from './types';

// Aesthetic Palette
export const COLORS = {
  EMERALD_DEEP: new Color('#004225'),
  EMERALD_LIGHT: new Color('#0B6623'),
  GOLD_METALLIC: new Color('#FFD700'),
  GOLD_ROSE: new Color('#E0BFB8'),
  GLOW_WARM: new Color('#FFB347'),
  GOLD_LIGHT: new Color('#FCEEA7'),
};

// Scene Configuration
export const CONFIG: SceneConfig = {
  particleCount: 3500, // Number of pine needles
  ornamentCount: 150, // Number of gold baubles
  treeHeight: 12,
  treeRadius: 4.5,
  scatterRadius: 15,
};

// Animation Settings
export const ANIMATION_SPEED = 0.04; // Lerp factor