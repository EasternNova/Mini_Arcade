const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("overlay");
const themeToggle = document.getElementById("themeToggle");

let isNight = false;

// Responsive canvas
function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ----- Images -----
const birdImg = new Image();
birdImg.src = "images/img_flappybird.png";

const pipeImg = new Image();
pipeImg.src = "images/img_flappypipe.png";

const dayBackground = new Image();
dayBackground.src = "images/img_light_sky.jpg";

const nightBackground = new Image();
nightBackground.src = "images/img_night_sky.png";

// ----- Game State -----
let bird, pipes, gravity, jump, score, bestScore, gameRunning, pipeGap, pipeSpeed, shakeTimer;

// ----- Game Logic -----
function resetGame() {
  bird = { x: 80, y: canvas.height / 2, vy: 0, w: 34, h: 24 };
  gravity = 0.5;
  jump = -8;
  pipeGap = canvas.height / 3;
  pipeSpeed = 2;
  score = 0;
  shakeTimer = 0;
  gameRunning = false;
  pipes = [];
}

function addPipe() {
  const topHeight = Math.random() * (canvas.height / 2);
  pipes.push({ x: canvas.width, top: topHeight, bottom: topHeight + pipeGap });
}

function startGame() {
  if (!gameRunning) {
    resetGame();
    overlay.classList.add("hidden");
    gameRunning = true;
  }
  bird.vy = jump;
}

// ----- Background Drawing -----
function drawBackground() {
  if (isNight) {
    const grd = ctx.createLinearGradient(0,0,0,canvas.height);
    grd.addColorStop(0,"#0d1b2a");
    grd.addColorStop(1,"#1b263b");
    ctx.fillStyle = grd;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    if (nightBackground.complete) {
      let scale = Math.min(canvas.width / nightBackground.width, canvas.height / nightBackground.height);
      ctx.drawImage(nightBackground, (canvas.width - nightBackground.width*scale)/2, canvas.height - nightBackground.height*scale, nightBackground.width*scale, nightBackground.height*scale);
    }
  } else {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    if (dayBackground.complete) {
      let scale = Math.min(canvas.width / dayBackground.width, canvas.height / dayBackground.height);
      ctx.drawImage(dayBackground, (canvas.width - dayBackground.width*scale)/2, canvas.height - dayBackground.height*scale, dayBackground.width*scale, dayBackground.height*scale);
    }
  }
}

// ----- Main Game Loop -----
function update() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  if (shakeTimer > 0) shakeTimer--;
  if (shakeTimer > 0) {
    const dx = Math.random()*10 - 5;
    const dy = Math.random()*10 - 5;
    ctx.save();
    ctx.translate(dx,dy);
  }

  drawBackground();

  if (gameRunning) {
    bird.vy += gravity;
    bird.y += bird.vy;

    if (pipes.length === 0 || pipes[pipes.length-1].x < canvas.width-200) addPipe();

    pipes.forEach(p => p.x -= pipeSpeed);
    pipes = pipes.filter(p => p.x+50>0);

    pipes.forEach(p => {
      if (bird.x < p.x + 50 && bird.x + bird.w > p.x && (bird.y < p.top || bird.y + bird.h > p.bottom)) gameOver();
    });

    if (bird.y + bird.h > canvas.height || bird.y < 0) gameOver();

    pipes.forEach(p => {
      if (!p.scored && p.x + 50 < bird.x) {
        p.scored = true;
        score++;
        if (score%5===0 && pipeGap>100) pipeGap -= 10;
        if (score%10===0) pipeSpeed += 0.3;
      }
    });
  }

  pipes.forEach(p => {
    ctx.drawImage(pipeImg,p.x,p.top - pipeImg.height);
    ctx.save();
    ctx.translate(p.x,p.bottom);
    ctx.scale(1,-1);
    ctx.drawImage(pipeImg,0,-pipeImg.height);
    ctx.restore();
  });

  ctx.drawImage(birdImg,bird.x,bird.y,bird.w,bird.h);

  ctx.fillStyle="white";
  ctx.font="bold 24px sans-serif";
  ctx.fillText(`Score: ${score}`,10,30);
  if(bestScore) ctx.fillText(`Best: ${bestScore}`,10,60);

  if(shakeTimer>0) ctx.restore();

  requestAnimationFrame(update);
}

// ----- Game Over -----
function gameOver() {
  shakeTimer=20;
  gameRunning=false;
  overlay.classList.remove("hidden");
  bestScore=Math.max(score,bestScore||0);
  localStorage.setItem("bestScore",bestScore);
  overlay.innerHTML = `<h1>Game Over!<br>Score: ${score}<br>Best: ${bestScore}<br>Tap or Press to Restart</h1>
    <p>Click 🌙 or ☀️ to change theme</p>`;
}

// ----- Controls -----
document.addEventListener("mousedown",startGame);
document.addEventListener("touchstart",startGame);
document.addEventListener("keydown",startGame);

// ----- Theme Toggle -----
themeToggle.addEventListener("click",()=>{
  isNight = !isNight;
  document.body.classList.toggle("night", isNight);
  document.body.classList.toggle("day", !isNight);

  // Fade title
  const title = document.querySelector(".game-title");
  title.style.opacity = 0;
  setTimeout(()=>{ title.style.opacity = isNight ? 0.85 : 1; },300);

  themeToggle.textContent = isNight ? "☀️" : "🌙";
});

// ----- Speech Bubble Messages -----
window.addEventListener("DOMContentLoaded", ()=>{
  const speechBubble = document.getElementById("speechBubble");
  const messages = [
    "Ready to fly?",
    "Don't hit the pipes!",
    "You're doing great!",
    "Tap to play!",
    "Can you beat your best score?",
    "Flap those wings!"
  ];

  setInterval(()=>{
    if(speechBubble){
      const msg = messages[Math.floor(Math.random()*messages.length)];
      speechBubble.textContent = msg;
    }
  },5000);
});

// ----- Initialize -----
bestScore = parseInt(localStorage.getItem("bestScore")) || 0;
resetGame();
update();
