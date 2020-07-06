/* Script to help interact with backEnd
 * */

function getUser()
{
    return null;
}

class PostRequest
{
    constructor(command)
    {
        this.command = command;
    }
}


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


/* Sends a XMLHttpRequest To Get The Form Html
 *
 *
 *  */
function getForm(pageName, onReadyFunction)
{
    let xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.onreadystatechange = function ()
    {
        if (this.readyState === 4 && this.status === 200)
        {
            onReadyFunction(xmlHttpRequest);
        }
    };
    xmlHttpRequest.open("GET", pageName, true);
    xmlHttpRequest.send();
}