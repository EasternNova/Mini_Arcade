class LavenderParticles {
  constructor() {
    this.canvas = document.getElementById('lavender-canvas');
    this.ctx = this.canvas.getContext('2d');

    this.config = {
      count: 10,
      size: { min: 1200, max: 1600, pulse: 0 },
      speed: {
        x: { min: 0.4, max: 2.2 },
        y: { min: 0.4, max: 2.2 }
      },
      colors: {
        background: '#d8bffd',
        particles: ['#c084fc', '#e9d5ff', '#a78bfa', '#f3e8ff','#b16cff']
      },
      blending: 'lighten',
      opacity: { center: 0.85, edge: 0.12 },
      skew: -1.5
    };

    this.particles = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.createParticles();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.background = this.config.colors.background;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.config.count; i++) {
      this.particles.push(new LavenderParticle(this));
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalCompositeOperation = this.config.blending;
    this.particles.forEach(p => p.update(this.ctx));
    this.ctx.globalCompositeOperation = 'screen';
  }
}

class LavenderParticle {
  constructor(system) {
    this.system = system;
    this.reset();
  }

    reset() {
    this.x = Math.random() * this.system.canvas.width;
    this.y = Math.random() * this.system.canvas.height;
    this.size = Math.random() * 300 + 500;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
    this.color = this.system.config.colors.particles[
      Math.floor(Math.random() * this.system.config.colors.particles.length)
    ];
  }


  update(ctx) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > this.system.canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > this.system.canvas.height) this.vy *= -1;

    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.size
    );

    gradient.addColorStop(0, `${this.color}B3`);
    gradient.addColorStop(1, `${this.color}00`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
    ctx.fill();
  }
}
