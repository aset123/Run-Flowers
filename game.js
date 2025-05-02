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
  const groundY = canvas.height - 125;
  const gravity = 1;
  let score = 0;
  let gameOver = false;
  let gameSpeed = 4;

  const characterImg = new Image();
  characterImg.src = "character.png";

  const flowerImg = new Image();
  flowerImg.src = "flower.png";

  const cactusImg = new Image();
  cactusImg.src = "cactus.png";

  // 🔊 Web Audio API (инициализируется после касания)
  let audioContext = null;
  const sounds = {};

  async function loadSound(name, url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    sounds[name] = await audioContext.decodeAudioData(arrayBuffer);
  }

  function playSound(name) {
    const buffer = sounds[name];
    if (buffer) {
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start();
    }
  }

  async function initAudioContext() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      await Promise.all([
        loadSound("jump", "jump.mp3"),
        loadSound("flower", "flower.mp3"),
        loadSound("hit", "hit.mp3"),
        loadSound("win", "win.mp3")
      ]);
      startGame();
    }
  }

  document.addEventListener("touchstart", initAudioContext, { once: true });
  document.addEventListener("click", initAudioContext, { once: true });

  function startGame() {
    Promise.all([
      new Promise(res => characterImg.onload = res),
      new Promise(res => flowerImg.onload = res),
      new Promise(res => cactusImg.onload = res),
      new Promise(res => backgroundImg.onload = res)
    ]).then(() => {
      const character = {
        x: 20,
        y: groundY - 80,
        width: 60,
        height: 90,
        vy: 0,
        jumping: false
      };

      const flowers = [];
      const obstacles = [];

      function generateDiscountCode(discount) {
        const token = Math.floor(100000 + Math.random() * 900000);
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const timeStr = `${hours}:${minutes}`;
        return {
          code: `DISCOUNT-${discount}-${token}`,
          time: timeStr
        };
      }

      function showFinalDiscount() {
        const discountText = score.toFixed(1);
        const discountInfo = generateDiscountCode(discountText);

        const waMessage = encodeURIComponent(
          `Здравствуйте, я получил(а) скидку ${discountText}% в игре. Мой код: ${discountInfo.code}`
        );

        scoreBoard.innerHTML = `
          🎉 Поздравляем!<br>
          Твоя скидка: ${discountText}%<br>
          Код подтверждения: <strong>${discountInfo.code}</strong><br>
          Время получения: ${discountInfo.time}<br>
          Вы можете воспользоваться ею в течение 15 минут.<br><br>
          <a href="https://wa.me/77473530000?text=${waMessage}" target="_blank"
             style="display:inline-block; padding:10px 14px; background:#25D366; color:white; font-weight:bold; font-family:inherit; text-decoration:none; border-radius:8px; margin-top:10px;">
             💬 Оформить заказ в WhatsApp
          </a>
        `;
      }

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
          y: groundY - 70,
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
            playSound("flower");
            score += 0.2;
            scoreBoard.innerText = `Скидка: ${score.toFixed(1)}%`;
            if (score >= 5) {
              gameOver = true;
              playSound("win");
              showFinalDiscount();
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
            playSound("hit");
            showFinalDiscount();
            restartBtn.style.display = 'block';
          }
        });

        drawCharacter();

        gameSpeed += 0.0005;
        if (gameSpeed > 10) gameSpeed = 10;

        requestAnimationFrame(update);
      }

      document.addEventListener("touchstart", () => {
        if (!character.jumping && !gameOver) {
          character.vy = -25;
          character.jumping = true;
          playSound("jump");
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
  }
});
