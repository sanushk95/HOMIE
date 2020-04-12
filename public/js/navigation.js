(function () {
    "use strict";

    console.log("fired");

    let navToggler = document.querySelector(".nav-toggler");

    function setsidebartype() {
        var width = (window.innerWidth > 0) ? window.innerWidth : this.screen.width;
        if (width < 1170) {
            document.querySelector("#main-wrapper").classList.add("mini-sidebar");
            document.querySelector('.navbar-brand span').style.visibility = 'hidden';   
            document.querySelector(".nav-toggler i").classList.add("fa-times");
        } else {
            document.querySelector("#main-wrapper").classList.remove("mini-sidebar");
            document.querySelector('.navbar-brand span').style.visibility = 'visible'; 
        }
    };

    window.onresize = function () {
        setsidebartype();
    };

    navToggler.addEventListener("click", () => {
        console.log("navToggler");

        document.querySelector("#main-wrapper").classList.toggle("show-sidebar");
        document.querySelector(".nav-toggler i").classList.toggle("fa-bars");
    });

    document.querySelector(".search-box a, .search-box .app-search .srh-btn").addEventListener("click", () => {
        console.log("search");

        document.querySelector(".app-search").style.display = 'block';
        document.querySelector(".app-search input").focus();
    });
    setsidebartype();
})();