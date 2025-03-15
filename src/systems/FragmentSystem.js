/**
 * System that handles fragment collection and effects
 */
export const FragmentSystem = (entities, { events }) => {
  // Check for fragment collection events
  const fragmentEvents = events.filter(e => e.type === 'fragment-collected');
  
  fragmentEvents.forEach(event => {
    const fragmentId = event.id;
    if (entities[fragmentId]) {
      // Mark the fragment as collected
      entities[fragmentId].collected = true;
      
      // Add a score boost
      entities.player.score += 100;
    }
  });
  
  return entities;
};
