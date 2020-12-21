
class FormLoader
{
    constructor(host)
    {
        this.host = host;

    }

    loadForm(form)
    {
        /*
         * Process for Loading a Form
         * Get the Form Link
         * Create The name used for accessing the form after loading
         * Create a xmlRequest to Get/Load the form
         * Send the xmlRequest
         *  */

        //Get the Form Link
        let formName = form.getFormName();
        let formLink = this.getFormLink(formName);


        //Create The name used for accessing the form after loading
        let accessName = this.getAccessName(formName);


        // Create a xmlRequest to Get/Load the form
        let xmlHttpRequest = new XMLHttpRequest();
        let thisPasser = this;
        xmlHttpRequest.onreadystatechange = function ()
        {
            if (this.readyState === 4)
            {
                if (this.status === 200)
                {
                    let formHTML = xmlHttpRequest.responseText;
                    if (form instanceof Form)
                    {
                        thisPasser[formName] = form;
                        let htmlElement = thisPasser.convertFormStringToHTMLElement(formHTML);
                        form.setForm(htmlElement);
                        form.onFormLoad();
                    }

                    return;
                }
                console.log("Error Loading " + formName + " from " + host + ".\n" + "Status: " + xmlHttpRequest.status);
            }


        };

        //Send the xmlRequest
        xmlHttpRequest.open("GET", formLink, true);
        xmlHttpRequest.send();
    }


    getAccessName(formName)
    {
        /*
         * The name is assumed to be in this format
         *
         * (Page Name).html
         *
         * We simply remove the .html at the end
         *  */
        return formName.substring(0, formName.indexOf("."));
    }

    getFormLink(formName)
    {
        /*
         * Abstracting the host allows for loading forms from other sites
         * Not that I'd probably do that but the option is available
         *
         *  */
        return this.host + formName;
    }

    //https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro
    convertFormStringToHTMLElement(htmlString)
    {
        let template = document.createElement("template");
        template.innerHTML = htmlString.trim();
        return template.content.firstChild;

    }
}


let defaultFormLoader = new FormLoader(host);

defaultFormLoader.loadForms = function (formList)
{
    for (let i = 0; i < formList.length; i++)
    {
        this.loadForm(formList[i]);
    }
}
