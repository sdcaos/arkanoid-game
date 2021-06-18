class Powers {
  constructor(ctx, canvasSize, powerPosx) {
    this.ctx = ctx;
    this.canvasSize = canvasSize;
    this.powerPos = { x: powerPosx, y: -30 };
    this.powerSize = { w: 60, h: 60 };
    this.powerSpeed = 2;
    (this.destroy = false),
      ((this.image = new Image()),
      (this.image.src = './img/regalos.png'),
      (this.image.frames = 4),
      (this.image.framesIndex = 0),
      (this.randomPower = Math.floor(Math.random() * (4 - 1) + 1))),
      this.init();
  }

  init() {}

  draw(frames) {
    this.ctx.drawImage(
      this.image,
      this.image.framesIndex * Math.floor(this.image.width / this.image.frames),
      0,
      Math.floor(this.image.width / this.image.frames),
      this.image.height,
      this.powerPos.x,
      this.powerPos.y,
      this.powerSize.w,
      this.powerSize.h
    );

    this.animateSprite(frames);
  }

  animateSprite(frames) {
    if (frames % 10 == 0) {
      this.image.framesIndex++;
    }
    if (this.image.framesIndex >= this.image.frames) {
      this.image.framesIndex = 0;
    }
  }

  move() {
    this.powerPos.y += this.powerSpeed;
  }

  randomPowers() {
    return this.randomPower;
  }
}
