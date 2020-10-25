function redirectToUserPage()
{
    window.location.href = host + "userPage.html";
}

if (getUser() !== null)
{
    redirectToUserPage();
}

let loginForm = new Form("loginForm.html", [contentContainer]);
let signUpForm = new Form("signupForm.html");
let changePasswordWithTokenForm = new Form("changePasswordWithTokenForm.html");
let requestChangePasswordTokenForm = new Form("requestChangePasswordTokenForm.html")

defaultFormLoader.loadForm(loginForm);
defaultFormLoader.loadForm(signUpForm);
defaultFormLoader.loadForm(changePasswordWithTokenForm);
defaultFormLoader.loadForm(requestChangePasswordTokenForm);

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
    clearErrors();

    let animationManager = defaultLoadingAnimation.produceFormManager(document.getElementById("loginLoadingButton"), true);
    animationManager.displayForm();


    //Validate Form Inputs and Display Errors
    let usernameInput = document.getElementById("usernameInput");
    let username = usernameInput.value;
    //Check the username given
    if (!isAValidUsername(username))
    {
        loginError.innerHTML = "Invalid Username";
        animationManager.removeForm();
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
            redirectToUserPage();
        }
        else
        {
            loginError.innerHTML = "The Username or password given was invalid";
            animationManager.removeForm();
        }
    }

    sendPostRequest(tokenRequest, onResponse, false);

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
    let animationManager = defaultLoadingAnimation.produceFormManager(document.getElementById("signUpLoadingButton"), true);
    animationManager.displayForm();

    //Clear old Errors
    clearErrors();


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
    isInputValid = isValidPasswordInput();
    let passwordInput = document.getElementById("passwordInput");
    let password = passwordInput.value;


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
        animationManager.removeForm();
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
            loginForm.produceFormManager(contentContainer).displayForm();
            return;
        }

        animationManager.removeForm();

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
    let animationManager = defaultLoadingAnimation.produceFormManager(document.getElementById("checkAvailabilityLoadingButton"), true);
    animationManager.displayForm();

    //Check if the username is valid. Update display accordingly
    let usernameError = document.getElementById("usernameError");
    if (!isAValidUsername(username))
    {
        animationManager.removeForm();
        usernameError.innerHTML = "Enter a Valid Username";
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
        animationManager.removeForm();
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
                usernameTakenStatus.className = "error";
                usernameTakenStatus.innerHTML = "Username is Taken";
            }
            else
            {
                usernameTakenStatus.className = "success";
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


let passwordChangeUsername;

function sendPasswordChangeRequest()
{
    let submitButton = document.getElementById("submitPasswordChangeButton");
    let animationManager = defaultLoadingAnimation.produceFormManager(submitButton, true);
    animationManager.displayForm();

    clearErrors();

    let emailInput = document.getElementById("emailInput");


    let isValidInput = true;


    if (emailInput.value === "")
    {
        let emailInputError = document.getElementById("emailInputError");
        emailInputError.innerHTML = "Enter a Email";
        animationManager.removeForm();
        isValidInput = false;
    }

    /* Check/Validate Username
     *  */

    let usernameInput = document.getElementById("usernameInput");
    let usernameError = document.getElementById("usernameError");
    let username = usernameInput.value;
    if (!isAValidUsername(username))
    {
        usernameError.innerHTML = "Enter a Valid Username";
        isValidInput = false;
    }

    if (!isValidInput)
    {
        return;
    }

    let submitPasswordChangeRequest = new PostRequest("ChangePasswordSendCode");
    passwordChangeUsername = usernameInput.value;
    submitPasswordChangeRequest.username = usernameInput.value;
    submitPasswordChangeRequest.email = emailInput.value;
    submitPasswordChangeRequest.captchaCode = captchaCode;

    let onResponse = function (xmlHttpRequest)
    {
        rotateLoginPageForms(changePasswordWithTokenForm);
    };

    sendPostRequest(submitPasswordChangeRequest, onResponse);

}

function submitPasswordChange()
{
    let submitButton = document.getElementById("submitPasswordChangeButton");
    let animationManager = defaultLoadingAnimation.produceFormManager(submitButton, true);
    animationManager.displayForm();


    if (isValidPasswordInput())
    {

        let tokenInput = document.getElementById("tokenInput");
        let passwordInput = document.getElementById("passwordInput");

        let password = passwordInput.value;
        let token = tokenInput.value;

        let changePasswordRequest = new PostRequest("ChangePasswordForgot");
        changePasswordRequest.tokenUse = "changePassword";
        changePasswordRequest.username = passwordChangeUsername;
        changePasswordRequest.token = token;
        changePasswordRequest.content = password;

        let onResponse = function (xmlHttpRequest)
        {
            rotateLoginPageForms(loginForm);
        }

        sendPostRequest(changePasswordRequest, onResponse);
        return;

    }

    animationManager.removeForm();


}


function isValidPasswordInput()
{
    clearErrors();
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
        return false;
    }


    if (password !== passwordCheck)
    {
        passwordError.innerHTML = "Passwords Do not Match";
        return false;
    }

    return true;

}

function rotateLoginPageForms(formToDisplay)
{
    loginForm.produceFormManager(contentContainer).removeForm();
    signUpForm.produceFormManager(contentContainer).removeForm();
    changePasswordWithTokenForm.produceFormManager(contentContainer).removeForm();
    requestChangePasswordTokenForm.produceFormManager(contentContainer).removeForm();

    formToDisplay.produceFormManager(contentContainer, true).displayForm();

}

