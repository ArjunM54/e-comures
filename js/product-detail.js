/**
 * Product Detail Page Logic
 * E-Commerce College Major Project
 */

let selectedQuantity = 1;
let currentDetailProduct = null;

function initProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        window.location.href = getRelativePath('index.html');
        return;
    }

    currentDetailProduct = getProductById(productId);

    if (!currentDetailProduct) {
        showToast('Product not found', 'error');
        setTimeout(() => {
            window.location.href = getRelativePath('index.html');
        }, 1500);
        return;
    }

    renderProductDetails(currentDetailProduct);
}

function renderProductDetails(product) {
    document.title = `${product.name} - ShopCraft`;

    const container = document.getElementById('product-detail-content');
    if (!container) return;

    let stockBadgeClass = 'in-stock';
    let stockStatusText = `In Stock (${product.stock} available)`;
    if (product.stock <= 0) {
        stockBadgeClass = 'out-stock';
        stockStatusText = 'Out of Stock';
    } else if (product.stock <= 5) {
        stockBadgeClass = 'low-stock';
        stockStatusText = `Low Stock (Only ${product.stock} left!)`;
    }

    container.innerHTML = `
        <a href="${getRelativePath('index.html')}" class="back-btn">
            <i class="fas fa-arrow-left"></i> Back to Products
        </a>
        <div class="product-detail-layout">
            <div class="product-detail-gallery">
                <div class="main-image-wrap">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/600x600?text=Product+Image'">
                </div>
            </div>
            <div class="product-detail-info">
                <span class="detail-category">${product.category}</span>
                <h1 class="detail-title">${product.name}</h1>
                <div class="detail-rating-row">
                    <div class="stars">${renderStars(product.rating)}</div>
                    <span style="font-weight:700;">${product.rating} / 5.0</span>
                    <span class="stock-tag ${stockBadgeClass}">
                        <i class="fas fa-box"></i> ${stockStatusText}
                    </span>
                </div>
                <div class="detail-price">$${product.price.toFixed(2)}</div>
                <p class="detail-description">${product.description}</p>
                
                ${product.stock > 0 ? `
                <div class="quantity-picker">
                    <label>Quantity:</label>
                    <div class="qty-control-box">
                        <button class="qty-btn" onclick="adjustQuantity(-1)"><i class="fas fa-minus"></i></button>
                        <input type="text" id="qty-input" class="qty-input" value="1" readonly>
                        <button class="qty-btn" onclick="adjustQuantity(1)"><i class="fas fa-plus"></i></button>
                    </div>
                </div>
                <div class="detail-actions-row">
                    <button onclick="handleAddToCartFromDetail()" class="btn btn-secondary">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button onclick="handleBuyNow()" class="btn btn-primary">
                        <i class="fas fa-bolt"></i> Buy Now
                    </button>
                </div>
                ` : `
                <div class="detail-actions-row">
                    <button disabled class="btn btn-secondary btn-block" style="opacity:0.6; cursor:not-allowed;">
                        Out of Stock
                    </button>
                </div>
                `}
            </div>
        </div>
    `;
}

function adjustQuantity(delta) {
    if (!currentDetailProduct) return;
    const input = document.getElementById('qty-input');
    let newQty = selectedQuantity + delta;

    if (newQty < 1) newQty = 1;
    if (newQty > currentDetailProduct.stock) {
        showToast(`Quantity cannot exceed available stock (${currentDetailProduct.stock})`, 'warning');
        newQty = currentDetailProduct.stock;
    }

    selectedQuantity = newQty;
    if (input) input.value = selectedQuantity;
}

function handleAddToCartFromDetail() {
    if (!currentDetailProduct) return;
    if (currentDetailProduct.stock <= 0) {
        showToast('Product is out of stock', 'error');
        return;
    }

    const cart = getCart();
    const existingItem = cart.find(item => item.id === currentDetailProduct.id);

    if (existingItem) {
        if (existingItem.quantity + selectedQuantity > currentDetailProduct.stock) {
            showToast(`Cannot add ${selectedQuantity} more. Exceeds stock limit (${currentDetailProduct.stock})`, 'warning');
            return;
        }
        existingItem.quantity += selectedQuantity;
    } else {
        cart.push({
            id: currentDetailProduct.id,
            name: currentDetailProduct.name,
            price: currentDetailProduct.price,
            image: currentDetailProduct.image,
            category: currentDetailProduct.category,
            quantity: selectedQuantity,
            stock: currentDetailProduct.stock
        });
    }

    saveCart(cart);
    updateCartBadge();
    showToast(`Added ${selectedQuantity} item(s) to cart!`, 'success');
}

function handleBuyNow() {
    if (!currentDetailProduct) return;
    handleAddToCartFromDetail();
    setTimeout(() => {
        window.location.href = getRelativePath('pages/cart.html');
    }, 500);
}

document.addEventListener('DOMContentLoaded', () => {
    initProductDetail();
});
