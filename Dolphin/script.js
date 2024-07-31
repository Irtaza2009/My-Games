const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

const dolphinImage = new Image();
dolphinImage.src = "dolphin.png";

let score = 0;
let balls = [];
let dolphin = {
  x: canvas.width / 2,
  y: canvas.height / 2 + 50,
  width: 100,
  height: 100 * (dolphinImage.height / dolphinImage.width),
  dx: 0,
  dy: 0,
  speed: 5,
  jumpSpeed: -10,
  gravity: 0.5,
  isJumping: false,
  isFlipped: false,
  angle: 0,
};

const beachballImage = new Image();
beachballImage.src = "beachball.png";

const waterLevel = canvas.height / 2;

document.getElementById("score").innerText = `Score: ${score}`;

function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.radius = 30;
  this.dx = Math.random() * 4 - 2; // Increased range for more dynamic movement
  this.dy = Math.random() * 2 + 1; // Random vertical speed
}

function drawDolphin() {
  const scaledWidth = dolphin.width;
  const scaledHeight = dolphin.height;

  ctx.save();
  ctx.translate(dolphin.x + scaledWidth / 2, dolphin.y + scaledHeight / 2);

  if (dolphin.isFlipped) {
    ctx.scale(-1, 1);
  }

  ctx.rotate(dolphin.angle);

  ctx.drawImage(
    dolphinImage,
    -scaledWidth / 2,
    -scaledHeight / 2,
    scaledWidth,
    scaledHeight
  );
  ctx.restore();

  ctx.strokeStyle = "rgba(0, 255, 0, 0.5)";
  ctx.lineWidth = 2;
  ctx.strokeRect(dolphin.x, dolphin.y, scaledWidth, scaledHeight);
}

function drawBall(ball) {
  ctx.drawImage(
    beachballImage,
    ball.x - ball.radius,
    ball.y - ball.radius,
    ball.radius * 2,
    ball.radius * 2
  );
}

function drawWater() {
  ctx.fillStyle = "#1e90ff";
  ctx.fillRect(0, waterLevel, canvas.width, canvas.height / 2);
}

function drawSky() {
  ctx.fillStyle = "#87ceeb";
  ctx.fillRect(0, 0, canvas.width, waterLevel);
}

function moveDolphin() {
  dolphin.x += dolphin.dx;

  if (dolphin.isJumping) {
    dolphin.dy += dolphin.gravity;
    dolphin.y += dolphin.dy;

    if (dolphin.y >= waterLevel) {
      dolphin.y = waterLevel;
      dolphin.dy = 0;
      dolphin.isJumping = false;
    }
  } else {
    dolphin.y += dolphin.dy;
    if (dolphin.y - dolphin.height > canvas.height) {
      dolphin.y = canvas.height - dolphin.height;
    }
    if (dolphin.y < waterLevel - dolphin.height) {
      dolphin.y = waterLevel - dolphin.height;
    }
  }

  if (dolphin.x < 0) dolphin.x = 0;
  if (dolphin.x + dolphin.width > canvas.width)
    dolphin.x = canvas.width - dolphin.width;
}

let ballSpawnThreshold = 1000;

function addBall() {
  const ball = new Ball(Math.random() * canvas.width, 30);
  balls.push(ball);
}

function checkCollision(ball, dolphin) {
  // Check if the ball is within the dolphin's vertical range
  if (
    ball.y + ball.radius > dolphin.y &&
    ball.y - ball.radius < dolphin.y + dolphin.height
  ) {
    // Check horizontal overlap
    if (
      ball.x + ball.radius > dolphin.x &&
      ball.x - ball.radius < dolphin.x + dolphin.width
    ) {
      // Collision detected, now resolve it
      return true;
    }
  }
  return false;
}

function resolveCollision(ball, dolphin) {
  // Adjust the ball's position to avoid sticking
  let overlapX = ball.radius * 2 - (Math.abs(ball.x - dolphin.x) + ball.radius);
  let overlapY = ball.radius * 2 - (Math.abs(ball.y - dolphin.y) + ball.radius);

  // Resolve horizontal overlap
  if (overlapX > 0) {
    if (ball.x < dolphin.x) {
      ball.x = dolphin.x - ball.radius; // Move ball to the left of the dolphin
    } else {
      ball.x = dolphin.x + dolphin.width + ball.radius; // Move ball to the right of the dolphin
    }
  }

  // Resolve vertical overlap
  if (overlapY > 0) {
    if (ball.y < dolphin.y) {
      ball.y = dolphin.y - ball.radius; // Move ball above the dolphin
    } else {
      ball.y = dolphin.y + dolphin.height + ball.radius; // Move ball below the dolphin
    }
  }

  // Reflect the ball's velocity
  ball.dy = -ball.dy; // Reverse vertical direction
  ball.dx = Math.random() * 4 - 2; // New random horizontal direction
}

