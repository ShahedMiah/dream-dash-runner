import Matter from 'matter-js';
import { ENVIRONMENT_CONFIG } from '../constants/environments';

/**
 * Create dream fragments for the player to collect
 * @param {String} environmentType - Current environment type
 * @returns {Object} - Collection of fragment entities
 */
export const createFragments = (environmentType) => {
  const config = ENVIRONMENT_CONFIG[environmentType];
  const fragments = {};
  
  // Create 5 fragments in the current environment
  const numFragments = 5;
  
  for (let i = 0; i < numFragments; i++) {
    const x = 800 + (i * 200) + (Math.random() * 100);
    const y = 250 + (Math.random() * 200) - 100;
    
    const fragment = {
      body: Matter.Bodies.circle(x, y, 15, {
        isStatic: true,
        isSensor: true,  // Fragments don't physically collide
        label: 'fragment'
      }),
      size: 15,
      color: config.fragmentColor,
      glow: 10,  // Size of the glow effect
      glowColor: config.fragmentColor,
      glowOpacity: 0.7,
      collected: false,
      pulseValue: 0,  // For animation
      pulseSpeed: 0.05 + (Math.random() * 0.03),  // How fast the fragment pulses
      renderer: 'fragment'
    };
    
    fragments[`fragment_${i}`] = fragment;
  }
  
  return fragments;
};
