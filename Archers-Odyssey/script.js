/* A simple game using HTML5 Canvas
-and JavaScript.
-The game is a simple shooter
-game where the player has to shoot
-enemies to gain points.
-The player can move up
-and down and shoot projectiles.
-The game has a simple scoring
-system and a game over screen.
-The game also has a simple
-background and a parallax effect.
-The game also has a debug
-mode to show collision boxes.
-The enemies are all made by extending the enemy class.*/

window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 700;
  canvas.height = 500;

  class InputHandler {
    constructor(game) {
      this.game = game;
      window.addEventListener("keydown", (e) => {
        if (
          (e.key === "ArrowUp" || e.key === "ArrowDown") &&
          this.game.keys.indexOf(e.key) === -1 &&
          !this.game.gameOver
        ) {
          this.game.keys.push(e.key);
        } else if (e.key === " ") {
          if (!this.game.gameOver) this.game.player.shootTop();
        } else if (e.key === "d") {
          this.game.debug = !this.game.debug;
        }
      });
      window.addEventListener("keyup", (e) => {
        if (this.game.keys.indexOf(e.key) > -1) {
          this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
        }
      });
    }
  }
  class Projectile {
    constructor(game, x, y) {
      this.game = game;
      this.x = x;
      this.y = y;
      this.width = 57;
      this.height = 28;
      this.speed = 3;
      this.markedForDeletion = false;
      this.image = document.getElementById("player");
    }
    update() {
      this.x += this.speed;
      if (this.x > this.game.width) this.markedForDeletion = true;
    }
    draw(context) {
      context.drawImage(
        this.image,
        583,
        92,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width / 2,
        this.height / 2
      );
    }
  }
  class Particle {}
  class Player {
    constructor(game) {
      this.game = game;
      this.width = 64;
      this.height = 73;
      this.x = 20;
      this.y = 200;
      this.frameX = 0;
      this.frameY = 0;
      this.maxFrame = 4;
      this.speedY = 0;
      this.maxSpeed = 2;
      this.projectiles = [];
      this.image = document.getElementById("player");
    }
    update() {
      if (
        this.game.keys.includes("ArrowUp") &&
        this.y >= this.game.height * 0.38
      )
        this.speedY = -this.maxSpeed;
      else if (
        this.game.keys.includes("ArrowDown") &&
        this.y <= this.game.height - this.height
      )
        this.speedY = this.maxSpeed;
      else this.speedY = 0;
      this.y += this.speedY;
      // handle projectiles
      this.projectiles.forEach((projectile) => {
        projectile.update();
      });
      this.projectiles = this.projectiles.filter(
        (projectile) => !projectile.markedForDeletion
      );
      // sprite animation
      if (!this.game.gameOver) {
        if (this.frameX < this.maxFrame) {
          this.frameX++;
        } else {
          this.frameX = 0;
        }
      } else {
        if (this.game.hp <= 0) {
          this.frameX = 8;
          this.frameY = 1;
        }
      }
      if (this.game.hp <= 0) this.game.gameOver = true;
    }

    draw(context) {
      if (this.game.debug)
        context.strokeRect(this.x, this.y, this.width, this.height);
      context.drawImage(
        this.image,
        this.frameX * this.width,
        this.frameY * this.height,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
      this.projectiles.forEach((projectile) => {
        projectile.draw(context);
      });
    }
    shootTop() {
      if (this.game.ammo > 0) {
        this.projectiles.push(
          new Projectile(
            this.game,
            this.x + this.width,
            this.y + this.height / 1.6
          )
        );
        this.game.ammo--;
      }
    }
  }
  class Enemy {
    constructor(game) {
      this.game = game;
      this.x = this.game.width;
      this.speedX = Math.random() * -1.5 - 0.5;
      this.markedForDeletion = false;
    }
    update() {
      this.x += this.speedX - this.game.speed;
      if (this.x + this.width < 0) this.markedForDeletion = true;
    }
    draw(context) {
      if (this.game.debug)
        context.strokeRect(this.x, this.y, this.width, this.height);
      if (this.type == "lucky" || this.type == "arrowB")
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
      else
        context.drawImage(
          this.image,
          this.frameX * this.width,
          this.frameY * this.height,
          this.width,
          this.height,
          this.x,
          this.y,
          this.width,
          this.height
        );
      context.fillStyle = "black";
      context.font = "20px Helvetica";
      if (this.game.debug)
        context.fillText(
          this.lives,
          this.x + this.width / 2,
          this.y + this.height / 2
        );
    }
  }
  class Mage extends Enemy {
    constructor(game) {
      super(game);
      this.width = 65;
      this.height = 70;
      this.lives = 5;
      this.hitPoints = 2;
      this.score = this.lives;
      this.y =
        this.game.height * 0.38 +
        Math.random() * (this.game.height * 0.5 - this.height);
      this.frameX = 0;
      this.frameY = 0;
      this.animate = false;
      this.image = document.getElementById("mage");
    }
  }
  class Lucky extends Enemy {
    constructor(game) {
      super(game);
      this.width = 40;
      this.height = 40;
      this.lives = 15;
      this.hitPoints = -1;
      this.score = 15;
      this.y =
        this.game.height * 0.38 +
        Math.random() * (this.game.height * 0.5 - this.height);
      this.frameX = 4;
      this.frameY = 1;
      this.animate = false;
      this.image = document.getElementById("heart");
      this.type = "lucky";
    }
  }
  class ArrowB extends Enemy {
    constructor(game) {
      super(game);
      this.width = 40;
      this.height = 40;
      this.lives = 15;
      this.hitPoints = 0;
      this.score = 15;
      this.y =
        this.game.height * 0.38 +
        Math.random() * (this.game.height * 0.5 - this.height);
      this.frameX = 4;
      this.frameY = 1;
      this.animate = false;
      this.image = document.getElementById("arrowB");
      this.type = "arrowB";
    }
  }
  class Swords extends Enemy {
    constructor(game) {
      super(game);
      this.width = 70;
      this.height = 70;
      this.lives = 2;
      this.hitPoints = 1;
      this.score = this.lives;
      this.frameX = 0;
      this.frameY = 0;
      this.animate = true;
      this.y =
        this.game.height * 0.38 +
        Math.random() * (this.game.height * 0.5 - this.height);
      this.image = document.getElementById("swords");
    }
  }
  class Peasants extends Enemy {
    constructor(game) {
      super(game);
      this.width = 62;
      this.height = 70;
      this.lives = 1;
      this.hitPoints = 1;
      this.score = this.lives;
      this.frameX = 0;
      this.frameY = 0;
      this.animate = false;
      this.y =
        this.game.height * 0.38 +
        Math.random() * (this.game.height * 0.5 - this.height);
      this.image = document.getElementById("peasant");
    }
  }
  class Layer {
    constructor(game, image, speedModifier) {
      this.game = game;
      this.image = image;
      this.speedModifier = speedModifier;
      this.width = 64;
      this.height = 64;
      this.x = 0;
      this.y = 0;
    }
    update() {
      if (this.x <= -this.game.width) this.x = 0;
      else this.x -= this.game.speed * this.speedModifier;
    }
    draw(context) {
      context.drawImage(
        this.image,
        this.x,
        this.y,
        this.game.width,
        this.game.height
      );
      context.drawImage(
        this.image,
        this.x + this.game.width,
        this.y,
        this.game.width,
        this.game.height
      );
    }
  }
  class Background {
    constructor(game) {
      this.game = game;
      this.image1 = document.getElementById("layer1");
      this.image2 = document.getElementById("layer2");
      this.image3 = document.getElementById("layer3");
      this.layer1 = new Layer(this.game, this.image1, 0.25);
      this.layer2 = new Layer(this.game, this.image2, 3.5);
      this.layer3 = new Layer(this.game, this.image3, 0.5);
      this.layers = [this.layer1, this.layer2, this.layer3];
    }
    update() {
      this.layers.forEach((layer) => layer.update());
    }
    draw(context) {
      this.layers.forEach((layer) => layer.draw(context));
    }
  }
  class UI {
    constructor(game) {
      this.game = game;
      this.fontSize = 25;
      this.fontFamily = "Helvetica";
      this.color = "#f6f930ff";
    }
    draw(context) {
      context.save();
      context.fillStyle = this.color;
      context.shadowOffsetX = 2;
      context.shadowOffsetY = 2;
      context.shadowColor = "black";
      context.font = this.fontSize + "px " + this.fontFamily;
      // time
      context.fillText(
        "Time: " + (this.game.gameTime / 1000).toFixed(1) + "s",
        this.game.width - 150,
        30
      );
      // score
      context.fillText("Score: " + this.game.score, 20, 30);
      // ammo
      context.fillStyle = this.color;
      for (let i = 0; i < this.game.ammo; i++) {
        context.drawImage(
          document.getElementById("arrow"),
          20 + 12 * i,
          50,
          10,
          20
        );
      }
      // hp
      context.fillStyle = "red";
      for (let i = 0; i < this.game.hp; i++) {
        context.drawImage(
          document.getElementById("heart"),
          this.game.width - 25 - 21 * i,
          60,
          20,
          20
        );
      }
      // game over message
      if (this.game.gameOver) {
        context.textAlign = "center";
        let message1;
        let message2;
        if (this.game.score >= this.game.winningScore) {
          message1 = "You Win!";
          message2 =
            "Well done! Your High Score is: " +
            (this.game.gameTime / 1000).toFixed(1) +
            "s";
        } else {
          message1 = "You lose!";
          message2 = "Try again next time!";
        }
        context.font = "50px" + this.fontFamily;
        context.fillText(
          message1,
          this.game.width * 0.5,
          this.game.height * 0.5 - 40
        );
        context.font = "25px" + this.fontFamily;
        context.fillText(
          message2,
          this.game.width * 0.5,
          this.game.height * 0.5 + 40
        );
      }
      context.restore();
    }
  }
  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.ui = new UI(this);
      this.background = new Background(this);
      this.keys = [];
      this.enemies = [];
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.ammo = 20;
      this.maxAmmo = 25;
      this.ammoTimer = 0;
      this.ammoInterval = 500;
      this.gameOver = false;
      this.score = 0;
      this.winningScore = 500;
      this.gameTime = 0;
      this.speed = 1;
      this.hp = 10;
      this.debug = false;
    }
    update(deltaTime) {
      if (!this.gameOver) this.gameTime += deltaTime;
      this.background.update();
      this.player.update();
      if (this.ammoTimer > this.ammoInterval) {
        if (this.ammo < this.maxAmmo) this.ammo++;
        this.ammoTimer = 0;
      } else {
        this.ammoTimer += deltaTime;
      }
      this.enemies.forEach((enemy) => {
        enemy.update();
        if (this.checkCollision(this.player, enemy)) {
          enemy.markedForDeletion = true;
          if (!this.gameOver) {
            if (enemy.type == "arrowB") this.ammo += 5;
            this.hp -= enemy.hitPoints;
            this.player.frameX = 8;
          }
        }
        this.player.projectiles.forEach((projectile) => {
          if (this.checkCollision(projectile, enemy)) {
            enemy.lives--;
            projectile.markedForDeletion = true;
            if (enemy.lives <= 0) {
              enemy.markedForDeletion = true;
              this.score += enemy.score;
              if (this.score >= this.winningScore) this.gameOver = true;
            }
          }
        });
      });
      this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
      if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }
    }
    draw(context) {
      this.background.draw(context);
      this.player.draw(context);
      this.ui.draw(context);
      this.enemies.forEach((enemy) => {
        enemy.draw(context);
      });
      this.ui.draw(context);
    }
    addEnemy() {
      const randomise = Math.random();
      if (this.score >= 50 && randomise > 0.6)
        this.enemies.push(new Mage(this));
      if (randomise > 0.95) this.enemies.push(new ArrowB(this));
      else if (randomise > 0.9) this.enemies.push(new Lucky(this));
      else if (randomise > 0.6) this.enemies.push(new Swords(this));
      else if (randomise > 0) this.enemies.push(new Peasants(this));
    }
    checkCollision(rect1, rect2) {
      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y
      );
    }
  }

  const game = new Game(canvas.width, canvas.height);
  let lastTime = 0;
  //animation loop
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);
    requestAnimationFrame(animate);
  }
  animate(0);
});
