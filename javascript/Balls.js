class Balls {
  constructor(ctx, canvasSize, ballPosx, ballPosy, ballSpeedX, ballSpeedY) {
    this.ctx = ctx;
    this.canvasSize = canvasSize;
    this.ballPos = { x: ballPosx, y: ballPosy };
    this.ballSize = { w: 15, h: 15 };
    this.ballSpeed = { x: ballSpeedX, y: ballSpeedY };
    this.image = new Image();
    this.image.src = './img/pelota.png';

    this.init();
  }
  init() {}

  draw() {
    this.ctx.drawImage(this.image, this.ballPos.x, this.ballPos.y, this.ballSize.w, this.ballSize.h);
  }

  move(elm) {
    elm.ballPos.x -= elm.ballSpeed.x;
    elm.ballPos.y -= elm.ballSpeed.y;
    // this.changeDirection = this.changeDirection.bind(elm);
    if (elm.ballPos.x <= 20 || elm.ballPos.x >= elm.canvasSize.w - elm.ballSize.w - 20) {
      // console.log('pared');
      this.changeDirection(' ', elm);
    } else if (elm.ballPos.y < 30) {
      // console.log('pared top');
      this.changeDirection('y', elm);
    }
  }

  changeDirection(direction, ball) {
    direction === 'y' ? (ball.ballSpeed.y *= -1) : (ball.ballSpeed.x *= -1);
  }
}
