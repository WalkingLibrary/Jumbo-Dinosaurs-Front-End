/*Get the Canvas and Set it up*/
let mapCanvas = document.getElementById("mapCanvas");
let canvasWidth = 600;
let canvasHeight = 600;

let cameraX, cameraZ;


mapCanvas.width = canvasWidth;
mapCanvas.height = canvasHeight;

let defaultChunkImage, loadedChunkImage;
let scene;
let engine = new BABYLON.Engine(mapCanvas, true);
let camera;

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
let regionHashMap = new Map();
let lastDrawY = 0;
let lastDrawX = 0;
let lastDrawZ = 0;
let heightRedrawThreshold = 10;
let axisRedrawThreshold = 32;
let renderDistance = 16;
let maxY = -10;
let minY = -230;

let tableDiv = document.getElementById("tablesDiv");

refreshTableSelector(tableDiv);

let asyncUpdate = async function ()
{
    await clearMeshes();
    await drawDefaultChunks();
}

let updateMapView = function (forceUpdate)
{

    let shouldUpdate = false;
    if (!forceUpdate)
    {
        let currentY = camera.position.y;
        if (Math.abs(currentY - lastDrawY) > heightRedrawThreshold)
        {
            lastDrawY = currentY;
            shouldUpdate = true;
        }

        if (Math.abs(cameraX - lastDrawX) > axisRedrawThreshold)
        {
            lastDrawX = cameraX;
            shouldUpdate = true;
        }

        if (Math.abs(cameraZ - lastDrawZ) > axisRedrawThreshold)
        {
            lastDrawZ = cameraZ;
            shouldUpdate = true;
        }
    }


    if (shouldUpdate || forceUpdate)
    {
        asyncUpdate();
    }
}


let clearMeshes = function ()
{
    while (scene.meshes.length > 0)
    {
        scene.meshes[0].dispose();
    }
}


let drawDefaultChunks = function ()
{
    /**/
    let mat = new BABYLON.StandardMaterial("");
    let texture = new BABYLON.Texture(defaultChunkImage);
    mat.diffuseTexture = texture;
    mat.specularColor = new BABYLON.Color3(0, 0, 0);
    mat.backFaceCulling = false;//Allways show the front and the back of an element
    let half = renderDistance / 2;
    let xTranslation = ((Math.floor(cameraX)) - (Math.floor(cameraX) % 16)) * (1 / 16);
    let zTranslation = ((Math.floor(cameraZ)) - (Math.floor(cameraZ) % 16)) * (1 / 16);

    /*Drawing text*/
    let myDynamicTexture = new BABYLON.DynamicTexture("coordinateDisplay", {width: 16, height: 16}, scene);
    // mat.diffuseTexture = myDynamicTexture;
    myDynamicTexture.invertZ = true;
    let font = "bold 6px monospace";

    for (let i = -half + xTranslation; i < half + xTranslation; i++)
    {
        for (let c = -half + zTranslation; c < half + zTranslation; c++)
        {
            let newPlane = BABYLON.MeshBuilder.CreatePlane("plane", {width: 16, height: 16});
            newPlane.material = mat;
            newPlane.rotation.x = Math.PI / 2;
            newPlane.rotation.y = Math.PI * 1.5;
            newPlane.position.x = (i * 16) + 8;
            newPlane.position.y = 0;
            newPlane.position.z = (c * 16) + 8;
            myDynamicTexture.drawText(i + ":" + c, 0, 15, font, "green", "white", false, true);

        }
    }
}


