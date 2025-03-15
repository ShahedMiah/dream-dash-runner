import Matter from 'matter-js';
import { PLAYER_WIDTH, PLAYER_HEIGHT } from '../constants/dimensions';

/**
 * Creates the player entity with physics body and rendering properties
 * @param {Object} position - Initial position {x, y}
 * @param {Object} options - Additional options 
 */
export const createPlayer = (position, options = {}) => {
  // Create physics body for the player
  const body = Matter.Bodies.rectangle(
    position.x,
    position.y,
    PLAYER_WIDTH,
    PLAYER_HEIGHT,
    {
      restitution: 0.1,
      frictionAir: 0.02,
      friction: 0.01,
      label: 'player'
    }
  );

  return {
    // Physics properties
    body,
    position,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    
    // Game state
    jumping: false,
    falling: false,
    onGround: false,
    
    // Visual properties
    color: '#FFFFFF',  // Base color
    trailColor: '#ADD8E6',  // Trail particle color
    trailParticles: [],  // Array to store trail particle positions
    
    // Animation properties
    frame: 0,  // Current animation frame
    animationSpeed: 0.2,  // How fast animation plays
    
    // Player stats
    score: 0,
    fragmentsCollected: 0,
    
    // Flag this as the player entity for the renderer
    renderer: 'player'
  };
};
