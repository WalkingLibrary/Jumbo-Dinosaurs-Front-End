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
        if (getUser() !== undefined)
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
        console.log(tableJson.permissions);
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


/*
 * Gets the loading animation html and stores it in a usable variable
 *  */
let loadingAnimationHTML;
let loadingAnimationHTMLStoreFunction = function (xmlHttpRequest)
{
    if (xmlHttpRequest.status === 200)
    {
        loadingAnimationHTML = xmlHttpRequest.responseText;
    }
    else
    {
        loadingAnimationHTML = "<h1>Loading...</h1>";
    }
}
getForm(getFormLink("loadingAnimation.html"), loadingAnimationHTMLStoreFunction);

class LoadAnimationHelper
{

    constructor(element)
    {
        this.element = element;
        this.isLoading = false;
    }

    toggleLoading()
    {
        if (this.isLoading)
        {
            this.element.innerHTML = this.preHTML;
            this.isLoading = false;
            return;
        }
        this.preHTML = this.element.innerHTML;
        this.element.innerHTML = loadingAnimationHTML;
        this.isLoading = true;
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

function getFormLink(formName)
{
    return host + formName;
}


//This is defined in navbar.js but requires function in postutil to work
// we call it here
getForm(getFormLink("navbar.html"), loadNavBarFunction);

