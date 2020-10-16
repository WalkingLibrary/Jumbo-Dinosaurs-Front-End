/* Script to handle the User Page Interactions
 * */





let userPageForms = [
    new Form("userContentForm.html", [userContentBlock], setUpUserContent),
    new Form("permissionsTableForm.html"),
    new Form("tablePermissionsForm.html"),
    new Form("editTableForm.html"),
    new Form("createTableForm.html"),
    new Form("activateAccountForm.html")
];

for (let i = 0; i < userPageForms.length; i++)
{
    defaultFormLoader.loadForm(userPageForms[i]);
}


function redirectToLoginPage()
{
    window.location.href = host + "login.html";
}

function logOut()
{
    /*
     * process for logging out
     * remove user info from local and session storage
     * display login form
     *
     *  */

    //remove user info from local and session storage
    clearUserInfo();


    //display login form
    redirectToLoginPage();
}

function setUpUserContent()
{
    /* Process for setting up the user content
     * display welcome message
     * check accounts activity and display activation message
     * */

    //display welcome message
    let usernameHeader = document.getElementById("usernameHeader");
    usernameHeader.innerHTML = "Welcome " + getUser().username;


    //check accounts activity and display activation message
    let isActiveRequest = new PostRequest("CheckActive", getUser());
    let onResponse = function (xmlHttpRequest)
    {
        if (xmlHttpRequest.status === 200)
        {
            let jsonResponse = JSON.parse(xmlHttpRequest.responseText);
            let isActive = jsonResponse.isActive;
            if (!isActive)
            {
                let activationStatus = document.getElementById("activationStatus");
                activationStatus.style.visibility = "visible";
            }
        }
    };

    sendPostRequest(isActiveRequest, onResponse);
    refreshUsersTables();
}

/**/
function activateAccount()
{
    /*
     * Process for sending an activation code
     * Display Loading Animation
     * Clear Old Errors
     * Validate Inputs and display errors
     * Craft Post Request with stored user
     * Send Post request and display Success/Error
     *
     *  */

    //Display Loading Animation
    let activationLoadingButton = document.getElementById("activationLoadingButton");
    let activationAnimationHelper = new LoadAnimationHelper(activationLoadingButton);
    activationAnimationHelper.toggleLoading();

    //Clear Old Errors
    let activationError = document.getElementById("activationError");
    activationError.innerHTML = "";

    //Validate Inputs and display errors
    let activationToken = document.getElementById("activationToken");
    let activationCode = activationToken.value;
    if (activationCode === "")
    {
        activationError.innerHTML = "Enter A Code";
        activationAnimationHelper.toggleLoading();
        return;

    }


    //Craft Post Request with stored user
    let activationRequest = new PostRequest("ActivateAccount");

    if (getUser() === null)
    {
        displayLoginForm();
        return;
    }

    activationRequest.username = getUser().username;
    activationRequest.token = activationCode
    activationRequest.tokenUse = "email";


    //Send Post request and display Success/Error
    let onResponse = function (xmlHttpRequest)
    {
        if (xmlHttpRequest.status === 200)
        {
            activationLoadingButton.innerHTML = "Account Activated";
            return;
        }

        activationError.innerHTML = "An Error has occurred try again";
        activationAnimationHelper.toggleLoading();

    }

    sendPostRequest(activationRequest, onResponse);

}

function resendActivationCode()
{
    /*
     * Process for resending an activation code
     * Get the User
     * Craft PostRequest
     * Display requests errors if any or show a successful
     *  */
    let activationError = document.getElementById("activationError");
    activationError.innerHTML = "";
    let resendActivationRequest = new PostRequest("ReSendActivationEmail", getUser());

    if (getUser() === null)
    {
        displayLoginForm();
        return;
    }

    resendActivationRequest.captchaCode = captchaCode;

    let onResponse = function (xmlHttpRequest)
    {

        activationError.style.color = "red";

        if (xmlHttpRequest.status === 200)
        {
            let jsonResponse = JSON.parse(xmlHttpRequest.responseText);
            if (jsonResponse.isActive === true)
            {
                activationError.innerHTML = "Account already Activated";
                return;
            }
            activationError.style.color = "lawngreen";
            activationError.innerHTML = "Another Email Has Been Sent"
            return;
        }

        if (xmlHttpRequest.status === 500)
        {
            activationError.innerHTML = "There was a Server Error<br>Try again Later";
            return;
        }

        activationError.innerHTML = "There was an Error<br>Refresh and Try Again";
    }

    sendPostRequest(resendActivationRequest, onResponse);
}



