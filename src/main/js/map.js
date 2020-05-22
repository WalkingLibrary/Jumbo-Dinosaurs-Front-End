let mapCanvas = document.getElementById("mapCanvas");

console.log(mapCanvas);


/*Camera Variables for Drawing/Moving*/
let cameraX = 0;
let cameraY = 0;
let dragStartCameraX = cameraX;
let dragStartCameraY = cameraY;


/* The Canvs Width is 576 to allow the Blocks i Chunk view to be 4 x 4 Pixels with a 2 Pixel Border
 *
 *
 * 
 * 
 * 
 */
let canvasWidth = 500;
let canvasHeight = 500;

mapCanvas.width = canvasWidth;
mapCanvas.height = canvasHeight;
let canvasContext = mapCanvas.getContext('2d');


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

function draw()
{
    canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
    requestAnimationFrame(draw);
    for (c = -1; c < (getSquareCount() + 1); c++)
    {
        for (r = -1; r < (getSquareCount() + 1); r++)
        {
            rectangleWidth = canvasWidth / getSquareCount();
            rectangleHeight = canvasHeight / getSquareCount();
            let x = (rectangleWidth * c) - (cameraX % rectangleWidth);
            let y = rectangleHeight * r - (cameraY % rectangleHeight);


            drawGridSquare(x, y, rectangleWidth, rectangleHeight);
        }
    }


}


function drawGridSquare(x, y, width, height)
{
    lineWidth = 2;
    canvasContext.fillStyle = "white";
    canvasContext.fillRect(x, y, width - lineWidth, height - lineWidth);
}

function getSquareCount()
{
    /*Chunk View*/
    if (view === 0)
    {
        return 8;
    }

}


/*Dealing With Dragging on the Canvas */

let dragStartX, dragStartY;

/*Event Listener Set up for the map Canvas */
mapCanvas.draggable = true;
mapCanvas.addEventListener('dragstart', onDragStart);
mapCanvas.addEventListener('dragover', onDragOver);


function onDragStart(event)
{
    /*Help the user Notice The Map Is Draggable*/
    mapCanvas.style.cursor = "grab";


    /*Removing the Default Picture For Dragging*/
    let dragImage = document.createElement("img");
    event.dataTransfer.setDragImage(dragImage, 0, 0);

    dragStartX = event.pageX;
    dragStartY = event.pageY;

    /*Start Place of the camera*/
    dragStartCameraX = cameraX;
    dragStartCameraY = cameraY;

}

function onDragOver(event)
{
    event.preventDefault();

    /*Get the new Position of the cursor on the page */
    currentPageX = event.pageX;
    currentPageY = event.pageY;
    /*Get the difference between where you started draging and your mouses current position */
    xDifference = dragStartX - currentPageX;
    yDifference = dragStartY - currentPageY;

    /*change the camera according to where your camera started to how much your mouse's position has changed */
    cameraX = dragStartCameraX + xDifference;
    cameraY = dragStartCameraY + yDifference;
}