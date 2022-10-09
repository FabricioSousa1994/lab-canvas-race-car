const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let interval; 
const obstacles = []
let points;
let gameIsOver = false;

const gameArea = {
  frames: 0,
  start: () => {
      interval = setInterval(updateGameArea, 20);
  },
  stop: () => {
      clearInterval(interval)
  },
  clear: () => {
      context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  },
  score: function() {
    if (!gameIsOver) {
      points = Math.floor(gameArea.frames / 5);
      context.font = "20px Arial";
      context.fillStyle = "white";
      context.fillText(`Score: ${points}`, 200, 30)
    }
  }

}

class Car {
  constructor(x, y,image,ctx) {
    this.x = 225;
    this.y = 650;
    this.ctx = ctx
    this.image = image;
  
    };
  
  draw() {
   context.drawImage(this.image, this.x, this.y, 50, 50);
  }
  moveLeft() {
    this.x -= 20;
  }
  moveRight() {
    this.x += 20;
  }

  left() {
    return this.x;
  }

  right() {
      return this.x + this.image.width;
  }

  top() {
      return this.y;
  }

  bottom() {
      return this.y + this.image.height;
  }

  collisionWithObstacle(obstacle) {
    return !(this.bottom() < obstacle.top() ||
            this.top() > obstacle.bottom() ||
            this.right() < obstacle.left() ||
            this.left() > obstacle.right())
  }

}

class Obstacles {
  constructor(width, height, color, x, y) {
      this.color = color;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
  }

  draw() {
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, this.width, this.height);
  }

  left() {
      return this.x;
  }

  right() {
      return this.x + this.width
  }

  top() {
      return this.y;
  }

  bottom() {
      return this.y + this.height
  }
}
  
document.addEventListener("keydown", (event) => {
  if (!gameIsOver) {
    console.log( "im clicicking", event.key)
    switch (event.key) {
      case "ArrowLeft":
            lamborghini.moveLeft();
            break;
        case "ArrowRight":
            lamborghini.moveRight();
            break;
    }
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    lamborghini.draw();
  }
})

let image = new Image()
window.onload = () => {
  image.src = "../images/car.png";
  document.getElementById('start-button').onclick = () => {
    startGame();

  };
}


const lamborghini = new Car(50,50, image, context)
function startGame() {
  lamborghini.draw()
  gameArea.start();
}



function drawObstacles() {
  obstacles.forEach((obstacle) => {
      obstacle.y += 1;
      obstacle.draw();
  });

  gameArea.frames += 1;

  if (gameArea.frames % 120 === 0) {
      //Creating obstacle
      const minWidth = 20;
      const maxWidth = 250;
      const randomWidth = Math.floor(Math.random() * (maxWidth - minWidth + 1) + minWidth);
      const randomX = Math.floor(Math.random() * ((canvas.clientWidth-(maxWidth-minWidth)) - minWidth)+minWidth);
      const obstacleTop = new Obstacles(randomWidth, 20, "brown", randomX, 0);

      obstacles.push(obstacleTop);
  }
}

function checkGameOver() {
  const crashed = obstacles.some((obstacle) => {
      if (lamborghini.collisionWithObstacle(obstacle)) {
          return true;
      } else {
          return false;
      }
  });

  if (crashed) {
      gameIsOver = true;
      gameArea.stop();
      gameArea.clear()
      context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      context.fillStyle = "black";
      context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      context.font = "70px Arial";
      context.fillStyle = "red";
      context.fillText(`Game Over`, 50, 100);
      context.font = "50px Arial";
      context.fillStyle = "white";
      context.fillText(`Score: ${points}`, 50, 150);
  }
}

function updateGameArea() {
  gameArea.clear();
  lamborghini.draw();
  drawObstacles();
  checkGameOver();
  gameArea.score()
}