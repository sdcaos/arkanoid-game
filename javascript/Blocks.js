class Blocks {
  constructor(ctx, canvasSize, indexPrint, lineBreack, switchControl, speedUp) {
    this.ctx = ctx;
    this.canvasSize = canvasSize;
    this.blockSize = { w: this.canvasSize.w / 16, h: this.canvasSize.h / 30 };
    this.blockPos = { x: undefined, y: undefined };
    this.destroy = false;
    this.linear_gradient = undefined;
    this.index = indexPrint;
    this.lineBreak = lineBreack;
    this.blockPowers = {
      switch: switchControl,
      speedUp: speedUp,
    };

    this.init();
  }

  init() {}

  draw(height) {
    height++;
    // this.blockPos.x = (this.index + lastIndex) * this.blockSize.w;
    this.blockPos.x = (this.index + this.lineBreak) * this.blockSize.w + 55;

    height % 2 === 0 ? (height *= 2) : null;
    this.blockPos.y = height * this.blockSize.h + 15;

    this.setBlockColor();

    this.ctx.fillStyle = this.linear_gradient;

    this.ctx.fillRect(this.blockPos.x, this.blockPos.y, this.blockSize.w, this.blockSize.h);
  }

  setBlockColor() {
    this.linear_gradient = this.ctx.createLinearGradient(0, 0, window.innerWidth / 2, window.innerHeight / 2);
    this.linear_gradient.addColorStop(0.1, 'black');
    this.linear_gradient.addColorStop(0.2, 'red');
    this.linear_gradient.addColorStop(0.3, 'yellow');
    this.linear_gradient.addColorStop(0.4, 'blue');
    this.linear_gradient.addColorStop(0.5, 'white');
    this.linear_gradient.addColorStop(0.6, 'black');
    this.linear_gradient.addColorStop(0.7, 'black');
    this.linear_gradient.addColorStop(0.8, 'red');
    this.linear_gradient.addColorStop(0.9, 'yellow');
    this.linear_gradient.addColorStop(1, 'blue');
  }
}
