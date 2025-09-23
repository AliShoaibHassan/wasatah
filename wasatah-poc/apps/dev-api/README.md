# Dev API - Wasatah.app

Development API server for the Wasatah.app blockchain real estate PoC.

## Quick Start

```bash
# Install dependencies
npm install

# Setup seed data (first time only)
npm run setup

# Start development server
npm run dev
```

## API Endpoints

### Health
- GET `/health` - Server health

### Ledger
- GET `/api/ledger` - List all ledger events
- POST `/api/ledger/append` - Append a new ledger event (validated + hashed)
- POST `/api/ledger/reset` - Reset and reseed ledger/events

### Users
- GET `/api/users` - List users
- GET `/api/users/:id` - Get user by id
- POST `/api/users` - Create user
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user

### Properties
- GET `/api/properties` - List properties
- GET `/api/properties/:id` - Get property by id
- GET `/api/properties/owner/:ownerId` - List properties by owner
- POST `/api/properties` - Create property
- PUT `/api/properties/:id` - Update property
- DELETE `/api/properties/:id` - Delete property

### Offers
- GET `/api/offers` - List offers
- GET `/api/offers/:id` - Get offer by id
- GET `/api/offers/property/:propertyId` - List offers for a property
- GET `/api/offers/buyer/:buyerId` - List offers by buyer
- GET `/api/offers/seller/:sellerId` - List offers by seller
- POST `/api/offers` - Create offer
- PUT `/api/offers/:id` - Update offer
- DELETE `/api/offers/:id` - Delete offer

## Ledger Event Structure

```json
{
  "type": "user_registered|user_verified|property_listed|property_updated|offer_made|offer_accepted|offer_rejected|transaction_completed|transfer_completed|identity_verification|deed_verification|risk_assessment|impersonation_detected|impersonation_flag|buyer_broker_linked|zkp_check",
  "actorId": "string",
  "actorName": "string",
  "details": { },
  "timestamp": "ISO string",
  "hash": "0x...",
  "signature": "sig_...",
  "blockNumber": 1000,
  "transactionIndex": 0
}
```

## Features

- ✅ CORS for `localhost:5173`
- ✅ Helmet, morgan, JSON body parser
- ✅ Event validation + SHA256 event hashing
- ✅ Seed and reset demo data
- ✅ TypeScript models with CRUD routes (users, properties, offers, ledger)
- ✅ In-memory DB fallback for local dev (no external services required)

## Scripts

- `npm run dev` - Start dev server with tsx watch
- `npm run setup` - Copy seed data files (first run)
- `npm run reset` - Reset data via API call
- `npm run build` - TypeScript build
- `npm run lint` - ESLint

## Configuration

- Port: `3001` (override with `PORT`)
- CORS: `http://localhost:5173`, `http://127.0.0.1:5173`
- Data: seeded via code (`utils/seedData.ts`)
- Database: In-memory fallback is used by default; see "Database" below

## Database

The code includes a MongoDB client wrapper, but `connectToDatabase()` currently uses an in-memory store for development to avoid external dependencies. Data does not persist across restarts.

If you later enable MongoDB, move credentials to environment variables and remove any hardcoded URIs.

## Examples

```bash
# Health
curl http://localhost:3001/health

# List events
curl http://localhost:3001/api/ledger

# Append event
curl -X POST http://localhost:3001/api/ledger/append \
  -H "Content-Type: application/json" \
  -d '{
    "type": "user_registered",
    "actorId": "user_001",
    "actorName": "John Doe",
    "details": {"email": "john@example.com"}
  }'

# Reset ledger
curl -X POST http://localhost:3001/api/ledger/reset
```

## Notes

- Server seeds demo users, properties, offers, risk flags, and ledger events on first run/reset.
- Ledger events are returned newest-first.
- Hash and signature are generated per event for blockchain-like UX.
