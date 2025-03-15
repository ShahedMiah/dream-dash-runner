import { ENVIRONMENT_CONFIG, ENVIRONMENT_TYPES } from '../constants/environments';

/**
 * Creates the environment entity that defines the current dream state
 * @param {String} type - The environment type from ENVIRONMENT_TYPES
 */
export const createEnvironment = (type = ENVIRONMENT_TYPES.DREAM) => {
  const config = ENVIRONMENT_CONFIG[type];
  
  return {
    // Environment type
    type,
    
    // Visual properties from config
    colors: config.colors,
    backgroundGradient: config.colors.background,
    particleColor: config.particleColor,
    
    // Environment state
    transitionProgress: 0,  // Used for transitions between environments
    isTransitioning: false,
    nextEnvironment: null,  // The environment we're transitioning to, if any
    
    // Environment effects
    particles: Array(20).fill().map(() => ({
      x: Math.random() * 400,
      y: Math.random() * 800,
      size: 2 + Math.random() * 3,
      speed: 0.5 + Math.random() * 1,
      opacity: 0.3 + Math.random() * 0.5
    })),
    
    // Flag this as the environment entity for the renderer
    renderer: 'environment'
  };
};

/**
 * Determine the next environment in the cycle
 * @param {String} currentType - Current environment type
 * @returns {String} Next environment type
 */
export const getNextEnvironment = (currentType) => {
  const types = Object.values(ENVIRONMENT_TYPES);
  const currentIndex = types.indexOf(currentType);
  
  // If current type not found or is the last type, return the first type
  if (currentIndex === -1 || currentIndex === types.length - 1) {
    return types[0];
  }
  
  // Otherwise return the next type in the sequence
  return types[currentIndex + 1];
};
