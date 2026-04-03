---
name: PerfumeHub - MERN Ecommerce with PostgreSQL
description: Full-stack perfume ecommerce platform with React, Express, PostgreSQL, GSAP animations, and OAuth authentication.
---

# PerfumeHub — Project Skills & Tracking

## 🎯 Project Summary
Build **PerfumeHub**, a premium perfume ecommerce platform using React (Vite), Express.js, PostgreSQL, and GSAP scroll-driven animations. The design draws inspiration from luxury ecommerce brands (Allbirds, Bliss World, Chubbies, Azteca Soccer) with a dark, elegant perfume-focused aesthetic.

---

## 🛠️ Tech Stack Reference

### Frontend
| Tool | Version | Purpose |
|------|---------|---------|
| React | 18+ | UI library (functional components + hooks) |
| Vite | 5+ | Build tool & dev server |
| React Router | v6 | Client-side routing |
| GSAP + ScrollTrigger | 3.12+ | Scroll-driven animations |
| Axios | latest | HTTP client |
| Context API | built-in | Global state management |

### Backend
| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18+ | Runtime |
| Express.js | 4+ | REST API framework |
| PostgreSQL | 16+ | Relational database |
| Sequelize | 6+ | ORM for PostgreSQL |
| Passport.js | latest | OAuth (Google & GitHub) |
| JWT (jsonwebtoken) | latest | Token-based auth |
| bcryptjs | latest | Password hashing (fallback) |
| cors | latest | Cross-origin requests |
| dotenv | latest | Environment variables |

### Dev Tools
| Tool | Purpose |
|------|---------|
| Git | Version control |
| Postman | API testing |
| pgAdmin 4 | PostgreSQL GUI management |
| ESLint + Prettier | Code quality |
| nodemon | Backend hot-reload |

---

## 🎨 Design Direction

### Inspiration Sources
1. **Allbirds** — Minimalist luxury, warm oatmeal tones, Self Modern serif typography, pill-shaped CTAs, clean product cards
2. **Bliss World** — Pastel gradients, playful yet premium, rounded UI elements, skincare-meets-perfume aesthetic
3. **Chubbies** — Bold typography, vibrant accents, fun personality, strong brand voice
4. **Azteca Soccer** — Dynamic hero sections, category grids, bold imagery, sports-energy layout

### PerfumeHub Design System
- **Theme**: Dark luxury with gold/amber accents (think high-end perfumery)
- **Primary BG**: Rich dark (`#0a0a0a`, `#1a1a2e`)
- **Accent Colors**: Gold (`#d4a853`), Rose Gold (`#b76e79`), Champagne (`#f7e7ce`)
- **Typography**: Playfair Display (headings—serif elegance), Inter (body—clean readability)
- **Cards**: Glassmorphism with subtle backdrop-blur, rounded corners
- **CTAs**: Pill-shaped with gold gradient fills, hover glow effects
- **Animations**: GSAP ScrollTrigger for section reveals, parallax product imagery, staggered text entrances

### GSAP Animation Patterns
```javascript
// Pattern 1: Staggered text reveal on scroll
gsap.from(".hero-title span", {
  scrollTrigger: { trigger: ".hero", start: "top 80%" },
  y: 100, opacity: 0, stagger: 0.1, duration: 1, ease: "power3.out"
});

// Pattern 2: Product card entrance
gsap.from(".product-card", {
  scrollTrigger: { trigger: ".products-grid", start: "top 75%" },
  y: 60, opacity: 0, stagger: 0.15, duration: 0.8, ease: "back.out(1.2)"
});

// Pattern 3: Parallax hero image
gsap.to(".hero-image", {
  scrollTrigger: { trigger: ".hero", scrub: true },
  y: -100, ease: "none"
});

// Pattern 4: Horizontal scroll section
gsap.to(".scroll-container", {
  scrollTrigger: { trigger: ".scroll-section", pin: true, scrub: 1 },
  x: () => -(scrollContainer.scrollWidth - window.innerWidth)
});
```

---

## 🗄️ PostgreSQL Setup Guide (Windows)

### Step 1: Download & Install PostgreSQL
1. Go to https://www.postgresql.org/download/windows/
2. Download the installer (EDB installer recommended)
3. Run installer → choose version 16+
4. Set a password for the `postgres` superuser (REMEMBER THIS!)
5. Keep default port: `5432`
6. Complete installation

### Step 2: Verify Installation
```powershell
# In PowerShell, check PostgreSQL is accessible
psql --version
# If not found, add to PATH: C:\Program Files\PostgreSQL\16\bin
```

### Step 3: Create Project Database
```sql
-- Connect as postgres superuser
psql -U postgres

-- Create the database
CREATE DATABASE perfumehub_db;

-- Create a dedicated user (optional but recommended)
CREATE USER perfumehub_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE perfumehub_db TO perfumehub_user;

-- Verify
\l   -- List all databases
\q   -- Quit psql
```

