/* Script to handle the User Page Interactions
 * */


const userContentBlock = document.getElementById("userContent");


let createTableForm;

let onResponseCreateTableForm = function (xmlHttpRequest)
{
    createTableForm = xmlHttpRequest.responseText;
}

let signRequestForm;

let onResponseSignRequestForm = function (xmlHttpRequest)
{
    signRequestForm = xmlHttpRequest.responseText;
};

let editTableForm;

let onEditTableFormLoad = function (xmlHttpRequest)
{
    editTableForm = xmlHttpRequest.responseText;
};

let permissionsForm;

let onPermissionsFormLoad = function (xmlHttpRequest)
{
    permissionsForm = xmlHttpRequest.responseText;
}

let permissionsTableForm;

let onPermissionsTableForm = function (xmlHttpRequest)
{
    permissionsTableForm = xmlHttpRequest.responseText;
}

getForm(getFormLink("createTableForm.html"), onResponseCreateTableForm);

getForm(getFormLink("tablePermissionsForm.html"), onPermissionsFormLoad)

getForm(getFormLink("editTableForm.html"), onEditTableFormLoad);

getForm(getFormLink("permissionsTableForm.html"), onPermissionsTableForm);

getForm(getFormLink("signRequestForm.html"), onResponseSignRequestForm);


loadPage();

function loadPage()
{
    if (getUser() !== null)
    {
        displayUserContent();
        return;
    }

    displayLoginForm();
}

function displayActivationForm()
{
    displayForm("activateAccountForm.html");
}

function displayLoginForm()
{
    displayForm("loginForm.html");
}


function displaySignUpForm()
{
    displayForm("signupFrom.html");
}

function displayUserContent()
{
    displayForm("userContentForm.html", setUpUserContent);
}


