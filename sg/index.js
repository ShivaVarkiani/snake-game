const gameboard = document.querySelector("#gameboard");
const ctx = gameboard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetButton = document.querySelector("#resetButton");
const gamewidth = gameboard.width;
const gameheight = gameboard.height;
const boardBackground = "white";
const snakeColor = "pink";
const snakeBorder = "blue";
const foodColor = "red";
const obstacleColor = "black";
const unitsize = 25;
let running = false;
let xVelocity = unitsize;
let yVelocity = 0;
let foodx, foody, obstaclex, obstacley;
let score = 0;
let obstacleInterval;
let snake = [
    {x: unitsize * 4, y: 0},
    {x: unitsize * 3, y: 0},
    {x: unitsize * 2, y: 0},
    {x: unitsize, y: 0},
    {x: 0, y: 0}
];

window.addEventListener("keydown", changeDirection);
resetButton.addEventListener("click", resetGame);

gameStart();

function gameStart() {
    running = true;
    scoreText.textContent = score;
    createFood();
    createObstacle(); 
    obstacleInterval = setInterval(createObstacle, 5000);  
    nextTick();
}

function nextTick() {
    if (running) {
        setTimeout(() => {
            clearBoard();
            drawFood();
            drawObstacle();  
            moveSnake();
            drawSnake();
            checkGameover();
            nextTick();
        }, 100);
    } else {
        displayGameOver();
        clearInterval(obstacleInterval);  
    }
}

function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gamewidth, gameheight);
}

function createFood() {
    function randomCoord(min, max) {
        return Math.round((Math.random() * (max - min) + min) / unitsize) * unitsize;
    }
    do {
        foodx = randomCoord(0, gamewidth - unitsize);
        foody = randomCoord(0, gameheight - unitsize);
    } while ((foodx === obstaclex && foody === obstacley) || snake.some(part => part.x === foodx && part.y === foody));
}

function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodx, foody, unitsize, unitsize);
}

function createObstacle() {
    function randomCoord(min, max) {
        return Math.round((Math.random() * (max - min) + min) / unitsize) * unitsize;
    }
    do {
        obstaclex = randomCoord(0, gamewidth - unitsize);
        obstacley = randomCoord(0, gameheight - unitsize);
    } while (
        (obstaclex === foodx && obstacley === foody) || 
        snake.some(part => part.x === obstaclex && part.y === obstacley)
    );
}

function drawObstacle() {
    ctx.fillStyle = obstacleColor;
    ctx.fillRect(obstaclex, obstacley, unitsize, unitsize);
}

function moveSnake() {
    const head = {x: snake[0].x + xVelocity, y: snake[0].y + yVelocity};
    snake.unshift(head);

    if (snake[0].x === foodx && snake[0].y === foody) {
        score += 1;
        scoreText.textContent = score;
        createFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitsize, unitsize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitsize, unitsize);
    });
}

function changeDirection(event) {
    const keypressed = event.keyCode;
    const left = 37;
    const up = 38;
    const right = 39;
    const down = 40;

    const goingup = (yVelocity === -unitsize);
    const goingdown = (yVelocity === unitsize);
    const goingright = (xVelocity === unitsize);
    const goingleft = (xVelocity === -unitsize);

    switch (true) {
        case (keypressed === left && !goingright):
            xVelocity = -unitsize;
            yVelocity = 0;
            break;
        case (keypressed === up && !goingdown):
            yVelocity = -unitsize;
            xVelocity = 0;
            break;
        case (keypressed === right && !goingleft):
            xVelocity = unitsize;
            yVelocity = 0;
            break;
        case (keypressed === down && !goingup):
            yVelocity = unitsize;
            xVelocity = 0;
            break;
    }
}

function checkGameover() {
    switch (true) {
        case (snake[0].x < 0):
        case (snake[0].x >= gamewidth):
        case (snake[0].y < 0):
        case (snake[0].y >= gameheight):
        case (snake[0].x === obstaclex && snake[0].y === obstacley):  
            running = false;
            break;
    }

    for (let i = 1; i < snake.length; i += 1) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            running = false;
            break;
        }
    }
}

function displayGameOver() {
    ctx.font = "50px MV Boli";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", gamewidth / 2, gameheight / 2);
    running = false;
}

function resetGame() {
    score = 0;
    xVelocity = unitsize;
    yVelocity = 0;
    snake = [
        {x: unitsize * 4, y: 0},
        {x: unitsize * 3, y: 0},
        {x: unitsize * 2, y: 0},
        {x: unitsize, y: 0},
        {x: 0, y: 0}
    ];
    clearInterval(obstacleInterval);  
    clearBoard();
    createObstacle();  
    obstacleInterval = setInterval(createObstacle, 5000);  
    gameStart();
}
