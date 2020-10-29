let dataImgHeader = "data:image/%s;base64,"

function readTextFile(file, onReadyFunction)
{
    let reader = new FileReader();


    reader.onload = function ()
    {
        onReadyFunction(reader);
    };

    reader.readAsText(file);

}


function readByteFile(file, onReadyFunction)
{
    let reader = new FileReader();


    reader.onload = function ()
    {

        onReadyFunction(reader);

    };

    reader.readAsArrayBuffer(file);

}

function convertArrayBufferToBase64(bytes)
{
    let binary = "";
    for (let i = 0; i < bytes.length; i++)
    {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function getFileType(fileName)
{
    //Note: doesn't return periods

    let fileType = "";
    let startIndex = fileName.lastIndexOf(".");
    if (startIndex < 0)
    {
        throw new Error("No File type in " + fileName);
    }
    for (let i = startIndex + 1; i < fileName.length; i++)
    {
        fileType += fileName.charAt(i);
    }

    return fileType;
}

function readImage(inputElement, displaySelectedImage)
{
    /*
     * Process for reading in an image
     *
     *  */

    let file = inputElement.files[0];
    let onFinishRead = function (fileReader)
    {
        let base64ImageContents = convertArrayBufferToBase64(new Uint8Array(fileReader.result));
        let fileType = getFileType(file.name);
        if (displaySelectedImage)
        {
            let imageSource = dataImgHeader.replace("%s", fileType) + base64ImageContents;
            let photoDisplayElement = inputElement.parentElement.querySelector("img");
            photoDisplayElement.className = "alternativeOutline widthHeightOneHundredPixels";
            photoDisplayElement.src = imageSource;
        }
        console
        inputElement.postImage = new PostImage(base64ImageContents, fileType);
    }
    readByteFile(file, onFinishRead);
}

