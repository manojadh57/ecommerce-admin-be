📦 eCommerce Admin Backend

A Node/Express + MongoDB service that powers the Admin CMS of our MERN e‑commerce platform.  Sprint‑1 covers all core CRUD and moderation endpoints needed for the admin dashboard.

⚙️ Tech Stack

Layer

Tech

Runtime

Node.js v18+ (ES Modules)

Framework

Express 4

DB

MongoDB + Mongoose

Auth

JWT (access + refresh), bcrypt

Validation

Joi

Security

helmet, cors, morgan

🚀 Quick Start

# 1. Clone & install
$ git clone <repo‑url> && cd ecommerce-admin-be
$ npm i

# 2. Configure env
$ cp .env.example .env              # edit Mongo URI & JWT secrets

# 3. Run dev server (nodemon)
$ npm run dev                       # http://localhost:8000

Seeded Admin Credentials

Email

Password

admin@shop.com

Admin@123

Use these to hit the login route and obtain your Bearer token.

📑 API Reference (Sprint‑1)

Auth

Method

Path

Body

Notes

POST

/api/admin/v1/auth/login

{ email, password }

returns accessJWT, refreshJWT

POST

/api/admin/v1/auth/refresh-token

{ refreshJWT }

new accessJWT

Products (protected)

Method

Path

Body (✂️)

Purpose

POST

/products

name, price, stock, category, …

Create

GET

/products

–

List (pagination/search)

GET

/products/:id

–

Single

PUT

/products/:id

full body

Update

DELETE

/products/:id

–

Remove

Categories (protected) – same verbs as Products.

Orders (protected)

| GET | /orders | – | List all |
| PUT | /orders/:id/status | { status } | Update status & email notify |

Reviews (protected)

| PUT | /reviews/:id/approve | – | Approve |
| DELETE | /reviews/:id | – | Remove + pull from product |

Auth header for all protected routes:
Authorization: Bearer <accessJWT>

🛡️ Validation & Error Shape

All create/update routes are Joi‑validated.

Errors funnel through a global handler:

{ "status": "error", "message": "<details>" }

📂 Project Structure

│  server.js
│  .env.example
└─ src/
   ├─ config/         # Mongo connection
   ├─ controllers/    # Route logic (auth, product, …)
   ├─ middleware/     # auth, role, validate, errorHandler
   ├─ models/         # Mongoose schemas & helpers
   ├─ routes/         # Express routers per module
   └─ utils/          # JWT & bcrypt helpers

🧪 Testing

Manual smoke‑tests live in rest.http (VS Code REST Client).  Automated Jest/Supertest suite to be added in Sprint‑2.

🛠️  Useful NPM Scripts

Script

Purpose

npm run dev

Dev server with Nodemon

npm test

Jest test runner (coming soon)

npm run seed:admin

(if enabled) insert first admin user

✨ Contributing

Create a feature branch → git checkout -b feat/<name>

Commit using semantic messages.

Submit PR; CI must pass.

📜 License

MIT © 2025 Manoj Adhikari & team

