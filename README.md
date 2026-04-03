# PerfumeHub - MERN Ecommerce Platform

## Project Overview

**PerfumeHub** is a full-featured ecommerce platform built with the MERN stack (MongoDB replaced with PostgreSQL), specializing in perfume sales. This project is designed as a complete learning implementation covering frontend, backend, database management, authentication, and business logic for an online perfume store.

**Status**: Lab Phase Checkpoint - Solo Developer Project  
**Date**: April 2026  
**Product Category**: Perfumes

---

## 🎯 Project Objective

Build an end-to-end ecommerce platform where users can:
- Browse and search for perfumes
- Create accounts with OAuth authentication
- Add items to cart and wishlist
- Checkout with Cash on Delivery (COD) payment method
- Track orders and view order history
- Submit product reviews and ratings
- Admin dashboard for store management

---

## 🛠️ Tech Stack

### Frontend
- **React 18+** - UI library with functional components and hooks
- **React Router v6** - Client-side routing
- **Tailwind CSS or Material-UI** - Responsive styling
- **Context API** - State management
- **Axios** - HTTP client for API calls

### Backend
- **Node.js + Express.js** - REST API server
- **Passport.js** - OAuth authentication (Google & GitHub)
- **JWT** - Token-based authentication
- **PostgreSQL** - Relational database (local instance)

### Development Tools
- **Git** - Version control
- **npm/yarn** - Package management
- **Jest & React Testing Library** - Testing (Phase 15)
- **Postman** - API testing

---

## ✨ Core Features

### 1. **Product Catalog** (Phase 4)
- Browse perfumes with filtering (by brand, price range, scent type)
- Search functionality
- Product detail pages with images, descriptions, specifications
- Pagination support
- Inventory/stock display

### 2. **User Authentication** (Phase 3)
- OAuth login (Google & GitHub)
- User profile management
- JWT token-based session management
- Protected routes and endpoints

### 3. **Shopping Cart** (Phase 5)
- Add/remove products from cart
- Update quantity
- Cart persistence across page reloads
- Stock validation before adding to cart

### 4. **Checkout & Orders** (Phase 6)
- Checkout form for shipping & billing information
- Cash on Delivery (COD) payment method
- Order confirmation with order ID and delivery details
- Order tracking with status updates (pending payment → processing → shipped → delivered)

### 5. **Order Management** (Phase 12)
- User order history page
- Order detail view with items and status
- Admin order management dashboard
- Admin ability to mark orders as paid

### 6. **Reviews & Ratings** (Phase 7, 13)
- Submit reviews with 1-5 star ratings
- View product reviews
- Average rating calculation per product
- User review history page

### 7. **Wishlist** (Phase 5, 12)
- Add/remove products from wishlist
- View wishlist
- Move items from wishlist to cart
- Wishlist persistence

### 8. **Admin Dashboard** (Phase 14)
- Product management (add, edit, delete perfumes)
- Order management (view all orders, update status, mark as paid)
- User management (view registered users)
- Sales analytics and statistics

---

## 📁 Project Structure

