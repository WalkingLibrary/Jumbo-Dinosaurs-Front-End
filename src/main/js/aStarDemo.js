/*Get the Canvas and Set it up*/
let aStarCanvas = document.getElementById("aStarCanvas");
let canvasWidth = 600;
let canvasHeight = 600;
let canvasContext = aStarCanvas.getContext('2d');

aStarCanvas.width = canvasWidth;
aStarCanvas.height = canvasHeight;


let maxSquareGridSize = 15;

let loadingAnimationHTML;


function getFormLink(formName)
{
    return host + formName;
}


let loadingAnimationHTMLStoreFunction = function (xmlHttpRequest)
{
    if (xmlHttpRequest.status === 200)
    {
        loadingAnimationHTML = xmlHttpRequest.responseText;
    }
    else
    {
        loadingAnimationHTML = "<h1>Loading...</h1>";
    }
}
getForm(getFormLink("loadingAnimation.html"), loadingAnimationHTMLStoreFunction);


aStarCanvas.addEventListener("contextmenu", function (e)
{
    e.preventDefault();
});

aStarCanvas.addEventListener("mousedown", function (e)
{
    e.preventDefault();
    onMouseDown(e);
});


class Node
{

    constructor(row, column)
    {
        this.row = row;
        this.column = column;
    }

    draw()
    {
        canvasContext.strokeStyle = "black";
        let lineWidth = canvasContext.lineWidth;
        let widthMultiplier = canvasWidth / maxSquareGridSize;
        let heightMultiplier = canvasHeight / maxSquareGridSize;

        let x = this.row * widthMultiplier;
        let y = this.column * heightMultiplier;
        let rectWidth = widthMultiplier;
        let rectHeight = heightMultiplier;


        canvasContext.strokeRect(x, y, rectWidth, rectHeight);

        if (this.isPathNode)
        {
            canvasContext.fillStyle = "yellow";
            canvasContext.fillRect(x + lineWidth, y + lineWidth, rectWidth - lineWidth, rectHeight - lineWidth);
        }

        if (this.isGoalNode)
        {
            canvasContext.fillStyle = "red";
            canvasContext.fillRect(x + lineWidth, y + lineWidth, rectWidth - lineWidth, rectHeight - lineWidth);
        }

        if (this.isStartNode)
        {
            canvasContext.fillStyle = "green";
            canvasContext.fillRect(x + lineWidth, y + lineWidth, rectWidth - lineWidth, rectHeight - lineWidth);
        }

        if (this.isAnObstacle)
        {
            canvasContext.fillStyle = "grey";
            canvasContext.fillRect(x + lineWidth, y + lineWidth, rectWidth - lineWidth, rectHeight - lineWidth);
        }


    }

    onclick(mouseX, mouseY, mouseClickType)
    {
        let widthMultiplier = canvasWidth / maxSquareGridSize;
        let heightMultiplier = canvasHeight / maxSquareGridSize;

        let x = this.row * widthMultiplier;
        let y = this.column * heightMultiplier;
        let rectWidth = widthMultiplier;
        let rectHeight = heightMultiplier;

        if (mouseX < (x + rectWidth))
        {
            if (mouseX > x)
            {
                if (mouseY < (y + rectWidth))
                {
                    if (mouseY > y)
                    {

                        this.isGoalNode = false;
                        this.isStartNode = false;

                        //0 is a left click
                        //left click is for start node
                        if (mouseClickType === 0)
                        {

                            for (let i = 0; i < squares.length; i++)
                            {
                                if (squares[i].isStartNode)
                                {
                                    squares[i].isStartNode = false;
                                }
                            }
                            this.isStartNode = true;
                            this.isAnObstacle = false;

                        }

                        //1 is a middle click
                        //middle click is for an obstacle
                        if (mouseClickType === 1)
                        {
                            this.isAnObstacle = !this.isAnObstacle;
                        }

                        //2 is a right click
                        //right click is for goal node
                        if (mouseClickType === 2)
                        {

                            for (let i = 0; i < squares.length; i++)
                            {
                                if (squares[i].isGoalNode)
                                {
                                    squares[i].isGoalNode = false;
                                }
                            }
                            this.isGoalNode = true;
                            this.isAnObstacle = false;
                        }


                    }
                }
            }
        }
    }

}


function getNodes()
{
    let squares = [];
    let count = 0;
    for (let r = 0; r < maxSquareGridSize; r++)
    {
        for (let c = 0; c < maxSquareGridSize; c++)
        {
            squares[count] = new Node(r, c);
            if (r === 5 && c === 6)
            {
                squares[count].isGoalNode = true;
            }

            if (r === 8 && c === 8)
            {
                squares[count].isStartNode = true;
            }
            count++;
        }
    }
    return squares;
}