### Step 4: pgAdmin 4 (GUI Option)
- pgAdmin 4 comes bundled with PostgreSQL installer
- Open it → connect to localhost:5432
- Right-click "Databases" → Create → Database → name it `perfumehub_db`

### Step 5: Environment Variables
```env
# server/.env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=perfumehub_db
JWT_SECRET=your_jwt_secret_here
GOOGLE_CLIENT_ID=your_google_oauth_id
GOOGLE_CLIENT_SECRET=your_google_oauth_secret
GITHUB_CLIENT_ID=your_github_oauth_id
GITHUB_CLIENT_SECRET=your_github_oauth_secret
NODE_ENV=development
PORT=5000
```

---

## 📋 Development Phases Tracking

### Phase 1: Project Init & Setup
- [ ] Initialize monorepo structure (`client/` + `server/`)
- [ ] Setup Vite + React frontend
- [ ] Setup Express backend
- [ ] Configure environment files
- [ ] Install all dependencies
- [ ] Setup ESLint + Prettier

### Phase 2: Database & Backend Foundation
- [ ] Install PostgreSQL locally
- [ ] Create database + tables
- [ ] Setup Sequelize ORM connection
- [ ] Create all models (User, Product, Cart, Order, OrderItem, Review, Category, Wishlist)
- [ ] Run initial migrations
- [ ] Seed sample perfume data

### Phase 3: Authentication
- [ ] Setup Passport.js (Google + GitHub OAuth)
- [ ] JWT token generation & validation
- [ ] Auth middleware (protect routes)
- [ ] Login/Register endpoints
- [ ] User profile endpoints

### Phase 4: Product Management (Backend)
- [ ] Product CRUD endpoints
- [ ] Filtering (brand, price, fragrance type)
- [ ] Search endpoint
- [ ] Pagination
- [ ] Admin product management

### Phase 5: Cart & Wishlist (Backend)
- [ ] Cart CRUD endpoints
- [ ] Wishlist endpoints
- [ ] Stock validation
- [ ] Cart persistence

### Phase 6: Orders & Checkout (Backend)
- [ ] Order creation (COD)
- [ ] Order status tracking
- [ ] Order history
- [ ] Admin mark-as-paid

### Phase 7: Reviews & Ratings (Backend)
- [ ] Review submission
- [ ] Review retrieval
- [ ] Average rating calculation

### Phase 8: Frontend — Layout & Navigation
- [ ] React Router setup
- [ ] Header/Navbar with glassmorphism
- [ ] Footer component
- [ ] Context API (Auth, Cart, User)
- [ ] Responsive design foundation
- [ ] GSAP ScrollTrigger initialization

### Phase 9: Frontend — Homepage & Product Pages
- [ ] Hero section with GSAP parallax
- [ ] Featured products carousel
- [ ] Category showcase with scroll animations
- [ ] Product listing page with filters
- [ ] Product detail page
- [ ] Search UI

### Phase 10: Frontend — Auth & Profile
- [ ] OAuth login page
- [ ] User profile page
- [ ] Protected routes
- [ ] Logout

### Phase 11: Frontend — Cart & Checkout
- [ ] Cart page with animations
- [ ] Checkout form
- [ ] Order confirmation
- [ ] COD payment display

### Phase 12: Frontend — Orders & Wishlist
- [ ] Order history page
- [ ] Order detail view
- [ ] Wishlist page
- [ ] Move to cart functionality

### Phase 13: Frontend — Reviews
- [ ] Review form
- [ ] Review display
- [ ] Star rating component
- [ ] User reviews page

### Phase 14: Admin Dashboard
- [ ] Admin routes
- [ ] Product management UI
- [ ] Order management UI
- [ ] User management
- [ ] Sales analytics charts

### Phase 15: Testing
- [ ] Jest unit tests
- [ ] React component tests
- [ ] API integration tests
- [ ] Performance audit

### Phase 16: Deployment
- [ ] Production build
- [ ] Deploy frontend (Vercel)
- [ ] Deploy backend (Railway/Render)
- [ ] Cloud PostgreSQL setup
- [ ] Domain + SSL

---

## 🔧 Common Commands

```bash
# Start frontend dev server
cd client && npm run dev

# Start backend dev server
cd server && npm run dev

# Run database migrations
cd server && npx sequelize-cli db:migrate

# Seed database
cd server && npx sequelize-cli db:seed:all

# Run tests
npm test

# PostgreSQL CLI
psql -U postgres -d perfumehub_db
```

---

## 📝 Key Design Decisions
- **Payment**: Cash on Delivery only (no Stripe/PayPal integration)
- **Database**: PostgreSQL over MongoDB for relational data integrity
- **ORM**: Sequelize for type-safe queries and migrations
- **Auth**: OAuth-first approach (Google + GitHub) with JWT sessions
- **State**: Context API (can scale to Redux/Zustand later)
- **Animations**: GSAP ScrollTrigger for premium scroll-driven UX
- **Styling**: Vanilla CSS with CSS custom properties (design system approach)
- **Build**: Vite for fast HMR and optimized builds
