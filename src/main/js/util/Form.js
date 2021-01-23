class Form
{
    constructor(formName, elementList, setUpFunction)
    {
        this.formName = formName;
        this.elementList = elementList === undefined ? [] : elementList;
        this.setUpFunction = setUpFunction;
    }

    produceFormManager(elementToDisplayOn, forceNewManager)
    {
        if (this[elementToDisplayOn.id] === undefined || forceNewManager)
        {
            if (forceNewManager)
            {
                if (this[elementToDisplayOn.id] !== undefined)
                {
                    this[elementToDisplayOn.id].removeForm();
                }
            }
            this[elementToDisplayOn.id] = new FormManager(this.form.cloneNode(true), elementToDisplayOn);
        }

        return this[elementToDisplayOn.id];
    }

    onFormLoad()
    {
        for (let i = 0; i < this.elementList.length; i++)
        {
            let currentElement = this.elementList[i];
            if (currentElement != null)
            {

                this[currentElement.id] = new FormManager(this.getFrom(), currentElement);
                this[currentElement.id].displayForm();
            }
        }
        if (this.setUpFunction !== undefined)
        {
            this.setUpFunction();
        }
    }


    getFormName()
    {
        return this.formName;
    }

    setForm(form)
    {
        this.form = form;
    }

    getFrom()
    {
        return this.form;
    }

}