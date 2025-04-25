const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const FRAME_WIDTH = 48;
const FRAME_HEIGHT = 64;
const FRAME_COUNT = 8;
const SPEED = 2;

const directions = ["Front", "Back", "Left", "Right"];
const player = {
  x: canvas.width / 2 - FRAME_WIDTH / 2,
  y: canvas.height / 2 - FRAME_HEIGHT / 2,
  dir: "Front",
  frame: 0,
  frameTimer: 0,
  frameDelay: 100,
  moving: false,
};

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

const sprites = {};

function loadImages(callback) {
  let loaded = 0;
  const total = directions.length * 2;
  directions.forEach((dir) => {
    ["Idle", "Walk"].forEach((state) => {
      const key = state + dir;
      const img = new Image();
      img.onload = () => {
        loaded++;
        if (loaded === total) callback();
      };
      img.src = `${key}.png`;
      sprites[key] = img;
    });
  });
}

function update(delta) {
  let dx = 0, dy = 0;

  if (keys.ArrowUp) dy -= 1;
  if (keys.ArrowDown) dy += 1;
  if (keys.ArrowLeft) dx -= 1;
  if (keys.ArrowRight) dx += 1;

  player.moving = dx !== 0 || dy !== 0;

  if (dy < 0) player.dir = "Back";
  else if (dy > 0) player.dir = "Front";
  else if (dx < 0) player.dir = "Left";
  else if (dx > 0) player.dir = "Right";

  if (player.moving) {
    player.x += dx * SPEED;
    player.y += dy * SPEED;
    player.frameTimer += delta;
    if (player.frameTimer >= player.frameDelay) {
      player.frame = (player.frame + 1) % FRAME_COUNT;
      player.frameTimer = 0;
    }
  } else {
    player.frame = 0;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const action = (player.moving ? "Walk" : "Idle") + player.dir;
  const sprite = sprites[action];

  ctx.drawImage(
    sprite,
    player.frame * FRAME_WIDTH, 0,
    FRAME_WIDTH, FRAME_HEIGHT,
    player.x, player.y,
    FRAME_WIDTH, FRAME_HEIGHT
  );
}

let lastTime = 0;
function loop(timestamp) {
  const delta = timestamp - lastTime;
  lastTime = timestamp;

  update(delta);
  draw();
  requestAnimationFrame(loop);
}

document.addEventListener("keydown", (e) => {
  if (e.key in keys) keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
  if (e.key in keys) keys[e.key] = false;
});

loadImages(() => {
  requestAnimationFrame(loop);
});
