const FRAMERATE = 60;
var UNIT = 25;

// global variables
var cvs;
var ctx;

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
    // check logic
                        
    // draw everything
    drawBlock('I', 10, 10);  
    drawBlock('J', 35, 35);
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
      console.log('Block here: ' + bit);
      drawUnit(x + posx, y + posy, block.color);
    }
  }  
}

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
//  8 4 2 1
//[ X X O O		1000		0x4000  
//  O X X O	  100			0x0200   0x8000 + 0x4000 + 0x0400 = 0xC600
//  O O O O   10			0x0040
//  O O O O ] 1				0x0000
//	

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
