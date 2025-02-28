function createGameUI() {
    const appHTML = `
        <div id="app">
            <!-- Landing Page -->
            <div id="landingPage" class="game-screen">
                <div id="title1">classic Ping Pong</div>
                <h1 id="date">95</h1>
                <h1 id="Welcome">Welcome to Ping Pong Game</h1>
                <p>Enjoy the ultimate classic Ping Pong experience!</p>
                <div class="button-container">
                    <div class="main-buttons">
                        <button id="Player_vs_BOT">vs BOT</button>
                        <button id="Player_vs_Player">vs Player</button>
                        <button id="Multiplayer">Multiplayer</button>
                        <button id="Tournament">Tournament</button>
                        <button id="Matchmaking">Remote</button>
                        <div id="matchmakingStatus" style="display: none;">Searching for an opponent...</div>
                        <button id="cancelMatchmaking" style="display: none;">Cancel Search</button>
                    </div>
                    <div class="quit-container">
                        <button id="QuitMenu">Quit</button>
                    </div>
                </div>
            </div>
            <!-- Game Container -->
            <div id="gameContainer" class="game-screen">
                <div id="head">
                    <h1 id="title">Pong 95</h1>
                    <div id="topFrame">
                        <div id="player1">
                            <h1 id="Name1">Player_1:</h1>
                            <h1 id="Player_1">0</h1>
                        </div>
                        <div id="player3">
                            <h1 id="Name3">Player_3:</h1>
                            <h1 id="Player_3">0</h1>
                        </div>
                        <div id="player4">
                            <h1 id="Name4">Player_4:</h1>
                            <h1 id="Player_4">0</h1>
                        </div>
                        <div id="player2">
                            <h1 id="Name2">Player_2:</h1>
                            <h1 id="Player_2">0</h1>
                        </div>
                    </div>
                </div>
                <canvas id="canvas1" width="800" height="500"></canvas>
                <div id="tail">
                    <span>(c) maouzal 1337</span>
                    <div class="tail-buttons">
                        <button id="Menu">Menu</button>
                        <button id="Settings">Settings</button>
                        <button id="Restart">Restart</button>
                        <button id="QuitMenu">Quit</button>
                    </div>
                </div>
            </div>
            <!-- Settings Menu -->
            <div id="settingsMenu" class="game-screen">
                <h2>Settings</h2>
                <div class="settings-content">
                    <div class="instructions">
                        <h3>Controls:</h3>
                        <p>Player 1: W/S keys</p>
                        <p>Player 2: ↑/↓ arrows</p>
                        <p>Player 3: G/H keys</p>
                        <p>Player 4: 7/9 numpad</p>
                        <p>ESC: Close settings</p>
                    </div>
                    <div class="setting-item">
                        <label for="soundVolume">Sound Volume:</label>
                        <input type="range" id="soundVolume" min="0" max="100" value="50">
                    </div>
                    <div class="setting-item">
                        <label for="soundToggle">Sound Effects:</label>
                        <input type="checkbox" id="soundToggle" checked>
                    </div>
                    <div class="settings-buttons">
                        <button id="saveSettings">Save Settings</button>
                        <button id="cancelSettings">Cancel</button>
                    </div>
                </div>
            </div>
            <!-- Game Over Screen -->
            <div id="gameOver" class="game-screen">
                <h1 id="winnerText">Game Over</h1>
                <div id="finalScore"></div>
                <button id="playAgain">Play Again</button>
                <button id="returnToMenu">Return to Menu</button>
                <button id="nextMatchBtn" style="display: none;">Next Match</button>
            </div>
            <!-- Tournament Modal -->
            <div id="tournamentModal" class="game-screen">
                <h2>Tournament Setup</h2>
                <div class="tournament-setup">
                    <div class="player-registration">
                        <input type="text" id="playerNameInput" placeholder="Enter player name">
                        <button id="addPlayerBtn">Add Player</button>
                    </div>
                    <div class="registered-players">
                        <h3>Registered Players</h3>
                        <ul id="playersList"></ul>
                    </div>
                    <div class="tournament-controls">
                        <button id="startTournamentBtn" disabled>Start Tournament</button>
                        <button id="cancelTournamentBtn">Cancel</button>
                    </div>
                </div>
                <div class="tournament-bracket" style="display: none;">
                    <h3>Tournament Bracket</h3>
                    <div id="bracketContainer"></div>
                    <div id="currentMatch" style="display: none;">
                        <h4>Current Match</h4>
                        <p><span id="player1Name"></span> vs <span id="player2Name"></span></p>
                        <button id="startMatchBtn">Start Match</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Preload audio files -->
        <audio id="paddleHitSound" preload="auto">
            <source src="/static/sounds/paddle_hit.wav" type="audio/wav">
        </audio>
        <audio id="scoreSound" preload="auto">
            <source src="/static/sounds/score.wav" type="audio/wav">
        </audio>
    `;

    document.body.innerHTML = appHTML;
}

// Add the CSS directly
const gameScreenStyles = `
    .game-screen {
        display: none;
    }

    .game-screen.active {
        display: block;
    }
`;

function addGameStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = gameScreenStyles;
    document.head.appendChild(styleElement);
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createGameUI();
    addGameStyles();
});

export { createGameUI };