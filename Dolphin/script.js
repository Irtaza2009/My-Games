const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

let score = 0;
let balls = [];
let dolphin = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  width: 50,
  height: 20,
  dx: 0,
  dy: 0,
  speed: 5,
  isJumping: false,
  jumpSpeed: -10,
  gravity: 0.5,
};

document.getElementById("score").innerText = `Score: ${score}`;

function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.radius = 10;
  this.dx = Math.random() * 2 - 1;
  this.dy = -2;
}

function drawDolphin() {
  ctx.fillStyle = "gray";
  ctx.fillRect(dolphin.x, dolphin.y, dolphin.width, dolphin.height);
}

function drawBall(ball) {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
}

function moveDolphin() {
  dolphin.x += dolphin.dx;

  if (dolphin.isJumping) {
    dolphin.dy += dolphin.gravity;
    dolphin.y += dolphin.dy;

    if (dolphin.y + dolphin.height >= canvas.height) {
      dolphin.y = canvas.height - dolphin.height;
      dolphin.dy = 0;
      dolphin.isJumping = false;
    }
  }

  if (dolphin.x < 0) dolphin.x = 0;
  if (dolphin.x + dolphin.width > canvas.width)
    dolphin.x = canvas.width - dolphin.width;
}

let ballSpawnThreshold = 1000;

function addBall() {
  const ball = new Ball(dolphin.x + dolphin.width / 2, dolphin.y - 20);
  balls.push(ball);
}

function updateBalls() {
  balls.forEach((ball, index) => {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y + ball.radius > canvas.height) {
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
  if (e.key === "ArrowUp" && !dolphin.isJumping) {
    dolphin.dy = dolphin.jumpSpeed;
    dolphin.isJumping = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") dolphin.dx = 0;
});

addBall();
update();
