const global = {

}

function transBar() {
    const navigation = document.querySelector("#header .navbar");
    window.addEventListener("scroll", scrollTrans);
    function scrollTrans() {
        if (scrollY > 0) {
            navigation.style.background = "black";
        } else {
            navigation.style.background = "transparent";
        }
    }

}

window.addEventListener("DOMContentLoaded", init);
function init() {
    const path = location.pathname;
    console.log(path)
    switch(path) {
        case "/Strap_shop.html":
            const page = location.search.slice(1).split("=")[1];
            showProducts(page);
            break;
        case "/Strap.html":
            transBar();
            break;
        case "/Strap_ItemInfo.html":
            const id = location.search.slice(1).split("=")[1];
            displayInfo(id);
            break;
    }
}
async function showProducts(page = 1) {
    const fetchProducts = await fetch("./products.json");
    let products = await fetchProducts.json();
    console.log(page)
    products = products[page-1];
    const product_display = document.getElementById("products_display");
    let result = ``;
    products.forEach((product,i) => {
        result += `
            <div class="col-3">
                <div class="card ${product.soldout && "soldout"} bg-white h-100">
                    <a type="button" data-bs-toggle="modal" href="${`/Strap_ItemInfo.html?id=${i + (page - 1) * 20}`}" data-bs-target="#sampleModal1"><img src="${product.image}" width="100%"></a>
                    ${product.soldout ? `<span class="tag"> Sold out </span>` : ""} 
                    <div class="card-body">
                        <h5 ${product.soldout ? `id="soldout"` : ""} class="card-title text-black">${product.name}</h5>
                        <p class="card-price"><i class="fa-solid fa-peso-sign"></i> ${product.price} </p>
                    </div>
                </div>
            </div>
        `
                    })
    product_display.innerHTML = result
}

async function displayInfo(id = 0) {
    const fetchProducts = await fetch("./products.json");
    let products = await fetchProducts.json();
    products = products[0].concat(products[1]);
    let product = products[id];

    const sizes = document.querySelectorAll("#sizes button");
    for (let i = 0; i < sizes.length; i++) {
        const element = sizes[i];
        element.addEventListener("click", activate);
    }
    function activate() {
        const activated = document.querySelector("#sizes button.active");
        this.classList.add("active");
        activated.classList.remove("active");
    }

    const incrementBtn = document.querySelectorAll(".input-control")[1]
    const decrementBtn = document.querySelectorAll(".input-control")[0]
    incrementBtn.addEventListener("click", () => updateQuantity(1));
    decrementBtn.addEventListener("click", () => updateQuantity(-1));
    function updateQuantity(number) {
        const quantity = document.getElementById("quantity");
        quantity.value = Number(quantity.value) + number;
    }

    (function() {
        let main = document.getElementById("main-image");
        main.src = product.image;

        let thumbnail = document.querySelectorAll(".thumbnail");

        thumbnail.forEach(
            function(image,index){
                image.src = product.showcase ? product.showcase[index] : "img/nothing.jpg";
                image.addEventListener("click",
                    function changeImage(event){
                            main.removeAttribute("src");
                            main.setAttribute("src", event.target.getAttribute("src"));
                    }
                )
            }
        );
        
        const product_name = document.querySelector(".item-info .col-5 h1");
        product_name.innerHTML = product.name;

        const product_price = document.querySelector(".item-info .col-5 .card-price");
        product_price.innerHTML = `<i class="fa-solid fa-peso-sign"></i> ` + product.price + ".00";

        const large_image = document.querySelector(".product-details .col-12 img");
        large_image.src = product.large_image || "img/nothing.jpg";

        const related_container = document.getElementById("related_products");
        let result = ``;
        product.related_products && product.related_products.forEach(product_id => {
            let related_product = products[product_id];
            result += `
            <div class="col-3">
                <div class="card ${related_product.soldout && "soldout"} bg-white h-100">
                    <a type="button" href="/Strap_ItemInfo.html?id=${products.indexOf(related_product)}"><img src="${related_product.image}" width="100%"></a>
                    ${related_product.soldout ? `<span class="tag"> Sold out </span>` : ""}
                    <div class="card-body">
                        <h5 ${related_product.soldout ? `id="soldout"` : ""} class="card-title text-black">${related_product.name}</h5>
                        <p class="card-price"><i class="fa-solid fa-peso-sign"></i> ${related_product.price}</p>
                    </div>
                </div>
            </div>
            `
        });
        related_container.innerHTML = result;
    })();
}

function inputCart() {
    const shadow = document.getElementById("shadow");
    const cartElement = document.getElementById("Cart");
    
    global.showCartElement = function() {
        cartElement.style.transform = "translateX(0)"
        shadow.classList.remove("hide");
        document.body.style.overflow = "hidden"
    }
    
    global.hideCartElement = function() {
        cartElement.style.transform = "translateX(100%)"
        shadow.classList.add("hide");
        document.body.style.overflow = "auto"
    }
}

inputCart()
