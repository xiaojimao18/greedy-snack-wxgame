import config from './config';
import Snack from './snack';
import Food from './food';

// 屏幕宽高
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

// 游戏区
const gamezoneWidth = config.size * config.width;
const gamezoneHeight = config.size * config.height;
const gamezoneX = (screenWidth - gamezoneWidth) / 2;
const gamezoneY= (screenHeight - gamezoneHeight) / 2;

// 游戏按钮
const buttonWidth = 100;
const buttonHeight = 40;
const marginButtom = 30;
const buttonX = gamezoneX;
const buttonY = gamezoneY - buttonHeight - marginButtom;

// 颜色
const backgroundColor = '#FAF8EF';
const primaryColor = '#6699CC'
  
const ctx = canvas.getContext('2d');

class Main {
  constructor() {
    config.gamezoneX = gamezoneX;
    config.gamezoneY = gamezoneY;

    this.frame = 0;
    this.score = 0;
    this.snack = new Snack();
    this.food = this.generateFood();

    // 渲染背景
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, screenWidth, screenHeight);

    // 游戏外框
    ctx.lineWidth = 4;
    ctx.strokeStyle = primaryColor;
    ctx.strokeRect(
      gamezoneX - 2,
      gamezoneY - 2,
      gamezoneWidth + 4,
      gamezoneHeight + 4,
    );

    this.renderButton('重新开始');
    this.renderScore();
    this.renderGamezone();

    canvas.addEventListener('touchmove', this.touchMove.bind(this), false);
    canvas.addEventListener('touchstart', this.touchStart.bind(this), false);
    canvas.addEventListener('touchstart', this.touchEventHandler.bind(this), false);

    this.start();
  }
  renderGamezone() {
    // 渲染游戏区
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(gamezoneX, gamezoneY, gamezoneWidth, gamezoneHeight);

    this.snack.drawToCanvas(ctx);
    this.food.drawToCanvas(ctx);
  }
  generateFood() {
    let x, y;
    do {
      x = Math.floor(Math.random() * config.width);
      y = Math.floor(Math.random() * config.height);
    } while(this.snack.onbody(x, y));

    return new Food({ x, y });
  }
  addScore(_score) {
    this.score += _score
    this.renderScore();
    if (this.score % 5 == 0) {
      this.snack.speedUp();
    }
  }
  loop() {
    if (this.frame ++ % this.snack.getSpeed() === 0) {
      if (!this.snack.move()) {
        this.fail();
        return;
      }
      if (this.snack.eat(this.food)) {
        this.addScore(this.food.score);
        this.food = this.generateFood();
      }
      this.renderGamezone();
    }
    this.aniId = window.requestAnimationFrame(() => {
      this.loop()
    }, canvas);
  }
  start(restart = false) {
    if (restart) {
      this.score = 0;
      this.frame = 0;
      this.snack.reset();
      this.food = this.generateFood();
      this.renderScore();
    }

    window.cancelAnimationFrame(this.aniId);
    this.aniId = window.requestAnimationFrame(() => {
      this.loop();
    }, canvas);
  }
  touchStart(e) {
    this.startX = e.targetTouches[0].pageX;
    this.startY = e.targetTouches[0].pageY;
    this.oneTouch = true;
  }
  touchMove(e) {
    e.preventDefault();

    if (this.oneTouch) {
      const moveX = e.targetTouches[0].pageX - this.startX;
      const moveY = e.targetTouches[0].pageY - this.startY;
      if (Math.abs(moveX) < Math.abs(moveY) && moveY < 0) { // 向上
        this.snack.pushDirection(0);
      } else if (Math.abs(moveX) > Math.abs(moveY) && moveX > 0) { // 向右
        this.snack.pushDirection(1);
      } else if (Math.abs(moveX) < Math.abs(moveY) && moveY > 0) { // 向下
        this.snack.pushDirection(2);
      } else { // 向左
        this.snack.pushDirection(3);
      } 
      this.oneTouch = false;
    }
  }
  touchEventHandler(e) {
    e.preventDefault();
    
    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;
    
    if (x >= buttonX && x <= buttonX + buttonWidth
      && y >= buttonY && y <= buttonY + buttonHeight
    ) {
      this.start(true);
    }
  }
  fail() {
    this.renderInfo('Game Over');
    this.renderButton('重新开始');
  }
  reset() {
    this.score = 0;
    ctx.clearRect(0, 0, gamezoneWidth, gamezoneHeight);
    
    // 先清除画布，再绘制蛇和食物
    this.snack.reset();
    this.food = this.generateFood();
  }
  renderInfo(text) {
    // 信息提示
    const infoX = gamezoneX + gamezoneWidth / 2;
    const infoY = gamezoneY + gamezoneHeight / 2;
    ctx.textAlign = 'center'
    ctx.font = '30px Arial';
    ctx.fillStyle = primaryColor;
    ctx.fillText( text, infoX, infoY);
  }
  renderButton(text) {
    // 渲染按钮
    ctx.fillStyle = primaryColor;
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    ctx.textAlign = 'center'
    ctx.font = '18px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, buttonX + buttonWidth / 2, buttonY + buttonHeight / 2 + 6);
  }
  renderScore() {
    const scoreWidth = 100;
    const scoreHeight = 50;
    const scoreX = gamezoneX + gamezoneWidth;
    const scoreY = gamezoneY - 60;

    // 清除分数
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(scoreX - scoreWidth, scoreY, scoreWidth, scoreHeight);
    
    ctx.textAlign = 'end';
    ctx.font = '24px Arial';
    ctx.fillStyle = primaryColor;
    ctx.fillText(`${this.score}`, gamezoneX + gamezoneWidth, gamezoneY - 40);
  }
}

export default Main;