function displayForm(formName, afterLoadFunction)
{
    let displayFormFunction = function (xmlRequest)
    {
        userContentBlock.innerHTML = xmlRequest.responseText;
        if (afterLoadFunction !== null)
        {
            if (afterLoadFunction !== undefined)
            {
                afterLoadFunction();
            }
        }
    };

    getForm(getFormLink(formName), displayFormFunction);
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
    displayLoginForm();
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


/*
 * */
function login()
{
    /* Login Process
     *
     * Clear old Login Error
     * Show Loading animation on login button
     * Validate Form Inputs and Display Errors
     * Create and Send Login Post Request
     * Store Users Token/Info Locally for Later Usage
     * Display User Page
     * */

    let loginError = document.getElementById("loginError");
    loginError.innerHTML = "";

    let loginLoadingButtonDiv = document.getElementById("loginLoadingButton");
    let loginAnimationHelper = new LoadAnimationHelper(loginLoadingButtonDiv);
    loginAnimationHelper.toggleLoading();


    //Validate Form Inputs and Display Errors
    let usernameInput = document.getElementById("usernameInput");
    let username = usernameInput.value;
    //Check the username given
    if (!isAValidUsername(username))
    {
        loginError.innerHTML = "Invalid Username";
        loginAnimationHelper.toggleLoading();
        return;
    }

    //Passwords only limit is it's size
    let passwordInput = document.getElementById("passwordInput");
    let password = passwordInput.value;

    //Create and Send Login Post Request
    let tokenRequest = new PostRequest("GetAuthToken");
    tokenRequest.username = username;
    tokenRequest.password = password;

    let onResponse = function (xmlHttpRequest)
    {
        if (xmlHttpRequest.status === 200)
        {
            let response = xmlHttpRequest.responseText;
            let jsonResponse = JSON.parse(response);
            let token = jsonResponse.token;
            let tokenUse = jsonResponse.tokenUse;

            let newUser = new User(username, token, tokenUse);
            setUser(newUser, rememberMe.value);
            readUser();
            //Display UserPage
            displayUserContent();
        }
        else
        {
            loginError.innerHTML = "The Username or password given was invalid";
            loginAnimationHelper.toggleLoading();
        }
    }

    sendPostRequest(tokenRequest, onResponse);

}

/* Booleans used to make sure the username is available before sending a sign up request
 * */

let hasCheckedAvailability = false;


/*
 *
 *  * */
function signUp()
{
    /*
     * Process for Signing Up A User
     * Clear old Errors
     * Validate Form Inputs and Display Errors
     * Create and Send Post Request
     *  */


    //Display Loading Animation
    let signUpLoadingButton = document.getElementById("signUpLoadingButton");
    let signUpAnimationHelper = new LoadAnimationHelper(signUpLoadingButton);
    signUpAnimationHelper.toggleLoading();

    //Clear old Errors
    let usernameError = document.getElementById("usernameError");
    usernameError.innerHTML = "";
    let passwordError = document.getElementById("passwordError");
    passwordError.innerHTML = "";
    let emailError = document.getElementById("emailError");
    emailError.innerHTML = "";
    let tosppError = document.getElementById("tosppError");
    tosppError.innerHTML = "";


    /*
     *
     * Validating Form Inputs and Display Errors
     *  * Check/Validate length of Text inputs
     *  Check/Validate Username
     *  Check That The Passwords Entered Match
     *  Check that the emails entered Match
     *  Check that the user Agreed To The TOS and PP
     *  */

    let isInputValid = true;

    /* Check/Validate Username
     *  */

    let usernameInput = document.getElementById("usernameInput");
    let username = usernameInput.value;
    if (!isAValidUsername(username))
    {
        usernameError.innerHTML = "Enter a Valid Username";
        isInputValid = false;
    }
    else
    {
        usernameError.innerHTML = "";
    }


    /*Password*/
    //Check That The Passwords Entered Match
    let passwordInput = document.getElementById("passwordInput");
    let password = passwordInput.value;
    let passwordCheckInput = document.getElementById("passwordCheckInput");
    let passwordCheck = passwordCheckInput.value;

    //* Check/Validate length of Text inputs
    if (password.length === 0)
    {
        passwordError.innerHTML = "Enter a Password";
        isInputValid = false;
    }


    if (password !== passwordCheck)
    {
        passwordError.innerHTML = "Passwords Do not Match";
        isInputValid = false;
    }


    /*Email*/
    let emailInput = document.getElementById("emailInput");
    let email = emailInput.value;
    let emailCheckInput = document.getElementById("emailCheckInput");
    let emailCheck = emailCheckInput.value;

    //* Check/Validate length of Text inputs
    if (email.length === 0)
    {
        emailError.innerHTML = "Enter a Email";
        isInputValid = false;
    }

    //Check that the emails entered Match

    if (email !== emailCheck)
    {
        emailError.innerHTML = "Emails Do not Match";
        isInputValid = false;
    }


    /*TOS and PP*/
    //Check that the user Agreed To The TOS and PP
    let acceptTOSPPInput = document.getElementById("acceptTOSPPInput");
    let tospp = acceptTOSPPInput.checked;
    if (!tospp)
    {
        tosppError.innerHTML = "You did not accept the Terms of Service and Privacy Policy";
        isInputValid = false;
    }

    if (!isInputValid)
    {
        signUpAnimationHelper.toggleLoading();
        return;
    }

    /* Process for Creating and Sending a Sign Up Post Request
     * Create Post Request with command CreateAccount
     * Create Function to be called when the server responds
     */


    /* Create Post Request with command CreateAccount
     *
     * Fields Needed For a CreateAccount request
     * Username
     * Password
     * Email
     * Captcha Code
     *
     */
    let signUpPostRequest = new PostRequest("CreateAccount");
    signUpPostRequest.username = username;
    signUpPostRequest.password = password;
    signUpPostRequest.email = email;
    signUpPostRequest.captchaCode = captchaCode;


    //Create Function to be called when the server responds
    let onResponse = function (xmlHttpRequest)
    {
        if (xmlHttpRequest.status === 200)
        {
            displayLoginForm();
            return;
        }

        signUpAnimationHelper.toggleLoading();

        if (xmlHttpRequest.status === 400)
        {
            generalError.innerText = "There was an Error try Refreshing and trying again";
        }

        if (xmlHttpRequest.status === 409)
        {
            let generalError = document.getElementById("generalError");
            generalError.innerText = JSON.parse(xmlHttpRequest.responseText).failureReason;
        }

    }

    sendPostRequest(signUpPostRequest, onResponse);


}


function onUsernameInputChange()
{
    hasCheckedAvailability = false;
    isUsernameAvailable = false;
    let usernameTakenStatus = document.getElementById("usernameTakenStatus");
    usernameTakenStatus.innerHTML = "";
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

function checkAvailability(username)
{
    /*
     * Process for checking if a username is available
     * Check if the username is valid. Update display accordingly
     * Create Post Request with CheckUsername as the command and a username field with the username to check
     * Create the function to be called on when the server responds
     * send a post request with the Created Request and Function
     *  */

    //Display Loading Animation
    let checkAvailabilityLoadingButton = document.getElementById("checkAvailabilityLoadingButton");
    let checkAvailabilityLoadAnimationHelper = new LoadAnimationHelper(checkAvailabilityLoadingButton);
    checkAvailabilityLoadAnimationHelper.toggleLoading();

    //Check if the username is valid. Update display accordingly
    let usernameError = document.getElementById("usernameError");
    if (!isAValidUsername(username))
    {
        usernameError.innerHTML = "Enter a Valid Username";
        checkAvailabilityLoadAnimationHelper.toggleLoading();
        return;
    }
    else
    {
        usernameError.innerHTML = "";
    }


    //Create Post Request with CheckUsername as the command and a username field with the username to check
    let usernameCheckRequest = new PostRequest("CheckUsername");
    usernameCheckRequest.username = username;

    /*
     * Process for creating the function to be called on when the server responds
     * Check to make sure the username has not changed since the check
     * Get The Response text and Create an Object from the json
     *  - Username Check Response Format
     *    {"isUserNameTaken":true}
     * Check the username's status and update variables and user display
     * */
    let onResponse = function (xmlRequest)
    {
        checkAvailabilityLoadAnimationHelper.toggleLoading();
        //Check to make sure the username has not changed since the check
        let usernameInput = document.getElementById("usernameInput");
        if (usernameInput.value !== username)
        {
            return;
        }

        try
        {
            //Get The Response text and Create an Object from the json
            let response = xmlRequest.responseText;
            let usernameAvailabilityResponse = JSON.parse(response);


            //Check the username's status and update variables and user display
            let isUsernameAvailable = usernameAvailabilityResponse.isUserNameTaken;

            let usernameTakenStatus = document.getElementById("usernameTakenStatus");
            if (isUsernameAvailable === true)
            {
                usernameTakenStatus.style.color = "Red";
                usernameTakenStatus.innerHTML = "Username is Taken";
            }
            else
            {
                usernameTakenStatus.style.color = "lawngreen";
                usernameTakenStatus.innerHTML = "Username is Available";
            }
        } catch (error)
        {
            //Whoops
            let usernameTakenStatus = document.getElementById("usernameTakenStatus");
            usernameTakenStatus.innerHTML = "There was an error Checking The username Status";

        }
        //Update the state of hasCheckedAvailability
        hasCheckedAvailability = true;
    }

    //send a post request with the Created Request and Function
    sendPostRequest(usernameCheckRequest, onResponse);
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

    //Get the object type of the table
    let objectTypeInput = document.getElementById("objectTypeInput");
    let objectType = objectTypeInput.value;


    //Create the post request/ crud request
    let createTableRequest = new PostRequest("CreateTable");

    createTableRequest.captchaCode = captchaCode;

    let crudRequest = new CRUDRequest();

    crudRequest.tableName = tableName;
    crudRequest.objectType = objectType;


    createTableRequest.setCRUDRequest(crudRequest);

    //display Loading Animation
    //Note: The button animation helper is needed in the callback function
    let createButton = document.getElementById("createTableButton");
    let buttonLoadAnimationHelper = new LoadAnimationHelper(createButton);
    buttonLoadAnimationHelper.toggleLoading();
    //Call Back Method
    let onResponse = function (xmlHttpRequest)
    {
        if (xmlHttpRequest.status === 200)
        {
            removeCreateTableForm();
            buttonLoadAnimationHelper.toggleLoading();
            refreshUsersTables();
        }
    }


    ///send the post request
    sendPostRequest(createTableRequest, onResponse);


}

displayUsersTables();


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


function displayCreateTableForm()
{
    let userContentForm = document.getElementById("userContentForm");
    userContentForm.insertAdjacentHTML("beforeend", createTableForm);
    let selectElement = document.getElementById("objectTypeInput");
    setObjectTypes(selectElement);
}

function removeCreateTableForm()
{
    let createTableForm = document.getElementById("createTableDiv");
    createTableForm.remove();
}

function removeEditTableForm()
{
    let editTableForm = document.getElementById("editTableForm");
    editTableForm.remove();
}


//<img src="/xMark.png" alt="CheckMark">
//"permissions":{"Jums":{"adminPerms":true,"canAdd":true,"canRemove":true,"canSearch":true}}
function displayEditTableWindow(tableToEdit)
{

    let userContentForm = document.getElementById("userContentForm");
    userContentForm.insertAdjacentHTML("beforeend", editTableForm);

    let tableNameHeader = document.getElementById("tableNameHeader");
    tableNameHeader.insertAdjacentHTML("beforeend", tableToEdit.name);

    let backButton = document.getElementById("back");

    backButton.onclick = function ()
    {
        removeEditTableForm();
    };


    let deleteTable = document.getElementById("deleteTable");
    deleteTable.onclick = function ()
    {
        let deleteTableLoadingContainer = document.getElementById("deleteTableLoadingContainer");
        let animationHelper = new LoadAnimationHelper(deleteTableLoadingContainer);
        animationHelper.toggleLoading();
        let deleteTableRequest = new PostRequest("DeleteTable");
        let deleteTableCRUDRequest = new CRUDRequest();
        deleteTableCRUDRequest.tableID = tableToEdit.id;
        deleteTableRequest.setCRUDRequest(deleteTableCRUDRequest);

        let onResponse = function (xmlHttpRequest)
        {
            removeEditTableForm();
            refreshUsersTables();
            removeSignRequestWindow();
        };
        let signRequestDiv = document.getElementById("signRequestDiv");
        displaySignRequestWindow(deleteTableRequest, onResponse, signRequestDiv);
    };

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
        removeEditTableForm();
        displayEditTableWindow(tableToEdit);
    };

    let apply = document.getElementById("apply");
    apply.onclick = function ()
    {
        let applyLoadingContainer = document.getElementById("applyLoadingContainer");
        let animationHelper = new LoadAnimationHelper(applyLoadingContainer);
        animationHelper.toggleLoading();
        let updateTableRequest = new PostRequest("UpdateTable");
        let updateTableCRUDRequest = new CRUDRequest();
        updateTableCRUDRequest.object = JSON.stringify(tableToEdit);
        updateTableCRUDRequest.tableID = tableToEdit.id;
        updateTableRequest.setCRUDRequest(updateTableCRUDRequest);
        let onResponse = function ()
        {
            removeEditTableForm();
            refreshUsersTables();
        };

        sendPostRequest(updateTableRequest, onResponse);
    };

    displayPermissions(tableToEdit);

}


function displayPermissions(tableToDisplay)
{

    let tablePermissions = document.getElementById("tablePermissions");
    let permissionsTable = document.getElementById("permissionsTable");
    if (permissionsTable !== null)
    {
        tablePermissions.removeChild(permissionsTable);
    }


    tablePermissions.insertAdjacentHTML("beforeend", permissionsTableForm);

    permissionsTable = document.getElementById("permissionsTable");

    let editorsUsername = getUser().username;

    let usersPermissions = tableToDisplay.permissions[editorsUsername];


    for (let i = 0; i < Object.getOwnPropertyNames(tableToDisplay.permissions).length; i++)
    {
        let username = Object.getOwnPropertyNames(tableToDisplay.permissions)[i];
        let currentUsersPermissions = tableToDisplay.permissions[username];

        //Create header and permissions toggle buttons
        let usernameHeader = document.createElement("h3");
        usernameHeader.innerHTML = username;
        permissionsTable.insertAdjacentHTML("beforeend", usernameHeader.outerHTML);


        let canEditAdmin = tableToDisplay.creator === editorsUsername;
        let canEditUsage = usersPermissions.adminPerms;

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
                removeEditTableForm();
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
                removeEditTableForm();
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
                removeEditTableForm();
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
                removeEditTableForm();
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


function removeSignRequestWindow()
{
    let signRequestDiv = document.getElementById("signRequestDiv");
    let signRequestForm = document.getElementById("signRequestForm");
    signRequestDiv.removeChild(signRequestForm);
}

function displaySignRequestWindow(requestToSign, onResponse, displayDiv)
{
    displayDiv.insertAdjacentHTML("beforeend", signRequestForm);

    let submitRequestButton = document.getElementById("submitRequestButton");
    let passwordInput = document.getElementById("passwordInput");
    submitRequestButton.onclick = function ()
    {

        requestToSign.password = passwordInput.value;
        sendPostRequest(requestToSign, onResponse);
    };
}




