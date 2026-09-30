# MediBook Pro — Doctor Appointment Booking System

A polished full-stack healthcare appointment platform built with:

- Frontend: React + Vite + Tailwind CSS + React Router + Axios + Framer Motion + Lucide
- Backend: Node.js + Express + MongoDB + Mongoose
- Auth: JWT + bcrypt
- Email: Nodemailer
- Roles: Patient, Doctor, Admin
- Appointment slot locking to prevent double booking
- Responsive mobile-first design

## 1. Requirements

Install:

- Node.js 20+ (LTS recommended)
- MongoDB 7+ locally OR a MongoDB Atlas connection string
- Git (optional)

Verify Node/npm:

```bash
node -v
npm -v
```

If Windows says `npm is not recognized`, install Node.js LTS from the official Node.js website and restart PowerShell/VS Code.

## 2. Project structure

```text
medibook-pro/
├── frontend/
└── backend/
```

## 3. Backend setup

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

Linux/macOS:

```bash
cp .env.example .env
npm install
npm run dev
```

Edit `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/medibook
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
MAIL_FROM=MediBook Pro <your_email@gmail.com>

ADMIN_EMAIL=admin@medibook.local
ADMIN_PASSWORD=Admin@12345
```

Create the initial admin:

```bash
npm run seed:admin
```

Backend runs at:

`http://localhost:5000`

Health check:

`http://localhost:5000/api/health`

## 4. Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

`http://localhost:5173`

## 5. Demo accounts

After `npm run seed:admin`:

- Admin: `admin@medibook.local`
- Password: `Admin@12345`

You can create patient and doctor accounts from the UI.

## 6. Email notifications

For Gmail, enable 2-Step Verification and create a Google App Password. Put the App Password into `SMTP_PASS`.

If SMTP variables are missing, the backend still completes appointment operations but logs a warning instead of crashing.

## 7. Important production notes

Before public deployment:

- Use a strong random JWT secret.
- Use HTTPS.
- Store secrets only in environment variables.
- Add a production email provider.
- Add rate limiting / WAF protection.
- Add audit logs.
- Configure secure cookies if moving JWT from localStorage to HttpOnly cookies.
- Add payment gateway/webhook verification if enabling online payments.
- Add medical-data compliance/security controls appropriate to your jurisdiction.

## 8. API overview

Auth:
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/forgot-password`
- POST `/api/auth/reset-password/:token`
- GET `/api/auth/me`

Doctors:
- GET `/api/doctors`
- GET `/api/doctors/:id`
- GET `/api/doctors/:id/slots`
- PATCH `/api/doctors/profile`
- PATCH `/api/doctors/schedule`

Appointments:
- POST `/api/appointments`
- GET `/api/appointments/mine`
- PATCH `/api/appointments/:id/status`
- PATCH `/api/appointments/:id/reschedule`
- POST `/api/appointments/:id/review`

Admin:
- GET `/api/admin/stats`
- GET `/api/admin/users`
- POST `/api/admin/doctors`
- PATCH `/api/admin/doctors/:id`
- DELETE `/api/admin/doctors/:id`

## 9. UX direction

The interface intentionally avoids the generic "AI dashboard" look. It uses:
- healthcare-inspired blue/teal palette
- generous whitespace
- restrained shadows
- rounded cards
- real-world microcopy
- skeleton/loading states
- empty states
- accessible form labels
- responsive navigation
- motion used only where it improves feedback