function updateBalls() {
  balls.forEach((ball, index) => {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with the canvas boundaries
    if (ball.y + ball.radius > waterLevel) {
      balls.splice(index, 1);
      saveHighScore(score);
      gameOver();
    }

    if (ball.y - ball.radius < 0) ball.dy = -ball.dy;
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0)
      ball.dx = -ball.dx;

    // Ball collision with the dolphin
    if (checkCollision(ball, dolphin)) {
      resolveCollision(ball, dolphin);
      score += 10;
      document.getElementById("score").innerText = `Score: ${score}`;

      if (score % ballSpawnThreshold === 0) {
        addBall();
      }
    }
  });
}

let powerUps = [];

function PowerUp(x, y) {
  this.x = x;
  this.y = y;
  this.size = 20;
  this.type = Math.random() > 0.5 ? "speed" : "score";
}

function drawPowerUps() {
  powerUps.forEach((powerUp) => {
    ctx.beginPath();
    const gradient = ctx.createRadialGradient(
      powerUp.x,
      powerUp.y,
      0,
      powerUp.x,
      powerUp.y,
      powerUp.size
    );
    gradient.addColorStop(
      0,
      powerUp.type === "speed" ? "yellow" : "lightgreen"
    );
    gradient.addColorStop(1, powerUp.type === "speed" ? "orange" : "green");

    ctx.arc(powerUp.x, powerUp.y, powerUp.size, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();
  });
}

function updatePowerUps() {
  powerUps.forEach((powerUp, index) => {
    if (
      dolphin.x < powerUp.x + powerUp.size &&
      dolphin.x + dolphin.width > powerUp.x - powerUp.size &&
      dolphin.y < powerUp.y + powerUp.size &&
      dolphin.y + dolphin.height > powerUp.y - powerUp.size
    ) {
      if (powerUp.type === "speed") {
        dolphin.speed *= 2;
        setTimeout(() => (dolphin.speed /= 2), 5000);
      } else if (powerUp.type === "score") {
        score += 50;
      }

      powerUps.splice(index, 1);
    }
  });
}

function addPowerUp() {
  const powerUp = new PowerUp(
    Math.random() * canvas.width,
    (Math.random() * canvas.height) / 2 + waterLevel
  );
  powerUps.push(powerUp);
}

setInterval(addPowerUp, 10000);

function showLeaderboard() {
  document.getElementById("game-container").style.display = "none";
  document.getElementById("leaderboard").style.display = "block";
  displayHighScores();
}

function hideLeaderboard() {
  document.getElementById("leaderboard").style.display = "none";
  document.getElementById("game-container").style.display = "block";
}

function saveHighScore(score) {
  let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  highScores.push(score);
  highScores.sort((a, b) => b - a);
  highScores = highScores.slice(0, 10);
  localStorage.setItem("highScores", JSON.stringify(highScores));
}

function displayHighScores() {
  const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  const leaderboardList = document.getElementById("leaderboard-list");
  leaderboardList.innerHTML = highScores
    .map((score) => `<li>${score}</li>`)
    .join("");
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSky();
  drawWater();
  drawDolphin();
  balls.forEach(drawBall);
  drawPowerUps();
}

function update() {
  moveDolphin();
  updateBalls();
  updatePowerUps();
  draw();
  requestAnimationFrame(update);
}

function gameOver() {
  alert(`Game Over! Your final score is ${score}`);
  document.location.reload();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    dolphin.dx = dolphin.speed;
    dolphin.isFlipped = true;
    dolphin.angle = 0;
  }
  if (e.key === "ArrowLeft") {
    dolphin.dx = -dolphin.speed;
    dolphin.isFlipped = false;
    dolphin.angle = 0;
  }
  if (e.key === "ArrowUp") {
    if (!dolphin.isJumping && dolphin.y <= waterLevel) {
      dolphin.dy = dolphin.jumpSpeed;
      dolphin.isJumping = true;
    } else if (!dolphin.isJumping) {
      dolphin.dy = -dolphin.speed;
    }
    dolphin.angle = Math.PI / 2;
  }
  if (e.key === "ArrowDown" && !dolphin.isJumping) {
    dolphin.dy = dolphin.speed;
    dolphin.angle = -Math.PI / 2;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") dolphin.dx = 0;
  if (e.key === "ArrowUp" || e.key === "ArrowDown") dolphin.dy = 0;
});

function StartGame() {
  document.getElementById("title-screen").style.display = "none";
  document.getElementById("game-container").style.display = "block";
  addBall();
  update();
}

function restartGame() {
  document.location.reload();
}
