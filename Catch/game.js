const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const initialCanvasWidth = 800;
const initialCanvasHeight = 600;
let canvasWidth =
  window.innerWidth < initialCanvasWidth
    ? window.innerWidth
    : initialCanvasWidth;
let canvasHeight =
  window.innerHeight < initialCanvasHeight
    ? window.innerHeight
    : initialCanvasHeight;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

const basket = {
  x: canvas.width / 2 - 75,
  y: canvas.height - 105,
  width: 150,
  height: 100, // Adjust to match your image size
  dx: 0,
  speed: 7,
};

const balls = [];
const bombs = [];
let score = 0;
let lives = 3;
let gameInterval;
let ballInterval;
let bombInterval;
let slowdownInterval;
let powerUps = [];

const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");

function drawBasket() {
  ctx.fillStyle = "#8b4513";
  ctx.fillRect(basket.x, basket.y, basket.width, 20); // Bottom
  ctx.fillRect(basket.x, basket.y, 20, basket.height); // Left
  ctx.fillRect(basket.x + basket.width - 20, basket.y, 20, basket.height); // Right
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

function drawBombs() {
  bombs.forEach((bomb) => {
    ctx.beginPath();
    ctx.arc(bomb.x, bomb.y, bomb.radius, 0, Math.PI * 2);
    ctx.fillStyle = bomb.color;
    ctx.fill();
    ctx.closePath();
  });
}

function drawPowerUps() {
  powerUps.forEach((powerUp) => {
    ctx.beginPath();
    ctx.arc(powerUp.x, powerUp.y, powerUp.radius, 0, Math.PI * 2);
    ctx.fillStyle = powerUp.color;
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

function movePowerUps() {
  powerUps.forEach((powerUp, index) => {
    powerUp.y += powerUp.dy;

    if (
      powerUp.y + powerUp.radius > basket.y &&
      powerUp.y + powerUp.radius < basket.y + basket.height &&
      powerUp.x > basket.x &&
      powerUp.x < basket.x + basket.width
    ) {
      applyPowerUp(powerUp.type);
      powerUps.splice(index, 1);
    } else if (powerUp.y + powerUp.radius > canvas.height) {
      powerUps.splice(index, 1);
    }
  });
}

function addBall() {
  const x = Math.random() * (canvas.width - 20) + 10;
  const y = 10;
  const dy = Math.random() * 2 + 1;
  const radius = 10;
  const colors = ["#FFB6C1", "#FFD700", "#ADD8E6"]; // Cozy primary colors: light pink, gold, light blue
  const color = colors[Math.floor(Math.random() * colors.length)];
  balls.push({ x, y, dy, radius, color });
}

function addBomb() {
  const x = Math.random() * (canvas.width - 20) + 10;
  const y = 10;
  const dy = Math.random() * 2 + 1;
  const radius = 15; // Bomb size
  const color = "black";
  bombs.push({ x, y, dy, radius, color });
}

function addPowerUp(type) {
  const x = Math.random() * (canvas.width - 20) + 10;
  const y = 10;
  const dy = Math.random() * 2 + 1;
  const radius = 10;
  const color = type === "slowdown" ? "#87CEFA" : "#00FA9A"; // Light blue for slowdown, spring green for multicolor
  powerUps.push({ x, y, dy, radius, color, type });
}

function applyPowerUp(type) {
  if (type === "slowdown") {
    balls.forEach((ball) => (ball.dy /= 2));
    bombs.forEach((bomb) => (bomb.dy /= 2));
    setTimeout(() => {
      balls.forEach((ball) => (ball.dy *= 2));
      bombs.forEach((bomb) => (bomb.dy *= 2));
    }, 5000); // Slow down for 5 seconds
  } else if (type === "multicolor") {
    // Implement multicolor effect here
  }
}

function upgradeBasket() {
  if (score >= 10 && score < 20) {
    basket.width = 200;
  } else if (score >= 20) {
    basket.width = 250;
  }
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
  drawPowerUps();
  moveBasket();
  moveBalls();
  moveBombs();
  movePowerUps();
  upgradeBasket();
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
  ballInterval = setInterval(addBall, 1500); // Slower ball spawning rate
  bombInterval = setInterval(addBomb, 5000); // Bombs spawn every 5 seconds
  slowdownInterval = setInterval(() => addPowerUp("slowdown"), 15000); // Slowdown power-up every 15 seconds
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(ballInterval);
  clearInterval(bombInterval);
  clearInterval(slowdownInterval);
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

function resizeCanvas() {
  canvasWidth =
    window.innerWidth < initialCanvasWidth
      ? window.innerWidth
      : initialCanvasWidth;
  canvasHeight =
    window.innerHeight < initialCanvasHeight
      ? window.innerHeight
      : initialCanvasHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  basket.y = canvas.height - 30;
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
window.addEventListener("resize", resizeCanvas);

startGame();
