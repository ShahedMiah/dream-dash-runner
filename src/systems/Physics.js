import Matter from 'matter-js';
import { GRAVITY, JUMP_FORCE, FRAGMENTS_TO_TRANSITION } from '../constants/dimensions';

/**
 * Physics system for the game engine
 * Handles player movement, gravity, collisions, etc.
 */
export const DreamPhysics = (entities, { touches, time, dispatch }) => {
  // Initialize physics engine if it doesn't exist
  if (!entities.physics) {
    const engine = Matter.Engine.create({ enableSleeping: false });
    const world = engine.world;
    
    // Create physics engine entity
    entities.physics = {
      engine: engine,
      world: world
    };
    
    // Add all bodies to the world
    Object.keys(entities).forEach(key => {
      const entity = entities[key];
      if (entity.body) {
        Matter.World.add(world, [entity.body]);
      }
    });
  }
  
  const { engine } = entities.physics;
  const player = entities.player;
  
  // Apply gravity to the player if they're not on a platform
  if (!player.onGround) {
    Matter.Body.applyForce(player.body, player.body.position, {
      x: 0,
      y: GRAVITY * time.delta
    });
  }
  
  // Process touch input for jumping
  touches.filter(t => t.type === 'start').forEach(t => {
    if (player.onGround) {
      Matter.Body.applyForce(player.body, player.body.position, {
        x: 0,
        y: JUMP_FORCE
      });
      player.onGround = false;
      player.jumping = true;
    }
  });
  
  // Update the world physics
  Matter.Engine.update(engine, time.delta);
  
  // Check for collisions between player and obstacles
  const collisions = Matter.Query.collides(player.body, 
    Object.values(entities)
      .filter(e => e.body && e.body.label === 'obstacle')
      .map(e => e.body)
  );
  
  // Process collisions
  collisions.forEach(collision => {
    // Check if player is standing on an obstacle
    const playerBottom = player.body.bounds.max.y;
    const obstacleTop = collision.bodyB.bounds.min.y;
    
    // If player is on top of obstacle, set onGround to true
    if (playerBottom >= obstacleTop && playerBottom <= obstacleTop + 5) {
      player.onGround = true;
      player.jumping = false;
    }
  });
  
  // Check for fragment collection
  Object.keys(entities).forEach(key => {
    const entity = entities[key];
    
    if (entity.body && entity.body.label === 'fragment' && !entity.collected) {
      const collision = Matter.SAT.collides(player.body, entity.body);
      
      if (collision.collided) {
        // Mark fragment as collected
        entity.collected = true;
        
        // Increment player's fragment count
        player.fragmentsCollected += 1;
        
        // Add to score
        player.score += 100;
        
        // Dispatch fragment collection event
        dispatch({ type: 'fragment-collected', id: key });
        
        // If player has collected enough fragments, trigger environment change
        if (player.fragmentsCollected >= FRAGMENTS_TO_TRANSITION) {
          dispatch({ type: 'environment-change' });
          player.fragmentsCollected = 0;
        }
      }
    }
  });
  
  // Move obstacles and fragments toward the player to create scrolling effect
  Object.keys(entities).forEach(key => {
    const entity = entities[key];
    
    if ((key.startsWith('obstacle_') || key.startsWith('fragment_')) && entity.body) {
      // Move obstacle to the left
      Matter.Body.translate(entity.body, { x: -5, y: 0 });
      
      // If obstacle is off-screen to the left, remove it
      if (entity.body.position.x < -200) {
        Matter.World.remove(engine.world, entity.body);
        delete entities[key];
      }
    }
  });
  
  // Check if player has fallen off the bottom of the screen
  if (player.body.position.y > 800) {
    dispatch({ type: 'game-over' });
  }
  
  // Update player position for rendering
  player.position = player.body.position;
  
  // Periodically add more obstacles and fragments if needed
  const obstacleCount = Object.keys(entities).filter(key => key.startsWith('obstacle_')).length;
  const fragmentCount = Object.keys(entities).filter(key => 
    key.startsWith('fragment_') && !entities[key].collected
  ).length;
  
  // Add score based on time
  if (time.current % 60 === 0) {
    dispatch({ type: 'score', points: 1 });
  }
  
  return entities;
};
