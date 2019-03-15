var userToken = localStorage.getItem("userToken");

if (userToken != null && userToken != "")
{
    if (userToken.includes("emailInput"))
    {
        displayEmailCodeInput();
        localStorage.setItem("userToken", "");
    }
    else
    {
        displayEmailInput();
    }

}
else
{
    displayEmailInput();
}



function displayEmailCodeInput()
{
    localStorage.setItem("userToken", "emailInput");
    var innerhtml = "<h1>Enter the code <br />sent to your email.</h1>" +
        "<p id = \"errormessagetop\" class=\"error\"></p>" +
        "<label for = \"emailcode\">Code: </label>" +
        "<input type = \"emailcode\" id=\"emailcode\" class=\"input\" required /><br /> " +
        "<input type = \"button\" value=\"Submit\" onclick=\"submitCode();\" class=\"input\" />" +
        "<p onclick=\"displayEmailInput();\">Haven't Recieved a Code?<br/> Click Here</p>";
    document.getElementById("form").innerHTML = innerhtml;
}

function displayPasswordInput()
{

    var innerhtml = "<h1>Enter a New Password</h1>" +
        "<p id = \"errormessagetop\" class=\"error\"></p>" +
        "<label for = \"password\">Password: </label>" +
        "<input type = \"password\" id=\"password\" class=\"input\" required /><br /> " +
        "<label for = \"password\">Password Confirmed: </label>" +
        "<input type = \"password\" id=\"passwordconfirm\" class=\"input\" required /><br /> " +
        "<p class=\"tooltiptext\">Your Password needs to be 9 characters or longer.</p>" +
        "<input type = \"button\" value=\"Submit\" onclick=\"submitPassword();\" class=\"input\" />";
    document.getElementById("form").innerHTML = innerhtml;
};

function displayEmailInput()
{
    localStorage.setItem("userToken", "");
    var innerhtml = "<h1>Enter Your Email</h1>" +
        "<p id = \"errormessagetop\" class=\"error\"></p>" +
        "<label for = \"email\">Email: </label>" +
        "<input type = \"email\" id=\"email\" class=\"input\" required /><br /> " +
        "<input type = \"button\" value=\"Submit\" onclick=\"submitEmail();\" class=\"input\" />" +
        "<p onclick=\"displayEmailCodeInput();\">Have a code? Click Here</p>";;
    document.getElementById("form").innerHTML = innerhtml;
};



function submitEmail()
{
    var email = document.getElementById("email").value;
    var messageToSend = {
        "command": "resetPassword",
        "email": email,
        "captchaCode": captchaCode
    };
    var callBackFunction = function(response)
    {
        displayEmailCodeInput();
    };

    sendMessageCallBack(messageToSend, callBackFunction);
}

function submitCode()
{
    var emailCode = document.getElementById("emailcode").value;
    localStorage.setItem("userToken", emailCode);
    displayPasswordInput();
}

function submitPassword()
{
    var password = document.getElementById("password").value;
    var passwordconfirm = document.getElementById("passwordconfirm").value;

    if (password.length > 8)
    {
        if (password != passwordconfirm)
        {
            document.getElementById("errormessagetop").innerHTML = "Passwords did not match.";
            document.getElementById("password").value = "";
            document.getElementById("passwordconfirm").value = "";
        }
        else
        {
            userToken = localStorage.getItem("userToken");
            var messageToSend = {
                "password": password,
                "command": "passwordChange",
                "token": userToken
            };

            var callBackFunction = function(response)
            {
                if (response.includes("passwordChanged"))
                {
                    localStorage.setItem("userToken", "");
                    location.replace("./login.html");
                }
                else
                {
                    localStorage.setItem("userToken", "");
                    document.getElementById("form").innerHTML = "<p>There was an Error Please Refresh the page</p>";
                }
            };

            sendMessageCallBack(messageToSend, callBackFunction);
        }
    }
    else
    {
        document.getElementById("errormessagetop").innerHTML = "Password not long Enough";
    }
}


function sendMessageCallBack(message, functionToCall)
{
    var connection = new XMLHttpRequest();
    var requestResponse;
    connection.onreadystatechange = function()
    {
        if (connection.readyState == 4)
        {
            requestResponse = connection.responseText;
            functionToCall(requestResponse);
        }
    };

    connection.open("POST", encodeURIComponent(JSON.stringify(message)), true);
    connection.send();
};