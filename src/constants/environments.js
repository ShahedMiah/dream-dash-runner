/**
 * Environment types for the game
 */
export const ENVIRONMENT_TYPES = {
  DREAM: 'dream',       // Blue dreamscape
  VOID: 'void',         // Purple void zone
  CRYSTAL: 'crystal',   // Crystal cavern
  CLOUDS: 'clouds'      // Cloud realm
};

/**
 * Configuration for each environment type
 */
export const ENVIRONMENT_CONFIG = {
  [ENVIRONMENT_TYPES.DREAM]: {
    colors: {
      primary: '#1E90FF',    // Dodger Blue
      secondary: '#87CEFA',  // Light Sky Blue
      accent: '#00BFFF',     // Deep Sky Blue
      background: ['#0A2463', '#1E3F66', '#2E5984', '#468FAF'],  // Gradient colors
    },
    obstacleTypes: ['platform', 'floatingIsland'],
    fragmentColor: '#E6E6FA',  // Lavender
    particleColor: '#ADD8E6',  // Light Blue
    transitionEffect: 'fade',
  },
  
  [ENVIRONMENT_TYPES.VOID]: {
    colors: {
      primary: '#8A2BE2',    // Blue Violet
      secondary: '#9370DB',  // Medium Purple
      accent: '#BA55D3',     // Medium Orchid
      background: ['#240046', '#3C096C', '#5A189A', '#7B2CBF'],  // Gradient colors
    },
    obstacleTypes: ['abstractShape', 'vortex'],
    fragmentColor: '#E0FFFF',  // Light Cyan
    particleColor: '#DDA0DD',  // Plum
    transitionEffect: 'pulse',
  },
  
  [ENVIRONMENT_TYPES.CRYSTAL]: {
    colors: {
      primary: '#00CED1',    // Dark Turquoise
      secondary: '#48D1CC',  // Medium Turquoise
      accent: '#40E0D0',     // Turquoise
      background: ['#051923', '#003554', '#006494', '#0582CA'],  // Gradient colors
    },
    obstacleTypes: ['crystal', 'shard'],
    fragmentColor: '#FFF8DC',  // Cornsilk
    particleColor: '#AFEEEE',  // Pale Turquoise
    transitionEffect: 'shatter',
  },
  
  [ENVIRONMENT_TYPES.CLOUDS]: {
    colors: {
      primary: '#F5DEB3',    // Wheat
      secondary: '#FFDEAD',  // Navajo White
      accent: '#FFE4B5',     // Moccasin
      background: ['#F8F9FA', '#E9ECEF', '#DEE2E6', '#CED4DA'],  // Gradient colors
    },
    obstacleTypes: ['cloud', 'floatingPlatform'],
    fragmentColor: '#FFF5EE',  // Seashell
    particleColor: '#FAEBD7',  // Antique White
    transitionEffect: 'dissolve',
  },
};
