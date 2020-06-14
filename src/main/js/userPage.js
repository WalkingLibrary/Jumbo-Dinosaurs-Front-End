/* Script to handle the User Page Interactions
 * */

let userContentBlock = document.getElementById("userContent");

loadPage();

function loadPage()
{
    setSignUpForm();
}


function setSignUpForm()
{
    let signUpFunction = function (xmlRequest)
    {
        userContentBlock.innerHTML = xmlRequest.responseText;
    };

    getForm("signup.html", signUpFunction);
}

/*
 *
 *
 *  */
function getForm(pageName, onReady)
{
    let xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.onreadystatechange = function ()
    {
        if (this.readyState === 4 && this.status === 200)
        {
            onReady(xmlHttpRequest);
        }
    };
    xmlHttpRequest.open("GET", pageName, true);
    xmlHttpRequest.send();
}



