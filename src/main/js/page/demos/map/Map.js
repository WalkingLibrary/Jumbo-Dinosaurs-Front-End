/*Get the Canvas and Set it up*/
let mapCanvas = document.getElementById("mapCanvas");
let canvasWidth = 600;
let canvasHeight = 600;

let cameraX, cameraZ;


mapCanvas.width = canvasWidth;
mapCanvas.height = canvasHeight;

let scene;
let engine = new BABYLON.Engine(mapCanvas, true);
let camera;

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
let regionHashMap = new Map();
let lastDrawY = 0;
let lastDrawX = 0;
let lastDrawZ = 0;
let axisRedrawThreshold = 200;
let renderDistance = 32;
let maxY = -10;
let minY = -800;//-400
let dimension = 0;

let tableDiv = document.getElementById("tablesDiv");


/*Table Selection and Information Loading*/

let updateRenderDistance = function ()
{
    let renderDistanceSlider = document.getElementById("renderDistanceSlider");

    let renderDistanceValueDisplay = document.getElementById("renderDistanceSliderDisplay");

    let newRenderDistance = renderDistanceSlider.value;
    console.log(newRenderDistance);
    //Make it even as to not mess up rendering
    if (newRenderDistance % 2 !== 0)
    {
        newRenderDistance = parseInt(newRenderDistance) + 1;
    }

    renderDistanceValueDisplay.innerHTML = "" + newRenderDistance;
    renderDistance = newRenderDistance;
    updateMapView(true);
}

let updateDimension = function ()
{
    let selectedDimension = document.getElementById("dimensionSelection").value;
    dimension = selectedDimension;
    updateMapView(true);
}

let objectTypes = ["MinecraftMapImage", "MinecraftMapDetail", "MinecraftJourneyMapChunkImage", "MinecraftLoadedChunk"];
let mapObjectsHashMap = new Map();


refreshTableSelector(tableDiv);
let mapDisplayItems = [];


let onTableSelection = function (table)
{
    let getMapObjectsRequest = new PostRequest("GetObjects");

    let crudRequest = new CRUDRequest();
    crudRequest.tableID = table.id;
    crudRequest.tableName = table.name;
    for (let j = 0; j < objectTypes.length; j++)
    {

        let objectType = objectTypes[j];
        crudRequest.objectType = objectType;
        getMapObjectsRequest.setCRUDRequest(crudRequest);

        let onResponse = function (xmlHttpRequest)
        {
            let mapObjects = JSON.parse(xmlHttpRequest.responseText);
            for (let i = 0; i < mapObjects.length; i++)
            {
                let currentMapObject = mapObjects[i];
                currentMapObject.type = objectTypes[j];
                if (currentMapObject.type === "MinecraftJourneyMapChunkImage")
                {
                    currentMapObject.draw = journeyMapImageDrawFunction;
                }
                mapDisplayItems.push(currentMapObject);
            }
            updateMapView(true);
        };
        sendPostRequest(getMapObjectsRequest, onResponse);
    }
}

tableSelectedEventSubscribers.push(onTableSelection);


let journeyMapImageDrawFunction = function ()
{
    /*
     * Process For Drawing a journeyMapChunkImage
     *
     * Create the Texture
     *
     * Create The Plane
     *
     * Add the Texture To The plane
     *
     * Correct The Planes Position
     *
     *
     * */


    // Create the Texture
    let mapObjectTexture = new BABYLON.StandardMaterial();
    let image = this.image;
    let imageURL = "data:image/png;base64," + image.base64ImageContents;
    let loadedObjectTexture = new BABYLON.Texture(imageURL);
    mapObjectTexture.diffuseTexture = loadedObjectTexture;
    mapObjectTexture.backFaceCulling = false;

    //Create The Plane
    let planeWidth, planeHeight;
    planeHeight = 16;
    planeWidth = 16;
    let journeyMapChunkPlane = BABYLON.MeshBuilder.CreatePlane(this, {
        width: planeWidth,
        height: planeHeight
    });

    //Add the Texture To The plane
    journeyMapChunkPlane.material = mapObjectTexture;


    //Correct The Planes Position
    journeyMapChunkPlane.rotation.x = Math.PI / 2;
    journeyMapChunkPlane.rotation.y = Math.PI * .5;
    //Note: Planes Render From the Center so we need to offset the Planes to match the true location
    journeyMapChunkPlane.position.x = this.location.x + (planeHeight / 2);
    journeyMapChunkPlane.position.y = -1;
    journeyMapChunkPlane.position.z = this.location.z + (planeWidth / 2);
}


