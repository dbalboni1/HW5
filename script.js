/*
    Dan Balboni
    CPSC 332 Web Development
    HW5
    Last Modified: 11/7/2022
*/
var color1 = "#0095DD";

window.onload = function () {
    var paused = false;

    let highScoreElement = document.getElementById("high-score");
    let endDiv = document.getElementById("end-screen");
    let endText = document.getElementById("end-text");
    let titleDiv = document.getElementById("title-screen");
    let titleText = document.getElementById("title");
    let GameDiv = document.getElementById("Game");
    let startButton = document.getElementById("startButton");
    let continueButton = document.getElementById("continue");
    let pauseButton = document.getElementById("pause");
    let pauseOverlay = document.getElementById("pause-overlay");
    let newGameButton = document.getElementById("reset");
    let speedSlider = document.getElementById("speed-slider");
    let speedText = document.getElementById("game-speed");
    let sliderContainer = document.getElementById("slider-container");

    var canvas = document.getElementById("myCanvas");

    titleDiv.style.width = (canvas.width-40) + "px";
    titleDiv.style.width = (canvas.height-40) + "px";
    pauseOverlay.style.width = canvas.width + "px";
    pauseOverlay.style.width = canvas.height + "px";
    drawMenu();

    var ctx = canvas.getContext("2d");
    var ballRadius = 10;
    var x = canvas.width / 2;
    var y = canvas.height - 30;
    var dx = 2;
    var dy = -2;
    var paddleHeight = 10;
    var paddleWidth = 75;
    var paddleX = (canvas.width - paddleWidth) / 2;
    var rightPressed = false;
    var leftPressed = false;
    var brickRowCount = 5;
    var brickColumnCount = 3;
    var brickWidth = 75;
    var brickHeight = 20;
    var brickPadding = 10;
    var brickOffsetTop = 30;
    var brickOffsetLeft = 30;
    var score = 0;
    var highScore = 0;
    var lives = 3;

    var bricks = [];

    for (var c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (var r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);

    function keyDownHandler(e) {
        if (e.keyCode == 39) {
            rightPressed = true;
        }
        else if (e.keyCode == 37) {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.keyCode == 39) {
            rightPressed = false;
        }
        else if (e.keyCode == 37) {
            leftPressed = false;
        }
    }

    function mouseMoveHandler(e) {
        var relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
    }

    function collisionDetection() {
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                var b = bricks[c][r];
                if (b.status == 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        checkWinState();
                        /*if (score == brickRowCount * brickColumnCount) {
                            //TODO: draw message on the canvas
                            alert("YOU WIN, CONGRATS!");
                            //TODO: pause game instead of reloading
                            paused = true;
                            resetBoard(3);
                            drawMenu();
                            return;
                            //document.location.reload();
                        }*/
                    }
                }
            }
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = color1;
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = color1;
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status == 1) {
                    var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                    var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = color1;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = color1;
        ctx.fillText("Score: " + score, 60, 20);
    }

    function drawLives() {
        ctx.font = "16px Arial";
        ctx.fillStyle = color1;
        ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        drawHighScore();
        drawLives();
        collisionDetection();

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        }
        else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            }
            else {
                lives--;
                if (lives <= 0) {
                    //TODO: draw message on the canvas
                    //TODO: pause game instead of reloading
                    paused = true;
                    endDiv.removeAttribute("hidden");
                    endText.innerText = "Sorry, you lost...";
                    continueButton.innerText = "Restart";
                    continueButton.addEventListener("click", startNewGame);
                    //document.location.reload();
                }
                else {
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    //dx = 3;
                    //dy = -3;
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        }
        else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        //TODO: adjust speed
        x += dx;
        y += dy;

        //TODO: pause game check
        if( paused ) {
            return;
        } else {
            requestAnimationFrame(draw);
        }
    }

    /*
        Additions to starter code
    */

    //Additional variables used to help make dimensions/locations easier to reuse            
    //controls game speed            
    //pause game variable            
    //high score tracking variables
    //other variables?            

    //event listeners added
    //game speed changes handler            
    //pause game event handler            
    //start a new game event handler            
    //continue playing
    //reload click event listener            

    //Drawing a high score
    function drawHighScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = color1;
        ctx.fillText("High Score: " + highScore, 220, 20);
    }

    //draw the menu screen, including labels and button
    function drawMenu() {
        titleDiv.removeAttribute("hidden");
        //draw the rectangle menu backdrop

        //draw the menu header
        titleText.innerHTML = "Big Game"

        //event listener for clicking start
        startButton.addEventListener("click", startGameClick);   
    }

    //function used to set shadow properties
    function setShadow() {

    };

    //function used to reset shadow properties to 'normal'
    function resetShadow() {

    };

    //function to start the game
    //this should check to see if the player clicked the button
    //i.e., did the user click in the bounds of where the button is drawn
    //if so, we want to trigger the draw(); function to start our game
    function startGameClick(event) {
        titleDiv.setAttribute("hidden", true);
        sliderContainer.setAttribute("hidden", true);
        paused = false;

        pauseButton.removeAttribute("hidden");
        newGameButton.removeAttribute("hidden");
        draw();
    };

    //function to handle game speed adjustments when we move our slider
    speedSlider.oninput = 
    function adjustGameSpeed() {
        //if( speedSlider.value != undefined ) {
            //console.log("speed: " + dx);
            //update the slider display                
            //update the game speed multiplier 
            speedText.innerHTML = speedSlider.value;
            dx = speedSlider.value;
            dy = -1 * speedSlider.value;
        //}
    };

    pauseButton.addEventListener("click",togglePauseGame)

    //function to toggle the play/paused game state
    function togglePauseGame() {
        if( paused == false ) {
            paused = true;
            pauseOverlay.removeAttribute("hidden");
        } else {
            paused = false;
            pauseOverlay.setAttribute("hidden",true);
            draw();
        }
    };

    //function to check win state
    //if we win, we want to accumulate high score and draw a message to the canvas
    //if we lose, we want to draw a losing message to the canvas
    function checkWinState() {
        if (score == brickRowCount * brickColumnCount) {
            //TODO: draw message on the canvas
            //TODO: pause game instead of reloading
            paused = true;
            highScore += score;
            pauseButton.setAttribute("hidden", true);
            endDiv.removeAttribute("hidden");
            endText.innerHTML = "Congrats, you win!";
            continueButton.innerHTML = "Continue?";
            continueButton.addEventListener("click", continuePlaying);
            //document.location.reload();
        }
    };

    newGameButton.addEventListener("click",startNewGame);

    //function to clear the board state and start a new game (no high score accumulation)
    function startNewGame(resetScore) {
        endDiv.setAttribute("hidden", true);
        pauseButton.removeAttribute("hidden");
        resetBoard(3);
        paused = false;
        highScore = 0;
        draw();
    };

    //function to reset the board and continue playing (accumulate high score)
    //should make sure we didn't lose before accumulating high score
    function continuePlaying() {
        endDiv.setAttribute("hidden", true);
        pauseButton.removeAttribute("hidden");
        resetBoard(lives);
        paused = false;
        draw();
    };

    //function to reset starting game info
    function resetBoard(resetLives) {
        //reset bricks               
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                bricks[c][r].status = 1;
            }
        }

        //reset score and lives
        score = 0;
        lives = resetLives;

        //reset speed & paddle position
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = speedSlider.value;
        dy = -1*speedSlider.value;
        paddleX = (canvas.width - paddleWidth) / 2;
    };
};//end window.onload function