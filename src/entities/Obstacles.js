import Matter from 'matter-js';
import { ENVIRONMENT_CONFIG } from '../constants/environments';

/**
 * Create obstacles appropriate for the given environment
 * @param {String} environmentType - The current environment type
 * @returns {Object} - Collection of obstacle entities
 */
export const createObstacles = (environmentType) => {
  const config = ENVIRONMENT_CONFIG[environmentType];
  const obstacles = {};
  
  // Generate 3-5 obstacles based on environment type
  const numObstacles = 3 + Math.floor(Math.random() * 3);
  
  for (let i = 0; i < numObstacles; i++) {
    // Get a random obstacle type from the environment config
    const obstacleType = config.obstacleTypes[
      Math.floor(Math.random() * config.obstacleTypes.length)
    ];
    
    // Create the obstacle at a position ahead of the player
    // Each successive obstacle is further away
    const obstacle = createObstacle(
      obstacleType,
      environmentType,
      600 + (i * 300) + (Math.random() * 200),
      300 + (Math.random() * 200) - 100
    );
    
    obstacles[`obstacle_${i}`] = obstacle;
  }
  
  return obstacles;
};

/**
 * Create a single obstacle
 * @param {String} type - Obstacle type name
 * @param {String} environmentType - Current environment type
 * @param {Number} x - X position
 * @param {Number} y - Y position
 * @returns {Object} - Obstacle entity
 */
const createObstacle = (type, environmentType, x, y) => {
  const config = ENVIRONMENT_CONFIG[environmentType];
  let width, height, body;
  
  switch (type) {
    case 'platform':
      width = 150 + Math.random() * 100;
      height = 20;
      body = Matter.Bodies.rectangle(x, y, width, height, {
        isStatic: true,
        label: 'obstacle'
      });
      break;
      
    case 'floatingIsland':
      width = 120 + Math.random() * 80;
      height = 40 + Math.random() * 20;
      body = Matter.Bodies.rectangle(x, y, width, height, {
        isStatic: true,
        label: 'obstacle',
        chamfer: { radius: 10 }
      });
      break;
      
    case 'abstractShape':
      // Create a polygon with 3-6 sides
      const sides = 3 + Math.floor(Math.random() * 4);
      const radius = 30 + Math.random() * 20;
      body = Matter.Bodies.polygon(x, y, sides, radius, {
        isStatic: true,
        label: 'obstacle'
      });
      width = radius * 2;
      height = radius * 2;
      break;
      
    case 'vortex':
      width = 80;
      height = 80;
      body = Matter.Bodies.circle(x, y, width / 2, {
        isStatic: true,
        label: 'obstacle',
        isSensor: true  // Doesn't physically collide but triggers collision events
      });
      break;
      
    case 'crystal':
      width = 40 + Math.random() * 30;
      height = 80 + Math.random() * 40;
      // Create a trapezoid shape for the crystal
      const vertices = [
        { x: -width/2, y: height/2 },
        { x: -width/4, y: -height/2 },
        { x: width/4, y: -height/2 },
        { x: width/2, y: height/2 }
      ];
      body = Matter.Bodies.fromVertices(x, y, [vertices], {
        isStatic: true,
        label: 'obstacle'
      });
      break;
      
    case 'shard':
      width = 20 + Math.random() * 15;
      height = 50 + Math.random() * 30;
      // Create a triangle for the shard
      body = Matter.Bodies.polygon(x, y, 3, width, {
        isStatic: true,
        label: 'obstacle',
        angle: Math.random() * Math.PI // Random rotation
      });
      break;
      
    case 'cloud':
      width = 100 + Math.random() * 70;
      height = 40 + Math.random() * 20;
      body = Matter.Bodies.rectangle(x, y, width, height, {
        isStatic: true,
        label: 'obstacle',
        isSensor: true,
        chamfer: { radius: 20 }
      });
      break;
      
    case 'floatingPlatform':
      width = 120 + Math.random() * 60;
      height = 15;
      body = Matter.Bodies.rectangle(x, y, width, height, {
        isStatic: true,
        label: 'obstacle'
      });
      break;
      
    default:
      width = 100;
      height = 30;
      body = Matter.Bodies.rectangle(x, y, width, height, {
        isStatic: true,
        label: 'obstacle'
      });
  }
  
  return {
    body,
    type,
    width,
    height,
    color: config.colors.primary,
    secondaryColor: config.colors.secondary,
    environmentType,
    renderer: 'obstacle'
  };
};
