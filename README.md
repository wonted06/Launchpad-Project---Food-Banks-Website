## README Structure

### 1 — Project title + tagline
**Feed Birmingham** — A community food bank website for Birmingham, connecting residents with food banks, hot meals, delivery services, and donation opportunities.

### 2 — Short description (2–3 sentences)
What the site does, who it's for, and that it's a full-stack Node.js web application built as a university group project.

### 3 — Features list (bullet points)
- Find your nearest food bank with an interactive map
- Request a home delivery (with live route tracking)
- Browse available food inventory by category
- View the weekly hot meal schedule
- User accounts with profile, dietary preferences, and accessibility settings
- Multi-language support (English, Polish, Punjabi)
- Donate money, food, or volunteer time
- Contact form and feedback submission

### 4 — Tech Stack (brief table)
| Layer | Technology |
|---|---|
| Server | Node.js + Express |
| Templating | Pug |
| Database | PostgreSQL |
| Maps | Leaflet.js + OpenStreetMap |
| Styling | Custom CSS |
| Auth | bcrypt + express-session |

### 5 — Prerequisites
Things to install before cloning:
- **Node.js** v18 or later — https://nodejs.org
- **PostgreSQL** v14 or later — https://www.postgresql.org/download
- **Git** — https://git-scm.com (or download the ZIP from GitHub)

### 6 — Installation (step-by-step, numbered, plain English)

**Step 1 — Download the project**
```bash
git clone https://github.com/<repo-url>.git
cd Launchpad-Project---Food-Banks-Website
```

**Step 2 — Install dependencies**
```bash
npm install
```

**Step 3 — Set up the database**
1. Open **pgAdmin** (comes with PostgreSQL)
2. Create a new database (e.g. `fjk23wtu`)
3. Open the Query Tool and run `src/SQL/table_creation.sql` — creates all the tables
4. Then run `src/SQL/mock_data.sql` — populates the food banks, products, and inventory

**Step 4 — Configure environment variables**
1. Copy the example file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your PostgreSQL credentials:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=your_database_name
   DB_USER=your_postgres_username
   DB_PASSWORD=your_postgres_password
   SESSION_SECRET=any_long_random_string
   ```

**Step 5 — Start the server**
```bash
npm start
```
Then open your browser and go to: **http://localhost:3001**

### 7 — Project Structure (collapsible or brief tree)
```
├── app.js              # Server entry point
├── db.js               # Database connection
├── routes/             # URL route definitions
├── src/
│   ├── controllers/    # Page logic and form handling
│   ├── models/         # Database query functions
│   ├── views/          # Pug HTML templates
│   ├── public/         # CSS, images, and static files
│   ├── locales/        # Translation files (en, pl, pu)
│   └── SQL/            # Database setup scripts
```

### 8 — Environment Variables reference table
| Variable | Description |
|---|---|
| `DB_HOST` | PostgreSQL server address (use `localhost` for local) |
| `DB_PORT` | PostgreSQL port (default `5432`) |
| `DB_NAME` | Name of your database |
| `DB_USER` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |
| `SESSION_SECRET` | Secret key for user sessions (any long random string) |

### 9 — Contributing / Team
List the three team members and their areas:
- **Kimi Tang** — Inventory & Locations (database, mock data, test queries)
- **Eldridge Pacifico** — Login & Register (password hashing, session security)
- **Kurt Canillas** — Frontend (Pug page design, JavaScript, CSS styling)

### 10 — Licence
MIT (or note "University project — not for commercial use" if no licence file exists)

---

## Notes
- Port is **3001** (hardcoded in app.js — do not change unless you also update app.js)
- `npm start` uses nodemon (auto-restarts on file changes); `npm run dev` uses plain node
- The `.env` file must **never** be committed — it is already in `.gitignore`
- SQL files are in `src/SQL/` — run `table_creation.sql` first, then `mock_data.sql`
- No licence file exists in the repo — README will note it's a university project

---
