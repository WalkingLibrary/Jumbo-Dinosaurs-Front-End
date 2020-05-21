let mapCanvas = document.getElementById("mapCanvas");
console.log(mapCanvas);

let canvasWidth = 500;
let canvasHeight = 500;

mapCanvas.width = canvasWidth;
mapCanvas.height = canvasHeight;
let canvasContext = mapCanvas.getContext('2d');

let cameraX = 0;
let cameraY = 0;

draw();

function draw() {
    canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
    requestAnimationFrame(draw);
    canvasContext.fillRect(100, 100, 10, 10);



}