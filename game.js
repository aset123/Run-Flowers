window.addEventListener("load", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const scoreBoard = document.getElementById("scoreBoard");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const groundY = canvas.height * 0.9;
  const gravity = canvas.height * 0.006;
  let score = 0;
  let gameOver = false;

  const character = {
    x: canvas.width * 0.1,
    y: groundY - canvas.height * 0.15,
    width: canvas.width * 0.08,
    height: canvas.height * 0.15,
    vy: 0,
    jumping: false
  };

  const flowers = [];
  const obstacles = [];
  const gameSpeed = canvas.width * 0.01;

  const characterImg = new Image();
  characterImg.src = "character.png";

  const flowerImg = new Image();
  const cactusImg = new Image();
  cactusImg.src = "cactus.png";
  flowerImg.src = "flower.png";

  function drawCharacter() {
    ctx.drawImage(characterImg, character.x, character.y, character.width, character.height);
  }

  function createFlower() {
    flowers.push({
      x: canvas.width,
      y: groundY - canvas.height * 0.13,
      width: canvas.width * 0.06,
      height: canvas.height * 0.13
    });
  }

  function createObstacle() {
    obstacles.push({
      x: canvas.width,
      y: groundY - canvas.height * 0.1,
      width: canvas.width * 0.03,
      height: canvas.height * 0.1
    });
  }

  function update() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
      if (character.x < f.x + f.width &&
          character.x + character.width > f.x &&
          character.y < f.y + f.height &&
          character.y + character.height > f.y) {
        flowers.splice(i, 1);
        score++;
        scoreBoard.innerText = `Скидка: ${score}%`;
        if (score >= 20) {
          gameOver = true;
          scoreBoard.innerText = `Поздравляем! Твоя скидка: 20%`;
        restartBtn.style.display = 'block';
        }
      }
    });

    obstacles.forEach((o) => {
      if (character.x < o.x + o.width &&
          character.x + character.width > o.x &&
          character.y < o.y + o.height &&
          character.y + character.height > o.y) {
        gameOver = true;
        scoreBoard.innerText = `Игра окончена! Твоя скидка: ${score}%`;
        restartBtn.style.display = 'block';
      }
    });

    drawCharacter();

    requestAnimationFrame(update);
  }

  setInterval(() => {
    if (!gameOver && Math.random() < 0.6) createFlower();
  }, 1500);

  setInterval(() => {
    if (!gameOver && Math.random() < 0.5) createObstacle();
  }, 2000);

  document.addEventListener("touchstart", () => {
    if (!character.jumping && !gameOver) {
      character.vy = -canvas.height * 0.03;
      character.jumping = true;
    }
  });

  update();
  const restartBtn = document.getElementById("restartBtn");
  restartBtn.addEventListener("click", () => {
    location.reload();
  });

});
