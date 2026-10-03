/**
 * Admin Module Logic (Dashboard, Add Product, Product Management, Order Status, Customer View)
 * E-Commerce College Major Project
 */

// Admin Credentials
const ADMIN_CREDENTIALS = {
    email: 'admin@shop.com',
    password: 'admin123'
};

// Admin Login Form Handler
function handleAdminLogin(event) {
    event.preventDefault();

    const email = document.getElementById('admin-email').value.trim().toLowerCase();
    const password = document.getElementById('admin-password').value;

    if (!email || !password) {
        showToast('Please enter admin credentials', 'error');
        return;
    }

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        saveAdminSession({
            email: email,
            role: 'administrator',
            loggedInAt: new Date().toISOString()
        });

        showToast('Admin authentication successful!', 'success');
        setTimeout(() => {
            window.location.href = getRelativePath('pages/admin/dashboard.html');
        }, 1000);
    } else {
        showToast('Invalid admin credentials', 'error');
    }
}

// Admin Logout
function handleAdminLogout() {
    removeAdminSession();
    showToast('Admin logged out', 'info');
    setTimeout(() => {
        window.location.href = getRelativePath('pages/admin/login.html');
    }, 800);
}

// Admin Route Guard
function checkAdminRouteProtection() {
    if (!isAdminLoggedIn()) {
        showToast('Admin access required', 'error');
        setTimeout(() => {
            window.location.href = getRelativePath('pages/admin/login.html');
        }, 800);
    }
}

// Admin Dashboard Init
function initAdminDashboard() {
    checkAdminRouteProtection();

    const products = getProducts();
    const customers = getUsers();
    const orders = getOrders();

    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // Update Statistics Cards
    const totalProdEl = document.getElementById('stat-total-products');
    const totalCustEl = document.getElementById('stat-total-customers');
    const totalOrdEl = document.getElementById('stat-total-orders');
    const totalRevEl = document.getElementById('stat-total-revenue');

    if (totalProdEl) totalProdEl.textContent = products.length;
    if (totalCustEl) totalCustEl.textContent = customers.length;
    if (totalOrdEl) totalOrdEl.textContent = orders.length;
    if (totalRevEl) totalRevEl.textContent = '$' + totalRevenue.toFixed(2);

    // Render Recent Orders Preview Table
    const recentOrdersContainer = document.getElementById('recent-orders-table-body');
    if (recentOrdersContainer) {
        const recentOrders = orders.slice(0, 5); // top 5
        if (recentOrders.length === 0) {
            recentOrdersContainer.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:2rem;">No orders placed yet</td></tr>';
        } else {
            recentOrdersContainer.innerHTML = recentOrders.map(order => `
                <tr>
                    <td><strong>#${order.orderId}</strong></td>
                    <td>${order.customerName}</td>
                    <td>$${order.totalAmount.toFixed(2)}</td>
                    <td><span class="status-badge ${order.status.toLowerCase()}">${order.status}</span></td>
                    <td>${order.orderDateFormatted}</td>
                </tr>
            `).join('');
        }
    }
}

// Admin Add Product Handler
function handleAddProduct(event) {
    event.preventDefault();
    checkAdminRouteProtection();

    const name = document.getElementById('prod-name').value.trim();
    const category = document.getElementById('prod-category').value;
    const price = parseFloat(document.getElementById('prod-price').value);
    const stock = parseInt(document.getElementById('prod-stock').value);
    const rating = parseFloat(document.getElementById('prod-rating').value) || 4.5;
    const image = document.getElementById('prod-image').value.trim();
    const description = document.getElementById('prod-description').value.trim();

    if (!name || !category || isNaN(price) || isNaN(stock) || !image || !description) {
        showToast('Please fill in all required product fields correctly', 'error');
        return;
    }

    if (price <= 0 || stock < 0) {
        showToast('Price must be greater than 0 and stock cannot be negative', 'error');
        return;
    }

    const products = getProducts();
    const newProduct = {
        id: 'prod_' + Date.now(),
        name,
        category,
        price,
        stock,
        rating,
        image,
        description,
        createdAt: new Date().toISOString()
    };

    products.unshift(newProduct);
    saveProducts(products);

    showToast(`Product "${name}" added successfully!`, 'success');
    setTimeout(() => {
        window.location.href = getRelativePath('pages/admin/products.html');
    }, 1200);
}

