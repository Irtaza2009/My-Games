const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const MAX_CANVAS_WIDTH = 600; // Maximum width for larger screens
const MAX_CANVAS_HEIGHT = 800; // Maximum height for larger screens

function resizeCanvas() {
  const viewportWidth = window.innerWidth;
  const viewportHeight =
    window.innerHeight - document.querySelector(".ui-container").offsetHeight;

  canvasWidth = Math.min(viewportWidth, MAX_CANVAS_WIDTH);
  canvasHeight = Math.min(viewportHeight, MAX_CANVAS_HEIGHT);

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  basket.y = canvas.height - basket.height - 70;

  // Adjust the position of caught balls to fit new dimensions
  basket.caughtBalls.forEach((ball) => {
    ball.x = Math.min(ball.x, canvas.width - ball.radius);
    ball.y = Math.min(ball.y, canvas.height - ball.radius);
  });
}

canvas.width = MAX_CANVAS_WIDTH;
canvas.height = MAX_CANVAS_HEIGHT;

const basket = {
  x: canvas.width / 2 - 100,
  y: canvas.height - 105,
  width: 150,
  height: 100,
  dx: 0,
  speed: 7,
  caughtBalls: [], // Add container for caught balls
};

const balls = [];
const bombs = [];
let score = 0;
let lives = 3;
let gameInterval;
let ballInterval;
let bombInterval;

const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");

function drawBasket() {
  // Draw basket-like structure
  ctx.fillStyle = "#8b4513"; // Basket color

  // Draw bottom of the basket
  ctx.fillRect(basket.x, basket.y + basket.height - 10, basket.width, 10);

  // Draw left side of the basket
  ctx.fillRect(basket.x, basket.y, 10, basket.height);

  // Draw right side of the basket
  ctx.fillRect(basket.x + basket.width - 10, basket.y, 10, basket.height);

  drawCaughtBalls();
}

function drawBalls() {
  balls.forEach((ball) => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
  });
}

function drawCaughtBalls() {
  basket.caughtBalls.forEach((ball) => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
  });
}

function drawBombs() {
  bombs.forEach((bomb) => {
    ctx.beginPath();
    ctx.arc(bomb.x, bomb.y, bomb.radius, 0, Math.PI * 2);
    ctx.fillStyle = bomb.color;
    ctx.fill();
    ctx.closePath();
  });
}

function moveBasket() {
  basket.x += basket.dx;

  if (basket.x < 0) {
    basket.x = 0;
  }

  if (basket.x + basket.width > canvas.width) {
    basket.x = canvas.width - basket.width;
  }
}

function moveBalls() {
  balls.forEach((ball, index) => {
    ball.y += ball.dy;

    if (
      ball.y + ball.radius > basket.y &&
      ball.y + ball.radius < basket.y + basket.height &&
      ball.x > basket.x &&
      ball.x < basket.x + basket.width
    ) {
      balls.splice(index, 1);
      score++;
      scoreElement.textContent = `Score: ${score}`;
      ball.dx = (Math.random() - 0.5) * 2; // Add horizontal movement
      ball.dy = -Math.abs(ball.dy) * 0.5; // Bounce up with half speed
      basket.caughtBalls.push(ball);
    } else if (ball.y + ball.radius > canvas.height) {
      balls.splice(index, 1);
      lives--;
      livesElement.textContent = `Lives: ${lives}`;

      if (lives <= 0) {
        endGame();
      }
    }
  });
}

