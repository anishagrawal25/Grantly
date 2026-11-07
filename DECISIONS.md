# Architecture & Design Decisions (DECISIONS.md)

This document records the fundamental technical, product, and design decisions made while building **Grantly**.

---

### 1. Deterministic Rule-Based Eligibility Engine vs. LLM / AI Call
- **Decision:** Build a pure, deterministic, rule-based TypeScript evaluation engine (`src/lib/eligibility.ts`) rather than sending queries to an LLM or external AI API.
- **Rationale:**
  1. Financial and academic eligibility decisions require 100% mathematical precision and zero hallucination. A student must never be misled about whether they qualify for ₹50,000 in funding.
  2. Pure functions execute synchronously in sub-millisecond time on the client with zero network latency, zero API costs, and zero rate limits.
  3. The engine is fully testable with unit tests (`vitest run`), ensuring regression-proof updates.

---

### 2. Single Source of Truth Architecture (`useMatches`)
- **Decision:** All screens (Money Meter, Dashboard, Discover, Unlock, Wallet, Tracker) derive their calculations from a single custom hook (`useMatches.ts`) that calls `evaluate()` and `summarize()`.
- **Rationale:**
  - Prevents data inconsistency across different tabs. When a user marks an Income Certificate as held or raises their marks from 68% to 75%, the Money Meter count-up, Stat Tiles, Unlock cards, and Discover badges update simultaneously.
  - No page or component is permitted to compute its own totals or filter matching scholarships independently.

---

### 3. LocalStorage Persistence (`grantly-v1`) with Zero Server Auth
- **Decision:** Eliminate traditional login and signup forms entirely. The Onboarding stepper functions as account creation, storing profile and application records directly in `localStorage` under `grantly-v1`.
- **Rationale:**
  1. Students can test and explore Grantly immediately without privacy barriers, OTPs, or password friction.
  2. Data remains strictly on the student's device, respecting user privacy.
  3. Preloaded with one-click demo personas (Priya Deshmukh) for instant evaluation by hackathon judges.

---

### 4. Ordered Income Indexing with 'unknown' State
- **Decision:** Model income as ordered brackets (`'under-2.5L' < '2.5L-5L' < '5L-8L' < 'above-8L'`) with a special `'unknown'` value.
- **Rationale:**
  - Many first-generation or rural students do not yet have an official Tehsildar income certificate.
  - Rather than blocking them or failing all income checks, Grantly marks income-dependent criteria as `unverified` and immediately pipes them into the **Unlock Engine**, illustrating how much funding an income certificate would unlock.

---

### 5. Original 30-Scholarship Dataset Balanced for the Demo Persona
- **Decision:** Handcraft 30 distinct scholarship records representing Central Government schemes, State Quotas (Maharashtra, Karnataka, Tamil Nadu, UP, Bihar), Corporate CSR (Reliance, Tata, Mahindra, Infosys), and Foundation programs.
- **Rationale:**
  - All descriptions and plain summaries are written in 100% original language.
  - Balanced specifically so Priya Deshmukh matches **8 scholarships totaling ₹4,01,000**, with **4 near-miss scholarships totaling ₹2,15,000** unlockable via modest marks improvements or document uploads.

---

### 6. Design System & Accessibility
- **Decision:** Choose a rich, trustworthy financial palette: Forest Deep (`#0B2B20`), Emerald Accent (`#059669`), Canvas Sand (`#F6F3EC`), and Unlock Amber (`#F59E0B`), paired with Fraunces serif display headings and Inter body typography.
- **Rationale:**
  - Avoids the generic "AI dashboard" look in favor of an institutional, high-trust, editorial tone.
  - Respects WCAG 2.1 AA contrast requirements, minimum 44px touch targets on mobile devices, and full `prefers-reduced-motion` compliance across all Framer Motion animations.

