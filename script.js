const character = document.getElementById('character');

// Position & input
let pos = { x: 376, y: 268 };
let keys = { ArrowUp:0, ArrowDown:0, ArrowLeft:0, ArrowRight:0 };

// Animation state
let state = {
  action: 'idle-front',   // one of idle-front, idle-back, etc.
  frame: 0
};

// Constants
const SPRITE = { w:48, h:64, frames:6 };
const SPEED  = 2;

// Input handlers
document.addEventListener('keydown', e => {
  if (e.key in keys) keys[e.key] = 1;
});
document.addEventListener('keyup', e => {
  if (e.key in keys) keys[e.key] = 0;
});

// Advance frame every 100ms
setInterval(() => {
  state.frame = (state.frame + 1) % SPRITE.frames;
  draw();
}, 100);

function update() {
  let dx = keys.ArrowRight - keys.ArrowLeft;
  let dy = keys.ArrowDown  - keys.ArrowUp;
  let moving = dx !== 0 || dy !== 0;

  // Decide facing priority: vertical when dy exists, else horizontal
  let facing;
  if      (dy <  0) facing = 'back';
  else if (dy >  0) facing = 'front';
  else if (dx <  0) facing = 'left';
  else if (dx >  0) facing = 'right';
  else              facing = state.action.split('-')[1]; 
    // keep last facing when stopped

  // Decide action
  let action = (moving ? 'walk' : 'idle') + '-' + facing;

  // On action change, reset frame
  if (action !== state.action) {
    state.action = action;
    state.frame  = 0;
  }

  // Move
  pos.x += dx * (moving ? SPEED : 0);
  pos.y += dy * (moving ? SPEED : 0);

  // Clamp to game area
  pos.x = Math.max(0, Math.min(800 - SPRITE.w, pos.x));
  pos.y = Math.max(0, Math.min(600 - SPRITE.h, pos.y));
}

function draw() {
  // Update position
  character.style.left = pos.x + 'px';
  character.style.top  = pos.y + 'px';

  // Swap CSS class
  character.className = state.action;

  // Set background offset
  let x = -state.frame * SPRITE.w;
  character.style.backgroundPosition = `${x}px 0`;
}

// Main loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
