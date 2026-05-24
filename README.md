# DevPulse — Tech Issue & Feature Tracker

DevPulse is an internal collaboration platform for software teams to report bugs, suggest features, and manage resolutions efficiently. It is built with a modular architecture using Node.js, TypeScript, and Express.js, with PostgreSQL as the database using raw SQL queries only.

* **Live URL:** [https://devpulse-api.vercel.app](https://devplus-beta.vercel.app/)
* **GitHub:** [https://github.com/yourusername/devpulse](https://github.com/mahfahim/PH_L2_A2_DEVPLUS)

---

## Tech Stack

| Layer     | Technology                         |
| --------- | ---------------------------------- |
| Runtime   | Node.js (LTS v24+)                 |
| Language  | TypeScript (strict mode, no `any`) |
| Framework | Express.js                         |
| Database  | PostgreSQL                         |
| DB Driver | Native `pg` (`pool.query`)         |
| Auth      | JWT (`jsonwebtoken`)               |
| Security  | bcrypt (10 salt rounds)            |

---

## Key Features

* Role-based access control (`contributor`, `maintainer`)
* Raw SQL only (no ORM or query builders)
* Filtering and sorting issues (`newest`, `oldest`, `bug`, `feature_request`, status-based)
* No SQL JOINs, data merged at application level
* Strong validation rules before database writes
* Centralized type-safe error handling using TypeScript

---

## Database Overview

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'contributor',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Issues Table

```sql
CREATE TABLE issues (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'open',
  reporter_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Setup Guide

### 1. Clone & install

```bash
git clone https://github.com/yourusername/devpulse.git
cd devpulse
npm install
```

### 2. Environment setup

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=your_postgres_url
JWT_SECRET=your_secret
JWT_EXPIRES_IN=1d
```

### 3. Create database tables

Run the SQL scripts from the database section in your PostgreSQL client.

### 4. Run project

```bash
npm run dev
npm run build
npm start
```

---

## API Endpoints

### Auth

* `POST /api/auth/signup` → Create account
* `POST /api/auth/login` → Login & get JWT

### Issues

* `POST /api/issues` → Create issue (auth required)
* `GET /api/issues` → Get all issues (filter & sort supported)
* `GET /api/issues/:id` → Get issue details
* `PATCH /api/issues/:id` → Update issue (role-based rules)
* `DELETE /api/issues/:id` → Delete issue (maintainers only)

---

## Response Format

### Success

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Error message",
  "errors": "Detailed error info"
}
```
