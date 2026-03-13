emailjs.init("TN-kGjCVmU7qP1upE");
const servicesData = [
    { id: 1, name: "Dry Cleaning", price: 200.00, icon: "./images/servicesIcons/laundry-machine.png" },
    { id: 2, name: "Wash & Fold", price: 100.00, icon: "./images/servicesIcons/laundry.png" },
    { id: 3, name: "Ironing", price: 30.00, icon: "./images/servicesIcons/iron.png" },
    { id: 4, name: "Stain Removal", price: 500.00, icon: "./images/servicesIcons/stain-remover.png" },
    { id: 5, name: "Leather & Suede Cleaning", price: 999.00, icon: "./images/servicesIcons/leather-work.png" },
    { id: 6, name: "Wedding Dress Cleaning", price: 2800.00, icon: "./images/servicesIcons/wedding.png" },
];

let cart = [];

let servicesHTML = '';

for(let i = 0; i < servicesData.length; i++) {
    
    let service = servicesData[i]; 

    servicesHTML += `
        <div class="service-item">
            <div class="service-info">
                 <img src="${service.icon}" height="24px"/> ${service.name} 
                 <span class="service-dot">•</span> 
                 <span class="service-price">₹${service.price.toFixed(2)}</span>
            </div>
            <button id="btn-${service.id}" class="btn-add" onclick="addItem(${service.id})">
                Add Item <span>⊕</span>
            </button>
        </div>
    `;
}

document.getElementById('services-list').innerHTML = servicesHTML;

function addItem(id) {
    const clickedButton = document.getElementById('btn-' + id);
    
    let itemIndex = -1;
    
    for (let i = 0; i < cart.length; i++) {
        if (cart[i] === id) {
            itemIndex = i;
            break;  
        }
    }
console.log([itemIndex])
    if (itemIndex > -1) {
        cart.splice(itemIndex, 1); 
        clickedButton.className = 'btn-add';
        clickedButton.innerHTML = 'Add Item <span>⊕</span>';
    } else {
        cart.push(id);
        clickedButton.className = 'btn-remove';
        clickedButton.innerHTML = 'Remove Item <span>⊖</span>';
    }

    updateCartUI();
}


function updateCartUI() {
    const cartBody = document.getElementById('cart-body');
    const totalAmountEl = document.getElementById('total-amount');
    
    let htmlContent = '';
    let total = 0;

    if (cart.length === 0) {
        htmlContent = `
        <tr id="empty-cart-row">
            <td colspan="3" style="text-align: center; padding: 20px;">
                <div class="empty-cart" style="display: flex; flex-direction: column; align-items: center;">
                    <img src="./images/icon/deal.png" alt="No items" height="32px" width="32px">
                    <h4>No item</h4>
                    <p style="font-size: 14px; color: gray;">Please add an item</p>
                </div>
            </td>
        </tr>`;
    } else {
        for (let i = 0; i < cart.length; i++) {
            let cartId = cart[i];
            
            let item = null;
            for (let j = 0; j < servicesData.length; j++) {
                if (servicesData[j].id === cartId) { 
                    item = servicesData[j];          
                    break;                           
                }
            }

            if (item !== null) {
                total += item.price; 
                
                htmlContent += `
                <tr>
                    <td style="padding: 10px 0;">${i + 1}</td>
                    <td>${item.name}</td>
                    <td>₹${item.price.toFixed(2)}</td>
                </tr>`;
            }
        }
    }

    cartBody.innerHTML = htmlContent;
    totalAmountEl.innerText = total.toFixed(2);


    const submitBtn = document.getElementById('submit-btn');
    if (cart.length === 0) {
        submitBtn.disabled = true;
    } else {
        submitBtn.disabled = false; 
    }
}

const bookingForm = document.getElementById('booking-form');
console.log(bookingForm)
bookingForm.addEventListener('submit', function(event) {
    event.preventDefault(); 
    if(cart.length === 0) {
        document.getElementById('info-footer-alert').innerHTML = '<p style="color: red;">ⓘ Please add at least one item to the cart before booking.</p>';
            return; 
    }

    document.getElementById('info-footer-alert').innerHTML = '';

    const name = document.getElementById('user_name').value;
    const email = document.getElementById('user_email').value;
    const phone = document.getElementById('user_phone').value;
    const totalAmount = document.getElementById('total-amount').innerText;

    console.log("Order===>", name, email, phone);
    console.log("Total amt=====>", totalAmount);
    
    const templateParams = {
        to_name: "Somen",
        user_name: name,
        user_email: email,
        user_phone: phone,
        total_amount: totalAmount,
        order_details: cart.map(id => {
             const item = servicesData.find(s => s.id === id);
             return item.name;
        }).join(', ')
    };

    console.log("template checking===>>:", templateParams);
// return
    // document.getElementById('info-footer-alert').innerHTML = '<p style="color: green;">ⓘ Email Has benn Send Successfully.</p>';
    
    emailjs.send("service_0vvqhyo", "template_jda320d", templateParams)
        .then(function(response) {
            console.log('Suces checking==>', response.status, response.text);
            document.getElementById('info-footer-alert').innerHTML = '<p style="color: green; font-weight: bold;">ⓘ Booking Successful! Email has been sent.</p>';
            
            // return
            bookingForm.reset();
            cart = [];
            
            const allButtons = document.querySelectorAll('.btn-remove');
            for(let i=0; i<allButtons.length; i++) {
                allButtons[i].className = 'btn-add';
                allButtons[i].innerHTML = 'Add Item <span>⊕</span>';
            }
            updateCartUI(); 

        }, function(error) {
            console.log('Error Meaaage check===>>>', error);
            document.getElementById('info-footer-alert').innerHTML = '<p style="color: red; font-weight: bold;">ⓘ Failed to send email. Please try again.</p>';
        });
});


