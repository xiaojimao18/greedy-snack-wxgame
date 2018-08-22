import config from './config'

const dirQueueMax = 3;  // 待处理方向队列最大长度

class Snack {
  constructor(length = 5) {
    this.reset(length);
  }
  reset(length = 5) {
    this.track = []; // 蛇身轨迹
    for (let i = 0; i < length; i ++) {
      this.track.push({ x: i, y: 0 });
    }
    // 新建对象，修改head不影响track
    this.head = { x: length - 1, y: 0};

    this.speed = 20; // 蛇的速度
    this.dirQueue = []; // 待处理方向队列
    this.direction = 1; // 方向：0-上;1-右;2-下;3-左
  }
  drawToCanvas(ctx) {
    ctx.fillStyle = "#333";
    for (const part of this.track) {
      ctx.fillRect(
        part.x * config.size + config.gamezoneX,
        part.y * config.size + config.gamezoneY,
        config.size,
        config.size
      );
    }
  }
  speedUp() {
    if (this.speed > 2) {
      this.speed -= 2;
    }
  }
  getSpeed() {
    return this.speed;
  }
  pushDirection(dir) {
    if (this.dirQueue.length < dirQueueMax) {
      this.dirQueue.push(dir);   
    }
  }
  move() {
    // 根据方向队列改变方向
    while (this.dirQueue.length > 0) {
      var dir = this.dirQueue.shift();
      if (dir == this.direction || Math.abs(this.direction - dir) == 2) {
        // 相同方向或者相反，则不改变方向
        continue;
      } else {
        this.direction = dir;
        break;
      }
    }
  
    // 根据方向移动
    switch(this.direction) {
      case 0: this.head.y -= 1; break;
      case 1: this.head.x += 1; break;
      case 2: this.head.y += 1; break;
      case 3: this.head.x -= 1; break;
    }
    
    // 如果撞到墙壁或者自己，则失败
    if (this.crash()) {
      return false;
    }
  
    this.track.push({ x: this.head.x, y: this.head.y });
    this.tail = this.track.shift();

    return true;
  }
  eat(food) {
    if (this.head.x == food.x && this.head.y == food.y) {
      this.track.splice(0, 0, this.tail);
      return true;
    } else {
      return false;
    }
  }
  onbody(_x, _y) {
    for (var i = 0; i < this.track.length; i ++) {
      if (this.track[i].x == _x && this.track[i].y == _y) {
        return true;
      }
    }
  
    return false;
  }
  // 撞到墙壁或者自己
  crash() {
    if (this.head.x < 0 || this.head.x >= config.width) {
      return true;
    } else if (this.head.y < 0 || this.head.y >= config.height) {
      return true;
    }
  
    return this.onbody(this.head.x, this.head.y);
  }
}

export default Snack;
