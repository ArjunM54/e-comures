/**
 * Payment & Order Creation Logic
 * E-Commerce College Major Project
 */

let checkoutData = null;

function initPaymentPage() {
    checkRouteProtection('user');

    const tempCheckout = sessionStorage.getItem('ecommerce_temp_checkout');
    const cart = getCart();

    if (!tempCheckout || cart.length === 0) {
        showToast('No active checkout session found', 'warning');
        setTimeout(() => {
            window.location.href = getRelativePath('pages/checkout.html');
        }, 1000);
        return;
    }

    checkoutData = JSON.parse(tempCheckout);
    renderPaymentDetails(checkoutData, cart);
}

function renderPaymentDetails(shippingInfo, cart) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 15.00;
    const total = subtotal + shipping;

    const infoBox = document.getElementById('customer-info-box');
    const summaryBox = document.getElementById('payment-summary-box');

    if (infoBox) {
        infoBox.innerHTML = `
            <p><strong>Name:</strong> ${shippingInfo.name}</p>
            <p><strong>Email:</strong> ${shippingInfo.email}</p>
            <p><strong>Phone:</strong> ${shippingInfo.phone}</p>
            <p><strong>Delivery Address:</strong> ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.pincode}</p>
        `;
    }

    if (summaryBox) {
        summaryBox.innerHTML = `
            <div class="summary-line">
                <span>Items Subtotal</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-line">
                <span>Shipping Fee</span>
                <span>${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span>
            </div>
            <div class="summary-line total">
                <span>Total Payable</span>
                <span>$${total.toFixed(2)}</span>
            </div>
        `;
    }
}

function handlePlaceOrder() {
    const user = getCurrentUser();
    const cart = getCart();

    if (!checkoutData || cart.length === 0 || !user) {
        showToast('Failed to process order. Invalid order state.', 'error');
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 15.00;
    const totalAmount = subtotal + shipping;

    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const orderDate = new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });

    const newOrder = {
        orderId: orderId,
        userId: user.id,
        userEmail: user.email,
        customerName: checkoutData.name,
        customerEmail: checkoutData.email,
        customerPhone: checkoutData.phone,
        shippingAddress: `${checkoutData.address}, ${checkoutData.city}, ${checkoutData.state} - ${checkoutData.pincode}`,
        items: cart,
        subtotal: subtotal,
        shippingFee: shipping,
        totalAmount: totalAmount,
        paymentMethod: 'Cash on Delivery (COD)',
        status: 'Placed',
        createdAt: new Date().toISOString(),
        orderDateFormatted: orderDate
    };

    // Save to Orders
    const orders = getOrders();
    orders.unshift(newOrder);
    saveOrders(orders);

    // Deduct Product Stock Counts
    const products = getProducts();
    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        if (product) {
            product.stock = Math.max(0, product.stock - cartItem.quantity);
        }
    });
    saveProducts(products);

    // Clear Cart & Temporary Data
    clearCart();
    sessionStorage.removeItem('ecommerce_temp_checkout');

    showToast('Order placed successfully!', 'success');
    setTimeout(() => {
        window.location.href = `${getRelativePath('pages/order-success.html')}?id=${orderId}`;
    }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    initPaymentPage();
});
