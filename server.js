const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
});

// Game scenarios with pixel art sprites
const scenarios = [
  {
    animal: "Space Gecko",
    spaceClue: "Life support shows oxygen levels dropped 15% in the past hour. Gravity stabilizers experienced brief fluctuations.",
    vetClue: "Patient is lethargic, breathing rapidly, and tongue appears pale. Normally very active species.",
    diagnosis: "hypoxia",
    correctAnswer: "Hypoxia (Low Oxygen)",
    sprite: "gecko",
    colors: ["#7fdb6e", "#5ba548"]
  },
  {
    animal: "Lunar Ferret",
    spaceClue: "Solar radiation sensors detected a spike during the last EVA. Airlock seals intact but UV exposure warning logged.",
    vetClue: "Patient has redness around eyes and nose. Squinting and avoiding light. Skin appears irritated.",
    diagnosis: "radiation",
    correctAnswer: "Radiation Burn",
    sprite: "ferret",
    colors: ["#e8d4b8", "#c9a077"]
  },
  {
    animal: "Martian Chinchilla",
    spaceClue: "Temperature regulation failed in habitat module. Ambient temp rose to 35°C for 3 hours before repair.",
    vetClue: "Patient is panting excessively, drooling, and appears disoriented. Body feels warmer than normal.",
    diagnosis: "heatstroke",
    correctAnswer: "Heat Stroke",
    sprite: "chinchilla",
    colors: ["#b8b8b8", "#8a8a8a"]
  },
  {
    animal: "Asteroid Parrot",
    spaceClue: "Cargo bay pressure dropped briefly during docking. Emergency pressurization activated after 45 seconds.",
    vetClue: "Patient showing signs of inner ear distress, balance problems, and appears dizzy. Vocalizing in distress.",
    diagnosis: "barotrauma",
    correctAnswer: "Barotrauma (Pressure Injury)",
    sprite: "parrot",
    colors: ["#4ec9ff", "#2a9fd6"]
  },
  {
    animal: "Jupiter Rabbit",
    spaceClue: "Artificial gravity generator was offline for maintenance. Zero-G conditions for 6 hours.",
    vetClue: "Patient experiencing muscle weakness, difficulty hopping, and seems disoriented in normal gravity.",
    diagnosis: "muscle atrophy",
    correctAnswer: "Muscle Atrophy from Zero-G",
    sprite: "rabbit",
    colors: ["#ffffff", "#d4d4d4"]
  },
  {
    animal: "Nebula Hedgehog",
    spaceClue: "Water recycling system malfunction detected. Humidity dropped to 15% station-wide.",
    vetClue: "Patient's skin appears dry and flaky. Eyes look sunken. Refusing food but drinking excessively.",
    diagnosis: "dehydration",
    correctAnswer: "Dehydration",
    sprite: "hedgehog",
    colors: ["#8b6f47", "#5d4a2f"]
  },
  {
    animal: "Comet Tortoise",
    spaceClue: "Cosmic radiation shielding at 60% efficiency due to micrometeorite damage. Repair scheduled next week.",
    vetClue: "Patient shows unusual lethargy, loss of appetite, and abnormal blood work indicates cellular damage.",
    diagnosis: "radiation sickness",
    correctAnswer: "Radiation Sickness",
    sprite: "tortoise",
    colors: ["#6b8e3d", "#4a6229"]
  },
  {
    animal: "Saturn Ring Snake",
    spaceClue: "HVAC system circulating recycled air. CO2 scrubbers at 80% capacity. Station at max occupancy.",
    vetClue: "Patient is sluggish, breathing shallowly, and not responding to stimuli as quickly as normal.",
    diagnosis: "co2 poisoning",
    correctAnswer: "CO2 Poisoning",
    sprite: "snake",
    colors: ["#d4af37", "#b8941f"]
  },
  {
    animal: "Venus Iguana",
    spaceClue: "Full-spectrum UV grow lights in hydroponics bay burned out 2 days ago. Replacements delayed.",
    vetClue: "Patient showing signs of weakness, poor appetite, and metabolic issues. Bones seem softer than normal.",
    diagnosis: "vitamin d deficiency",
    correctAnswer: "Vitamin D Deficiency",
    sprite: "iguana",
    colors: ["#7dc97d", "#5aa05a"]
  },
  {
    animal: "Titan Capybara",
    spaceClue: "Centrifuge rotation speed increased by 20% due to calibration error. Fixed after 12 hours.",
    vetClue: "Patient appears nauseous, won't eat, and has balance problems. Seems stressed and anxious.",
    diagnosis: "motion sickness",
    correctAnswer: "Motion Sickness from Excess G-Force",
    sprite: "capybara",
    colors: ["#a67c52", "#8b6239"]
  },
  {
    animal: "Orbit Hamster",
    spaceClue: "Food storage unit malfunctioned. Ration dispenser failed for 18 hours. Emergency rations activated.",
    vetClue: "Patient is lethargic, weak, and appears underweight. Refusing food but drinking water when offered.",
    diagnosis: "starvation",
    correctAnswer: "Starvation/Malnutrition",
    sprite: "hamster",
    colors: ["#d4a574", "#b8864a"]
  },
  {
    animal: "Lunar Mouse",
    spaceClue: "Water reclamation system contaminated. Emergency water supply activated but limited to 50% normal intake.",
    vetClue: "Patient showing severe dehydration symptoms. Skin tenting, sunken eyes, and extreme lethargy.",
    diagnosis: "dehydration",
    correctAnswer: "Severe Dehydration",
    sprite: "mouse",
    colors: ["#c0c0c0", "#808080"]
  },
  {
    animal: "Nebula Cat",
    spaceClue: "Atmospheric pressure dropped to 0.7 atm during emergency depressurization drill. Normal pressure restored after 30 minutes.",
    vetClue: "Patient is disoriented, breathing rapidly, and showing signs of confusion. Ears appear to be in distress.",
    diagnosis: "barotrauma",
    correctAnswer: "Barotrauma (Pressure Injury)",
    sprite: "cat",
    colors: ["#ffa500", "#ff8c00"]
  },
  {
    animal: "Stellar Dog",
    spaceClue: "Exercise equipment malfunctioned. Treadmill and resistance training unavailable for 5 days.",
    vetClue: "Patient showing muscle weakness, difficulty standing, and appears to have lost muscle mass.",
    diagnosis: "muscle atrophy",
    correctAnswer: "Muscle Atrophy from Lack of Exercise",
    sprite: "dog",
    colors: ["#8b4513", "#654321"]
  },
  {
    animal: "Asteroid Rat",
    spaceClue: "Waste management system backup. Odor control systems at 40% efficiency. Air quality degraded.",
    vetClue: "Patient showing respiratory distress, wheezing, and appears to be having difficulty breathing normally.",
    diagnosis: "respiratory infection",
    correctAnswer: "Respiratory Infection from Poor Air Quality",
    sprite: "rat",
    colors: ["#696969", "#2f2f2f"]
  },
  {
    animal: "Cosmic Bird",
    spaceClue: "Artificial gravity generator experienced intermittent failures. Gravity fluctuated between 0.3G and 1.2G for 4 hours.",
    vetClue: "Patient appears stressed, disoriented, and having difficulty perching. Feathers are ruffled and patient seems anxious.",
    diagnosis: "stress",
    correctAnswer: "Stress from Gravity Fluctuations",
    sprite: "bird",
    colors: ["#ffd700", "#daa520"]
  },
  {
    animal: "Solar Guinea Pig",
    spaceClue: "UV light system in habitat failed completely. Vitamin D synthesis lamps offline for 3 days.",
    vetClue: "Patient showing signs of weakness, poor appetite, and appears to have metabolic issues. Bones seem fragile.",
    diagnosis: "vitamin d deficiency",
    correctAnswer: "Vitamin D Deficiency",
    sprite: "guineapig",
    colors: ["#deb887", "#cd853f"]
  },
  {
    animal: "Galaxy Sugar Glider",
    spaceClue: "Sleep cycle lighting malfunctioned. Day/night cycle disrupted. Lights remained on for 48 hours straight.",
    vetClue: "Patient is extremely agitated, showing signs of sleep deprivation, and appears disoriented. Hyperactive behavior.",
    diagnosis: "sleep deprivation",
    correctAnswer: "Sleep Deprivation from Circadian Disruption",
    sprite: "sugarGlider",
    colors: ["#e6e6fa", "#9370db"]
  },
  {
    animal: "Aqua Axolotl",
    spaceClue: "Water filtration system failed. Water quality degraded. pH levels dropped to 5.2. Emergency filtration activated after 6 hours.",
    vetClue: "Patient's gills appear irritated and inflamed. Skin shows signs of chemical burns. Patient is lethargic and not eating.",
    diagnosis: "water quality",
    correctAnswer: "Water Quality Issues (pH Imbalance)",
    sprite: "axolotl",
    colors: ["#ff69b4", "#ff1493"]
  }
];