function setObjectTypes(selectElement)
{
    /*
     * Process for getting and setting all the acceptable objects
     * Create PostRequest and CallBack Function
     * Set the object options in the selectElement
     *  */

    //Create PostRequest and CallBack Function
    let getObjectTypesRequest = new PostRequest("GetObjectTypes");

    //Call Back Function
    let onResponse = function (xmlHttpRequest)
    {
        /*
         * Process for dealing with the return response
         * Go thru the returned array and add each object type to the given selectElement
         * Note: The getObjectTypesRequest should return a arrayNamed objectTypes
         *  */
        if (xmlHttpRequest.status === 200)
        {
            // Go thru the returned array and add each object type to the given selectElement
            let objectTypesArray = JSON.parse(xmlHttpRequest.responseText).objectTypes;
            for (let i = 0; i < objectTypesArray.length; i++)
            {
                //Create Child
                let objectType = objectTypesArray[i];
                let newOption = document.createElement("option");
                newOption.value = objectType;
                newOption.innerHTML += objectType;

                //Add Child
                selectElement.innerHTML += newOption.outerHTML;
            }
        }
    }
    //send PostRequest
    sendPostRequest(getObjectTypesRequest, onResponse);

}

function createTable()
{
    /*
     * Process for creating a table
     * Clear Old Errors
     * Get/Validate the name of the table
     * Get the object type of the table
     * Create the post request/crud request
     * display Loading Animation
     * send the post request
     *  */


    //Clear Old Errors
    let errorDisplay = document.getElementById("tableNameError");
    errorDisplay.innerHTML = "";

    //Get the name of the table
    let tableNameInput = document.getElementById("tableName");
    let tableName = tableNameInput.value;

    //Note: Validation of a table name is the same as a Username
    //Validate the table name
    if (!isAValidUsername(tableName))
    {

        errorDisplay.innerHTML += "Enter a Valid Table Name";
        return
    }


    //Create the post request/ crud request
    let createTableRequest = new PostRequest("CreateTable");

    createTableRequest.captchaCode = captchaCode;

    let crudRequest = new CRUDRequest();

    crudRequest.tableName = tableName;


    createTableRequest.setCRUDRequest(crudRequest);

    //display Loading Animation
    //Note: The button animation helper is needed in the callback function
    let loadingAnimationManager = defaultLoadingAnimation.produceFormManager(document.getElementById("createTableButton"));
    loadingAnimationManager.displayForm();

    //Call Back Method
    let onResponse = function (xmlHttpRequest)
    {
        if (xmlHttpRequest.status === 200)
        {
            defaultFormLoader["createTableForm.html"].produceFormManager(userContentBlock).removeForm();
            loadingAnimationManager.removeForm();
            refreshUsersTables();
        }
    }


    ///send the post request
    sendPostRequest(createTableRequest, onResponse);


}



function refreshUsersTables()
{
    /*
     * Process for Refreshing the Users Tables
     * Grab the Image Element
     * Clear the tablesDiv
     * Add the Image Element back to The Tables Div
     * Display The Users Tables
     *  */

    let tablesDiv = document.getElementById("tablesDiv");
    //Grab the Image Element
    let tablesDivIcon = document.getElementById("tablesDivIcon");
    //Clear the tablesDiv
    tablesDiv.innerHTML = "";
    //Add the Image Element back to The Tables Div
    tablesDiv.appendChild(tablesDivIcon);
    //Display The Users Tables
    displayUsersTables();

}


