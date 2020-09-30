class FormFactory
{
    constructor(elementList)
    {
        this.elementList = elementList === undefined ? [] : elementList;
    }

    produceFormManager(elementToDisplayOn, persistentToggle)
    {
        if (this[elementToDisplayOn.id] === undefined)
        {
            this[elementToDisplayOn.id] = new FormManager(this.getFrom(), elementToDisplayOn, persistentToggle);
        }
        return this[elementToDisplayOn.id];
    }

    onFormLoad()
    {
        for (let i = 0; i < this.elementList.length; i++)
        {
            let currentElement = this.elementList[i];
            this[currentElement.id] = new FormManager(this.getFrom(), currentElement);
            this[currentElement.id].toggleDisplay();
        }

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