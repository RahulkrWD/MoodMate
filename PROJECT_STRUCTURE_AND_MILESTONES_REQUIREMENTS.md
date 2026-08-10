# MoodMate — AI-Powered Mood Recommendation App

A multi-step app where a user describes their current mood and context, and Google Gemini generates personalized suggestions — what to eat, what to watch, and what to do — to help them feel better. Guests can use the core feature instantly; logged-in users get a saved history of past sessions.

---

## 1. Tech Stack

| Layer          | Tech                                                                                                     |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| Frontend       | Vite + React, Tailwind CSS (responsive), icon library (e.g. Tabler/Lucide via CDN — no hardcoded emojis) |
| Backend        | NestJS                                                                                                   |
| Database       | PostgreSQL                                                                                               |
| ORM / Query    | TypeORM (for standard CRUD) + raw SQL / QueryBuilder (for aggregation, filtering, history queries)       |
| AI             | Google Gemini API (free tier), custom rate limiter                                                       |
| Auth           | JWT (access + refresh tokens)                                                                            |
| Email          | Nodemailer (verification, password reset)                                                                |
| Image storage  | Cloudinary (profile avatar, optional)                                                                    |
| Error handling | Global exception filter, standardized response format                                                    |

**Why mix TypeORM and raw SQL:** use TypeORM repositories for simple entity CRUD (users, auth), and raw SQL / QueryBuilder for anything needing aggregation, filtering, or performance-sensitive queries (mood history stats, trends, pagination). This is intentional — it's a stronger signal of real SQL skill than TypeORM everywhere.

---

## 2. Core Feature Flow

1. **Select mood** — happy, sad, stressed, low energy, anxious, bored, angry, etc. (single select)
2. **Select energy level** — low / medium / high
3. **Select preferences** — dietary preference (veg / non-veg / no preference), time available, indoor or outdoor
4. **Send to Gemini** — structured prompt built from all selections, requests JSON output (one food suggestion, one watch suggestion, one activity suggestion)
5. **Show recommendations** — rendered as three cards (Eat / Watch / Do)
6. **Save (if logged in)** — entry + recommendation saved to history; guests see the result but nothing is persisted

**Safety rule:** if the selected mood is in a "serious" category (e.g. hopeless, very low), skip or supplement the usual suggestions with a gentle message pointing toward talking to someone — don't let the AI casually generate a movie suggestion for that state. Keep a small hardcoded list of "serious" mood values that trigger this branch server-side, not left to the AI's judgment.

---

## 3. Database Schema

```sql
-- users
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
name          VARCHAR(100) NOT NULL
email         VARCHAR(255) UNIQUE NOT NULL
password_hash TEXT NOT NULL
avatar_url    TEXT
is_verified   BOOLEAN DEFAULT FALSE
created_at    TIMESTAMPTZ DEFAULT now()

-- mood_entries
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id       UUID REFERENCES users(id) ON DELETE CASCADE
mood          VARCHAR(50) NOT NULL
energy_level  VARCHAR(20) NOT NULL          -- low | medium | high
dietary_pref  VARCHAR(20)                   -- veg | non-veg | none
time_available VARCHAR(30)
is_serious    BOOLEAN DEFAULT FALSE
created_at    TIMESTAMPTZ DEFAULT now()

-- recommendations
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
mood_entry_id   UUID REFERENCES mood_entries(id) ON DELETE CASCADE
food_suggestion TEXT
watch_suggestion TEXT
activity_suggestion TEXT
raw_ai_response JSONB          -- store the full Gemini response for debugging
created_at      TIMESTAMPTZ DEFAULT now()
```

---

## 4. API Endpoints

