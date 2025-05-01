const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreBoard = document.getElementById("scoreBoard");

let score = 0;
let gameOver = false;

const characterImg = new Image();
characterImg.src = "character.png";

const flowerImg = new Image();
flowerImg.src = "flower.png";

let character = { x: 50, y: 240, width: 40, height: 50, vy: 0, jumping: false };
let gravity = 1.2;
let flowers = [];
let obstacles = [];
let gameSpeed = 6;

function drawCharacter() {
  ctx.drawImage(characterImg, character.x, character.y, character.width, character.height);
}

function createFlower() {
  flowers.push({ x: 800, y: 250, width: 30, height: 40 });
}

function createObstacle() {
  obstacles.push({ x: 800, y: 260, width: 20, height: 40 });
}

function drawFlowers() {
  flowers.forEach(f => ctx.drawImage(flowerImg, f.x, f.y, f.width, f.height));
}

function drawObstacles() {
  ctx.fillStyle = "#aaa";
  obstacles.forEach(o => ctx.fillRect(o.x, o.y, o.width, o.height));
}

function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCharacter();
  drawFlowers();
  drawObstacles();

  character.y += character.vy;
  character.vy += gravity;

  if (character.y > 240) {
    character.y = 240;
    character.vy = 0;
    character.jumping = false;
  }

  flowers.forEach((f, i) => {
    f.x -= gameSpeed;
    if (
      character.x < f.x + f.width &&
      character.x + character.width > f.x &&
      character.y < f.y + f.height &&
      character.y + character.height > f.y
    ) {
      flowers.splice(i, 1);
      score++;
      scoreBoard.innerText = `Скидка: ${score}%`;
      if (score >= 20) {
        gameOver = true;
        scoreBoard.innerText = `Поздравляем! Твоя скидка: 20%`;
      }
    }
  });

  obstacles.forEach((o) => {
    o.x -= gameSpeed;
    if (
      character.x < o.x + o.width &&
      character.x + character.width > o.x &&
      character.y < o.y + o.height &&
      character.y + character.height > o.y
    ) {
      gameOver = true;
      scoreBoard.innerText = `Игра окончена! Твоя скидка: ${score}%`;
    }
  });

  flowers = flowers.filter(f => f.x > -50);
  obstacles = obstacles.filter(o => o.x > -20);

  if (!gameOver) requestAnimationFrame(update);
}

document.addEventListener("keydown", e => {
  if (e.code === "Space" && !character.jumping) {
    character.vy = -18;
    character.jumping = true;
  }
});

setInterval(() => {
  if (Math.random() < 0.5 && !gameOver) createFlower();
}, 1500);

setInterval(() => {
  if (Math.random() < 0.7 && !gameOver) createObstacle();
}, 2000);

update();
