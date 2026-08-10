# MoodMate

An AI-powered mood recommendation app. Describe your current mood and context, and
[Google Gemini](https://aistudio.google.com/apikey) generates a personalized suggestion —
what to eat, what to watch, and what to do — to help you feel better. Guests get the
core feature instantly; logged-in users get a saved history of past check-ins with
stats and trends.

See [PROJECT_STRUCTURE_AND_MILESTONES_REQUIREMENTS.md](PROJECT_STRUCTURE_AND_MILESTONES_REQUIREMENTS.md)
for the full feature/architecture spec and milestone breakdown.

## Tech stack

| Layer          | Tech                                                              |
| -------------- | ------------------------------------------------------------------ |
| Frontend       | Vite + React, Tailwind CSS, Lucide icons                          |
| Backend        | NestJS                                                             |
| Database       | PostgreSQL, TypeORM (CRUD) + raw SQL/QueryBuilder (stats, history) |
| AI             | Google Gemini API                                                  |
| Auth           | JWT (access + refresh tokens)                                      |
| Email          | Nodemailer (verification, password reset)                          |
| Image storage  | Cloudinary (avatar uploads)                                        |

## Prerequisites

- Node.js 20+
- A local PostgreSQL instance

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in your own values:

- `DATABASE_URL` — your local Postgres connection string
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — any long random strings
- `GEMINI_API_KEY` — free at https://aistudio.google.com/apikey
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — optional,
  only needed for avatar uploads; the app runs fine without them
- `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` — optional; without these, verification and
  password-reset emails are printed to the server console instead of sent

Run the database migration, then start the server:

```bash
npm run migration:run
npm run start:dev
```

The API listens on `http://localhost:3000` (or `PORT` from `.env`).

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

By default `.env` points `VITE_API_URL` at `http://localhost:3000` — change it if your
backend runs elsewhere.

```bash
npm run dev
```

The app is served at `http://localhost:5173`.

## Notes

- No account is required to try a mood check-in — sign up only if you want your
  check-ins saved to history.
- `GEMINI_API_KEY`, `CLOUDINARY_*`, and `SMTP_*` are all optional for local
  development: the app degrades gracefully (generic suggestions, console-logged
  emails, a clear "not configured" error on avatar upload) when they're missing.