function displayUsersTables()
{
    getUsersTables(function (xmlHttpRequest)
    {
        if (xmlHttpRequest.status === 200)
        {
            /*
             * Process for Displaying the Users Tables
             * Create the Name Tag
             * Create the Creator Tag
             * Create the Edit tag
             * Create the tables Tag
             * append Name, Creator, Edit tags to the Table Tag
             * append the Table Tag to the tables div
             *
             *  */

            let tablesArray = JSON.parse(xmlHttpRequest.responseText);

            let tablesDiv = document.getElementById("tablesDiv");
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

                //Create the Edit tag
                let editImage = document.createElement("img");
                editImage.className = "editImg";
                editImage.src = "/100x100cogIcon.png";
                editImage.alt = "Edit";
                editImage.id = currentTable.name + currentTable.id;
                editImage.onclick = function ()
                {
                    displayEditTableWindow(currentTable);
                };
                //Create the tables Tag
                let newTablesDiv = document.createElement("div");
                newTablesDiv.className = "tableDiv";

                //append Name, Creator, Edit tags to the Table Tag
                newTablesDiv.appendChild(nameTag);
                newTablesDiv.appendChild(creatorTag);
                newTablesDiv.appendChild(editImage);

                //append the Table Tag to the tables div
                tablesDiv.appendChild(newTablesDiv);
            }
        }
    });

}








//<img src="/xMark.png" alt="CheckMark">
//"permissions":{"Jums":{"adminPerms":true,"canAdd":true,"canRemove":true,"canSearch":true}}
function displayEditTableWindow(tableToEdit)
{
    let editTableFormManager = defaultFormLoader["editTableForm.html"].produceFormManager(userContentBlock, true);
    editTableFormManager.displayForm();

    //Set Up Table Name Display
    let tableNameHeader = document.getElementById("tableNameHeader");
    tableNameHeader.innerHTML = "";
    tableNameHeader.insertAdjacentHTML("beforeend", tableToEdit.name);


    //Setup Delete Button
    let deleteTable = document.getElementById("deleteTable");
    deleteTable.onclick = function ()
    {
        let animationManager = defaultLoadingAnimation.produceFormManager(document.getElementById("deleteTableLoadingContainer"), true);
        animationManager.displayForm();

        let deleteTableRequest = new PostRequest("DeleteTable");
        let deleteTableCRUDRequest = new CRUDRequest();
        deleteTableCRUDRequest.tableID = tableToEdit.id;
        deleteTableRequest.setCRUDRequest(deleteTableCRUDRequest);

        let onResponse = function (xmlHttpRequest)
        {
            editTableFormManager.removeForm();
            refreshUsersTables();
        };
        let signRequestDiv = document.getElementById("signRequestDiv");
        displaySignRequestWindow(deleteTableRequest, onResponse, signRequestDiv);
    };

    //Setup Add User Button
    let addUserButton = document.getElementById("addUserInputButton");
    addUserButton.onclick = function ()
    {
        let addUserInput = document.getElementById("addUserInput");
        let newUser = addUserInput.value;
        addUserInput.value = "";
        tableToEdit.permissions[newUser] = {};
        tableToEdit.permissions[newUser].adminPerms = false;
        tableToEdit.permissions[newUser].canAdd = false;
        tableToEdit.permissions[newUser].canRemove = false;
        tableToEdit.permissions[newUser].canSearch = false;
        editTableFormManager.removeForm();
        displayEditTableWindow(tableToEdit);
    };

    //Setup Apply/Save Button
    let apply = document.getElementById("apply");
    apply.onclick = function ()
    {
        let animationManager = defaultLoadingAnimation.produceFormManager(document.getElementById("applyLoadingContainer"), true);
        animationManager.displayForm();

        let updateTableRequest = new PostRequest("UpdateTable");
        let updateTableCRUDRequest = new CRUDRequest();
        updateTableCRUDRequest.object = JSON.stringify(tableToEdit);
        updateTableCRUDRequest.tableID = tableToEdit.id;
        updateTableRequest.setCRUDRequest(updateTableCRUDRequest);
        let onResponse = function ()
        {
            editTableFormManager.removeForm();
            refreshUsersTables();
        };

        sendPostRequest(updateTableRequest, onResponse);
    };

    //Dispaly Permissions
    displayPermissions(tableToEdit);

}


