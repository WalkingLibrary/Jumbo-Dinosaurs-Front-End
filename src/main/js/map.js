let mapCanvas = document.getElementById("mapCanvas");
console.log(mapCanvas);



/* The Canvs Width is 576 to allow the Blocks i Chunk view to be 4 x 4 Pixels with a 2 Pixel Border
 *
 *
 * 
 * 
 * 
 */
let canvasWidth = 576;
let canvasHeight = 576;

mapCanvas.width = canvasWidth;
mapCanvas.height = canvasHeight;
let canvasContext = mapCanvas.getContext('2d');


/*Camera Variables for Drawing/Moving*/
let cameraX = 0;
let cameraY = 0;

/* View Settings
 *
 * There Are Currently Three Views Sector View, Region View, Chunk View 
 * Sector = 8 x 8 Regions
 * Region = 32 x 32 Chunks
 * Chunk = 16 x 16 Blocks
 * 
 * 
 * Chunk View is 6 x 6 Chunks
 * Region View is 2 x 2 Regions
 * Sector View is 2 x 2 Sectors
 * 
 * 
 * 
 * 
 * 
 */
let view = 0;

draw();

function draw() {
    canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
    requestAnimationFrame(draw);
    for (c = -1; c < (getSquareCount() + 1); c++) {
        for (r = -1; r < (getSquareCount() + 1); r++) {
            rectangleWidth = canvasWidth / getSquareCount();
            rectangleHeight = canvasHeight / getSquareCount();
            let x = (rectangleWidth * c) - (cameraX % rectangleWidth);
            let y = rectangleHeight * r - (cameraY % rectangleHeight);


            drawSquare(x, y, rectangleWidth, rectangleHeight);
        }
    }

    cameraX++;
    cameraY++;


}


function drawSquare(x, y, width, height) {
    lineWidth = 2;
    canvasContext.fillStyle = "white";
    canvasContext.fillRect(x, y, width - lineWidth, height - lineWidth);
}

function getSquareCount() {
    /*Chunk View*/
    if (view == 0) {
        return 6;
    }

}