// Admin Products Table Init & Actions
function initAdminProducts() {
    checkAdminRouteProtection();
    renderAdminProductsTable();
}

function renderAdminProductsTable() {
    const tableBody = document.getElementById('admin-products-table-body');
    if (!tableBody) return;

    const products = getProducts();

    if (products.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem;">No products in catalog</td></tr>';
        return;
    }

    tableBody.innerHTML = products.map(prod => `
        <tr>
            <td><img src="${prod.image}" alt="${prod.name}" class="table-product-img" onerror="this.src='https://via.placeholder.com/50'"></td>
            <td><strong>${prod.name}</strong></td>
            <td><span class="product-category">${prod.category}</span></td>
            <td>$${prod.price.toFixed(2)}</td>
            <td>${prod.stock} items</td>
            <td><i class="fas fa-star" style="color:var(--accent);"></i> ${prod.rating}</td>
            <td>
                <button onclick="deleteProductHandler('${prod.id}')" class="btn btn-danger btn-sm" title="Delete Product">
                    <i class="fas fa-trash-alt"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

function deleteProductHandler(productId) {
    checkAdminRouteProtection();
    const products = getProducts();
    const prod = products.find(p => p.id === productId);

    if (!prod) return;

    if (confirm(`Are you sure you want to delete "${prod.name}"?`)) {
        const updatedProducts = products.filter(p => p.id !== productId);
        saveProducts(updatedProducts);
        showToast('Product deleted from inventory', 'info');
        renderAdminProductsTable();
    }
}

// Admin Orders Table Init & Status Change Handler
function initAdminOrders() {
    checkAdminRouteProtection();
    renderAdminOrdersTable();
}

function renderAdminOrdersTable() {
    const tableBody = document.getElementById('admin-orders-table-body');
    if (!tableBody) return;

    const orders = getOrders();

    if (orders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:2rem;">No customer orders placed yet</td></tr>';
        return;
    }

    tableBody.innerHTML = orders.map(order => `
        <tr>
            <td><strong>#${order.orderId}</strong></td>
            <td>
                <div><strong>${order.customerName}</strong></div>
                <div style="font-size:0.8rem; color:var(--text-muted);">${order.customerEmail} | ${order.customerPhone}</div>
            </td>
            <td style="max-width:200px; font-size:0.85rem;">${order.shippingAddress}</td>
            <td>${order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</td>
            <td><strong>$${order.totalAmount.toFixed(2)}</strong></td>
            <td>${order.paymentMethod}</td>
            <td>${order.orderDateFormatted}</td>
            <td>
                <select onchange="updateOrderStatus('${order.orderId}', this.value)" class="status-select">
                    <option value="Placed" ${order.status === 'Placed' ? 'selected' : ''}>Placed</option>
                    <option value="Confirmed" ${order.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                    <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
        </tr>
    `).join('');
}

function updateOrderStatus(orderId, newStatus) {
    checkAdminRouteProtection();
    const orders = getOrders();
    const order = orders.find(o => o.orderId === orderId);

    if (order) {
        order.status = newStatus;
        saveOrders(orders);
        showToast(`Order #${orderId} status updated to "${newStatus}"`, 'success');
        renderAdminOrdersTable();
    }
}

// Admin Customers View Init
function initAdminCustomers() {
    checkAdminRouteProtection();

    const tableBody = document.getElementById('admin-customers-table-body');
    if (!tableBody) return;

    const customers = getUsers();
    const orders = getOrders();

    if (customers.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:2rem;">No registered customers yet</td></tr>';
        return;
    }

    tableBody.innerHTML = customers.map(user => {
        const userOrderCount = orders.filter(o => o.userId === user.id || o.userEmail === user.email).length;
        const regDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';

        return `
            <tr>
                <td><strong>${user.name}</strong></td>
                <td>${user.email}</td>
                <td>${user.phone || 'N/A'}</td>
                <td>${regDate}</td>
                <td><strong style="color:var(--primary);">${userOrderCount} order(s)</strong></td>
            </tr>
        `;
    }).join('');
}
