class FormManager
{

    constructor(form, parentElement)
    {
        this.form = form;
        this.parentElement = parentElement;
        this.isVisible = false;
    }


    toggleDisplay()
    {
        if (this.isVisible)
        {
            this.removeForm();
            return;
        }

        this.displayForm();
    }

    displayForm()
    {
        this.isVisible = true;
        this.parentElement.appendChild(this.form);
    }


    removeForm()
    {
        this.isVisible = false;
        this.form.remove();
    }

}