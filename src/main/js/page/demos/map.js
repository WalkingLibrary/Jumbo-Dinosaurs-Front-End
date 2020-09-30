/*Get the Canvas and Set it up*/
let mapCanvas = document.getElementById("mapCanvas");
let canvasWidth = 600;
let canvasHeight = 600;
let canvasContext = mapCanvas.getContext('2d');

mapCanvas.width = canvasWidth;
mapCanvas.height = canvasHeight;


/* Function that handles changing the camera x and camera y
 * when the go button is clicked
 *  */
goButton.onclick = function ()
{
    updateCamera();
}


/* View Settings
 *
 * There Are Currently Three Views
 * Sector View, Region View, Chunk View
 *
 * Sector = 8 x 8 Regions
 * Region = 32 x 32 Chunks
 * Chunk = 16 x 16 Blocks
 *
 * 
 * Chunk View is 8 x 8 Chunks
 * Region View is 2 x 2 Regions
 * Sector View is 2 x 2 Sectors
 * 
 * 
 * 
 * 
 * 
 */
let view = 0;

/* Function To To Help Toggle the View */
function getSquareCount()
{
    /*Chunk View*/
    if (view === 0)
    {
        return 8;
    }

    /*Region View*/
    if (view === 1)
    {
        return 2;
    }

    if (view === 2)
    {
        return 2;
    }

}

let changeView = function (newView)
{
    return function ()
    {
        console.log("Change View Called");
        /* Process for setting the view
         * Set the View Variable to the value given
         * Set all the Check mark inputs according to the view
         *
         * */

        //Set the View Variable to the value given
        view = newView;
        updateCamera();


        //Set all the Check mark inputs according to the view
        if (view === 0)
        {
            chunkView.checked = true;
            regionView.checked = false;
            sectorView.checked = false;
        }

        if (view === 1)
        {
            chunkView.checked = false;
            regionView.checked = true;
            sectorView.checked = false;
        }

        if (view === 2)
        {
            chunkView.checked = false;
            regionView.checked = false;
            sectorView.checked = true;
        }
    }
}

chunkView.checked = true;
regionView.checked = false;
sectorView.checked = false;
chunkView.onclick = changeView(0);
regionView.onclick = changeView(1);
sectorView.onclick = changeView(2);

/* Toggle grid Coordinates */
let showGridCoordinates = true;


/* Get The Multiple for block change according to the view
 * */

function getViewMultiplier()
{
    /*
     * There Are Currently Three Views
     * Sector View, Region View, Chunk View
     *
     * Sector = 8 x 8 Regions
     * Region = 32 x 32 Chunks
     * Chunk = 16 x 16 Blocks
     *
     *
     *  */


    //The Default View is set for chunks
    //Chunk View
    if (view === 0)
    {
        return 1;
    }

    //Region = 32 x 32 Chunks
    //Region View
    if (view === 1)
    {
        return 32;
    }

    //Sector = 8 x 8 Regions
    //Sector View
    if (view === 2)
    {
        return 32 * 8;
    }
}


gridCoordinatesToggle.checked = true;
/* Function that handles toggling the coordinates on the grid
 * when the Grid coordinate check box is clicked
 *  */
gridCoordinatesToggle.onclick = function ()
{
    showGridCoordinates = !showGridCoordinates;
}


/*Drawing Grid Coordinates Function*/
function drawSquareCoordinate(x, y, offSetX, offSetY, displayX, displayY)
{
    canvasContext.font = "9px serif";
    let displayString = "(" + displayX + ", " + displayY + ")";

    canvasContext.fillText(displayString, (x - offSetX), (y - offSetY));
}


/* Camera Variables for Moving around on the Grid
 *
 *
 *
 *
 *
 *  */

/* To Center the map on load you need to set the camera x and y
 * to the negative of the canvas width and height
 * */
let cameraX = -1 * (canvasWidth / 2);
let cameraY = -1 * (canvasHeight / 2);


/* To Show the user their current coordinates we set the
 * Values in the x and z input boxes respectively
 *
 */

X.value = cameraX;
Z.value = cameraY;


/* DragStart are used to calculate the difference in the draw motion on the canvas
 *
 *
 * */
let dragStartCameraX = cameraX;
let dragStartCameraY = cameraY;


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
    /*Preventing the Default here allows the cursor to not be a No Drop Symbol*/
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

    /**/
    updateXAndZCoords();
}

/*Drawing Grid Squares Function*/
function drawGridSquare(x, y, width, height)
{
    canvasContext.strokeStyle = "black";
    canvasContext.strokeRect(x, y, width, height);
}


/* Converting camera Coords to Block Coords
 * Converting Block Coords To Camera Coords
 *
 *   */

function getBlockPos(cameraX, cameraY, rectangleWidth, rectangleHeight)
{
    let xCentered = (cameraX + (canvasWidth / 2)) * getViewMultiplier();
    let yCentered = (cameraY + (canvasHeight / 2)) * getViewMultiplier();
    let blockPos = {};
    blockPos[0] = xCentered * ((canvasWidth / (rectangleWidth * getSquareCount())) * (16 / rectangleWidth));
    blockPos[1] = yCentered * ((canvasHeight / (rectangleHeight * getSquareCount())) * (16 / rectangleHeight));
    return blockPos;
}


function getCameraPos(blockX, blockZ, rectangleWidth, rectangleHeight)
{
    /* Translating blockCoord to a cameraCoord
     *
     *
     *  */
    let amountOfSquaresX = (blockX * (1 / (getViewMultiplier() * 16)));
    let amountOfSquaresZ = (blockZ * (1 / (getViewMultiplier() * 16)));
    let cameraCenterX = rectangleWidth * amountOfSquaresX;
    let cameraCenterY = rectangleHeight * amountOfSquaresZ;
    let cameraPos = {};
    cameraPos[0] = cameraCenterX - (canvasWidth / 2);
    cameraPos[1] = cameraCenterY - (canvasHeight / 2);
    return cameraPos;
}


/* Function to update X and Z to the respective coordinates
 *
 *
 *  */

function updateXAndZCoords()
{
    let rectangleWidth = canvasWidth / getSquareCount();
    let rectangleHeight = canvasHeight / getSquareCount();
    let currentPosition = getBlockPos(cameraX, cameraY, rectangleWidth, rectangleHeight);
    X.value = Math.trunc(parseInt(currentPosition[0]), 10);
    Z.value = Math.trunc(parseInt(currentPosition[1]), 10);
}


//Need To Update the X and Z Coords once
updateXAndZCoords();

/* Function to update the Camera Coordinates to the values in X and Z
 *
 * */

function updateCamera()
{
    let rectangleWidth = canvasWidth / getSquareCount();
    let rectangleHeight = canvasHeight / getSquareCount();
    let blockX = parseInt(X.value, 10);
    let blockZ = parseInt(Z.value, 10);
    let newCameraPos = getCameraPos(blockX, blockZ, rectangleWidth, rectangleHeight);
    cameraX = newCameraPos[0];
    cameraY = newCameraPos[1];
}


//Tell The Page to Draw When Loaded
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
            if (showGridCoordinates)
            {

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
    }

    //Request Animation Frame
    requestAnimationFrame(draw);
}