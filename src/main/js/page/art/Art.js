
getArtPhotos();

function getArtPhotos()
{
    let photoHolderDiv = document.getElementById("photoHolderDiv")
    let animationManager = defaultLoadingAnimation.produceFormManager(photoHolderDiv, true);
    animationManager.displayForm();

    let getPhotosPostRequest = new PostRequest("GetObjects");
    let getPhotosCRUDRequest = new CRUDRequest();


    let artTableId = 7;
    let objectType = "Image";

    getPhotosCRUDRequest.tableID = artTableId;
    getPhotosCRUDRequest.objectType = objectType;

    getPhotosPostRequest.captchaCode = captchaCode;
    getPhotosPostRequest.setCRUDRequest(getPhotosCRUDRequest);

    let onResponse = function (xmlHttpRequest)
    {
        animationManager.removeForm();
        let photos = JSON.parse(xmlHttpRequest.responseText);
        for (let i = 0; i < photos.length; i++)
        {
            let currentPhoto = photos[i];
            let imageHolder = document.createElement("div");
            imageHolder.className += "widthThirtyThreePercent marginOnePercent";
            let imgElement = document.createElement("img");
            imgElement.src = "data:image/png;base64," + currentPhoto.base64ImageContents;
            imgElement.className += "fill alternativeOutline";
            imageHolder.appendChild(imgElement);
            photoHolderDiv.appendChild(imageHolder);
        }
    };
    sendPostRequest(getPhotosPostRequest, onResponse);
}