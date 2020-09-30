/* Script to help interact with backEnd
 * */


function sendPostRequest(postRequest, onReadyFunction)
{
    let xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.onreadystatechange = function ()
    {
        if (this.readyState === 4)
        {
            onReadyFunction(xmlHttpRequest);
        }
    };
    xmlHttpRequest.open("POST", host, true);
    xmlHttpRequest.setRequestHeader('Content-Type', 'application/json');
    xmlHttpRequest.send(JSON.stringify(postRequest));
}






