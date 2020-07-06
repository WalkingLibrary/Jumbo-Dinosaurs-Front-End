/* Script to handle the User Page Interactions
 * */

let host = "http://localhost/";
let userContentBlock = document.getElementById("userContent");

loadPage();

function loadPage()
{
    setSignUpForm();
}


function setSignUpForm()
{
    if (getUser() === null)
    {
        displaySignUpPage();
    }
}


function displaySignUpPage()
{

    let signUpFunction = function (xmlRequest)
    {
        userContentBlock.innerHTML = xmlRequest.responseText;
    };

    getForm(host + "signup.html", signUpFunction);
}


/* Booleans used to make sure the user name is available before sending a sign up request
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
            //change to login page
            console.log("Successfully created a account");
        }
        else
        {
            //parse error and tell user
            console.log(xmlHttpRequest.responseText);
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


    //Check if the username is valid. Update display accordingly
    if (!isAValidUsername(username))
    {
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









