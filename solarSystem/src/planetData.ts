import type { PlanetConfig } from "./types";


export const PLANET_CONFIGS: PlanetConfig[] = [
  {
    name: "Mercury",
    mass: 3.3,
    radius: 0.4,
    color: 0xb5b5b5,
    distance: 10,
    initialSpeed: 0, // computed at runtime
    trailColor: 0x888888,
  },
  {
    name: "Venus",
    mass: 48.7,
    radius: 0.7,
    color: 0xe8cda0,
    distance: 15,
    initialSpeed: 0,
    trailColor: 0xd4a84b,
  },
  {
    name: "Earth",
    mass: 59.7,
    radius: 0.75,
    color: 0x4a90d9,
    distance: 20,
    initialSpeed: 0,
    trailColor: 0x4a90d9,
  },
  {
    name: "Mars",
    mass: 6.4,
    radius: 0.55,
    color: 0xc1440e,
    distance: 27,
    initialSpeed: 0,
    trailColor: 0xc1440e,
  },
  {
    name: "Jupiter",
    mass: 1898,
    radius: 2.0,
    color: 0xc88b3a,
    distance: 42,
    initialSpeed: 0,
    trailColor: 0xc88b3a,
  },
  {
    name: "Saturn",
    mass: 568,
    radius: 1.7,
    color: 0xe8d898,
    distance: 58,
    initialSpeed: 0,
    trailColor: 0xe8d898,
  },
  {
    name: "Uranus",
    mass: 86.8,
    radius: 1.2,
    color: 0x73c2d0,
    distance: 75,
    initialSpeed: 0,
    trailColor: 0x73c2d0,
  },
  {
    name: "Neptune",
    mass: 102,
    radius: 1.15,
    color: 0x3f54ba,
    distance: 95,
    initialSpeed: 0,
    trailColor: 0x3f54ba,
  },
  {
    name: "Pluto",
    radius: 0.3,
    color: 0x999999,
    distance: 110,
    mass: 0.1475,
    initialSpeed: 0,
    trailColor: 0x999999,
  }
];

export const SUN_CONFIG = {
    radius: 4, 
    
    color: 0xffdd33,
    emissiveColor: 0xffaa00,
    defaultMass: 10000,
}

export const G_CONSTANT = 0.5; 
export const TIME_SCALE = 1;

export function circularOrbitSpeed(G: number, sunMass: number, distance: number): number {
  return Math.sqrt(G * sunMass / distance);
}

export const MAX_TRAIL_LENGTH = 600; // Asjust as needed for better visual experience