// AI-powered diagnosis validation
async function validateDiagnosisWithAI(playerAnswer, scenario) {
  // Fallback to simple matching if no API key
  if (!anthropic.apiKey) {
    console.log('No API key, using fallback validation');
    const simple = playerAnswer.toLowerCase().includes(scenario.diagnosis) ||
                   scenario.diagnosis.includes(playerAnswer.toLowerCase());
    return simple;
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 50,
      messages: [{
        role: 'user',
        content: `You are validating a medical diagnosis in a space veterinary game.

SCENARIO:
Animal: ${scenario.animal}
Space Tech Clue: ${scenario.spaceClue}
Veterinary Clue: ${scenario.vetClue}

CORRECT ANSWER: ${scenario.correctAnswer}

PLAYER'S ANSWER: "${playerAnswer}"

Is the player's answer medically/scientifically correct or equivalent to the correct answer?
Consider synonyms and alternate phrasings (e.g., "oxygen deprivation" = "hypoxia").
Respond with ONLY "YES" or "NO".`
      }]
    });

    const response = message.content[0].text.trim().toUpperCase();
    console.log(`AI Validation: "${playerAnswer}" for ${scenario.correctAnswer} = ${response}`);
    return response === 'YES';
  } catch (error) {
    console.error('AI validation error:', error.message);
    // Fallback to simple matching on error
    return playerAnswer.toLowerCase().includes(scenario.diagnosis) ||
           scenario.diagnosis.includes(playerAnswer.toLowerCase());
  }
}

