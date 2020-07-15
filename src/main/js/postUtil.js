/* Script to help interact with backEnd
 * */

let user;

let userKey = "user";

readUser();

function readUser()
{
    user = JSON.parse(window.sessionStorage.getItem(userKey));
    if (user === null)
    {
        user = JSON.parse(window.localStorage.getItem(userKey));
    }
}

function getUser()
{
    return user;
}

function setUser(newUser, storeTemporary)
{
    user = newUser;
    window.sessionStorage.setItem(userKey, null);
    window.localStorage.setItem(userKey, null);
    if (storeTemporary)
    {
        window.localStorage.setItem(userKey, JSON.stringify(newUser));
    }
    else
    {
        window.sessionStorage.setItem(userKey, JSON.stringify(newUser));
    }

}

class User
{
    constructor(username, token, tokenUse)
    {
        this.username = username;
        this.token = token;
        this.tokenUse = tokenUse;
    }
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