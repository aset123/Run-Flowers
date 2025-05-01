window.addEventListener("load", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const scoreBoard = document.getElementById("scoreBoard");
  const restartBtn = document.getElementById("restartBtn");

  canvas.width = 360;
  canvas.height = 640;

  const backgroundImg = new Image();
  backgroundImg.src = "background.png";

  let bgOffset = 0;

  const groundY = canvas.height - 16;
  const gravity = 1;
  let score = 0;
  let gameOver = false;
  let gameSpeed = 4; // ← теперь let, чтобы менять

  const characterImg = new Image();
  characterImg.src = "character.png";

  const flowerImg = new Image();
  flowerImg.src = "flower.png";

  const cactusImg = new Image();
  cactusImg.src = "cactus.png";

  const character = {
    x: 20,
    y: groundY - 45,
    width: 60,
    height: 90,
    vy: 0,
    jumping: false
  };

  const flowers = [];
  const obstacles = [];

  Promise.all([
    new Promise(res => characterImg.onload = res),
    new Promise(res => flowerImg.onload = res),
    new Promise(res => cactusImg.onload = res),
    new Promise(res => backgroundImg.onload = res)
  ]).then(() => {

    function drawBackground() {
      bgOffset = (bgOffset + gameSpeed * 0.5) % canvas.width;
      ctx.drawImage(backgroundImg, -bgOffset, 0, canvas.width, canvas.height);
      ctx.drawImage(backgroundImg, canvas.width - bgOffset, 0, canvas.width, canvas.height);
    }

    function drawCharacter() {
      ctx.drawImage(characterImg, character.x, character.y, character.width, character.height);
    }

    function createFlower() {
      flowers.push({
        x: canvas.width,
        y: groundY - 90,
        width: 70,
        height: 75
      });
    }

    function createObstacle() {
      obstacles.push({
        x: canvas.width,
        y: groundY - 75,
        width: 70,
        height: 75
      });
    }

    function update() {
      if (gameOver) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBackground();

      character.y += character.vy;
      character.vy += gravity;

      if (character.y > groundY - character.height) {
        character.y = groundY - character.height;
        character.vy = 0;
        character.jumping = false;
      }

      flowers.forEach(f => {
        f.x -= gameSpeed;
        ctx.drawImage(flowerImg, f.x, f.y, f.width, f.height);
      });

      obstacles.forEach(o => {
        o.x -= gameSpeed;
        ctx.drawImage(cactusImg, o.x, o.y, o.width, o.height);
      });

      flowers.forEach((f, i) => {
        if (
          character.x < f.x + f.width &&
          character.x + character.width > f.x &&
          character.y < f.y + f.height &&
          character.y + character.height > f.y
        ) {
          flowers.splice(i, 1);
          score += 0.1;
          scoreBoard.innerText = `Скидка: ${score.toFixed(1)}%`;
          if (score >= 10) {
            gameOver = true;
            scoreBoard.innerText = `Поздравляем! Твоя скидка: 10%`;
            restartBtn.style.display = 'block';
          }
        }
      });

      obstacles.forEach((o) => {
        if (
          character.x < o.x + o.width &&
          character.x + character.width > o.x &&
          character.y < o.y + o.height &&
          character.y + character.height > o.y
        ) {
          gameOver = true;
          scoreBoard.innerText = `Игра окончена! Твоя скидка: ${score.toFixed(1)}%`;
          restartBtn.style.display = 'block';
        }
      });

      drawCharacter();

      // 🚀 Плавное ускорение игры
      gameSpeed += 0.002;
      if (gameSpeed > 10) gameSpeed = 10;

      requestAnimationFrame(update);
    }

    document.addEventListener("touchstart", () => {
      if (!character.jumping && !gameOver) {
        character.vy = -25;
        character.jumping = true;
      }
    });

    restartBtn.addEventListener("click", () => location.reload());

    setInterval(() => {
      if (!gameOver && Math.random() < 0.6) createFlower();
    }, 1500);

    setInterval(() => {
      if (!gameOver && Math.random() < 0.5) createObstacle();
    }, 2000);

    update();
  });
});
