# TripTale — Backend (REST API)

Backend complet pour l'application mobile **TripTale** (React Native).
Stack : **Node.js + Express + TypeScript + Prisma + JWT**.
DB : **SQLite** par défaut (zéro config) — passez à **PostgreSQL** en changeant une seule ligne dans `prisma/schema.prisma`.

---

## Sommaire
1. [Démarrage rapide](#démarrage-rapide)
2. [Variables d'environnement](#variables-denvironnement)
3. [Structure du projet](#structure-du-projet)
4. [Modèle de données](#modèle-de-données)
5. [Endpoints (résumé)](#endpoints-résumé)
6. [Authentification](#authentification)
7. [Exemples (curl)](#exemples-curl)
8. [Connexion depuis React Native](#connexion-depuis-react-native)
9. [Passage à PostgreSQL](#passage-à-postgresql)
10. [Déploiement](#déploiement)

---

## Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Copier les variables d'environnement
cp .env.example .env

# 3. Créer la base de données (SQLite locale par défaut)
npx prisma migrate dev --name init

# 4. (Optionnel) Charger des données de démo
npm run seed

# 5. Lancer le serveur en mode dev
npm run dev
```

Le serveur démarre sur `http://localhost:4000`.

- Documentation interactive Swagger : <http://localhost:4000/api/docs>
- Spec OpenAPI JSON : <http://localhost:4000/api/docs.json>
- Healthcheck : <http://localhost:4000/health>

### Compte de démo après seed
- Email : `demo@triptale.app`
- Mot de passe : `password123`

### Scripts disponibles
| Script | Description |
|--------|-------------|
| `npm run dev` | Lance le serveur avec rechargement à chaud (tsx) |
| `npm run build` | Compile TypeScript vers `dist/` |
| `npm start` | Lance la build de production |
| `npm run prisma:migrate` | Crée/applique une migration |
| `npm run prisma:reset` | Réinitialise complètement la base |
| `npm run prisma:studio` | Ouvre Prisma Studio (UI pour la DB) |
| `npm run seed` | Charge les catégories + données de démo |
| `npm run typecheck` | Vérification TypeScript stricte |

---

## Variables d'environnement

Voir `.env.example`. Les principales :

| Variable | Défaut | Description |
|----------|--------|-------------|
| `PORT` | `4000` | Port HTTP |
| `APP_URL` | `http://localhost:4000` | URL publique (utilisée pour les URLs des médias) |
| `DATABASE_URL` | `file:./dev.db` | SQLite par défaut. Pour Postgres : `postgresql://user:pass@host:5432/db?schema=public` |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | `change-me-*` | **À changer en production** |
| `JWT_ACCESS_EXPIRES_IN` | `15m` | Durée des access tokens |
| `JWT_REFRESH_EXPIRES_IN` | `30d` | Durée des refresh tokens |
| `UPLOAD_DIR` | `./uploads` | Dossier des fichiers uploadés |
| `MAX_FILE_SIZE_MB` | `20` | Taille max d'un fichier |
| `CORS_ORIGIN` | `*` | Origines autorisées (séparées par virgules) |

---

## Structure du projet

```
src/
├── app.ts                # Express app builder (middleware + routes)
├── server.ts             # Entrée serveur
├── config/
│   ├── env.ts            # Validation des variables d'env (zod)
│   ├── db.ts             # Singleton Prisma
│   └── swagger.ts        # Spec OpenAPI
├── middleware/
│   ├── auth.ts           # requireAuth / optionalAuth
│   ├── error.ts          # Handler d'erreurs centralisé
│   ├── validate.ts       # Validation zod (body / query / params)
│   └── upload.ts         # Multer (image/video, 20MB par défaut)
├── modules/
│   ├── auth/             # register, login, refresh, logout, me
│   ├── users/            # profile, trips d'un user
│   ├── categories/       # Liste/CRUD catégories
│   ├── trips/            # CRUD + recherche + filtres
│   ├── comments/         # Commentaires sur trips
│   ├── ratings/          # Notation 1–5 (un par user/trip)
│   ├── saved-trips/      # Section "planification"
│   └── media/            # Upload images/vidéos
├── utils/
│   ├── ApiError.ts       # Erreurs HTTP typées
│   ├── asyncHandler.ts   # Wrapper async/await
│   └── jwt.ts            # sign/verify JWT
└── types/
    └── express.d.ts      # Augmentation Request.user
prisma/
├── schema.prisma         # Modèle de données (ER)
├── seed.ts               # Données de seed (catégories + démo)
└── migrations/           # Migrations générées
```

---

## Modèle de données

(D'après `ER-Diagram(Trip-Tale).pdf`)

- **User** — `id, username, email, password, profilePicture, bio, createdAt`
- **Category** — `id, name, slug, icon`
- **Trip** — `id, title, description, location, budget, categoryId, userId, createdAt`
- **Comment** — `id, content, userId, tripId, createdAt`
- **Rating** — `id, value (1–5), userId, tripId` *(unique par (user, trip))*
- **SavedTrip** — `id, userId, tripId, notes, priority, createdAt` *(unique par (user, trip))*
- **TripMedia** — `id, tripId, mediaUrl, mediaType (image/video), caption, uploadedAt`
- **RefreshToken** — gestion sécurisée des refresh tokens (rotation + révocation)

> **Stockage des médias** : conforme à la note du PDF — la base ne stocke que `mediaUrl`. Les fichiers sont enregistrés sur le disque dans `./uploads` (dev) et servis sous `GET /uploads/:filename`. En production, remplacez `media.service.ts` par un upload S3/Firebase et stockez l'URL retournée.

---

## Endpoints (résumé)

Toutes les routes sont préfixées par `/api`. Voir `/api/docs` pour la doc interactive complète.

### Auth
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/auth/register` | – | Créer un compte. Retourne `{user, accessToken, refreshToken}` |
| POST | `/auth/login` | – | Connexion |
| POST | `/auth/refresh` | – | Échanger un refresh token contre une nouvelle paire (rotation) |
| POST | `/auth/logout` | – | Révoquer un refresh token |
| GET  | `/auth/me` | ✓ | Récupérer l'utilisateur courant |

### Users
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET    | `/users/me` | ✓ | Profil + stats (nb trips, comments, ratings) |
| PATCH  | `/users/me` | ✓ | Modifier `username`, `bio`, `profilePicture`, `password` |
| DELETE | `/users/me` | ✓ | Supprimer son compte (cascade) |
| GET    | `/users/:id` | – | Profil public d'un autre user |
| GET    | `/users/:id/trips` | – | Trips publiés par un user (paginé) |

### Categories
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET    | `/categories` | – | Liste avec compte de trips par catégorie |
| GET    | `/categories/:id` | – | Détail |
| POST   | `/categories` | ✓ | Créer (admin / open dans cette version) |
| PATCH  | `/categories/:id` | ✓ | Modifier |
| DELETE | `/categories/:id` | ✓ | Supprimer |

### Trips (cœur de l'app)
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET    | `/trips` | – | **Recherche/listing** avec filtres : `q`, `location`, `categoryId`, `categorySlug`, `userId`, `username`, `minBudget`, `maxBudget`, `minRating`, `sort` (`recent`/`popular`/`rating`/`budgetAsc`/`budgetDesc`), `page`, `limit` |
| GET    | `/trips/:id` | – | Détail (+ catégorie, owner, médias, rating moyen, compteurs) |
| POST   | `/trips` | ✓ | Créer un trip |
| PATCH  | `/trips/:id` | ✓ | Modifier (owner uniquement) |
| DELETE | `/trips/:id` | ✓ | Supprimer (owner uniquement) |

### Comments
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET    | `/trips/:tripId/comments` | – | Lister les commentaires |
| POST   | `/trips/:tripId/comments` | ✓ | Ajouter un commentaire |
| PATCH  | `/comments/:id` | ✓ | Modifier (auteur uniquement) |
| DELETE | `/comments/:id` | ✓ | Supprimer (auteur uniquement) |

### Ratings
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET    | `/trips/:tripId/ratings` | – | Moyenne, nombre, distribution 1–5 |
| POST   | `/trips/:tripId/ratings` | ✓ | Créer/mettre à jour sa note (`{value: 1..5}`) |
| DELETE | `/trips/:tripId/ratings` | ✓ | Retirer sa note |
| GET    | `/trips/:tripId/ratings/me` | ✓ | Sa note actuelle |

### SavedTrips (planification)
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET    | `/saved-trips` | ✓ | Lister ses trips sauvegardés (triés par priorité) |
| POST   | `/saved-trips` | ✓ | Sauvegarder (`{tripId, notes?, priority?}`) — idempotent |
| PATCH  | `/saved-trips/:id` | ✓ | Modifier `notes`/`priority` |
| DELETE | `/saved-trips/:id` | ✓ | Retirer un saved |
| GET    | `/saved-trips/by-trip/:tripId` | ✓ | Vérifier si un trip est sauvegardé |
| DELETE | `/saved-trips/by-trip/:tripId` | ✓ | Désépingler par tripId |

### Media
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET    | `/trips/:tripId/media` | – | Lister les médias |
| POST   | `/trips/:tripId/media` | ✓ | Upload `multipart/form-data` (field `files`, jusqu'à 10 fichiers, image/* ou video/*) |
| DELETE | `/media/:id` | ✓ | Supprimer (owner du trip) |

---

## Authentification

- **Header** : `Authorization: Bearer <accessToken>`
- L'`accessToken` (JWT) expire au bout de `JWT_ACCESS_EXPIRES_IN` (15 min par défaut).
- Pour obtenir un nouvel `accessToken`, appelez `POST /api/auth/refresh` avec votre `refreshToken`. Le backend fait une **rotation** : l'ancien refresh token est révoqué, un nouveau est émis.
- Les refresh tokens sont stockés en base (`refresh_tokens`) — un logout les révoque.

---

## Exemples (curl)

```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"username":"alice","email":"alice@test.com","password":"secret123"}'

# Login
TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"alice@test.com","password":"secret123"}' \
  | jq -r .accessToken)

# Create a trip
curl -X POST http://localhost:4000/api/trips \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"title":"Tipaza","description":"Roman ruins","location":"Tipaza, Algeria","budget":300,"categoryId":5}'

# Search & filter
curl "http://localhost:4000/api/trips?q=tipaza&minBudget=100&maxBudget=500&sort=popular&page=1&limit=20"

# Browse by category
curl "http://localhost:4000/api/trips?categorySlug=beach"

# Upload media
curl -X POST http://localhost:4000/api/trips/1/media \
  -H "Authorization: Bearer $TOKEN" \
  -F "files=@photo.jpg;type=image/jpeg" \
  -F "caption=View from the top"

# Save a trip
curl -X POST http://localhost:4000/api/saved-trips \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"tripId":1,"notes":"Plan for May, transport by car","priority":3}'
```

---

## Connexion depuis React Native

```ts
// src/api/client.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// Sur émulateur Android, localhost = 10.0.2.2
// Sur device physique, mettez l'IP locale de votre machine
const BASE_URL = 'http://10.0.2.2:4000/api';

async function request(path: string, init: RequestInit = {}) {
  const token = await AsyncStorage.getItem('accessToken');
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  if (!res.ok) throw new Error((await res.json()).error ?? 'Request failed');
  return res.status === 204 ? null : res.json();
}

export const api = {
  login: (email: string, password: string) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  trips: (params: Record<string, string> = {}) =>
    request(`/trips?${new URLSearchParams(params)}`),
  createTrip: (data: object) =>
    request('/trips', { method: 'POST', body: JSON.stringify(data) }),
  saveTrip: (tripId: number, notes?: string) =>
    request('/saved-trips', { method: 'POST', body: JSON.stringify({ tripId, notes }) }),
};
```

> **CORS** : pour autoriser une origine spécifique en production, mettez `CORS_ORIGIN=https://your-app.com,https://other.com` dans `.env`.

---

## Passage à PostgreSQL

1. Modifiez `prisma/schema.prisma` :
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Mettez à jour `.env` :
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/triptale?schema=public"
   ```
3. Réinitialisez les migrations :
   ```bash
   rm -rf prisma/migrations
   npx prisma migrate dev --name init
   npm run seed
   ```

---

## Déploiement

- **Build** : `npm run build` puis `npm start`.
- Hébergeurs simples : **Render**, **Railway**, **Fly.io**, **Heroku**, ou un VPS avec PM2/Docker.
- Pour la **production** :
  - Changez `JWT_ACCESS_SECRET` et `JWT_REFRESH_SECRET` (générez avec `openssl rand -hex 32`).
  - Passez à PostgreSQL.
  - Remplacez le stockage local des médias par S3/Firebase Storage (cf. `media.service.ts`).
  - Mettez `CORS_ORIGIN` à l'origine exacte de l'app mobile (pour le web companion).

---

## Licence
MIT
