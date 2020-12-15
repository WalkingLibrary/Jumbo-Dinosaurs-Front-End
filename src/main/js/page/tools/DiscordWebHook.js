let shouldStop = false;


function spamMessage()
{

    let animationManager = defaultLoadingAnimation.produceFormManager(document.getElementById("discordRipAndTearButton"), true);
    animationManager.displayForm();

    let discordUrl = document.getElementById("discordWebHookLink").value;
    let message = document.getElementById("message").value;
    let username = document.getElementById("username").value;
    let iconUrl = document.getElementById("iconUrl").value;
    let timesToSend = document.getElementById("times").value;
    let delay = document.getElementById("delay").value;
    timeToSleepMiliSeconds = parseInt(delay);
    timesToSend = parseInt(timesToSend)
    let timesSent = 0;


    let sendMessageToDiscord = function ()
    {
        let request = new XMLHttpRequest();
        request.open("POST", discordUrl);

        request.setRequestHeader('Content-type', 'application/json');

        let params = {
            username: username,
            avatar_url: iconUrl,
            content: message
        }

        request.onreadystatechange = function ()
        {
            if (this.readyState === 4)
            {
                if (request.status !== 200)
                {
                    console.log("Victory");
                    shouldStop = true;
                }
            }
        };
        request.send(JSON.stringify(params));
    };

    let recFunction = function ()
    {
        sendMessageToDiscord();
        timesSent += 1;
        if (timesSent < timesToSend && !shouldStop)
        {
            setTimeout(() =>
            {
                recFunction();
            }, timeToSleepMiliSeconds);
        }
        else
        {
            shouldStop = false;
            animationManager.removeForm();
        }
    }

    recFunction();


}
