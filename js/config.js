const config = {
  size: 13,
  width: 20,
  height: 20,
  gamezoneY: 0,
  gamezoneX: 0,
};

!function() {
  // 按键调整方向
  function keyDirection(e) {
    switch(e.keyCode) {
      case 38: snack.pushDirection(0); break; // 向上
      case 39: snack.pushDirection(1); break; // 向右
      case 40: snack.pushDirection(2); break; // 向下
      case 37: snack.pushDirection(3); break; // 向左
    }
  }

  // 开始按钮事件
  function startControl() {
    var status = game.getStatus();
    
    if (status == '' || status == 'pause') {
      // 第一次开始
      game.start();
    } else if (status == 'fail' || status == 'success') {
      // 并不是第一次，清除上一次记录再开始
      game.reset();
      game.start();
    } else if (status == 'start') {
      game.pause();
    }
  }
}();

export default config;
