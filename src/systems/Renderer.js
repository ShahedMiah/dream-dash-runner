import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Circle, Path, Polygon, LinearGradient, Stop, Defs, RadialGradient } from 'react-native-svg';
import { GAME_WIDTH, GAME_HEIGHT } from '../constants/dimensions';

/**
 * Rendering system for the game engine
 * Responsible for drawing game entities on the screen
 */
export const DreamRenderer = (entities, { screen }) => {
  // Update environment particles
  if (entities.environment) {
    entities.environment.particles = entities.environment.particles.map(particle => ({
      ...particle,
      y: particle.y + particle.speed,
      // Wrap particles around when they go off screen
      ...(particle.y > GAME_HEIGHT && { y: -10 })
    }));
  }
  
  // Update player trail particles
  if (entities.player) {
    // Add new trail particle
    entities.player.trailParticles.unshift({
      x: entities.player.body.position.x,
      y: entities.player.body.position.y,
      size: 5,
      opacity: 0.7,
      age: 0
    });
    
    // Limit the number of trail particles
    if (entities.player.trailParticles.length > 10) {
      entities.player.trailParticles.pop();
    }
    
    // Age all trail particles
    entities.player.trailParticles = entities.player.trailParticles.map(particle => ({
      ...particle,
      age: particle.age + 1,
      opacity: Math.max(0, particle.opacity - 0.07),
      size: Math.max(0, particle.size - 0.3)
    })).filter(particle => particle.opacity > 0);
    
    // Update player animation frame
    entities.player.frame = (entities.player.frame + entities.player.animationSpeed) % 4;
  }
  
  // Update fragment animations
  Object.keys(entities).forEach(key => {
    const entity = entities[key];
    if (entity.renderer === 'fragment' && !entity.collected) {
      // Update pulse animation
      entity.pulseValue = (entity.pulseValue + entity.pulseSpeed) % (Math.PI * 2);
      entity.glow = 10 + Math.sin(entity.pulseValue) * 3;
      entity.glowOpacity = 0.5 + Math.sin(entity.pulseValue) * 0.2;
    }
  });
  
  return entities;
};

// Render functions for different entity types

/**
 * Renders the environment background with gradient and particles
 */
export const renderEnvironment = (entity) => {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg width={GAME_WIDTH} height={GAME_HEIGHT}>
        <Defs>
          <LinearGradient id="backgroundGradient" x1="0" y1="0" x2="0" y2="1">
            {entity.backgroundGradient.map((color, index) => (
              <Stop
                key={index}
                offset={index / (entity.backgroundGradient.length - 1)}
                stopColor={color}
              />
            ))}
          </LinearGradient>
        </Defs>
        
        {/* Background */}
        <Rect x="0" y="0" width={GAME_WIDTH} height={GAME_HEIGHT} fill="url(#backgroundGradient)" />
        
        {/* Particles */}
        {entity.particles.map((particle, index) => (
          <Circle
            key={index}
            cx={particle.x}
            cy={particle.y}
            r={particle.size}
            fill={entity.particleColor}
            opacity={particle.opacity}
          />
        ))}
      </Svg>
    </View>
  );
};

/**
 * Renders the player character with trail effects
 */
export const renderPlayer = (entity) => {
  const { x, y } = entity.body.position;
  const frame = Math.floor(entity.frame);
  
  return (
    <View style={[styles.entityContainer, { left: x - 50, top: y - 50 }]}>
      <Svg width={100} height={100}>
        {/* Trail particles */}
        {entity.trailParticles.map((particle, index) => (
          <Circle
            key={index}
            cx={particle.x - x + 50}
            cy={particle.y - y + 50}
            r={particle.size}
            fill={entity.trailColor}
            opacity={particle.opacity}
          />
        ))}
        
        {/* Player character */}
        <Circle
          cx={50}
          cy={50}
          r={entity.width / 2}
          fill={entity.color}
        />
        
        {/* Simple animation for the player (changes based on frame) */}
        {frame === 0 && (
          <Circle cx={50} cy={45} r={3} fill="#000" />
        )}
        {frame === 1 && (
          <Circle cx={50} cy={46} r={3} fill="#000" />
        )}
        {frame === 2 && (
          <Circle cx={50} cy={47} r={3} fill="#000" />
        )}
        {frame === 3 && (
          <Circle cx={50} cy={46} r={3} fill="#000" />
        )}
      </Svg>
    </View>
  );
};

