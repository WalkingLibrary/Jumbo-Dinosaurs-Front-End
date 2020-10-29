function postImage()
{

    clearErrors();
    let postButtonDiv = document.getElementById("postButtonDiv");
    let animationManager = defaultLoadingAnimation.produceFormManager(postButtonDiv);
    animationManager.displayForm();
    let errorDisplay = document.getElementById("errorDisplay");


    if (selectedTable === undefined)
    {
        errorDisplay.innerHTML += "Select a Table";
        animationManager.removeForm();
        return;
    }
    let fileSelector = document.getElementById("fileSelector");
    if (fileSelector.postImage === undefined)
    {
        errorDisplay.innerHTML += "Select a Photo";
        animationManager.removeForm();
        return;
    }

    let postPhotoRequest = new PostRequest("AddObject");
    let addPhotoCRUDRequest = new CRUDRequest();
    let image = fileSelector.postImage;

    //Not accurate to 1mb yet
    if (image.base64ImageContents.length > 1000000)
    {
        errorDisplay.innerHTML += "Image Too Large";
        animationManager.removeForm();
        return;
    }

    addPhotoCRUDRequest.object = JSON.stringify(image);
    addPhotoCRUDRequest.objectType = "Image";
    addPhotoCRUDRequest.tableID = selectedTable.id;
    postPhotoRequest.setCRUDRequest(addPhotoCRUDRequest);


    let onResponse = function (xmlHttpRequest)
    {
        animationManager.removeForm();
    };

    sendPostRequest(postPhotoRequest, onResponse);
}


let tableDiv = document.getElementById("tablesDiv");

refreshTableSelector(tableDiv);