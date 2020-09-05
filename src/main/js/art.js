getPhotos()


/*
 *
 * Work In Progress
 *
 *
 *  */
function getPhotos()
{
    let getPhotosPostRequest = new PostRequest("GetObject");
    let getPhotosCRUDRequest = new CRUDRequest();

    getPhotosPostRequest.captchaCode = captchaCode;


    getPhotosPostRequest.setCRUDRequest(getPhotosCRUDRequest);

    let onResponse = function (xmlHttpRequest)
    {
        console.log(xmlHttpRequest.status);
        console.log(xmlHttpRequest.responseText);
    };

    sendPostRequest(getPhotosPostRequest, onResponse);
}