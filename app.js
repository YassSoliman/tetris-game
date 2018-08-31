/*jshint esversion: 6 */
const FRAMERATE = 60;
var UNIT = 25;

// global variables
var cvs;
var ctx;
var score = 0;
var level = 1;
var nextMove = true;
var control = null;
var grid = [...Array(20)].map(e => Array(10));
var UIHitbox = [];
var GameOver = false;
// game blocks
var I = {
    blocks: [0x2222, 0xF000, 0x4444, 0xF000],
    color: '#0092ff'
};
var J = {
    blocks: [0xE200, 0x44C0, 0x8E00, 0x6440],
    color: '#ff0000'
};
var L = {
    blocks: [0x2E00, 0x4460, 0xE800, 0xC440],
    color: '#49ff00'
};
var O = {
    blocks: [0x6600, 0x6600, 0x6600, 0x6600],
    color: '#4900ff'
};
var S = {
    blocks: [0x6C00, 0x4620, 0x6C00, 0x8C40],
    color: '#00ff92'
};
var T = {
    blocks: [0x4E00, 0x4640, 0xE400, 0x4C40],
    color: '#ffdb00'
};
var Z = {
    blocks: [0xC600, 0x2640, 0xC600, 0x4C80],
    color: '#ff00db'
};

var gameBlocks = [I, J, L, O, S, T, Z];
var gameHistory = [Z, S, Z, S];
var nextBlock = random();
function Timer(seconds, action) {
    var countedFrames = 0;
    var countedSeconds = 0;
    var Running = true;
    var Paused = false;
    this.count = function () {
        if (!Paused && Running) {
            counter++;
            if (counter / FRAMERATE >= seconds) {
                counter = 0;
                countedSeconds++;
                action();
            }
        }
    };
    this.stop = function () {
        Running = false;
    };
    this.IsRunning = function () {
        return Running;
    };
    this.pause = function () {
        Paused = true;
    };
    this.resume = function () {
        Paused = false;
    };
}
function Tetromino(blockTemplate) {
    var block = blockTemplate;
    var rotation = 0;
    var x = 4;
    var y = 1;
    var counter = 0;
    var moveCounter = 0;
    var speed = FRAMERATE;
    this.falling = true;
    //var length = block.blocks[rotation].toString(16).split("").filter((char) => char !== '0').length
    this.render = function () {
        draw(block, rotation, x * UNIT, y * UNIT);
        if (this.falling && counter >= speed) {
            counter = 0;
            if ( this.hitTest(UIHitbox, 0, 1) || this.gridHitTest(grid, 0, 1) ) {
                GameOver = (y===1);
                if(!GameOver){
                   this.landed();
                }
            } else {
                y++;
            }
        }
        counter++;
    };
    /**
     * Makes all the movement in the game work
     * Left, Right, Acceleration
     */
    this.controller = function () {
        if (this.falling && control && moveCounter == 0) {
            switch (control) {
                case 'left':
                    if (!this.gridHitTest(grid, -1, 0) && !this.hitTest(UIHitbox, -1, 0)) {
                        x--;
                    }
                    break;
                case 'right':
                    if (!this.gridHitTest(grid, 1, 0) && !this.hitTest(UIHitbox, 1, 0)) {
                        x++;
                    }
                    break;
                case 'rotate':
                    var potRot = rotation;
                    if (potRot == 3) {
                        potRot = 0;
                    } else {
                        potRot++;
                    }
                    if (!this.gridHitTest(grid, 0, 0, potRot) && !this.hitTest(UIHitbox, 0, 0, potRot)) {
                        rotation = potRot;
                        length = blockTemplate.blocks[rotation].toString(16).split("").filter((char) => char !== '0').length;
                    }
                    break;
                case 'drop':
                    speed = FRAMERATE / 20;
                    break;
            }
            control = null;
            moveCounter = 5;
        } else if (!this.falling || control == null) {
            speed = FRAMERATE;
        }
        if (moveCounter != 0) {
            moveCounter--;
        }
    };

    /**
     * Returns the x,y positions of every block of this Tetromino relative to the.
     * Returns: [[x1,y1],[x2,y2],[x3,y3],[x4,y4]]
     */
    this.getBlockPositions = function (potRot) {
        //TODO store BlockPositions as constant variable when the block has landed
        var rot = (potRot == null) ? rotation : potRot;
        var positions = [];
        HexLoop(block.blocks[rot], function (relX, relY) {
            positions.push([x + relX, y + relY]);
        });
        return positions;
    };

    /**Collision dectections between getBlockPositions  
     * Returns true if collides
     * */
    this.hitTest = function (BlockPositions, translX, translY, potRot) {
        return BlockPositions.some((position) => {
            return this.getBlockPositions(potRot).some((selfPosition) => {
                return selfPosition[0] + translX === position[0] && selfPosition[1] + translY === position[1];
            });
        });
    };

    /**Collision check with game grid variable */
    this.gridHitTest = function (grid, translX, translY, potRot) {
        return this.getBlockPositions(potRot).some(function (posArr) {
            return !!grid[posArr[1] - 1 + translY][posArr[0] - 1 + translX];
        });
    };

    this.landed = function () {
        this.falling = false;
        var blockPositions = this.getBlockPositions();
        this.getBlockPositions = () => blockPositions;
        this.render = null;
        this.getBlockPositions().forEach(function (posArr) {
            grid[posArr[1] - 1][posArr[0] - 1] = block.color;
        });
        gameTetrominos.push(new Tetromino(nextBlock));
        nextMove = true;
        drawNext();
        checkLines();
    };
}
var gameTetrominos = [new Tetromino(nextBlock)];

