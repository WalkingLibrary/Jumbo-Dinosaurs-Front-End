function swapOpenFolder(clickedDiv)
{
    let children = clickedDiv.parentElement.children;
    for (let i = 0; i < children.length; i++)
    {
        let classes = children[i].classList;
        classes.remove("opened");
    }
    clickedDiv.classList.add("opened");

}


function updateCharacterCount(textElement, maxCount)
{
    let text = textElement.value;
    let displayHeader = textElement.parentElement.children[1];

    displayHeader.innerHTML = text.length + "/" + maxCount;
}