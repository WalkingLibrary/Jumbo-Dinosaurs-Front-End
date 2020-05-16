/*This Function Makes the NavBar Visible*/
function makeNavBarVisible() {
    /*The Navigation bar is comprized of <a/> tags with imgs inside of them
       to show the navigation bar we get all the imgs in the navbarIcons and
       set their width to auto*/
    var navBarLinks = document.getElementById("navbar").getElementsByTagName("img");
    for (var i = 0; i < navBarLinks.length; i++) {
        navBarLinks[i].style.width = "auto";
    };
};

/*This Function hides the navbar*/
function hideNavBar() {
    /*The Navigation bar is comprized of <a/> tags with imgs inside of them
       to hide the navigation bar we get all the imgs in the navbarIcons and
       set their width to 0*/
    var navBarLinks = document.getElementById("navbar").getElementsByTagName("img");
    for (let i = 0; i < navBarLinks.length; i++) {
        navBarLinks[i].style.width = "0";
    };
};