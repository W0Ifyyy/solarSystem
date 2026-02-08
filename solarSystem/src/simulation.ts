import * as THREE from "three"
import type { PlanetBody } from "./types";

const direction =  new THREE.Vector3();

export function computeGravity(
    body: PlanetBody,
    sunPosition: THREE.Vector3,
    sunMass: number,
    G: number
): THREE.Vector3 { 
    direction.subVectors(sunPosition, body.position);
    const distSq = direction.lengthSq();
    const addition = 1; // to avoid dividing by zero
    const forceMag = (G * sunMass) / (distSq + addition);
    direction.normalize().multiplyScalar(forceMag);
    return direction.clone();
};

export function stepSimulation(
    planets: PlanetBody[],
    sunPosition: THREE.Vector3,
    sunMass: number,
    G: number,
    dt: number
): void {
    for(const planet of planets){
        const acceleration = computeGravity(planet, sunPosition, sunMass, G);

        // update velocity
        planet.velocity.addScaledVector(acceleration, dt);
        // update position
        planet.position.addScaledVector(planet.velocity, dt);
        //sync three js mesh
        planet.mesh.position.copy(planet.position);
    }
}