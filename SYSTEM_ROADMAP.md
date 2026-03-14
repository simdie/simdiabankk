# BANK OF ASIA — SYSTEM ROADMAP

> A production-grade, god-tier digital banking platform built with Next.js 15,
> Prisma, Supabase, NextAuth v5, and a bespoke glassmorphism design system.

---

## PHASE 1 — Foundation & Design System ✅
**Goal:** Scaffold the project, install all dependencies, define the data model, and build the design system.

### Deliverables
- [x] Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- [x] All production dependencies installed
- [x] `.env` with all placeholders labeled
- [x] Prisma initialized with full `schema.prisma`
  - User (roles, statuses, 2FA, transfer token)
  - Account (multi-currency, 12-digit number)
  - VirtualCard (VISA/Mastercard, 16-digit)
  - Transaction (all types, email confirm, transfer token)
  - SystemSettings (singleton, global controls)
  - AuditLog (full traceability)
- [x] Tailwind v4 design tokens (colors, fonts, animations, shadows)
- [x] `globals.css` with full component library (glass cards, buttons, inputs, badges, table, nav, animations)
- [x] Root layout with Syne + DM Sans + JetBrains Mono fonts
- [x] SYSTEM_ROADMAP.md

---

## PHASE 2 — Authentication & User Onboarding
**Goal:** Complete auth flow — registration, login, 2FA, email verification, session management.

### Deliverables
- [ ] NextAuth v5 configuration (`auth.ts`) with JWT + Prisma adapter
- [ ] `bcryptjs` password hashing (12 rounds)
- [ ] Registration API (`POST /api/auth/register`)
  - Zod validation
  - Email uniqueness check
  - Auto-create USD account with 12-digit account number
  - Welcome email via Nodemailer
  - Status: PENDING_ACTIVATION (admin must activate)
- [ ] Login page — dark glassmorphism design, animated
- [ ] Registration page — multi-step form with animated transitions
- [ ] TOTP 2FA setup flow
  - QR code generation with `qrcode`
  - Secret generation with `speakeasy`
  - 6-digit verification step
  - Backup codes
- [ ] 2FA challenge page (shown after password if enabled)
- [ ] "Forgot Password" flow with email token
- [ ] Auth middleware (protect all `/dashboard/*` routes)
- [ ] Account status gate (RESTRICTED shows `restrictionMessage`, DISABLED blocks)
- [ ] Admin middleware (protect all `/admin/*` routes)

---

## PHASE 3 — User Dashboard
**Goal:** Full user-facing banking experience — accounts, cards, transfers, history.

### Deliverables
- [ ] Dashboard layout (sidebar navigation, topbar, responsive)
- [ ] **Overview page** (`/dashboard`)
  - Account balance cards (animated number counter)
  - Recent transactions feed
  - Quick action buttons (Send, Receive, Cards, History)
  - Spending summary widget
- [ ] **Accounts page** (`/dashboard/accounts`)
  - All accounts with currency flags
  - Account details modal
  - Copy account number
- [ ] **Virtual Cards page** (`/dashboard/cards`)
  - 3D-flip card UI (front/back toggle)
  - Freeze/unfreeze card
  - Card details reveal (with confirmation)
  - Request new card
- [ ] **Transfer — Internal** (`/dashboard/transfer/internal`)
  - Send to another Bank of Asia account by account number
  - Zod validation
  - Email confirmation gate (if enabled in system settings)
  - Transfer token gate (if enabled in system settings)
  - Success animation
- [ ] **Transfer — Local Wire** (`/dashboard/transfer/local`)
  - Beneficiary form (name, bank, routing, account)
  - Pending status flow
- [ ] **Transfer — International Wire** (`/dashboard/transfer/international`)
  - Beneficiary form (name, bank, SWIFT/BIC, IBAN, country, address)
  - Currency selector
  - Pending status flow
- [ ] **Transaction History** (`/dashboard/history`)
  - Filterable, sortable data table
  - Status badges
  - Transaction detail modal
  - Download receipt as PDF (`@react-pdf/renderer`)
- [ ] **Profile & Security** (`/dashboard/profile`)
  - Update personal info
  - Change password
  - Enable/disable 2FA
  - Active sessions
- [ ] Email confirmation flow for transfers
  - Unique token link in email
  - `/api/transfer/confirm/[token]` endpoint

---

## PHASE 4 — Admin Control Panel
**Goal:** Full god-mode admin panel — user management, transaction oversight, system controls.

