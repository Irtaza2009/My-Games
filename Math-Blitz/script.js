let score = 0;
let timer = 30;
let interval;
let highscore = localStorage.getItem("highscore-math-blitz") || 0;
const backgroundMusic = document.getElementById("backgroundMusic");
const scoreSound = document.getElementById("scoreSound");
const loseSound = document.getElementById("loseSound");
let difficulty = "easy"; // default difficulty
let isMuted = false; // default volume state

const handleDifficultyClick = (selectedDifficulty) => {
  difficulty = selectedDifficulty;
  document.getElementById("difficulty-container").style.display = "none";
  startGame();
};

const handleVolumeButtonClick = () => {
  isMuted = !isMuted;
  document.getElementById("volume-button").textContent = isMuted
    ? "Unmute"
    : "Mute";
  if (isMuted) {
    backgroundMusic.pause();
  } else {
    backgroundMusic.play();
  }
};

const startGame = () => {
  document.getElementById("menu-container").style.display = "none";
  document.getElementById("game-container").style.display = "block";
  document.getElementById("highscore-container").style.display = "none";
  if (!isMuted) {
    backgroundMusic.currentTime = 0;
    backgroundMusic.play();
  }

  score = 0;
  timer = 30;
  updateScore();
  updateTimer();
  updateQuestion();
  interval = setInterval(() => {
    timer--;
    updateTimer();
    if (timer <= 0) {
      endGame();
    }
  }, 1000);
};

const endGame = () => {
  clearInterval(interval);
  document.getElementById("question").textContent = "";
  document.getElementById("options").textContent = "";
  document.getElementById("score-container").style.transform = "scale(2)";
  document.getElementById("restart-container").style.display = "block";
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;

  if (score > highscore) {
    highscore = score;
    localStorage.setItem("highscore-math-blitz", highscore);
  }
  updateHighscore();
  document.getElementById("highscore-container").style.display = "block";
};

const updateHighscore = () => {
  document.getElementById("highscore").textContent = `Highscore: ${highscore}`;
};

const updateScore = () => {
  document.getElementById("score").textContent = `Score: ${score}`;
};

const updateTimer = () => {
  document.getElementById("timer").textContent = timer + "s";
};

const updateQuestion = () => {
  const maxNum = difficulty === "easy" ? 10 : 100;
  const num1 = Math.floor(Math.random() * maxNum) + 1;
  const num2 = Math.floor(Math.random() * maxNum) + 1;
  const operation = ["+", "-", "×", "÷"][Math.floor(Math.random() * 4)];
  const question = `${num1} ${operation} ${num2}`;
  document.getElementById("question").textContent = question;
  updateOptions(num1, num2, operation);
};

const updateOptions = (num1, num2, operation) => {
  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";
  let correctAnswer;
  if (operation === "÷") {
    correctAnswer = (num1 / num2).toFixed(2); // Round the answer to two decimal places
  } else if (operation === "×") {
    correctAnswer = num1 * num2;
  } else {
    correctAnswer = eval(`${num1} ${operation} ${num2}`);
  }
  let options = [correctAnswer];
  for (let i = 0; i < 2; i++) {
    let optionValue;
    do {
      if (operation === "×") {
        optionValue = Math.floor(
          correctAnswer +
            (Math.random() * 3 - 1) * Math.floor(Math.sqrt(correctAnswer))
        );
      } else if (operation === "-") {
        if (correctAnswer >= 0) {
          optionValue = Math.floor(Math.random() * 20); // Range from 0 to 20
        } else {
          if (difficulty === "easy") {
            optionValue = Math.floor(Math.random() * 10) - 10; // Range from -10 to 0
          } else {
            optionValue = Math.floor(Math.random() * 30) - 30; // Range from -30 to 0
          }
        }
      } else {
        optionValue = Math.floor(Math.random() * 20) + 1;
      }
    } while (options.includes(optionValue));
    options.push(optionValue);
  }
  options = options.sort(() => Math.random() - 0.5);
  options.forEach((optionValue) => {
    const optionButton = document.createElement("button");
    if (operation === "÷") {
      optionButton.textContent = parseFloat(optionValue).toFixed(2); // Round the option value to two decimal places
    } else {
      optionButton.textContent = optionValue;
    }
    optionButton.addEventListener("click", () =>
      handleOptionClick(optionValue, correctAnswer)
    );
    optionsContainer.appendChild(optionButton);
  });
};

const handleOptionClick = (optionValue, correctAnswer) => {
  if (optionValue === correctAnswer) {
    scoreSound.currentTime = 0;
    score++;
    updateScore();
    updateQuestion();
    scoreSound.play();
  } else {
    score--;
    updateScore();
    updateQuestion();
    loseSound.play();
  }
};

const handleRestartButtonClick = () => {
  document.getElementById("score-container").style.transform = "scale(1)";
  document.getElementById("restart-container").style.display = "none";
  startGame();
};

const handleStartButtonClick = () => {
  document.getElementById("menu-container").style.display = "none";
  document.getElementById("difficulty-container").style.display = "block";
  document.getElementById("volume-button").style.display = "block";
  if (!isMuted) {
    backgroundMusic.play();
  }
};

document
  .getElementById("easy-button")
  .addEventListener("click", () => handleDifficultyClick("easy"));
document
  .getElementById("hard-button")
  .addEventListener("click", () => handleDifficultyClick("hard"));
document
  .getElementById("volume-button")
  .addEventListener("click", handleVolumeButtonClick);

document
  .getElementById("restart-button")
  .addEventListener("click", handleRestartButtonClick);

document
  .getElementById("startButton")
  .addEventListener("click", handleStartButtonClick);

// Your existing JavaScript code

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var canvas2 = document.getElementById("canvas2");
var ctx2 = canvas2.getContext("2d");

// Full screen dimensions
var cw = window.innerWidth;
var ch = window.innerHeight;
var charArr = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
];
var maxCharCount = 100;
var fallingCharArr = [];
var fontSize = 10;
var maxColums = cw / fontSize;
canvas.width = canvas2.width = cw;
canvas.height = canvas2.height = ch;
