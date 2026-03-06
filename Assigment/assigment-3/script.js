const greetBtn = document.getElementById('great-btn-id');
const nameInput = document.getElementById('nameInput');
const headerData = document.getElementById('header-id')

// console.log({greetBtn, nameInput, headerData})
greetBtn.addEventListener('click', ()=>{
    const name = nameInput.value.trim();
            if (name) {
                headerData.textContent = `Hello, ${name}`;
            } else {
                headerData.textContent = "Hello";
            }
});


function changeBoxColor (element, color){
    console.log(color)
    element.style.backgroundColor = color;
}