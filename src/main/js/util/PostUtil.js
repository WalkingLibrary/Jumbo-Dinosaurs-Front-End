/* Script to help interact with backEnd
 * */


function sendPostRequest(postRequest, onReadyFunction)
{
    let xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.onreadystatechange = function ()
    {
        if (this.readyState === 4)
        {
            filterRequest(xmlHttpRequest, onReadyFunction(xmlHttpRequest));
        }
    };
    xmlHttpRequest.open("POST", host, true);
    xmlHttpRequest.setRequestHeader('Content-Type', 'application/json');
    xmlHttpRequest.send(JSON.stringify(postRequest));
}


function filterRequest(xmlHttpRequest, onReadyFunction)
{
    if (xmlHttpRequest.status === 403 && getUser() === null)
    {
        clearUserInfo();
        location.reload();
    }
}