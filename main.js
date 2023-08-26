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
    switch(path) {
        case "/Strap_shop.html":
            const page = location.search.slice(1).split("=")[1];
            showProducts(page);
            break;
        case "/Strap.html":
            transBar();
            break;
        case "/Strap_Info.html":
            displayInfo();
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
    products.forEach(product => {
        result += `
            <div class="col-3">
                <div class="card ${product.soldout && "soldout"} bg-white h-100">
                    <a type="button" data-bs-toggle="modal" href="${product.link}" data-bs-target="#sampleModal1"><img src="${product.image}" width="100%"></a>
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

async function displayInfo(index) {
    const fetchProducts = await fetch("./products.json");
    let products = await fetchProducts.json();
    console.log([1, 2].concat([3, 4]))

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