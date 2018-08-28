const FRAMERATE = 60;
var UNIT = 25;

// global variables
var cvs;
var ctx;
var score = 0;
var level = 1;

// game blocks
var I = { 
  	blocks: [0x2222, 0x0F00, 0x4444, 0x00F0],
    color: '#0092ff'
}; 
var J = { 
  	blocks: [0x0E20, 0x44C0, 0x8E00, 0x6440],
    color: '#ff0000'
}; 
var L = { 
  	blocks: [0x2E00, 0x4460, 0x0E80, 0xC440],
    color: '#49ff00'
}; 
var O = { 
  	blocks: [0x6600, 0x6600, 0x6600, 0x6600],
    color: '#4900ff'
}; 
var S = { 
  	blocks: [0x6C00, 0x4620, 0x06C0, 0x8C40],
    color: '#00ff92'
}; 
var T = { 
  	blocks: [0x4E00, 0x4640, 0x0E40, 0x4C40],
    color: '#ffdb00'
}; 								
var Z = { 
  	blocks: [0xC600, 0x2640, 0x0C60, 0x4C80],
    color: '#ff00db'
};
function Tetromino(blockTemplate){
    var block = blockTemplate
    var rotation = 0;
    var x = 8;
    var y = 2;
    var counter = 0;
    var falling = true;
    var length = blockTemplate.blocks[rotation].toString(16).split("").filter((char)=>char!=='0').length
    this.spawn = function(){
        draw(block,rotation,x*UNIT,y*UNIT);
        if(counter>=30 && falling){
            counter=0;
            if(y >= cvs.height/UNIT-length){
                falling=false;
            }else{
                y+=1;
            }
        }
        counter++
    }

}
var gameTetrominos = [new Tetromino(I)];

// when window loads run this function
window.addEventListener("load", start());

function start(){
    // select canvas and assign to var
    cvs = document.querySelector('canvas');
    // tell browser which canvas context we're in
    ctx = cvs.getContext("2d");
    // Event listeners
              
    // window updates every frame
    window.setInterval(update, 1000 / FRAMERATE);
}

function update() {
    //Clear canveas
    ctx.clearRect(0,0,cvs.width,cvs.height)
    // check logic
    gameTetrominos.forEach((tetromino)=>tetromino.spawn());
    // draw everything
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    drawUI('#251c17');
}

function FallBlock(block){

}
// One function that calculates position, rotation direction of any piece
function draw(block, direction, x, y){
	var posx=0, posy=0, bit;
    for(bit = 0x8000; bit > 0; bit = bit >> 1,posx+=UNIT){
        if(posx === 4*UNIT){
            posy += UNIT;
            posx = 0;
        }
        if(bit & block.blocks[direction]){
            // console.log('Block here: ' + bit);
            drawUnit(x + posx, y + posy, block.color);
        }
    }  
}


// draw a rectangle with or without a stroke
function drawRect(x, y, width, height, rectColor, wantsStroke, strokeColor){
    ctx.fillStyle = rectColor;
	ctx.fillRect(x, y, width, height);
    if(wantsStroke){
        ctx.strokeStyle = strokeColor;
        ctx.strokeRect(x, y, width, height);
    }
}

// draw one unit
function drawUnit(x, y, color){
    var size = 3;
	drawRect(x, y, UNIT, UNIT, color, false); // Draw main color
	drawRect(x+UNIT-size, y, size, UNIT, 'black', false); // Draw right black border
	drawRect(x, y+UNIT-size, UNIT, size, 'black', false); // Draw left black border
	drawRect(x, y, size, size, 'white', false); // Draw top right white dot
	drawRect(x+size, y+size, size, size*2, 'white', false); // Draw top right top border
	drawRect(x+size, y+size, size*2, size, 'white', false); // Draw top right left border 
}

// draw user interface
function drawUI(color){
    for(var i=0; i<22; i++){
        drawUnit(UNIT*i, 0, color);
        drawUnit(0, UNIT*i, color);
        drawUnit((cvs.width)-UNIT, UNIT*i, color);
        drawUnit((cvs.width)-UNIT*6, UNIT*i, color);
        drawUnit(UNIT*i, (cvs.height)-UNIT, color);
        if(i>=12){
            drawUnit(UNIT*i, UNIT*5, color);
        }
    }
    // Score and Level and controls text
    ctx.font = "25px sans-serif";
    ctx.textAlign = 'center'
    ctx.fillStyle = 'blue';
    ctx.fillText("Score", 14*UNIT, 7*UNIT);
    ctx.fillText("Level", 14*UNIT, 9*UNIT+10);
    ctx.fillText("Controls", 14*UNIT, 11*UNIT+20);
    ctx.strokeStyle = 'lightblue';
    ctx.strokeText("Score", 14*UNIT, 7*UNIT);
    ctx.strokeText("Level", 14*UNIT, 9*UNIT+10);
    ctx.strokeText("Controls", 14*UNIT, 11*UNIT+20);
    ctx.fillStyle = 'lightgray';

    // Rectangles for score and controls
    drawRect(UNIT*12.2, UNIT*7+3, 90, 25, "lightgray", true, "lightblue"); 
    drawRect(UNIT*12.2, UNIT*12+3, 90, UNIT*4-15, "lightgray", true, "lightblue"); 

    // Circle for level
    ctx.beginPath();
    ctx.arc(UNIT*14, UNIT*10+5, 11, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();

    // Score and level text
    ctx.fillStyle = 'white';
    ctx.fillText(score, 14*UNIT, 8*UNIT);
    ctx.fillText(level, 14*UNIT, 10*UNIT+13);
    ctx.strokeStyle = 'black';
    ctx.strokeText(score, 14*UNIT, 8*UNIT);
    ctx.strokeText(level, 14*UNIT, 10*UNIT+13);

    // Controls text
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'lightcoral';
    ctx.font = "14px sans-serif"
    ctx.fillText("Movement", 14*UNIT, 12*UNIT+15);
    ctx.strokeText("Movement", 14*UNIT, 12*UNIT+15);
    ctx.fillText("Accelerate", 14*UNIT, 13*UNIT+20);
    ctx.strokeText("Accelerate", 14*UNIT, 13*UNIT+20);
    ctx.fillText("Rotate", 14*UNIT, 15*UNIT);
    ctx.strokeText("Rotate", 14*UNIT, 15*UNIT);
    ctx.font = "10px sans-serif"
    ctx.fillText("Left/Right Arrows", 14*UNIT, 13*UNIT);
    ctx.fillText("Space/Down Arrow", 14*UNIT, 14*UNIT+5);
    ctx.fillText("Up Arrow", 14*UNIT, 15*UNIT+10);

    drawNext(S);

    // draw(J, 3, 12*UNIT, UNIT+15);
    // draw(L, 1, 12*UNIT, UNIT+15);
    // draw(I, 1, 12*UNIT, UNIT+15);
    // draw(O, 1, 12*UNIT, UNIT*2);
    // draw(S, 1, 12*UNIT, UNIT+15);
    // draw(Z, 1, 12*UNIT, UNIT+15);
    // draw(T, 1, 12*UNIT, UNIT+15);
}

// draw next block preview
function drawNext(block){
    switch (block) {
        case J:
            draw(block, 3, 12*UNIT, UNIT+15);
            break;
        case O:
            draw(block, 1, 12*UNIT, UNIT*2);
            break;
        default:
            draw(block, 1, 12*UNIT, UNIT+15);
            break;
    }
}
