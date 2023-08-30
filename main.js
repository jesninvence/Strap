//global variables
const global = {

}


//add a transparent to black navbar
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


//setup the page
window.addEventListener("DOMContentLoaded", init);

async function init() {
    const loader = document.querySelector("#loader-container");
    loader.classList.remove("hide");
    //path name
    const path = location.pathname;

    //fetch product
    const fetchProducts = await fetch("./products.json");
    let products = await fetchProducts.json();
    global.products = products;
    global.all_products = products[0].concat(products[1]);

    inputCart();
    if (path != "/Strap_CheckoutForm.html" ) 
        inputSearch();
    else displayCartCheckout();

    setTimeout(() => {
        loader.classList.add("hide")
    },500);

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

//show the products in Shop 
async function showProducts(page = 1) {
    let products = global.products; 
    products = products[page-1];
    const product_display = document.getElementById("products_display");
    let result = ``;
    products.forEach((product,i) => {
        result += `
            <div class="col-6 col-md-3">
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
    product_display.innerHTML = result;
}


//display the information in Item Info 
async function displayInfo(id = 0) {
    let products = global.all_products;
    let product = products[id];

    //choose sizes
    const sizes = document.querySelectorAll("#sizes button");
    for (let i = 0; i < sizes.length; i++) {
        const element = sizes[i];
        element.addEventListener("click", activate);
    }
    function activate() {
        const activated = document.querySelector("#sizes button.active");
        activated.classList.remove("active");
        this.classList.add("active");
    }

    //quantity control
    const incrementBtn = document.querySelectorAll(".info-quantity .input-control")[1]
    const decrementBtn = document.querySelectorAll(".info-quantity .input-control")[0]
    incrementBtn.addEventListener("click", () => updateQuantity(1));
    decrementBtn.addEventListener("click", () => updateQuantity(-1));
    function updateQuantity(number) {
        const quantity = document.getElementById("quantity");
        quantity.value = Number(quantity.value) + number;
        if (quantity.value <= 1 && number < 0) {
            decrementBtn.disabled = true;
            return;
        } else {
            decrementBtn.disabled = false;
        }
    }

    //display information
    (function() {
        let main = document.getElementById("main-image");
        main.src = product.image

        let thumbnail_container = document.querySelector(".item-info .other-display");

        product.showcase && product.showcase.forEach(src => {
            const div = document.createElement("div");
            div.className = "col-3";
            const img = document.createElement("img");
            img.className = "img-fluid";
            img.src = src;
            img.addEventListener("click",function() {
                main.src = img.src;
            });
            div.appendChild(img);
            thumbnail_container.appendChild(div);
        });
        
        const product_name = document.querySelector(".item-info .infos h1");
        product_name.innerHTML = product.name;
        product.soldout && product_name.classList.add("soldout-name");

        const product_price = document.querySelector(".item-info .infos .card-price");
        product_price.innerHTML = `<i class="fa-solid fa-peso-sign"></i> ` + product.price + ".00";

        const large_image = document.querySelector(".product-details .col-12 img");
        large_image.src = product.large_image || "img/nothing.jpg";

        const related_container = document.getElementById("related_products");
        let result = ``;
        product.related_products && product.related_products.forEach(product_id => {
            let related_product = products[product_id];
            result += `
            <div class="col-6 col-md-3">
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

    //add to cart functionality
    global.cart.add = function() {
        let quantityElement = document.getElementById("quantity");
        let quantity = Number(quantityElement.value);

        if (quantity < 1) {
            quantityElement.value = 1;
            quantity = 1;
        }

        const size = document.querySelector("#sizes button.active").innerHTML;

        if (global.cart.items[id] && global.cart.items[id][size]) 
            global.cart.items[id][size] += quantity;
        else if (global.cart.items[id]) {
            global.cart.items[id][size] = quantity;
        } else {
            global.cart.items[id] = {}
            global.cart.items[id][size] = quantity; 
        } 
        global.cart.total_price += global.all_products[id].price * quantity;
        global.cart.display();
    }
}

//include the cart
function inputCart() {
    const shadow = document.getElementById("shadow");
    const cartElement = document.getElementById("Cart");

    if (cartElement) {
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

    //cart object
    const cart = {};

    cart.items = {};
    cart.total_price = 0;

    cart.updateQuantity = function(item,size,number) {
        this.items[item][size] += number; 
        if (this.items[item][size] < 1) {
            this.items[item][size] = 1;
            number = 1;
            this.total_price = global.all_products[item].price * number;
        } else {
            this.total_price += global.all_products[item].price * number;
        }
        this.display();
    }

    cart.removeItem = function(item,size) {
        this.total_price -= this.items[item][size] * global.all_products[item].price;
        delete this.items[item][size];
        if (!Object.keys(this.items[item]).length) delete this.items[item];
        this.display();
    }

    cart.display = function(disable) {
        const container = document.querySelector("#Cart .items");
        let result = ``;    
        if (!cartElement) return;
        
        if (!Object.keys(this.items).length) {
            document.querySelector("#Cart .not-empty").classList.add("hide");
            document.querySelector("#Cart .empty").classList.remove("hide");
        } else {
            document.querySelector("#Cart .not-empty").classList.remove("hide");
            document.querySelector("#Cart .empty").classList.add("hide");
        }

        for (let item_id in this.items) {
            let product = global.all_products[Number(item_id)];
            for (let size in this.items[item_id]) {
                result += `
                <div class="row">
                    <div class="col-4">
                        <img src="${product.image}" alt="" width="100%">
                    </div>
                    <div class="col-8 position-relative">
                        <p class="tshirt-name">${product.name}</p>
                        <p class="price-1"><i class="fa-solid fa-peso-sign"></i> ${product.price}</p>
                        <p class="size">Size: ${size}</p>
                        <div class="input-group quantity mb-3">
                            <button ${this.items[item_id][size] == 1 ? 'disabled = "true"' : ""} class="input-control decrement-button" onclick="global.cart.updateQuantity('${item_id}','${size}',-1,this)"> <i class="fa-solid fa-minus"></i> </button>
                            <div class="quantity-container">
                                <input onchange=" global.cart.updateQuantity('${item_id}','${size}',parseInt(this.value || 1) - global.cart.items['${item_id}']['${size}'])" type="number" class="target-quantity border-0" value="${parseInt(this.items[item_id][size])}">
                            </div> 
                            <button class="input-control" onclick="global.cart.updateQuantity('${item_id}','${size}',1,this.previousElementSibling.previousElementSibling)"> <i class="fa-solid fa-plus"></i> </button>
                        </div>
                        <button class="trash" onclick="global.cart.removeItem('${item_id}','${size}')"><i class="fa-regular fa-trash-can"></i></button>
                    </div>
                </div>
                `;
            }
        }
        container.innerHTML = result;

        const total_price = document.querySelector("#Cart .checkout .total-price");
        total_price.innerHTML = `<i class="fa-solid fa-peso-sign"></i> ${this.total_price}.00`;
        localStorage.setItem("cart-items",JSON.stringify(this.items));
        localStorage.setItem("cart-total-price",JSON.stringify(this.total_price));
    }  

    global.cart = cart;

    const previous_cart = localStorage.getItem("cart-items");
    global.cart.items = previous_cart ? JSON.parse(previous_cart) : global.cart.items;
    
    const previous_total = localStorage.getItem("cart-total-price");
    global.cart.total_price = previous_total ? Number(previous_total) : global.cart.total_price;

    cart.display();

}


function inputSearch() {
    const searchElement = document.querySelector("#search");
    const shadow = document.querySelector("#shadow");
    global.showSearchElement = function() {
        searchElement.classList.remove("hide");
        shadow.classList.remove("hide");
        document.querySelector("#search .search-input input").focus();
    }
    global.hideSearchElement = function() {
        searchElement.classList.add("hide");
        shadow.classList.add("hide");
    }

    global.search = function(target) {
        const search_output = document.querySelector("#search .search-output");
        if (target == "") {
            search_output.classList.add("hide");
            return;
        } else search_output.classList.remove("hide");

        const results = global.all_products.filter(product => {
            return (new RegExp(target.toLowerCase())).test(product.name.toLowerCase());
        });
        
        if (results.length == 0) {
            search_output.classList.add("hide");
            return;
        } else search_output.classList.remove("hide");

        const output_container = document.querySelector("#search .search-output");
        let outputs = ``;
        results.forEach(result => {
            const id = global.all_products.indexOf(result);
            outputs += `   
            <a href="/Strap_ItemInfo.html?id=${id}">
                <div class="row">
                    <div class="col-3">
                        <img src="${result.image}" width="100%" alt="">
                    </div>
                    <div class="col-9   ">
                        <div>${result.name}</div>
                    </div>
                </div>
            </a> 
            `;
        })
        output_container.innerHTML = outputs;
    }
}

function displayCartCheckout() {
    const container = document.querySelector("#orders");
    let results = ``;
    
    let items = global.cart.items;
    for (let item_id in items) {
        let product = global.all_products[Number(item_id)];
        for (let size in items[item_id]) {
            results += `
            <div class="row">
                <div class="col-4 image-container">
                    <img src="${product.image}" alt="" width="100%">
                    <div class="quantity">${items[item_id][size]}</div>
                </div>
                <div class="col-8 position-relative item-description">
                    <p class="tshirt-name">${product.name}</p>
                    <p class="price-1"><i class="fa-solid fa-peso-sign"></i> ${product.price}</p>
                    <p class="size">Size: ${size}</p>
                    <p class="total-price">P${product.price * items[item_id][size]}</p>
                </div>
            </div>
            `;
        }
    }

    container.innerHTML = results;

    const sub_total = document.querySelector(".sub-total-container .total");
    sub_total.innerHTML = `P${global.cart.total_price}.00`;
}


//hide cart when not interacting with it
window.addEventListener("click",function(event) {
    const cart = document.getElementById("Cart");
    if (!cart.classList.contains("hide")) {
        const shadow = document.getElementById("shadow");
        if (event.target == shadow) {
            global.hideCartElement();
            global.hideSearchElement();
        } 
    }
});

/*
    *********************************************************
    *********************** U T I L S ***********************
    *********************************************************
*/

function updateQuantity(quantityElement,number,decrementBtn) {
    const quantity = quantityElement;
    if (quantity.value <= 1 && number < 0) {
        decrementBtn.disabled = true;
        return;
    } else {
        decrementBtn.disabled = false;
    }
    quantity.value = Number(quantity.value) + number;
    if (quantity.value <= 0) quantity.value = 1;
}