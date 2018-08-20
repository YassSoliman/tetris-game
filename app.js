const FRAMERATE = 10;
const CELL = 20;

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
    console.log('Frame');
}