let createScene = function ()
{
    scene = new BABYLON.Scene(engine);
    camera = new BABYLON.FreeCamera('FlyCamera', new BABYLON.Vector3(0, minY, 0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());


    camera.inputs.clear();
    camera.inputs.addMouse();
    camera.rotation.y = Math.PI * 1.5;
    camera.rotation.z = Math.PI * .5;
    camera.rotation.x = Math.PI * 1.5;

    updateCamVariables();
    updateMapView(true);
    scene.createDefaultLight();
    return scene;

}

let showGridCoordinates = true;
let loadedChunks = document.getElementById("loadedChunks");

loadedChunks.checked = true;
/* Function that handles toggling the coordinates on the grid
 * when the Grid coordinate check box is clicked
 *  */
loadedChunks.onclick = function ()
{
    loadedChunks = !loadedChunks;
    updateMapView(true);
}

// the canvas/window resize event handler
window.addEventListener('resize', function ()
{
    engine.resize();
});

function updateCamVariables()
{
    cameraX = camera.position.x;
    cameraZ = camera.position.z;
}

/*Event Listener Set up for the map Canvas */

let dragStartX, dragStartY, dragStartCameraX, dragStartCameraY, isDown;


function updateCoordinateInput()
{
    let xInput = document.getElementById("x");
    let zInput = document.getElementById("z");
    xInput.value = Math.trunc(cameraX);
    zInput.value = Math.trunc(cameraZ);
}

function onDragStart(event)
{

    /*Help the user Notice The Map Is Draggable*/
    mapCanvas.style.cursor = "grab";

    dragStartX = event.pageX;
    dragStartY = event.pageY;


    /*Start Place of the camera*/
    let position = scene.activeCamera.position;
    dragStartCameraX = position.x;
    dragStartCameraY = position.z;
    isDown = true;
}


function onDragOver(event)
{
    if (isDown)
    {
        mapCanvas.style.cursor = "grab";
        /*Get the new Position of the cursor on the page */
        let currentPageX = event.pageX;
        let currentPageY = event.pageY;
        /*Get the difference between where you started draging and your mouses current position */
        let xDifference = dragStartX - currentPageX;
        let yDifference = dragStartY - currentPageY;
        xDifference *= .3;
        yDifference *= .3;

        /*change the camera according to where your camera started to how much your mouse's position has changed */
        let previousPosition = scene.activeCamera.position;
        let newCameraPosition = new BABYLON.Vector3(dragStartCameraX + xDifference, previousPosition.y, dragStartCameraY + yDifference);
        cameraX = newCameraPosition.x;
        cameraZ = newCameraPosition.z;
        updateCoordinateInput();
        scene.activeCamera.position = newCameraPosition;
        updateMapView();
    }
}

/* Function that handles changing the camera x and camera z
 * when the go button is clicked
 *  */
let goButton = document.getElementById("goButton");
goButton.onclick = function ()
{
    let newX, newZ;
    let xInput = document.getElementById("x");
    let zInput = document.getElementById("z");
    newX = parseInt(xInput.value, 10);
    newZ = parseInt(zInput.value, 10);
    let newCameraPosition = new BABYLON.Vector3(newX, minY, newZ);
    scene.activeCamera.position = newCameraPosition;
    updateCamVariables();
    updateMapView();

}


let initBabylonFunction = function ()
{
    scene = createScene();

    scene.onPointerObservable.add((pointerInfo) =>
    {
        let event = pointerInfo.event;
        switch (pointerInfo.type)
        {

            case BABYLON.PointerEventTypes.POINTERDOWN:
                onDragStart(event)
                break;
            case BABYLON.PointerEventTypes.POINTERUP:
                isDown = false;
                break;
            case BABYLON.PointerEventTypes.POINTERMOVE:
                onDragOver(event)
                break;
            case BABYLON.PointerEventTypes.POINTERWHEEL:
                let previousPosition = scene.activeCamera.position;
                let newY = previousPosition.y - event.deltaY;
                if (newY > maxY)
                {
                    newY = maxY;
                }

                if (newY < minY)
                {
                    newY = minY;
                }
                let newCameraPosition = new BABYLON.Vector3(previousPosition.x, newY, previousPosition.z);

                scene.activeCamera.position = newCameraPosition;
                updateMapView();
                break;
        }
    });


    engine.runRenderLoop(function ()
    {
        scene.render();
    });

}


let xmlHttpRequest = new XMLHttpRequest();

xmlHttpRequest.onload = function ()
{
    let reader = new FileReader();
    reader.onloadend = function ()
    {
        defaultChunkImage = reader.result;
        console.log(defaultChunkImage);
        initBabylonFunction();
    }
    reader.readAsDataURL(xmlHttpRequest.response);
};

xmlHttpRequest.open("GET", host + "defaultChunk.png", true);
xmlHttpRequest.responseType = "blob";
xmlHttpRequest.send();

