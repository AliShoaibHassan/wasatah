# Wasatah.app - Blockchain + AI Real Estate PoC

A monorepo containing the Wasatah.app proof-of-concept demonstrating NAFTA-style identity verification (simulated), digital ID issuance, buyer-seller-broker roles, impersonation detection banners, ZKP-like proof tags (visual), and a JSON-backed blockchain explorer UI.

## 🏗️ Project Structure

```
wasatah-poc/
├── apps/
│   ├── web/          # React + TypeScript + Vite + Tailwind + Router + Zustand
│   └── dev-api/      # Node 20 + Express 4 API server (in-memory storage)
├── package.json      # Root package.json with npm workspaces
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm 9+

### Install & Run
```bash
# Install all workspaces
yarn || npm install

# Start both web + API (default ports: 5173, 3001)
npm run dev

# Or start individually
npm run dev:web    # http://localhost:5173
npm run dev:api    # http://localhost:3001
```

### Readonly build (no API required)
```bash
# Build web to use bundled seed data (no backend calls)
npm run build:readonly
```
This produces a static build that reads `src/data/ledger.seed.json` via the store fallback.

## 📱 Web Application (apps/web)

- React 18, TypeScript, Vite, TailwindCSS
- React Router routes:
  - `/` and `/login` – Login mock
  - `/role` – Role selection (Buyer/Seller/Broker)
  - `/seller`, `/broker`, `/buyer` – Role dashboards
  - `/explorer` – Blockchain explorer
  - `/about-zk` – About Zero-Knowledge (informational)
- Zustand stores: auth, role, ledger, offers, properties, security banners
- Read-only mode: when built with `VITE_READONLY=true`, the UI uses local seed data and disables mutating calls

## 🔧 Development API (apps/dev-api)

- Express 4 + TypeScript
- Routes mounted under `/api`: `ledger`, `users`, `properties`, `offers`
- Health: `GET /health`
- Ledger: `GET /api/ledger`, `POST /api/ledger/append`, `POST /api/ledger/reset`
- Users/Properties/Offers: full CRUD and filtered list endpoints
- Storage: in-memory database fallback in `src/config/database.ts` (data resets on restart)

## 🎯 Demo Flow

1. Login (mock credentials)
2. Select a role
3. View role dashboard and data
4. Make or view offers, see verifications, check explorer
5. Reset demo to reseed data

## 🛠️ Commands

```bash
# Root
npm run dev           # Start web + API
npm run build         # Build web
npm run build:readonly
npm run lint          # Lint all workspaces
npm run format        # Prettier write

# Web
npm run dev --workspace=apps/web
npm run build --workspace=apps/web

# API
npm run dev --workspace=apps/dev-api
npm run setup --workspace=apps/dev-api
npm run reset --workspace=apps/dev-api
```

## 📋 Key Features

### Identity & ZKP (Simulated)
- Digital ID with verification flags and risk score (UI only)
- ZKP-like proof tags on events (no real cryptography beyond hashes)

### Role-Based UX
- Buyer, Seller, Broker pages with tailored content

### Blockchain Explorer
- Event list with types, hashes, signatures, and metadata
- SHA-256 hashing of event payloads on the server

### Impersonation Detection (UI)
- Risk banner and flags seeded in demo data

## 🔒 Security & Data Notes

- This is a PoC; no real auth, KYC, or blockchain
- All data is synthetic. API uses in-memory storage by default;
  nothing persists across restarts.
- Do not put secrets in source. If enabling MongoDB later,
  move URIs to environment variables.

## 📚 Documentation

- `apps/dev-api/README.md` – API setup and endpoints
- `apps/web/README.md` – Web app usage (to be expanded)
- `PROJECT_BRIEF.md` – Project requirements
- `IMPLEMENTATION_PLAN.md` – Planned phases

---

Status: ✅ Bootstrap complete; core pages, stores, and API wired in dev.
