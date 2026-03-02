

document.addEventListener("DOMContentLoaded",()=>{

const yearSpan=document.getElementById("year");

if(yearSpan){

yearSpan.textContent=new Date().getFullYear();

}



const hamburger=document.getElementById("hamburger");

const navLinks=document.getElementById("nav-links");

const navItems=document.querySelectorAll("#nav-links a");

if(hamburger && navLinks){

hamburger.addEventListener("click",()=>{

hamburger.classList.toggle("active");

navLinks.classList.toggle("active");

document.body.classList.toggle("menu-open");

});

}



navItems.forEach(item=>{

item.addEventListener("click",()=>{

hamburger.classList.remove("active");

navLinks.classList.remove("active");

document.body.classList.remove("menu-open");

});

});


});