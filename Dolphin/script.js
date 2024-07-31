const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

let score = 0;
let balls = [];
let dolphin = {
  x: canvas.width / 2,
  y: canvas.height / 2 - 50, // Start at the edge of the water
  width: 50,
  height: 20,
  dx: 0,
  dy: 0,
  speed: 5,
  jumpSpeed: -10,
  gravity: 0.5,
  isJumping: false,
};

// Load the dolphin image
const dolphinImage = new Image();
dolphinImage.src = "dolphin.png";

// Load the beachball image
const beachballImage = new Image();
beachballImage.src = "beachball.png";

const waterLevel = canvas.height / 2;

document.getElementById("score").innerText = `Score: ${score}`;

function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.radius = 30;
  this.dx = Math.random() * 2 - 1;
  this.dy = 2;
}

function drawDolphin() {
  // Scale the image to fit the defined dolphin width and height
  const scaledWidth = 100;
  const scaledHeight = 100 * (dolphinImage.height / dolphinImage.width);

  ctx.drawImage(dolphinImage, dolphin.x, dolphin.y, scaledWidth, scaledHeight);
}

/*
Manual drawing of the ball
function drawBall(ball) {
  ctx.beginPath();
  const gradient = ctx.createRadialGradient(
    ball.x,
    ball.y,
    0,
    ball.x,
    ball.y,
    ball.radius
  );
  gradient.addColorStop(0, "white");
  gradient.addColorStop(1, "lightblue");

  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.closePath();

  // Draw stripes
  const stripeWidth = ball.radius / 5;
  ctx.strokeStyle = "white";
  ctx.lineWidth = stripeWidth;

  for (let i = 0; i < 6; i++) {
    const angle = i * (Math.PI / 3);
    const x1 = ball.x + ball.radius * Math.cos(angle);
    const y1 = ball.y + ball.radius * Math.sin(angle);
    const x2 = ball.x + (ball.radius - stripeWidth) * Math.cos(angle);
    const y2 = ball.y + (ball.radius - stripeWidth) * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}
  */

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

    if (dolphin.y + dolphin.height >= waterLevel) {
      dolphin.y = waterLevel - dolphin.height;
      dolphin.dy = 0;
      dolphin.isJumping = false;
    }
  } else {
    dolphin.y += dolphin.dy;
    if (dolphin.y + dolphin.height > canvas.height) {
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

function updateBalls() {
  balls.forEach((ball, index) => {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y + ball.radius > waterLevel) {
      balls.splice(index, 1);
      gameOver();
    }

    if (ball.y - ball.radius < 0) ball.dy = -ball.dy;
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0)
      ball.dx = -ball.dx;

    if (
      ball.y + ball.radius > dolphin.y &&
      ball.x > dolphin.x &&
      ball.x < dolphin.x + dolphin.width
    ) {
      ball.dy = -ball.dy;
      score += 10;
      document.getElementById("score").innerText = `Score: ${score}`;

      if (score % ballSpawnThreshold === 0) {
        addBall();
      }
    }
  });
}

// Add power-ups
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
    // Move power-up and check collision with dolphin

    if (
      dolphin.x < powerUp.x + powerUp.size &&
      dolphin.x + dolphin.width > powerUp.x - powerUp.size &&
      dolphin.y < powerUp.y + powerUp.size &&
      dolphin.y + dolphin.height > powerUp.y - powerUp.size
    ) {
      // Activate power-up
      if (powerUp.type === "speed") {
        dolphin.speed *= 2;
        setTimeout(() => (dolphin.speed /= 2), 5000); // Reset after 5 seconds
      } else if (powerUp.type === "score") {
        score += 50;
      }

      powerUps.splice(index, 1); // Remove power-up after use
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

// Call addPowerUp periodically
setInterval(addPowerUp, 10000); // Add a power-up every 10 seconds

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
  if (e.key === "ArrowRight") dolphin.dx = dolphin.speed;
  if (e.key === "ArrowLeft") dolphin.dx = -dolphin.speed;
  if (e.key === "ArrowUp") {
    if (!dolphin.isJumping && dolphin.y === waterLevel - dolphin.height) {
      dolphin.dy = dolphin.jumpSpeed;
      dolphin.isJumping = true;
    } else if (!dolphin.isJumping) {
      dolphin.dy = -dolphin.speed;
    }
  }
  if (e.key === "ArrowDown" && !dolphin.isJumping) dolphin.dy = dolphin.speed;
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
