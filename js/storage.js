/**
 * Storage & Data Management Service
 * E-Commerce College Major Project
 * 
 * Demonstrates frontend data persistence using browser localStorage.
 * NOTE: For demonstration purposes in a frontend project without a backend.
 * Production systems require backend APIs, databases, password hashing, and server authentication.
 */

const STORAGE_KEYS = {
    USERS: 'ecommerce_users',
    PRODUCTS: 'ecommerce_products',
    CART: 'ecommerce_cart',
    ORDERS: 'ecommerce_orders',
    CURRENT_USER: 'ecommerce_current_user',
    ADMIN_SESSION: 'ecommerce_admin_session'
};

// Initial Seed Products (12 items across 6 categories)
const INITIAL_PRODUCTS = [
    {
        id: 'prod_1',
        name: 'TechPro Wireless Headphones',
        description: 'Premium active noise-cancelling wireless headphones with 40-hour battery life, immersive soundstage, and ultra-comfortable memory foam ear cushions.',
        price: 199.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        stock: 15
    },
    {
        id: 'prod_2',
        name: 'UltraSlim Smart Watch Series 7',
        description: 'Advanced fitness and health tracker featuring AMOLED Retina display, heart rate monitor, sleep tracking, GPS, and water resistance up to 50m.',
        price: 249.00,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        rating: 4.6,
        stock: 20
    },
    {
        id: 'prod_3',
        name: '4K Ultra HD Action Camera',
        description: 'Rugged waterproof sports camera with 4K 60fps video recording, dual screens, image stabilization, and included accessory kit.',
        price: 129.50,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
        rating: 4.5,
        stock: 10
    },
    {
        id: 'prod_4',
        name: 'Classic Genuine Leather Biker Jacket',
        description: 'Timeless handcrafted motorcycle jacket made from 100% full-grain leather with heavy-duty YKK zippers and quilted inner lining.',
        price: 149.99,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
        rating: 4.7,
        stock: 12
    },
    {
        id: 'prod_5',
        name: 'Oversized Organic Cotton Hoodie',
        description: 'Ultra-soft heavyweight fleece hoodie crafted from 100% organic cotton. Features drop shoulder fit and subtle embroidered chest logo.',
        price: 59.99,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
        rating: 4.4,
        stock: 30
    },
    {
        id: 'prod_6',
        name: 'Modern Tailored Slim Fit Blazer',
        description: 'Elegant single-breasted blazer designed for casual and formal occasions. Breathable stretch wool blend for maximum agility and comfort.',
        price: 89.00,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&w=800&q=80',
        rating: 4.6,
        stock: 18
    },
    {
        id: 'prod_7',
        name: 'Pro Runner Cushion Sneakers',
        description: 'High-performance running shoes equipped with responsive foam midsoles, breathable mesh upper, and high-traction rubber outsoles.',
        price: 119.99,
        category: 'Shoes',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        stock: 25
    },
    {
        id: 'prod_8',
        name: 'Handcrafted Italian Leather Loafers',
        description: 'Sophisticated penny loafers crafted in Italy using polished calfskin leather with memory foam footbeds for day-long luxury comfort.',
        price: 139.50,
        category: 'Shoes',
        image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80',
        rating: 4.7,
        stock: 8
    },
    {
        id: 'prod_9',
        name: 'Minimalist Urban Canvas Backpack',
        description: 'Durable water-resistant canvas backpack with dedicated 15.6-inch laptop compartment, ergonomic padded shoulder straps, and anti-theft pocket.',
        price: 45.00,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        rating: 4.5,
        stock: 22
    },
    {
        id: 'prod_10',
        name: 'Polarized Aviator Sunglasses',
        description: 'Classic metal frame sunglasses featuring UV400 polarized lenses that reduce glare and deliver crystal-clear color contrast.',
        price: 35.00,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
        rating: 4.3,
        stock: 40
    },
    {
        id: 'prod_11',
        name: 'Nordic Minimalist Ceramic Lamp',
        description: 'Contemporary Scandinavian table lamp featuring hand-molded ceramic base, warm ambient dimmable LED lighting, and natural linen shade.',
        price: 65.00,
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        stock: 14
    },
    {
        id: 'prod_12',
        name: 'Organic Botanical Face Serum',
        description: 'Nourishing facial elixir infused with cold-pressed rosehip oil, vitamin C, and hyaluronic acid to rejuvenate skin radiance.',
        price: 29.99,
        category: 'Beauty',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        stock: 50
    }
];

// Initialize Storage on app startup
function initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
    }

    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }

    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    }

    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    }
}

// Data Getter and Setter Utility Functions

// USERS
function getUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
}

function saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

// PRODUCTS
function getProducts() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
}

function saveProducts(products) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
}

function getProductById(id) {
    const products = getProducts();
    return products.find(p => p.id === id) || null;
}

// CART
function getCart() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];
}

function saveCart(cart) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
}

function clearCart() {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
}

// ORDERS
function getOrders() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
}

function saveOrders(orders) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
}

// CURRENT USER SESSION
function getCurrentUser() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) || null;
}

function saveCurrentUser(user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}

function removeCurrentUser() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

function isUserLoggedIn() {
    return getCurrentUser() !== null;
}

// ADMIN SESSION
function getAdminSession() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION)) || null;
}

function saveAdminSession(adminData) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(adminData));
}

function removeAdminSession() {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
}

function isAdminLoggedIn() {
    return getAdminSession() !== null;
}

// Auto Initialize
initializeStorage();
