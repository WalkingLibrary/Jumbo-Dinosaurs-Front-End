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

scriptsList.push(new Script("util", "util/FormManager.js"));
scriptsList.push(new Script("util", "util/Form.js"));
scriptsList.push(new Script("util", "util/FormLoader.js"));
scriptsList.push(new Script("util", "util/User.js"));
scriptsList.push(new Script("util", "util/UserUtil.js"));
scriptsList.push(new Script("util", "util/PostRequest.js"));
scriptsList.push(new Script("util", "util/Table.js"));
scriptsList.push(new Script("util", "util/PostUtil.js"));
scriptsList.push(new Script("util", "util/AnimationForm.js"));
scriptsList.push(new Script("util", "util/Animation.js"));
scriptsList.push(new Script("util", "util/FileUtil.js"));
scriptsList.push(new Script("util", "util/CSSUtil.js"));
scriptsList.push(new Script("util", "util/GetUtil.js"));
scriptsList.push(new Script("util", "general/CaptchaUtil.js"));
scriptsList.push(new Script("util", "general/NavBar.js"));
scriptsList.push(new Script("util", "general/InputUtil.js"));
scriptsList.push(new Script("postImage.html", "objects/PostImage.js"));
scriptsList.push(new Script("imageToText.html", "tools/ImageToText.js"));
scriptsList.push(new Script("postImage.html", "tools/PostImage.js"));
scriptsList.push(new Script(/*""*/ "postMapFeature.html", "tools/PostMapDetail.js"));
scriptsList.push(new Script("login.html", "user/Login.js"));
scriptsList.push(new Script("art.html", "art/Art.js"));
scriptsList.push(new Script("userPage.html", "user/UserPageManager.js"));
scriptsList.push(new Script("aStarDemo.html", "demos/AStarDemo.js"));
scriptsList.push(new Script("map.html", "map/AnimationUtil.js"));
scriptsList.push(new Script("map.html", "map/Map.js"));
scriptsList.push(new Script("discordWebHook.html", "tools/DiscordWebHook.js"));
scriptsList.push(new Script("sandbox.html", "sandbox/SandBox.js"));


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

function loadScript(source)
{
    let currentScriptElement = document.createElement("script");
    currentScriptElement.setAttribute("src", source);

    document.body.appendChild(currentScriptElement);
}