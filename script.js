const character = document.getElementById('character');
let pos = { x: 376, y: 268 };
let keys = { ArrowUp:0, ArrowDown:0, ArrowLeft:0, ArrowRight:0 };

let state = {
  action: 'idle-down',   // default is idle facing down
  direction: 0,          // 0=down,1=left,2=right,3=up
  frame: 0,
};

const SPRITE = { w:48, h:64, framesPerRow:6 };
const SPEED  = { walk:2 };  // Only walking speed now

// handle key events
document.addEventListener('keydown', e => {
  if (e.key in keys) keys[e.key] = 1;
});
document.addEventListener('keyup', e => {
  if (e.key in keys) keys[e.key] = 0;
});

// animation timer: advance frame every 100ms
setInterval(() => {
  state.frame = (state.frame + 1) % SPRITE.framesPerRow;
  drawSprite();
}, 100);

function updateState() {
  // decide movement vector
  let dx = (keys.ArrowRight - keys.ArrowLeft);
  let dy = (keys.ArrowDown  - keys.ArrowUp);

  // determine direction (priority: horizontal over vertical)
  if      (dx > 0) state.direction = 2;  // Right
  else if (dx < 0) state.direction = 1;  // Left
  else if (dy > 0) state.direction = 0;  // Down
  else if (dy < 0) state.direction = 3;  // Up

  // decide action
  let moving = dx !== 0 || dy !== 0;
  let want   = moving ? `walk-${['down', 'left', 'right', 'up'][state.direction]}` : `idle-${['down', 'left', 'right', 'up'][state.direction]}`;

  // on action-change, reset frame
  if (want !== state.action) {
    state.action = want;
    state.frame  = 0;
  }

  // apply movement
  let spd = moving ? SPEED.walk : 0;
  pos.x += dx * spd;
  pos.y += dy * spd;

  // clamp inside game area (800×600 minus sprite size)
  pos.x = Math.max(0, Math.min(800 - SPRITE.w, pos.x));
  pos.y = Math.max(0, Math.min(600 - SPRITE.h, pos.y));
}

function drawSprite() {
  // update position
  character.style.left = pos.x + 'px';
  character.style.top  = pos.y + 'px';

  // swap CSS class for correct idle or walking animation
  character.className = state.action;

  // compute background-position
  let x = -state.frame * SPRITE.w;
  let y = -state.direction * SPRITE.h;
  character.style.backgroundPosition = `${x}px ${y}px`;
}

// main game loop: 60fps movement + redraw
function gameLoop() {
  updateState();
  drawSprite();
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
