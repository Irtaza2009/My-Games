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
