# Solar System Simulation

Hi! This is my new project where i'll try to immitate our beloved solar system using almost real like physics. Later on I plan to  implement some controls, for users to adjust sun mass and basic variables, that have an impact on apps physics, and if it goes beyond a certain threshold(of the sun mass) the sun will turn into a black hole.

## Features

- Interactive 3D visualization of the solar system
- Physics-based orbital mechanics
- Realistic planetary movements
- Built with React and Three.js
- TypeScript for type safety

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The app runs at `http://localhost:5173` by default.

## Build

Create a production build:

```bash
npm run build
```

Preview the build:

```bash
npm run preview
```

## Linting

```bash
npm lint
```

## Project Structure

```
src/
├── App.tsx
├── App.css
├── main.tsx
├── index.css
├── types.ts
├── planetData.ts
├── sceneSetup.ts
├── simulation.ts
├── SolarSystem.tsx
└── assets/
```

## Technologies

- React 19
- Vite
- Three.js
- TypeScript
- ESLint