function displayPermissions(tableToDisplay)
{

    let tablePermissions = document.getElementById("tablePermissions");


    let permissionsForm = defaultFormLoader["permissionsTableForm.html"];
    let permissionsFormManager = permissionsForm.produceFormManager(tablePermissions, true);
    permissionsFormManager.displayForm();


    let editorsUsername = getUser().username;

    let usersPermissions = tableToDisplay.permissions[editorsUsername];
    let canEditAdmin = tableToDisplay.creator === editorsUsername;
    let canEditUsage = usersPermissions.adminPerms;


    let togglePublic = document.getElementById("publicStatus");
    togglePublic.src = getEditPermissionsIconLink(tableToDisplay.isPublic, usersPermissions.adminPerms);
    togglePublic.onclick = function ()
    {
        if (usersPermissions.adminPerms)
        {
            tableToDisplay.isPublic = !tableToDisplay.isPublic;
            defaultFormLoader["editTableForm.html"].produceFormManager(userContentBlock).removeForm();
            displayEditTableWindow(tableToDisplay);
        }
    }

    for (let i = 0; i < Object.getOwnPropertyNames(tableToDisplay.permissions).length; i++)
    {
        let username = Object.getOwnPropertyNames(tableToDisplay.permissions)[i];
        let currentUsersPermissions = tableToDisplay.permissions[username];

        //Create header and permissions toggle buttons
        let usernameHeader = document.createElement("h3");
        usernameHeader.innerHTML = username;
        permissionsTable.insertAdjacentHTML("beforeend", usernameHeader.outerHTML);


        let canAdminIcon = document.createElement("img");
        canAdminIcon.src = getEditPermissionsIconLink(currentUsersPermissions.adminPerms, canEditAdmin);
        canAdminIcon.id = "canAdminIcon" + i;
        permissionsTable.insertAdjacentHTML("beforeend", canAdminIcon.outerHTML);

        canAdminIcon = document.getElementById("canAdminIcon" + i);
        canAdminIcon.onclick = function ()
        {
            if (canEditAdmin)
            {
                tableToDisplay.permissions[username].adminPerms = !tableToDisplay.permissions[username].adminPerms;
                defaultFormLoader["editTableForm.html"].produceFormManager(userContentBlock).removeForm();
                displayEditTableWindow(tableToDisplay);
            }
        };


        let canAddIcon = document.createElement("img");
        canAddIcon.src = getEditPermissionsIconLink(currentUsersPermissions.canAdd, canEditUsage);
        canAddIcon.id = "canAddIcon" + i;
        permissionsTable.insertAdjacentHTML("beforeend", canAddIcon.outerHTML);
        canAddIcon = document.getElementById("canAddIcon" + i);
        canAddIcon.onclick = function ()
        {
            if (canEditUsage)
            {
                tableToDisplay.permissions[username].canAdd = !tableToDisplay.permissions[username].canAdd;
                defaultFormLoader["editTableForm.html"].produceFormManager(userContentBlock).removeForm();
                displayEditTableWindow(tableToDisplay);
            }
        };


        let canSearchIcon = document.createElement("img");
        canSearchIcon.src = getEditPermissionsIconLink(currentUsersPermissions.canSearch, canEditUsage);
        canSearchIcon.id = "canSearchIcon" + i;
        permissionsTable.insertAdjacentHTML("beforeend", canSearchIcon.outerHTML);
        canSearchIcon = document.getElementById("canSearchIcon" + i);
        canSearchIcon.onclick = function ()
        {
            if (canEditUsage)
            {
                tableToDisplay.permissions[username].canSearch = !tableToDisplay.permissions[username].canSearch;
                defaultFormLoader["editTableForm.html"].produceFormManager(userContentBlock).removeForm();
                displayEditTableWindow(tableToDisplay);
            }
        };

        let canRemoveIcon = document.createElement("img");
        canRemoveIcon.src = getEditPermissionsIconLink(currentUsersPermissions.canRemove, canEditUsage);
        canRemoveIcon.id = "canRemoveIcon" + i;
        permissionsTable.insertAdjacentHTML("beforeend", canRemoveIcon.outerHTML);
        canRemoveIcon = document.getElementById("canRemoveIcon" + i);
        canRemoveIcon.onclick = function ()
        {
            if (canEditUsage)
            {
                tableToDisplay.permissions[username].canRemove = !tableToDisplay.permissions[username].canRemove;
                defaultFormLoader["editTableForm.html"].produceFormManager(userContentBlock).removeForm();
                displayEditTableWindow(tableToDisplay);
            }
        };


    }
}


/*
 * When editing a table you can either edit a value or not
 * and then the value can be true or not
 *
 *  */
function getEditPermissionsIconLink(canDo, canEdit)
{
    if (canEdit)
    {
        if (canDo)
        {
            return "/checkMark.png";
        }
        return "/xMark.png";
    }


    if (canDo)
    {
        return "/grayCheckMark.png";
    }

    return "/grayxMark.png";
}








