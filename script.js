const character = document.getElementById("character");

let posX = 376;
let posY = 268;
let frame = 0;
let direction = 0; // 0: down, 1: left, 2: right, 3: up
let currentAction = "idle";
let frameCount = 0;

const spriteSize = { width: 48, height: 64 };
const speed = {
  walk: 2,
  run: 4
};

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  Shift: false
};

function updateSprite() {
  let spriteSheet = `${currentAction}.png`;
  character.style.backgroundImage = `url('${spriteSheet}')`;
  character.style.backgroundPosition = `-${frame * spriteSize.width}px -${direction * spriteSize.height}px`;
}

function moveCharacter() {
  let dx = 0;
  let dy = 0;

  currentAction = "idle";

  if (keys.ArrowUp) {
    dy = -1;
    direction = 3;
    currentAction = keys.Shift ? "run" : "walk";
  } else if (keys.ArrowDown) {
    dy = 1;
    direction = 0;
    currentAction = keys.Shift ? "run" : "walk";
  }

  if (keys.ArrowLeft) {
    dx = -1;
    direction = 1;
    currentAction = keys.Shift ? "run" : "walk";
  } else if (keys.ArrowRight) {
    dx = 1;
    direction = 2;
    currentAction = keys.Shift ? "run" : "walk";
  }

  let moveSpeed = currentAction === "run" ? speed.run : (currentAction === "walk" ? speed.walk : 0);

  posX += dx * moveSpeed;
  posY += dy * moveSpeed;

  character.style.left = posX + "px";
  character.style.top = posY + "px";

  frameCount++;
  if (frameCount % 10 === 0) {
    frame = (frame + 1) % 6;
  }

  updateSprite();
}

setInterval(moveCharacter, 1000 / 60);

document.addEventListener("keydown", (e) => {
  if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
});
