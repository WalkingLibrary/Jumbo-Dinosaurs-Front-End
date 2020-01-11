let callback = function(responseFromServer)
{
    if (responseFromServer != null &&
        responseFromServer != "")
    {

        console.log(responseFromServer);
        var json = JSON.parse(responseFromServer);
        var emailMsg = "Your Email has not been Verified! Click " +
            "<a href = \"./verifyemail.html\">here</a>" + " to Verify it!";

        if (json.emailVerified)
        {
            emailMsg = "Your Email Has been Verified!";
        }

        var info = "Welcome! <br/><br/>" +
            "In the future I hope to show some more info here like how many signs you've posted and all that jazz. <br/>" +
            "<br/>For now it just shows basic info. Feel free to contact me at jumbodinosaurs@gmail.com if you have any questions.<br/><br/>" +
            "Username: " + json.username +
            "<br /> Join Date: " + json.joindate + "<br/>" +
            emailMsg +
            "<br/><input type=\"button\" value=\"Log Out\" onclick=\"onLogOut();\" class=\"input\" />";
        document.getElementById("userinfo").innerHTML = info;
        document.getElementById("userinfo").style.display = "block";
        document.getElementById("loader").style.display = "none";

    }
    else
    {
        localStorage.setItem("userToken", "");
        location.replace("./login.html");
    }
};

var userToken = localStorage.getItem("userToken");

if (userToken == null || userToken == "")
{
    location.replace("./home.html");
}
else
{
    var getUserInfoMessage = {
        "token": userToken,
        "command": "getUserInfo"
    };
    sendMessageCallBack(getUserInfoMessage, callback);
}



function onLogOut()
{
    localStorage.setItem("userToken", "");
    location.replace("./home.html");
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
