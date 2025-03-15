import Matter from 'matter-js';
import { createPlayer } from '../entities/Player';
import { createEnvironment } from '../entities/Environment';
import { createObstacles } from '../entities/Obstacles';
import { createFragments } from '../entities/Fragments';
import { ENVIRONMENT_TYPES } from '../constants/environments';
import { renderEnvironment, renderPlayer, renderObstacle, renderFragment } from '../systems/Renderer';

/**
 * Initialize the game world with all necessary entities
 */
export const initializeWorld = () => {
  // Create physics engine
  const engine = Matter.Engine.create({ enableSleeping: false });
  const world = engine.world;
  
  // Set gravity to be more appropriate for a side-scroller
  world.gravity.y = 0.8;
  
  // Starting with the dream environment
  const initialEnvironment = ENVIRONMENT_TYPES.DREAM;
  
  // Create the initial entities
  const player = createPlayer({ x: 100, y: 300 });
  const environment = createEnvironment(initialEnvironment);
  const obstacles = createObstacles(initialEnvironment);
  const fragments = createFragments(initialEnvironment);
  
  // Combine all entities
  const entities = {
    physics: { engine, world },
    player: {
      ...player,
      renderer: (props) => renderPlayer(props)
    },
    environment: {
      ...environment,
      renderer: (props) => renderEnvironment(props)
    }
  };
  
  // Add obstacles
  Object.keys(obstacles).forEach(key => {
    entities[key] = {
      ...obstacles[key],
      renderer: (props) => renderObstacle(props)
    };
  });
  
  // Add fragments
  Object.keys(fragments).forEach(key => {
    entities[key] = {
      ...fragments[key],
      renderer: (props) => renderFragment(props)
    };
  });
  
  // Add all bodies to the world
  Object.keys(entities).forEach(key => {
    const entity = entities[key];
    if (entity.body) {
      Matter.World.add(world, [entity.body]);
    }
  });
  
  return entities;
};
