// Get the context of the canvas
let ctx = canvas.getContext("2d");

// Set canvas width and height to the inner width and height of the window
let cw = (canvas.width = window.innerWidth);
let ch = (canvas.height = window.innerHeight);

// Variable to hold request animation frame id
let rid = null;
ctx.fillStyle = "hsla(0, 5%, 5%, .025)";

// Function to calculate the oscillating hue value over time
function oscillateHue(hue1, hue2, period) {
    const currentTime = Date.now(); // Get current time in milliseconds
    const oscillation = Math.sin(currentTime / period * 2 * Math.PI); // Oscillates between -1 and 1
    return ((oscillation + 1) / 2) * (hue2 - hue1) + hue1; // Normalize to 0-1 and scale to hue range
  }



// Particle class to handle individual particles
class Particle {
  constructor() {
    // Initial position is random within the canvas
    this.pos = { x: Math.random() * cw, y: Math.random() * ch };

    // Initial velocity is 0
    this.vel = { x: 0, y: 0 };

    // Random base speed and lifetime
    this.base = (1 + Math.random()) * 3;
    this.life = randomIntFromInterval(5, 20);

    // Dark green color
    this.color = Math.random() < .1 ? "hsla(120,90%,30%,1)" : "hsla(120,50%,20%,.7)"

    // History to keep track of positions
    this.history = [];
  }

  // Function to update particle's position
  update() {
    // Adding current position to history
    this.history.push({ x: this.pos.x, y: this.pos.y });

    // Updating position by adding velocity
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  // Function to show/render the particle
  show() {
    this.life--;

    // Dynamic hue assignment based on oscillation
    const hue = oscillateHue(120, 240, 10000); // Oscillates between 120 and 240 over 10 seconds
    this.color = Math.random() < .1 ? `hsla(${hue},90%,30%,1)` : `hsla(${hue},50%,20%,.7)`;

    ctx.beginPath();
    let last = this.history.length - 1;
    ctx.moveTo(this.history[last].x, this.history[last].y);
    for (let i = last; i > 0; i--) {
      ctx.lineTo(this.history[i].x, this.history[i].y);
    }
    ctx.strokeStyle = this.color;
    ctx.stroke();

    // Remove oldest position if history gets too long
    if (this.history.length > this.life) this.history.splice(0, 1);
  }

  // Function to handle particles going off the edges
  edges() {
    // If particle goes off edge, reset position and history
    if (
      this.pos.x > cw ||
      this.pos.x < 0 ||
      this.pos.y > ch ||
      this.pos.y < 0
    ) {
      this.pos.y = Math.random() * ch;
      this.pos.x = Math.random() * cw;
      this.history.length = 0;
    }

    // If life runs out, reset position and life
    if (this.life <= 0) {
      this.pos.y = Math.random() * ch;
      this.pos.x = Math.random() * cw;
      this.life = randomIntFromInterval(5, 20);
      this.history.length = 0;
    }
  }

  // Function to make particle follow the flow field
  follow() {
    let x = ~~(this.pos.x / size);
    let y = ~~(this.pos.y / size);
    let index = x + y * cols;

    let angle = flowField[index];

    // Updating velocity based on flow field
    this.vel.x = this.base * Math.cos(angle);
    this.vel.y = this.base * Math.sin(angle);
  }
}

// Array to hold particles
let particles = [];

let size = 15; // Size of flow field cells
let rows = ~~(ch / size) + 2;
let cols = ~~(cw / size) + 2;

// Flow field array
let flowField = [];

// Function to get angle for flow field
function getAngle(x, y) {
  return (Math.cos(x * 0.05) + Math.cos(y * 0.05)) * Math.PI / 2;
}

// Function to populate the flow field
function getFlowField(rows, cols) {
  for (y = 0; y <= rows; y++) {
    for (x = 0; x < cols; x++) {
      let index = x + y * cols;
      let a = getAngle(x * size, y * size);

      flowField[index] = a;
    }
  }
}

// Populate the flow field
getFlowField(rows, cols);

// Creating particles
for (let i = 0; i < 1000; i++) {
  particles.push(new Particle());
}

// Function to animate the particles
function frame() {
  rid = requestAnimationFrame(frame);

  // Drawing the particles
  ctx.fillRect(0, 0, cw, ch);

  particles.map(p => {
    p.follow();
    p.update();
    p.show();
    p.edges();
  });
}

// Initialize the animation
function Init() {
  cw = canvas.width = window.innerWidth;
  ch = canvas.height = window.innerHeight;
  
  ctx.fillStyle = "hsla(0, 5%, 5%, .025)";

  rows = ~~(ch / size) + 2;
  cols = ~~(cw / size) + 2;

  // Resetting flow field and particles
  flowField = new Array(rows * cols);
  getFlowField(rows, cols);

  if (rid) {
    window.cancelAnimationFrame(rid);
    rid = null;
  }
  frame();
}

// Setting up initial animation after a slight delay
window.setTimeout(function() {
  Init();

  // Handling window resize event
  window.addEventListener("resize", Init, false);
}, 15);

// Function to get a random integer within a range
function randomIntFromInterval(mn, mx) {
  return Math.floor(Math.random() * (mx - mn + 1) + mn);
}