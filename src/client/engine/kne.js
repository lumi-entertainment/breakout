"use strict";
/**
 * Created by Dario on 14/03/2017.
 */

/* global U, Brick */

// set the log level to debug
U.setLogLevel(U.LOG_LEVELS.DEBUG);

;(function KNE() {

    var _canvas = U.query("#main-canvas");
    var _ctx = _canvas.getContext("2d");
    var _x = _canvas.width / 2;
    var _y = _canvas.height - 30;
    var _dx = 5;
    var _dy = -5;
    var _ballRadius = 10;

    var _interval;


    var paddleHeight = 10;
    var paddleWidth = 75;
    var paddleX = (_canvas.width - paddleWidth) / 2;

    var rightPressed = false;
    var leftPressed = false;

    var brickRowCount = 6;
    var brickColumnCount = 10;
    var brickWidth = 75;
    var brickHeight = 20;
    var brickPadding = 2;
    var brickOffsetTop = 30;
    var brickOffsetLeft = 15;

    var score = 0;
    var lives = 3;
    var coins = [];
    var _coindDY = 2;
    var bricks = [];
    var brickValueRandomizer = U.Random.getIntRandomizer(1, 5);
    for (var c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (var r = 0; r < brickRowCount; r++) {
            bricks[c][r] = new Brick(brickWidth, brickHeight, brickValueRandomizer(), U.Random.getColor());
        }
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    _canvas.addEventListener("mousemove", mouseMoveHandler, false);

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
        var relativeX = e.clientX - _canvas.offsetLeft;
        if (relativeX > paddleWidth && relativeX < _canvas.width) {
            paddleX = relativeX - paddleWidth;
        }
    }

    U.log(U.LOG_LEVELS.INFO, "Initializing game...", _canvas, _ctx);

    function drawPaddle() {
        _ctx.beginPath();
        _ctx.rect(paddleX, _canvas.height - paddleHeight, paddleWidth, paddleHeight);
        _ctx.fillStyle = "#0095DD";
        _ctx.fill();
        _ctx.closePath();
    }

    function drawBall() {
        _ctx.beginPath();
        _ctx.arc(_x, _y, _ballRadius, 0, Math.PI * 2);
        _ctx.fillStyle = "#0095DD";
        _ctx.fill();
        _ctx.closePath();
    }

    function drawBricks() {
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status === 1) {
                    var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].draw(_ctx, brickX, brickY);
                }
            }
        }
    }

    function drawScore() {
        _ctx.font = "16px Arial";
        _ctx.fillStyle = "#0095DD";
        _ctx.fillText("Score: " + score, 8, 20);
    }

    function drawLives() {
        _ctx.font = "16px Arial";
        _ctx.fillStyle = "#0095DD";
        _ctx.fillText("Lives: " + lives, _canvas.width - 65, 20);
    }

    function drawCoins() {
        for (var c = 0; c < coins.length; c++) {
            if (coins[c].dropping) {
                coins[c].y += _coindDY;
                if(coins[c].y > 0){
                    _ctx.beginPath();
                    _ctx.arc(coins[c].x, coins[c].y, 5, 0, Math.PI * 2);
                    _ctx.fillStyle = "#DDBB00";
                    _ctx.fill();
                    _ctx.closePath();
                } else {
                    coins[c].dropping = false;
                }
            }
        }
        coins = coins.filter(function(c){
            return c.dropping;
        });
    }

    function collisionDetection() {
        for (c = 0; c < brickColumnCount; c++) {
            for (r = 0; r < brickRowCount; r++) {
                var b = bricks[c][r];
                if (b.status === 1) {
                    if (_x > b.x && _x < b.x + brickWidth && _y > b.y && _y < b.y + brickHeight) {
                        _dy = -_dy;
                        b.status = 0;
                        if (b.value === 5) {
                            score++;
                            coins.push({x: b.x + b.width / 2, y: b.y, dropping: true});
                        }
                        if (score === brickRowCount * brickColumnCount) {
                            U.log(U.LOG_LEVELS.INFO, "YOU WIN, CONGRATULATIONS!");
                        }
                    }
                }
            }
        }
    }

    function draw() {
        _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        drawLives();
        collisionDetection();
        drawCoins();
        if (_x + _dx > _canvas.width - _ballRadius || _x + _dx < _ballRadius) {
            _dx = -_dx;
        }
        if (_y + _dy < _ballRadius) {
            _dy = -_dy;
        }
        else if (_y + _dy > _canvas.height - _ballRadius) {
            if (_x > paddleX && _x < paddleX + paddleWidth) {
                _dy = -_dy;
            }
            else {
                lives--;
                if (!lives) {
                    U.log(U.LOG_LEVELS.INFO, "GAME OVER");
                }
                else {
                    _x = _canvas.width / 2;
                    _y = _canvas.height - 30;
                    _dx = 5;
                    _dy = -5;
                    paddleX = (_canvas.width - paddleWidth) / 2;
                }

            }
        }

        if (rightPressed && paddleX < _canvas.width - paddleWidth) {
            paddleX += 7;
        }
        else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        _x += _dx;
        _y += _dy;
        U.log(U.LOG_LEVELS.INFO, "Running...");
        window.requestAnimFrame(draw);
    }

    draw();
})();