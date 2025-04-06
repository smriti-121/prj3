// Sticky header
window.addEventListener('scroll', function() {
  const header = document.querySelector('header');
  header.classList.toggle('sticky', window.scrollY > 0);
});

// Cart functionality
const cartContainer = document.querySelector('.cart-container');
const cartCount = document.querySelector('.cart-count');
let cartItems = 0;

cartContainer.addEventListener('click', () => {
  cartItems++;
  cartCount.textContent = cartItems;
});

// "See More" button functionality
const seeMoreBtn = document.querySelector('.see-more-btn');
const productGrid = document.querySelector('.product-grid');

seeMoreBtn.addEventListener('click', () => {
  const newProducts = [
    { image: 'https://i.pinimg.com/736x/40/97/67/409767c04787f0cdfe408c44aa74e2db.jpg', name: 'Oxidised Chandbali', price: 'Rs.156' },
    { image: 'https://img.ltwebstatic.com/images3_pi/2021/05/14/16209895197eef42136539c28be82b0436e26709e5_thumbnail_405x552.jpg', name: 'Black Ankle Strap Heels', price: 'Rs.500' },
    { image: 'https://parijanofficial.com/cdn/shop/products/IMG_0385.jpg?v=1675126132&width=540', name: 'Quarter Zip Sweater', price: 'Rs.2,500' },
    { image: 'https://i.pinimg.com/736x/32/e4/a5/32e4a5f5f2be9c6fb0f11a43be5523bb.jpg', name: 'Oversized T-Shirt', price: 'Rs.700' }
  ];

  newProducts.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');

    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="price">${product.price}</p>
      <button class="add-to-cart">Add to Cart</button>
    `;

    productGrid.appendChild(productCard);
  });

  seeMoreBtn.style.display = 'none';
});

// Filter and Sort Functionality
const filterOptions = document.querySelectorAll('.filter-option');
const sortOptions = document.querySelectorAll('.sort-option');
const productCards = document.querySelectorAll('.product-card');

filterOptions.forEach(option => {
  option.addEventListener('click', () => {
    const filterValue = option.dataset.filter;
    productCards.forEach(card => {
      card.style.display = (filterValue === 'all' || card.classList.contains(filterValue)) ? 'block' : 'none';
    });
  });
});

sortOptions.forEach(option => {
  option.addEventListener('click', () => {
    const sortValue = option.dataset.sort;
    const sortedProducts = [...productCards].sort((a, b) => {
      const priceA = parseFloat(a.querySelector('.price').textContent.replace('Rs.', ''));
      const priceB = parseFloat(b.querySelector('.price').textContent.replace('Rs.', ''));
      return sortValue === 'asc' ? priceA - priceB : priceB - priceA;
    });

    sortedProducts.forEach(card => productGrid.appendChild(card));
  });
});

// Authentication Modal
const authModal = document.getElementById('authModal');
const authButton = document.getElementById('authButton');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const showSignupLink = document.getElementById('showSignup');
const showLoginLink = document.getElementById('showLogin');

authButton.addEventListener('click', () => {
  authModal.style.display = 'flex';
  loginForm.style.display = 'block';
  signupForm.style.display = 'none';
});

authModal.addEventListener('click', (e) => {
  if (e.target === authModal) authModal.style.display = 'none';
});

showSignupLink.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.style.display = 'none';
  signupForm.style.display = 'block';
});

showLoginLink.addEventListener('click', (e) => {
  e.preventDefault();
  signupForm.style.display = 'none';
  loginForm.style.display = 'block';
});

// Form Submission
['loginFormElement', 'signupFormElement'].forEach(id => {
  document.getElementById(id).addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(`${id} submitted`);
  });
});

// Navbar Toggle
const nav = document.querySelector('nav ul');
document.querySelector('.logo').addEventListener('click', () => {
  nav.classList.toggle('active');
});

// Chatbot API Integration
const API_URL = "https://ecommerce-ml-api-2.onrender.com";

async function getChatbotResponse(message) {
  try {
    const response = await fetch(`${API_URL}/predict_chatbot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    console.log("Chatbot Response:", data.response);
    return data.response;
  } catch (error) {
    console.error("Chatbot API Error:", error);
    return "Sorry, I couldn't process your request.";
  }
}
function toggleChatbot() {
  document.getElementById("chatbot").classList.toggle("active");
}

function sendMessage() {
  let input = document.getElementById("chatbot-input");
  let message = input.value.trim();
  if (message) {
      let messagesContainer = document.getElementById("chatbot-messages");
      messagesContainer.innerHTML += `<div>User: ${message}</div>`;
      input.value = "";

      fetch("/chatbot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: message })
      })
      .then(response => response.json())
      .then(data => {
          messagesContainer.innerHTML += `<div>Bot: ${data.response}</div>`;
      });
  }
}

function fetchRecommendations() {
  fetch("/recommend")
  .then(response => response.json())
  .then(data => {
      let recommendationsDiv = document.getElementById("recommendations");
      recommendationsDiv.innerHTML = `<h3>Recommended:</h3><ul>${data.recommendations.map(item => `<li>${item}</li>`).join('')}</ul>`;
  });
}
function checkFraud() {
  let transactionDetails = document.getElementById("transaction-details").value;

  fetch("/fraud-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transaction: transactionDetails })
  })
  .then(response => response.json())
  .then(data => {
      document.getElementById("fraud-result").innerText = data.fraud 
          ? "🚨 Fraud detected!" 
          : "✅ Transaction is safe.";
  });
}
