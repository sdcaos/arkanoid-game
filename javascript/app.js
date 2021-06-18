//aquí van las vidas y el score también

const app = {
  title: 'Arkanoid ',
  author: 'Salva y Javi',
  license: undefined,
  version: '1.0.0',
  desciption: 'Physics app',
  canvasDom: undefined,
  ctx: undefined,
  canvasSize: { w: undefined, h: undefined },
  balls: [],
  intervalID: [],
  blocks: [],
  powers: [],
  framesCounter: 0,
  lifesCounter: 2,
  score: 0,
  pauseBall: true,
  switchedDirection: false,
  level: 0,
  miStorage: window.localStorage,
  audioContext: new AudioContext(),
  audioNewLife: new Audio('./sounds/life.wav'),
  audioSwitchDirection: new Audio('./sounds/switchDirection.wav'),
  audioMultiBall: new Audio('./sounds/multiBall.wav'),
  audioSmallPlayer: new Audio('./sounds/smallBar.wav'),
  audioSpeedUp: new Audio('./sounds/speedUp.wav'),
  audioLevelUp: new Audio('./sounds/levelUp.mp3'),
  audioHitBlock: new Audio('./sounds/hitBlock.wav'),
  audioGameOver: new Audio('./sounds/gameOver.mp3'),

  // Metodo init, se lanza al cargar la pagina, y nos permite movernos con la pelota pegada
  init() {
    this.setContext();
    this.setDimensions();
    this.createdInitialSources();
    this.intervalStart();
    this.setScore();
  },

  playSound(sound) {
    // Show loading animation.
    let playPromise = sound.play();

    if (playPromise !== undefined) {
      playPromise
        .then(_ => {
          // Automatic playback started!
          // Show playing UI.
        })
        .catch(error => {
          console.log(error);
        });
    }
  },

  intervalStart() {
    let intervalID = setInterval(() => {
      this.clearScreen();
      this.drawAll();
      this.clearItems();
      this.powers.forEach(elm => elm.move());
      this.checkCollision();
    }, 1000 / 50);

    this.intervalID.push(intervalID);
  },

  //   metodo launhc, cuando pulsamos espacio, detiene el primer interval y inicia start donde la pelota empieza a moverse.
  launch() {
    this.clearIntervals();
    //clearInterval(this.intervalNumber)
    this.start();
  },

  clearIntervals() {
    const intervalNumber = this.intervalID.pop();
    clearInterval(intervalNumber);
  },

  setContext() {
    this.canvasDom = document.getElementById('canvas');
    this.ctx = this.canvasDom.getContext('2d');
  },

  setDimensions() {
    this.canvasSize.w = window.innerWidth / 2;
    this.canvasSize.h = window.innerHeight;
    this.canvasDom.setAttribute('width', this.canvasSize.w);
    this.canvasDom.setAttribute('height', this.canvasSize.h);
  },

  setEventListeners() {
    document.addEventListener('keydown', e => {
      if (e.code === 'Space') this.launch();
      if (e.code === 'ArrowLeft') this.moveLeft(this.switchedDirection);
      if (e.code === 'ArrowRight') this.moveRight(this.switchedDirection);
    });
    document.querySelector('.buttonName').addEventListener('click', () => {
      this.addName();
    });
    document.querySelector('.buttonReset').addEventListener('click', () => {
      this.resetGame();
    });

    document.querySelector('h2').addEventListener('click', this.resetScore.bind(this));
  },

  newBall() {
    this.balls.push(new Balls(this.ctx, this.canvasSize, this.player.playerPos.x + this.player.playerSize.w / 2, this.player.playerPos.y - 15, 3 + this.level, 3 + this.level));
  },

  newBlocks() {
    //1er for pushea hasta 10 nuevo arrays dentro del general.
    for (let i = 0; i <= 9; i++) {
      //2º for pushea hasta 10 bloques por cada uno de los 10 arrays creados antes[dentro del general]
      for (let index = 0; index <= 15; index++) {
        this.blocks[i].push(
          new Blocks(
            this.ctx,
            this.canvasSize,
            index,
            Math.floor(Math.random() * (2 - 0) + 0),
            Math.floor(Math.random() * (30 - 0) + 0),
            Math.floor(Math.random() * (30 - 0) + 0)
            // primer random para saltar lineas,--------- segundo el switch de la direccion del player,-------- tercero ballSpeed
          )
        );
      }
    }
  },

  createdInitialSources() {
    // this.balls = [];

    this.background = new Background(this.ctx, this.canvasSize);

    this.player = new Player(this.ctx, this.canvasSize.w / 5, 8, this.canvasSize.w / 2 - 50, this.canvasSize, undefined);

    this.balls.push(new Balls(this.ctx, this.canvasSize, this.player.playerPos.x + this.player.playerSize.w / 2, this.player.playerPos.y - 15, 3 + this.level, 3 + this.level));

    for (let indexOut = 0; indexOut <= 10; indexOut++) {
      if (this.blocks.length < 9) {
        //1er for pushea hasta 10 nuevo arrays dentro del general.
        for (let i = 0; i <= 9; i++) {
          this.blocks.push([]);
          //2º for pushea hasta 10 bloques por cada uno de los 10 arrays creados antes[dentro del general]
          for (let index = 0; index <= 19; index++) {
            this.blocks[i].push(
              new Blocks(
                this.ctx,
                this.canvasSize,
                index,
                Math.floor(Math.random() * (2 - 0) + 0),
                Math.floor(Math.random() * (30 - 0) + 0),
                Math.floor(Math.random() * (30 - 0) + 0)
                // primer random para saltar lineas,--------- segundo el switch de la direccion del player,-------- tercero ballSpeed
              )
            );
          }
        }
      }
    }

    //aquí vendrán más balls o lo que sea
  },

  start() {
    this.pauseBall = false;
    let intervalID = setInterval(() => {
      this.framesCounter > 5000 ? (this.framesCounter = 0) : this.framesCounter++;
      this.clearScreen();
      this.drawAll();
      this.generatePowderBoxes();
      this.moveAll();
      this.checkCollision();

      this.clearItems();
      this.gameOver();

      if (this.framesCounter % 5000 === 0) {
        this.level++;
        this.background.backgroundSprite(5000);
        this.playSound(this.audioLevelUp);
        setTimeout(() => {
          this.newBlocks();
        }, 1500);
      }
    }, 1000 / 60);
    this.intervalID.push(intervalID);
  },

  // aquí empieza setInterval
  clearScreen() {
    this.ctx.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h);
  },

  drawAll() {
    this.background.draw(this.framesCounter);
    this.player.draw();
    this.blocks.forEach((elm, i) => elm.forEach(elm => elm.draw(i)));
    this.balls.forEach(elm => elm.draw());
    this.powers.forEach(elm => elm.draw(this.framesCounter));
  },

  //elm itera sobre los elementos del array
  //i itera sobre el valor en si de los índices

  moveAll() {
    this.balls.forEach(elm => elm.move(elm));

    this.powers.forEach(elm => elm.move());
  },

  destroyBlock(block) {
    block.destroy = true;
  },
  destroyPower(power) {
    power.destroy = true;
  },

  clearItems() {
    this.balls = this.balls.filter(ball => ball.ballPos.y < this.canvasSize.h - 13 && ball.ballPos.y > 10 && ball.ballPos.x > 10 && ball.ballPos.x < this.canvasSize.w - 10);
    // this.balls = this.balls.filter(ball => );
    // this.balls = this.balls.filter(ball => );
    // this.balls = this.balls.filter(ball => );

    for (let i = 0; i < this.blocks.length; i++) {
      this.blocks[i] = this.blocks[i].filter(elm => elm.blockPos.x <= this.canvasSize.w - elm.blockSize.w - 40 && elm.destroy === false);
    }
    this.powers = this.powers.filter(box => box.powerPos.y < this.canvasSize.h && box.destroy === false);
  },

  // hasta aquí set interval

  moveRight(switched) {
    this.audioContext.resume();

    // ---------
    if (!switched && this.player.playerPos.x < this.canvasSize.w - this.player.playerSize.w) {
      this.player.playerPos.x += 20;
    }
    if (switched && this.player.playerPos.x > 40) {
      this.player.playerPos.x -= 20;
    }

    if (this.pauseBall) {
      //
      this.ballStickToPlayer();
    }
  },

  moveLeft(switched) {
    // -------------------

    this.audioContext.resume();

    // ----------

    if (!switched && this.player.playerPos.x > 0) {
      this.player.playerPos.x -= 20 - this.level;
    }
    if (switched && this.player.playerPos.x < this.canvasSize.w - this.player.playerSize.w) {
      this.player.playerPos.x += 20 + this.level;
    }

    if (this.pauseBall) {
      this.ballStickToPlayer();
    }
  },

  ballStickToPlayer() {
    this.balls.forEach(elm => (elm.ballPos.x = this.player.playerPos.x + this.player.playerSize.w / 2));
  },

  checkCollision() {
    this.balls.forEach(elm => {
      if (
        this.player.playerPos.x < elm.ballPos.x + 5 &&
        this.player.playerPos.x + this.player.playerSize.w / 3 > elm.ballPos.x && // izquierda
        //this.player.playerPos.x + this.player.playerSize.w > elm.ballPos.x && // derecha
        this.player.playerPos.y < elm.ballPos.y + elm.ballSize.h // arriba
        // this.player.playerSize.h + this.player.playerPos.y > elm.ballPos.y // abajo
      ) {
        // console.log('parte izq de la barra');
        if (elm.ballSpeed.x > 0) {
          elm.changeDirection('y', elm);
        } else {
          elm.changeDirection(' ', elm);
          elm.ballSpeed.x++;
          elm.changeDirection('y', elm);
        }
      } else if (
        this.player.playerPos.x + this.player.playerSize.w > elm.ballPos.x &&
        this.player.playerPos.x + this.player.playerSize.w - this.player.playerSize.w / 3 < elm.ballPos.x && // derecha
        this.player.playerPos.y < elm.ballPos.y + elm.ballSize.h // arriba
        //this.player.playerSize.h + this.player.playerPos.y > elm.ballPos.y // abajo
      ) {
        // console.log('derecha de la barra');
        if (elm.ballSpeed.x < 0) {
          elm.changeDirection('y', elm);
        } else {
          elm.changeDirection(' ', elm);
          elm.ballSpeed.x--;
          elm.changeDirection('y', elm);
        }
      } else {
        // console.log('centro');
        if (
          this.player.playerPos.x < elm.ballPos.x + 5 &&
          this.player.playerPos.x + this.player.playerSize.w > elm.ballPos.x &&
          this.player.playerPos.y < elm.ballPos.y + elm.ballSize.h
          // this.player.playerSize.h + this.player.playerPos.y > elm.ballPos.y
        ) {
          elm.changeDirection('y', elm);
        }
      }
    });

    this.blocks.forEach(elm =>
      elm.forEach(block => {
        this.balls.forEach(ball => {
          if (
            block.blockPos.x <= ball.ballPos.x + 3 &&
            block.blockPos.x + block.blockSize.w >= ball.ballPos.x - 3 &&
            ball.ballPos.y >= block.blockPos.y &&
            ball.ballPos.y <= block.blockPos.y + block.blockSize.h
          ) {
            ball.changeDirection(' ', ball);
            this.destroyBlock(block);
            this.playSound(this.audioHitBlock);
            this.switchControls(block);
            this.speedUp(block);
            this.addScore();
          }

          if (
            block.blockPos.y < ball.ballPos.y + ball.ballSize.h - 5 &&
            block.blockSize.h + block.blockPos.y > ball.ballPos.y - 5 &&
            ball.ballPos.x - 5 > block.blockPos.x &&
            ball.ballPos.x < block.blockPos.x + block.blockSize.w + 5
          ) {
            ball.changeDirection('y', ball);
            this.destroyBlock(block);
            this.playSound(this.audioHitBlock);
            this.switchControls(block);
            this.speedUp(block);
            this.addScore();
          }
        });
      })
    );

    this.powers.forEach(elm => {
      if (
        this.player.playerPos.x < elm.powerPos.x + elm.powerSize.w &&
        this.player.playerPos.x + this.player.playerSize.w > elm.powerPos.x &&
        this.player.playerPos.y < elm.powerPos.y + elm.powerSize.h &&
        this.player.playerSize.h + this.player.playerPos.y > elm.powerPos.y
      ) {
        this.destroyPower(elm);
        this.boxPowers(elm.randomPowers());
      }
    });
  },
  // POWDERS

  switchControls(block) {
    if (block.blockPowers.switch === 6) {
      this.playSound(this.audioSwitchDirection);
      this.switchedDirection = true;
    }
    setTimeout(() => {
      this.switchedDirection = false;
    }, 9000);
  },

  speedUp(block) {
    if (block.blockPowers.speedUp === 6) {
      this.playSound(this.audioSpeedUp);
      this.balls.forEach(elm => {
        elm.ballSpeed.x *= 1.3;
        elm.ballSpeed.y *= 1.3;
        setTimeout(() => {
          // buscar solucion, si esta bajando sube
          elm.ballSpeed.x > 0 ? (elm.ballSpeed.x = 3 + this.level) : (elm.ballSpeed.x = -3 - this.level);
          elm.ballSpeed.y > 0 ? (elm.ballSpeed.y = 3) : (elm.ballSpeed.y = -3 - this.level);
        }, 3000);
      });
    }
  },

  boxPowers(randomNum) {
    this.score += 200;
    if (randomNum === 1 && this.lifesCounter < 2) {
      this.deleteAddLife(true);
      this.playSound(this.audioNewLife);
    }
    if (randomNum === 2) {
      this.player.smallPlayer();
      this.playSound(this.audioSmallPlayer);
    }
    if (randomNum === 3) {
      this.newBall();
      this.playSound(this.audioMultiBall);
    }
  },

  generatePowderBoxes() {
    let frameCheck = 500 - this.level * 100;

    frameCheck < 100 ? (frameCheck = 500) : null;

    if ((this.framesCounter % frameCheck) - this.level * 100 === 0) {
      this.powers.push(new Powers(this.ctx, this.canvasSize, Math.floor(Math.random() * (this.canvasSize.w - 50 - 50) + 50)));
    }
  },

  deleteAddLife(add = false, reset) {
    let lifes = document.querySelectorAll('.lifes img');

    if (reset) {
      lifes.forEach(life => (life.src = './img/vida.png'));
    } else {
      if (add === true) {
        this.lifesCounter++;

        lifes[this.lifesCounter].setAttribute('src', './img/vida.png');
      } else {
        lifes[this.lifesCounter].removeAttribute('src');

        this.lifesCounter--;
      }
    }
  },

  checkLifes() {
    if (this.lifesCounter >= 0) return true;
    return false;
  },

  gameOver() {
    if (!this.balls.length) {
      this.pauseBall = true;

      this.clearIntervals();
      this.intervalStart();

      if (this.checkLifes()) {
        this.newBall();
        this.deleteAddLife();
      } else {
        document.querySelector('.buttonReset').classList.toggle('hidden');
        this.playSound(this.audioGameOver);

        // insert en localStorage el nombre del player y la score si existe
        let score = document.querySelector('.score ol li');
        let nameInput = document.querySelector('#player');
        if (score && nameInput.value !== '') {
          this.miStorage.setItem(nameInput.value, this.score);
          nameInput.value = '';
        }

        setTimeout(() => {
          document.querySelector('.gameOver').classList.add('looser');
        }, 1000);
        // alert('end of game');
      }
    }
  },

  addScore() {
    //como add score se ejecuta constantemente (a través de checkcoli y start() ponemos aquí la logica del score)
    this.score += 50;
    let score = document.querySelector('.score ol li span');
    if (score) {
      score.textContent = this.score;
    }
  },

  addName() {
    let name = document.querySelector('#player');
    let li = `<li>${name.value.padEnd(15, '-')} : <span>0</span></li>`;
    let score = document.querySelector('.score ol'); //selecionamos <ul>
    score.insertAdjacentHTML('afterbegin', li); //añadimos <li> a ul

    this.form();
  },

  form() {
    let button = document.querySelector('.buttonName');
    let name = document.querySelector('#player');

    let playerName = document.querySelector('.playerName');

    name.classList.toggle('hidden'); //añadimos clase directamente a playername
    button.classList.toggle('hidden');

    playerName.classList.toggle('center');
  },

  resetGame() {
    document.querySelector('ol').textContent = '';
    document.querySelector('.buttonReset').classList.toggle('hidden');
    this.level = 0;
    this.score = 0;
    this.blocks = [];
    this.balls = [];
    this.powers = [];
    this.lifesCounter = 2;
    this.clearIntervals();
    this.pauseBall = true;
    this.switchedDirection = false;
    this.form();
    this.framesCounter = 0;
    this.deleteAddLife(false, true);
    this.init();
  },

  // setScore
  setScore() {
    const arrScore = [];
    let score = document.querySelector('.score ol'); //selecionamos <ul>
    for (let i = 0; i < this.miStorage.length; i++) {
      this.miStorage.key(i) ? arrScore.push({ name: this.miStorage.key(i), score: +this.miStorage.getItem(this.miStorage.key(i)) }) : null;
    }
    const newObj = arrScore.sort((a, b) => b.score - a.score);

    !newObj.length ? (score.innerHTML = '') : null;

    let counter = newObj.length;
    newObj.length > 3 ? (counter = 3) : null;

    let li = ``;
    for (let i = 0; i < counter; i++) {
      li += `<li>
          ${newObj[i].name.padEnd(15, '-')} : <span>${newObj[i].score}</span>
        </li>`;
    }
    score.insertAdjacentHTML('afterbegin', li);
  },

  resetScore() {
    this.miStorage.clear();
    this.setScore();
  },
};
