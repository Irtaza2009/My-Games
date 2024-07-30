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
};

document.getElementById("score").innerText = `Score: ${score}`;
