var userToken = localStorage.getItem("userToken");
let setUsername = function(responseFromServer)
{
    if (responseFromServer != null &&
        responseFromServer != "")
    {
        document.getElementById("login").innerHTML = responseFromServer;
        document.getElementById("login").href = "./userpage.html";
    }
    else
    {
        localStorage.setItem("userToken", "");
        document.getElementById("login").innerHTML = "Login";
    }
};

if (userToken != null && userToken != "")
{
    changeLoginNavBar(userToken, setUsername);
}
else
{
    localStorage.setItem("userToken", "");
    document.getElementById("login").innerHTML = "Login";
}



function changeLoginNavBar(usersToken, functionToCall)
{
    var getUsernameMessage = {
        "command": "getUsername",
        "token": usersToken
    };
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

    connection.open("POST", JSON.stringify(getUsernameMessage), true);
    connection.send();
}