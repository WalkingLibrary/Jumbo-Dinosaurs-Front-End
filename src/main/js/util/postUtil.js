/* Script to help interact with backEnd
 * */


let user;

let userKey = "user";

readUser();


function clearUserInfo()
{
    window.sessionStorage.setItem(userKey, null);
    window.localStorage.setItem(userKey, null);
}

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
    constructor(command, user)
    {
        this.command = command;
        if (getUser() !== null)
        {

            this.username = getUser().username;
            this.tokenUse = getUser().tokenUse;
            this.token = getUser().token;
        }
    }

    setCRUDRequest(request)
    {
        this.content = "";
        this.content += JSON.stringify(request);
    }

}

class CRUDRequest
{
    constructor()
    {
    }
}


class Table
{

    constructor(tableJson)
    {
        this.id = tableJson.id;
        this.permissions = tableJson.permissions;
        this.isPublic = tableJson.isPublic;
        this.creator = tableJson.creator;
        this.name = tableJson.name;
    }


    toString()
    {
        return JSON.stringify(this)
    }
}

let defaultFormLoader = new FormLoader(host);



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






