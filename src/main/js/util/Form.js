class Form
{
    constructor(formName, elementList, setUpFunction)
    {
        this.formName = formName;
        this.elementList = elementList === undefined ? [] : elementList;
        this.setUpFunction = setUpFunction;
    }

    produceFormManager(elementToDisplayOn)
    {
        if (this[elementToDisplayOn.id] === undefined)
        {
            this[elementToDisplayOn.id] = new FormManager(this.getFrom(), elementToDisplayOn);
        }
        return this[elementToDisplayOn.id];
    }

    onFormLoad()
    {
        for (let i = 0; i < this.elementList.length; i++)
        {
            let currentElement = this.elementList[i];
            this[currentElement.id] = new FormManager(this.getFrom(), currentElement);
            this[currentElement.id].displayForm();
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