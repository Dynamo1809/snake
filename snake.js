const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width
const height = canvas.height;
let score = 0;
const blockSize = 10;
const widthInBlocks = width / blockSize;
const heightInBlocks = height / blockSize;

const result = document.querySelector('.score');
result.textContent = score;

const drawBorder = function () {
  ctx.fillStyle = 'Grey';
  ctx.fillRect(0, 0, width, blockSize);
  ctx.fillRect(0, height - blockSize, width, blockSize);
  ctx.fillRect(0, 0, blockSize, height);
  ctx.fillRect(width - blockSize, 0, blockSize, height);
};



const Block = function (col, row) {
  this.col = col;
  this.row = row;
};

Block.prototype.drawSquare = function (color) {
  const x = this.col * blockSize;
  const y = this.row * blockSize;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, blockSize, blockSize);
};

Block.prototype.drawCircle = function (color) {
  const centerX = this.col * blockSize + blockSize / 2;
  const centerY = this.row * blockSize + blockSize / 2;
  ctx.fillStyle = color;
  circle(centerX, centerY, blockSize / 2, true);
};

Block.prototype.equal = function (otherBlock) {
  return this.col === otherBlock.col && this.row === otherBlock.row
};

const Apple = function () {
  this.position = new Block(3, 3);
};

Apple.prototype.draw = function () {
  this.position.drawCircle('Green');
}

Apple.prototype.move = function () {
  const randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
  const randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
  this.position = new Block(randomCol, randomRow);
};

const apple = new Apple();

const circle = function (x, y, radius, fillCircle) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  if (fillCircle) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
};


const Snake = function () {
  this.segments = [
    new Block(7, 5),
    new Block(6, 5),
    new Block(5, 5)
  ];

  this.direction = 'right';
  this.nextDirection = 'right';
};

Snake.prototype.draw = function () {
  for (let i = 0; i < this.segments.length; i++) {
    this.segments[0].drawSquare('Red');
    if (i % 2) {
      this.segments[i].drawSquare('Yellow');
    } else {
      this.segments[i].drawSquare('Blue');
    }   
  }
};


Snake.prototype.checkCollision = function (head) {
  let leftCollision = (head.col === 0);
  let topCollision = (head.row === 0);
  let rightCollision = (head.col === widthInBlocks - 1);
  let bottomCollision = (head.row === heightInBlocks - 1);

  let wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;
  
  let selfCollision = false;

  for (let i = 0; i < this.segments.length; i++) {
    if (head.equal(this.segments[i])) {
      selfCollision = true;
    }
  }

  return wallCollision || selfCollision;
};
Snake.prototype.move = function () {
  const head = this.segments[0];
  let newHead;

  this.direction = this.nextDirection;

  if (this.direction === 'right') {
    newHead = new Block(head.col + 1, head.row)
  } else if (this.direction === 'left') {
    newHead = new Block(head.col - 1, head.row)
  } else if (this.direction === 'down') {
    newHead = new Block(head.col, head.row + 1)
  } else if (this.direction === 'up') {
    newHead = new Block(head.col, head.row - 1)
  }

  if (this.checkCollision(newHead)) {
    gameOver();
    return;
  }

  this.segments.unshift(newHead);

  if (newHead.equal(apple.position)) {
    result.textContent++;
    apple.move();
  } else {
    this.segments.pop();
  }
};

Snake.prototype.setDirection = function (newDirection) {
  if (this.direction === 'up' && newDirection === 'down') {
    return;
  } else if (this.direction === 'right' && newDirection === 'left'){
    return;
  } else if (this.direction === 'left' && newDirection === 'right'){
    return;
  } else if (this.direction === 'down' && newDirection === 'up'){
    return;
  }

  this.nextDirection = newDirection;
};

let snake = new Snake();

const directions = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
};

$('body').keydown(function (event) {
  const newDirection = directions[event.keyCode];
  if (newDirection !== undefined) {
    snake.setDirection(newDirection);
  }
});

const intervalId = setInterval(function () {
  ctx.clearRect(0, 0, width, height);
  // drawScore()
  snake.draw();
  snake.move();
  apple.draw();
  drawBorder();
}, 100)

function gameOver() {
  result.textContent = 0;
  snake = new Snake();
}