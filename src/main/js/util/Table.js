class Table
{

    constructor(tableJson)
    {
        this.id = tableJson.id;
        this.permissions = tableJson.permissions;
        this.isPublic = tableJson.isPublic;
        this.creator = tableJson.creator;
        this.name = tableJson.name;
    }


    toString()
    {
        return JSON.stringify(this)
    }
}
