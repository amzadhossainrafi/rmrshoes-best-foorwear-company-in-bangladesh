// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.cart-page')) {
        displayCartItems();
        setupCartEvents();
    }
    
    if (document.querySelector('.checkout-page')) {
        displayCheckoutSummary();
        setupCheckoutForm();
    }
});

function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSummary = document.querySelector('.cart-summary');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added anything to your cart yet</p>
                <a href="products.html" class="btn">Continue Shopping</a>
            </div>
        `;
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }
    
    let itemsHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        itemsHTML += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}"><i class="fas fa-minus"></i></button>
                        <input type="number" value="${item.quantity}" min="1" class="quantity-input">
                        <button class="quantity-btn plus" data-id="${item.id}"><i class="fas fa-plus"></i></button>
                    </div>
                </div>
                <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
                <button class="cart-item-remove" data-id="${item.id}"><i class="fas fa-times"></i></button>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = itemsHTML;
    
    if (cartSummary) {
        const shipping = subtotal > 50 ? 0 : 5.99;
        const tax = subtotal * 0.1; // 10% tax
        const total = subtotal + shipping + tax;
        
        cartSummary.innerHTML = `
            <div class="summary-row">
                <span>Subtotal</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping</span>
                <span>${shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Tax (10%)</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
                <span>Total</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <a href="checkout.html" class="btn checkout-btn">Proceed to Checkout</a>
        `;
    }
}

function setupCartEvents() {
    // Quantity changes
    document.addEventListener('click', function(e) {
        if (e.target.closest('.quantity-btn')) {
            const btn = e.target.closest('.quantity-btn');
            const productId = parseInt(btn.getAttribute('data-id'));
            const isPlus = btn.classList.contains('plus');
            
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const itemIndex = cart.findIndex(item => item.id === productId);
            
            if (itemIndex !== -1) {
                if (isPlus) {
                    cart[itemIndex].quantity += 1;
                } else {
                    if (cart[itemIndex].quantity > 1) {
                        cart[itemIndex].quantity -= 1;
                    }
                }
                
                localStorage.setItem('cart', JSON.stringify(cart));
                displayCartItems();
                updateCartCount();
            }
        }
        
        // Manual quantity input
        const quantityInputs = document.querySelectorAll('.quantity-input');
        quantityInputs.forEach(input => {
            input.addEventListener('change', function() {
                const productId = parseInt(this.closest('.cart-item').getAttribute('data-id'));
                const newQuantity = parseInt(this.value) || 1;
                
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const itemIndex = cart.findIndex(item => item.id === productId);
                
                if (itemIndex !== -1) {
                    cart[itemIndex].quantity = newQuantity;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    displayCartItems();
                    updateCartCount();
                }
            });
        });
        
        // Remove item
        if (e.target.closest('.cart-item-remove')) {
            const btn = e.target.closest('.cart-item-remove');
            const productId = parseInt(btn.getAttribute('data-id'));
            
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart = cart.filter(item => item.id !== productId);
            
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCartItems();
            updateCartCount();
            
            // Show notification
            showNotification('Item removed from cart');
        }
    });
}

function displayCheckoutSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkoutItems = document.querySelector('.checkout-items');
    const checkoutTotals = document.querySelector('.checkout-totals');
    
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    let itemsHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        itemsHTML += `
            <div class="checkout-item">
                <div class="checkout-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="checkout-item-details">
                    <h3>${item.name}</h3>
                    <div>$${item.price.toFixed(2)} × ${item.quantity}</div>
                </div>
                <div class="checkout-item-total">$${itemTotal.toFixed(2)}</div>
            </div>
        `;
    });
    
    checkoutItems.innerHTML = itemsHTML;
    
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;
    
    checkoutTotals.innerHTML = `
        <div class="summary-row">
            <span>Subtotal</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span>Shipping</span>
            <span>${shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span>Tax (10%)</span>
            <span>$${tax.toFixed(2)}</span>
        </div>
        <div class="summary-row total">
            <span>Total</span>
            <span>$${total.toFixed(2)}</span>
        </div>
    `;
}

function setupCheckoutForm() {
    const checkoutForm = document.querySelector('.checkout-form');
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('error');
                    isValid = false;
                } else {
                    field.classList.remove('error');
                }
            });
            
            // Validate email
            const emailField = this.querySelector('input[type="email"]');
            if (emailField && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
                emailField.classList.add('error');
                isValid = false;
            }
            
            if (isValid) {
                // In a real app, you would process payment here
                // For demo, we'll just show a success message and clear the cart
                localStorage.removeItem('cart');
                updateCartCount();
                
                // Show success message
                document.querySelector('.checkout-container').innerHTML = `
                    <div class="checkout-success">
                        <i class="fas fa-check-circle"></i>
                        <h2>Thank you for your order!</h2>
                        <p>Your order has been placed successfully. We've sent a confirmation email to your address.</p>
                        <p>Order ID: #${Math.floor(Math.random() * 1000000)}</p>
                        <a href="products.html" class="btn">Continue Shopping</a>
                    </div>
                `;
            }
        });
        
        // Toggle shipping/billing address
        const sameAsShipping = document.querySelector('#same-as-shipping');
        if (sameAsShipping) {
            sameAsShipping.addEventListener('change', function() {
                const billingFields = document.querySelectorAll('.billing-field');
                billingFields.forEach(field => {
                    field.style.display = this.checked ? 'none' : 'block';
                });
            });
        }
    }
}