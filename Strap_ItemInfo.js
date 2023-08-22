// let main = document.getElementById("main-image");
// let image1 = document.getElementById("image-1");
// let image2 = document.getElementById("image-2");
// let image3 = document.getElementById("image-3");
// let image4 = document.getElementById("image-4");

// image1.addEventListener("click", changeImage1);
// image2.addEventListener("click", changeImage2);
// image3.addEventListener("click", changeImage3);
// image4.addEventListener("click", changeImage4);

// function changeImage1(){
//     main.removeAttribute("src");
//     main.setAttribute("src", image1.getAttribute("src"));
// }
// function changeImage2(){
//     main.removeAttribute("src");
//     main.setAttribute("src", image2.getAttribute("src"));
// }
// function changeImage3(){
//     main.removeAttribute("src");
//     main.setAttribute("src", image3.getAttribute("src"));
// }
// function changeImage4(){
//     main.removeAttribute("src");
//     main.setAttribute("src", image4.getAttribute("src"));
// }


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