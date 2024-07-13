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
const powerUps = []; // Array for power-ups
let score = 0;
let lives = 3;
let gameInterval;
let ballInterval;
let bombInterval;
let powerUpInterval;
let isSlowdownActive = false;
let slowdownTimeout;

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
    // Draw the black circle for the bomb
    ctx.beginPath();
    ctx.arc(bomb.x, bomb.y, bomb.radius, 0, Math.PI * 2);
    ctx.fillStyle = bomb.color;
    ctx.fill();
    ctx.closePath();

    // Draw red spikes around the bomb
    const spikeCount = 8;
    const spikeLength = bomb.radius * 1.5;
    for (let i = 0; i < spikeCount; i++) {
      const angle = (i * Math.PI * 2) / spikeCount;
      const startX = bomb.x + bomb.radius * Math.cos(angle);
      const startY = bomb.y + bomb.radius * Math.sin(angle);
      const endX = bomb.x + (bomb.radius + spikeLength) * Math.cos(angle);
      const endY = bomb.y + (bomb.radius + spikeLength) * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = "red";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.closePath();
    }
  });
}

function drawPowerUps() {
  powerUps.forEach((powerUp) => {
    // Draw the power-up as a blue star
    ctx.beginPath();
    ctx.moveTo(powerUp.x, powerUp.y - powerUp.radius);
    for (let i = 1; i < 5; i++) {
      ctx.lineTo(
        powerUp.x + powerUp.radius * Math.cos((i * 4 * Math.PI) / 5),
        powerUp.y - powerUp.radius * Math.sin((i * 4 * Math.PI) / 5)
      );
    }
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
  });
}

function generatePowerUp() {
  const x = Math.random() * (canvas.width - 30) + 15;
  const radius = 15;
  const dy = 2;

  powerUps.push({ x, y: -radius, radius, dy });
}

function movePowerUps() {
  powerUps.forEach((powerUp, index) => {
    powerUp.y += powerUp.dy;

    if (
      powerUp.y + powerUp.radius > basket.y &&
      powerUp.y + powerUp.radius < basket.y + basket.height &&
      powerUp.x > basket.x &&
      powerUp.x < basket.x + basket.width
    ) {
      powerUps.splice(index, 1);
      activateSlowdown();
    } else if (powerUp.y - powerUp.radius > canvas.height) {
      powerUps.splice(index, 1);
    }
  });
}

function activateSlowdown() {
  if (isSlowdownActive) {
    clearTimeout(slowdownTimeout);
  } else {
    isSlowdownActive = true;
    basket.speed /= 2;
  }

  slowdownTimeout = setTimeout(() => {
    isSlowdownActive = false;
    basket.speed *= 2;
  }, 5000); // Slow down for 5 seconds
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

      // Increase basket size every 5 points
      if (score % 5 === 0) {
        basket.width += 10;
      }
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
              radius: ball.radius,
              dx: (ball.dx + otherBall.dx) / 2,
              dy: (ball.dy + otherBall.dy) / 2,
              color: newColor,
            });
          }
        }
      }
    }
  });
}

function generateBall() {
  const x = Math.random() * (canvas.width - 30) + 15;
  const radius = 15;
  const dy = 2;

  balls.push({ x, y: -radius, radius, dy, color: getRandomColor() });
}

function generateBomb() {
  const x = Math.random() * (canvas.width - 30) + 15;
  const radius = 15;
  const dy = 2;

  bombs.push({ x, y: -radius, radius, dy, color: "black" });
}

function getRandomColor() {
  const colors = ["red", "blue", "yellow"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function mixColors(color1, color2) {
  const primaryColors = ["red", "blue", "yellow"];
  const secondaryColors = {
    "red,blue": "purple",
    "blue,red": "purple",
    "red,yellow": "orange",
    "yellow,red": "orange",
    "blue,yellow": "green",
    "yellow,blue": "green",
  };

  if (primaryColors.includes(color1) && primaryColors.includes(color2)) {
    return secondaryColors[`${color1},${color2}`] || null;
  }

  return null;
}

function update() {
  if (isSlowdownActive) {
    basket.speed /= 2;
    balls.forEach((ball) => (ball.dy /= 2));
    bombs.forEach((bomb) => (bomb.dy /= 2));
  } else {
    basket.speed *= 2;
    balls.forEach((ball) => (ball.dy *= 2));
    bombs.forEach((bomb) => (bomb.dy *= 2));
  }

  moveBasket();
  moveBalls();
  moveBombs();
  movePowerUps();
  moveCaughtBalls();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBasket();
  drawBalls();
  drawBombs();
  drawPowerUps();
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(ballInterval);
  clearInterval(bombInterval);
  clearInterval(powerUpInterval);
  alert("Game Over!");
}

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

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

gameInterval = setInterval(update, 1000 / 60);
ballInterval = setInterval(generateBall, 2000);
bombInterval = setInterval(generateBomb, 5000);
powerUpInterval = setInterval(generatePowerUp, 10000);
