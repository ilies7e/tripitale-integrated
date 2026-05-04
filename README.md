# TripTale — Algerian Tourism (PostgreSQL shared)

Full-stack tourism app focused 100% on Algeria with:
- 27 Algerian destinations (Casbah, Tassili, Hoggar, Constantine, Timgad, Djemila,
  Tlemcen, Tipaza, Annaba, Oran, Bejaïa, Tikjda, Chréa, Taghit, Habibas, El Kala,
  Ghardaïa and more)
- **Shared PostgreSQL database** (multiple phones/tablets see the exact same data)
- Comments and ratings show the author (username + avatar + date)
- **Category cards use minimalist black icons** (FontAwesome5) instead of photos

## Layout

```
triptale-integrated/
├── triptale-backend/
│   ├── docker-compose.yml    # one-command: Postgres + backend
│   ├── src/                  # Express + Prisma + JWT
│   └── prisma/               # schema + seed
└── triptale-frontend/        # React Native + Expo (JS)
```

## Quick start — all shared (one command)

Requires **Docker** and **Docker Compose** (included in Docker Desktop).

```bash
cd triptale-backend
docker compose up -d          # spins up Postgres + backend
# wait ~30s on first run (downloads postgres image, installs deps, runs migrations, seeds data)
curl http://localhost:4000/health       # should return {"status":"ok"}
```

This brings up:
- **Postgres 16** on `localhost:5432` (data persisted in the `postgres-data` volume)
- **Backend** on `localhost:4000`, auto-migrates the schema and seeds the 27
  Algerian trips

All devices on the same Wi-Fi can now use the backend at
`http://<your-PC-LAN-IP>:4000` and they will all read and write the same shared
database — comments and ratings from one phone show up instantly on another.

To reset everything:
```bash
docker compose down -v         # removes the database volume too
```

## Quick start — frontend

```bash
cd triptale-frontend
npm install
npm run start                  # scan QR with Expo Go
```

In the app on the phone: **Login → Server settings → Test connection → Save**
with `http://<your-PC-LAN-IP>:4000`.

## Quick start — without Docker (Postgres already installed)

```bash
# 1) Point DATABASE_URL to your Postgres (edit .env)
cd triptale-backend
cp .env.example .env
# edit .env → DATABASE_URL="postgresql://user:pw@host:5432/triptale"
npm install
npx prisma migrate deploy
npm run seed
npm run dev
```

## Demo accounts (password = `password123`)

| Username      | Email                       | Role                                     |
|---------------|-----------------------------|------------------------------------------|
| `karlkeating` | `demo@triptale.app`         | demo account (10 saved, 7 followers)     |
| `yacine`      | `yacine@triptale.app`       | Algiers photographer                     |
| `amina`       | `amina@triptale.app`        | Constantine architect & guide            |
| `walid`       | `walid@triptale.app`        | Tassili / Hoggar trekking guide          |
| `lila`        | `lila@triptale.app`         | Oran beach lover                         |
| `rania`       | `rania@triptale.app`        | Algiers food blogger                     |
| `karim`       | `karim@triptale.app`        | Djurdjura hiker, 4x4 driver              |
| `sara`        | `sara@triptale.app`         | Tlemcen Andalusian heritage nerd         |

## What changed in this build

### 1. Category cards — icons instead of photos
`app/(tabs)/categories.jsx` now renders a large minimalist black FontAwesome5
icon on the beige card, matching the original design spec (campground tent,
hotel buildings, ship, snowflake, music note, etc.).

### 2. PostgreSQL as the shared backing store
`prisma/schema.prisma` `provider = "postgresql"`. A `docker-compose.yml` ships a
fully wired Postgres-16 + backend pair so users can go from zero to shared
backend with **one command**. All devices on the same network see the same
comments/ratings/trips in real-time.

### 3. Comments show the author with avatar and date
`app/trip/[tripId].jsx` now renders each comment with the user's profile picture
(falling back to a coloured initial letter), their full name, `@username`, and
the date the comment was posted. The API already returned this data — the UI
just wasn't displaying all of it.

## Database stats after seed

```
{ users: 8, categories: 18, trips: 27, media: 84, guides: 93,
  comments: 108, ratings: 163, follows: 29, saved: 10 }
```

Every one of the 18 categories contains at least one Algerian trip. Every trip
has ≥ 4 comments and ≥ 5 ratings (average ~4.7 stars).

## Deploying to the public cloud

If you want the database accessible outside your LAN (from a friend's phone
elsewhere in the world):

1. Create a free Postgres on **Neon** (https://neon.tech) or **Supabase** — copy
   the connection string.
2. Deploy the backend folder to **Fly.io**, **Render**, or **Railway**, setting
   `DATABASE_URL` to the Neon connection string.
3. In the app's Server Settings, point to the deployed backend URL. Done.

## API

```
/health            GET   health check
/api/auth/*        POST  register, login, refresh, logout
/api/users/*       CRUD  users, follow, followers, following
/api/categories    GET   list categories
/api/trips         CRUD  trips with filters (categorySlug, country, search)
/api/trips/:id/ratings   GET (+userRating if auth), POST, DELETE
/api/trips/:id/comments  GET, POST, DELETE
/api/saved-trips   CRUD  saved trips per user
```

Full Swagger UI at `http://localhost:4000/api/docs`.
