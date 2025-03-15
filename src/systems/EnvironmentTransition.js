import { getNextEnvironment, createEnvironment } from '../entities/Environment';
import { createObstacles } from '../entities/Obstacles';
import { createFragments } from '../entities/Fragments';

/**
 * System that handles transitioning between different dream environments
 */
export const EnvironmentTransition = (entities, { events, dispatch }) => {
  // Check for environment change events
  const environmentChangeEvent = events.find(e => e.type === 'environment-change');
  
  if (environmentChangeEvent) {
    // Get the current environment
    const currentEnvironment = entities.environment;
    
    // If not already transitioning, start transition
    if (!currentEnvironment.isTransitioning) {
      // Determine next environment type
      const nextType = getNextEnvironment(currentEnvironment.type);
      
      // Update environment state
      currentEnvironment.isTransitioning = true;
      currentEnvironment.nextEnvironment = nextType;
      currentEnvironment.transitionProgress = 0;
      
      // Create new obstacles and fragments but don't add them to entities yet
      currentEnvironment.nextObstacles = createObstacles(nextType);
      currentEnvironment.nextFragments = createFragments(nextType);
    }
  }
  
  // Process active transitions
  const environment = entities.environment;
  if (environment.isTransitioning) {
    // Increase transition progress
    environment.transitionProgress += 0.02;
    
    // When transition is complete
    if (environment.transitionProgress >= 1) {
      // Replace environment with new one
      entities.environment = createEnvironment(environment.nextEnvironment);
      
      // Replace obstacles
      Object.keys(entities).forEach(key => {
        if (key.startsWith('obstacle_')) {
          delete entities[key];
        }
      });
      
      // Add new obstacles
      Object.keys(environment.nextObstacles).forEach(key => {
        entities[key] = environment.nextObstacles[key];
      });
      
      // Replace fragments
      Object.keys(entities).forEach(key => {
        if (key.startsWith('fragment_')) {
          delete entities[key];
        }
      });
      
      // Add new fragments
      Object.keys(environment.nextFragments).forEach(key => {
        entities[key] = environment.nextFragments[key];
      });
      
      // Update player trail color based on new environment
      entities.player.trailColor = entities.environment.particleColor;
      
      // Dispatch event for environment change complete
      dispatch({ 
        type: 'environment-change-complete',
        environment: environment.nextEnvironment 
      });
    }
  }
  
  return entities;
};
