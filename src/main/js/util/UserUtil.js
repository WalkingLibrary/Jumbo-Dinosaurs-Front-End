const contentContainer = document.getElementById("userContent");
let signRequestForm = new Form("signRequestForm.html");
defaultFormLoader.loadForm(signRequestForm);
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


function isAValidUsername(username)
{
    /*
     * Process for checking if a username is valid
     * Check the Length
     * Check the Characters
     *  */


    //Check the Length
    if (username.length === 0)
    {
        return false;
    }

    //Make Sure Username is under 15 characters long
    if (username.length > 15)
    {
        return false;
    }

    //Check the Characters
    //Characters A-Z, a-z, 0-9, and _ are allowed
    let whitelistedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
    for (let i = 0; i < username.length; i++)
    {
        if (!whitelistedChars.includes(username.charAt(i)))
        {
            return false;
        }
    }

    return true;
}

function getUsersTables(onResponse)
{
    /*
     * Process for getting the users tables
     * Create the Post Request and Execute the request with the given onResponse Function
     *  */

    //Create the Post Request and Execute the request with the given onResponse Function
    let getTablesRequest = new PostRequest("GetTables");
    let getTablesCRUDRequest = new CRUDRequest();
    getTablesRequest.setCRUDRequest(getTablesCRUDRequest);
    sendPostRequest(getTablesRequest, onResponse);

}

function displaySignRequestWindow(requestToSign, onResponse, displayDiv)
{
    let signRequestFormManager = defaultFormLoader["signRequestForm.html"].produceFormManager(displayDiv, true);
    signRequestFormManager.displayForm();

    let submitRequestButton = document.getElementById("submitRequestButton");
    let passwordInput = document.getElementById("passwordInput");
    submitRequestButton.onclick = function ()
    {

        requestToSign.password = passwordInput.value;
        sendPostRequest(requestToSign, onResponse);
        signRequestFormManager.removeForm();
        signRequestFormManager = undefined;
    };
}

let selectedTable;

function refreshTableSelector(elementToDisplayOn)
{


    function displayTablesFunction(xmlHttpRequest)
    {
        elementToDisplayOn.innerHTML = "";
        if (xmlHttpRequest.status === 200)
        {
            /*
             * Process for Displaying the Users Tables
             * Create the Name Tag
             * Create the Creator Tag
             * Create the tables Tag
             * append Name, Creator, Edit tags to the Table Tag
             * append the Table Tag to the tables div
             *
             *  */

            let tablesArray = JSON.parse(xmlHttpRequest.responseText);

            let tableList = [];

            for (let i = 0; i < tablesArray.length; i++)
            {
                let currentTableJson = tablesArray[i];
                tableList[i] = new Table(currentTableJson);
                let currentTable = tableList[i];

                //Create the Name Tag
                let nameTag = document.createElement("h5");
                nameTag.className = "nameTag";
                nameTag.innerHTML = currentTable.name;

                // Create the Creator Tag
                let creatorTag = document.createElement("h5");
                creatorTag.className = "creatorTag";
                creatorTag.innerHTML = "Creator: " + currentTable.creator;

                //Create the tables Tag
                let newTablesDiv = document.createElement("div");
                newTablesDiv.className = "tableDiv";
                newTablesDiv.className += " standardOutlineWhiteBackGround";

                //append Name, Creator, Edit tags to the Table Tag
                newTablesDiv.appendChild(nameTag);
                newTablesDiv.appendChild(creatorTag);
                if (selectedTable !== undefined)
                {

                    if (currentTable.id === selectedTable.id)
                    {
                        newTablesDiv.className += " selected";
                    }
                }

                //append the Table Tag to the tables div
                elementToDisplayOn.appendChild(newTablesDiv);

                newTablesDiv.onclick = function ()
                {
                    selectedTable = currentTable;
                    displayTablesFunction(xmlHttpRequest);
                };
            }
        }


    }

    getUsersTables(displayTablesFunction);
}