/*
 *
 * Since We need the host var for most everything and the navbar is loaded on every page
 * we declare the host var here
 * We also use window values to make it compatible with multiple domains I.E. localhost -> Live Site
 *  */
const host = window.location.protocol + "//" + window.location.hostname + "/";

let navbarHTML;
let loadNavBarFunction = function (xmlHttpRequest)
{
    if (xmlHttpRequest.status === 200)
    {
        navbarHTML = xmlHttpRequest.responseText;
    }
    else
    {
        navbarHTML = "<h1>Loading...</h1>";
    }

    let container = document.getElementById("navBarContainer");
    container.innerHTML = navbarHTML + container.innerHTML;
}

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