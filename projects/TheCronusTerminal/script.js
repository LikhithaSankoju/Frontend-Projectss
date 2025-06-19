

const locations = {
  'Central Hub': {
    description: "A mystical nexus where time flows normally. Portals shimmer in all directions.",
    welcome: "🌟 Welcome to the Central Hub! Choose your time adventure wisely.",
    key: null,
    exits: { 
      north: 'Bermuda Triangle', 
      south: 'Stonehenge', 
      east: 'Crooked Forest',
      treasure: 'Treasure Vault'
    },
    timeEffect: 'normal',
    hasQuestion: false,
    questionAnswered: true,
    timeModifier: 0
  },
  'Bermuda Triangle': {
    description: "A mysterious triangular vortex where time accelerates dramatically. Reality bends around you.",
    welcome: "🔺 Entering Bermuda Triangle! Time is speeding up - move quickly!",
    key: 'Triangle Key',
    exits: { south: 'Central Hub' },
    timeEffect: 'accelerated',
    hasQuestion: true,
    question: "What phenomenon is the Bermuda Triangle famous for?",
    answer: "disappearances",
    questionAnswered: false,
    timeModifier: 10 // 10 seconds faster per second
  },
  'Stonehenge': {
    description: "Ancient stone circles where time moves sluggishly, as if weighted by millennia.",
    welcome: "🗿 Welcome to Stonehenge! Time drags heavily here - use it wisely.",
    key: 'Stone Key',
    exits: { north: 'Central Hub' },
    timeEffect: 'decelerated', 
    hasQuestion: true,
    question: "How many stones form the main circle of Stonehenge?",
    answer: "30",
    questionAnswered: false,
    timeModifier: -10 // 10 seconds slower per second
  },
  'Crooked Forest': {
    description: "A twisted woodland where time flows in reverse, undoing moments as they pass.",
    welcome: "🌲 Entering Crooked Forest! Time flows backward - reality unravels!",
    key: 'Forest Key',
    exits: { west: 'Central Hub' },
    timeEffect: 'reverse',
    hasQuestion: true,
    question: "In which country is the famous Crooked Forest located?",
    answer: "poland",
    questionAnswered: false,
    timeModifier: -10 // Time reverses
  },
  'Treasure Vault': {
    description: "The legendary treasure vault, accessible only to those who have mastered time itself!",
    welcome: "💰 TREASURE VAULT UNLOCKED! Congratulations, Time Master!",
    key: null,
    exits: {},
    timeEffect: 'normal',
    hasQuestion: false,
    questionAnswered: true,
    timeModifier: 0
  }
};

let gameState = {
  health: 100,
  keys: [],
  location: 'Central Hub',
  gameTime: 0, // Game time in seconds
  locationTimer: 120, // 2 minutes per location
  timeEffect: 'normal',
  awaitingAnswer: false,
  currentQuestion: null,
  visitedLocations: ['Central Hub'],
  gameActive: true,
  score: 0,
  startTime: Date.now(),
  lastTickTime: Date.now()
};

let gameInterval;
const LOCATION_TIME_LIMIT = 120; // 2 minutes in seconds

// DOM elements
const elements = {
  realTime: document.getElementById('real-time'),
  gameTime: document.getElementById('game-time'),
  locationTimer: document.getElementById('location-timer'),
  console: document.getElementById('console'),
  cmd: document.getElementById('cmd'),
  health: document.getElementById('health'),
  keys: document.getElementById('keys'),
  location: document.getElementById('location'),
  timeEffect: document.getElementById('time-effect'),
  score: document.getElementById('score')
};

