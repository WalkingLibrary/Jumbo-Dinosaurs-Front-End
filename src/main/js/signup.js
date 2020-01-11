let callback = function(responseFromServer)
{
    if (responseFromServer != null &&
        responseFromServer != "")
    {
        location.replace("./userpage.html");
    }
    else
    {
        localStorage.setItem("userToken", "");
    }
};


var userToken = localStorage.getItem("userToken");

if (userToken != null && userToken != "")
{

    var getUsernameMessage = {
        "token": userToken,
        "command": "getUsername"
    };

    tryRedirect(getUsernameMessage, callback);
}





function tryRedirect(message, functionToCall)
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



function onSignUp()
{
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var passwordconfirm = document.getElementById("passwordconfirm").value;
    var email = document.getElementById("email").value;
    var command = "createAccount";



    if (password == passwordconfirm)
    {
        if (password.length > 8)
        {
            var emailConfirmMessage = {
                "command": "confirmMailServer",
                "email": email
            };

            var usernameCheckMessage = {
                "command": "usernameCheck",
                "username": username
            };

            var emailCheckMessage = {
                "command": "emailCheck",
                "email": email
            };

            var form = {
                "username": username,
                "password": password,
                "email": email,
                "captchaCode": captchaCode,
                "command": command
            };

            var host = "localhost";

            var emailExists = sendMessageToHost(emailConfirmMessage);
            if (emailExists)
            {
                var emailTaken = !(sendMessageToHost(emailCheckMessage));
                if (!emailTaken)
                {
                    var usernameTaken = !(sendMessageToHost(usernameCheckMessage));
                    if (!usernameTaken)
                    {
                        var goodUsername = true;
                        var whiteListedLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
                        for (i = 0; i < username.length; i++)
                        {
                            if (!whiteListedLetters.includes(username[i]))
                            {
                                goodUsername = false;
                                break;
                            }
                        }

                        if (goodUsername && username.length <= 16)
                        {
                            var formAccepted = sendMessageToHost(form);
                            if (formAccepted)
                            {
                                localStorage.setItem("userToken", "");
                                location.replace("./login.html");

                            }
                            else
                            {
                                document.getElementById("errormessagetop").innerHTML = "There was an Error Try refreshing the page and try again.";
                                document.getElementById("errormessageusername").innerHTML = "";
                                document.getElementById("errormessageemail").innerHTML = "";
                                document.getElementById("errormessagepassword").innerHTML = "";
                            }
                        }
                        else
                        {
                            document.getElementById("username").value = "";
                            document.getElementById("errormessagetop").innerHTML = "";
                            document.getElementById("errormessageusername").innerHTML = "Check allowed characters and length.";
                            document.getElementById("errormessageemail").innerHTML = "";
                            document.getElementById("errormessagepassword").innerHTML = "";
                        }
                    }
                    else
                    {
                        document.getElementById("username").value = "";
                        document.getElementById("errormessagetop").innerHTML = "";
                        document.getElementById("errormessageusername").innerHTML = "Username in use";
                        document.getElementById("errormessageemail").innerHTML = "";
                        document.getElementById("errormessagepassword").innerHTML = "";
                    }
                }
                else
                {
                    document.getElementById("email").value = "";
                    document.getElementById("errormessagetop").innerHTML = "";
                    document.getElementById("errormessageusername").innerHTML = "";
                    document.getElementById("errormessageemail").innerHTML = "Email in Use";
                    document.getElementById("errormessagepassword").innerHTML = "";
                }
            }
            else
            {
                document.getElementById("email").value = "";
                document.getElementById("errormessagetop").innerHTML = "";
                document.getElementById("errormessageusername").innerHTML = "";
                document.getElementById("errormessageemail").innerHTML = "Invaild Email";
                document.getElementById("errormessagepassword").innerHTML = "";
            }


        }
        else
        {
            document.getElementById("password").value = "";
            document.getElementById("errormessagetop").innerHTML = "";
            document.getElementById("passwordconfirm").value = "";
            document.getElementById("errormessageusername").innerHTML = "";
            document.getElementById("errormessageemail").innerHTML = "";
            document.getElementById("errormessagepassword").innerHTML = "Password is too short";
        }
    }
    else
    {
        document.getElementById("password").value = "";
        document.getElementById("errormessagetop").innerHTML = "";
        document.getElementById("passwordconfirm").value = "";
        document.getElementById("errormessageusername").innerHTML = "";
        document.getElementById("errormessageemail").innerHTML = "";
        document.getElementById("errormessagepassword").innerHTML = "Passwords did not match.";
    }


    function sendMessageToHost(message)
    {
        var connection = new XMLHttpRequest();
        var requestResponse;
        connection.onreadystatechange = function()
        {
            if (connection.readyState == 4)
            {
                var status = connection.status;
                if (status == 200)
                {
                    requestResponse = true;
                }
                else
                {
                    requestResponse = false;
                }
            }
        };
        console.log(JSON.stringify(message));

        connection.open("POST", encodeURIComponent(JSON.stringify(message)), false);
        connection.send();
        return requestResponse;
    };
};