// when window loads run this function
window.addEventListener("load", start());

function start() {
    // select canvas and assign to var
    cvs = document.querySelector('canvas');
    // tell browser which canvas context we're in
    ctx = cvs.getContext("2d");
    // Event listeners
    window.addEventListener('keydown', function (evt) {
        console.log(evt.which);
        switch (evt.which) {
            case 37: // Left arrow
                control = 'left';
                break;
            case 39: // Right arrow
                control = 'right';
                break;
            case 38: // Up arrow
                control = 'rotate';
                break;
            case 40: // Down arrow
            case 32: // Space
                control = 'drop';
                break;
        }
    });
    window.addEventListener('keyup', function () {
        control = null;
    });

    // window updates every frame
    window.setInterval(update, 1000 / FRAMERATE);
}

function update() {
    //Garbage colletor

    // Check logic

    // draw everything
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    drawUI('#251c17');
    drawFallenTetromino();
    gameTetrominos.forEach(function (tetromino) {
        if (tetromino.render) {
            tetromino.render();
        }if(!GameOver){
            tetromino.controller();
        }
    });

}
//loops through a hex binary array. Itterates callback with x and y values of blocks presend in a 4x4 hex grid
function HexLoop(hex, callback) {
    var x = 0, y = 0, bit;
    for (bit = 0x8000; bit > 0; bit = bit >> 1, x++) {
        if (x === 4) {
            y++;
            x = 0;
        }
        if (bit & hex) {
            // console.log('Block here: ' + bit);
            callback(x, y);
        }
    }
}

// Checks all the lines for a clear
function checkLines() {
    var lines = [];
    var streak = [];
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            if (grid[i][j] == null) {
                streak = [];
                break;
            } else {
                streak.push(grid[i][j]);
            }
        }
        if (streak.length == 10) {
            streak = [];
            lines.push(i);
        }
    }
    clearLines(lines);
}

// Clear the full lines
// TODO Make a function that loops the grid and grid[i] and takes in a callback take has (i, j) as parameters
// because repeating too many for loops instead of just making a function
function clearLines(lines) {
    for (var i = 0; i < lines.length; i++) {
        grid.splice(lines[i],1);
        grid.splice(0,0,new Array(10));
    }
}

// Draws fallen tetromino to grid
function drawFallenTetromino() {
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            if (grid[i][j] != null) {
                drawUnit((j * UNIT) + UNIT, (i * UNIT) + UNIT, grid[i][j]);
            }
        }
    }

}

// One function that calculates position, rotation direction of any piece
function draw(block, direction, x, y) {
    HexLoop(block.blocks[direction], (posx, posy) => drawUnit(x + posx * UNIT, y + posy * UNIT, block.color));
}


// draw a rectangle with or without a stroke
function drawRect(x, y, width, height, rectColor, wantsStroke, strokeColor) {
    ctx.fillStyle = rectColor;
    ctx.fillRect(x, y, width, height);
    if (wantsStroke) {
        ctx.strokeStyle = strokeColor;
        ctx.strokeRect(x, y, width, height);
    }
}

// draw one unit
function drawUnit(x, y, color) {
    var size = 3;
    drawRect(x, y, UNIT, UNIT, color, false); // Draw main color
    drawRect(x + UNIT - size, y, size, UNIT, 'black', false); // Draw right black border
    drawRect(x, y + UNIT - size, UNIT, size, 'black', false); // Draw left black border
    drawRect(x, y, size, size, 'white', false); // Draw top right white dot
    drawRect(x + size, y + size, size, size * 2, 'white', false); // Draw top right top border
    drawRect(x + size, y + size, size * 2, size, 'white', false); // Draw top right left border 
}

