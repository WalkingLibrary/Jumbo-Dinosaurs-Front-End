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
let canvasWidth = 750;
let canvasHeight = 750;

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


    /* Draw Loop Process
     * Clear Screen
     * Draw Grid With Coordinates
     * Request Animation Frame
     *  */

    //Clear Screen
    canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);


    //Draw Grid With Coordinates
    /* Process for Drawing the Grid
     * Calculate the Width and Height of each Square
     * Calculate The Relative Unit X and Y with The Camera X and Y
     * Draw Each Square of the Grid
     * Draw Square Coordinates
     *  */


    /* Minecraft
     * +X East
     * -z North
     * -X West
     * +Z south
     *
     * OUR Grid
     * -x is West
     * +x is east
     * -y is north
     * +y is south
     * */

    let rectangleWidth = canvasWidth / getSquareCount();
    let rectangleHeight = canvasHeight / getSquareCount();

    //Calculate The Relative Unit X and Y with The Camera X and Y
    let topLeftSquareX = Math.trunc(cameraX / rectangleWidth);
    let topLeftSquareY = Math.trunc(cameraY / rectangleHeight);


    //Draw Each Square of the Grid
    for (c = -1; c < (getSquareCount() + 1); c++)
    {
        for (r = -1; r < (getSquareCount() + 1); r++)
        {

            /* Process for Drawing Each Square of the Grid
             * Calculate the X and Y Coordinate for the Canvas
             * Draw a Square There
             *
             *  */

            //Calculate the X and Y Coordinate for the Canvas
            let rectangleXIndex = (rectangleWidth * c);
            let rectangleYIndex = (rectangleHeight * r);
            let canvasX = rectangleXIndex - (cameraX % rectangleWidth);
            let canvasY = rectangleYIndex - (cameraY % rectangleHeight);

            //Draw a Square There
            drawGridSquare(canvasX, canvasY, rectangleWidth, rectangleHeight);


            //Draw Square Coordinates
            /* Process For Drawing Coordinates on the Grid
             *
             * Get The Unit Coordinate For This Loops C and R Values
             * Distinguish The Diagonal, Vertical, Horizontal and Zero Zero Unit
             * Draw The Coordinates on The Corresponding Grid Square
             *
             *  */

            //Get The Unit Coordinate For This Loops C and R Values
            // Unit Corresponding to the View that the Map is in
            //Example Chunk, Region, or Sector
            let unitX = topLeftSquareX + c;
            let unitY = topLeftSquareY + r;


            /* Distinguish The Diagonal, Vertical, Horizontal and Zero Zero Unit Squares
             * Distinguish Diagonal With Green
             * Distinguish Vertical with red
             * Distinguish Horizontal With blue
             * Distinguish Zero Zero with Purple
             *  */
            if (unitX === 0 || unitY === 0)
            {
                if (unitX === 0)
                {
                    //Distinguish Vertical with red
                    canvasContext.fillStyle = "red";
                }

                if (unitY === 0)
                {
                    //Distinguish Horizontal With blue
                    canvasContext.fillStyle = "blue";
                }

                if (unitX === unitY)
                {
                    //Distinguish Zero Zero with Purple
                    canvasContext.fillStyle = "purple";
                }

            }
            else if (unitX === unitY || unitX === -unitY || -unitX === unitY)
            {
                //Distinguish Diagonal With Green
                canvasContext.fillStyle = "green";
            }
            else
            {
                //Everything else is black
                canvasContext.fillStyle = "black";
            }

            //Draw The Coordinates on The Corresponding Grid Square
            drawSquareCoordinate(canvasX, canvasY, -2, -15, unitX, unitY);

        }
    }
    //Request Animation Frame
    requestAnimationFrame(draw);
}


function drawSquareCoordinate(x, y, offSetX, offSetY, displayX, displayY)
{
    canvasContext.font = "11px serif";
    let displayString = "(" + displayX + ", " + displayY + ")";

    canvasContext.fillText(displayString, (x - offSetX), (y - offSetY));
}

function drawGridSquare(x, y, width, height)
{
    let lineWidth = 2;
    canvasContext.strokeStyle = "black";
    canvasContext.strokeRect(x, y, width, height);
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
    let currentPageX = event.pageX;
    let currentPageY = event.pageY;
    /*Get the difference between where you started draging and your mouses current position */
    let xDifference = dragStartX - currentPageX;
    let yDifference = dragStartY - currentPageY;

    /*change the camera according to where your camera started to how much your mouse's position has changed */
    cameraX = dragStartCameraX + xDifference;
    cameraY = dragStartCameraY + yDifference;
}