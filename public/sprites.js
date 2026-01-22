// Pixel art sprite renderer
const spriteData = {
  leachianus: [
    "  ████████████  ",
    " ██▓▓▓▓▓▓▓▓██  ",
    "██▓▓▓▓██▓▓▓▓██ ",
    "██▓▓██▓▓██▓▓██ ",
    "██████████████ ",
    "██▓▓▓▓▓▓▓▓▓▓██ ",
    " ████████████  ",
    " ██  ██  ██    ",
    "██  ██  ██     "
  ],
  gecko: [
    "    ████████    ",
    "  ██▓▓▓▓▓▓██  ",
    "  ██▓▓██▓▓██  ",
    "██████████████",
    "██▓▓▓▓▓▓▓▓▓▓██",
    "██▓▓▓▓▓▓▓▓▓▓██",
    "  ████  ████  ",
    " ██  ████  ██ ",
    "██          ██"
  ],
  ferret: [
    "  ████████████",
    " ██▓▓▓▓▓▓▓▓██",
    "██▓▓██▓▓██▓▓██",
    "██▓▓▓▓▓▓▓▓▓▓██",
    "██▓▓████████  ",
    " ██▓▓▓▓▓▓██  ",
    "  ████████    ",
    "  ██  ██      ",
    " ██  ██       "
  ],
  chinchilla: [
    "  ██████████  ",
    " ██▓▓▓▓▓▓▓▓██ ",
    "██▓▓██▓▓██▓▓██",
    "██▓▓▓▓▓▓▓▓▓▓██",
    "██▓▓▓▓████▓▓██",
    " ████▓▓▓▓████ ",
    "   ████████   ",
    "  ██  ██  ██  ",
    " ██  ██  ██   "
  ],
  parrot: [
    "      ████    ",
    "    ████████  ",
    "  ████▓▓▓▓██  ",
    "  ██▓▓██▓▓██  ",
    "██████▓▓▓▓████",
    "██▓▓▓▓▓▓▓▓▓▓██",
    "  ██▓▓▓▓▓▓██  ",
    "    ██████    ",
    "    ██  ██    "
  ],
  rabbit: [
    " ██      ██   ",
    " ██      ██   ",
    " ████████████ ",
    "██▓▓▓▓▓▓▓▓▓▓██",
    "██▓▓██▓▓██▓▓██",
    "██▓▓▓▓▓▓▓▓▓▓██",
    " ████▓▓▓▓████ ",
    "   ████████   ",
    "  ██  ██  ██  "
  ],
  hedgehog: [
    " ██ ██ ██ ██  ",
    "██████████████",
    "██▓▓▓▓▓▓▓▓▓▓██",
    "██▓▓██▓▓██▓▓██",
    "  ████▓▓▓▓████",
    "    ██▓▓▓▓██  ",
    "    ████████  ",
    "   ██  ██  ██ ",
    "  ██  ██  ██  "
  ],
  tortoise: [
    "    ████████  ",
    "  ████████████",
    " ██▓▓▓▓▓▓▓▓▓▓██",
    "██▓▓▓▓▓▓▓▓▓▓▓▓██",
    "██▓▓▓▓▓▓▓▓▓▓▓▓██",
    " ██▓▓▓▓▓▓▓▓▓▓██",
    "  ██████████  ",
    " ██  ██  ██   ",
    "██  ██  ██    "
  ],
  snake: [
    "              ",
    "    ████████  ",
    "  ████▓▓▓▓████",
    "██████▓▓▓▓████",
    "██▓▓██▓▓████  ",
    "██▓▓▓▓████    ",
    " ████████     ",
    "   ████       ",
    "              "
  ],
  iguana: [
    "██  ██  ██    ",
    "  ██████████  ",
    " ██▓▓▓▓▓▓▓▓██ ",
    "██▓▓██▓▓██▓▓██",
    "██▓▓▓▓▓▓▓▓▓▓██",
    " ████████████ ",
    "  ████  ████  ",
    " ██  ████  ██ ",
    "██          ██"
  ],
  capybara: [
    "  ████████████",
    " ██▓▓▓▓▓▓▓▓▓▓██",
    "██▓▓██▓▓██▓▓▓▓██",
    "██▓▓▓▓▓▓▓▓▓▓▓▓██",
    "██▓▓▓▓▓▓▓▓▓▓▓▓██",
    " ██████████████",
    "  ████  ████   ",
    " ██  ████  ██  ",
    "██          ██ "
  ]
};

function renderSprite(animalType, colors, canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const pixelSize = 8;
  const sprite = spriteData[animalType];

  if (!sprite) {
    console.error('Sprite not found:', animalType);
    return;
  }

  // Set canvas size
  canvas.width = 14 * pixelSize;
  canvas.height = 9 * pixelSize;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw sprite
  for (let y = 0; y < sprite.length; y++) {
    const row = sprite[y];
    let x = 0;
    let i = 0;

    while (i < row.length) {
      const char = row[i];

      if (char === '█') {
        // Primary color (outline/dark)
        ctx.fillStyle = colors[1];
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      } else if (char === '▓') {
        // Secondary color (body/light)
        ctx.fillStyle = colors[0];
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }
      // Space = transparent

      x++;
      i++;
    }
  }

  // Add glow effect
  ctx.shadowBlur = 20;
  ctx.shadowColor = colors[0];

  // Redraw for glow
  for (let y = 0; y < sprite.length; y++) {
    const row = sprite[y];
    let x = 0;
    let i = 0;

    while (i < row.length) {
      const char = row[i];

      if (char !== ' ') {
        const currentColor = char === '█' ? colors[1] : colors[0];
        ctx.fillStyle = currentColor;
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }

      x++;
      i++;
    }
  }
}

// Animate sprite with bobbing motion
function animateSprite(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  let offset = 0;
  let direction = 1;

  setInterval(() => {
    offset += direction * 0.5;
    if (offset > 3 || offset < -3) {
      direction *= -1;
    }
    canvas.style.transform = `translateY(${offset}px)`;
  }, 50);
}