function moveCaughtBalls() {
  basket.caughtBalls.forEach((ball, index) => {
    ball.dy += 0.1; // Gravity
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Collision with basket bottom
    if (ball.y + ball.radius > basket.y + basket.height - 10) {
      ball.y = basket.y + basket.height - 10 - ball.radius;
      ball.dy *= -0.3; // Bounce with dampening
      if (Math.abs(ball.dy) < 0.5) ball.dy = 0; // Stop bouncing if very slow
    }

    // Collision with basket sides
    if (ball.x - ball.radius < basket.x + 10) {
      ball.x = basket.x + 10 + ball.radius;
      ball.dx *= -0.3;
    } else if (ball.x + ball.radius > basket.x + basket.width - 10) {
      ball.x = basket.x + basket.width - 10 - ball.radius;
      ball.dx *= -0.3;
    }

    // Check for collisions with other balls
    for (let i = 0; i < basket.caughtBalls.length; i++) {
      if (i !== index) {
        const otherBall = basket.caughtBalls[i];
        const dx = ball.x - otherBall.x;
        const dy = ball.y - otherBall.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDist = ball.radius + otherBall.radius;


    // Collision with basket bottom
    if (ball.y + ball.radius > basket.y + basket.height - 10) {
      ball.y = basket.y + basket.height - 10 - ball.radius;
      ball.dy *= -0.3; // Bounce with dampening
      if (Math.abs(ball.dy) < 0.5) ball.dy = 0; // Stop bouncing if very slow
    }

    // Collision with basket sides
    if (ball.x - ball.radius < basket.x + 10) {
      ball.x = basket.x + 10 + ball.radius;
      ball.dx *= -0.3;
    } else if (ball.x + ball.radius > basket.x + basket.width - 10) {
      ball.x = basket.x + basket.width - 10 - ball.radius;
      ball.dx *= -0.3;
    }

    // Check for collisions with other balls
    for (let i = 0; i < basket.caughtBalls.length; i++) {
      if (i !== index) {
        const otherBall = basket.caughtBalls[i];
        const dx = ball.x - otherBall.x;
        const dy = ball.y - otherBall.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDist = ball.radius + otherBall.radius;

    // Collision with basket bottom
    if (ball.y + ball.radius > basket.y + basket.height - 10) {
      ball.y = basket.y + basket.height - 10 - ball.radius;
      ball.dy *= -0.3; // Bounce with dampening
      if (Math.abs(ball.dy) < 0.5) ball.dy = 0; // Stop bouncing if very slow
    }

    // Collision with basket sides
    if (ball.x - ball.radius < basket.x + 10) {
      ball.x = basket.x + 10 + ball.radius;
      ball.dx *= -0.3;
    } else if (ball.x + ball.radius > basket.x + basket.width - 10) {
      ball.x = basket.x + basket.width - 10 - ball.radius;
      ball.dx *= -0.3;
    }

    // Check for collisions with other balls
    for (let i = 0; i < basket.caughtBalls.length; i++) {
      if (i !== index) {
        const otherBall = basket.caughtBalls[i];
        const dx = ball.x - otherBall.x;
        const dy = ball.y - otherBall.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDist = ball.radius + otherBall.radius;

        if (distance < minDist) {
          // Adjust positions to prevent overlap
          const angle = Math.atan2(dy, dx);
          const overlap = (minDist - distance) / 2;
          ball.x += Math.cos(angle) * overlap;
          ball.y += Math.sin(angle) * overlap;
          otherBall.x -= Math.cos(angle) * overlap;
          otherBall.y -= Math.sin(angle) * overlap;

          // Adjust velocities to simulate bounce
          const tempDx = ball.dx;
          const tempDy = ball.dy;
          ball.dx = otherBall.dx;
          ball.dy = otherBall.dy;
          otherBall.dx = tempDx;
          otherBall.dy = tempDy;

          // Combine balls if they are primary colors
          const newColor = mixColors(ball.color, otherBall.color);
          if (newColor) {
            // Remove the two balls
            basket.caughtBalls.splice(i, 1);
            basket.caughtBalls.splice(index, 1);
            // Add a new combined ball
            basket.caughtBalls.push({
              x: (ball.x + otherBall.x) / 2,
              y: (ball.y + otherBall.y) / 2,
              radius: ball.radius * 1.5, // Larger radius for secondary colors
              color: newColor,
              dx: (ball.dx + otherBall.dx) / 2,
              dy: (ball.dy + otherBall.dy) / 2,
            });
            break; // Exit the inner loop after merging
          }
        }
      }
    }
  });
}

function mixColors(color1, color2) {
  const primaryColors = {
    red: [255, 0, 0],
    yellow: [255, 255, 0],
    blue: [0, 0, 255],
  };

  const getRGB = (color) => primaryColors[color];

  const rgb1 = getRGB(color1);
  const rgb2 = getRGB(color2);

  if (!rgb1 || !rgb2 || color1 === color2) return null; // Only mix different primary colors

  const mixedRGB = [
    Math.min((rgb1[0] + rgb2[0]) / 2, 255),
    Math.min((rgb1[1] + rgb2[1]) / 2, 255),
    Math.min((rgb1[2] + rgb2[2]) / 2, 255),
  ];

  const colorMap = {
    "255,128,0": "orange", // Red + Yellow
    "128,128,0": "olive", // Yellow + Blue
    "128,0,128": "purple", // Red + Blue
  };

  return colorMap[mixedRGB.join(",")] || null;
}

function moveBombs() {
  bombs.forEach((bomb, index) => {
    bomb.y += bomb.dy;

    if (
      bomb.y + bomb.radius > basket.y &&
      bomb.y + bomb.radius < basket.y + basket.height &&
      bomb.x > basket.x &&
      bomb.x < basket.x + basket.width
    ) {
      bombs.splice(index, 1);
      lives--;
      livesElement.textContent = `Lives: ${lives}`;

      if (lives <= 0) {
        endGame();
      }
    } else if (bomb.y + bomb.radius > canvas.height) {
      bombs.splice(index, 1);
    }
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBasket();
  drawBalls();
  drawBombs();
}

function update() {
  moveBasket();
  moveBalls();
  moveBombs();
  moveCaughtBalls();
  draw();
}

function startGame() {
  balls.length = 0; // Clear balls array
  bombs.length = 0; // Clear bombs array
  basket.caughtBalls.length = 0; // Clear caught balls array
  score = 0;
  lives = 3;
  scoreElement.textContent = `Score: ${score}`;
  livesElement.textContent = `Lives: ${lives}`;

  gameInterval = setInterval(update, 1000 / 60);
  ballInterval = setInterval(() => {
    const radius = Math.random() * 20 + 10;
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const dy = Math.random() * 2 + 1;
    const colors = ["red", "yellow", "blue"];
    const color = colors[Math.floor(Math.random() * colors.length)];

    balls.push({ x, y: -radius, radius, color, dy, dx: 0 });
  }, 1000);

  bombInterval = setInterval(() => {
    const radius = Math.random() * 15 + 10;
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const dy = Math.random() * 2 + 2;

    bombs.push({ x, y: -radius, radius, color: "black", dy });
  }, 3000);

  // Hide the title screen and show the game elements
  document.getElementById("titleScreen").style.display = "none";
  document.querySelector(".ui-container").style.display = "flex";
  document.querySelector(".game-container").style.display = "flex";
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(ballInterval);
  clearInterval(bombInterval);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Create and show the game over text
  const gameOverText = document.createElement("div");
  gameOverText.className = "gameover-text"; // Add class for styling
  gameOverText.innerHTML = `
      <p>Game Over</p>
      <p>Final Score: ${score}</p>
  `;
  document.body.appendChild(gameOverText);

  // Position the game over text
  gameOverText.style.top = `${canvas.offsetTop + canvas.height / 2 - 50}px`;
  gameOverText.style.left = `${
    canvas.offsetLeft + canvas.width / 2 - gameOverText.offsetWidth / 2
  }px`;

  // Create and show the restart button
  const restartButton = document.createElement("button");
  restartButton.innerHTML = '<i class="fas fa-redo"></i>Restart';
  restartButton.className = "restart-button"; // Add class for styling
  restartButton.onclick = () => {
    gameOverText.remove(); // Remove game over text
    restartButton.remove(); // Remove button after clicking
    startGame();
  };
  document.body.appendChild(restartButton);

  // Position the restart button below the game over text
  restartButton.style.top = `${canvas.offsetTop + canvas.height / 2 + 40}px`;
  restartButton.style.left = `${
    canvas.offsetLeft + canvas.width / 2 - restartButton.offsetWidth / 2
  }px`;
}

document.getElementById("playButton").onclick = startGame;
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a") {
    basket.dx = -basket.speed;
  } else if (e.key === "ArrowRight" || e.key === "d") {
    basket.dx = basket.speed;
  }
});

document.addEventListener("keyup", (e) => {
  if (
    e.key === "ArrowLeft" ||
    e.key === "a" ||
    e.key === "ArrowRight" ||
    e.key === "d"
  ) {
    basket.dx = 0;
  }
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
