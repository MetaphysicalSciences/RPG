const canvas = document.getElementById('canvas');
const ctx    = canvas.getContext('2d');

// Character position
let pos = { x: 376, y: 268 };

// Input state
let keys = { ArrowUp:0, ArrowDown:0, ArrowLeft:0, ArrowRight:0 };

// Load all eight images
const images = {};
const actions = [
  'IdleFront','IdleBack','IdleLeft','IdleRight',
  'WalkFront','WalkBack','WalkLeft','WalkRight'
];
actions.forEach(name => {
  const img = new Image();
  img.src = name + '.png';
  images[name] = img;
});

// Animation state
let state = {
  action: 'IdleFront',   // matches a key in `images`
  frame: 0
};

const SPRITE = { w:48, h:64, frames:6 };
const SPEED  = 2;

// Key handlers
document.addEventListener('keydown', e => {
  if (e.key in keys) keys[e.key] = 1;
});
document.addEventListener('keyup', e => {
  if (e.key in keys) keys[e.key] = 0;
});

// Advance animation frame every 100ms
setInterval(() => {
  state.frame = (state.frame + 1) % SPRITE.frames;
}, 100);

function update() {
  // Determine movement
  let dx = keys.ArrowRight - keys.ArrowLeft;
  let dy = keys.ArrowDown  - keys.ArrowUp;
  let moving = dx !== 0 || dy !== 0;

  // Decide facing
  let face;
  if      (dy <  0) face = 'Back';
  else if (dy >  0) face = 'Front';
  else if (dx <  0) face = 'Left';
  else if (dx >  0) face = 'Right';
  else {
    // keep last face (strip “Idle|Walk” from action)
    face = state.action.replace(/^Idle|Walk/, '');
  }

  // Decide new action
  let act = (moving ? 'Walk' : 'Idle') + face;
  if (act !== state.action) {
    state.action = act;
    state.frame  = 0;
  }

  // Move
  if (moving) {
    pos.x += dx * SPEED;
    pos.y += dy * SPEED;
    // clamp
    pos.x = Math.max(0, Math.min(800 - SPRITE.w, pos.x));
    pos.y = Math.max(0, Math.min(600 - SPRITE.h, pos.y));
  }
}

function draw() {
  // clear entire game‐canvas region around our sprite
  // (we could optimize to only clear the old rect, but this is fine)
  ctx.clearRect(0, 0, SPRITE.w, SPRITE.h);

  // draw the current frame from the current image
  const img = images[state.action];
  ctx.drawImage(
    img,
    state.frame * SPRITE.w,  // source x
    0,                       // source y
    SPRITE.w,                // source w
    SPRITE.h,                // source h
    0, 0,                    // dest x,y in canvas
    SPRITE.w, SPRITE.h       // dest w,h
  );

  // reposition the canvas element in the DOM
  canvas.style.left = pos.x + 'px';
  canvas.style.top  = pos.y + 'px';
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// start
loop();
