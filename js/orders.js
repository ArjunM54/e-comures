/**
 * Order Success & My Orders Logic
 * E-Commerce College Major Project
 */

// Order Success Page Init
function initOrderSuccessPage() {
    checkRouteProtection('user');

    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');

    if (!orderId) {
        window.location.href = getRelativePath('index.html');
        return;
    }

    const orders = getOrders();
    const order = orders.find(o => o.orderId === orderId);

    if (!order) {
        showToast('Order not found', 'error');
        setTimeout(() => {
            window.location.href = getRelativePath('index.html');
        }, 1500);
        return;
    }

    const container = document.getElementById('order-receipt-content');
    if (container) {
        container.innerHTML = `
            <div class="receipt-row">
                <span>Order ID:</span>
                <strong>${order.orderId}</strong>
            </div>
            <div class="receipt-row">
                <span>Date:</span>
                <span>${order.orderDateFormatted}</span>
            </div>
            <div class="receipt-row">
                <span>Total Amount:</span>
                <strong style="color:var(--primary);">$${order.totalAmount.toFixed(2)}</strong>
            </div>
            <div class="receipt-row">
                <span>Payment Method:</span>
                <span>${order.paymentMethod}</span>
            </div>
            <div class="receipt-row">
                <span>Deliver To:</span>
                <span>${order.customerName} (${order.customerPhone})</span>
            </div>
        `;
    }
}

// My Orders Page Init
function initMyOrdersPage() {
    checkRouteProtection('user');

    const user = getCurrentUser();
    if (!user) return;

    const allOrders = getOrders();
    // Filter orders belonging strictly to currently logged in user
    const userOrders = allOrders.filter(o => o.userId === user.id || o.userEmail === user.email);

    const container = document.getElementById('my-orders-container');
    if (!container) return;

    if (userOrders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>No Orders Yet</h3>
                <p>You haven't placed any orders with us so far.</p>
                <a href="${getRelativePath('index.html')}" class="btn btn-primary">Start Shopping</a>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="orders-list">
            ${userOrders.map(order => `
                <div class="order-card">
                    <div class="order-card-header">
                        <div class="order-meta">
                            <h3>Order #${order.orderId}</h3>
                            <span>Placed on ${order.orderDateFormatted}</span>
                        </div>
                        <span class="status-badge ${order.status.toLowerCase()}">${order.status}</span>
                    </div>
                    <div class="order-card-body">
                        ${order.items.map(item => `
                            <div class="order-item-mini">
                                <div style="display:flex; align-items:center; gap:1rem;">
                                    <img src="${item.image}" alt="${item.name}" style="width:45px; height:45px; border-radius:6px; object-fit:cover;" onerror="this.src='https://via.placeholder.com/50'">
                                    <div>
                                        <strong>${item.name}</strong>
                                        <div style="font-size:0.8rem; color:var(--text-muted);">Qty: ${item.quantity} × $${item.price.toFixed(2)}</div>
                                    </div>
                                </div>
                                <span style="font-weight:700;">$${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="order-card-footer">
                        <div>
                            <span style="font-size:0.85rem; color:var(--text-muted);">Payment:</span>
                            <strong style="font-size:0.9rem;">${order.paymentMethod}</strong>
                        </div>
                        <div>
                            <span style="font-size:0.9rem; margin-right:0.5rem;">Total Paid:</span>
                            <strong style="font-family:'Outfit',sans-serif; font-size:1.3rem; color:var(--primary);">$${order.totalAmount.toFixed(2)}</strong>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}
