class Player {
  constructor(ctx, playerWidth, playerHeight, playerPosX, canvasSize) {
    this.ctx = ctx;
    this.playerSize = { w: playerWidth, h: playerHeight };
    this.canvasSize = canvasSize;
    this.image = new Image();
    this.image.src = './img/playerretocado.png'
    this.playerPos = {
      x: playerPosX,
      y: this.canvasSize.h - this.playerSize.h - 10,
    };

    //   this.imageInstance = new Image().src = this.playerImage
    // this.playerSpeed = { x: 10, y: 1 }
    //this.playerPhysics = { gravity: .4 }

    this.init();
  }
  init() { }

  draw() {
  
    this.ctx.drawImage(this.image, this.playerPos.x, this.playerPos.y, this.playerSize.w, this.playerSize.h);
  }

  smallPlayer() {
    this.playerSize.w /= 2;

    setTimeout(() => {
      this.playerSize.w *= 2;
    }, 10000);
  }
}
