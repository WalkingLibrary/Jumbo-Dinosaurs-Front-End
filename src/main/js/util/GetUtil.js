function getFile(fileLocalPath, onResourceLoad, gammer)
{
    let xmlHttpRequest = new XMLHttpRequest();


    xmlHttpRequest.onreadystatechange = function ()
    {
        if (this.readyState === 4 && this.status === 200)
        {
            onResourceLoad(xmlHttpRequest);
        }
    };
    xmlHttpRequest.open("GET", host + fileLocalPath, true);
    xmlHttpRequest.responseType = "blob";
    xmlHttpRequest.send();
}