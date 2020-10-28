


/*
 *
 * Work In Progress
 *
 *
 *  */
function getPhotos()
{
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
        let photos = JSON.parse(xmlHttpRequest.responseText);
        for (let i = 0; i < photos.length; i++)
        {
            let currentPhoto = photos[i];
            let imageHolder = document.createElement("div");
            let imgElement = document.createElement("img");
            imgElement.src = "data:image/png;base64," + currentPhoto.base64ImageContents;
            imgElement.className += "fill alternativeOutline";
            imageHolder.appendChild(imgElement);
            document.getElementById("photoHolderDiv").appendChild(imageHolder);
        }
    };
    sendPostRequest(getPhotosPostRequest, onResponse);
}