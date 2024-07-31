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
  height: 50 * (370 / 350), // Keep the aspect ratio of the sprite
  dx: 0,
  dy: 0,
  speed: 5,
  jumpSpeed: -10,
  gravity: 0.5,
  isJumping: false,
  direction: "right", // Track direction for horizontal movement
  rotation: 0, // Track rotation for vertical movement
};

// Load the dolphin image
const dolphinImage = new Image();
dolphinImage.src = "dolphin.png";

const waterLevel = canvas.height / 2;

document.getElementById("score").innerText = `Score: ${score}`;

function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.radius = 10;
  this.dx = Math.random() * 2 - 1;
  this.dy = 2;
}

function drawDolphin() {
  ctx.save();

  // Translate to the dolphin's position
  ctx.translate(dolphin.x + dolphin.width / 2, dolphin.y + dolphin.height / 2);

  // Rotate based on the dolphin's movement
  if (dolphin.isJumping) {
    if (dolphin.dy < 0) {
      dolphin.rotation = -Math.PI / 2; // Pointing up
    } else {
      dolphin.rotation = Math.PI / 2; // Pointing down
    }
  } else {
    if (dolphin.dx > 0) {
      dolphin.rotation = 0; // Pointing right
      dolphin.direction = "right";
    } else if (dolphin.dx < 0) {
      dolphin.rotation = Math.PI; // Pointing left
      dolphin.direction = "left";
    }
  }

  ctx.rotate(dolphin.rotation);

  // Draw the dolphin image, taking direction into account
  if (dolphin.direction === "left") {
    ctx.scale(-1, 1); // Flip the image horizontally
  }

  ctx.drawImage(
    dolphinImage,
    -dolphin.width / 2,
    -dolphin.height / 2,
    dolphin.width,
    dolphin.height
  );
  ctx.restore();
}

function drawBall(ball) {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
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
  const ball = new Ball(Math.random() * canvas.width, 10);
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

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSky();
  drawWater();
  drawDolphin();
  balls.forEach(drawBall);
}

function update() {
  moveDolphin();
  updateBalls();
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

dolphinImage.onload = function () {
  addBall();
  update();
};
