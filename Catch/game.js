const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const basket = {
  x: canvas.width / 2 - 50,
  y: canvas.height - 30,
  width: 100,
  height: 20,
  dx: 0,
  speed: 7,
};

const balls = [];
let score = 0;
let lives = 3;
let gameInterval;
let ballInterval;

const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");

function drawBasket() {
  ctx.fillStyle = "#FFB6C1";
  ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
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
      scoreElement.textContent = score;
    } else if (ball.y + ball.radius > canvas.height) {
      balls.splice(index, 1);
      lives--;
      livesElement.textContent = lives;

      if (lives <= 0) {
        endGame();
      }
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

function drawScore() {
  ctx.font = "20px CozyFont";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Score: ${score}`, 8, 20);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBasket();
  drawBalls();
  moveBasket();
  moveBalls();
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
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(ballInterval);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "30px CozyFont";
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

startGame();
