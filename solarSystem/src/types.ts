import type * as THREE from 'three';

export type PlanetBody = {
    name: string;
    mass: number;
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    mesh: THREE.Mesh;
    trail: THREE.Vector3[];
    trailLine: THREE.Line | null;
}

export interface PlanetConfig {
  name: string;
  mass: number;
  radius: number;
  color: number;
  distance: number;     
  initialSpeed: number;  
  trailColor: number;
}

export interface SimulationParams {
  G: number;
  sunMass: number;
  timeScale: number;
  showTrails: boolean;
}