/*Map Updating and Draw Changing*/

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
        /*I estimated a good scale factor from taking the amount of change vs the render distance at 64*/
        let scaleFactor = (200 / 100);

        let axisRedrawThreshold = renderDistance * scaleFactor;

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
    let updateRenderDistanceThreshold = 10;

    if (renderDistance > updateRenderDistanceThreshold)
    {
        shouldUpdate = false;
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

let defaultChunkImageName = "defaultChunk.png";
let loadedChunkImageName = "loadedChunk.png";
let mapIconOneImageName = "mapIcon1.png"
/*Resource Loader*/
let resourceLoader = {};
let resourcesToLoad = [defaultChunkImageName, loadedChunkImageName, mapIconOneImageName];


/**/
let textures = {};

let initTextures = function ()
{
    let defaultChunkMaterial = new BABYLON.StandardMaterial("");
    defaultChunkMaterial.diffuseTexture = new BABYLON.Texture(resourceLoader[defaultChunkImageName]);
    defaultChunkMaterial.backFaceCulling = false;
    defaultChunkMaterial.diffuseTexture.hasAlpha = true;
    defaultChunkMaterial.disableLighting = true;
    textures[defaultChunkImageName] = defaultChunkMaterial;

    let loadedChunkMaterial = new BABYLON.StandardMaterial("");
    loadedChunkMaterial.diffuseTexture = new BABYLON.Texture(resourceLoader[loadedChunkImageName]);
    loadedChunkMaterial.backFaceCulling = false;
    textures[loadedChunkImageName] = loadedChunkMaterial;

    let mapPinMaterial = new BABYLON.StandardMaterial("");
    mapPinMaterial.diffuseTexture = new BABYLON.Texture(resourceLoader[mapIconOneImageName]);
    mapPinMaterial.diffuseTexture.hasAlpha = true;
    mapPinMaterial.backFaceCulling = false;
    textures[mapIconOneImageName] = mapPinMaterial;


}


let toChunkCoord = function (point3D)
{
    let xCoord, zCoord;
    xCoord = Math.floor(point3D.x / 16);
    zCoord = Math.floor(point3D.z / 16);
    return new Point2D(xCoord, zCoord);
}


/*
 * Given the X and Z  Coordinate
 * this function returns if it should be rendered or not
 *
 *  */
let shouldRender = function (location)
{
    let chunkToCheck = toChunkCoord(location);
    let currentChunk = toChunkCoord(camera.position);
    let radius = Math.abs(renderDistance / 2);

    if (Math.abs(chunkToCheck.x - currentChunk.x) > radius)
    {
        return false;
    }

    if (Math.abs(chunkToCheck.y - currentChunk.y) > radius)
    {
        return false;
    }

    return true;
}


let renderTableObjects = function ()
{


    for (let i = 0; i < mapDisplayItems.length; i++)
    {
        let currentItem = mapDisplayItems[i];
        if (shouldRender(currentItem.location))
        {
            if (currentItem.draw !== undefined)
            {
                currentItem.draw();
            }
        }

    }
}

let drawDefaultChunks = function ()
{

    let half = renderDistance / 2;

    let xTranslation = Math.floor(cameraX / 16);
    let zTranslation = Math.floor(cameraZ / 16);

    for (let i = -half + xTranslation; i < half + xTranslation; i++)
    {
        for (let c = -half + zTranslation; c < half + zTranslation; c++)
        {

            let newPlane = BABYLON.MeshBuilder.CreatePlane("plane", {width: 16, height: 16});

            newPlane.material = textures[defaultChunkImageName];
            newPlane.rotation.x = Math.PI / 2;
            newPlane.rotation.y = Math.PI * 1.5;


            let x = (i * 16) + 8;
            let z = (c * 16) + 8;
            newPlane.position.x = x;
            newPlane.position.y = 0;
            newPlane.position.z = z;

        }
    }

    renderTableObjects();

}


/*Babylon Setup*/

let createScene = function ()
{
    scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(1, 1, 1);
    camera = new BABYLON.FreeCamera('FlyCamera', new BABYLON.Vector3(23, -100, 13), scene);

    camera.setTarget(BABYLON.Vector3.Zero());
    camera.inputs.clear();
    camera.inputs.addMouse();
    camera.rotation.y = Math.PI * 1.5;
    camera.rotation.z = Math.PI * .5;
    camera.rotation.x = Math.PI * 1.5;
    initTextures();
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
        xDifference *= .25;
        yDifference *= .25;

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
    updateMapView(true);

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


for (let i = 0; i < resourcesToLoad.length; i++)
{
    let currentResource = resourcesToLoad[i];
    let onResourceLoad = function (xmlHttpRequest)
    {
        let reader = new FileReader();
        reader.onloadend = function ()
        {

            resourceLoader[currentResource] = reader.result;
            if (i + 1 === resourcesToLoad.length)
            {
                setTimeout(() =>
                {
                    initBabylonFunction();
                }, 1000);
            }
        }
        reader.readAsDataURL(xmlHttpRequest.response);
    }

    getFile(currentResource, onResourceLoad);
}



