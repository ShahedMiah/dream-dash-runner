import React, { useState, useEffect } from 'react';
import { StatusBar, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import { DreamPhysics } from './src/systems/Physics';
import { DreamRenderer } from './src/systems/Renderer';
import { EnvironmentTransition } from './src/systems/EnvironmentTransition';
import { FragmentSystem } from './src/systems/FragmentSystem';
import { initializeWorld } from './src/utils/world';

export default function App() {
  const [gameEngine, setGameEngine] = useState(null);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [currentEnvironment, setCurrentEnvironment] = useState('dream');

  // Reset game state
  const resetGame = () => {
    if (gameEngine) {
      gameEngine.swap(initializeWorld());
      setRunning(true);
      setGameOver(false);
      setScore(0);
      setCurrentEnvironment('dream');
    }
  };

  // Handle game events
  const onEvent = (e) => {
    if (e.type === 'game-over') {
      setRunning(false);
      setGameOver(true);
    } else if (e.type === 'score') {
      setScore(prev => prev + e.points || 1);
    } else if (e.type === 'fragment-collected') {
      // Handle fragment collection
      console.log('Fragment collected!');
    } else if (e.type === 'environment-change') {
      // Handle environment transition
      console.log('Environment changing...');
    } else if (e.type === 'environment-change-complete') {
      // Update the current environment after transition completes
      setCurrentEnvironment(e.environment);
      console.log('Environment changed to:', e.environment);
    }
  };

  // Start the game when component mounts
  useEffect(() => {
    if (gameEngine) {
      resetGame();
    }
  }, [gameEngine]);

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      <GameEngine
        ref={(ref) => setGameEngine(ref)}
        style={styles.gameContainer}
        systems={[DreamPhysics, DreamRenderer, EnvironmentTransition, FragmentSystem]}
        entities={initializeWorld()}
        running={running}
        onEvent={onEvent}
      />

      {!running && (
        <View style={styles.overlay}>
          <Text style={styles.gameOverText}>{gameOver ? 'Game Over' : 'Dream Dash'}</Text>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <TouchableOpacity style={styles.button} onPress={resetGame}>
            <Text style={styles.buttonText}>{gameOver ? 'Try Again' : 'Start Game'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Score display during gameplay */}
      {running && (
        <View style={styles.gameStats}>
          <Text style={styles.gameScoreText}>Score: {score}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gameContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scoreText: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameStats: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  gameScoreText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
