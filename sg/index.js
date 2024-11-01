const gameboard = document.querySelector("#gameboard") ;
const ctx = gameboard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetbuttun = document.querySelector("#resetbuttun");
const gamewidth = gameboard.width;
const gameheight = gameboard.height;
const boardBackgraung = "white";
const snakeColor = "pink";
const snakeBorder = "blue";
const foodColor = "red";
const unitsize = 25 ;
let running = false;
let xVelocity = unitsize;
let yVelocity = 0;
let foodx;
let foody;
let score = 0;
let snake =[
    {x:unitsize * 4, y:0},
    {x:unitsize * 3, y:0},
    {x:unitsize * 2, y:0},
    {x:unitsize , y:0},
    {x:0, y:0}
] 


window.addEventListener("keydown", changeDirection);
resetbuttun.addEventListener("click", resetGame);

gameStart();


function gameStart(){
    running = true;
    scoreText.textContent= score;
    createFood();
    nextTick();
};
function nextTick(){
    if(running){
        setTimeout(()=>{
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameover();
            nextTick();
        }, 75);
    }
    else{
        displayGameOver();
    }
};
function clearBoard(){
    ctx.fillStyle= boardBackgraung;
    ctx.fillRect(0,0,gamewidth,gameheight);
};
function createFood(){
    function randomFood(min,max){
        const randNum = Math.round((Math.random() * (max - min)+ min) / unitsize) * unitsize;
        return randNum;
    }
    foodx = randomFood(0, gamewidth - unitsize);
    foody = randomFood(0,gamewidth - unitsize);
};
function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodx,foody,unitsize,unitsize);
};
function moveSnake(){
    const head ={x: snake[0].x + xVelocity,
                y: snake[0].y + yVelocity};
    snake.unshift(head);
    if(snake[0].x == foodx && snake[0].y == foody){
        score +=1;
        scoreText.textContent = score;
        createFood();
    }
    else{
        snake.pop();
    }
};
function drawSnake(){
    ctx.fillStyle= snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x,snakePart.y,unitsize,unitsize);
        ctx.strokeRect(snakePart.x,snakePart.y,unitsize,unitsize)

    })
}
function changeDirection(){
    const keypressed = event.keyCode;
    const left = 37;    
    const up = 38;
    const right = 39;
    const down = 40;

    const goingup = (yVelocity == -unitsize);
    const goingdown = (yVelocity == unitsize);
    const goingright = (xVelocity == unitsize);
    const goingleft = (xVelocity == -unitsize);

    switch(true){
        case(keypressed == left && !goingright):
            xVelocity = -unitsize;
            yVelocity =0;
            break;
        case(keypressed == up && !goingdown):
            yVelocity = -unitsize;
            xVelocity =0;
            break;    
        case(keypressed == right && !goingleft):
            xVelocity = unitsize;
            yVelocity =0;
            break;
        case(keypressed == down && !goingup):
            yVelocity = unitsize;
            xVelocity =0;
            break;    

    }

};
function checkGameover(){
    switch(true){
        case(snake[0].x < 0):
            running = false;
            break;
        case(snake[0].x >= gamewidth):
            running = false;
            break;
        case(snake[0].y < 0):
            running =false;
            break;
        case(snake[0].y >= gameheight):
            running = false;
            break;    
    }

    for(let i = 1 ; i < snake.length; i +=1){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            running = false;
            break;
        }
    }
};
function displayGameOver(){
    ctx.font = "50px MV Boli";
    ctx.fillStyle= " black";
    ctx.textAlign= "center";
    ctx.fillText("GAME OVER!", gamewidth/2, gameheight/2);
    running=false
};
function resetGame(){
    score = 0;
    xVelocity=unitsize;
    yVelocity= 0;
    snake=[
        {x:unitsize * 4, y:0},
        {x:unitsize * 3, y:0},
        {x:unitsize * 2, y:0},
        {x:unitsize , y:0},
        {x:0, y:0}
    ] 
    gameStart();
};