# Wasatah Web (React + TypeScript + Vite)

Frontend for the Wasatah.app PoC featuring role-based dashboards, a blockchain explorer, and simulated digital ID/verification UX.

## Quick Start

```bash
# Install deps from repo root (recommended)
npm install

# Start web (port 5173)
npm run dev --workspace=apps/web

# Build
npm run build --workspace=apps/web

# Readonly build (no API required)
npm run build:readonly --workspace=apps/web
```

## Routes

- `/` and `/login` — Login (mock)
- `/role` — Role selection
- `/seller` — Seller dashboard
- `/broker` — Broker dashboard
- `/buyer` — Buyer dashboard
- `/explorer` — Blockchain explorer
- `/about-zk` — About Zero-Knowledge (informational)

## State Stores (Zustand)

- `useAuthStore` — mock auth/session state
- `useRoleStore` — selected role
- `usePropertyStore` — properties listing
- `useOfferStore` — offers and submission
- `useLedgerStore` — blockchain events
- `useSecurityStore` — risk flags and banners

## Data Flow

- By default the UI calls the Dev API (`/api/*`).
- If `VITE_READONLY=true` at build time, `useLedgerStore` loads events from `src/data/ledger.seed.json` and disables mutating calls.

## Components

- Layout: `Container`, `Section`, `PageHeading`, `TopBar`
- UI: `Card`, `Badge`, `Banner`, `Notification`, `PropertyEditModal`

## Notes

- This app is a PoC; login, identity, ZKP, and risk detection are simulated.
- TailwindCSS used for styling; see `tailwind.config.js` and `src/index.css`.
