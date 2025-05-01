// flower_run.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const baseWidth = 800, baseHeight = 600;
let gameScale = 1;

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  gameScale = Math.min(window.innerWidth / baseWidth, window.innerHeight / baseHeight);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Character object example
const character = {
  x: 100,
  y: 500,
  width: 50,
  height: 50,
  vy: 0,
  gravity: 1,
  jumping: false
};

function update() {
  character.vy += character.gravity;
  character.y += character.vy;

  if (character.y >= 500) {
    character.y = 500;
    character.jumping = false;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.scale(gameScale, gameScale);
  ctx.fillStyle = 'skyblue';
  ctx.fillRect(0, 0, baseWidth, baseHeight);

  // Draw character
  ctx.fillStyle = 'red';
  ctx.fillRect(character.x, character.y, character.width, character.height);
  ctx.restore();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();

canvas.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  if (!character.jumping) {
    character.vy = -20;
    character.jumping = true;
  }
});
