/**
 * Checkout Form & Order Summary Logic
 * E-Commerce College Major Project
 */

function initCheckoutPage() {
    checkRouteProtection('user');

    const cart = getCart();
    if (cart.length === 0) {
        showToast('Your cart is empty', 'warning');
        setTimeout(() => {
            window.location.href = getRelativePath('index.html');
        }, 1000);
        return;
    }

    prefillCustomerInfo();
    renderCheckoutSummary();
}

function prefillCustomerInfo() {
    const user = getCurrentUser();
    if (!user) return;

    const nameInput = document.getElementById('checkout-name');
    const emailInput = document.getElementById('checkout-email');
    const phoneInput = document.getElementById('checkout-phone');

    if (nameInput) nameInput.value = user.name || '';
    if (emailInput) emailInput.value = user.email || '';
    if (phoneInput) phoneInput.value = user.phone || '';
}

function renderCheckoutSummary() {
    const summaryContainer = document.getElementById('checkout-summary');
    if (!summaryContainer) return;

    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 15.00;
    const total = subtotal + shipping;

    summaryContainer.innerHTML = `
        <h3 class="summary-title"><i class="fas fa-shopping-bag"></i> Order Summary</h3>
        <div style="max-height: 240px; overflow-y: auto; margin-bottom: 1.25rem;">
            ${cart.map(item => `
                <div class="order-item-mini">
                    <div>
                        <strong>${item.name}</strong>
                        <div style="font-size:0.8rem; color:var(--text-muted);">${item.quantity} x $${item.price.toFixed(2)}</div>
                    </div>
                    <span style="font-weight:700;">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('')}
        </div>
        <div class="summary-line">
            <span>Subtotal</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-line">
            <span>Shipping</span>
            <span>${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span>
        </div>
        <div class="summary-line total">
            <span>Total to Pay</span>
            <span>$${total.toFixed(2)}</span>
        </div>
    `;
}

function handleCheckoutSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('checkout-name').value.trim();
    const email = document.getElementById('checkout-email').value.trim();
    const phone = document.getElementById('checkout-phone').value.trim();
    const address = document.getElementById('checkout-address').value.trim();
    const city = document.getElementById('checkout-city').value.trim();
    const state = document.getElementById('checkout-state').value.trim();
    const pincode = document.getElementById('checkout-pincode').value.trim();

    if (!name || !email || !phone || !address || !city || !state || !pincode) {
        showToast('Please complete all delivery information fields', 'error');
        return;
    }

    const checkoutDetails = {
        name,
        email,
        phone,
        address,
        city,
        state,
        pincode
    };

    // Store temporary checkout data in sessionStorage for payment page
    sessionStorage.setItem('ecommerce_temp_checkout', JSON.stringify(checkoutDetails));
    
    // Redirect to Payment page
    window.location.href = getRelativePath('pages/payment.html');
}

document.addEventListener('DOMContentLoaded', () => {
    initCheckoutPage();
});
