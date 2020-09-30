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
scriptsList.push(new Script("util", "/captchaUtil.js"));
scriptsList.push(new Script("util", "/navbar.js"));
scriptsList.push(new Script("art.html", "/art.js"));
scriptsList.push(new Script("userPage.html", "/user.js"))
scriptsList.push(new Script("aStarDemo.html", "/aStarDemo.js"));
scriptsList.push(new Script("map.html", "/map.js"));
scriptsList.push(new Script("discordWebHook.html", "/discordWebHook.js"));
scriptsList.push(new Script("sandbox.html", "/sandbox.js"));


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