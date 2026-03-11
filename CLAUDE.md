# TripQuest — CLAUDE.md

> This file is the authoritative context document for Claude Code working on the TripQuest
> monorepo. Read it fully before starting any task. It is a living document — update it as
> decisions are made.

---

## Project Overview

TripQuest is a travel app that builds AI-generated itineraries based on user preferences.
The concept: you fly into a city you've never been to, you're at your hotel, you don't know
where to go or what to do. You open TripQuest, fill in your preferences, and the AI builds
you a quest — a series of nearby locations to visit. Complete the quest by checking in at
each stop, and earn TRIPQ tokens and NFT badges as rewards.

**Core loop:** Set preferences → AI generates quest → navigate to locations → check in at
each stop → earn TRIPQ tokens + NFT badge

**Token utility:** After earning TRIPQ, users can hold, swap to BTC, or optionally donate
to a charity tied to their destination. Donation is a minor feature, not a core pillar.

**Current phase:** MVP (3-month roadmap, March–May 2026). Devnet only.
Demo target: Saint Cloud, MN (3-month), Minneapolis launch (6-month).
Consensus Miami: May 5–7 2026. WebSummit Portugal: Nov 9–12 2026 (booth + live pitch).

**What MVP delivers:**
- Wallet connection (Phantom)
- User preferences (AI-driven)
- AI-generated quests (ElevenLabs agent)
- Quest map with stop navigation
- QR code check-in at locations
- TRIPQ token reward on quest completion
- NFT badge minting on quest completion
- Basic donation option post-reward

