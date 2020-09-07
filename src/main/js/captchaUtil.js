/* This Script is designed to setup the captcha
 * The process for doing so follows
 * Create a Post request to ask the back end for the Public Captcha Code
 * We then load Googles Captcha Script Using the Public Captcha Code
 * Once Googles Captcha Script is Loaded we setup the captcha code used for post requests
 *
 * Note: if there is no captcha token for the requested domain then the captcha script is not loaded
 *  */

//Variables available for other scripts
let captchaCode;
let publicCaptchaCode;


// Create a Post request to ask the back end for the Public Captcha Code
let getCaptchaPublicCodeRequest = new PostRequest("GetPublicCaptchaCode");

getCaptchaPublicCodeRequest.content = host;

let onResponse = function (xmlHttpRequest)
{

    if (xmlHttpRequest.status === 200)
    {
        let jsonResponse = JSON.parse(xmlHttpRequest.responseText);
        //We then load Googles Captcha Script Using the Public Captcha Code
        publicCaptchaCode = jsonResponse.publicCaptchaCode;
        let captchaScript = document.createElement("script");
        captchaScript.type = "text/javascript";
        captchaScript.setAttribute("src", "https://www.google.com/recaptcha/api.js?render=" + publicCaptchaCode);
        document.body.append(captchaScript);
    }


};

function onCaptchaButtonClick(functionToCall)
{
    grecaptcha.ready(
        function getCaptchaCode()
        {
            grecaptcha.execute(publicCaptchaCode,
                {
                    action: 'captcha'
                })
                .then(function (token)
                {
                    captchaCode = token;
                    functionToCall();
                });
        });
}


//Send the Captcha Request
sendPostRequest(getCaptchaPublicCodeRequest, onResponse);





