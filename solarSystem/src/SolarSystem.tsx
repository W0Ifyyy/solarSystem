import React, { useRef, useEffect, useCallback } from "react";
import type { SimulationParams, PlanetBody } from "./types";
import {
  createScene,
  createCamera,
  createRenderer,
  createControls,
  addLights,
  createSun,
  createPlanets,
  addSaturnRing,
  updateTrail,
} from "./sceneSetup";
import { stepSimulation } from "./simulation";

interface SolarSystemProps {
  params: SimulationParams;
  resetKey: number;
}

const SolarSystem: React.FC<SolarSystemProps> = ({ params, resetKey = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paramsRef = useRef<SimulationParams>(params);

  // Keep the ref in sync with the latest params from React (no re-render needed)
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  const initScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement!;
    const width = parent.clientWidth;
    const height = parent.clientHeight;

    // ---- Three.js setup ----
    const scene = createScene();
    const camera = createCamera(width / height);
    const renderer = createRenderer(canvas, width, height);
    const controls = createControls(camera, canvas);
    addLights(scene);

    const sunMesh = createSun(scene);
    const sunPosition = sunMesh.position.clone();

    const planets: PlanetBody[] = createPlanets(scene);
    addSaturnRing(planets);

    // ---- Handle resize ----
    const onResize = () => {
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ---- Animation loop ----
    let animId = 0;
    let lastTime = performance.now();

    const animate = (now: number) => {
      animId = requestAnimationFrame(animate);

      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      // Clamp dt to avoid spiral of death on tab switch
      const dt = Math.min(rawDt, 0.05) * paramsRef.current.timeScale;

      const { G, sunMass, showTrails } = paramsRef.current;

      // Physics sub-steps for stability
      const subSteps = 8;
      const subDt = dt / subSteps;
      for (let i = 0; i < subSteps; i++) {
        stepSimulation(planets, sunPosition, sunMass, G, subDt);
      }

      // Update trails
      for (const planet of planets) {
        updateTrail(planet, showTrails);
      }

      // Slowly rotate Sun for visual flair
      sunMesh.rotation.y += 0.002;

      controls.update();
      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    // ---- Cleanup ----
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      controls.dispose();
      renderer.dispose();

      // Dispose geometries & materials
      scene.traverse((obj) => {
        if ((obj as any).geometry) (obj as any).geometry.dispose();
        if ((obj as any).material) {
          const mat = (obj as any).material;
          if (Array.isArray(mat)) mat.forEach((m: any) => m.dispose());
          else mat.dispose();
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  useEffect(() => {
    const cleanup = initScene();
    return cleanup;
  }, [initScene]);

  return <canvas ref={canvasRef} className="solar-canvas" />;
};

export default SolarSystem;