function convertImageToText()
{
    clearErrors();
    let postButtonDiv = document.getElementById("postButtonDiv");
    let animationManager = defaultLoadingAnimation.produceFormManager(postButtonDiv);
    animationManager.displayForm();
    let errorDisplay = document.getElementById("errorDisplay");
    let fileSelector = document.getElementById("fileSelector");
    if (fileSelector.postImage === undefined)
    {
        errorDisplay.innerHTML += "Select a Photo";
        animationManager.removeForm();
        return;
    }
    let maxImageSize = 1000000
    if (fileSelector.postImage.base64ImageContents.length > maxImageSize)
    {
        errorDisplay.innerHTML = "Image to Big";
        animationManager.removeForm();
        return;
    }

    let convertRequest = new PostRequest("ImageToTextGoogleAPI");
    convertRequest.content = JSON.stringify(fileSelector.postImage);

    let onResponse = function (xmlHttpRequest)
    {

    }
    animationManager.removeForm();

    sendPostRequest(convertRequest, onResponse, true);


}