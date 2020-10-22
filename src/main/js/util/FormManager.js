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

        if (this.shouldSwap)
        {
            this.preChildern = this.parentElement.cloneNode(true).children;
            this.parentElement.innerHTML = "";
        }

        this.parentElement.appendChild(this.form);
    }


    removeForm()
    {
        this.isVisible = false;
        this.form.remove();

        if (this.shouldSwap)
        {
            for (let i = 0; i < this.preChildern.length; i++)
            {
                this.parentElement.appendChild(this.preChildern.item(i));
            }
        }
    }

    setShouldSwap(shouldSwap)
    {
        this.shouldSwap = shouldSwap;
    }

}