const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
console.log(ctx);

ctx.imageSmoothingEnabled = false; // Disable image smoothing

const landingPage = document.getElementById('landingPage');
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

// const line = document.getElementById("line");

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
	keysPressed[e.keyCode] = true;
});

window.addEventListener('keyup', function(e) {
	keysPressed[e.keyCode] = false;
});

function vector(x, y) 
{
	return { x: x, y: y };
}


document.querySelectorAll("button").forEach(button => {
	QuitMenu.addEventListener('click', () => {
		// Try different approaches to close the window
		if (window.opener) {
			window.close();
		} else {
			window.location.href = 'about:blank';
			window.close();
		}
	});
	Quit.addEventListener("click", () => {
		// Try different approaches to close the window
		if (window.opener) {
			window.close();
		} else {
			window.location.href = 'about:blank';
			window.close();
		}
	});
	Player_vs_BOT.addEventListener('click', () => {
		landingPage.style.display = 'none';
		gameContainer.style.display = 'flex';
		gameStarted = true;
		playerVSbot = true;
	});
	Player_vs_Player.addEventListener('click', () => {
		landingPage.style.display = 'none';
		gameContainer.style.display = 'flex';
		gameStarted = true;
		playerVSplayer = true;
	});
	Multiplayer.addEventListener('click', () => {
		landingPage.style.display = 'none';
		gameContainer.style.display = 'flex';
		document.getElementById("Player_3").style.display = 'block';
		document.getElementById("Player_4").style.display = 'block';
		document.getElementById("Name3").style.display = 'block';
		document.getElementById("Name4").style.display = 'block';
		gameStarted = true;
		multiplayer = true;
	});
	Restart.addEventListener("click", () => {
		resetBall(ball);
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
	});
	Menu.addEventListener("click", () => {
		Restart.click();
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

function Ball(pos, radius, speed) {
    this.pos = pos;
    this.radius = radius;
    this.speed = speed;

    let borderSegmentHeight = canvas.height / 7;
    const borderWidth = 20;

    const BASE_SPEED_RATIO = 0.01; // Speed is 10% of the canvas width/height

    this.update = function () {
        // Bounce on top and bottom
        if (this.pos.y + this.radius > canvas.height || this.pos.y - this.radius < 0) {
            this.speed.y = -this.speed.y;
        }

        // Bounce on the left border segments
        if (
            this.pos.x - this.radius < borderWidth &&
            (this.pos.y < borderSegmentHeight || this.pos.y > canvas.height - borderSegmentHeight)
        ) {
            this.speed.x = -this.speed.x;
        }

        // Bounce on the right border segments
        if (
            this.pos.x + this.radius > canvas.width - borderWidth &&
            (this.pos.y < borderSegmentHeight || this.pos.y > canvas.height - borderSegmentHeight)
        ) {
            this.speed.x = -this.speed.x;
        }

        this.pos.x += this.speed.x;
        this.pos.y += this.speed.y;
    };
	this.update2 = function () {
		const borderSegmentHeight = canvas.height / 4; // Match the goal size
		const borderSegmentWidth = canvas.width / 3;   // Match the goal size
		const borderWidth = 20;
	
		// Bounce on the left border segments
		if (
			this.pos.x - this.radius < borderWidth &&
			(this.pos.y < borderSegmentHeight || this.pos.y > canvas.height - borderSegmentHeight)
		) {
			this.speed.x = -this.speed.x;
				this.pos.x = borderWidth + this.radius; // Prevent sticking
		}
	
		// Bounce on the right border segments
		if (
			this.pos.x + this.radius > canvas.width - borderWidth &&
			(this.pos.y < borderSegmentHeight || this.pos.y > canvas.height - borderSegmentHeight)
		) {
			this.speed.x = -this.speed.x;
				this.pos.x = canvas.width - borderWidth - this.radius; // Prevent sticking
		}
	
		// Bounce on the top border segments
		if (
			this.pos.y - this.radius < borderWidth &&
			(this.pos.x < borderSegmentWidth || this.pos.x > canvas.width - borderSegmentWidth)
		) {
			this.speed.y = -this.speed.y;
				this.pos.y = borderWidth + this.radius; // Prevent sticking
			}
	
		// Bounce on the bottom border segments
		if (
			this.pos.y + this.radius > canvas.height - borderWidth &&
			(this.pos.x < borderSegmentWidth || this.pos.x > canvas.width - borderSegmentWidth)
		) {
			this.speed.y = -this.speed.y;
				this.pos.y = canvas.height - borderWidth - this.radius; // Prevent sticking
		}
	
		// Update ball position
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

function resetBall(ball) {
    const StartSpeed = baseSpeedX;  // Reduce this to slow down the ball on start
    const randomDirection = Math.random() < 0.5 ? -1 : 1;

    lastHit = null;
    ball.pos.x = canvas.width / 2;
    ball.pos.y = (Math.random() * (canvas.height - 200)) + 100;

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
    player4.pos = vector(canvas.width / 2 - 20 - playerHeight / 2, canvas.height - playerWidth - 20);
}

function resetPosition(player1, player2) {
    player1.pos = vector(20, canvas.height / 2 - playerHeight / 2);
    player2.pos = vector(canvas.width - 20 - playerWidth, canvas.height / 2 - playerHeight / 2);
}

function showGameOver(winner, score) {
    const gameOverScreen = document.getElementById('gameOver');
    const finalScore = document.getElementById('finalScore');
    const winnerText = document.getElementById('winnerText');
    
    isGameOver = true;
    winnerText.textContent = `${winner} Wins!`;
    finalScore.textContent = `Final Score: ${score}`;
    gameOverScreen.style.display = 'flex';
    gameContainer.style.opacity = '0.5';
}

document.getElementById('playAgain').addEventListener('click', () => {
    document.getElementById('gameOver').style.display = 'none';
    gameContainer.style.opacity = '1';
    isGameOver = false;
    Restart.click();
});

document.getElementById('returnToMenu').addEventListener('click', () => {
    document.getElementById('gameOver').style.display = 'none';
    gameContainer.style.opacity = '1';
    isGameOver = false;
    Menu.click();
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

function Score(ball, player1, player2) {

    if (player1.score === 10) {
        gameOver("Player 1");
        return; 
    }

    if (player2.score === 10) {
        gameOver("Player 2");
        return;
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


function Score2(ball, player1, player2, player3, player4)
{
	
	if (player1.score === 5) {
		gameover_2("Player 1");
        return;
    }

	if (player2.score === 5) {
		gameover_2("Player 2");
		return;
	}
	if (player3.score === 5) {
		gameover_2("Player 3");
            return;
        }
	if (player4.score === 5) {
		gameover_2("Player 4");
		return;
	}
	if (ball.pos.y <= -ball.radius || ball.pos.y >= canvas.height + ball.radius || ball.pos.x <= -ball.radius || ball.pos.x >= canvas.width + ball.radius)
	{
		console.log(lastHit);
		
		if (lastHit === "Player_1" && !(ball.pos.x <= -ball.radius)) {
			player1.score += 1;
			document.getElementById("Player_1").innerHTML = player1.score;
			resetBall(ball);
		}
		if (lastHit === "Player_3" && !(ball.pos.y <= -ball.radius)) {
			player3.score += 1;
			document.getElementById("Player_3").innerHTML = player3.score;
            resetBall(ball);
		}
		if (lastHit === "Player_2" && !(ball.pos.x >= canvas.width + ball.radius)) {
			player2.score += 1;
			document.getElementById("Player_2").innerHTML = player2.score;
			resetBall(ball);
		}
		if (lastHit === "Player_4" && !(ball.pos.y >= canvas.height + ball.radius)) {
			player4.score += 1;
			document.getElementById("Player_4").innerHTML = player4.score;
			resetBall(ball);
		}
		if (lastHit === null) {
			resetBall(ball);
        }
    }
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
                player.pos.y += Math.sign(distance) * (player.speed * 0.8); // Slightly slower than player speed
            }
        } else {
            // Return to center when ball is moving away
            const centerY = canvas.height / 2 - player.height / 2;
            player.pos.y += Math.sign(centerY - player.pos.y) * (player.speed * 0.4); // Even slower return to center
        }
    }

    // Ensure player stays within bounds
    player.pos.y = Math.max(
        canvas.height / 10,
        Math.min(canvas.height - canvas.height / 10 - player.height, player.pos.y)
    );
}

function playerCollision(ball, player, name) {
    let dx = Math.abs(ball.pos.x - player.getcenter().x);
    let dy = Math.abs(ball.pos.y - player.getcenter().y);

    if (dx < (ball.radius + player.getHalfWidth()) && dy < (ball.radius + player.getHalfHeight())) {
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

function saveGameStats(score, opponent, gameMode, won) {
	const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
	fetch('/save-stats/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'X-CSRFToken': csrfToken
		},
		body: `score=${score}&opponent=${opponent}&game_mode=${gameMode}&won=${won}`
	});
}

function loop()
{
	// ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    // ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    requestAnimationFrame(loop);
    if (!gameStarted || isGameOver) {
        return;
    }
    
    update();
    drawgame();

}

loop();
