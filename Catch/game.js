const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let canvasWidth = window.innerWidth;
let canvasHeight =
  window.innerHeight - document.querySelector(".ui-container").offsetHeight;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Commenting out the basket image
// const basketImg = new Image();
// basketImg.src = "basket.png"; // Replace with the correct path to your basket image

const basket = {
  x: canvas.width / 2 - 100,
  y: canvas.height - 105,
  width: 150,
  height: 100, // Adjust to match your image size
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
  basket.caughtBalls.forEach((ball) => {
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

function addBall() {
  const x = Math.random() * (canvas.width - 20) + 10;
  const y = 10;
  const dy = Math.random() * 2 + 1;
  const radius = Math.random() * 15 + 5;
  const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
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
  ballInterval = setInterval(addBall, 1000);
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

function resizeCanvas() {
  canvasWidth = window.innerWidth;
  canvasHeight =
    window.innerHeight - document.querySelector(".ui-container").offsetHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  basket.y = canvas.height - 30;
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
window.addEventListener("resize", resizeCanvas);

// Commenting out the basket image loading
// basketImg.onload = startGame;
startGame();
