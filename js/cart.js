/**
 * Shopping Cart Logic
 * E-Commerce College Major Project
 */

function initCartPage() {
    renderCart();
}

function renderCart() {
    const cartContainer = document.getElementById('cart-page-content');
    if (!cartContainer) return;

    const cart = getCart();

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-state" style="margin: 3rem 0;">
                <i class="fas fa-shopping-basket"></i>
                <h3>Your Cart is Empty</h3>
                <p>Looks like you haven't added any items to your shopping cart yet.</p>
                <a href="${getRelativePath('index.html')}" class="btn btn-primary">
                    <i class="fas fa-arrow-left"></i> Continue Shopping
                </a>
            </div>
        `;
        updateCartBadge();
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 15.00;
    const total = subtotal + shipping;

    cartContainer.innerHTML = `
        <div class="cart-layout">
            <div class="cart-items-container">
                <div class="cart-table-header">
                    <div>Product Details</div>
                    <div>Price</div>
                    <div>Quantity</div>
                    <div>Subtotal</div>
                    <div></div>
                </div>
                <div class="cart-items-list">
                    ${cart.map(item => `
                        <div class="cart-item-row">
                            <div class="cart-item-product">
                                <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://via.placeholder.com/100?text=Product'">
                                <div>
                                    <div class="cart-item-title">${item.name}</div>
                                    <div class="cart-item-category">${item.category}</div>
                                </div>
                            </div>
                            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                            <div>
                                <div class="qty-control-box" style="scale:0.9; transform-origin:left;">
                                    <button class="qty-btn" onclick="updateCartItemQty('${item.id}', -1)"><i class="fas fa-minus"></i></button>
                                    <input type="text" class="qty-input" value="${item.quantity}" readonly>
                                    <button class="qty-btn" onclick="updateCartItemQty('${item.id}', 1)"><i class="fas fa-plus"></i></button>
                                </div>
                            </div>
                            <div class="cart-item-subtotal">$${(item.price * item.quantity).toFixed(2)}</div>
                            <div>
                                <button onclick="removeCartItem('${item.id}')" class="remove-btn" title="Remove item">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="cart-actions-footer">
                    <a href="${getRelativePath('index.html')}" class="btn btn-secondary btn-sm">
                        <i class="fas fa-arrow-left"></i> Continue Shopping
                    </a>
                    <button onclick="handleClearCart()" class="btn btn-outline btn-sm" style="color:var(--danger); border-color:var(--danger);">
                        <i class="fas fa-trash"></i> Clear Cart
                    </button>
                </div>
            </div>
            
            <div class="cart-summary-card">
                <h3 class="summary-title">Order Summary</h3>
                <div class="summary-line">
                    <span>Subtotal (${cart.reduce((a,b)=>a+b.quantity,0)} items)</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="summary-line">
                    <span>Shipping</span>
                    <span>${shipping === 0 ? '<strong style="color:var(--success);">FREE</strong>' : '$' + shipping.toFixed(2)}</span>
                </div>
                ${subtotal <= 100 ? `<p style="font-size:0.8rem; color:var(--text-muted); margin-top:-0.5rem; margin-bottom:1rem;">Add $${(100 - subtotal).toFixed(2)} more for FREE Shipping!</p>` : ''}
                <div class="summary-line total">
                    <span>Total Amount</span>
                    <span>$${total.toFixed(2)}</span>
                </div>
                <button onclick="proceedToCheckout()" class="btn btn-primary btn-block" style="margin-top:1.5rem;">
                    Proceed to Checkout <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `;

    updateCartBadge();
}

function updateCartItemQty(productId, delta) {
    const cart = getCart();
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    const product = getProductById(productId);
    const maxStock = product ? product.stock : item.stock;

    let newQty = item.quantity + delta;

    if (newQty < 1) {
        removeCartItem(productId);
        return;
    }

    if (newQty > maxStock) {
        showToast(`Cannot increase quantity. Available stock limit is ${maxStock}`, 'warning');
        return;
    }

    item.quantity = newQty;
    saveCart(cart);
    renderCart();
}

function removeCartItem(productId) {
    let cart = getCart();
    cart = cart.filter(i => i.id !== productId);
    saveCart(cart);
    showToast('Item removed from cart', 'info');
    renderCart();
}

function handleClearCart() {
    if (confirm('Are you sure you want to clear your shopping cart?')) {
        clearCart();
        showToast('Cart cleared', 'info');
        renderCart();
    }
}

function proceedToCheckout() {
    const cart = getCart();
    if (cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }

    if (!isUserLoggedIn()) {
        showToast('Please log in or create an account to proceed to checkout', 'warning');
        setTimeout(() => {
            window.location.href = getRelativePath('pages/login.html');
        }, 1200);
        return;
    }

    window.location.href = getRelativePath('pages/checkout.html');
}

document.addEventListener('DOMContentLoaded', () => {
    initCartPage();
});
