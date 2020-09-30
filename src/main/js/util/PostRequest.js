class PostRequest
{
    constructor(command, user)
    {
        this.command = command;
        if (getUser() !== null)
        {

            this.username = getUser().username;
            this.tokenUse = getUser().tokenUse;
            this.token = getUser().token;
        }
    }

    setCRUDRequest(request)
    {
        this.content = "";
        this.content += JSON.stringify(request);
    }

}

class CRUDRequest
{
    constructor()
    {
    }
}