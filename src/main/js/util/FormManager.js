class FormManager
{

    constructor(form, parentElement, persistentToggle)
    {
        this.form = form;
        this.parentElement = parentElement;
        this.isVisible = false;
        this.persistentToggle = true;
        this.persistentToggle = persistentToggle === undefined ? true : persistentToggle;

    }


    toggleDisplay()
    {
        let currentVisibility = this.isVisible;
        this.isVisible = !this.isVisible;

        if (currentVisibility)
        {
            this.parentElement.innerHTML = "";
            if (this.persistentToggle)
            {
                this.parentElement.insertAdjacentHTML("beforeend", this.preHTML)
            }
            return;
        }

        this.preHTML = this.parentElement.innerHTML;
        this.parentElement.insertAdjacentHTML("beforeend", this.form);

    }

}