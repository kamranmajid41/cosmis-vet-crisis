const socket = io();

// Screen elements
const startScreen = document.getElementById('startScreen');
const waitingScreen = document.getElementById('waitingScreen');
const gameScreen = document.getElementById('gameScreen');
const resultScreen = document.getElementById('resultScreen');
const gameOverScreen = document.getElementById('gameOverScreen');

// Start screen elements
const playerNameInput = document.getElementById('playerName');
const findGameBtn = document.getElementById('findGameBtn');

// Game screen elements
const roundDisplay = document.getElementById('roundDisplay');
const scoreDisplay = document.getElementById('scoreDisplay');
const livesDisplay = document.getElementById('livesDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const roleBadge = document.getElementById('roleBadge');
const opponentName = document.getElementById('opponentName');
const animalName = document.getElementById('animalName');
const clueTitle = document.getElementById('clueTitle');
const clueText = document.getElementById('clueText');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendChatBtn');
const diagnosisInput = document.getElementById('diagnosisInput');
const submitDiagnosisBtn = document.getElementById('submitDiagnosisBtn');

// Result screen elements
const resultContent = document.getElementById('resultContent');

// Game over screen elements
const gameOverTitle = document.getElementById('gameOverTitle');
const finalScore = document.getElementById('finalScore');
const roundsCompleted = document.getElementById('roundsCompleted');
const playAgainBtn = document.getElementById('playAgainBtn');

// Game state
let currentRoomId = null;
let myRole = null;

// Event listeners
findGameBtn.addEventListener('click', () => {
  const name = playerNameInput.value.trim();
  const roleInput = document.querySelector('input[name="role"]:checked');
  if (name && roleInput) {
    socket.emit('findGame', { name, preferredRole: roleInput.value });
    showScreen(waitingScreen);
  }
});

sendChatBtn.addEventListener('click', sendChatMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendChatMessage();
});

submitDiagnosisBtn.addEventListener('click', submitDiagnosis);
diagnosisInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') submitDiagnosis();
});

playAgainBtn.addEventListener('click', () => {
  location.reload();
});

// Socket event handlers
socket.on('waiting', () => {
  showScreen(waitingScreen);
});

socket.on('gameStart', (data) => {
  currentRoomId = data.roomId;
  myRole = data.role;

  roleBadge.textContent = myRole === 'space' ? 'Space Tech' : 'Vet Assistant';
  opponentName.textContent = `vs ${data.opponent}`;

  updateGameState(data.gameState);
  showScreen(gameScreen);
});

socket.on('newRound', (gameState) => {
  updateGameState(gameState);
  chatMessages.innerHTML = '';
  diagnosisInput.value = '';
  chatInput.value = '';
  showScreen(gameScreen);
});

socket.on('timerUpdate', (time) => {
  timerDisplay.textContent = time;
  const timerCircle = document.querySelector('.timer-circle');

  if (time <= 10) {
    timerCircle.classList.add('warning');
  } else {
    timerCircle.classList.remove('warning');
  }
});

socket.on('chatMessage', (message) => {
  const msgDiv = document.createElement('div');
  msgDiv.className = 'chat-message';
  msgDiv.innerHTML = `<strong>${message.player}:</strong> ${message.message}`;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('diagnosisResult', (result) => {
  showResult(result);
});

socket.on('gameOver', (data) => {
  showGameOver(data);
});

socket.on('opponentDisconnected', () => {
  alert('Your opponent disconnected. Game ended.');
  location.reload();
});

// Helper functions
function showScreen(screen) {
  [startScreen, waitingScreen, gameScreen, resultScreen, gameOverScreen].forEach(s => {
    s.classList.remove('active');
  });
  screen.classList.add('active');
}

function updateGameState(state) {
  roundDisplay.textContent = `${state.currentRound}/${state.maxRounds}`;
  scoreDisplay.textContent = state.score;
  livesDisplay.textContent = `${state.lives}/3`;
  timerDisplay.textContent = state.timer;

  animalName.textContent = state.animal;

  if (state.role === 'space') {
    clueTitle.textContent = 'Space Tech Readings:';
  } else {
    clueTitle.textContent = 'Veterinary Observations:';
  }

  clueText.textContent = state.clue;

  // Render animal sprite
  if (state.sprite && state.colors) {
    renderSprite(state.sprite, state.colors, 'animalCanvas');
    animateSprite('animalCanvas');
  }
}

function sendChatMessage() {
  const message = chatInput.value.trim();
  if (message && currentRoomId) {
    socket.emit('chatMessage', { roomId: currentRoomId, message });
    chatInput.value = '';
  }
}

function submitDiagnosis() {
  const diagnosis = diagnosisInput.value.trim();
  if (diagnosis && currentRoomId) {
    socket.emit('submitDiagnosis', { roomId: currentRoomId, diagnosis });
    submitDiagnosisBtn.disabled = true;
  }
}

function showResult(result) {
  if (result.correct) {
    resultContent.innerHTML = `
      <div class="result-correct">Correct!</div>
      <div class="result-details">
        <p><strong>Diagnosis:</strong> ${result.correctAnswer}</p>
        <p><strong>Your Answer:</strong> ${result.playerAnswer}</p>
        <p><strong>Score:</strong> ${result.score}</p>
        <p><strong>Lives:</strong> ${result.lives}/3</p>
      </div>
    `;
  } else {
    resultContent.innerHTML = `
      <div class="result-incorrect">Incorrect!</div>
      <div class="result-details">
        <p><strong>Correct Answer:</strong> ${result.correctAnswer}</p>
        <p><strong>Your Answer:</strong> ${result.playerAnswer}</p>
        <p><strong>Score:</strong> ${result.score}</p>
        <p><strong>Lives:</strong> ${result.lives}/3</p>
      </div>
    `;
  }

  showScreen(resultScreen);
  submitDiagnosisBtn.disabled = false;
}

function showGameOver(data) {
  if (data.reason === 'completed') {
    gameOverTitle.textContent = 'Mission Complete!';
  } else {
    gameOverTitle.textContent = 'Mission Failed';
  }

  finalScore.textContent = data.finalScore;
  roundsCompleted.textContent = data.roundsCompleted;

  showScreen(gameOverScreen);
}
