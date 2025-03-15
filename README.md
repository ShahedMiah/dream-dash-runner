# Dream Dash Runner

A surreal endless runner game built with React Native where players navigate through shifting dreamlike landscapes.

## Game Concept

Dream Dash is an endless runner with a surreal twist:

- Navigate through dreamlike landscapes that shift between surreal environments
- Each environment has its own visual style, obstacle types, and gameplay mechanics
- The game transitions between environments when players collect special "dream fragments"

## Visual Style

- Minimalist but vibrant color palette with gradient backgrounds
- Environments defined by distinct color themes (e.g., blue dreamscape, purple void zone)
- Light particle effects that follow the player movement
- Soft glow around collectible items and dream fragments

## Key Features

1. **Shifting Environments**
   - Player doesn't just jump/slide but triggers environment shifts
   - Screen flash transitions between distinctly styled zones
   - Background music shifts with each environment change

2. **Fragment Collection**
   - Player collects "dream fragments" that appear as floating glowing particles
   - Collecting all fragments in a section unlocks special paths or shortcuts

3. **Obstacle Variations**
   - Obstacles match environment themes (floating platforms in dream zones, abstract shapes in void zones)
   - Some obstacles move in mesmerizing patterns rather than just approaching horizontally

## Setup Instructions

```bash
# Clone the repository
git clone https://github.com/YourUsername/dream-dash-runner.git

# Navigate to the project directory
cd dream-dash-runner

# Install dependencies
npm install

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## Technologies Used

- React Native
- React Native Game Engine
- React Native SVG
- Matter.js (for physics)
