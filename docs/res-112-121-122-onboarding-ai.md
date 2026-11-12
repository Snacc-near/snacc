# RES-112, RES-121, RES-122 — Onboarding, Semantic AI Search & Identity Options

**Status:** Implementation & Evaluation complete in `frontend` (branch `item/RES-112-122`).
**Owner:** Esther (`@esther·L2` / `@esther·L1`).
**Window:** Hackathon sprint (Nov 2026).
**Honesty notes:**
- `$SNACC` on testnet carries no monetary value; volatility is an on-chain game mechanic, not a financial return promise.
- All offline/demo modes fall back gracefully to deterministic local simulation without faking on-chain transaction hashes.
- Word ban compliance: zero occurrences of "GameFi", "investment", or "yield guarantee".

---

## 1. RES-112: 1Click User Auth & Account Endpoints

### Critique & Problem Analysis
- **Problem:** Web3 onboarding has historically suffered from high abandonment rates due to seed phrase generation, wallet extension installation requirements, and upfront gas funding hurdles.
- **Evaluation:**
  - Real 1Click/Defuse API endpoints require network reachability, production API keys, or active testnet relayer infrastructure. If an external API is offline or down during judging, forcing a live network call breaks the entire application.
  - Calling live mainnet endpoints without fallback violates the zero-key / offline evaluation principle (`ADR-33`).
- **Solution & Development:**
  - Developed `frontend/src/auth/oneClickAuth.ts` and `frontend/src/hud/AuthModal.tsx`.
  - Implements client-side ephemeral `ed25519` key generation and deterministic testnet account derivation (`s-guest-<rand>.testnet` or sanitized user alias).
  - Configurable live endpoint support (`VITE_1CLICK_AUTH_ENDPOINT` / `https://api.1click.defuse.org/v1/user/account`) with graceful timeout and automatic fallback to `mode: "simulated"`.
  - Session state persists cleanly in `localStorage` / memory store.

---

## 2. RES-121: Recipe Search with Qwen Embedding & Rerank

### Critique & Problem Analysis
- **Problem:** The Snacc economic engine features a 3-stage `NEP-245` supply chain (3 Spores, 3 Enzymes, 3 Elixirs) alongside organelle allocation and macro-economic thermal regimes (Calcination Fever >610 mK burn and Hypothermia <600 mK rebate). Players and judges searching for specific strategies (e.g. "how to survive fever", "reduce BMR decay", "redeem industrial dividend") cannot easily find the right multi-step recipe.
- **Evaluation:**
  - Directly depending on a live remote Qwen API (`dashscope.aliyuncs.com`) requires an active API key (`DASHSCOPE_API_KEY`), which offline judges will not possess. Network latency would also harm HUD responsiveness.
- **Solution & Development:**
  - Developed `frontend/src/recipes/qwenSearch.ts` and `frontend/src/hud/RecipeSearchModal.tsx`.
  - Engineered a 10-dimensional concept embedding space representing fever, hypothermia, vitality, burn, dividend, BMR, TEE privacy, splicing, ATP, and catalyst fees.
  - Implemented hybrid ranking: 65% cosine concept similarity + 35% lexical keyword scoring.
  - Fully dual-skin compliant (`🔬 Bio-Lab` vs `📊 Institutional FinTech`).
  - Provides instant copyable contract call snippets (e.g., `synthesize_elixir(strain_id, 2, catalyst_fee)`).
  - Optional live Qwen API connector if `VITE_QWEN_API_KEY` is supplied, with 100% offline fallback.

---

## 3. RES-122: near.email / NEAR Auth (Auth0) Login Options

### Critique & Problem Analysis
- **Problem:** Mainstream Web2 users expect social and email logins rather than raw crypto wallet management.
- **Evaluation:**
  - A production `near.email` / FastAuth relayer requires WebAuthn enclave contracts and cross-origin Auth0 tenant configuration. In local hackathon development, relying solely on third-party Auth0 redirects breaks sandboxed iframe execution and headless test suites.
- **Solution & Development:**
  - Developed `frontend/src/auth/nearAuth.ts` and integrated within `AuthModal.tsx`.
  - RFC-compliant email validation with deterministic testnet account mapping (e.g., `user@domain.com` → `user-domain.testnet`).
  - Dual provider support: `near.email` (WebAuthn/Passkey derivation) and `auth0` (Social JWT mapping).
  - Clean UI tab with active account management, session status badge, and instant disconnection.

---

## 4. Verification & Test Evidence

- **Frontend Unit Tests:** 23 test suites / 173 tests passing 100% (`npm run test` via vitest).
  - `test/res-112-one-click.test.ts`: 4 passed (sanitization, ephemeral keys, simulated mode, storage).
  - `test/res-121-qwen-search.test.ts`: 7 passed (cosine similarity, vectorizer, fever ranking, bmr ranking, dividend ranking, atp ranking).
  - `test/res-122-near-auth.test.ts`: 5 passed (email validation, deterministic account derivation, passkey flow, auth0 flow).
  - `test/res-modals.test.tsx`: 6 passed (AuthModal, RecipeSearchModal, dual-skin labels, closed state).
- **Frontend Production Build:** `tsc --noEmit && vite build` built cleanly with 0 errors (dist bundle 402 KB / gzip 122 KB).
