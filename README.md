# HotelPro — MERN Hotel Management System

A runnable full-stack starter with React + Vite frontend, Express API, MongoDB/Mongoose, JWT authentication, bcrypt password hashing, role-based authorization, room search, bookings, staff operations, admin metrics, and a demo payment flow.

## Requirements
- Node.js 18+
- MongoDB local or MongoDB Atlas
- npm

## Quick start
1. Extract the project.
2. Copy `server/.env.example` to `server/.env` and set `MONGO_URI` and `JWT_SECRET`.
3. Copy `client/.env.example` to `client/.env`.
4. In one terminal:
   ```bash
   cd server
   npm install
   npm run seed
   npm run dev
   ```
5. In another terminal:
   ```bash
   cd client
   npm install
   npm run dev
   ```
6. Open the Vite URL (normally http://localhost:5173).

API defaults to `http://localhost:5000/api`.

## Seeded demo accounts
After `npm run seed`:
- Admin: `admin@hotelpro.demo` / `Admin123!`
- Staff: `staff@hotelpro.demo` / `Staff123!`
- Guest: `guest@hotelpro.demo` / `Guest123!`

Change these passwords and secrets before any real deployment.

## Implemented
- Registration and login with bcrypt + JWT
- Protected routes and guest/staff/admin roles
- Public room browsing, category filters, date-based availability check
- Booking create/list/cancel workflow with overlap checks
- Demo payment endpoint (does **not** charge a real card)
- Staff check-in/check-out and room status changes
- Admin user listing, booking overview, and dashboard metrics
- Basic review creation
- Responsive React interface and dashboards

## Production checklist
This is a development starter, not a production-certified booking platform. Before deploying:
- Use a strong unique `JWT_SECRET`, HTTPS, secure cookies or short-lived access tokens/refresh-token rotation.
- Add rate limiting, CSRF protection where applicable, robust schema validation, security headers, and audit retention policies.
- Configure a real email provider and verify email ownership.
- Integrate Razorpay/Stripe using server-side order creation, signature/webhook verification, and idempotency. Never trust a client payment status.
- Add refunds, invoice PDFs, cloud image storage, tests, monitoring, backups, and deployment configuration.
- Add transactions or another concurrency-safe inventory strategy for high-volume booking traffic.
- Configure CORS to the exact production frontend origin.
