import config from './config';

class Food {
  constructor({ x, y, size = config.size, score = 1, color = '#3f51b5'}) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.score = score;
    this.color = color;
  }
  drawToCanvas(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.x * this.size + config.gamezoneX,
      this.y * this.size + config.gamezoneY,
      this.size,
      this.size,
    );
  }
}

export default Food;
