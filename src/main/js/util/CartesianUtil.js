class Point2D
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    getEuclideanDistance(otherPoint)
    {
        return Math.sqrt(Math.pow(this.x - otherPoint.x, 2) + (Math.pow(this.y - otherPoint.y, 2)));
    }

}

class Point3D extends Point2D
{

    constructor(x, y, z)
    {
        super(x, y);
        this.z = z;
    }

    getEuclideanDistance(otherPoint)
    {
        return Math.sqrt(Math.pow(this.x - otherPoint.x, 2) +
            (Math.pow(this.z - otherPoint.z, 2)) +
            (Math.pow(this.y - otherPoint.y, 2)));
    }

}