// draw user interface
function drawUI(color) {
    var HEXUI = [
        [0xF888, 0xF000, 0xF111, 0xF000, 0x8888],
        [0x8888, 0x0000, 0x1111, 0x0F00, 0x8888],
        [0x8888, 0x0000, 0x1111, 0x0000, 0x8888],
        [0x8888, 0x0000, 0x1111, 0x0000, 0x8888],
        [0x8888, 0x0000, 0x1111, 0x0000, 0x8888],
        [0x8F00, 0x0F00, 0x1F00, 0x0F00, 0x8800]
    ];
    UIHitbox = [];
    HEXUI.forEach(function (chunk, indexY) {
        var multiplierY = indexY * 4;
        chunk.forEach(function (hexBlocks, indexX) {
            var multiplierX = indexX * 4;
            HexLoop(hexBlocks, function (x, y) {
                drawUnit((x + multiplierX) * UNIT, (y + multiplierY) * UNIT, color);
                UIHitbox.push([x + multiplierX, y + multiplierY]);
            });

        });
    });
    ctx.font = "25px sans-serif";
    ctx.textAlign = 'center';
    ctx.fillStyle = 'blue';
    ctx.fillText("Score", 14 * UNIT, 7 * UNIT);
    ctx.fillText("Level", 14 * UNIT, 9 * UNIT + 10);
    ctx.fillText("Controls", 14 * UNIT, 11 * UNIT + 20);
    ctx.strokeStyle = 'lightblue';
    ctx.strokeText("Score", 14 * UNIT, 7 * UNIT);
    ctx.strokeText("Level", 14 * UNIT, 9 * UNIT + 10);
    ctx.strokeText("Controls", 14 * UNIT, 11 * UNIT + 20);
    ctx.fillStyle = 'lightgray';

    // Rectangles for score and controls
    drawRect(UNIT * 12.2, UNIT * 7 + 3, 90, 25, "lightgray", true, "lightblue");
    drawRect(UNIT * 12.2, UNIT * 12 + 3, 90, UNIT * 4 - 15, "lightgray", true, "lightblue");

    // Circle for level
    ctx.beginPath();
    ctx.arc(UNIT * 14, UNIT * 10 + 5, 11, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();

    // Score and level text
    ctx.fillStyle = 'white';
    ctx.fillText(score, 14 * UNIT, 8 * UNIT);
    ctx.fillText(level, 14 * UNIT, 10 * UNIT + 13);
    ctx.strokeStyle = 'black';
    ctx.strokeText(score, 14 * UNIT, 8 * UNIT);
    ctx.strokeText(level, 14 * UNIT, 10 * UNIT + 13);

    // Controls text
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'lightcoral';
    ctx.font = "14px sans-serif";
    ctx.fillText("Movement", 14 * UNIT, 12 * UNIT + 15);
    ctx.strokeText("Movement", 14 * UNIT, 12 * UNIT + 15);
    ctx.fillText("Accelerate", 14 * UNIT, 13 * UNIT + 20);
    ctx.strokeText("Accelerate", 14 * UNIT, 13 * UNIT + 20);
    ctx.fillText("Rotate", 14 * UNIT, 15 * UNIT);
    ctx.strokeText("Rotate", 14 * UNIT, 15 * UNIT);
    ctx.font = "10px sans-serif";
    ctx.fillText("Left/Right Arrows", 14 * UNIT, 13 * UNIT);
    ctx.fillText("Space/Down Arrow", 14 * UNIT, 14 * UNIT + 5);
    ctx.fillText("Up Arrow", 14 * UNIT, 15 * UNIT + 10);

    drawNext();

}

// draw next block preview
function drawNext() {
    if (nextMove) {
        nextBlock = random();
        nextMove = false;
    }
    switch (nextBlock) {
        case J:
            draw(nextBlock, 3, 12 * UNIT, UNIT + 15);
            break;
        case O:
            draw(nextBlock, 1, 12 * UNIT, UNIT * 2);
            break;
        default:
            draw(nextBlock, 1, 12 * UNIT, UNIT + 15);
            break;
    }
}

function random() {
    var candidatePiece;
    for (var i = 0; i < 5040; i++) {
        candidatePiece = gameBlocks[Math.floor(Math.random() * (gameBlocks.length))];
        if (!(gameHistory.includes(candidatePiece))) {
            break;
        }
    }
    gameHistory.pop();
    gameHistory.unshift(candidatePiece);
    return candidatePiece;
}
