const FRAMERATE = 10;
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
    drawBlock('J', 35, 30);
}

// draw a specific block
function drawBlock(type, x, y){
  switch(type){
    case 'I':
      drawI(x, y);
      break;
		case 'J':
      drawUnit(x, y , '#ff0000');
      break;
  }
}

// draw I block
function drawI(x, y){
	drawUnit(x, y, '#0092ff');
	drawUnit(x*2, y, '#0092ff');
	drawUnit(x*3, y, '#0092ff');
	drawUnit(x*4, y, '#0092ff');
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
