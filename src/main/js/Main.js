const host = window.location.protocol + "//" + window.location.hostname + "/";

class Script
{
    constructor(page, source)
    {
        this.page = page;
        this.source = source;
    }
}

let scriptsList = [];

scriptsList.push(new Script("util", "/FormManager.js"));
scriptsList.push(new Script("util", "/FormFactory.js"));
scriptsList.push(new Script("util", "/FormLoader.js"));
scriptsList.push(new Script("util", "/PostUtil.js"));
scriptsList.push(new Script("util", "/CaptchaUtil.js"));
scriptsList.push(new Script("util", "/NavBar.js"));
scriptsList.push(new Script("art.html", "/Art.js"));
scriptsList.push(new Script("userPage.html", "/User.js"))
scriptsList.push(new Script("aStarDemo.html", "/AStarDemo.js"));
scriptsList.push(new Script("map.html", "/Map.js"));
scriptsList.push(new Script("discordWebHook.html", "/DiscordWebHook.js"));
scriptsList.push(new Script("sandbox.html", "/SandBox.js"));


let index = 0;

function loadNextScript()
{
    if (index < scriptsList.length)
    {
        let currentScript = scriptsList[index];
        index++;

        if (shouldLoadScript(currentScript))
        {


            console.log("Loaded: " + currentScript.source);
            let currentScriptElement = document.createElement("script");
            currentScriptElement.setAttribute("src", currentScript.source);

            document.body.appendChild(currentScriptElement);

            currentScriptElement.addEventListener("load", loadNextScript, false);
        }
        else
        {
            loadNextScript();
        }

    }
}

loadNextScript();

function shouldLoadScript(script)
{

    let currentPage = window.location.pathname.substring(1);//Chop of the /
    if (script.page === currentPage)
    {
        return true;
    }

    if (script.page === "util")
    {
        return true;
    }

    return false;
}