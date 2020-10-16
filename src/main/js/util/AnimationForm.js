class AnimationForm extends Form
{

    constructor(formName, elementList, setUpFunction)
    {
        super(formName, elementList, setUpFunction);
    }


    produceFormManager(elementToDisplayOn, forceNewManager)
    {
        let formManager = super.produceFormManager(elementToDisplayOn, forceNewManager);
        formManager.setShouldSwap(true);
        return formManager;
    }
}