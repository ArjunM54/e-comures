# ShopCraft - E-Commerce Website (Major College Web Project)

A complete, fully responsive, feature-rich E-Commerce web application built strictly using **HTML5**, **CSS3**, and **Vanilla JavaScript**. 

This application operates with a client-side data persistence layer powered by `localStorage`, enabling full store functionality (authentication, cart management, checkout, order placement, and administration) without requiring a backend database server.

---

## 🌟 Technologies Used
- **HTML5**: Semantic markup, accessible forms, meta tags.
- **CSS3**: Custom CSS design system, CSS Flexbox & Grid, CSS animation Keyframes, Responsive Media Queries, HSL color system, custom scrollbars. (Zero frontend frameworks used).
- **Vanilla JavaScript (ES6+)**: Dynamic DOM manipulation, modular architecture, event handling, data persistence using `localStorage`, state management.
- **Icons & Typography**: Font Awesome 6.5 CDN, Google Fonts (`Outfit` & `Plus Jakarta Sans`).

---

## 🔑 Demo Credentials

### Admin Module Credentials:
- **Email:** `admin@shop.com`
- **Password:** `admin123`

### User Module Credentials:
- Register any new account via the **Registration Page** or use any registered email.

---

## 🚀 Key Features & Functional Modules

### 1. USER MODULE
* **Registration & Validation:**
  - Full Name, Email, Phone Number, Password, and Password Confirmation.
  - Client-side validation (phone regex, password matching, min length).
  - Duplicate email check against stored `users`.
* **Authentication & Session:**
  - Email/Password login verification.
  - Persistent user session stored in `localStorage` (`ecommerce_current_user`).
  - Route guards restricting unauthenticated access to checkout, orders, and profile.
* **User Dashboard / Storefront (`index.html` & `pages/dashboard.html`):**
  - Dynamic display of product catalog.
  - Live search bar filtering by name and description.
  - Category filter pills (All, Electronics, Fashion, Shoes, Accessories, Home, Beauty).
  - Sorting options (Price: Low to High, Price: High to Low, Rating).
  - Add to Cart directly from product cards.
  - Interactive rating star system.
* **Product Detail Page (`pages/product.html?id=...`):**
  - High-res product images and detailed specifications.
  - Stock availability tags (In Stock, Low Stock, Out of Stock).
  - Quantity picker (`-` / `+`) with stock cap enforcement.
  - "Add to Cart" and immediate "Buy Now" options.
* **Shopping Cart (`pages/cart.html`):**
  - Quantity controls dynamically updating subtotal and grand total.
  - Stock limits protection preventing over-ordering.
  - Item removal & Clear Cart features.
  - Dynamic Free Shipping calculation ($100 threshold).
* **Checkout & Shipping (`pages/checkout.html`):**
  - Contact and delivery address form (Name, Email, Phone, Address, City, State, Pincode).
  - Prefilled values for logged-in users.
  - Itemized order preview.
* **Payment (`pages/payment.html`):**
  - Cash on Delivery (COD) payment method.
  - Complete order review before placement.
  - Unique Order ID generation (`ORD-XXXXXX`).
  - Automatic inventory stock updates upon order completion.
* **Order Success (`pages/order-success.html`):**
  - Animated order completion notice.
  - Full order summary receipt with COD payment notification.
* **My Orders (`pages/my-orders.html`):**
  - View historical orders filtered strictly for the currently logged-in user.
  - Real-time order status tracking badges (`Placed`, `Confirmed`, `Shipped`, `Delivered`, `Cancelled`).
* **User Profile (`pages/profile.html`):**
  - Profile statistics & total order count.
  - Secure session logout.

---

### 2. ADMIN MODULE
* **Admin Login (`pages/admin/login.html`):**
  - Restricted login separate from user login.
  - Auth protection preventing unauthorized normal users from accessing admin routes.
* **Admin Dashboard (`pages/admin/dashboard.html`):**
  - Key Performance Indicators (KPIs): Total Products, Total Customers, Total Orders, Total Revenue.
  - Recent orders preview table.
* **Add Product Page (`pages/admin/add-product.html`):**
  - Form to input Name, Category, Price, Stock Quantity, Rating, Image URL, and Description.
  - Immediately pushes product to `localStorage` catalog, making it live on the storefront instantly.
* **Products Management (`pages/admin/products.html`):**
  - View full product catalog table with stock status & ratings.
  - Delete product with modal confirmation dialog.
