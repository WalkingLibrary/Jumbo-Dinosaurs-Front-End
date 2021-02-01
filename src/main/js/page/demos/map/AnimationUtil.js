/*
Animation


let actionManager = new BABYLON.ActionManager(scene);
sphere.actionManager = actionManager;

let scaleXAnimation = new BABYLON.Animation("myAnimation", "scaleX", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
let scaleYAnimation = new BABYLON.Animation("myAnimation", "scaleY", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);


rect1.animations = [];
rect1.animations.push(scaleXAnimation);
rect1.animations.push(scaleYAnimation);

actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(ev){
    scene.beginAnimation(rect1, 0, 10, false);
}));
//if hover is over remove highlight of the mesh
actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(ev){
    scene.beginAnimation(rect1, 10, 0, false);
}));


*/

function addSquareXZAnimation(scene, triggerMesh, animatedMesh, maxSize, minSize)
{

    let actionManager = new BABYLON.ActionManager(scene);
    triggerMesh.actionManager = actionManager;

    let scaleXAnimation = new BABYLON.Animation("myAnimation",
        "scaling.x",
        30,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    let scaleZAnimation = new BABYLON.Animation("myAnimation2",
        "scaling.y",
        30,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);


    let keys = [];

    keys.push({
        frame: 0,
        value: minSize
    });
    keys.push({
        frame: 10,
        value: maxSize
    });

    scaleXAnimation.setKeys(keys);
    scaleZAnimation.setKeys(keys);
    animatedMesh.animations = [];
    animatedMesh.animations.push(scaleXAnimation);
    animatedMesh.animations.push(scaleZAnimation);


    actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function (ev)
    {
        scene.beginAnimation(animatedMesh, minSize, maxSize, false);
    }));
//if hover is over remove highlight of the mesh
    actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function (ev)
    {
        scene.beginAnimation(animatedMesh, maxSize, minSize, false);
    }));

}