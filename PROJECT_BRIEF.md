# Wasatah.app - Complete Project Brief

## Executive Summary

Wasatah.app is a blockchain + AI-inspired real-estate PoC for the Saudi market. This proposal outlines a 2-week schedule to develop a PoC that achieves investor-ready, end-to-end demo functionality through simplified complex logic using static/mocked flows.

**Core Demo Flow**: Login → Browse Verified Property → Make Offer → (Lightweight) Escrow → Ownership Transfer Record

## Goals & Success Criteria

### Primary Goal
Demonstrate a fraud-aware, transparent buyer journey that investors can click through in ~5 minutes.

### Success Criteria
- Users can sign in and see a Verified ID badge and Deed Verified property card
- Users can complete a guided flow: Login → Browse → Offer → Transfer Recorded
- Blockchain Explorer shows a concise activity log (listed → offer made → ownership transfer)
- Identity Impersonation Indicator appears when simulated risk conditions are met (static rule), proving a clear path to production-grade KYC/AML later

## Scope

### In-Scope
1. **Authentication (Mocked)**: Static user(s) login; no database or real auth provider
2. **Verified Identity (Simulated)**: A static "Verified ID" badge; no live KYC integration
3. **Property Listings (Minimal)**: One curated listing with a Deed Verified label and a mocked ownership chain (short timeline)
4. **Offer Flow (Lightweight)**: "Make Offer" button captures a number and shows "Offer Locked". No complex validations
5. **Escrow (Placeholder)**: Visual state change only (e.g., "Funds Locked" tag). No rules engine or timed auto-release
6. **Ownership Transfer (Mocked)**: A success screen + an entry recorded into a static activity log
7. **Blockchain Explorer (Static/Read-only)**: Frontend view reads from a local JSON ledger file (pre-seeded + minimally appended in memory)
8. **Identity Impersonation Indicator (Simulated)**: Banner triggered by simple, hardcoded conditions (e.g., reused email/phone pattern)

### Out-of-Scope (For Later Phases)
- Real authentication (OAuth/social sign-in, MFA) and sensitive data storage
- Production KYC/AML, biometric verification, or external identity providers
- Dynamic smart contracts, real chains, or hosted blockchain nodes
- Full rules engine for escrow and offer validation (min offer, timers, counter-offers)
- Mobile responsiveness and accessibility hardening (desktop-first only)
- Comprehensive documentation, localization, analytics, or CMS

## User Journey (Demo Script Outline)

1. **Login**: Enter demo credentials → see dashboard with Verified ID badge
2. **Browse Listing**: One featured property shows Deed Verified and Ownership History
3. **Make Offer**: Enter amount → see "Offer Locked" confirmation
4. **Transfer**: Click Complete Transaction → see Ownership Transfer success state
5. **Explore Ledger**: Open Blockchain Explorer → view 3-4 events (listed, offer, transfer)
6. **Identity Risk**: Trigger Identity Impersonation Indicator on a pre-set demo user to demonstrate anti-impersonation concept

## Technical Approach

- **Architecture**: Frontend-centric SPA reading/writing a local JSON ledger (via a minimal dev server stub)
- **Data**: In-repo JSON files (seeded); basic append for demo events (guarded; resets on refresh if needed)
- **Security**: No real PII; demo-only placeholders. Disable writes in production builds
- **Stack (suggested)**:
  - UI: React + Vite (or Next.js in static mode)
  - State: Minimal (React state/Zustand)
  - Styling: TailwindCSS
  - Dev server: Node/Express stub for JSON append during demo
  - Hash stub: crypto lib to generate pseudo signatures

## Identity Impersonation (PoC vs. Production)

### PoC (this build)
- Trigger a red-flag banner if the demo account uses a known "test" phone/email pattern or reuses an identifier already present in seed data
- Show a Risk Notes panel explaining what would trigger this in production

### Production (future)
- KYC/AML provider integration (ID scans, document checks)
- Biometrics & liveness for high-value actions
- Duplicate identity graph (e.g., same face/doc across multiple profiles)
- Device & behavioral signals (velocity, IP risk, typing cadence)
- Continuous trust score combining signals with explainable rules

## Acceptance Criteria

- **A1**: Login works with demo credentials and displays a Verified ID badge
- **A2**: Property detail shows Deed Verified and 3-4 step Ownership History
- **A3**: Offer flow captures an amount and shows Offer Locked
- **A4**: Completing a transaction appends a transfer_completed event and surfaces it in Explorer
- **A5**: Identity Impersonation Indicator can be reliably triggered for the demo identity and is visible on the profile and checkout screens
- **A6**: End-to-end demo can be completed in under 5 minutes on desktop Chrome

## Assumptions, Dependencies, Constraints

- No real data; all content is synthetic for demo
- No cloud/back-office; local/dev server only for JSON append
- Single property + minimal events for clarity
- Desktop Chrome as the demo baseline

## Risks & Mitigations

- **Expectation Creep**: Client expects real AI/KYC → Mitigation: Clear "Simulated" labels and a production roadmap note
- **Demo Fragility**: JSON append may desync → Mitigation: "Reset Demo" button to reload seed state
- **Time Overrun**: UI polish can balloon → Mitigation: Strict desktop-only scope; reusable components
- **Security Perception**: Fake signatures misunderstood → Mitigation: Explicitly label as pseudo-hash and explain future on-chain plan

## Testing Strategy (Lean)

- Smoke E2E: Login → Browse → Offer → Complete → Explorer
- Cross-Browser (Light): Latest Chrome/Edge on desktop
- Trigger Tests: Verify identity red-flag surfaces consistently
- Reset Flow: Ensure reset returns app to seeded state

## Handover & Next Steps (Post-Demo)

### Phase-2 Plan
- Integrate real KYC/AML & basic biometric check
- Replace JSON ledger with a proper backend (or on-chain writes to a testnet)
- Expand listings, add seller portal, add escrow rule engine
- Add mobile responsiveness and accessibility hardening

## Demo FAQs

**Q: Is the blockchain real?**
A: PoC uses a local, append-only JSON ledger to demonstrate transparency; future phases can write to testnet/mainnet.

**Q: Is the identity check real?**
A: No—simulated flags for demo. Production would integrate KYC/AML and biometrics.

**Q: Why only one property?**
A: To keep effort to 50% while ensuring a clear, testable narrative.

**Q: Can we show offers/escrow rules?**
A: A minimal placeholder is included; full rule engine is proposed for Phase-2.
