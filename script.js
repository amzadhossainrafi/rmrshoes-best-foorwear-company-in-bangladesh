// Sample product data
const products = [
    {
        id: 1,
        name: "Running Pro X",
        price: 89.99,
        oldPrice: 120.00,
        image: "images/product1.jpg",
        rating: 4,
        badge: "Sale"
    },
    {
        id: 2,
        name: "Casual Walkers",
        price: 59.99,
        image: "images/product2.jpg",
        rating: 5,
        badge: "Popular"
    },
    {
        id: 3,
        name: "Basketball Elite",
        price: 109.99,
        oldPrice: 129.99,
        image: "images/product3.jpg",
        rating: 4,
        badge: "New"
    },
    {
        id: 4,
        name: "Summer Sandals",
        price: 39.99,
        image: "images/product4.jpg",
        rating: 3,
        badge: "Trending"
    },
    {
        id: 5,
        name: "Formal Oxfords",
        price: 79.99,
        oldPrice: 99.99,
        image: "images/product5.jpg",
        rating: 4,
        badge: "Sale"
    },
    {
        id: 6,
        name: "Trail Hikers",
        price: 94.99,
        image: "images/product6.jpg",
        rating: 5,
        badge: "Best Seller"
    },
    {
        id: 7,
        name: "Skateboard Pros",
        price: 69.99,
        image: "images/product7.jpg",
        rating: 4,
        badge: "New"
    },
    {
        id: 8,
        name: "Minimalist Sneakers",
        price: 49.99,
        oldPrice: 69.99,
        image: "images/product8.jpg",
        rating: 4,
        badge: "Sale"
    }
];

// Display featured products
function displayFeaturedProducts() {
    const productGrid = document.querySelector('.product-grid');
    
    if (productGrid) {
        let output = '';
        
        products.slice(0, 8).forEach(product => {
            output += `
                <div class="product-card" data-id="${product.id}">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <div class="product-price">
                            <span class="current-price">$${product.price.toFixed(2)}</span>
                            ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                        </div>
                        <div class="product-rating">
                            ${'<i class="fas fa-star"></i>'.repeat(product.rating)}${'<i class="far fa-star"></i>'.repeat(5 - product.rating)}
                        </div>
                        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            `;
        });
        
        productGrid.innerHTML = output;
    }
}

// Mobile menu toggle
function setupMobileMenu() {
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    const header = document.querySelector('.header-content');
    if (header) {
        header.prepend(menuToggle);
        
        menuToggle.addEventListener('click', () => {
            document.querySelector('.main-nav').classList.toggle('active');
            menuToggle.querySelector('i').classList.toggle('fa-times');
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayFeaturedProducts();
    setupMobileMenu();
    
    // Update cart count
    updateCartCount();
    
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        }
    });
});

// Cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show notification
    showNotification(`${product.name} added to cart`);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Search functionality
function setupSearch() {
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const searchContainer = document.createElement('div');
            searchContainer.className = 'search-container';
            searchContainer.innerHTML = `
                <div class="search-box">
                    <input type="text" placeholder="Search for products...">
                    <button class="search-submit"><i class="fas fa-search"></i></button>
                    <button class="search-close"><i class="fas fa-times"></i></button>
                </div>
            `;
            document.body.appendChild(searchContainer);
            
            setTimeout(() => {
                searchContainer.classList.add('active');
                searchContainer.querySelector('input').focus();
            }, 10);
            
            // Close search
            searchContainer.querySelector('.search-close').addEventListener('click', () => {
                searchContainer.classList.remove('active');
                setTimeout(() => {
                    searchContainer.remove();
                }, 300);
            });
            
            // Handle search submit
            searchContainer.querySelector('.search-submit').addEventListener('click', () => {
                const query = searchContainer.querySelector('input').value.trim();
                if (query) {
                    window.location.href = `products.html?search=${encodeURIComponent(query)}`;
                }
            });
            
            // Handle Enter key
            searchContainer.querySelector('input').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = searchContainer.querySelector('input').value.trim();
                    if (query) {
                        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
                    }
                }
            });
        });
    }
}

// Initialize search
setupSearch();