### Deliverables
- [ ] Admin layout (`/admin`) with separate sidebar
- [ ] **Admin Dashboard** — KPI cards (total users, balances, transactions today, pending)
- [ ] **User Management** (`/admin/users`)
  - List all users with search/filter
  - View user profile, accounts, cards, transactions
  - **Activate** user (PENDING_ACTIVATION → ACTIVE)
  - **Restrict** user with custom `restrictionMessage`
  - **Disable** user account
  - **Unlock** restricted/disabled user
- [ ] **Account Management** (`/admin/accounts`)
  - View all accounts
  - **Admin Deposit** (add funds to any account)
  - **Freeze/Unfreeze** account
  - Adjust balance (with audit trail)
- [ ] **Transaction Management** (`/admin/transactions`)
  - View all transactions
  - **Approve/Reject** AWAITING_CONFIRMATION transactions
  - Complete PENDING wire transfers
  - Force-fail a transaction
- [ ] **Virtual Cards** (`/admin/cards`)
  - View all cards
  - Cancel/reactivate cards
- [ ] **System Settings** (`/admin/settings`)
  - Toggle `requireEmailConfirmForTransfers`
  - Toggle `requireTokenForTransfers`
  - Set `maxDailyTransferUSD`
  - Set/clear `globalNotice` (banner for all users)
  - Toggle `maintenanceMode` (shows maintenance page)
  - Manage transfer tokens (generate for specific users)
- [ ] **Audit Log** (`/admin/audit`)
  - Full searchable audit trail
  - Filter by user, action, date range
- [ ] Admin seed script (`scripts/seed-admin.ts`)

---

## PHASE 5 — Production Hardening & Polish
**Goal:** Make it bulletproof, beautiful, and deployable.

### Deliverables
- [ ] **Security**
  - Rate limiting on auth endpoints (custom middleware)
  - CSRF protection
  - Security headers (`next.config.ts`)
  - Input sanitization (all Zod schemas)
  - IP address logging on all sensitive actions
  - Session invalidation on password change
- [ ] **PDF Receipts** (`@react-pdf/renderer`)
  - Beautifully designed transaction receipt
  - Bank of Asia letterhead
  - Download from transaction history
- [ ] **Email Templates** (Nodemailer + HTML)
  - Welcome email
  - Transfer confirmation email
  - Password reset email
  - Account status change notification
  - Global notice email
- [ ] **Maintenance Mode**
  - Global middleware check against SystemSettings.maintenanceMode
  - Beautiful maintenance page (exempt: `/admin/*`)
- [ ] **Error Pages**
  - `not-found.tsx` — branded 404
  - `error.tsx` — graceful error boundary
  - `loading.tsx` — skeleton screens for all pages
- [ ] **Performance**
  - Image optimization
  - Bundle analysis
  - Lazy loading for heavy components
- [ ] **Accessibility**
  - ARIA labels on all interactive elements
  - Keyboard navigation
  - Focus management in modals
- [ ] **Deployment**
  - Vercel deployment configuration
  - Supabase production database migration
  - Environment variable checklist
  - Post-deploy smoke test checklist

---

## Architecture Notes

```
bank_of_asia/
├── app/
│   ├── (auth)/              # Login, Register, 2FA pages
│   ├── (dashboard)/         # User dashboard (protected)
│   ├── (admin)/             # Admin panel (protected + role check)
│   ├── api/                 # API routes
│   │   ├── auth/            # NextAuth + register
│   │   ├── accounts/        # Account APIs
│   │   ├── cards/           # Card APIs
│   │   ├── transfer/        # Transfer APIs + confirm
│   │   └── admin/           # Admin APIs
│   ├── layout.tsx           # Root layout (fonts, metadata)
│   └── globals.css          # Design system
├── components/
│   ├── ui/                  # Atoms (Button, Input, Badge, Modal)
│   ├── bank/                # Molecules (BankCard, TransactionRow)
│   ├── dashboard/           # Dashboard-specific components
│   └── admin/               # Admin-specific components
├── lib/
│   ├── auth.ts              # NextAuth config
│   ├── prisma.ts            # Prisma singleton client
│   ├── email.ts             # Nodemailer helpers
│   ├── utils.ts             # Account number gen, reference gen, etc.
│   └── validations.ts       # Zod schemas
├── prisma/
│   ├── schema.prisma        # Full data model
│   └── seed.ts              # Admin seeder
├── scripts/                 # Utility scripts
├── public/                  # Static assets
├── .env                     # Environment variables
└── SYSTEM_ROADMAP.md        # This file
```

---

*Bank of Asia — Built for the future of digital finance.*
