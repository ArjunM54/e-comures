/**
 * Product Catalog & Filtering Logic
 * E-Commerce College Major Project
 */

let currentProducts = [];
let activeCategory = 'All';
let searchQuery = '';
let currentSort = 'default';

// Load and Render Products
function initCatalog() {
    currentProducts = getProducts();
    renderCategories();
    applyFiltersAndRender();

    // Event listeners
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const categorySelect = document.getElementById('category-select');
    const clearBtn = document.getElementById('clear-filters-btn');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            applyFiltersAndRender();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            applyFiltersAndRender();
        });
    }

    if (categorySelect) {
        categorySelect.addEventListener('change', (e) => {
            activeCategory = e.target.value;
            updateActiveCategoryPill(activeCategory);
            applyFiltersAndRender();
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', clearFilters);
    }
}

// Render Category Filter Pills
function renderCategories() {
    const pillsContainer = document.getElementById('category-pills');
    if (!pillsContainer) return;

    const categories = ['All', 'Electronics', 'Fashion', 'Shoes', 'Accessories', 'Home', 'Beauty'];
    pillsContainer.innerHTML = categories.map(cat => `
        <button class="category-pill ${cat === activeCategory ? 'active' : ''}" 
                onclick="setCategoryFilter('${cat}')">
            ${cat}
        </button>
    `).join('');
}

function updateActiveCategoryPill(catName) {
    const pills = document.querySelectorAll('.category-pill');
    pills.forEach(pill => {
        if (pill.textContent.trim() === catName) {
            pill.classList.add('active');
        } else {
            pill.classList.remove('active');
        }
    });
}

function setCategoryFilter(catName) {
    activeCategory = catName;
    const categorySelect = document.getElementById('category-select');
    if (categorySelect) categorySelect.value = catName;
    updateActiveCategoryPill(catName);
    applyFiltersAndRender();
}

// Filter, Sort and Render Product Cards Grid
function applyFiltersAndRender() {
    let filtered = [...currentProducts];

    // Filter by Category
    if (activeCategory !== 'All') {
        filtered = filtered.filter(p => p.category === activeCategory);
    }

    // Filter by Search Query
    if (searchQuery) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery) || p.description.toLowerCase().includes(searchQuery));
    }

    // Sort Products
    if (currentSort === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
    }

    const grid = document.getElementById('products-grid');
    if (!grid) return;

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No Products Found</h3>
                <p>We couldn't find any products matching your search or filter criteria.</p>
                <button onclick="clearFilters()" class="btn btn-outline">Clear All Filters</button>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(product => `
        <div class="product-card">
            <div class="product-image-wrap">
                <span class="product-badge">${product.category}</span>
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x300?text=Product+Image'">
            </div>
            <div class="product-details">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title" title="${product.name}">${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">${renderStars(product.rating)}</div>
                    <span>(${product.rating})</span>
                </div>
                <div class="product-price-row">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <div class="card-actions">
                        <a href="${getRelativePath('pages/product.html')}?id=${product.id}" class="btn btn-secondary btn-sm" title="View Details">
                            <i class="fas fa-eye"></i>
                        </a>
                        <button onclick="addToCartHandler('${product.id}')" class="btn btn-primary btn-sm" title="Add to Cart">
                            <i class="fas fa-shopping-cart"></i> Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Clear All Filters
function clearFilters() {
    activeCategory = 'All';
    searchQuery = '';
    currentSort = 'default';

    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const categorySelect = document.getElementById('category-select');

    if (searchInput) searchInput.value = '';
    if (sortSelect) sortSelect.value = 'default';
    if (categorySelect) categorySelect.value = 'All';

    updateActiveCategoryPill('All');
    applyFiltersAndRender();
}

// Render Star Icons
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    let starsHtml = '';

    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }
    if (hasHalf) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
    }
    return starsHtml;
}

// Add to Cart Action from Grid Card
function addToCartHandler(productId) {
    const product = getProductById(productId);
    if (!product) return;

    if (product.stock <= 0) {
        showToast('Sorry, this product is currently out of stock', 'error');
        return;
    }

    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        if (existingItem.quantity >= product.stock) {
            showToast(`Cannot add more. Max stock limit reached (${product.stock})`, 'warning');
            return;
        }
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity: 1,
            stock: product.stock
        });
    }

    saveCart(cart);
    updateCartBadge();
    showToast(`Added "${product.name}" to cart!`, 'success');
}
