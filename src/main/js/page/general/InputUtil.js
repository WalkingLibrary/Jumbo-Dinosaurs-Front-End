function clearErrors()
{
    let errorHeaders = document.getElementsByClassName("error");
    for (let i = 0; i < errorHeaders.length; i++)
    {
        errorHeaders.item(i).innerHTML = "";
    }
}