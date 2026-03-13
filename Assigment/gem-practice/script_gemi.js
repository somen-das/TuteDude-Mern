// Initialize EmailJS (Replace with your actual public key)
emailjs.init("TN-kGjCVmU7qP1upE");

// Service Data
const services = [
    { id: 1, name: "Dry Cleaning", price: 200.00, icon: "👕" },
    { id: 2, name: "Wash & Fold", price: 100.00, icon: "🧺" },
    { id: 3, name: "Ironing", price: 30.00, icon: "🧷" },
    { id: 4, name: "Stain Removal", price: 500.00, icon: "✨" },
    { id: 5, name: "Leather & Suede Cleaning", price: 999.00, icon: "🧥" },
    { id: 6, name: "Wedding Dress Cleaning", price: 2800.00, icon: "👗" }
];

let cart = [
    
];

// DOM Elements
const servicesListEl = document.getElementById('services-list');
const cartBodyEl = document.getElementById('cart-body');
const totalAmountEl = document.getElementById('total-amount');
const bookingForm = document.getElementById('booking-form');

// Render Services
function renderServices() {
    servicesListEl.innerHTML = '';
    services.forEach(service => {
        const isInCart = cart.some(item => item.id === service.id);
        
        const div = document.createElement('div');
        div.className = 'service-item';
        div.innerHTML = `
            <div class="service-info">
                ${service.icon} ${service.name} <span class="service-price">₹${service.price.toFixed(2)}</span>
            </div>
            <button class="${isInCart ? 'btn-remove' : 'btn-add'}" onclick="toggleCart(${service.id})">
                ${isInCart ? 'Remove Item ⊖' : 'Add Item ⊕'}
            </button>
        `;
        servicesListEl.appendChild(div);
    });
}

// // Toggle Cart Item
// function toggleCart(id) {
//     const service = services.find(s => s.id === id);
//     const index = cart.findIndex(item => item.id === id);

//     if (index > -1) {
//         cart.splice(index, 1); // Remove
//     } else {
//         cart.push(service); // Add
//     }
    
//     renderServices(); // Update buttons
//     renderCart(); // Update cart table
// }

// // Render Cart
// function renderCart() {
//     cartBodyEl.innerHTML = '';
//     let total = 0;

//     cart.forEach((item, index) => {
//         total += item.price;
//         const tr = document.createElement('tr');
//         tr.innerHTML = `
//             <td>${index + 1}</td>
//             <td>${item.name}</td>
//             <td>₹${item.price.toFixed(2)}</td>
//         `;
//         cartBodyEl.appendChild(tr);
//     });

//     totalAmountEl.innerText = `₹${total.toFixed(2)}`;
// }

// // Handle Form Submission with EmailJS
// bookingForm.addEventListener('submit', function(e) {
//     e.preventDefault();

//     if (cart.length === 0) {
//         alert("Please add at least one service to your cart.");
//         return;
//     }

//     const name = document.getElementById('user_name').value;
//     const email = document.getElementById('user_email').value;
//     const phone = document.getElementById('user_phone').value;
//     const total = totalAmountEl.innerText;

//     // Create a string of order details for the email body
//     const orderDetails = cart.map(item => `${item.name} (₹${item.price})`).join(', ');

//     const templateParams = {
//         to_name: "Admin", // or your name
//         user_name: name,
//         user_email: email,
//         user_phone: phone,
//         order_details: orderDetails,
//         total_amount: total
//     };

//     // Replace with your EmailJS Service ID and Template ID
//     emailjs.send("service_0vvqhyo", "template_jda320d", templateParams)
//         .then(function(response) {
//             console.log('SUCCESS!', response.status, response.text);
//             alert("Booking successful! An email confirmation has been sent.");
//             // Reset form and cart
//             cart = [];
//             bookingForm.reset();
//             renderServices();
//             renderCart();
//         }, function(error) {
//             console.log('FAILED...', error);
//             alert("Failed to send booking. Please try again.");
//         });
// });

// Initial Render
renderServices();

// Pre-fill the cart to match the mockup exactly
