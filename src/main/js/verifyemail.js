var userToken = localStorage.getItem("userToken");

let callback = function(responseFromServer)
{
    console.log(responseFromServer);
    if (responseFromServer != null &&
        responseFromServer != "")
    {
        document.getElementById("loader").style.display = "none";
        if (responseFromServer.includes("codeSent") || responseFromServer.includes("codeCoolDown"))
        {
            var innerHtml = "<h1>Enter the code <br />sent to your email.</h1>" +
                "<p id = \"errormessagetop\" class=\"error\"></p>" +
                "<label for = \"emailcode\">Code: </label>" +
                "<input type = \"emailcode\" id=\"emailcode\" class=\"input\" required /><br /> " +
                "<input type = \"button\" value=\"Submit\" onclick=\"onSubmit();\" class=\"input\" />";
            document.getElementById("form").innerHTML = innerHtml;
        }
        else if (responseFromServer.includes("emailAlreadyConfirmed"))
        {
            var innerHtml = "Your Email Has Already Been Confirmed.";
            document.getElementById("form").innerHTML = innerHtml;
        }
        else
        {
            var innerHtml = "There was a Server Error Please Refresh your page";
            document.getElementById("form").innerHTML = innerHtml;
        }

    }
    else
    {
        location.replace("./login.html");
    }
};


if (userToken != null && userToken != "")
{
    var sendEmailMessage = {
        "token": userToken,
        "command": "setEmailCode"
    };
    sendMessageCallBack(sendEmailMessage, callback);
}
else
{
    location.replace("./login.html");
}




function debug()
{
    localStorage.setItem("userToken", "");
}

function onSubmit()
{
    var emailCode = document.getElementById("emailcode").value;
    var command = "emailConfirm";
    console.log(emailCode);
    var form = {
        "emailCode": emailCode,
        "token": userToken,
        "command": command
    };


    var emailVerifyed = sendMessageToHost(form);

    document.getElementById("emailcode").value = "";

    document.getElementById("errormessagetop").innerHTML = "";

    console.log(emailVerifyed);

    if (emailVerifyed.includes("emailConfirmed"))
    {
        document.getElementById("form").innerHTML = "Your Email Has Been confimed!";
    }
    else if (emailVerifyed.includes("resetCode"))
    {
        document.getElementById("errormessagetop").innerHTML = "The was a Server Error Try Refreshing your page<br/>" +
            "and Re-Enter your Code";
    }
    else
    {
        document.getElementById("errormessagetop").innerHTML = "Invalid Code";
    }


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
        }
    };
    connection.open("POST", encodeURIComponent(JSON.stringify(message)), false);
    connection.send();
    return requestResponse;
};

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