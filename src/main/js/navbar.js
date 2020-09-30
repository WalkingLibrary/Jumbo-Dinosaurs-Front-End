let navBarFactory = new FormFactory([document.getElementById("navBarContainer")]);
defaultFormLoader.loadForm("navbar.html", navBarFactory);

/*This Function Makes the NavBar Visible*/
function makeNavBarVisible()
{
    /*The Navigation bar is comprised of <a/> tags with imgs inside of them
       to show the navigation bar we get all the imgs in the navbarIcons and
       set their width to auto*/
    let navBarLinks = document.getElementById("navbar").getElementsByTagName("img");
    for (let i = 0; i < navBarLinks.length; i++)
    {
        navBarLinks[i].style.width = "auto";
    }
}

/*This Function hides the navbar*/
function hideNavBar()
{
    /*The Navigation bar is comprised of <a/> tags with imgs inside of them
       to hide the navigation bar we get all the imgs in the navbarIcons and
       set their width to 0*/
    let navBarLinks = document.getElementById("navbar").getElementsByTagName("img");
    for (let i = 0; i < navBarLinks.length; i++)
    {
        navBarLinks[i].style.width = "0";
    }
}