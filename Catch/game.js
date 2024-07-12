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

  basket.y = canvas.height - basket.height - 10;

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

            // Add new combined ball
            const newRadius = Math.max(ball.radius, otherBall.radius) + 5;
            const newBall = {
              x: (ball.x + otherBall.x) / 2,
              y: (ball.y + otherBall.y) / 2,
              dx: (ball.dx + otherBall.dx) / 2,
              dy: (ball.dy + otherBall.dy) / 2,
              radius: newRadius,
              color: newColor,
            };
            basket.caughtBalls.push(newBall);
            score += 10; // Additional score for combining balls
            scoreElement.textContent = `Score: ${score}`;
          }
        }
      }
    }
  });
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
      endGame();
    } else if (bomb.y + bomb.radius > canvas.height) {
      bombs.splice(index, 1);
    }
  });
}

// Predefined primary and secondary cozy colors
const primaryColors = {
  red: "#FFC0CB", // Cozy Pinkish Red
  yellow: "#FFDEAD", // Cozy Yellowish
  blue: "#ADD8E6", // Cozy Light Blue
  green: "#98FB98", // Cozy Pale Green
};

const secondaryColors = {
  orange: "#FFDAB9", // Cozy Peach
  purple: "#DDA0DD", // Cozy Plum
  teal: "#AFEEEE", // Cozy Pale Blue
  pink: "#FFB6C1", // Cozy Light Pink
};

function mixColors(color1, color2) {
  if (
    (color1 === primaryColors.red && color2 === primaryColors.yellow) ||
    (color1 === primaryColors.yellow && color2 === primaryColors.red)
  ) {
    return secondaryColors.orange;
  } else if (
    (color1 === primaryColors.yellow && color2 === primaryColors.blue) ||
    (color1 === primaryColors.blue && color2 === primaryColors.yellow)
  ) {
    return secondaryColors.green;
  } else if (
    (color1 === primaryColors.red && color2 === primaryColors.blue) ||
    (color1 === primaryColors.blue && color2 === primaryColors.red)
  ) {
    return secondaryColors.purple;
  } else if (
    (color1 === primaryColors.red && color2 === primaryColors.green) ||
    (color1 === primaryColors.green && color2 === primaryColors.red)
  ) {
    return secondaryColors.pink;
  } else if (
    (color1 === primaryColors.yellow && color2 === primaryColors.green) ||
    (color1 === primaryColors.green && color2 === primaryColors.yellow)
  ) {
    return secondaryColors.teal;
  } else {
    return null; // No valid combination
  }
}

function addBall() {
  const x = Math.random() * (canvas.width - 20) + 10;
  const y = 10;
  const dx = (Math.random() - 0.5) * 2; // Random horizontal movement
  const dy = Math.random() * 2 + 1; // Random vertical speed
  const radius = Math.random() * 10 + 5; // Random radius for primary colors
  const colors = Object.values(primaryColors);
  const color = colors[Math.floor(Math.random() * colors.length)];
  balls.push({ x, y, dx, dy, radius, color });
}

function addBomb() {
  const x = Math.random() * (canvas.width - 20) + 10;
  const y = 10;
  const dy = Math.random() * 2 + 1;
  const radius = 15; // Bomb size
  const color = "black";
  bombs.push({ x, y, dy, radius, color });
}

function drawScore() {
  ctx.font = "20px Agbalumo";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Score: ${score}`, 8, 20);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBasket();
  drawBalls();
  drawBombs();
  moveBasket();
  moveBalls();
  moveCaughtBalls();
  moveBombs();
}

function keyDown(e) {
  if (e.key === "ArrowRight" || e.key === "Right") {
    basket.dx = basket.speed;
  } else if (e.key === "ArrowLeft" || e.key === "Left") {
    basket.dx = -basket.speed;
  }
}

function keyUp(e) {
  if (
    e.key === "ArrowRight" ||
    e.key === "Right" ||
    e.key === "ArrowLeft" ||
    e.key === "Left"
  ) {
    basket.dx = 0;
  }
}

function startGame() {
  gameInterval = setInterval(update, 20);
  ballInterval = setInterval(addBall, 2000); // Slower ball spawn rate
  bombInterval = setInterval(addBomb, 5000); // Bombs spawn every 5 seconds
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(ballInterval);
  clearInterval(bombInterval);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "30px Agbalumo";
  ctx.fillStyle = "red";
  ctx.fillText("Game Over", canvas.width / 2 - 75, canvas.height / 2);
  ctx.fillText(
    `Final Score: ${score}`,
    canvas.width / 2 - 100,
    canvas.height / 2 + 40
  );
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
window.addEventListener("resize", resizeCanvas);

startGame();
resizeCanvas();
