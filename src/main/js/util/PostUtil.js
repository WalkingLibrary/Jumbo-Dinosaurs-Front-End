/* Script to help interact with backEnd
 * */


function sendPostRequest(postRequest, onReadyFunction, filterResponse)
{
    let xmlHttpRequest = new XMLHttpRequest();
    let shouldFilterResponse = filterResponse === undefined ? true : filterResponse;

    xmlHttpRequest.onreadystatechange = function ()
    {
        if (this.readyState === 4)
        {
            if (shouldFilterResponse)
            {
                filterRequestResponse(xmlHttpRequest, onReadyFunction);
            }
            else
            {
                onReadyFunction(xmlHttpRequest);
            }
        }
    };
    xmlHttpRequest.open("POST", host, true);
    xmlHttpRequest.setRequestHeader('Content-Type', 'application/json');
    xmlHttpRequest.send(JSON.stringify(postRequest));
}


function filterRequestResponse(xmlHttpRequest, onReadyFunction)
{
    if (xmlHttpRequest.status === 403 && getUser() !== null)
    {
        clearUserInfo();
        location.reload();
        return;
    }

    onReadyFunction(xmlHttpRequest);
}