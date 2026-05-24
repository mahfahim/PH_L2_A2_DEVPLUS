নিচে আপনার অ্যাসাইনমেন্ট গাইডলাইন এবং সাবমিশন রিকোয়ারমেন্টস অনুযায়ী একদম রেডি-টু-ইউজ একটি প্রফেশনাল **`README.md`** ফাইল দেওয়া হলো।

```markdown
# 🚼 DevPulse — Tech Issue & Feature Tracker

DevPulse is an internal collaborative web platform designed for software teams to report bugs, suggest features, and coordinate resolutions efficiently. The system is built with a highly structured modular architecture using Node.js, TypeScript, and Express.js, backed by a PostgreSQL database utilizing raw SQL queries exclusively.

* **Live Deployment URL:** [https://devpulse-api.vercel.app](https://devpulse-api.vercel.app)
* **GitHub Repository:** [https://github.com/yourusername/devpulse](https://github.com/yourusername/devpulse)
* **Technical Interview Video:** [Google Drive / YouTube Link](https://youtube.com)

---

## 🛠️ Technology Stack

| Layer | Technology | Specification / Note |
| --- | --- | --- |
| **Runtime Environment** | Node.js | LTS Runtime (v24.x or higher) |
| **Programming Language**| TypeScript | Latest stable version (Strict configuration, zero `any` types) |
| **Backend Framework** | Express.js | Modular router-based architecture |
| **Database Engine** | PostgreSQL | Relational database (Hosted on NeonDB / Supabase / Railway) |
| **Database Driver** | Native `pg` | Direct `pool.query()` execution (No ORMs or SQL JOINs) |
| **Authentication** | JSON Web Tokens | Stateless session identification (`jsonwebtoken`) |
| **Security & Hashing** | bcrypt | Secure password hashing (10 Salt Rounds) |

---

## ✨ Key Features

* **Role-Based Access Control (RBAC):** Distinct permission tiers for `contributor` and `maintainer` roles.
* **Pure Raw SQL Execution:** High-performance database transactions executed strictly using direct SQL strings without query builders.
* **Dynamic Issue Filtering & Sorting:** Advanced lookup capabilities for issues including sorting (`newest`, `oldest`) and filtering by `type` or `status`.
* **Relations Without JOINs:** Optimized application-level data batching to dynamically stitch `reporter` information to issues without heavy database `JOIN` commands.
* **Strict Application Logic Validation:** Verification rules such as character boundaries (e.g., descriptions must be $\ge 20$ characters) enforced natively before database entry.
* **Type-Safe Centralized Error Handling:** Global error response architecture driven cleanly by TypeScript `unknown` types and `instanceof Error` pattern matching.

---

## 🗄️ Database Schema Summary

The database consists of two primary tables. All constraints, relations, and data checks are handled securely inside the application workflow logic.

### 1. `users` Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'contributor' CHECK (role IN ('contributor', 'maintainer')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

### 2. `issues` Table

```sql
CREATE TABLE issues (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('bug', 'feature_request')),
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
    reporter_id INT NOT NULL, -- Verified dynamically using incoming JWT user payloads
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

---

## 🚀 Setup & Local Installation Steps

Follow these steps to configure and run the project locally:

### ১. ক্লোন এবং ডিপেন্ডেন্সি ইনস্টলেশন

```bash
# Clone the repository
git clone [https://github.com/yourusername/devpulse.git](https://github.com/yourusername/devpulse.git)
cd devpulse

# Install necessary dependencies
npm install

```

### ২. এনভায়রনমেন্ট ভ্যারিয়েবল কনফিগারেশন

প্রজেক্টের রুট ডিরেক্টরিতে একটি `.env` ফাইল তৈরি করুন এবং নিচের ভ্যারিয়েবলগুলো সেট করুন:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://your_db_user:your_db_password@your_db_host:5432/your_db_name
JWT_SECRET=your_super_secure_jwt_secret_phrase
JWT_EXPIRES_IN=1d

```

### ৩. ডাটাবেজ টেবিল তৈরি

আপনার PostgreSQL ক্লায়েন্টে (যেমন: pgAdmin, Beekeeper Studio) **Database Schema Summary** সেকশনে দেওয়া SQL কোডগুলো রান করে টেবিলগুলো তৈরি করে নিন।

### ৪. অ্যাপ্লিকেশন রান করা

```bash
# Start the server in development mode (with ts-node-dev hot reloads)
npm run dev

# Build the TypeScript code into production-ready JavaScript
npm run build

# Start the compiled production build
npm start

```

---

## 🌐 API Endpoint Specifications

### 🔹 Authentication Module (`/api/auth`)

* **`POST /api/auth/signup`** (Public)
* Registers a new user account as either a `contributor` or `maintainer`.


* **`POST /api/auth/login`** (Public)
* Validates credentials and returns a signed JWT containing user ID, Name, and Role.



### 🔹 Issues Module (`/api/issues`)

* **`POST /api/issues`** (Authenticated)
* Creates a new bug report or feature request. `reporter_id` is automatically parsed from the token.


* **`GET /api/issues`** (Public)
* Retrieves all issues. Supports query parameters: `?sort=newest|oldest`, `?type=bug|feature_request`, and `?status=open|in_progress|resolved`.


* **`GET /api/issues/:id`** (Public)
* Retrieves detailed information of a specific issue alongside mapped reporter details.


* **`PATCH /api/issues/:id`** (Conditional Authorization)
* **Maintainers:** Can update any field of any issue.
* **Contributors:** Can only update fields of their *own* issues, and only if the current status is `open`.


* **`DELETE /api/issues/:id`** (Maintainer Only)
* Permanently removes an issue from the tracking system.



---

## 🚨 System Response Standards

### Success Structure (HTTP 200 / 201)

```json
{
  "success": true,
  "message": "Operation description phrase",
  "data": {}
}

```

### Error Structure (HTTP 4xx / 500)

```json
{
  "success": false,
  "message": "Broad error description",
  "errors": "Detailed exception message or stack"
}

```

```

```