// Store active games
const games = new Map();
const waitingPlayers = [];

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  socket.on('findGame', (playerName) => {
    console.log(`${playerName} looking for game`);

    if (waitingPlayers.length > 0) {
      // Match with waiting player
      const opponent = waitingPlayers.shift();
      const roomId = `room_${socket.id}`;

      // Randomly assign roles
      const roles = Math.random() > 0.5
        ? { [socket.id]: 'space', [opponent.id]: 'vet' }
        : { [socket.id]: 'vet', [opponent.id]: 'space' };

      const gameState = {
        roomId,
        players: {
          [socket.id]: { name: playerName, role: roles[socket.id] },
          [opponent.id]: { name: opponent.name, role: roles[opponent.id] }
        },
        currentRound: 1,
        maxRounds: 10,
        score: 0,
        lives: 3,
        phase: 'playing', // playing, diagnosis, result
        timer: 180,
        currentScenario: null,
        messages: [],
        usedScenarios: [] // Track which scenario indices have been used
      };

      // Start first round - always use first scenario
      gameState.currentScenario = scenarios[0];
      gameState.usedScenarios.push(0);

      socket.join(roomId);
      opponent.socket.join(roomId);

      games.set(roomId, gameState);

      // Notify both players
      io.to(socket.id).emit('gameStart', {
        roomId,
        role: roles[socket.id],
        opponent: opponent.name,
        gameState: getPublicGameState(gameState, socket.id)
      });

      io.to(opponent.id).emit('gameStart', {
        roomId,
        role: roles[opponent.id],
        opponent: playerName,
        gameState: getPublicGameState(gameState, opponent.id)
      });

      // Start round timer
      startRoundTimer(roomId);

    } else {
      // Add to waiting list
      waitingPlayers.push({ id: socket.id, name: playerName, socket });
      socket.emit('waiting');
    }
  });

  socket.on('chatMessage', ({ roomId, message }) => {
    const game = games.get(roomId);
    if (game) {
      const playerName = game.players[socket.id].name;
      const chatMsg = { player: playerName, message, timestamp: Date.now() };
      game.messages.push(chatMsg);
      io.to(roomId).emit('chatMessage', chatMsg);
    }
  });

  socket.on('submitDiagnosis', async ({ roomId, diagnosis }) => {
    const game = games.get(roomId);
    if (!game || game.phase !== 'playing') return;

    game.phase = 'diagnosis';
    clearInterval(game.timerInterval);

    // AI-powered answer validation
    const correct = await validateDiagnosisWithAI(
      diagnosis,
      game.currentScenario
    );

    if (correct) {
      game.score += 10;
    } else {
      game.lives -= 1;
    }

    const result = {
      correct,
      correctAnswer: game.currentScenario.correctAnswer,
      playerAnswer: diagnosis,
      score: game.score,
      lives: game.lives
    };

    io.to(roomId).emit('diagnosisResult', result);

    // Check if game over
    if (game.lives <= 0) {
      io.to(roomId).emit('gameOver', {
        reason: 'lives',
        finalScore: game.score,
        roundsCompleted: game.currentRound
      });
      games.delete(roomId);
    } else if (game.currentRound >= game.maxRounds) {
      io.to(roomId).emit('gameOver', {
        reason: 'completed',
        finalScore: game.score,
        roundsCompleted: game.currentRound
      });
      games.delete(roomId);
    } else {
      // Continue to next round after delay
      setTimeout(() => {
        nextRound(roomId);
      }, 5000);
    }
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);

    // Remove from waiting list
    const waitingIndex = waitingPlayers.findIndex(p => p.id === socket.id);
    if (waitingIndex !== -1) {
      waitingPlayers.splice(waitingIndex, 1);
    }

    // Handle active game disconnect
    games.forEach((game, roomId) => {
      if (game.players[socket.id]) {
        io.to(roomId).emit('opponentDisconnected');
        games.delete(roomId);
      }
    });
  });
});