**What MVP does NOT deliver (Phase 2+):**
- XP / leveling / streaks / leaderboards
- Merchant discounts and NFC shop partnerships
- GPS-based check-in validation
- AR location scanning (Greg's long-term vision — see below)
- Solana Pay check-in mechanic
- Embedded wallets (Privy / Dynamic / Magic)
- User-generated quests
- Full gamification system
- Staking / governance
- Mapbox or full map integration
- Apple Watch / wearables
- Helium / IoT / LIDAR
- Arweave permanent storage
- Render Network / GPU compute
- Midnight ZK privacy layer

Do not scaffold, suggest, or stub out Phase 2+ features unless explicitly asked.

---

## Team & Roles

| Person | Role | Owns |
|--------|------|------|
| Jake (Jakob Johnson) | Blockchain Engineer (Freelance) | Everything technical: mobile app, backend, smart contracts, AI integration, architecture |
| Greg | CEO / Product / Sales | Figma designs, TRIPQ token creation, business development, landing page, conference attendance |

**Jake is the entire technical team.** There is no backend team, no frontend team, no DevOps
team. When Claude Code makes suggestions, they should be actionable by one person.
Do not suggest "coordinate with your backend team" or "have your designer update the
Figma." Jake implements Greg's Figma designs faithfully — he does not redesign screens.
Greg shares Figma files; Jake builds them.

**Greg's north star:** Maximum decentralization within budget. Prefer decentralized
solutions where cost-effective. Current reality: GitHub + Supabase + Vercel for MVP
(centralized but pragmatic), Pinata/IPFS for NFT/badge storage (decentralized where it
matters most), Midnight ZK privacy layer on future roadmap.

---

## Tech Stack (Confirmed MVP)

| Layer | Choice | Notes |
|-------|--------|-------|
| Blockchain | Solana + Anchor (Rust) | 100% confirmed. Devnet for now → mainnet later. |
| Token | TRIPQ (SPL, 100M supply) | Greg handles creation. Do not generate token creation code. |
| Mobile | React Native + Expo (managed workflow) | Monorepo structure. NativeWind for styling. |
| Wallet (3-month) | Phantom via Solana Mobile Wallet Adapter | `@solana-mobile/mobile-wallet-adapter` |
| Wallet (6-month) | Embedded wallet — Privy / Dynamic / Magic | TBD. May stick with Phantom depending on audience. |
| AI / Voice | ElevenLabs Agents (Conversational AI 2.0) | Full pipeline: ASR → LLM orchestration → TTS. Not just a voice layer. |
| Backend | Supabase Pro ($25/mo) | Auth, Postgres, Edge Functions, Storage, Realtime |
| Decentralized Storage | Pinata / IPFS | Badge artwork, user-generated media, proof-of-completion photos |
| Hosting | Vercel | |
| Email | Proton (dev@tripquest.ai) | Greg owns domain + gregory@tripquest.ai |
| Version Control | GitHub org: `tripquest`, repo: `tripquest-app` | |
| Mapping | TBD — Mapbox vs ViroReact | Needs evaluation. Multi-transport: driving, biking, walking. Phase 2. |

### Key Libraries (Expected)

**Mobile (React Native / Expo)**
- `expo` — managed workflow
- `@solana-mobile/mobile-wallet-adapter` — Phantom wallet connection
- `@elevenlabs/react-native` — ElevenLabs voice SDK
- `@supabase/supabase-js` — Supabase client
- `nativewind` — Tailwind-style styling for React Native
- `expo-router` — file-based navigation

**Blockchain (Anchor / Rust)**
- `anchor-lang` — Solana smart contract framework
- `anchor-spl` — SPL token interactions
- `@coral-xyz/anchor` — TypeScript client for Anchor programs
- `@solana/web3.js` — Solana JS SDK

**Backend (Supabase)**
- Supabase Edge Functions (Deno/TypeScript) for quest verification logic
- Supabase Postgres for all off-chain data
- Supabase Storage for media

---

## Monorepo Structure

```
tripquest-app/
├── apps/
│   └── mobile/                  # React Native + Expo app
│       ├── app/                 # expo-router file-based routes
│       ├── components/          # Reusable UI components
│       ├── hooks/               # Custom React hooks
│       ├── lib/                 # Supabase client, ElevenLabs setup, wallet config
│       ├── assets/              # Images, fonts, static assets
│       └── constants/           # Colors, config, quest types, etc.
├── packages/
│   └── shared/                  # Shared TypeScript types, utils, constants
│       ├── types/               # Shared types (Quest, User, Badge, Token, etc.)
│       └── utils/               # Shared utility functions
├── programs/                    # Anchor smart contracts (Rust)
│   ├── quest-rewards/           # Releases TRIPQ tokens on quest completion
│   └── badge-nft/               # Mints cNFTs on quest completion
├── supabase/                    # Supabase config and edge functions
│   ├── functions/               # Edge Functions (quest verification, etc.)
│   └── migrations/              # Postgres schema migrations
├── CLAUDE.md                    # This file
├── package.json                 # Workspace root
├── pnpm-workspace.yaml          # pnpm monorepo config
└── README.md
```

**Why this structure:**
- `apps/mobile` is isolated so a web app could be added later without restructuring
- `programs/` mirrors Anchor's conventional workspace layout
- `supabase/` keeps DB migrations and edge functions co-located with the repo
- `packages/shared` prevents type duplication between mobile app and edge functions

---

## Architecture: How the Layers Connect

```
Mobile App (React Native + Expo)
    ├── Solana Mobile Wallet Adapter → Phantom wallet
    ├── ElevenLabs React Native SDK → AI voice companion
    └── Supabase JS client → auth, database, realtime

         │
         ▼

Supabase (Off-chain backend)
    ├── Auth (wallet-linked user profiles)
    ├── Postgres (quest content, user data, analytics)
    ├── Edge Functions (quest verification logic)
    └── Storage (user media)

         │ (on verified check-in)
         ▼

Solana Blockchain (Devnet → Mainnet)
    ├── Quest Rewards Program (releases TRIPQ to user wallet)
    └── Badge NFT Program (mints cNFT, artwork on IPFS)

         │
         ▼

Pinata / IPFS
    ├── Badge artwork
    ├── User-generated media
    └── Proof-of-completion photos
```

### Quest Verification Flow (Option C Hybrid)
This is the critical flow. Understand it before touching any quest-related code:

1. User arrives at a quest location and scans a QR code
2. QR code triggers the mobile app with a payload (quest ID + location ID)
3. Supabase Edge Function validates the check-in:
   - Is this the right quest location?
   - Has this user already checked in here?
   - Is the timestamp reasonable? (anti-cheat)
4. On valid check-in, Edge Function calls the Quest Rewards smart contract
5. Smart contract releases TRIPQ tokens to the user's wallet
6. If final quest stop: Badge NFT Program mints a cNFT to the user's wallet

**The verification trigger is intentionally abstracted.** For MVP it's a QR code scan.
Later it will evolve: NFC tags → GPS validation → Solana Pay (a merchant payment counts
as a check-in) → AR scanning (Greg's endgame vision: point phone at building, neon green
outline scans it, triggers check-in). Build the Supabase edge function and smart contract
so the *trigger mechanism* can be swapped without touching reward logic.

Do not couple the reward/minting logic to QR codes specifically.

---

## On-Chain vs Off-Chain Split

This is a critical architectural decision. Do not move things between layers without
explicit discussion.

### On-Chain (Solana smart contracts)
- TRIPQ token transfers (reward payouts)
- NFT badge minting (cNFTs on quest completion)
- Donation transactions (token transfer to cause wallets — Phase 2)
- Quest authorship records (provable ownership for user-generated quests — Phase 2)

### Off-Chain (Supabase)
- User profiles and preferences (encrypted, wallet-linked)
- Quest content (descriptions, location data, QR codes, media URLs)
- Reviews and ratings
- Session data and app state
- Analytics (foot traffic, engagement data)
- Trip metadata (sold as aggregate CSV/dashboard data to tourism boards — NOT individual data)

### IPFS (Pinata)
- Badge artwork files
- User-generated media (review photos, etc.)
- Proof-of-completion photos

### Future: Midnight Privacy Layer (NOT MVP)
- ZK preference proofs (user proves quest eligibility without revealing preferences)
- Privacy-preserving data sharing
- TripQuest stays on Solana and calls into Midnight for ZK proofs. No rebuild required.
- Hoskinson/Yakovenko backed Solana-Cardano bridge (Dec 2025). LayerZero integration
  confirmed. Midnight mainnet launching late March 2026.
- Greg applied for Midnight accelerator (April 2026) for investment/PR/connections only.
  Do not build on Midnight yet.

---

## Smart Contracts (Anchor / Rust)

### Programs Needed for MVP

**1. Quest Rewards Program** (`programs/quest-rewards/`)
- Accepts an instruction from an authorized signer (Supabase backend keypair)
- Transfers a defined amount of TRIPQ from the treasury to the user's wallet
- Validates: authorized caller, user hasn't already been rewarded for this quest
- This is the most critical program — get it right before badge minting

**2. Badge NFT Program** (`programs/badge-nft/`)
- Mints a compressed NFT (cNFT) to the user's wallet on quest completion
- Badge artwork URI comes from Pinata/IPFS (stored before minting)
- Uses Metaplex Bubblegum for cNFT minting (cheaper than standard NFTs)

### Programs NOT needed for MVP (Phase 2)
- Escrow program
- Donation program
- Staking program
- Governance program
- Token vesting program (Jake's own vesting is Greg's responsibility)

### Important Notes on Rust / Anchor
- Jake is learning Rust and Anchor from scratch. He has strong Solidity experience
  (DeFi staking, DAOs, ERC-1155, ERC-4626, LayerZero cross-chain) so blockchain
  concepts are not new — only the language and framework are.
- When writing Anchor code: explain the pattern, not just the code. Add comments
  for Rust-specific concepts (ownership, borrowing, lifetimes) when they appear.
- Anchor abstracts a lot of Solana's low-level complexity. Prefer Anchor patterns
  over raw Solana program instructions.
- Use `anchor test` for local testing. Devnet for integration testing.
- Clippy is the Rust linter — run `cargo clippy` before considering any Rust code done.

---

## ElevenLabs AI Integration

ElevenLabs Agents (Conversational AI 2.0) is the entire AI pipeline — not just TTS.
It handles: speech recognition (ASR) → LLM orchestration (Claude/GPT-4o/Gemini) →
text-to-speech (TTS) → turn-taking → RAG → client tools (agent can call app functions).

**The AI companion concept:** When a user opens TripQuest, they interact with a voice AI
that asks about their preferences, builds their quest, narrates location info as they travel,
and confirms check-ins. Think travel guide + concierge, not just a chatbot.

**React Native SDK:** `@elevenlabs/react-native` — confirmed to work with Expo managed workflow.

**Key capabilities to use:**
- RAG: feed the agent quest content, venue info, and city data so it answers from
  TripQuest's own database
- Client Tools: agent can trigger app functions (e.g., "start quest", "navigate to next stop",
  "swap preferences")
- LLM choice: Claude (Anthropic) or GPT-4o as the reasoning brain — TBD with Greg

**ElevenLabs startup grant:** Greg is applying for 33M free credits (~$4,000+ value).
Do not assume we're on a paid plan until confirmed.

**Security:** ElevenLabs Agents is SOC 2, HIPAA, GDPR compliant. EU Data Residency
and Zero Retention modes available if Greg's privacy requirements demand it.

---

## Supabase Setup

- **Project owner:** dev@tripquest.ai (Proton email)
- **Tier:** Pro ($25/mo) — needed for edge functions + realtime at scale
- **Auth strategy:** Wallet-linked profiles. User authenticates via Phantom wallet,
  Supabase profile is created/linked on first wallet connect.
- **Edge Functions:** Deno runtime (TypeScript). Quest verification logic lives here.
  Edge Functions are the authorized caller for smart contract instructions.
- **Database:** Postgres. All schema changes via migrations in `supabase/migrations/`.
  Never make schema changes directly in the Supabase dashboard without a migration file.
- **Storage:** User-generated media. Artwork and proof-of-completion photos go to
  Pinata/IPFS first, with the IPFS URI stored in Supabase.

---

## Developer Context

### Jake's Skill Level by Layer
| Layer | Skill Level | Notes |
|-------|-------------|-------|
| React (web) | Strong | Production experience |
| TypeScript | Strong | Preferred language |
| Node.js / backend | Strong | |
| Supabase | Comfortable | Used before |
| Solidity | Strong | DeFi staking, DAOs, ERC-1155, ERC-4626, LayerZero, L2 |
| React Native / Expo | Learning | Knows React web, new to mobile-specific patterns |
| Rust / Anchor | Learning from scratch | Zero prior Rust. Blockchain concepts solid from Solidity. |

### How to Help Jake
- **React Native:** Flag mobile-specific gotchas that a React web dev would miss
  (e.g., keyboard avoidance, safe area insets, platform differences, Expo managed
  workflow limitations). Don't over-explain React itself.
- **Rust / Anchor:** Explain ownership/borrowing when it comes up. Add inline comments
  for non-obvious Rust patterns. Show the Anchor equivalent of Solidity patterns where
  relevant (e.g., "this is like a modifier in Solidity"). Don't assume Rust familiarity.
- **Both:** Jake scaffolds fast and iterates. Prefer working code with explanation over
  perfect code with no context.

### Dev Tools
- **Editor:** VS Code
- **AI:** Claude Code (heavy use, Max plan)
- **Package manager:** pnpm (monorepo)
- **Solana local validator:** `solana-test-validator` for local Anchor testing
- **Anchor CLI:** `anchor build`, `anchor test`, `anchor deploy`
- **Expo:** `npx expo start` for mobile dev server

---

## Code Philosophy (Adapted from Trail of Bits)

- **No speculative features.** Don't add features, flags, or configuration that aren't
  actively needed right now. MVP scope is locked — see above.
- **No premature abstraction.** Don't create utilities until you've written the same
  code three times. Get it working first.
- **Clarity over cleverness.** Explicit, readable code over dense one-liners. This
  is especially important in Rust where Jake is still learning.
- **Justify new dependencies.** Every new package is maintenance burden and attack
  surface. Flag it before adding it.
- **Replace, don't deprecate.** When a new implementation replaces an old one, delete
  the old one. No dead code, no commented-out code.
- **No phantom features.** Don't document or validate features that aren't implemented.
- **Self-documenting code.** If you need a comment to explain WHAT the code does,
  refactor instead. Comments explain WHY, not WHAT.

---

## TypeScript / React Native Conventions

- **Language:** TypeScript everywhere. No plain JS files.
- **Styling:** NativeWind (Tailwind for React Native). No inline styles.
- **Navigation:** expo-router (file-based). Follow Expo Router v3 conventions.
- **State management:** Start with React state + context. Don't reach for Redux/Zustand
  until there's a clear need.
- **Supabase calls:** Always in `lib/` or custom hooks. Never raw fetch calls in components.
- **Wallet interactions:** Always via `@solana-mobile/mobile-wallet-adapter`. Never
  ask users to paste private keys.
- **Error handling:** All async functions use try/catch. Surface errors to users with
  readable messages — not raw error objects.
- **File naming:** Components in PascalCase (`QuestCard.tsx`). Hooks prefixed with `use`
  (`useQuestProgress.ts`). Utils in camelCase (`formatTokenAmount.ts`).
- **Imports:** Absolute imports from monorepo root. Configure path aliases in tsconfig.

---

## Rust / Anchor Conventions

- **Framework:** Anchor only. No raw Solana program instructions unless Anchor can't
  handle it (which is rare for MVP scope).
- **Account validation:** Use Anchor's account constraints (`#[account(...)]`) for all
  validation. Don't write manual validation that Anchor can do.
- **Error handling:** Define custom error codes in `#[error_code]` enum. Return
  descriptive errors — they show up in the client.
- **Testing:** Every instruction needs an Anchor test in TypeScript. Test the happy path
  and at least one failure case (unauthorized caller, already redeemed, etc.).
- **Security:** The Quest Rewards program accepts instructions from an authorized
  Supabase backend keypair. This keypair must be stored securely (never in the repo).
  Use environment variables or a secrets manager.
- **Program IDs:** Never hardcode program IDs in the mobile app. Use environment
  variables or a constants file that reads from env.

---

## Credential & Security Protocol

- **Sensitive credentials** (API keys, Solana keypairs, Supabase service role key): Signal
- **Day-to-day comms:** Discord (Jake: jakejohndoe)
- **Long-term:** Shared password manager (1Password or Bitwarden) — not yet set up
- **Never commit:** Private keys, service role keys, API keys, `.env` files
- **`.env.local`** for all secrets locally. `.env.example` committed to repo with
  placeholder values only.

---

## Open Items (as of March 2026)

- [ ] Get Proton credentials for dev@tripquest.ai from Greg
- [ ] Create GitHub org (`tripquest`) and initialize `tripquest-app` repo
- [ ] Scaffold Expo + Anchor monorepo
- [ ] Set up Supabase project under dev@tripquest.ai
- [ ] Greg to confirm TRIPQ token mint address (token creation via third-party service)
- [ ] Greg to share Figma files + brand assets
- [ ] ElevenLabs startup grant (Greg applying)
- [ ] Decide Mapbox vs ViroReact for mapping (Phase 2, not blocking MVP)
- [ ] Set up shared password manager
- [ ] Landing page: change "redeemable for cash or Bitcoin" — potential money
      transmitter classification issue. Greg to reword.

---

## Greg's Long-Term Vision (For Context — Not MVP)

Greg's endgame for TripQuest goes well beyond the MVP. Understanding this helps avoid
building things that conflict with the direction, even if we're not building them yet:

- **AR location scanning:** Point phone at a building, neon green outline scans and
  animates it, triggers check-in. This is the "fireworks moment" for the verification
  mechanic. Likely built with ViroReact or similar. Far future.
- **World mapping:** 360° spatial capture, Render Network GPU compute, licensing
  spatial data to robotics companies. Greg's big thesis.
- **IoT / hardware:** Helium Mobile, ROVR, LIDAR sensors, eventually a hardware device.
- **Merchant network:** NFC tags in shops, foot traffic analytics dashboard for businesses,
  Solana Pay integration (payment = check-in).
- **Data monetization:** Aggregate (not individual) trip metadata sold to tourism boards
  and travel agencies as CSVs / dashboards.
- **Privacy layer:** Midnight ZK proofs so users can prove quest eligibility without
  revealing personal preferences.

Build MVP foundations that don't foreclose these directions. Specifically:
- Keep verification logic abstracted (QR today, AR tomorrow)
- Don't hardcode "city" and "nature" as the only quest types
- Store quest metadata in a schema that can accommodate richer location data later
