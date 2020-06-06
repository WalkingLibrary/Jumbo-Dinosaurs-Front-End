/* Script to handle the User Page Interactions
 * */

let userContentBlock = document.getElementById("userContent");

loadPage();

function loadPage()
{
    userContentBlock.appendChild(getSignUpForm());
}

class Page
{
    constructor(elements)
    {
        this.elements = elements;
    }
}

function clearUserContentBlock()
{
    let childNodes = userContentBlock.childNodes;
    for (let i = 0; i < childNodes; i++)
    {
        childNodes[i].remove();
    }
}


function getSignUpForm()
{
    let signUpElements = [];
    signUpElements[0] = ["username", "text", "Username"];
    signUpElements[1] = ["password", "text", "Password"];
    signUpElements[2] = ["password", "text", ""];
    signUpElements[3] = ["email", "text", "Email"];
    signUpElements[4] = ["agreetos", "checkbox", "I have read and agree to the <a href=\"termsofservice.html\">Terms of Service</a> and the <a href=\"privacypolicy.html\">Privacy Policy</a>"];
    signUpElements[5] = ["submit", "button", "Submit"];
    return getForm(signUpElements);
}

/*
 * Function to create a form from a double array in the following format
 * [[id, inputType, label], [id, inputType, label]]
 *
 *  */
function getForm(formElements)
{
    /* Process for creating/getting a form
     * Create Form
     * Add Each Index of formElements
     * Return form
     *  */

    //Create Form
    let form = document.createElement("form");

    /* Adding Each Index of formElements
     * Create a input Element
     * Create A label for Input Element
     * Append Both Label and Input to the form
     * Add Breaks for Spacing
     */

    for (let i = 0; i < formElements.length; i++)
    {
        let currentElement = formElements[i];
        //Create a input Element
        let inputElement = document.createElement("input");
        inputElement.id = currentElement[0];
        inputElement.type = currentElement[1];

        //Create A label for Input Element
        let labelElement = document.createElement("label");

        labelElement.for = currentElement[0];
        labelElement.innerHTML = currentElement[2];

        //Append Both Label and Input to the form
        form.appendChild(labelElement);
        form.appendChild(inputElement);


        //Add Breaks for Spacing
        let pageBreak = document.createElement("br");
        form.appendChild(pageBreak);
        form.appendChild(pageBreak);

    }

    //Return form
    return form;
}



