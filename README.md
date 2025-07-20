🛠️ eCommerce Admin Backend

MERN‑stack Admin API for our multi‑store e‑commerce project.  Covers authentication, product & category management, order processing, and review moderation.  This README reflects everything finished in Sprint 1.

🚀 Tech Stack

Layer

Tech

Runtime

Node v18+ (ES Modules)

Framework

Express 4

Database

MongoDB + Mongoose

Auth

JWT (access + refresh), bcryptjs

Validation

Joi

Logging / Security

morgan · helmet · cors

⚡ Quick Start

# 1. Clone & install
git clone <repo-url> && cd ecommerce-admin-be
npm i

# 2. Environment
cp .env.example .env                  # add your secrets / Mongo URI

# 3. Seed first admin (if none exists)
npm run seed:admin                    # creates admin@shop.com / Admin@123

# 4. Dev server
npm run dev                           # http://localhost:8000

Seeded Admin Credentials

Email

Password

admin@shop.com

Admin@123

🔑 Environment Variables (.env)

Key

Example

Description

MONGO_URI

mongodb://127.0.0.1:27017/ecomAdminDB

Mongo connection string

JWT_ACCESS_SECRET

superSecretAccess123

Signs 15‑min access tokens

JWT_REFRESH_SECRET

ultraSecretRefresh456

Signs 30‑day refresh tokens

CLIENT_URL

http://localhost:5173

Allowed CORS origin (admin frontend)

📚 API Reference

Auth

Method

Path

Body

Auth

Description

POST

/api/admin/v1/auth/login

{ email, password }

–

Admin login, returns accessJWT & refreshJWT

POST

/api/admin/v1/auth/refresh-token

{ refreshJWT }

–

Renew access token

Products (protected)

Method

Path

Body

Validation

POST

/products

name, price, stock, category

Joi (productSchema)

GET

/products

–

Pagination & search via query params

GET

/products/:id

–

–

PUT

/products/:id

same as POST

Joi

DELETE

/products/:id

–

–

Categories (protected)

Method

Path

Body

POST

/categories

{ name }

GET

/categories

–

PUT

/categories/:id

{ name }

DELETE

/categories/:id

–

Orders (protected)

| GET | /orders | – | List all orders |
| PUT | /orders/:id/status | { status } | Update (pending→shipped→delivered) |

Reviews (protected)

| PUT | /reviews/:id/approve | – | Approve review |
| DELETE | /reviews/:id | – | Remove review & pull from product |

Auth header: Authorization: Bearer <accessJWT> for all protected routes.

🧰 Error Format

All errors funnel through a global handler:

{
  "status": "error",
  "message": "Validation failed: \"price\" is required"
}

🗄️ Folder Structure

src/
 ├─ config/            # Mongo connection
 ├─ controllers/       # Business logic
 ├─ middleware/        # auth, role, validate, errorHandler
 ├─ models/            # Mongoose schemas & model helpers
 ├─ routes/            # Express routers
 ├─ utils/             # jwtHelper, bcrypt helpers
 └─ validators/        # Joi schemas

🧪 Manual Testing

Open rest.http (VS Code REST Client) and send:

Admin login – grabs token.

Create category / product – validates Joi.

Approve / delete review – confirms moderation.

All endpoints return 2xx on success, 400 on validation errors, 401/403 on auth issues.

🛡️ Roadmap

✅ Sprint 1: Auth, CRUD, validation, review moderation.

🔜 Sprint 2: Admin React Dashboard (sidebar, metrics, tables).

🔜 Sprint 3: Email notifications & deployment (AWS EB & S3).

👥 Authors

Manoj Adhikari & Team (Backend)

Manas (AI Pair‑Programmer)

🪪 License

MIT – see LICENSE.