| Method | Route                   | Auth           | Implementation                | Notes                                                   |
| ------ | ----------------------- | -------------- | ----------------------------- | ------------------------------------------------------- |
| POST   | `/auth/signup`          | Public         | TypeORM                       | Hash password, send verification email                  |
| POST   | `/auth/login`           | Public         | TypeORM                       | Returns JWT access + refresh token                      |
| POST   | `/auth/verify-email`    | Public (token) | TypeORM                       | Nodemailer link click                                   |
| POST   | `/auth/forgot-password` | Public         | TypeORM                       | Nodemailer reset link                                   |
| POST   | `/auth/reset-password`  | Public (token) | TypeORM                       |                                                         |
| POST   | `/mood/analyze`         | Optional       | Raw SQL insert (if logged in) | Rate-limited, calls Gemini, works for guest + logged-in |
| GET    | `/mood/history`         | Required       | QueryBuilder                  | Pagination, filter by mood/date range                   |
| GET    | `/mood/history/:id`     | Required       | Raw SQL                       | Single entry with joined recommendation                 |
| DELETE | `/mood/history/:id`     | Required       | TypeORM                       |                                                         |
| GET    | `/mood/stats`           | Required       | Raw SQL (GROUP BY)            | Mood frequency, weekly trend — good SQL showcase        |
| GET    | `/user/profile`         | Required       | TypeORM                       |                                                         |
| PATCH  | `/user/profile`         | Required       | TypeORM + Cloudinary          | Avatar upload                                           |

**Standard response format:**

```json
// Success
{ "success": true, "data": { ... } }

// Error
{ "success": false, "error": { "code": "MOOD_INVALID", "message": "..." } }
```

---

## 5. AI Integration (Google Gemini)

- Model: `gemini-2.5-flash-lite` (free tier — 15 RPM, 1,000+ RPD)
- Prompt built server-side from the 3 selections, requests strict JSON output:
  ```
  User feels {mood}, energy is {energy_level}, prefers {dietary_pref} food,
  has {time_available} available. Respond ONLY with JSON:
  { "food": "...", "watch": "...", "activity": "..." }
  ```
- Parse and validate the JSON response — if Gemini returns malformed output, retry once, then fall back to a generic suggestion set
- **Rate limiting (two layers):**
  1. NestJS `@nestjs/throttler` on the `/mood/analyze` endpoint (protects your own API from abuse)
  2. A separate internal limiter/queue in the Gemini service wrapper (e.g. `bottleneck` package or a simple token-bucket) capped at 15 requests/min, so concurrent users never collectively exceed Gemini's own free-tier limit
- Wrap all Gemini calls in try/catch with a clear fallback response — never let an AI failure break the user flow

---

## 6. Error Handling

- Global `HttpExceptionFilter` catching all thrown exceptions, formatting them into the standard error response
- Custom exception classes per domain (e.g. `MoodNotFoundException`, `GeminiServiceException`, `InvalidCredentialsException`)
- Validation via `class-validator` DTOs on every endpoint — reject bad input before it reaches business logic
- Distinct handling for: validation errors (400), auth errors (401/403), not found (404), rate limit exceeded (429), AI service failure (503 with fallback data), unexpected errors (500, logged not exposed)

---

## 7. Milestones

- [x] **M0 — Project setup**: NestJS backend scaffold, Vite + Tailwind frontend scaffold, Postgres connection, environment config, folder structure, git repo
- [x] **M1 — Database & entities**: TypeORM entities + migrations for `users`, `mood_entries`, `recommendations`
- [x] **M2 — Auth module**: signup, login, JWT strategy, email verification (Nodemailer), forgot/reset password
- [x] **M3 — Gemini integration**: service wrapper, prompt construction, JSON parsing, retry logic, internal rate limiter
- [x] **M4 — Core mood feature**: `/mood/analyze` endpoint, guest + logged-in paths, throttling
- [x] **M5 — History & stats**: `/mood/history`, `/mood/stats` with raw SQL/QueryBuilder, pagination, filtering
- [x] **M6 — Profile & avatar**: `/user/profile`, Cloudinary upload integration
- [x] **M7 — Global error handling**: exception filters, custom exceptions, standardized responses across all endpoints
- [x] **M8 — Frontend**: multi-step wizard UI (mood → energy → preferences → result), history dashboard, responsive Tailwind layout, icon library integration
- [ ] **M9 — Polish & deploy**: manual test pass, deploy backend + frontend, write demo instructions, record a short demo video/gif for the portfolio

---

## 8. Environment Variables (`.env`)

```
DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
GEMINI_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SMTP_HOST=
SMTP_USER=
SMTP_PASS=
FRONTEND_URL=
```
