let main = document.getElementById("main-image");

let thumbnail = document.querySelectorAll(".thumbnail");

thumbnail.forEach(
    function(image){
        image.addEventListener("click",
            function changeImage(event){
                    main.removeAttribute("src");
                    main.setAttribute("src", event.target.getAttribute("src"));
            }
        )
    }
);