* **Orders Management (`pages/admin/orders.html`):**
  - View all customer orders across the platform.
  - Live Status Selector (`Placed` ➔ `Confirmed` ➔ `Shipped` ➔ `Delivered` ➔ `Cancelled`).
  - Changes instantly update in the respective user's "My Orders" view.
* **Customers View (`pages/admin/customers.html`):**
  - View registered customer database, registration timestamps, and order counts.
  - Passwords are securely omitted from display.

---

## 📁 Project Structure

```
web project/
│
├── index.html                  # Main Storefront & Product Catalog
├── README.md                   # Complete Documentation
│
├── pages/                      # User & Admin HTML Modules
│   ├── login.html              # Customer Login
│   ├── register.html           # Customer Registration
│   ├── dashboard.html          # User Dashboard Store View
│   ├── product.html            # Product Details View
│   ├── cart.html               # Shopping Cart View
│   ├── checkout.html           # Address & Delivery Form
│   ├── payment.html            # Payment (Cash on Delivery)
│   ├── order-success.html      # Order Confirmation
│   ├── my-orders.html          # User Order History
│   ├── profile.html            # User Profile & Stats
│   │
│   └── admin/                  # Admin Module Pages
│       ├── login.html          # Admin Login
│       ├── dashboard.html      # Admin Analytics Dashboard
│       ├── add-product.html    # Add Inventory Item
│       ├── products.html       # Inventory List & Deletion
│       ├── orders.html         # Manage Orders & Update Statuses
│       └── customers.html      # Registered Customers List
│
├── css/                        # Custom CSS Stylesheets
│   ├── style.css               # Global Theme, Variables & Layout
│   ├── auth.css                # Login & Register Forms
│   ├── dashboard.css           # Catalog Grid & Product Cards
│   ├── product.css             # Product Detail Layout
│   ├── cart.css                # Cart Tables & Summary Cards
│   ├── checkout.css            # Checkout & Success Styles
│   └── admin.css               # Admin Layout, Sidebar & Tables
│
└── js/                         # Vanilla JavaScript Modules
    ├── storage.js              # Data Layer & LocalStorage CRUD
    ├── main.js                 # Global Navigation, Toasts & Header
    ├── auth.js                 # Authentication & Route Protection Guards
    ├── products.js             # Catalog Rendering, Search & Filters
    ├── product-detail.js       # Product Detail View Logic
    ├── cart.js                 # Cart Management Logic
    ├── checkout.js             # Checkout Form Handlers
    ├── payment.js              # Payment Processing & Inventory Deduction
    ├── orders.js               # Order History & Receipt Rendering
    ├── user.js                 # User Profile Logic
    └── admin.js                # Admin Dashboard Stats & Order Management
```

---

## 💾 How LocalStorage is Utilized

All application state is persisted across browser sessions using key-value pairs in `localStorage`:

| LocalStorage Key | Data Stored | Description |
| :--- | :--- | :--- |
| `ecommerce_users` | `Array<User>` | Array of user objects containing names, emails, phones, passwords, registration dates. |
| `ecommerce_products` | `Array<Product>` | Array of product objects containing id, name, price, stock, category, rating, image, description. |
| `ecommerce_cart` | `Array<CartItem>` | Selected cart items with quantity caps linked to available stock. |
| `ecommerce_orders` | `Array<Order>` | Full record of completed orders with customer info, items, totals, order status. |
| `ecommerce_current_user` | `UserSession` | Active logged-in user object. |
| `ecommerce_admin_session` | `AdminSession` | Active administrator session flag. |

---

## ⚙️ How to Run the Project

1. Clone or download the project files to your local directory.
2. Open `index.html` directly in any standard Web Browser (Google Chrome, Microsoft Edge, Firefox, Safari).
3. Alternatively, launch with Live Server (VS Code Extension) or run an HTTP dev server:
   ```bash
   npx serve .
   ```
4. On first launch, `js/storage.js` automatically populates:
   - 12 sample products across 6 categories.
   - Demo Admin Account (`admin@shop.com` / `admin123`).

---

## 🛡️ Educational Project Disclaimer & Security Note

> **Note for Evaluation:**  
> This project is designed as a **Frontend College Major Web Project**.  
> Authentication and data storage rely on browser `localStorage` to simulate full stack behavior without needing Node.js/Python backend setup or SQL/NoSQL databases.  
> 
> **In a Production Application:**
> 1. Passwords would be hashed on the server using **Bcrypt** or **Argon2**.
> 2. Data persistence would use a database (e.g., PostgreSQL, MongoDB, MySQL).
> 3. User authentication would issue **JWT tokens** or HTTP-only cookies.
> 4. Payment processing would integrate with gateways like Stripe or Razorpay.
