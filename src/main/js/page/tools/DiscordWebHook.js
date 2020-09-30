function sleep(milliseconds)
{
    let timeStart = new Date().getTime();
    while (true)
    {
        let elapsedTime = new Date().getTime() - timeStart;
        if (elapsedTime > milliseconds)
        {
            break;
        }
    }
}


function sendMessage()
{


    let discordUrl = document.getElementById("discordWebHookLink").value;
    let message = document.getElementById("message").value;
    let username = document.getElementById("username").value;
    let iconUrl = document.getElementById("iconUrl").value;
    let times = document.getElementById("times").value;
    times = parseInt(times)

    timeToSleep = 120000;

    for (let i = 0; i < times || times < 0; i++)
    {

        let request = new XMLHttpRequest();
        request.open("POST", discordUrl);

        request.setRequestHeader('Content-type', 'application/json');

        let params = {
            username: username,
            avatar_url: iconUrl,
            content: message
        }

        request.send(JSON.stringify(params));
        sleep(timeToSleep);

    }
}