/**
 * Renders an obstacle based on its type and environment
 */
export const renderObstacle = (entity) => {
  const { body, type, width, height, color, secondaryColor } = entity;
  const { x, y } = body.position;
  
  return (
    <View style={[styles.entityContainer, { left: x - width / 2, top: y - height / 2 }]}>
      <Svg width={width + 20} height={height + 20}>
        {/* Render different obstacle types */}
        {(type === 'platform' || type === 'floatingPlatform') && (
          <Rect
            x={10}
            y={10}
            width={width}
            height={height}
            fill={color}
            rx={type === 'floatingPlatform' ? 5 : 0}
          />
        )}
        
        {type === 'floatingIsland' && (
          <>
            <Rect
              x={10}
              y={10}
              width={width}
              height={height}
              fill={color}
              rx={10}
            />
            <Rect
              x={width / 4 + 10}
              y={5}
              width={width / 2}
              height={10}
              fill={secondaryColor}
              rx={5}
            />
          </>
        )}
        
        {type === 'abstractShape' && (
          <Polygon
            points={`${width/2 + 10},10 ${width + 10},${height/2 + 10} ${width/2 + 10},${height + 10} 10,${height/2 + 10}`}
            fill={color}
          />
        )}
        
        {type === 'vortex' && (
          <>
            <Defs>
              <RadialGradient id="vortexGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <Stop offset="0%" stopColor={secondaryColor} stopOpacity="0.8" />
                <Stop offset="100%" stopColor={color} stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle
              cx={width / 2 + 10}
              cy={height / 2 + 10}
              r={width / 2}
              fill="url(#vortexGradient)"
            />
          </>
        )}
        
        {type === 'crystal' && (
          <Polygon
            points={`${width/2 + 10},10 ${width + 10},${height + 10} 10,${height + 10}`}
            fill={color}
          />
        )}
        
        {type === 'shard' && (
          <Polygon
            points={`${width/2 + 10},10 ${width + 10},${height/2 + 10} ${width/2 + 10},${height + 10}`}
            fill={color}
          />
        )}
        
        {type === 'cloud' && (
          <>
            <Circle cx={20} cy={height/2 + 10} r={height/2} fill={color} />
            <Circle cx={width/2 + 10} cy={height/2 + 5} r={height/2 + 5} fill={color} />
            <Circle cx={width} cy={height/2 + 10} r={height/2} fill={color} />
          </>
        )}
      </Svg>
    </View>
  );
};

/**
 * Renders a collectible dream fragment
 */
export const renderFragment = (entity) => {
  if (entity.collected) return null;
  
  const { body, size, color, glow, glowColor, glowOpacity } = entity;
  const { x, y } = body.position;
  
  return (
    <View style={[styles.entityContainer, { left: x - size - glow, top: y - size - glow }]}>
      <Svg width={(size + glow) * 2} height={(size + glow) * 2}>
        {/* Glow effect */}
        <Defs>
          <RadialGradient id="fragmentGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <Stop offset="0%" stopColor={glowColor} stopOpacity={glowOpacity} />
            <Stop offset="100%" stopColor={glowColor} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle
          cx={size + glow}
          cy={size + glow}
          r={size + glow}
          fill="url(#fragmentGlow)"
        />
        
        {/* Fragment */}
        <Circle
          cx={size + glow}
          cy={size + glow}
          r={size}
          fill={color}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  entityContainer: {
    position: 'absolute',
  },
});
