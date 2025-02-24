// Wait for DOM content to be loaded before initializing game logic
document.addEventListener('DOMContentLoaded', () => {
    // Import the createGameUI function from index.js
    import('/static/js/index.js')
        .then(module => {
            // Create the UI first
            module.createGameUI();
            // Then initialize the game after a short delay
            setTimeout(() => {
                initializeGame();
            }, 100);
        })
        .catch(error => console.error('Error loading UI:', error));
});

function initializeGame() {
    const canvas = document.getElementById('canvas1');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }
    const ctx = canvas.getContext('2d');

    // Get UI elements after they're created
    const landingPage = document.getElementById('landingPage');
    const gameContainer = document.getElementById('gameContainer');
    const Player_vs_BOT = document.getElementById('Player_vs_BOT');
    const Player_vs_Player = document.getElementById('Player_vs_Player');
    const Multiplayer = document.getElementById('Multiplayer');
    const Restart = document.getElementById("Restart");
    const Quit = document.getElementById("Quit");
    const Menu = document.getElementById("Menu");
    const QuitMenu = document.getElementById("QuitMenu");

    let gameStarted = false;
    let playerVSplayer = false;
    let playerVSbot = false;
    let multiplayer = false;
    let lastHit = null;
    let isGameOver = false;
    let resultSaved = false;
    let isMatchmaking = false;

    // Get the initial canvas size (assuming canvas is already created in HTML)
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Define scaling factor based on the canvas width and height (adjust these values)
    const playerWidth = canvas.width * 0.015;  // 1.5% of canvas width
    const playerHeight = canvas.height * 0.18; // 18% of canvas height
    const ballRadius = canvas.width * 0.008; // Reduced from 0.012 to 0.008
    // Starting Y position for players
    let startX = canvas.width / 2;
    const startY = canvas.height / 2;

    const startY2 = canvasWidth / 2 - playerWidth / 2; // Centered horizontally
    const BstartY = canvas.height / 2;
    const baseSpeedX = canvas.width * 0.005;
    const baseSpeedY = canvas.height * 0.005;


    const keysPressed = [];
    // Key codes for player 1
    const key_W = 87;
    const key_S = 83;
    // Key codes for player 2
    const key_Up = 38;
    const key_Down = 40;
    // Key codes for player 3
    const key_G = 71;
    const key_H = 72;
    // Key codes for player 4
    const key_7 = 103;
    const key_9 = 105;


    window.addEventListener('keydown', function(e) {
        if (isMatchmaking) {
            // For matchmaking games, only handle controls for your assigned player
            if (MatchmakingSystem.isPlayer1) {
                if (e.keyCode === key_W) keysPressed[key_W] = true;
                if (e.keyCode === key_S) keysPressed[key_S] = true;
            } else {
                if (e.keyCode === key_Up) keysPressed[key_Up] = true;
                if (e.keyCode === key_Down) keysPressed[key_Down] = true;
            }
        } else {
            // For local games, handle all controls
            if (e.keyCode === key_W) keysPressed[key_W] = true;
            if (e.keyCode === key_S) keysPressed[key_S] = true;
            if (e.keyCode === key_Up) keysPressed[key_Up] = true;
            if (e.keyCode === key_Down) keysPressed[key_Down] = true;
        }
    });

    window.addEventListener('keyup', function(e) {
        if (isMatchmaking) {
            // For matchmaking games, only handle controls for your assigned player
            if (MatchmakingSystem.isPlayer1) {
                if (e.keyCode === key_W) keysPressed[key_W] = false;
                if (e.keyCode === key_S) keysPressed[key_S] = false;
            } else {
                if (e.keyCode === key_Up) keysPressed[key_Up] = false;
                if (e.keyCode === key_Down) keysPressed[key_Down] = false;
            }
        } else {
            // For local games, handle all controls
            if (e.keyCode === key_W) keysPressed[key_W] = false;
            if (e.keyCode === key_S) keysPressed[key_S] = false;
            if (e.keyCode === key_Up) keysPressed[key_Up] = false;
            if (e.keyCode === key_Down) keysPressed[key_Down] = false;
        }
    });

    function vector(x, y)
    {
        return { x: x, y: y };
    }


    document.querySelectorAll("button").forEach(button => {
        QuitMenu.addEventListener('click', () => {
            // Try different approaches to close the window
            if (tournament.isActive || isMatchmaking) {
                console.log("Can't quit game in this mode, please finish the game first.");
                return;
            }
            if (window.opener) {
                window.close();
            } else {
                window.location.href = 'about:blank';
                window.close();
            }
        });
        Player_vs_BOT.addEventListener('click', () => {
            initializeAudio();
            resultSaved = false;
            isPaused = false;
            landingPage.style.display = 'none';
            gameContainer.style.display = 'flex';
            gameStarted = true;
            playerVSbot = true;
            // Reset scores
                player1.score = 0;
                player2.score = 0;
                document.getElementById("Player_1").innerHTML = "0";
                document.getElementById("Player_2").innerHTML = "0";
            // Set Name for Player 1 and Player 2
                document.getElementById("Name1").innerHTML = "Player";
                document.getElementById("Name2").innerHTML = "BOT";
        });
        Player_vs_Player.addEventListener('click', () => {
            initializeAudio();
            resultSaved = false;
            isPaused = false;
            landingPage.style.display = 'none';
            gameContainer.style.display = 'flex';
            gameStarted = true;
            playerVSplayer = true;
            // Reset scores
                player1.score = 0;
                player2.score = 0;
                document.getElementById("Player_1").innerHTML = "0";
                document.getElementById("Player_2").innerHTML = "0";
            // Set Name for Player 1 and Player 2
                document.getElementById("Name1").innerHTML = "Player_1";
                document.getElementById("Name2").innerHTML = "Player_2";
        });
        Multiplayer.addEventListener('click', () => {
            initializeAudio();
            resultSaved = false;
            isPaused = false;
            landingPage.style.display = 'none';
            gameContainer.style.display = 'flex';
            document.getElementById("Player_3").style.display = 'block';
            document.getElementById("Player_4").style.display = 'block';
            document.getElementById("Name3").style.display = 'block';
            document.getElementById("Name4").style.display = 'block';
            gameStarted = true;
            multiplayer = true;
            // Reset all scores
                player_1.score = 0;
                player_2.score = 0;
                player3.score = 0;
                player4.score = 0;
                document.getElementById("Player_1").innerHTML = "0";
                document.getElementById("Player_2").innerHTML = "0";
                document.getElementById("Player_3").innerHTML = "0";
                document.getElementById("Player_4").innerHTML = "0";
            // Set Name for Player 1, Player 2, Player 3 and Player 4
                document.getElementById("Name1").innerHTML = "Player_1";
                document.getElementById("Name2").innerHTML = "Player_2";
                document.getElementById("Name3").innerHTML = "Player_3";
                document.getElementById("Name4").innerHTML = "Player_4";
        });
        Restart.addEventListener("click", () => {
            console.log("Restart button clicked");
            if (tournament.isActive || isMatchmaking) {
                console.log("Can't restart game in this mode, please finish the game first.");
                return;
            }
            // saveInterruptedGame('Game Restarted'); // could be removed in final version because it's lokking not practical <-----> it will save the data of the same game again and again
            resetBall(ball);
            setAlltoZero();
        });
        Menu.addEventListener("click", () => {
            console.log("Menu button clicked");
            if (tournament.isActive || isMatchmaking) {
                console.log("Can't return to menu in this mode, please finish the game first.");
                return;
            }
            resetBall(ball);
            // saveInterruptedGame('Return to Menu before the game over');
            setAlltoZero();
            landingPage.style.display = 'flex'; // Show landing page
            gameContainer.style.display = 'none'; // Hide game container
            document.getElementById("Player_3").style.display = 'none';
            document.getElementById("Player_4").style.display = 'none';
            document.getElementById("Name3").style.display = 'none';
            document.getElementById("Name4").style.display = 'none';
            gameStarted = false;
            playerVSplayer = false;
            playerVSbot = false;
            multiplayer = false;
        });
    });

    function setAlltoZero() {
        if (multiplayer) {
            resetPosition_2(player_1, player_2, player3, player4);
            player_1.score = 0;
            player_2.score = 0;
            player3.score = 0;
            player4.score = 0;
            document.getElementById("Player_1").innerHTML = player_1.score;
            document.getElementById("Player_2").innerHTML = player_2.score;
            document.getElementById("Player_3").innerHTML = player3.score;
            document.getElementById("Player_4").innerHTML = player4.score;
        } else {
            resetPosition(player1, player2);
            player1.score = 0;
            player2.score = 0;
            document.getElementById("Player_1").innerHTML = player1.score;
            document.getElementById("Player_2").innerHTML = player2.score;
        }
    }

    // Pre-create audio buffers and sources
    const audioSources = {
        paddle: [],
        score: []
    };

    // Initialize audio with just paddle and score sounds
    async function initializeAudio() {
        if (window.audioInitialized) return;

        try {
            // Pre-create nodes only for paddle and score
            for (const type of ['paddle', 'score']) {
                audioSources[type] = [];
            }

            // Load only paddle and score sounds
            const sounds = {
                paddle: paddleHitSound,
                score: scoreSound
            };
        } catch (error) {
            console.error("Audio initialization failed:", error);
        }
    }

    function playerCollision(ball, player, name) {
        let dx = Math.abs(ball.pos.x - player.getcenter().x);
        let dy = Math.abs(ball.pos.y - player.getcenter().y);

        const willCollide = (dx < (ball.radius + player.getHalfWidth() + COLLISION_PREDICTION.PADDLE) &&
                            dy < (ball.radius + player.getHalfHeight() + COLLISION_PREDICTION.PADDLE));

        if (willCollide) {
            playBufferedSound('paddle');
        }

        if (dx < (ball.radius + player.getHalfWidth()) &&
            dy < (ball.radius + player.getHalfHeight())) {
        }
    }

    Ball.prototype.update = function () {
        // Silent bounce on top and bottom
        if (this.pos.y + this.radius > canvas.height || this.pos.y - this.radius < 0) {
            this.speed.y = -this.speed.y;
        }

        // Silent bounce on the left border segments
        if (this.pos.x - this.radius < borderWidth &&
            (this.pos.y < borderSegmentHeight || this.pos.y > canvas.height - borderSegmentHeight)) {
            this.speed.x = -this.speed.x;
        }

        // Silent bounce on the right border segments
        if (this.pos.x + this.radius > canvas.width - borderWidth &&
            (this.pos.y < borderSegmentHeight || this.pos.y > canvas.height - borderSegmentHeight)) {
            this.speed.x = -this.speed.x;
        }

        this.pos.x += this.speed.x;
        this.pos.y += this.speed.y;
    };

    Ball.prototype.update2 = function () {
        const borderSegmentHeight = canvas.height / 4;
        const borderSegmentWidth = canvas.width / 3;
        const borderWidth = 20;

        // Silent bounce on border segments
        if (this.pos.x - this.radius < borderWidth &&
            (this.pos.y < borderSegmentHeight || this.pos.y > canvas.height - borderSegmentHeight)) {
            this.speed.x = -this.speed.x;
            this.pos.x = borderWidth + this.radius;
        }

        if (this.pos.x + this.radius > canvas.width - borderWidth &&
            (this.pos.y < borderSegmentHeight || this.pos.y > canvas.height - borderSegmentHeight)) {
            this.speed.x = -this.speed.x;
            this.pos.x = canvas.width - borderWidth - this.radius;
        }

        if (this.pos.y - this.radius < borderWidth &&
            (this.pos.x < borderSegmentWidth || this.pos.x > canvas.width - borderSegmentWidth)) {
            this.speed.y = -this.speed.y;
            this.pos.y = borderWidth + this.radius;
        }

        if (this.pos.y + this.radius > canvas.height - borderWidth &&
            (this.pos.x < borderSegmentWidth || this.pos.x > canvas.width - borderSegmentWidth)) {
            this.speed.y = -this.speed.y;
            this.pos.y = canvas.height - borderWidth - this.radius;
        }

        this.pos.x += this.speed.x;
        this.pos.y += this.speed.y;
    };

    // Score function for two players
    function Score(ball, player1, player2) {
        // Check if the ball is in the scoring area
        if (ball.pos.x <= -ball.radius || ball.pos.x >= canvas.width + ball.radius) {
            if (gameSettings.soundEnabled) {
                scoreSound.currentTime = 0;
                scoreSound.playbackRate = 1.2; // Faster playback
                scoreSound.volume = gameSettings.soundVolume;
                scoreSound.play().catch(error => console.log("Audio play failed:", error));
            }
            if (ball.pos.x <= -ball.radius) {
                player2.score += 1;
                document.getElementById("Player_2").innerHTML = player2.score;
                resetBall(ball);
            }

            if (ball.pos.x >= canvas.width + ball.radius) {
                player1.score += 1;
                document.getElementById("Player_1").innerHTML = player1.score;
                resetBall(ball);
            }
        }

        // Check if a player has won
        if (player1.score === 5 || player2.score === 5) // increase the score to 10 when finsihing the testing
        {
            if (gameSettings.soundEnabled) {
                scoreSound.currentTime = 0;
                scoreSound.volume = gameSettings.soundVolume;
                scoreSound.play().catch(error => console.log("Audio play failed:", error));
            }
            gameOver(player1.score === 5 ? "Player 1" : "Player 2");
            return;
        }
    }

    // score function for multiplayer
    function Score2(ball, player1, player2, player3, player4) {
        // Check if the ball is in the scoring area
        if (ball.pos.y <= -ball.radius || ball.pos.y >= canvas.height + ball.radius ||
            ball.pos.x <= -ball.radius || ball.pos.x >= canvas.width + ball.radius) {

            let scoreOccurred = false;

            if (lastHit === "Player_1" && !(ball.pos.x <= -ball.radius)) {
                player1.score += 1;
                document.getElementById("Player_1").innerHTML = player1.score;
                scoreOccurred = true;
            }
            if (lastHit === "Player_3" && !(ball.pos.y <= -ball.radius)) {
                player3.score += 1;
                document.getElementById("Player_3").innerHTML = player3.score;
                scoreOccurred = true;
            }
            if (lastHit === "Player_2" && !(ball.pos.x >= canvas.width + ball.radius)) {
                player2.score += 1;
                document.getElementById("Player_2").innerHTML = player2.score;
                scoreOccurred = true;
            }
            if (lastHit === "Player_4" && !(ball.pos.y >= canvas.height + ball.radius)) {
                player4.score += 1;
                document.getElementById("Player_4").innerHTML = player4.score;
                scoreOccurred = true;
            }

            // Only play sound if a score actually occurred
            if (scoreOccurred && gameSettings.soundEnabled) {
                scoreSound.currentTime = 0;
                scoreSound.playbackRate = 1.2;
                scoreSound.volume = gameSettings.soundVolume;
                scoreSound.play().catch(error => console.log("Audio play failed:", error));
            }

            resetBall(ball);
        }

        // Check if a player has won
        const winningScore = 5;
        if (player1.score === winningScore || player2.score === winningScore ||
            player3.score === winningScore || player4.score === winningScore) {

            // Play victory sound
            if (gameSettings.soundEnabled) {
                scoreSound.currentTime = 0;
                scoreSound.volume = gameSettings.soundVolume;
                scoreSound.play().catch(error => console.log("Audio play failed:", error));
            }

            if (player1.score === winningScore) gameover_2("Player 1");
            else if (player2.score === winningScore) gameover_2("Player 2");
            else if (player3.score === winningScore) gameover_2("Player 3");
            else if (player4.score === winningScore) gameover_2("Player 4");
            return;
        }
    }

    function resetBall(ball) {
        const StartSpeed = baseSpeedX;  // Reduce this to slow down the ball on start
        const randomDirection = Math.random() < 0.5 ? -1 : 1;

        lastHit = null;
        ball.pos.x = canvas.width / 2;
        ball.pos.y = canvas.height / 2;

        // Set initial speed for both axes
        ball.speed.x = StartSpeed * randomDirection;
        ball.speed.y = StartSpeed * (Math.random() < 0.5 ? -1 : 1);

        console.log("Ball reset with speed:", ball.speed.x, ball.speed.y);
    }

    //
    function resetPosition_2(player1, player2, player3, player4) {
        player1.pos = vector(20, canvas.height / 2 - playerHeight / 2);
        player2.pos = vector(canvas.width - 20 - playerWidth, canvas.height / 2 - playerHeight / 2);
        player3.pos = vector(canvas.width / 2 - playerHeight / 2, 20);
        player4.pos = vector(canvas.width / 2 - playerHeight / 2, canvas.height - playerWidth - 20);
    }

    function resetPosition(player1, player2) {
        player1.pos = vector(20, canvas.height / 2 - playerHeight / 2);
        player2.pos = vector(canvas.width - 20 - playerWidth, canvas.height / 2 - playerHeight / 2);
    }



    document.getElementById('playAgain').addEventListener('click', () => {
        document.getElementById('gameOver').style.display = 'none';
        document.getElementById('gameContainer').style.opacity = '1'; // Reset opacity
        // gameContainer.style.opacity = '1';
        isGameOver = false;
        isPaused = false;
        gameStarted = true;
        Restart.click();
        resultSaved = false;
    });

    document.getElementById('returnToMenu').addEventListener('click', () => {
        document.getElementById('gameOver').style.display = 'none';
        document.getElementById('gameContainer').style.opacity = '1'; // Reset opacity
        // gameContainer.style.opacity = '1';
        isGameOver = false;
        isPaused = false;
        gameStarted = false;
        Menu.click();
        resultSaved = false;
    });

    // Update the gameOver and gameover_2 functions
    function gameOver(winner) {
        resetBall(ball);
        let score = winner === "Player 1" ? player1.score : player2.score;
        showGameOver(winner, score);
    }

    function gameover_2(winner) {
        resetBall(ball);
        let score;
        switch(winner) {
            case "Player 1": score = player_1.score; break;
            case "Player 2": score = player_2.score; break;
            case "Player 3": score = player3.score; break;
            case "Player 4": score = player4.score; break;
        }
        showGameOver(winner, score);
    }

    function Ball(pos, radius, speed) {
        this.pos = pos;
        this.radius = radius;
        this.speed = speed;

        let borderSegmentHeight = canvas.height / 7;
        const borderWidth = 20;

        const BASE_SPEED_RATIO = 0.01; // Speed is 10% of the canvas width/height

        this.update = function () {
            // Silent bounce on top and bottom
            if (this.pos.y + this.radius > canvas.height || this.pos.y - this.radius < 0) {
                this.speed.y = -this.speed.y;
            }

            // Silent bounce on the left border segments
            if (this.pos.x - this.radius < borderWidth &&
                (this.pos.y < borderSegmentHeight || this.pos.y > canvas.height - borderSegmentHeight)) {
                this.speed.x = -this.speed.x;
            }

            // Silent bounce on the right border segments
            if (this.pos.x + this.radius > canvas.width - borderWidth &&
                (this.pos.y < borderSegmentHeight || this.pos.y > canvas.height - borderSegmentHeight)) {
                this.speed.x = -this.speed.x;
            }

            this.pos.x += this.speed.x;
            this.pos.y += this.speed.y;
        };

        this.update2 = function () {
            const borderSegmentHeight = canvas.height / 4;
            const borderSegmentWidth = canvas.width / 3;
            const borderWidth = 20;

            // Silent bounce on border segments
            if (this.pos.x - this.radius < borderWidth &&
                (this.pos.y < borderSegmentHeight || this.pos.y > canvas.height - borderSegmentHeight)) {
                this.speed.x = -this.speed.x;
                this.pos.x = borderWidth + this.radius;
            }

            if (this.pos.x + this.radius > canvas.width - borderWidth &&
                (this.pos.y < borderSegmentHeight || this.pos.y > canvas.height - borderSegmentHeight)) {
                this.speed.x = -this.speed.x;
                this.pos.x = canvas.width - borderWidth - this.radius;
            }

            if (this.pos.y - this.radius < borderWidth &&
                (this.pos.x < borderSegmentWidth || this.pos.x > canvas.width - borderSegmentWidth)) {
                this.speed.y = -this.speed.y;
                this.pos.y = borderWidth + this.radius;
            }

            if (this.pos.y + this.radius > canvas.height - borderWidth &&
                (this.pos.x < borderSegmentWidth || this.pos.x > canvas.width - borderSegmentWidth)) {
                this.speed.y = -this.speed.y;
                this.pos.y = canvas.height - borderWidth - this.radius;
            }

            this.pos.x += this.speed.x;
            this.pos.y += this.speed.y;
        };

        this.draw = function () {
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'white';
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        };
    }

    function Player(pos, width, height, speed)
    {
        this.pos = pos;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.score = 0;

        this.update = function() {
            if (keysPressed[key_W] && this.pos.y > canvas.height / 10) {
                this.pos.y -= this.speed;
            }
            if (keysPressed[key_S] && this.pos.y < (canvas.height - canvas.height / 10) - this.height) {
                this.pos.y += this.speed;
            }
        };
        this.update2 = function() {
            if (keysPressed[key_Up] && this.pos.y > canvas.height / 10) {
                this.pos.y -= this.speed;
            }
            if (keysPressed[key_Down] && this.pos.y < (canvas.height - canvas.height / 10) - this.height) {
                this.pos.y += this.speed;
            }
        };
        this.update_2 = function() {
            if (keysPressed[key_Up] && this.pos.y > canvas.height / 4) {
                this.pos.y -= this.speed;
            }
            if (keysPressed[key_Down] && this.pos.y < (canvas.height - canvas.height / 4) - this.height) {
                this.pos.y += this.speed;
            }
        };
        this.update_1 = function() {
            if (keysPressed[key_W] && this.pos.y > canvas.height / 4) {
                this.pos.y -= this.speed;
            }
            if (keysPressed[key_S] && this.pos.y < (canvas.height - canvas.height / 4) - this.height) {
                this.pos.y += this.speed;
            }
        };
        this.update_3 = function() {
            if (keysPressed[key_G] && this.pos.x > canvas.width / 3) {
            this.pos.x -= this.speed;
            }
            if (keysPressed[key_H] && this.pos.x < (canvas.width - canvas.width / 3) - this.width) {
            this.pos.x += this.speed;
            }
        };
        this.update_4 = function() {
            if (keysPressed[key_7] && this.pos.x > canvas.width / 3) {
                this.pos.x -= this.speed;
            }
            if (keysPressed[key_9] && this.pos.x < (canvas.width - canvas.width / 3) - this.width) {
                this.pos.x += this.speed;
            }
        };

        this.draw = function() {
            ctx.fillStyle = 'green';
            ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height, this.speed);
        };
        this.draw2 = function() {
            ctx.fillStyle = 'blue';
            ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height, this.speed);
        };
        this.draw3 = function() {
            ctx.fillStyle = 'orange';
            ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height, this.speed);
        };
        this.draw4 = function() {
            ctx.fillStyle = 'purple';
            ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height, this.speed);
        };

        this.getHalfWidth = function() {
            return this.width / 2;
        };

        this.getHalfHeight = function() {
            return this.height / 2;
        };
        this.getcenter = function() {
            return vector(this.pos.x + this.getHalfWidth(), this.pos.y + this.getHalfHeight());
        };
    }


    function Player2IA(ball, player) {
        // Calculate target position with some prediction
        const prediction = ball.pos.y + (ball.speed.y * 3);
        const targetY = Math.min(
            Math.max(prediction - player.height / 2, canvas.height / 10),
            canvas.height - canvas.height / 10 - player.height
        );

        // Calculate distance to target
        const distance = targetY - player.pos.y;

        // Smoothly move towards target
        if (Math.abs(distance) > player.speed) {
            // Only move if ball is moving towards the bot
            if (ball.speed.x > 0) {
                // Add "reaction time" - only move when ball is in bot's half
                if (ball.pos.x > canvas.width / 2) {
                    player.pos.y += Math.sign(distance) * (player.speed * 0.9);
                }
            } else {
                // Return to center when ball is moving away
                const centerY = canvas.height / 2 - player.height / 2;
                player.pos.y += Math.sign(centerY - player.pos.y) * (player.speed * 0.5);
            }
        }

        // Ensure player stays within bounds
        player.pos.y = Math.max(
            canvas.height / 10,
            Math.min(canvas.height - canvas.height / 10 - player.height, player.pos.y)
        );
    }

    // Get audio elements
    const paddleHitSound = document.getElementById('paddleHitSound');
    const scoreSound = document.getElementById('scoreSound');

    // Update playerCollision function to play sound earlier
    function playerCollision(ball, player, name) {
        let dx = Math.abs(ball.pos.x - player.getcenter().x);
        let dy = Math.abs(ball.pos.y - player.getcenter().y);

        // Increased detection range and earlier trigger
        if (dx < (ball.radius + player.getHalfWidth()) &&
            dy < (ball.radius + player.getHalfHeight())) {
            if (gameSettings.soundEnabled) {
                paddleHitSound.currentTime = 0;
                paddleHitSound.playbackRate = 1.2; // Faster playback
                paddleHitSound.volume = gameSettings.soundVolume;
                paddleHitSound.play().catch(error => console.log("Audio play failed:", error));
            }
        }

        if (dx < (ball.radius + player.getHalfWidth()) &&
            dy < (ball.radius + player.getHalfHeight())) {
            if (gameSettings.soundEnabled && paddleHitSound.readyState >= 2) {
                paddleHitSound.currentTime = 0;
                paddleHitSound.volume = gameSettings.soundVolume;
                const playPromise = paddleHitSound.play();
                if (playPromise) {
                    playPromise.catch(() => {
                        // Retry playing the sound
                        setTimeout(() => {
                            paddleHitSound.play().catch(error => console.log("Retry failed:", error));
                        }, 10);
                    });
                }
            }

            // Determine if the player is horizontal or vertical
            const isHorizontal = player.getHalfWidth() > player.getHalfHeight();

            if (isHorizontal) {
                // Horizontal players (Player 1, Player 2)
                ball.speed.y *= -1;

                // Resolve overlap to prevent sticking
                if (ball.pos.y < player.getcenter().y) {
                    ball.pos.y = player.getcenter().y - (player.getHalfHeight() + ball.radius);
                } else {
                    ball.pos.y = player.getcenter().y + (player.getHalfHeight() + ball.radius);
                }

                // Adjust horizontal speed for deflection
                const hitPosition = (ball.pos.x - player.getcenter().x) / player.getHalfWidth();
                ball.speed.x += hitPosition * 1.5; // Adjust for deflection
            } else {
                // Vertical players (Player 3, Player 4)
                ball.speed.x *= -1;

                // Resolve overlap to prevent sticking
                if (ball.pos.x < player.getcenter().x) {
                    ball.pos.x = player.getcenter().x - (player.getHalfWidth() + ball.radius);
                } else {
                    ball.pos.x = player.getcenter().x + (player.getHalfWidth() + ball.radius);
                }

                // Adjust vertical speed for deflection
                const hitPosition = (ball.pos.y - player.getcenter().y) / player.getHalfHeight();
                ball.speed.y += hitPosition * 1.5; // Adjust for deflection
            }
            // Update lastHit to track who hit the ball
            if (name) lastHit = name;
            // Increase ball speed
            if (Math.abs(ball.speed.x) < 15) {
                ball.speed.x += (ball.speed.x > 0 ? 0.5 : -0.5);
            }
            if (Math.abs(ball.speed.y) < 15) {
                ball.speed.y += (ball.speed.y > 0 ? 0.5 : -0.5);
            }
        }
    }

    function drawfield()
    {
        ctx.strokeStyle = 'white';

        ctx.beginPath();
        ctx.lineWidth = 20;
        ctx.moveTo(0, 0);
        ctx.lineTo(0 , canvas.height / 7);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = 20;
        ctx.moveTo(0, canvas.height);
        ctx.lineTo(0, canvas.height - canvas.height / 7);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = 20;
        ctx.moveTo(canvas.width, 0);
        ctx.lineTo(canvas.width , canvas.height / 7);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = 20;
        ctx.moveTo(canvas.width, canvas.height);
        ctx.lineTo(canvas.width, canvas.height - canvas.height / 7);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 10]); // Shorter dashes for retro look
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
        ctx.setLineDash([]);
    }

    function drawfield_multiplayer() {
        ctx.strokeStyle = 'red';

        // Player 1 & 2 (Side players - smaller goals)
        // Left side
        ctx.beginPath();
        ctx.lineWidth = 20;
        ctx.moveTo(0, 0);
        ctx.lineTo(0, canvas.height / 4); // Decreased goal size
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = 20;
        ctx.moveTo(0, canvas.height);
        ctx.lineTo(0, canvas.height - (canvas.height / 4)); // Decreased goal size
        ctx.stroke();

        // Right side
        ctx.beginPath();
        ctx.lineWidth = 20;
        ctx.moveTo(canvas.width, 0);
        ctx.lineTo(canvas.width, (canvas.height / 4)); // Decreased goal size
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = 20;
        ctx.moveTo(canvas.width, canvas.height);
        ctx.lineTo(canvas.width, (canvas.height - canvas.height / 4)); // Decreased goal size
        ctx.stroke();

        // Player 3 & 4 (Top/Bottom players - larger goals)
        // Top player
        ctx.beginPath();
        ctx.lineWidth = 20;
        ctx.moveTo(0, 0);
        ctx.lineTo(canvas.width / 3, 0); // Increased goal size
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = 20;
        ctx.moveTo(canvas.width, 0);
        ctx.lineTo(canvas.width - canvas.width / 3, 0); // Increased goal size
        ctx.stroke();

        // Bottom player
        ctx.beginPath();
        ctx.lineWidth = 20;
        ctx.moveTo(0, canvas.height);
        ctx.lineTo(canvas.width / 3, canvas.height); // Increased goal size
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = 20;
        ctx.moveTo(canvas.width, canvas.height);
        ctx.lineTo(canvas.width - canvas.width / 3, canvas.height); // Increased goal size
        ctx.stroke();

        // Middle line
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 10]); // Shorter dashes for retro look
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Adjust the base speed constant for players
    const PLAYER_BASE_SPEED = 8; // Reduced from 15

    // Update player creation with new speed
    let ball = new Ball(vector(startX, BstartY), ballRadius, vector(5, 5));
    let player1 = new Player(vector((canvas.width / 20 ), startY), playerWidth, playerHeight, PLAYER_BASE_SPEED);
    let player2 = new Player(vector(canvas.width - (canvas.width / 20 ) - playerWidth, startY), playerWidth, playerHeight, PLAYER_BASE_SPEED);

    let player_1 = new Player(vector(20, canvas.height / 2 - playerHeight / 2), playerWidth, playerHeight, PLAYER_BASE_SPEED);
    let player_2 = new Player(vector(canvas.width- 20 - playerWidth, canvas.height / 2 - playerHeight / 2), playerWidth, playerHeight, PLAYER_BASE_SPEED);
    let player3 = new Player(vector(canvas.width / 2 - playerHeight / 2, 20), playerHeight, playerWidth, PLAYER_BASE_SPEED);
    let player4 = new Player(vector(canvas.width / 2- 20 - playerHeight / 2, canvas.height - playerWidth - 20), playerHeight, playerWidth, PLAYER_BASE_SPEED);

    function update()
    {
        if (playerVSbot) {
            ball.update();
            player1.update();
            playerCollision(ball, player1, null);
            Player2IA(ball, player2);
            playerCollision(ball, player2, null);
            Score(ball, player1, player2);
        }
        else if (playerVSplayer) {
            ball.update();
            player1.update();
            player2.update2();
            playerCollision(ball, player1, null);
            playerCollision(ball, player2, null);
            Score(ball, player1, player2);
        }
        else if (multiplayer) {
            ball.update2();
            player_1.update_1();
            player_2.update_2();
            player3.update_3();
            player4.update_4();
            playerCollision(ball, player_1, "Player_1");
            playerCollision(ball, player_2, "Player_2");
            playerCollision(ball, player3, "Player_3");
            playerCollision(ball, player4, "Player_4");
            Score2(ball, player_1, player_2, player3, player4);
        }
    }

    function drawgame()
    {
        if (playerVSbot || playerVSplayer) {
            drawfield();
            player1.draw();
            player2.draw2();
            ball.draw();
        }
        else if (multiplayer) {
            drawfield_multiplayer();
            player_1.draw();
            player_2.draw2();
            player3.draw3();
            player4.draw4();
            ball.draw();
        }
    }

    // Settings management
    let gameSettings = {
        soundEnabled: true,
        soundVolume: 0.5
    };

    // Load settings from localStorage
    function loadSettings() {
        const savedSettings = localStorage.getItem('pongSettings');
        if (savedSettings) {
            gameSettings = JSON.parse(savedSettings);
            document.getElementById('soundVolume').value = gameSettings.soundVolume * 100;
            document.getElementById('soundToggle').checked = gameSettings.soundEnabled;
        }
    }

    // Save settings to localStorage
    function saveSettings() {
        gameSettings.soundVolume = parseInt(document.getElementById('soundVolume').value) / 100;
        gameSettings.soundEnabled = document.getElementById('soundToggle').checked;

        console.log('Settings saved:', gameSettings);

        // Test sound
        if (gameSettings.soundEnabled) {
            paddleHitSound.volume = gameSettings.soundVolume;
            paddleHitSound.currentTime = 0;
            paddleHitSound.play().catch(error => console.log("Audio play failed:", error));
        }

        localStorage.setItem('pongSettings', JSON.stringify(gameSettings));
        hideSettingsMenu(); // This will also resume the game
    }

    // Show/Hide Settings Menu
    function showSettingsMenu() {
        if (isMatchmaking) return; // Prevent opening settings during matchmaking
        document.getElementById('settingsMenu').style.display = 'block';
        isPaused = true; // Pause the game when settings are open
    }

    // Update hideSettingsMenu function
    function hideSettingsMenu() {
        const settingsMenu = document.getElementById('settingsMenu');
        settingsMenu.style.display = 'none';
        isPaused = false; // Resume the game when settings are closed
    }

    // Event Listeners
    document.addEventListener('DOMContentLoaded', () => {
        loadSettings();

        document.getElementById('Settings').addEventListener('click', showSettingsMenu);
        document.getElementById('saveSettings').addEventListener('click', saveSettings);
        document.getElementById('cancelSettings').addEventListener('click', () => {
            // Restore previous settings and hide menu
            loadSettings();
            hideSettingsMenu();
        });
    });

    // Add a new variable for game pause state
    let isPaused = false;

    // Add escape key handler to close settings
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('settingsMenu').style.display === 'block') {
            hideSettingsMenu();
        }
    });


    class GameAPI {
        static async getGameResults() {
            const response = await fetch('/api/games/');
            return await response.json();
        }
        static async saveGameResult(gameData) {
            const response = await fetch('/api/games/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCsrfToken(),
                },
                body: JSON.stringify(gameData)
            });
            return await response.json();
        }

        static getCsrfToken() {
            return document.querySelector('[name=csrfmiddlewaretoken]').value;
        }
    }

    function getCsrfToken() {
        // Try cookie first
        const cookies = document.cookie.split(';');
        const csrfCookie = cookies.find(cookie => cookie.trim().startsWith('csrftoken='));
        if (csrfCookie) {
            return csrfCookie.split('=')[1];
        }

        // Fallback to meta tag
        const metaToken = document.querySelector('meta[name="csrf-token"]');
        if (metaToken) {
            return metaToken.getAttribute('content');
        }

        console.error('CSRF token not found');
        return null;
    }


    async function saveGameResult(winner) {
        const csrfToken = getCsrfToken();

        // Determine game type
        let gameType = tournament.isActive ? 'TRN' : 
            isMatchmaking ? 'MM' : 'PVP';

        // Get user ID from backend
        // let user_ID;
        // try {
        // 	const response = await fetch('/api/user/', {
        // 		headers: {
        // 			'Content-Type': 'application/json',
        // 			'X-CSRFToken': csrfToken
        // 		}
        // 	});
        // } catch (error) {
        // 	console.error('Failed to get user ID:', error);
        // }

        // For matchmaking games, use "Player 1" and "Player 2" as default names
        let player1_name, player2_name;
        if (isMatchmaking) {
            player1_name = "Player 1";
            player2_name = "Player 2";
        } else {
            player1_name = document.getElementById('Name1').textContent;
            player2_name = document.getElementById('Name2').textContent;
        }
        
        // Determine winner number based on the game type
        let winnerNumber;
        if (isMatchmaking) {
            winnerNumber = winner === "Player 1" ? 1 : 2;
        } else {
            // For PVP games
            winnerNumber = winner === "Player 1" ? 1 :
            winner === "Player 2" ? 2 : null;
        }

        // Determine tournament stage and round
        let tournamentStage = null;
        
        if (tournament.isActive) {
            // Determine stage and round based on tournament progress
            if (tournament.roundWinners.length <= 2) {
                tournamentStage = 'semifinal';
            } else {
                tournamentStage = 'final';
            }
        }

        const data = {
            game_type: gameType,
            // user_ID: user_ID,
            player1: player1_name,
            player2: player2_name,
            player1_score: player1.score,
            player2_score: player2.score,
            winner: winnerNumber,
            timestamp: new Date().toLocaleString(),
            // Tournament fields
            is_tournament_match: tournament.isActive,
            tournament_stage: tournamentStage,
        };

        try {
            const response = await fetch('/api/game-results/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Game result saved successfully:', result);
            resultSaved = true;
        } catch (error) {
            console.error('Failed to save game result:', error);
        }
    }


    function loop()
    {
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        // ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        requestAnimationFrame(loop);
        if (!gameStarted || isGameOver || isPaused) {
            return;
        }
        update();
        drawgame();
    }

    loop();


    // Tournament Management --------------------------------------------

    // Add these functions to handle tournament requests and responses
    async function requestTournamentStart() {
        // Show loading state
        const startBtn = document.getElementById('startTournamentBtn');
        const originalText = startBtn.textContent;
        startBtn.textContent = 'Requesting...';
        startBtn.disabled = true;

        try {
            const response = await fetch('/api/tournament/request/', // API endpoint for tournament requests
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCsrfToken()
                },
                body: JSON.stringify({
                    players: tournament.players,
                    timestamp: new Date().toLocaleString()
                })
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Failed to start tournament');
            }
            
            if (result.status === 'approved') {
                initializeTournament();
                document.querySelector('.tournament-setup').style.display = 'none';
                document.querySelector('.tournament-bracket').style.display = 'block';
            } else {
                throw new Error(result.message || 'Tournament request denied');
            }
        } catch (error) {
            console.error('Tournament request failed:', error);
            alert('Failed to start tournament: ' + error.message);
            resetTournament();
            document.getElementById('tournamentModal').style.display = 'none';
            landingPage.style.display = 'flex';
        } finally {
            // Reset button state
            startBtn.textContent = originalText;
            startBtn.disabled = false;
        }
    }

    const tournament = {
        players: [],
        matches: [],
        currentMatchIndex: 0,
        isActive: false,
        roundWinners: []  // Track winners of each round
    };

    // Event Listeners
    document.getElementById('Tournament').addEventListener('click', () => {
        document.getElementById('tournamentModal').style.display = 'block';
        landingPage.style.display = 'none';
    });

    document.getElementById('addPlayerBtn').addEventListener('click', () => {
        const input = document.getElementById('playerNameInput');
        const name = input.value.trim();
        
        // First check if the name is empty
        if (!name) {
            alert('Please enter a player name');
            return;
        }

        // Check for duplicate names (case insensitive)
        const isDuplicate = tournament.players.some(player => 
            player.toLowerCase() === name.toLowerCase()
        );

        if (isDuplicate) {
            alert('This player name is already registered. Please use a different name.');
            return;
        }
        
        if (tournament.players.length < 4) { // Max 4 players
            tournament.players.push(name);
            updatePlayersList();
            input.value = ''; // Clear the input field
            
            // Enable start button only when we have exactly 4 players
            document.getElementById('startTournamentBtn').disabled = tournament.players.length !== 4;
            
            // Disable add button if max players reached
            if (tournament.players.length >= 4) {
                document.getElementById('addPlayerBtn').disabled = true;
            }
        }
    });

    document.getElementById('startTournamentBtn').addEventListener('click', () => {
        if (tournament.players.length >= 4) {
            // Show loading state
            const startBtn = document.getElementById('startTournamentBtn');
            const originalText = startBtn.textContent;
            startBtn.textContent = 'Requesting...';
            startBtn.disabled = true;

            // Request tournament start
            requestTournamentStart()
                .finally(() => {
                    // Reset button state
                    startBtn.textContent = originalText;
                    startBtn.disabled = false;
                });

            initializeTournament();
            document.querySelector('.tournament-setup').style.display = 'none';
            document.querySelector('.tournament-bracket').style.display = 'block';
        }
    });

    document.getElementById('cancelTournamentBtn').addEventListener('click', () => {
        document.getElementById('tournamentModal').style.display = 'none';
        landingPage.style.display = 'flex';
        resetTournament();
    });

    document.getElementById('startMatchBtn').addEventListener('click', () => {
        const currentMatch = tournament.matches[tournament.currentMatchIndex];
        if (currentMatch) {
            startTournamentMatch(currentMatch.player1, currentMatch.player2);
        }
    });

    document.getElementById('nextMatchBtn').addEventListener('click', () => {
        document.getElementById('gameOver').style.display = 'none';
        document.getElementById('gameContainer').style.opacity = '1'; // Reset opacity
        // gameContainer.style.opacity = '1';

        if (!tournament.isActive) {
            // Tournament is complete, return to menu
            resetTournament();
            document.getElementById('tournamentModal').style.display = 'none';
            gameContainer.style.display = 'none';
            landingPage.style.display = 'flex';
        } else if (tournament.roundWinners.length === 2) {
            // Start final match
            startTournamentMatch(tournament.roundWinners[0], tournament.roundWinners[1]);
        } else {
            // Start next semi-final match
            const nextMatch = tournament.matches[tournament.currentMatchIndex];
            if (nextMatch) {
                startTournamentMatch(nextMatch.player1, nextMatch.player2);
            }
        }
    });

    // Helper Functions
    function updatePlayersList() {
        const list = document.getElementById('playersList');
        list.innerHTML = '';

        tournament.players.forEach((player, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${player}`;

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.className = 'remove-btn';
            removeButton.addEventListener('click', () => {
                tournament.players.splice(index, 1);
                updatePlayersList();
                // Re-enable add button if below max
                document.getElementById('addPlayerBtn').disabled = tournament.players.length >= 4;
                // Update start button based on valid player count
                const validPlayerCount = [4].includes(tournament.players.length);
                document.getElementById('startTournamentBtn').disabled = !validPlayerCount;
            });
            li.appendChild(removeButton);
            list.appendChild(li);
        });
    }

    function initializeTournament() {
        tournament.isActive = true;
        tournament.currentMatchIndex = 0;
        tournament.matches = [];
        tournament.roundWinners = [];

        // Create semi-final matches (always 2 matches)
        tournament.matches = [
            {
                round: 1,
                player1: tournament.players[0],
                player2: tournament.players[1]
            },
            {
                round: 1,
                player1: tournament.players[2],
                player2: tournament.players[3]
            }
        ];

        updateBracketDisplay();
        showCurrentMatch();
    }

    function showCurrentMatch() {
        const currentMatch = tournament.matches[tournament.currentMatchIndex];
        if (currentMatch) {
            document.getElementById('currentMatch').style.display = 'block';
            document.getElementById('player1Name').textContent = currentMatch.player1;
            document.getElementById('player2Name').textContent = currentMatch.player2;

            // Also update the game display names
            document.getElementById('Name1').textContent = currentMatch.player1;
            document.getElementById('Name2').textContent = currentMatch.player2;
        }
    }

    function resetTournament() {
        tournament.isActive = false;
        tournament.currentMatchIndex = 0;
        tournament.players = [];
        tournament.matches = [];
        tournament.roundWinners = [];
        document.getElementById('startTournamentBtn').disabled = true;
        document.getElementById('addPlayerBtn').disabled = false;
        document.getElementById('playersList').innerHTML = '';
        document.getElementById('currentMatch').style.display = 'none';
        document.getElementById('bracketContainer').innerHTML = '';
        document.querySelector('.tournament-setup').style.display = 'block';
        document.querySelector('.tournament-bracket').style.display = 'none';
    }

    function startTournamentMatch(player1Name, player2Name) {
        document.getElementById('tournamentModal').style.display = 'none';
        gameContainer.style.display = 'flex';
        gameStarted = true;
        playerVSplayer = true;
        isGameOver = false;
        isPaused = false;
        resultSaved = false;

        // Ensure player names are strings
        const name1 = String(player1Name);
        const name2 = String(player2Name);

        // Update player names
        document.getElementById('Name1').textContent = name1;
        document.getElementById('Name2').textContent = name2;

        // Reset scores and positions
        player1.score = 0;
        player2.score = 0;
        document.getElementById('Player_1').innerHTML = '0';
        document.getElementById('Player_2').innerHTML = '0';

        resetBall(ball);
        resetPosition(player1, player2);

        // Store the current match players for reference
        tournament.currentPlayers = {
            player1: name1,
            player2: name2
        };
    }

    function updateBracketDisplay() {
        const container = document.getElementById('bracketContainer');
        container.innerHTML = '';

        // Display semi-finals matches
        const round1Div = document.createElement('div');
        round1Div.className = 'tournament-round';
        round1Div.innerHTML = '<h3>Semi-Finals</h3>';

        // Display first round/semi-final matches with winners highlighted
        tournament.matches.forEach((match, index) => {
            if (match.round === 1) {
                const matchDiv = document.createElement('div');
                matchDiv.className = 'match-pair';
                let matchText = `${match.player1} vs ${match.player2}`;

                // Highlight winner if there is one
                if (tournament.roundWinners[index]) {
                    matchText += ` (Winner: ${tournament.roundWinners[index]})`;
                }

                matchDiv.innerHTML = matchText;
                round1Div.appendChild(matchDiv);
            }
        });
        container.appendChild(round1Div);

        // Display finals if we have both semi-final winners
        if (tournament.roundWinners.length >= 2) {
            const finalsDiv = document.createElement('div');
            finalsDiv.className = 'tournament-round';
            finalsDiv.innerHTML = '<h3>Finals</h3>';

            // Create finals match display
            let finalsText = `${tournament.roundWinners[0]} vs ${tournament.roundWinners[1]}`;
            if (tournament.roundWinners.length === 3) {
                finalsText += ` (Winner: ${tournament.roundWinners[2]})`;
            }
            finalsDiv.innerHTML += `<div class="match-pair">${finalsText}</div>`;
            container.appendChild(finalsDiv);
        }

        // Display tournament champion if we have one
        if (tournament.roundWinners.length === 3) {
            const winnerDiv = document.createElement('div');
            winnerDiv.className = 'tournament-round';
            winnerDiv.innerHTML = '<h3>Tournament Champion</h3>';
            winnerDiv.innerHTML += `<div class="match-pair winner">${tournament.roundWinners[2]}</div>`;
            container.appendChild(winnerDiv);
        }
    }

    function showGameOver(winner, score) {
        isPaused = true;

        const gameOverScreen = document.getElementById('gameOver');
        const finalScore = document.getElementById('finalScore');
        const winnerText = document.getElementById('winnerText');
        const playAgainBtn = document.getElementById('playAgain');
        const returnToMenuBtn = document.getElementById('returnToMenu');
        const nextMatchBtn = document.getElementById('nextMatchBtn');

        // matchmakingStatus.style.display = 'none';
        // cancelMatchmakingBtn.style.display = 'none';
        if (tournament.isActive) {
            // resultSaved = false;
            playAgainBtn.style.display = 'none';
            returnToMenuBtn.style.display = 'none';
            nextMatchBtn.style.display = 'block';

            // Add winner to tournament progress
            const currentMatch = tournament.matches[tournament.currentMatchIndex];
            // Get the actual names currently displayed in the game
            const displayedPlayer1 = document.getElementById('Name1').textContent;
            const displayedPlayer2 = document.getElementById('Name2').textContent;
            const winnerName = winner === "Player 1" ? displayedPlayer1 : displayedPlayer2;
            tournament.roundWinners.push(winnerName);

            if (tournament.roundWinners.length === 2) {
                // Create final match
                tournament.matches.push({
                    round: 2,
                    player1: tournament.roundWinners[0],
                    player2: tournament.roundWinners[1]
                });
                winnerText.textContent = `${winnerName} wins this match!`;
                finalScore.innerHTML = `Finals Match:<br>${tournament.roundWinners[0]} vs ${tournament.roundWinners[1]}`;
                nextMatchBtn.textContent = 'Start Finals';
                if (!resultSaved) {
                    saveGameResult(winner);
                    resultSaved = true;
                }
            } else if (tournament.roundWinners.length === 3) {
                // Tournament is complete
                const championName = tournament.roundWinners[2]; // Use the actual winner name from roundWinners
                winnerText.textContent = `Tournament Champion: ${championName}`;
                finalScore.textContent = `Congratulations!`;
                nextMatchBtn.textContent = 'Return to Menu';
                if (!resultSaved) {
                    saveGameResult(winner);
                    resultSaved = true;
                }
                tournament.isActive = false;
            } else {
                // More matches to play
                tournament.currentMatchIndex++;
                const nextMatch = tournament.matches[tournament.currentMatchIndex];
                winnerText.textContent = `${winnerName} wins this match!`;
                finalScore.innerHTML = `Next Match:<br>${nextMatch.player1} vs ${nextMatch.player2}`;
                nextMatchBtn.textContent = 'Next Match';
                if (!resultSaved) {
                    saveGameResult(winner);
                    resultSaved = true;
                }
            }

            // Update the bracket display immediately after updating winners
            updateBracketDisplay();
        }
        // Matchmaking game ended
        else if (isMatchmaking) {
            // Determine display name based on player role and winner
            const displayWinner = (winner === "Player 1" && MatchmakingSystem.isPlayer1) || 
                                (winner === "Player 2" && !MatchmakingSystem.isPlayer1) ? 
                                "You" : "Opponent";

            winnerText.textContent = `${displayWinner} win!`;
            if (displayWinner === "You") {
                finalScore.textContent = `Congratulations!`;
            } else {
                finalScore.textContent = `Better luck next time!`;
            }

            if (!resultSaved) {
                saveGameResult(winner);
                resultSaved = true;
            }

            // Clean up WebSocket connections
            if (this.gameChannel) {
                this.gameChannel.close();
                this.gameChannel = null;
            }
            if (this.socket) {
                this.socket.close();
                this.socket = null;
            }

            // Reset game state
            this.isInQueue = false;
            this.isPlayer1 = false;
            isMatchmaking = false;

            nextMatchBtn.textContent = 'Return to Menu';
            nextMatchBtn.style.display = 'block';
            playAgainBtn.style.display = 'none';
            returnToMenuBtn.style.display = 'none';
        }else {
            // Regular game ended
            winnerText.textContent = `${winner} Wins!`;
            finalScore.textContent = `Final Score: ${score}`;
            playAgainBtn.style.display = 'block';
            returnToMenuBtn.style.display = 'block';
            nextMatchBtn.style.display = 'none';
        }
        
        gameOverScreen.style.display = 'flex';
        gameContainer.style.opacity = '0.5';

    }

    // matchmaking system ----------------------------------------------------------------

    // Get elements
    const matchmakingButton = document.getElementById("Matchmaking");
    const matchmakingStatus = document.getElementById("matchmakingStatus");
    const cancelMatchmakingBtn = document.getElementById("cancelMatchmaking");

    // Add lerp helper function for smooth interpolation
    function lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }

    // Matchmaking System
    const MatchmakingSystem = {
        socket: null,
        gameChannel: null,
        isInQueue: false,
        isPlayer1: false,

        connect() {
            return new Promise((resolve) => {
            this.socket = new WebSocket(`ws://${window.location.host}/ws/matchmaking/`);
            
            this.socket.onopen = () => {
                console.log("Connected to matchmaking server");
                matchmakingStatus.textContent = "Searching for opponent...";
                cancelMatchmakingBtn.style.display = "block"; // Show cancel button
                resolve(); // Resolve the promise when connection is established
            };
            
            this.socket.onclose = () => {
                console.log("Disconnected from matchmaking");
                matchmakingStatus.style.display = "none";
                cancelMatchmakingBtn.style.display = "none"; // Hide cancel button
                this.isInQueue = false;
            };
            
            this.socket.onerror = (error) => {
                console.error("WebSocket error:", error);
                matchmakingStatus.textContent = "Connection error. Please try again.";
                matchmakingStatus.style.display = "block";
            };
            
            this.socket.onmessage = (e) => {
                const data = JSON.parse(e.data);
                if (data.type === "match_found") {
                    console.log("Match found:", data);
                    this.startGame(data.room_name, data.role);
                }
            };
            });
        },

        cancelQueue() {
            if (this.socket?.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({
                    action: "leave_queue"
                }));
                this.socket.close();
                this.isInQueue = false;
                matchmakingStatus.style.display = "none";
                cancelMatchmakingBtn.style.display = "none";
                landingPage.style.display = "flex"; // Show landing page again
            }
        },

        startGame(room_name, role) {
            this.isInQueue = false;
            this.isPlayer1 = role === "player1";
            this.gameChannel = new WebSocket(`ws://${window.location.host}/ws/game/${room_name}/`);
            
            this.gameChannel.onopen = () => {
                console.log("Connected to game channel");
                matchmakingStatus.style.display = 'none';
                landingPage.style.display = 'none';
                cancelMatchmakingBtn.style.display = 'none';
                gameContainer.style.display = 'flex';
                
                // Initialize game state
                isMatchmaking = true;
                gameStarted = true;
                playerVSplayer = true;
                isGameOver = false;
                isPaused = false;
                resultSaved = false;
                
                // Reset scores and positions
                resetBall(ball);
                resetPosition(player1, player2);
                player1.score = 0;
                player2.score = 0;
                document.getElementById("Player_1").innerHTML = "0";
                document.getElementById("Player_2").innerHTML = "0";
                
                // Set player names
                document.getElementById("Name1").innerHTML = this.isPlayer1 ? "You" : "Opponent";
                document.getElementById("Name2").innerHTML = this.isPlayer1 ? "Opponent" : "You";
                
                // Start game loop for both players
                this.sendGameState();
            };

            this.gameChannel.onmessage = (e) => {
                const data = JSON.parse(e.data);
                if (data.type === 'game_state') {
                    this.updateGameState(data.state);
                } else if (data.type === 'player_left') {
                    this.handlePlayerLeave();
                }
            };

            // Handle player disconnection
            this.gameChannel.onclose = (e) => {
                // Only show game over if the game was actually in progress
                console.log("Game channel closed:", e);
                if (gameStarted && !isGameOver && !isPaused) {
                    this.handlePlayerLeave();
                } else {
                    // Just clean up the connections without showing game over
                    if (this.gameChannel) {
                        this.gameChannel.close();
                        this.gameChannel = null;
                    }
                    if (this.socket) {
                        this.socket.close();
                        this.socket = null;
                    }
                    
                    // Reset matchmaking states
                    this.isInQueue = false;
                    this.isPlayer1 = false;
                    isMatchmaking = false;
                }
            };

            this.gameChannel.onerror = (error) => {
                console.error("Game channel error:", error);
                this.handlePlayerLeave();
            };
        },

        handlePlayerLeave() {
            if (!isGameOver) {
                isGameOver = true;
                gameStarted = false;
                isPaused = true;
        
                // Determine the winner based on who left
                const winner = this.isPlayer1 ? "Player 1" : "Player 2";
                console.log(`${winner} wins! Opponent left the game.`);
        
                // Only save the game result for the player who didn't leave
                const wasDisconnected = this.gameChannel?.readyState !== WebSocket.OPEN;
                if (!wasDisconnected && !resultSaved) {
                    saveGameResult(winner);
                    resultSaved = true;
                }
        
                showGameOver(winner, this.isPlayer1 ? player1.score : player2.score);
                document.getElementById('gameContainer').style.opacity = '1';
                
                // Clean up WebSocket connections
                if (this.gameChannel) {
                    this.gameChannel.close();
                    this.gameChannel = null;
                }
                if (this.socket) {
                    this.socket.close();
                    this.socket = null;
                }
        
                // Reset game state
                this.isInQueue = false;
                this.isPlayer1 = false;
                isMatchmaking = false;
            }
        },

        sendGameState() {
            if (!gameStarted || isGameOver || isPaused) return;
            
            // Increase update rate to 120 updates/second (8.33ms)
            const UPDATE_INTERVAL = 8.33;
            
            if (!this.lastSend || Date.now() - this.lastSend >= UPDATE_INTERVAL) {
                if (this.gameChannel?.readyState === WebSocket.OPEN) {
                    const gameState = {
                        type: 'game_state',
                        state: {
                            player1Pos: player1.pos,
                            player2Pos: player2.pos,
                            ball: this.isPlayer1 ? {
                                pos: ball.pos,
                                speed: ball.speed
                            } : null
                        }
                    };
                    this.gameChannel.send(JSON.stringify(gameState));
                    this.lastSend = Date.now();
                }
            }
            requestAnimationFrame(() => this.sendGameState());
        },

        updateGameState(state) {
            if (!state) return;
            
            // Use a higher LERP_FACTOR for paddles to reduce lag
            const PADDLE_LERP_FACTOR = 0.9; // Increased from 0.8 to 0.9
            const BALL_LERP_FACTOR = 0.8;  // Keep ball smoothing at 0.8
            
            // Smooth paddle position updates
            if (state.player1Pos && !this.isPlayer1) { // Only update opponent's paddle
                player1.pos.y = lerp(player1.pos.y, state.player1Pos.y, PADDLE_LERP_FACTOR);
            }
            if (state.player2Pos && this.isPlayer1) { // Only update opponent's paddle
                player2.pos.y = lerp(player2.pos.y, state.player2Pos.y, PADDLE_LERP_FACTOR);
            }
            
            // Update ball state (only for player2)
            if (!this.isPlayer1 && state.ball) {
                ball.pos.x = lerp(ball.pos.x, state.ball.pos.x, BALL_LERP_FACTOR);
                ball.pos.y = lerp(ball.pos.y, state.ball.pos.y, BALL_LERP_FACTOR);
                ball.speed = state.ball.speed;
            }
        },

        joinQueue() {
            if (this.socket?.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({
                    action: "join_queue"
                }));
                this.isInQueue = true;
                matchmakingStatus.textContent = "Searching for opponent...";
                matchmakingStatus.style.display = "block";
            }
        }
    };

    // Handle matchmaking button click
    document.getElementById("Matchmaking").addEventListener("click", async () => {
        if (!MatchmakingSystem.socket || MatchmakingSystem.socket.readyState !== WebSocket.OPEN) {
            await MatchmakingSystem.connect(); // Wait for connection to establish
        }
        if (MatchmakingSystem.socket?.readyState === WebSocket.OPEN) {
            MatchmakingSystem.joinQueue();
        }
    });

    // Add window close handlers
    window.addEventListener('beforeunload', (e) => {
        if (isMatchmaking && !isGameOver) {
            // Force handlePlayerLeave to execute before window closes
            if (MatchmakingSystem.gameChannel) {
                MatchmakingSystem.gameChannel.send(JSON.stringify({
                    type: 'player_left'
                }));
            }
            MatchmakingSystem.handlePlayerLeave();
        }
    });

    // event listener for cancel button
    cancelMatchmakingBtn.addEventListener("click", () => {
        if (MatchmakingSystem.isInQueue) {
            MatchmakingSystem.cancelQueue();
        }
    });

}
