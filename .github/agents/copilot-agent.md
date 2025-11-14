# Copilot Agent Instructions for WR Draft Playbook

This document provides the AI agent with the essential context and rules for working on this repository.

## 1. Project Overview

- **Purpose:** A data-driven strategy tool and playbook for League of Legends: Wild Rift.
- **Project Type:** Web Application (Next.js App Router)
- **Primary Language:** TypeScript (strict mode)
- **UI Library:** `@heroui/react`
- **Styling:** Tailwind CSS
- **Database:** Upstash Redis (`@upstash/redis` SDK)

## 2. Architectural Principles

- **Database Interaction:** ALL server-side database operations MUST use the centralized `getKvClient()` function from
  `lib/upstash.ts`.
- **Data Fetching:** Server-side pages should fetch their own data using the functions provided in
  `lib/data-fetching.ts`. Do not pass data down from the root layout.
- **Logging:** Use the custom logger from `@/lib/development-logger` for all client-side logging (`logger.debug(...)`).
  Use the `pino` logger from `@/lib/logger` for all server-side logging. The `no-console` ESLint rule is strictly
  enforced.
- **State Management:** Prefer server-side data fetching and URL-based state (sub-paths or query params) over complex
  client-side state management libraries.

## 3. Code Style & Conventions

- **Immutability:** All component props interfaces MUST be marked as `readonly`.
- **Functional Programming:** Use functional components, hooks, and modern JavaScript features. Prefer `for...of` loops
  over `Array.prototype.forEach()`.
- **Asynchronicity:** Use `async/await` for all asynchronous operations.
- **Clarity:** Prioritize code clarity and reduce cognitive complexity. Extract complex logic into well-named utility
  functions.

## 4. Validation & Tooling

To run, test, and validate the project, use the following commands. All checks must pass.

- **Installation:** `npm ci`
- **Run Dev Server:** `npm run dev`
- **Database Seeding:** `npm run db:seed` (Run this if you change any data in the `/data` directory).
- **Validation Checks:**
  - `npm run format:check`
  - `npm run lint`
  - `npm test`
