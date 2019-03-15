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

function sendMessageToHost(message)
{
    var connection = new XMLHttpRequest();
    var requestResponse;
    connection.onreadystatechange = function()
    {
        if (connection.readyState == 4)
        {
            requestResponse = connection.responseText;
            console.log(requestResponse);
        }
    };

    connection.open("POST", encodeURIComponent(JSON.stringify(message)), false);
    connection.send();
    return requestResponse;
};









function onLogin()
{
    var username = document.getElementById("username")
        .value;
    var password = document.getElementById("password")
        .value;
    var command = "getToken";
    var form = {
        "username": username,
        "password": password,
        "captchaCode": captchaCode,
        "command": command
    };


    userToken = sendMessageToHost(form);

    document.getElementById("username")
        .value = "";
    document.getElementById("password")
        .value = "";
    document.getElementById("errormessagetop")
        .innerHTML = "";
    console.log(userToken);
    if (userToken != "" && userToken != null)
    {
        localStorage.setItem("userToken", userToken);
        var getUsernameMessage = {
            "token": userToken,
            "command": "getUsername"
        };
        tryRedirect(getUsernameMessage, callback);
    }
    else
    {
        document.getElementById("errormessagetop")
            .innerHTML = "Incorrect username or password";
    }
};