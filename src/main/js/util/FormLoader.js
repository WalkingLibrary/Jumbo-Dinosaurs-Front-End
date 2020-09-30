
class FormLoader
{
    constructor(host)
    {
        this.host = host;

    }

    loadForm(formName, formFactory)
    {
        /*
         * Process for Loading a Form
         * Get the Form Link
         * Create The name used for accessing the form after loading
         * Create a xmlRequest to Get/Load the form
         * Send the xmlRequest
         *  */
        //Get the Form Link
        let formLink = this.getFormLink(formName);


        //Create The name used for accessing the form after loading
        let accessName = this.getAccessName(formName);


        // Create a xmlRequest to Get/Load the form
        let xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.onreadystatechange = function ()
        {
            if (this.readyState === 4)
            {
                if (this.status === 200)
                {
                    let formHTML = xmlHttpRequest.responseText;
                    if (formFactory instanceof FormFactory)
                    {
                        formFactory.setForm(formHTML);
                        formFactory.onFormLoad();
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
}


let defaultFormLoader = new FormLoader(host);