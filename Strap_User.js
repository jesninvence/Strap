let btn1 = document.getElementById('button-1');
let btn2 = document.getElementById('button-2');

let div1 = document.getElementById('division-1');
let div2 = document.getElementById('division-2');

btn1.addEventListener("click", showDiv1);
btn2.addEventListener("click", showDiv2);
function showDiv1(){
    div1.classList.add('active');
    div2.classList.remove('active');
}
function showDiv2(){
    div2.classList.add('active');
    div1.classList.remove('active');
}
let btns = document.querySelectorAll(".tabBtn");
let divs = document.querySelectorAll(".tab-division");