```
perfume-ecommerce/
├── client/                          (React Frontend)
│   ├── src/
│   │   ├── components/              (Reusable UI components)
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── Cart.jsx
│   │   │   └── ...
│   │   ├── pages/                   (Page components)
│   │   │   ├── Home.jsx
│   │   │   ├── ProductList.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderHistory.jsx
│   │   │   ├── Wishlist.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── ...
│   │   ├── context/                 (Context API for state)
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   └── UserContext.jsx
│   │   ├── hooks/                   (Custom React hooks)
│   │   │   ├── useAuth.js
│   │   │   ├── useCart.js
│   │   │   └── ...
│   │   ├── services/                (API service calls)
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   ├── cartService.js
│   │   │   ├── orderService.js
│   │   │   └── reviewService.js
│   │   ├── styles/                  (CSS/Tailwind styles)
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── .env.example                 (Environment variables template)
│   ├── package.json
│   └── README.md
│
├── server/                          (Express Backend)
│   ├── models/                      (Database models)
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── OrderItem.js
│   │   ├── Review.js
│   │   ├── Category.js
│   │   └── Wishlist.js
│   ├── controllers/                 (Request handlers)
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── reviewController.js
│   │   ├── userController.js
│   │   └── adminController.js
│   ├── routes/                      (API endpoints)
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   ├── reviews.js
│   │   ├── users.js
│   │   └── admin.js
│   ├── middleware/                  (Authentication, validation)
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── config/                      (Configuration files)
│   │   ├── database.js              (PostgreSQL connection)
│   │   ├── passport.js              (OAuth configuration)
│   │   └── constants.js
│   ├── migrations/                  (Database schema migrations)
│   │   └── init.sql                 (Initial schema setup)
│   ├── .env.example                 (Environment variables template)
│   ├── server.js                    (Entry point)
│   ├── package.json
│   └── README.md
│
├── .gitignore
├── .github/                         (GitHub-related files)
│   └── workflows/                   (CI/CD pipelines - optional)
├── README.md                        (Main README)
└── PLANNING.md                      (Detailed planning document)
```

---

## 🗄️ Database Schema (PostgreSQL)

### Tables Overview

| Table | Purpose |
|-------|---------|
| `users` | Store user account information and OAuth details |
| `products` | Catalog of perfume products |
| `categories` | Perfume categories (e.g., "Floral", "Woody", "Fresh") |
| `cart` | User shopping cart items |
| `orders` | Purchase orders with COD payment tracking |
| `order_items` | Items within each order |
| `reviews` | Product reviews and ratings |
| `wishlist` | User wishlist items |

### Key Fields

**users**
- id, email, name, avatar_url, oauth_provider, is_admin, created_at

**products**
- id, name, description, price, stock, category_id, image_url, brand, volume, fragrance_type, created_at

**orders**
- id, user_id, total_price, status (pending_payment/processing/shipped/delivered), shipping_address, billing_address, created_at

**reviews**
- id, product_id, user_id, rating (1-5), comment, created_at

---

## 📋 Implementation Plan (16 Phases)

### Phase 1: Project Initialization & Setup
- Initialize monorepo with `client/` and `server/` folders
- Setup npm packages and dependencies
- Configure environment files (.env)
- Initialize git repository

### Phase 2: Database Design & Backend Foundation
- Design PostgreSQL schema (see above)
- Create database and run migrations
- Setup backend folder structure
- Implement authentication middleware

### Phase 3: Authentication & User Management
- Implement OAuth (Google/GitHub) with Passport.js
- Create login/registration endpoints
- Generate and validate JWT tokens
- User profile endpoints

### Phase 4: Product Management (Backend)
- Create product CRUD endpoints
- Implement filtering and search
- Add pagination
- Setup admin product management

### Phase 5: Shopping Cart & Wishlist (Backend)
- Cart endpoints (add, remove, update quantity)
- Wishlist endpoints
- Stock validation
- Cart persistence

### Phase 6: Orders & Checkout (Backend)
- Order creation endpoint (COD method)
- Order status tracking
- Order history endpoints
- Admin mark-as-paid functionality

### Phase 7: Reviews & Ratings (Backend)
- Review submission endpoint
- Review retrieval
- Average rating calculation

### Phase 8: Frontend - Layout & Navigation
- Setup React Router
- Create header, footer, navbar components
- Implement Context API for state
- Setup responsive design (Tailwind/Material-UI)

### Phase 9: Frontend - Product Pages
- Product listing with filters
- Product detail page
- Search functionality
- Image gallery

### Phase 10: Frontend - Authentication & Profile
- OAuth login page
- User profile page
- Protected routes
- Logout functionality

### Phase 11: Frontend - Shopping Cart & Checkout
- Shopping cart page
- Checkout form with shipping/billing
- Order confirmation view
- COD payment instruction display

