import { useCallback, useState } from 'react'
import { G_CONSTANT, SUN_CONFIG, TIME_SCALE } from './planetData';
import type { SimulationParams } from './types';
import SolarSystem from './SolarSystem';
const defaultParams: SimulationParams = {
  G: G_CONSTANT,
  sunMass: SUN_CONFIG.defaultMass,
  timeScale: TIME_SCALE,
  showTrails: true,
};

function App() {
  const [params, setParams] = useState<SimulationParams>(defaultParams);
  const [resetKey, setResetKey] = useState(0);

  const handleReset = useCallback(() => {
    setParams(defaultParams);
    setResetKey((k) => k + 1);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <SolarSystem params={params} resetKey={resetKey} />
    </div>
  );
}

export default App
