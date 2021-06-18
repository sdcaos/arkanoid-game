class Background {
  constructor(ctx, canvasSize) {
    this.ctx = ctx;
    (this.image = new Image()), (this.image.src = './img/fondo Arkanoid- Fields.png');
    this.canvasSize = canvasSize;
    this.image.frames = 5;
    this.image.framesIndex = 0;
    this.init();
  }

  init() {
    this.imageInstance = new Image();
    // this.imageInstance.src = this.backgroundImage
  }

  draw(frames) {
    this.ctx.drawImage(
      this.image,
      this.image.framesIndex * Math.floor(this.image.width / this.image.frames),
      0,
      Math.floor(this.image.width / this.image.frames),
      this.image.height,
      0,
      0,
      this.canvasSize.w,
      this.canvasSize.h
    );
    this.backgroundSprite(frames);
  }

  backgroundSprite(frames) {
    if (frames % 5000 === 0) this.image.framesIndex++;
    if (this.image.framesIndex >= this.image.frames) {
      this.image.framesIndex = 0;
    }
  }
}