### Phase 12: Frontend - Order & Wishlist Management
- Order history page
- Order detail view
- Wishlist page
- Move to cart from wishlist

### Phase 13: Frontend - Reviews & Ratings
- Review submission form
- Review display
- User reviews page
- Ratings display

### Phase 14: Admin Dashboard
- Admin-only routes
- Product management interface
- Order management interface
- User management interface
- Sales analytics

### Phase 15: Testing & Optimization
- Unit tests with Jest
- React component tests
- API tests with Supertest
- Performance optimization
- Security review

### Phase 16: Deployment & Final Setup
- Production builds
- Deploy frontend (Vercel)
- Deploy backend (Heroku/Railway/AWS)
- Setup cloud database (PostgreSQL)
- Domain and SSL configuration

---

## 📊 Key Business Logic

### Payment Flow (COD)
1. User adds items to cart
2. User proceeds to checkout
3. User fills shipping/billing information
4. Order created with status "pending payment"
5. Order confirmation shows payment instruction
6. Admin receives order and marks as paid when customer pays
7. Order status updates to "processing" → "shipped" → "delivered"

### Authentication Flow
1. User clicks "Login with Google/GitHub"
2. OAuth provider redirects to their login page
3. User authorizes app
4. Backend receives OAuth token and creates/updates user in database
5. Backend generates JWT token
6. Frontend stores JWT in secure cookie
7. Frontend redirects to home page (authenticated)

### Review & Rating Flow
1. User purchases product
2. User navigates to product detail page
3. User submits review with 1-5 star rating and comment
4. Review stored in database
5. Average rating recalculated for product
6. Review appears on product page

---

## 🚀 Getting Started (Phase 1)

### Prerequisites
- Node.js (v14+)
- npm or yarn
- PostgreSQL installed locally
- Git

### Backend Setup
```bash
cd server
npm install
# Create .env file with:
# DB_HOST=localhost
# DB_USER=postgres
# DB_PASSWORD=your_password
# DB_NAME=ecommerce_db
# JWT_SECRET=your_jwt_secret
# OAUTH_GOOGLE_ID=your_google_oauth_id
# OAUTH_GOOGLE_SECRET=your_google_oauth_secret
npm start
```

### Frontend Setup
```bash
cd client
npm install
# Create .env file with:
# REACT_APP_API_URL=http://localhost:5000
# REACT_APP_GOOGLE_OAUTH_ID=your_google_oauth_id
npm start
```

---

## ✅ Success Criteria

Each phase has specific verification steps:
- Phase 1: Both client/server start without errors
- Phase 2: Database connects; schema created successfully
- Phase 3: OAuth login works; JWT tokens validate
- Phase 4-7: API endpoints tested and working
- Phase 8-14: UI pages render correctly; user flows complete
- Phase 15: 80%+ code coverage; performance optimized
- Phase 16: End-to-end flow works in production

---

## 📝 Development Notes

### Key Decisions
- **Payment Method**: Cash on Delivery (no payment integration)
- **Database**: PostgreSQL (local instance)
- **Authentication**: OAuth (Google & GitHub) + JWT
- **State Management**: Context API (scalable to Redux if needed)
- **Cart Storage**: Database persistence (consistent across devices)

### Future Enhancements
- Email notifications for order status
- Advanced analytics and heatmaps
- Multi-language support
- Coupon/discount system
- Mobile app
- Cloud image storage (AWS S3, Cloudinary)
- Social features (product sharing, wishlists with friends)

---

## 📚 Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Passport.js OAuth Tutorial](http://www.passportjs.org)
- [Tailwind CSS](https://tailwindcss.com)

---

## 👤 Project Information

**Developer**: Solo  
**Course**: GMC Checkpoint Project  
**Product Domain**: Perfume Ecommerce  
**Technology**: MERN Stack (with PostgreSQL)  
**Start Date**: April 3, 2026  

---

## 📄 License

This project is for educational purposes as part of the GMC Checkpoint Project.

---

**Ready to start Phase 1? Initialize the project structure and database!**
