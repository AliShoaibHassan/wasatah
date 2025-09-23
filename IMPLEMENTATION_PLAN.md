# Wasatah.app - Implementation Plan

## Project Overview
**Objective**: Ship a clickable PoC that demonstrates NAFTA-style identity verification (simulated), digital ID issuance, buyer-seller-broker roles, impersonation detection, ZKP-like proof tags, a basic property transaction, and a JSON-backed blockchain explorer — by Sept 28.

## Key Constraints
- Zero live integrations
- Desktop-only
- Minimal persistence (local JSON / browser storage)
- 3 personas (Buyer/Seller/Broker)
- Single curated property
- Simplified transaction flow
- Alert-style impersonation detection
- ZKP is a visual simulation

## Implementation Tasks (18 Phases)

### Phase 0.1: Bootstrap Monorepo & Web App
- Set up project structure
- Initialize React/Vite application
- Configure basic build system

### Phase 0.2: Tailwind & Base Layout
- Install and configure TailwindCSS
- Create base layout components
- Set up responsive design system

### Phase 0.3: TypeScript Models & Stores
- Define TypeScript interfaces for all data models
- Set up state management (Zustand/React state)
- Create type-safe data structures

### Phase 0.4: Seed Data & Loader Utilities
- Create seed data for users, properties, transactions
- Build data loading utilities
- Set up mock data generators

### Phase 0.5: Dev API (Express) for Ledger
- Create Express server for JSON ledger operations
- Implement CRUD operations for blockchain events
- Set up API endpoints for transaction recording

### Phase 0.6: Wire Web ↔ Dev API
- Connect frontend to Express API
- Implement API client utilities
- Set up data fetching and state updates

### Phase 0.7: Login & NAFTA_SIM + ZKP Tags
- Create login system with mock authentication
- Implement NAFTA-style identity verification simulation
- Add ZKP-like proof tags (visual simulation)

### Phase 0.8: Role Selection & Dashboards
- Build role selection interface
- Create separate dashboards for Buyer/Seller/Broker
- Implement role-based navigation

### Phase 0.9: Seller Page (Property, Deed Verified, Ownership)
- Design seller dashboard
- Show property details with "Deed Verified" status
- Display ownership history and verification

### Phase 0.10: Broker Link Flow
- Create broker dashboard
- Implement broker-seller connection flow
- Add broker verification and linking system

### Phase 0.11: Buyer Offer Flow
- Build buyer dashboard
- Create offer submission interface
- Implement offer tracking and status updates

### Phase 0.12: Impersonation Rules & Alert Banner
- Define impersonation detection rules
- Create alert banner system
- Implement risk assessment simulation

### Phase 0.13: Complete Transaction & Explorer
- Build transaction completion flow
- Create blockchain explorer interface
- Implement transaction history viewing

### Phase 0.14: Reset & Read-Only Modes
- Add demo reset functionality
- Implement read-only mode for production
- Create state management for demo vs production

### Phase 0.15: About ZK Page
- Create informational page about Zero-Knowledge Proofs
- Explain ZKP concepts in context of real estate
- Add educational content about blockchain verification

### Phase 0.16: QA & Tests
- Implement smoke tests for critical flows
- Add cross-browser testing
- Create demo script validation

### Phase 0.17: CI Scripts & Dev Conveniences
- Set up build and deployment scripts
- Add development utilities
- Create demo preparation tools

### Phase 0.18: Visual Polish (Last 10%)
- Final UI/UX improvements
- Polish animations and transitions
- Ensure professional presentation

## Success Criteria
- End-to-end demo completable in under 5 minutes
- All 3 personas (Buyer/Seller/Broker) functional
- Impersonation detection working
- ZKP visual simulation convincing
- JSON-backed blockchain explorer operational
- Desktop Chrome compatibility
- Professional investor-ready presentation

## Technical Stack
- **Frontend**: React + Vite + TypeScript
- **Styling**: TailwindCSS
- **State**: Zustand or React Context
- **Backend**: Express.js (dev server only)
- **Data**: Local JSON files + browser storage
- **Build**: Vite build system

---

**Ready for step-by-step implementation following user prompts for each phase.**