function formatTime(seconds) {
  const hours = Math.floor(Math.abs(seconds) / 3600);
  const minutes = Math.floor((Math.abs(seconds) % 3600) / 60);
  const secs = Math.floor(Math.abs(seconds) % 60);
  const sign = seconds < 0 ? '-' : '';
  return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTimeDisplay() {
  if (!gameState.gameActive) return;
  
  const now = Date.now();
  const realElapsed = (now - gameState.startTime) / 1000;
  const deltaTime = (now - gameState.lastTickTime) / 1000;
  gameState.lastTickTime = now;
  
  // Calculate game time based on current location's time effect
  const currentLocation = locations[gameState.location];
  let gameTimeDelta = deltaTime;
  
  if (gameState.location !== 'Central Hub' && gameState.location !== 'Treasure Vault') {
    switch (currentLocation.timeEffect) {
      case 'accelerated':
        gameTimeDelta = deltaTime * (1 + currentLocation.timeModifier);
        break;
      case 'decelerated':
        gameTimeDelta = deltaTime * (1 + currentLocation.timeModifier / 10);
        break;
      case 'reverse':
        gameTimeDelta = -deltaTime * Math.abs(currentLocation.timeModifier / 10);
        break;
      default:
        gameTimeDelta = deltaTime;
    }
  }
  
  gameState.gameTime += gameTimeDelta;
  
  // Update location timer only in special locations
  if (gameState.location !== 'Central Hub' && gameState.location !== 'Treasure Vault') {
    gameState.locationTimer -= deltaTime; // Real time always counts down
  }
  
  // Update displays
  elements.realTime.textContent = new Date().toLocaleTimeString();
  elements.gameTime.textContent = formatTime(gameState.gameTime);
  
  if (gameState.location !== 'Central Hub' && gameState.location !== 'Treasure Vault') {
    const timerDisplay = Math.max(0, gameState.locationTimer);
    elements.locationTimer.textContent = formatTime(timerDisplay);
    
    // Add warning effects when time is running low
    if (gameState.locationTimer <= 30 && gameState.locationTimer > 0) {
      elements.locationTimer.classList.add('pulsing');
      elements.locationTimer.style.color = '#ffa500';
    } else if (gameState.locationTimer <= 10 && gameState.locationTimer > 0) {
      elements.locationTimer.style.color = '#ff4444';
    }
  } else {
    elements.locationTimer.textContent = '∞';
    elements.locationTimer.classList.remove('pulsing');
    elements.locationTimer.style.color = '#ffffff';
  }
  
  // Check for time limit exceeded
  if (gameState.locationTimer <= 0 && gameState.location !== 'Central Hub' && gameState.location !== 'Treasure Vault') {
    endGameTimeUp();
  }
}

function startGameClock() {
  if (gameInterval) clearInterval(gameInterval);
  gameState.lastTickTime = Date.now();
  gameInterval = setInterval(updateTimeDisplay, 100); // Update every 100ms for smooth display
}

function stopGameClock() {
  if (gameInterval) {
    clearInterval(gameInterval);
    gameInterval = null;
  }
}

function updateStatusDisplay() {
  elements.health.textContent = `${gameState.health}/100`;
  elements.keys.textContent = gameState.keys.length > 0 ? gameState.keys.join(', ') : 'None';
  elements.location.textContent = gameState.location;
  elements.timeEffect.textContent = locations[gameState.location].timeEffect.toUpperCase();
  elements.score.textContent = gameState.score.toLocaleString();
  
  // Color code health
  if (gameState.health <= 25) {
    elements.health.style.color = '#ff4444';
  } else if (gameState.health <= 50) {
    elements.health.style.color = '#ffa500';
  } else {
    elements.health.style.color = '#00ff41';
  }
}

function log(message, className = '') {
  const div = document.createElement('div');
  if (className) div.className = className;
  div.textContent = message;
  elements.console.appendChild(div);
  elements.console.scrollTop = elements.console.scrollHeight;
}

function enterLocation() {
  const currentLocation = locations[gameState.location];
  
  // Welcome message
  log(currentLocation.welcome, 'success');
  log(currentLocation.description);
  log('');
  
  // Reset location timer for special locations
  if (gameState.location !== 'Central Hub' && gameState.location !== 'Treasure Vault') {
    gameState.locationTimer = LOCATION_TIME_LIMIT;
  }
  
  // Show available exits
  const exits = Object.keys(currentLocation.exits);
  if (exits.length > 0) {
    log(`🚪 Available directions: ${exits.join(', ')}`);
    
    // Show treasure status
    if (exits.includes('treasure')) {
      const hasAllKeys = checkTreasureUnlock();
      if (hasAllKeys) {
        log('💰 ✨ TREASURE VAULT UNLOCKED! Type "treasure" to enter! ✨', 'treasure');
      } else {
        const keysNeeded = 3 - gameState.keys.length;
        log(`🔐 Treasure Vault: LOCKED (Need ${keysNeeded} more keys)`, 'warning');
        log(`🗝 Keys needed: ${3 - gameState.keys.length}/3`, 'warning');
      }
    }
  }
  
  // Show collectible key
  if (currentLocation.key && !gameState.keys.includes(currentLocation.key)) {
    log(`🗝 You see a ${currentLocation.key} glinting nearby! Type 'collect' to take it.`);
  }
  
  // Check for treasure vault unlock
  if (gameState.location === 'Treasure Vault') {
    gameState.score += 10000;
    log('🎉 CONGRATULATIONS! YOU WON! 🎉', 'treasure');
    log(`🏆 VICTORY! FINAL SCORE: ${gameState.score.toLocaleString()} POINTS!`, 'treasure');
    log('You have mastered the art of time travel!', 'treasure');
    log('', 'treasure');
    stopGameClock();
    showFinalStatus();
    return;
  }
  
  // Add to visited locations
  if (!gameState.visitedLocations.includes(gameState.location)) {
    gameState.visitedLocations.push(gameState.location);
  }
  
  updateStatusDisplay();
}

function askQuestion() {
  const currentLocation = locations[gameState.location];
  if (currentLocation.hasQuestion && !currentLocation.questionAnswered) {
    log('🤔 ' + currentLocation.question, 'question');
    log("💭 Type 'answer <your_response>' to respond.");
    gameState.awaitingAnswer = true;
    gameState.currentQuestion = currentLocation.question;
    return true;
  }
  return false;
}

function checkTreasureUnlock() {
  const requiredKeys = ['Triangle Key', 'Stone Key', 'Forest Key'];
  const hasAllKeys = requiredKeys.every(key => gameState.keys.includes(key));
  
  return hasAllKeys;
}

function endGameTimeUp() {
  gameState.gameActive = false;
  stopGameClock();

  // Show popup
  document.getElementById('popup-overlay').style.display = 'flex';

  log('', 'game-over');
  log('⏰ TIME\'S UP! ⏰', 'game-over');
  log(`You ran out of time in ${gameState.location}!`, 'game-over');
  log(`🏆 FINAL SCORE: ${gameState.score.toLocaleString()} POINTS`, 'game-over');
  log('', 'game-over');

  showFinalStatus();
}

function closePopup() {
  document.getElementById('popup-overlay').style.display = 'none';
}


function showFinalStatus() {
  log('', '');
  log('════════ GAME OVER ════════', 'success');
  log(`🏆 FINAL SCORE: ${gameState.score.toLocaleString()} POINTS`, 'treasure');
  log('', '');
  log('=== DETAILED STATISTICS ===', 'success');
  log(`🕒 Total Game Time: ${formatTime(gameState.gameTime)}`);
  log(`💖 Final Health: ${gameState.health}/100`);
  log(`🗝 Keys Collected: ${gameState.keys.join(', ') || 'None'} (${gameState.keys.length}/3)`);
  log(`📍 Locations Visited: ${gameState.visitedLocations.join(', ')}`);
  
  const completion = (gameState.keys.length / 3) * 100;
  log(`📊 Completion Rate: ${completion.toFixed(1)}%`);
  log('');
  
  // Score breakdown
  log('=== SCORE BREAKDOWN ===', 'success');
  log(`🗝 Keys Collected: ${gameState.keys.length} × 1,000 = ${(gameState.keys.length * 1000).toLocaleString()} pts`);
  const questionsAnswered = Object.values(locations).filter(loc => loc.hasQuestion && loc.questionAnswered).length;
  log(`🤔 Questions Answered: ${questionsAnswered} × 500 = ${(questionsAnswered * 500).toLocaleString()} pts`);
  if (gameState.location === 'Treasure Vault' || gameState.score >= 10000) {
    log('💰 Treasure Vault Bonus: 10,000 pts', 'treasure');
  }
  log(`🏆 TOTAL SCORE: ${gameState.score.toLocaleString()} POINTS`, 'treasure');
  log('');
  
  // Performance rating
  if (gameState.score >= 10000) {
    log('🌟 RANK: MASTER OF TIME! Perfect completion!', 'treasure');
  } else if (gameState.keys.length === 3) {
    log('🎖 RANK: TIME COLLECTOR! All keys found!', 'success');
  } else if (gameState.keys.length >= 2) {
    log('🥉 RANK: TIME SEEKER! Good progress!', 'success');
  } else if (gameState.keys.length >= 1) {
    log('🔰 RANK: TIME NOVICE! Keep exploring!', 'success');
  } else {
    log('📚 RANK: TIME STUDENT! Practice makes perfect!', 'warning');
  }
  
  log('', '');
  log('Thanks for playing Time Travel Adventure!', 'success');
  log('Refresh the page to play again!', 'success');
  
  elements.cmd.disabled = true;
}

function handleCommand(input) {
  if (!gameState.gameActive) return;
  
  const parts = input.trim().toLowerCase().split(' ');
  const command = parts[0];
  const args = parts.slice(1).join(' ');
  
  switch (command) {
    case 'help':
      log('🎮 COMMANDS:');
      log('• north/south/east/west - Move between locations');
      log('• treasure - Go to treasure vault (requires ALL 3 keys!)');
      log('• collect - Pick up keys');
      log('• answer <response> - Answer questions');
      log('• help - Show this help');
      log('');
      log('💡 TIP: Collect all 3 keys to unlock the treasure vault!');
      break;
      
    case 'north':
    case 'south':
    case 'east':
    case 'west':
    case 'treasure':
      const currentLocation = locations[gameState.location];
      if (!currentLocation.exits[command]) {
        log(`❌ You can't go ${command} from here.`, 'error');
      } else if (command === 'treasure' && !checkTreasureUnlock()) {
        const keysNeeded = 3 - gameState.keys.length;
        log(`🔐 The treasure vault is sealed! You need ${keysNeeded} more keys.`, 'error');
        log(`🗝 Current keys: ${gameState.keys.join(', ') || 'None'} (${gameState.keys.length}/3)`, 'warning');
        log('💡 Visit Bermuda Triangle, Stonehenge, and Crooked Forest to collect all keys!', 'warning');
      } else {
        // Check if player must answer question first
        if (currentLocation.hasQuestion && !currentLocation.questionAnswered) {
          if (!askQuestion()) {
            log('🚫 You must answer the question before leaving!', 'warning');
            return;
          }
          return;
        }
        
        gameState.location = currentLocation.exits[command];
        log(`🚶 Moving ${command}...`);
        enterLocation();
      }
      break;
      
    case 'collect':
      const location = locations[gameState.location];
      if (location.key && !gameState.keys.includes(location.key)) {
        log(`✨ You collected the ${location.key}!`, 'success');
        gameState.keys.push(location.key);
        gameState.score += 1000;
        
        // Check if all keys are now collected
        if (checkTreasureUnlock()) {
          log('🎉 ALL KEYS COLLECTED! 🎉', 'treasure');
          log('💰 The treasure vault is now accessible from Central Hub!', 'treasure');
        } else {
          const remaining = 3 - gameState.keys.length;
          log(`🗝 ${remaining} more key${remaining > 1 ? 's' : ''} needed for the treasure vault!`, 'success');
        }
        
        updateStatusDisplay();
      } else {
        log("❌ There's no key to collect here or you already have it.", 'error');
      }
      break;
      
    case 'answer':
      if (!gameState.awaitingAnswer) {
        log("❌ There's no question to answer right now.", 'error');
        break;
      }
      
      const currentLoc = locations[gameState.location];
      if (args.toLowerCase().includes(currentLoc.answer.toLowerCase())) {
        log('✅ Correct! Well done!', 'success');
        currentLoc.questionAnswered = true;
        gameState.awaitingAnswer = false;
        gameState.currentQuestion = null;
        gameState.score += 500;
        
        updateStatusDisplay();
      } else {
        log('❌ Incorrect answer. Try again!', 'error');
        gameState.health -= 10;
        log('🤔 ' + currentLoc.question, 'question');
        updateStatusDisplay();
      }
      break;
      
    default:
      log('❓ Unknown command: "' + command + '". Type \'help\' for available commands.', 'error');
  }
}

// Event listeners
elements.cmd.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && gameState.gameActive) {
    const input = elements.cmd.value.trim();
    if (input) {
      log(`> ${input}`);
      handleCommand(input);
      elements.cmd.value = '';
    }
  }
});

// Initialize game
function initGame() {
  startGameClock();
  
  log('🌟 ═══ TIME TRAVEL ADVENTURE ═══ 🌟', 'success');
  log('🎯 Mission: Collect ALL 3 keys from mystical locations!');
  log('⚠ Warning: Each location has unique time effects!');
  log('⏰ You have 2 minutes per location - use time wisely!');
  log('💎 Solve puzzles to unlock keys and reach the treasure!');
  log('🔐 The treasure vault requires ALL 3 keys to unlock!');
  log('');
  log('Type "help" for commands. Good luck, Time Traveler!');
  log('');
  
  enterLocation();
}

// Start the game
initGame();

