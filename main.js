const shadow = document.getElementById("shadow");
const cartElement = document.getElementById("Cart");

function showCartElement() {
    cartElement.style.transform = "translateX(0)"
    shadow.classList.remove("hide");
    document.body.style.overflow = "hidden"
}

function hideCartElement() {
    cartElement.style.transform = "translateX(100%)"
    shadow.classList.add("hide");
    document.body.style.overflow = "auto"
}

const sizes = document.querySelectorAll("#sizes button");
    for (let i = 0; i < sizes.length; i++) {
        const element = sizes[i];
        element.addEventListener("click", activate)
    }
    function activate() {
        const activated = document.querySelector("#sizes button.active")
        this.classList.add("active")
        activated.classList.remove("active")
    }

const incrementBtn = document.querySelectorAll(".input-control")[1]
const decrementBtn = document.querySelectorAll(".input-control")[0]
incrementBtn.addEventListener("click", () => updateQuantity(1))
decrementBtn.addEventListener("click", () => updateQuantity(-1))
function updateQuantity(number) {
    const quantity = document.getElementById("quantity")
    quantity.value = Number(quantity.value) + number
}

