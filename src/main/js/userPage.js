/* Script to handle the User Page Interactions
 * */


const userContentBlock = document.getElementById("userContent");


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


function getFormLink(formName)
{
    return host + formName;
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
    let activationLoadingButtonPreAnimation = activationLoadingButton.innerHTML;
    activationLoadingButton.innerHTML = loadingAnimationHTML;

    //Clear Old Errors
    activationError.innerHTML = "";

    //Validate Inputs and display errors
    let activationCode = activationToken.value;
    if (activationCode === "")
    {
        activationError.innerHTML = "Enter A Code";
        activationLoadingButton.innerHTML = activationLoadingButtonPreAnimation;
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
        activationLoadingButton.innerHTML = activationLoadingButtonPreAnimation;

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

    loginError.innerHTML = "";

    let loginLoadingButtonDiv = document.getElementById("loginLoadingButton");
    let loginLoadingButtonPreAnimation = loginLoadingButtonDiv.innerHTML;
    loginLoadingButtonDiv.innerHTML = loadingAnimationHTML;


    //Validate Form Inputs and Display Errors

    let username = usernameInput.value;
    //Check the username given
    if (!isAValidUsername(username))
    {
        loginError.innerHTML = "Invalid Username";
        loginLoadingButtonDiv.innerText = loginLoadingButtonPreAnimation;
        return;
    }

    //Passwords only limit is it's size
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
            loginLoadingButtonDiv.innerHTML = loginLoadingButtonPreAnimation;
            console.log(xmlHttpRequest.responseText);
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
    let signUpLoadingButtonPreAnimation = signUpLoadingButton.innerHTML;
    signUpLoadingButton.innerHTML = loadingAnimationHTML;

    //Clear old Errors
    usernameError.innerHTML = "";
    passwordError.innerHTML = "";
    emailError.innerHTML = "";
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

    let password = passwordInput.value;
    let passwordCheck = passwordCheckInput.value;

    //* Check/Validate length of Text inputs
    if (password.length === 0)
    {
        passwordError.innerHTML = "Enter a Password";
        isValidInput = false;
    }


    if (password !== passwordCheck)
    {
        passwordError.innerHTML = "Passwords Do not Match";
        isInputValid = false;
    }


    /*Email*/
    let email = emailInput.value;
    let emailCheck = emailCheckInput.value;

    //* Check/Validate length of Text inputs
    if (email.length === 0)
    {
        emailError.innerHTML = "Enter a Email";
        isValidInput = false;
    }

    //Check that the emails entered Match

    if (email !== emailCheck)
    {
        emailError.innerHTML = "Emails Do not Match";
        isInputValid = false;
    }


    /*TOS and PP*/
    //Check that the user Agreed To The TOS and PP

    let tospp = acceptTOSPPInput.checked;
    if (!tospp)
    {
        tosppError.innerHTML = "You did not accept the Terms of Service and Privacy Policy";
        isInputValid = false;
    }

    if (!isInputValid)
    {
        signUpLoadingButton.innerHTML = signUpLoadingButtonPreAnimation;
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

        signUpLoadingButton.innerHTML = signUpLoadingButtonPreAnimation;

        if (xmlHttpRequest.status === 400)
        {
            generalError.innerText = "There was an Error try Refreshing and trying again";
        }

        if (xmlHttpRequest.status === 409)
        {
            generalError.innerText = JSON.parse(xmlHttpRequest.responseText).failureReason;
        }

    }

    sendPostRequest(signUpPostRequest, onResponse);


}


function onUsernameInputChange()
{
    hasCheckedAvailability = false;
    isUsernameAvailable = false;
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
    let checkAvailabilityLoadingButtonPreAnimation = checkAvailabilityLoadingButton.innerHTML;
    checkAvailabilityLoadingButton.innerHTML = loadingAnimationHTML;

    //Check if the username is valid. Update display accordingly
    if (!isAValidUsername(username))
    {
        usernameError.innerHTML = "Enter a Valid Username";
        checkAvailabilityLoadingButton.innerHTML = checkAvailabilityLoadingButtonPreAnimation;
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
        checkAvailabilityLoadingButton.innerHTML = checkAvailabilityLoadingButtonPreAnimation;
        //Check to make sure the username has not changed since the check
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
            usernameTakenStatus.innerHTML = "There was an error Checking The username Status";

        }
        //Update the state of hasCheckedAvailability
        hasCheckedAvailability = true;
    }

    //send a post request with the Created Request and Function
    sendPostRequest(usernameCheckRequest, onResponse);
}