let squares = getNodes();


function getMouseX(canvas, event)
{
    let rect = canvas.getBoundingClientRect();
    let rectWidth = rect.width;
    return (event.clientX - rect.left) * (canvasWidth / rectWidth);
}

function getMouseY(canvas, event)
{
    let rect = canvas.getBoundingClientRect();
    let rectHeight = rect.height;
    return (event.clientY - rect.top) * (canvasHeight / rectHeight);
}


function onMouseDown(event)
{
    let x = getMouseX(aStarCanvas, event);
    let y = getMouseY(aStarCanvas, event);
    for (let i = 0; i < squares.length; i++)
    {
        squares[i].isPathNode = false;
        squares[i].onclick(x, y, event.button);
    }


}

function drawGrid()
{
    for (let i = 0; i < squares.length; i++)
    {
        squares[i].draw();
    }
}

class MapHolder
{
    constructor(map)
    {
        this.map = map;
    }
}


let solveButton = document.getElementById("solveButton");

function solvePath()
{
    /*
     * Process for solving for a path
     * Validate the Grid
     * Send the grid to the back end
     * Display the solved Grid or display no solution
     *  */
    //Display Loading Animation
    let solveButtonDiv = document.getElementById("solveButtonDiv");
    let preClick = solveButtonDiv.innerHTML;
    solveButtonDiv.innerHTML = loadingAnimationHTML;
    errorDisplay.innerHTML = "";

    //Validate the Grid
    let hasGoalNode = false;
    let hasStartNode = false;
    let isInvalid = false;
    for (let i = 0; i < squares.length; i++)
    {
        if (squares[i].isStartNode === true)
        {
            if (hasStartNode === true)
            {
                isInvalid = true;
            }
            hasStartNode = true;
        }

        if (squares[i].isGoalNode === true)
        {
            if (hasGoalNode === true)
            {
                isInvalid = true;
            }
            hasGoalNode = true;
        }

        if (squares[i].isGoalNode && squares[i].isStartNode ||
            squares[i].isGoalNode && squares[i].isAnObstacle ||
            squares[i].isAnObstacle && squares[i].isStartNode)
        {
            isInvalid = true;
        }
    }

    if (isInvalid || !hasGoalNode || !hasStartNode)
    {
        errorDisplay.innerHTML = "One of the Nodes is in a invalid state. Try Refreshing";
        return;
    }

    let map = [];

    /* Map Makers
                * 0 means the cell can be traversed
                * 1 means the cell can not be traversed
                * 2 is the start cell
                * 3 is the goal cell
                * 4 is a path Node
                *  */
    //Send the grid to the back end

    //Create the map
    for (let i = 0; i < squares.length; i++)
    {
        let node = squares[i];

        if (map[node.row] === undefined)
        {
            map[node.row] = [];
        }

        if (node.isStartNode)
        {
            map[node.row][node.column] = 2;
        }
        else if (node.isAnObstacle)
        {
            map[node.row][node.column] = 1;
        }
        else if (node.isGoalNode)
        {
            map[node.row][node.column] = 3;
        }
        else
        {
            map[node.row][node.column] = 0;
        }
    }

    let mapHolder = new MapHolder(map);

    let solveRequest = new PostRequest("SolveAStar2D");
    solveRequest.content = JSON.stringify(mapHolder);

    function onResponse(xmlHttpRequest)
    {
        if (xmlHttpRequest.status == 200)
        {
            let responseObject = JSON.parse(xmlHttpRequest.responseText);
            if (responseObject.failureReason === "NoPath")
            {
                errorDisplay.innerHTML = "There is no Path from the start node to the goal node"
            }
            else
            {
                let solvedMap = JSON.parse(responseObject.solvedMap).map;
                for (let r = 0; r < solvedMap.length; r++)
                {
                    for (let c = 0; c < solvedMap[r].length; c++)
                    {
                        if (solvedMap[r][c] === 4)
                        {
                            for (let i = 0; i < squares.length; i++)
                            {
                                if (squares[i].row === r && squares[i].column === c)
                                {
                                    squares[i].isPathNode = true;
                                }
                            }
                        }
                    }
                }
            }
        }
        else
        {
            errorDisplay.innerHTML = "There was an error finding the solution refresh and try again later."
        }

        solveButtonDiv.innerHTML = preClick;
    }

    sendPostRequest(solveRequest, onResponse);


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
    drawGrid();
    //Request Animation Frame
    requestAnimationFrame(draw);
}