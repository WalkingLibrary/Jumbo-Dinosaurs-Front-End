let folder = document.getElementById("folder");


let imageUploadForm = new Form("imageSelectorForm.html");
let descriptionUploadForm = new Form("descriptionForm.html", [folder]);


let userPostMapForms = [
    imageUploadForm,
    descriptionUploadForm

];

defaultFormLoader.loadForms(userPostMapForms);


let tableDiv = document.getElementById("tableSelectorDiv");

refreshTableSelector(tableDiv);


function rotatePostMapDetailForms(formToDisplay)
{
    imageUploadForm.produceFormManager(folder).removeForm();
    descriptionUploadForm.produceFormManager(folder).removeForm();
    formToDisplay.produceFormManager(folder, true).displayForm();
}


function postMapDetail()
{
    clearErrors();

    let postButtonDiv = document.getElementById("postButtonDiv");
    let animationManager = defaultLoadingAnimation.produceFormManager(postButtonDiv, true);
    animationManager.displayForm();

    let x = document.getElementById("x").value;
    let y = document.getElementById("y").value;
    let z = document.getElementById("z").value;
    x = parseInt(x);
    y = parseInt(y);
    z = parseInt(z);

    let errorDisplay = document.getElementById("errorDisplay");

    if (!validateCoordinates(x, y, z))
    {
        errorDisplay.innerHTML = "Enter Valid Coordinates";
        return;
    }

    let isPostingImage = document.getElementsByClassName("opened")[0].innerHTML.toLowerCase().indexOf("image") > -1;


    let serverAddress = document.getElementById("serverInput").value;

    let maxDomainLength = 255;
    if (serverAddress === null || serverAddress.length <= 0 || serverAddress.length > maxDomainLength)
    {
        errorDisplay.innerHTML = "Enter a valid Server Address"
        animationManager.removeForm();
        return;
    }


    let postMapDetailRequest = new PostRequest("AddObject");
    let mapDetailObject;
    mapDetailObject = {};
    mapDetailObject.location = {x, y, z};
    mapDetailObject.server = serverAddress;


    if (isPostingImage)
    {
        let fileSelector = document.getElementById("fileSelector");
        if (fileSelector.postImage === undefined)
        {
            errorDisplay.innerHTML += "Select a Photo";
            animationManager.removeForm();
            return;
        }

        let postImage = fileSelector.postImage;

        //Not accurate to 1mb yet
        if (postImage.base64ImageContents.length > 1000000)
        {
            errorDisplay.innerHTML += "Image Too Large";
            animationManager.removeForm();
            return;
        }

        mapDetailObject.image = postImage;
    }
    else
    {
        let descriptionInput = document.getElementById("Description");
        let description = descriptionInput.value;

        if (description === null ||
            description.length <= 0 ||
            description.length > 1000)
        {
            errorDisplay.innerText += "Enter a Valid Description";
            animationManager.removeForm();
            return;
        }
        let descriptionObject = {username: getUser().username, description: description};
        mapDetailObject.description = descriptionObject;
    }


    if (selectedTable === undefined)
    {
        errorDisplay.innerHTML += "Select a Table";
        animationManager.removeForm();
        return;
    }

    console.log(JSON.stringify(mapDetailObject));

    let addMapDetailCRUDRequest = new CRUDRequest();

    addMapDetailCRUDRequest.object = JSON.stringify(mapDetailObject);
    addMapDetailCRUDRequest.objectType = isPostingImage ? "MinecraftMapImage" : "MinecraftMapDetail";
    addMapDetailCRUDRequest.tableID = selectedTable.id;
    postMapDetailRequest.setCRUDRequest(addMapDetailCRUDRequest);


    let onResponse = function (xmlHttpRequest)
    {
        animationManager.removeForm();
    };

    sendPostRequest(postMapDetailRequest, onResponse);

}

function validateCoordinates(x, y, z)
{
    if (isNaN(x) || isNaN(y) || isNaN(z))
    {
        return false;
    }

    let maxWorldWidth = 30000000;

    if (x > maxWorldWidth || x < -maxWorldWidth)
    {
        return false;
    }

    if (z > maxWorldWidth || z < -maxWorldWidth)
    {
        return false;
    }

    let maxWorldHeight = 255;
    let minWorldHeight = 0;
    if (y > maxWorldHeight || y < minWorldHeight)
    {
        return false;
    }

    return true;
}