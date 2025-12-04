import { Vector3, Color } from 'three';

export enum TreeState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE'
}

export interface ParticleData {
  scatterPosition: Vector3;
  treePosition: Vector3;
  rotation: Vector3; // Euler angles
  scale: number;
  color: Color;
}

export interface InteractiveTreeProps {
  treeState: TreeState;
}

export interface SceneConfig {
  particleCount: number;
  ornamentCount: number;
  treeHeight: number;
  treeRadius: number;
  scatterRadius: number;
}
