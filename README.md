# TripQuest

> "Awaken Your Inner Quester"

TripQuest is a travel app that builds AI-generated itineraries based on your preferences. Fly into a city you've never been to, open TripQuest, set your preferences, and the AI builds you a quest -- a series of nearby locations to complete. Check in at each stop, earn TRIPQ tokens and NFT badges as rewards.

**Core loop:** Set preferences → AI generates quest → navigate to locations → check in → earn rewards!

---

## Stack

| Layer | Tech |
|-------|------|
| Blockchain | Solana + Anchor (Rust) |
| Mobile | React Native + Expo |
| Wallet | Phantom via Solana Mobile Wallet Adapter |
| AI / Voice | ElevenLabs Agents |
| Backend | Supabase |
| Storage | Pinata / IPFS |
| Hosting | Vercel |

---

## Repo Structure

```
tripquest-app/
├── apps/
│   └── mobile/          # React Native + Expo app
├── packages/
│   └── shared/          # Shared types and utilities
├── programs/            # Anchor smart contracts (Rust)
│   ├── quest-rewards/
│   └── badge-nft/
├── supabase/
│   └── functions/       # Edge Functions (quest verification)
├── CLAUDE.md            # Project context for Claude Code
└── README.md
```

---

## Current Phase

MVP (3-month roadmap, March to May 2026). Devnet only.
Demo target: Saint Cloud, MN.

---

## Team

| Name | Role |
|------|------|
| Greg | CEO / Product / Sales |
| Jake (Jakob Johnson) | Blockchain Engineer |

---

*This repo is under active development. Not production ready.*