function startRoundTimer(roomId) {
  const game = games.get(roomId);
  if (!game) return;

  game.timer = 180;
  game.timerInterval = setInterval(() => {
    game.timer -= 1;
    io.to(roomId).emit('timerUpdate', game.timer);

    if (game.timer <= 0) {
      clearInterval(game.timerInterval);

      // Auto-fail if time runs out
      game.phase = 'diagnosis';
      game.lives -= 1;

      const result = {
        correct: false,
        correctAnswer: game.currentScenario.correctAnswer,
        playerAnswer: 'Time ran out!',
        score: game.score,
        lives: game.lives
      };

      io.to(roomId).emit('diagnosisResult', result);

      if (game.lives <= 0) {
        io.to(roomId).emit('gameOver', {
          reason: 'lives',
          finalScore: game.score,
          roundsCompleted: game.currentRound
        });
        games.delete(roomId);
      } else if (game.currentRound >= game.maxRounds) {
        io.to(roomId).emit('gameOver', {
          reason: 'completed',
          finalScore: game.score,
          roundsCompleted: game.currentRound
        });
        games.delete(roomId);
      } else {
        setTimeout(() => {
          nextRound(roomId);
        }, 5000);
      }
    }
  }, 1000);
}

function nextRound(roomId) {
  const game = games.get(roomId);
  if (!game) return;

  game.currentRound += 1;
  game.phase = 'playing';
  game.messages = [];
  
  // Select a scenario that hasn't been used yet
  const availableScenarios = scenarios
    .map((scenario, index) => ({ scenario, index }))
    .filter(({ index }) => !game.usedScenarios.includes(index));
  
  // If all scenarios have been used, reset (shouldn't happen with 10 rounds and 20+ scenarios)
  if (availableScenarios.length === 0) {
    game.usedScenarios = [];
    availableScenarios.push(...scenarios.map((scenario, index) => ({ scenario, index })));
  }
  
  const selected = availableScenarios[Math.floor(Math.random() * availableScenarios.length)];
  game.currentScenario = selected.scenario;
  game.usedScenarios.push(selected.index);

  // Notify players of new round
  Object.keys(game.players).forEach(playerId => {
    io.to(playerId).emit('newRound', getPublicGameState(game, playerId));
  });

  startRoundTimer(roomId);
}

function getPublicGameState(game, playerId) {
  const player = game.players[playerId];
  const clue = player.role === 'space'
    ? game.currentScenario.spaceClue
    : game.currentScenario.vetClue;

  return {
    animal: game.currentScenario.animal,
    clue,
    role: player.role,
    currentRound: game.currentRound,
    maxRounds: game.maxRounds,
    score: game.score,
    lives: game.lives,
    timer: game.timer,
    phase: game.phase,
    sprite: game.currentScenario.sprite,
    colors: game.currentScenario.colors
  };
}

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
