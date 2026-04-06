# Project Overview: HandyBox Web MVP

## 1. Project Mission

HandyBox is a high-trust marketplace connecting homeowners with local handyman professionals. The product goal is to make home maintenance simple: post a task, compare offers, complete the work, and leave feedback.

## 2. Primary Personas

### Customer (Client)

- Need: fast and reliable help with clear status tracking.
- Core flow: post task -> receive offers/quotes -> choose pro -> complete task -> review.
- App surfaces: `/quotes`, `/requests`, and `/profile` (client point of view).

### Worker

- Need: discover nearby tasks and manage work as a business.
- Core flow: browse tasks -> open detail -> make offer -> deliver work -> build reputation.
- App surfaces: `/dashboard/*` for worker-focused tools and analytics.

## 3. Product Behavior in MVP

- Homepage defaults to the task-hunter experience.
- Users can browse tasks on map/list and apply filters to find relevant tasks.
- Task detail is publicly readable.
- Unauthenticated users are read-only; login is required to make offers or perform account actions.
- The app supports two intents:
  - become a tasker (worker flow and dashboard), or
  - post a task (client flow for requesting help and managing quotes/requests).

## 4. Core Feature Areas

- Marketplace discovery: map-based browsing and task filters.
- Job lifecycle: post, offer/quote, status progression, completion.
- Trust signals: worker profile details, ratings, endorsements, and review history.
- Role-based navigation: lightweight client pages vs full worker dashboard.

## 5. Technical Foundation

- Frontend: Next.js 16 (App Router).
- API: external GraphQL backend (schema synced into `.codegen/schema.ts`).
- UI system: reusable primitives in `src/ui` with Chakra UI as base layer.

## 6. Current Product Direction

- Implement and iterate the redesign page-by-page, starting from homepage flows.
- Keep UX aligned to Stitch design output while preserving role-based app behavior.
