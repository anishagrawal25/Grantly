# Grantly — Unified Scholarship Discovery & Management Platform

> **"See the funding you're eligible for. Claim it."**

Grantly rethinks how students discover scholarships, understand eligibility options, navigate complex requirements, and track application deadlines. Instead of wading through hundreds of confusing PDF notices, students tell Grantly about their academic and social profile once, and receive immediate **funding intelligence**.

---

## 🌟 Key Highlights & Demo Persona

Grantly is calibrated around a realistic student persona for instant demonstration:
- **Priya Deshmukh**, 19, second-year B.Tech (Computer Engineering) student in Maharashtra.
- **Category:** OBC · **Gender:** Female · **Annual Family Income:** ₹4,50,000 (₹2.5L–5L).
- **Academic Score:** 68% in last exam · **First-generation college learner.**

### What Grantly Delivers:
1. **The Money Meter:** Instantly counts up to **₹4,01,000** in eligible funding across 8 matched scholarships, with an interactive 3-segment funding distribution bar.
2. **Deterministic Eligibility Engine:** Clear, plain-language reasoning for every criterion. No vague rejections—students see exact criteria: passed, failed, or unverified.
3. **The Unlock Engine:** Pinpoints opportunities just **1 step away** (e.g. lifting marks from 68% to 75% unlocks ₹1,45,000 in Reliance Merit and Mahindra grants).
4. **Offline Document Wallet:** A 10-document device checklist that links directly to scholarship readiness.
5. **Application Roadmap & Tracker:** A 5-stage scholarship journey stepper, 4-column Kanban board (Saved, Preparing, Applied, Outcome), and an active Deadline Radar.

---

## 🛠️ Tech Stack

- **Framework:** React 18 + Vite + TypeScript (Strict Mode)
- **Styling:** Tailwind CSS v3 with custom finance-grade forest palette (`#0B2B20`, `#059669`, `#F6F3EC`)
- **Animation:** Framer Motion (page transitions, count-up animations, stagger grids, reduced-motion compliance)
- **State Management:** Zustand with `persist` middleware (`grantly-v1` in `localStorage`)
- **Routing:** React Router v6 with SPA history rewrites
- **Icons:** Lucide React
- **Dates & Currency:** `date-fns` & `Intl.NumberFormat` with Indian grouping (`formatINR`)
- **Testing:** Vitest unit test suite covering 100% of eligibility criteria rules

---

## 🚀 Getting Started

### Prerequisites
Node.js 18+ and npm.

### Installation
```bash
git clone https://github.com/dhruvpatil/grantly.git
cd grantly
npm install
```

### Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### Run Unit Tests
```bash
npm test
```
Runs 11 automated Vitest unit tests verifying the pure eligibility engine, income bracket indexing, marks boundaries, disability quotas, and money summary aggregation.

### Production Build & Linting
```bash
npm run build
npm run lint
```

---

## 🧭 Architecture & Single Source of Truth

Grantly enforces a strict **Single Source of Truth (`useMatches`)** architecture:
- Profile, held documents, deadlines, and application stages reside in a single persisted Zustand store.
- The pure `evaluate()` and `summarize()` functions evaluate all 30 scholarships reactively whenever the profile or wallet changes.
- **No component computes its own totals.** Updating an income certificate or marks percentage immediately and synchronously updates the Money Meter, Stat Tiles, Discover cards, and Unlock Engine simultaneously.

---

## ⚖️ Honesty Principle

> *Demo data. Eligibility is indicative and subject to official verification on the provider's portal.*
> All scholarship amounts, criteria, and deadlines are illustrative demo records written in 100% original language. Grantly does not submit legal applications to external portals; it links directly to official government and foundation portals for final submission.

---

## 🗺️ Future Roadmap

- Real backend profile synchronization and multi-device authentication.
- DigiLocker API integration for automated, one-click document verification.
- Push and WhatsApp webhook notifications for upcoming application deadlines.
- Multi-lingual support in Hindi, Marathi, Tamil, and Bengali.

