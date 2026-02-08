import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { circularOrbitSpeed, G_CONSTANT, MAX_TRAIL_LENGTH, PLANET_CONFIGS, SUN_CONFIG } from "./planetData";
import type { PlanetBody } from "./types";


//Create a scene in Three.js with stars background
export function createScene(): THREE.Scene {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000005);   

    // Stars
    const starCount = 3000;
    const positions = new Float32Array(starCount * 3);
    for(let i = 0; i < positions.length; i++){
        positions[i] = (Math.random() - 0.5) * 1200;
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        sizeAttenuation: true,
    })
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    return scene;
}

//Create the camera
export function createCamera(aspect: number): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 2000);
    camera.position.set(0,80,120);
    camera.lookAt(0,0,0);

    return camera;
}

//Create the renderer
export function createRenderer(
    canvas: HTMLCanvasElement,
    width: number,
    height: number
): THREE.WebGLRenderer {
    
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true
    })
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    return renderer;
}

//Create OrbitControls - it lets drag the camera to rotate, scroll to zoom and right click 
// pan the camera around the target point.
export function createControls(
    camera: THREE.PerspectiveCamera,
    domElement: HTMLCanvasElement
): OrbitControls{
    const controls = new OrbitControls(camera, domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 10
    controls.maxDistance = 600;
    return controls;
}

//Add lights to the scene
export function addLights(scene: THREE.Scene): void {
    const sunLight = new THREE.PointLight(0xffffff, 2, 500, 0.5);
    sunLight.position.set(0,0,0);
    scene.add(sunLight);

    const ambient = new THREE.AmbientLight(0x222233, 0.4);
    scene.add(ambient);
}

// Create sun mesh with emmissive material so it glows

export function createSun(scene: THREE.Scene): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(SUN_CONFIG.radius, 64, 64);
    const material = new THREE.MeshStandardMaterial({
        color: SUN_CONFIG.color,
        emissive: SUN_CONFIG.emissiveColor,
        emissiveIntensity: 1.5,
        roughness: 0.3,
        metalness: 0.0,
    })
    const sunMesh = new THREE.Mesh(geometry, material);
    sunMesh.position.set(0,0,0);
    scene.add(sunMesh);

    //Sun glow
    const glowGeometry = new THREE.SphereGeometry(SUN_CONFIG.radius * 1.3, 32,32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffcc00,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide,    
    })
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    sunMesh.add(glow);

    return sunMesh;
}

//Create a trail line for a planet
function createTrailLine(scene: THREE.Scene, color: number): THREE.Line{
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(MAX_TRAIL_LENGTH * 3);
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setDrawRange(0,0);

    const material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.5,
    })
    const line = new THREE.Line(geometry, material);
    scene.add(line);
    return line;
}

//Create planet meshes and PlanetBody objects
export function createPlanets(scene: THREE.Scene): PlanetBody[] {
    return PLANET_CONFIGS.map(config => {
        const geometry = new THREE.SphereGeometry(config.radius, 32, 32);
        const material = new THREE.MeshStandardMaterial({
            color: config.color,
            roughness: 0.7,
            metalness: 0.1,
        })
        const mesh = new THREE.Mesh(geometry, material);

        const position = new THREE.Vector3(config.distance, 0, 0);
        const speed = circularOrbitSpeed(G_CONSTANT, SUN_CONFIG.defaultMass, config.distance);
        const velocity = new THREE.Vector3(0,0, speed);

        mesh.position.copy(position);
        scene.add(mesh);
        
        const trailLine = createTrailLine(scene, config.trailColor);

        return {
            name: config.name,
            mass: config.mass,
            position: position.clone(),
            velocity: velocity.clone(),
            mesh,
            trail: [] as THREE.Vector3[],
            trailLine
        }
    })
}


// Update the trail for the planet
export function updateTrail(planet: PlanetBody, showTrails: boolean): void { 
    planet.trail.push(planet.position.clone());
    if(planet.trail.length > MAX_TRAIL_LENGTH){
        planet.trail.shift();
    }

    if(planet.trailLine){
    
        if(!showTrails) {
            planet.trailLine.visible = false;
            return;
        }
        planet.trailLine.visible = true;

        const posAttribute = planet.trailLine.geometry.getAttribute("position") as THREE.BufferAttribute;
        const arr = posAttribute.array as Float32Array;
        for(let i = 0; i < planet.trail.length; i++){
            arr[i * 3] = planet.trail[i].x;
            arr[i * 3 + 1] = planet.trail[i].y;
            arr[i * 3 + 2] = planet.trail[i].z;
        }
        posAttribute.needsUpdate = true;
        planet.trailLine.geometry.setDrawRange(0, planet.trail.length);
    }
}


// Create ring for Saturn 
export function addSaturnRing(planets: PlanetBody[]): void{
    const saturn = planets.find(p => p.name === "Saturn")!;

    const innerRadius = 2.2;
    const outerRadius = 3.5;
    const ringGeo = new THREE.RingGeometry(innerRadius, outerRadius, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xc2a663,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
    })
    const ring = new THREE.Mesh(ringGeo, ringMaterial);
    ring.rotation.x = Math.PI / 2.2;
    saturn.mesh.add(ring);
}
