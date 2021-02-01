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
let axisRedrawThreshold = 64;
let renderDistance = 32;
let maxY = -10;
let minY = -400;//-400

let tableDiv = document.getElementById("tablesDiv");


/*Table Selection and Information Loading*/

refreshTableSelector(tableDiv);
let savedObjects = [];
let objectTypes = ["MinecraftMapImage", "MinecraftMapDetail"];

let onTableSelection = function (table)
{
    let getMapObjectsRequest = new PostRequest("GetObjects");

    let crudRequest = new CRUDRequest();
    crudRequest.tableID = table.id;
    crudRequest.tableName = table.name;
    let objectType = "MinecraftMapImage"
    crudRequest.objectType = objectType;
    getMapObjectsRequest.setCRUDRequest(crudRequest);

    let onResponse = function (xmlHttpRequest)
    {
        savedObjects = [];
        let mapObjects = JSON.parse(xmlHttpRequest.responseText);
        for (let i = 0; i < mapObjects.length; i++)
        {
            let currentMapObject = mapObjects[i];
            savedObjects.push(currentMapObject);
        }
        updateMapView(true);
    };
    sendPostRequest(getMapObjectsRequest, onResponse);
}

tableSelectedEventSubscribers.push(onTableSelection);


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

let renderTableObjects = function ()
{


    for (let i = 0; i < savedObjects.length; i++)
    {

        let mapObjectTexture = new BABYLON.StandardMaterial("");
        let image = savedObjects[i].image;
        let imageURL = "data:image/png;base64," + image.base64ImageContents;
        let loadedObjectTexture = new BABYLON.Texture(imageURL);
        mapObjectTexture.diffuseTexture = loadedObjectTexture;
        mapObjectTexture.backFaceCulling = false;//Allways show the front and the back of an element


        let mapPin = BABYLON.MeshBuilder.CreatePlane("mapPin", {width: 4, height: 4});
        mapPin.material = textures[mapIconOneImageName];
        mapPin.rotation.x = Math.PI / 2;
        mapPin.rotation.y = Math.PI * .5;
        mapPin.position.x = savedObjects[i].location.x + 13;
        mapPin.position.y = -1;
        mapPin.position.z = savedObjects[i].location.z + 3;

        let popUpSize = 32;
        let mapImage = BABYLON.MeshBuilder.CreatePlane("mapImage", {width: 1, height: 1});
        mapImage.material = mapObjectTexture;
        mapImage.rotation.x = Math.PI / 2;
        mapImage.rotation.y = Math.PI * 1.5;
        mapImage.position.x = savedObjects[i].location.x + 8;
        mapImage.position.y = -2;
        mapImage.position.z = savedObjects[i].location.z + 8 - (popUpSize / 2) - 1;
        mapImage.scaling.x = .001;
        mapImage.scaling.z = .001;
        addSquareXZAnimation(scene, mapPin, mapImage, popUpSize, 0);


    }
}

let drawDefaultChunks = function ()
{

    let half = renderDistance / 2;
    let xTranslation = ((Math.floor(cameraX)) - (Math.floor(cameraX) % 16)) * (1 / 16);
    let zTranslation = ((Math.floor(cameraZ)) - (Math.floor(cameraZ) % 16)) * (1 / 16);

    for (let i = -half + xTranslation; i < half + xTranslation; i++)
    {
        for (let c = -half + zTranslation; c < half + zTranslation; c++)
        {

            let newPlane = BABYLON.MeshBuilder.CreatePlane("plane", {width: 16, height: 16});

            newPlane.material = textures[defaultChunkImageName];
            newPlane.rotation.x = Math.PI / 2;
            newPlane.rotation.y = Math.PI * 1.5;
            newPlane.position.x = (i * 16) + 8;
            newPlane.position.y = 0;
            newPlane.position.z = (c * 16) + 8;

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



