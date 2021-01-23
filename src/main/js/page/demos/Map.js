/*Get the Canvas and Set it up*/
let mapCanvas = document.getElementById("mapCanvas");
let canvasWidth = 600;
let canvasHeight = 600;

let cameraX, cameraZ;


mapCanvas.width = canvasWidth;
mapCanvas.height = canvasHeight;

let defaultChunkImage;


let scene;
let engine = new BABYLON.Engine(mapCanvas, true);

let createScene = function ()
{
    let scene = new BABYLON.Scene(engine);

    let camera = new BABYLON.FreeCamera('FlyCamera', new BABYLON.Vector3(0, -250, 0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());

    camera.inputs.clear();
    camera.inputs.addMouse();

    /* Skull mesh
    let dinoSkullMesh = BABYLON.SceneLoader.ImportMeshAsync("", "/localhost/", "skull (2).json", scene);
    dinoSkullMesh.then(function (result)
    {
        dinoSkullMesh = result.meshes[0];
        dinoSkullMesh.position = new BABYLON.Vector3(0, -20, 0);
    });

     */
    camera.rotation.y = Math.PI * 1.5;
    camera.rotation.z = Math.PI * .5;
    camera.rotation.x = Math.PI * 1.5;
    const mat = new BABYLON.StandardMaterial("");

    let texture = new BABYLON.Texture(defaultChunkImage);
    mat.diffuseTexture = texture;
    mat.specularColor = new BABYLON.Color3(0, 0, 0);
    mat.backFaceCulling = false;//Allways show the front and the back of an element


    for (let i = 0; i < 16; i++)
    {
        for (let c = 0; c < 16; c++)
        {
            let newPlane = BABYLON.MeshBuilder.CreatePlane("plane", {width: 16, height: 16});
            newPlane.material = mat;
            newPlane.rotation.x = Math.PI / 2;
            newPlane.rotation.y = Math.PI * 1.5;
            newPlane.position.x = (i * 16) + 8;
            newPlane.position.y = 0;
            newPlane.position.z = (c * 16) + 8;
        }
    }


    scene.createDefaultLight();
    return scene;

}


// the canvas/window resize event handler
window.addEventListener('resize', function ()
{
    engine.resize();
});


/*Event Listener Set up for the map Canvas */

let dragStartX, dragStartY, dragStartCameraX, dragStartCameraY, isDown;

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
    /*
     new BABYLON.AssetsManager(scene)
     scene.meshes.push(box);

     */
}

function updateCoordinateInput()
{

    let xInput = document.getElementById("x");
    let zInput = document.getElementById("z");
    xInput.value = Math.trunc(cameraX);
    zInput.value = Math.trunc(cameraZ);
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
        xDifference *= .1;
        yDifference *= .1;

        /*change the camera according to where your camera started to how much your mouse's position has changed */
        let previousPosition = scene.activeCamera.position;
        let newCameraPosition = new BABYLON.Vector3(dragStartCameraX + xDifference, previousPosition.y, dragStartCameraY + yDifference);
        cameraX = newCameraPosition.x;
        cameraZ = newCameraPosition.z;
        updateCoordinateInput();
        scene.activeCamera.position = newCameraPosition;
    }
}

let responseFunction = function ()
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
                let newCameraPosition = new BABYLON.Vector3(previousPosition.x, previousPosition.y - event.deltaY, previousPosition.z);
                scene.activeCamera.position = newCameraPosition;
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
        responseFunction();
    }
    reader.readAsDataURL(xmlHttpRequest.response);
};

xmlHttpRequest.open("GET", host + "defaultChunk.png", true);
xmlHttpRequest.responseType = "blob";
xmlHttpRequest.send();


