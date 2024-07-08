const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Load the sprite sheet
const spriteSheet = new Image();
spriteSheet.src = "sprites.png";

let paddleWidth = 12;
let paddleHeight = 75;
let ballSize = 23;

let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballXSpeed = 3;
let ballYSpeed = 3;

let rightPaddleUp = false;
let rightPaddleDown = false;

let leftScore = 0;
let rightScore = 0;

const resizeCanvas = () => {
  canvas.width = window.innerWidth / 1.1;
  canvas.height = window.innerHeight / 2.5;

  leftPaddleY = canvas.height / 2 - paddleHeight / 2;
  rightPaddleY = canvas.height / 2 - paddleHeight / 2;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;

  paddleHeight = canvas.height / 2;
  ballSize = canvas.height / 30;
};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw left paddle
  ctx.drawImage(
    spriteSheet,
    19,
    20,
    12,
    110,
    0,
    leftPaddleY,
    paddleWidth,
    paddleHeight / 2
  );

  // Draw right paddle
  ctx.drawImage(
    spriteSheet,
    70,
    20,
    12,
    110,
    canvas.width - paddleWidth,
    rightPaddleY,
    paddleWidth,
    paddleHeight / 2
  );

  // Draw ball
  ctx.drawImage(
    spriteSheet,
    112,
    12,
    23,
    23,
    ballX,
    ballY,
    ballSize * 1.5,
    ballSize * 1.5
  );

  // Draw scores
  ctx.fillStyle = "#ffffff";
  ctx.font = "30px Arial";
  ctx.fillText(leftScore, canvas.width / 4, 50);
  ctx.fillText(rightScore, (canvas.width / 4) * 3, 50);
};
