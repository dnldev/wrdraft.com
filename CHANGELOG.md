# Changelog

# [2.1.0](https://github.com/dnldev/wrdraft.com/compare/v1.2.0...v2.1.0) (2025-11-14)


### Bug Fixes

* **core:** Integrate logging and correct failing tests ([4ae29a1](https://github.com/dnldev/wrdraft.com/commit/4ae29a1980913a5b73398a5af5bf43123a7e6d4b))
* **linter:** Resolve all SonarQube and ESLint issues ([63cd974](https://github.com/dnldev/wrdraft.com/commit/63cd974cbc12f959c876d617e1089e3f40502e60))


### Features

* **data:** Update tier list to Patch 6.3c ([c301c4d](https://github.com/dnldev/wrdraft.com/commit/c301c4d830748d8c34355baa421de819447809f7))
* **history:** Implement draft persistence and history view ([40096b6](https://github.com/dnldev/wrdraft.com/commit/40096b6fbd6095b8af450e0af5a4edcd3d14f1a6))
* **history:** Implement draft persistence and history view ([0d5f17d](https://github.com/dnldev/wrdraft.com/commit/0d5f17d10d63c86ce4ba7b964ed94b383c6bceb2))
* **history:** Implement Match History and Personalized Stats [#38](https://github.com/dnldev/wrdraft.com/issues/38) ([#44](https://github.com/dnldev/wrdraft.com/issues/44)) ([f1a7cc9](https://github.com/dnldev/wrdraft.com/commit/f1a7cc9f3be76c0808f0363dfa0ded3a7014fb4b))
* **logging:** implement structured logging and enforce no-console rule ([118e8f3](https://github.com/dnldev/wrdraft.com/commit/118e8f39294d7f6874e634b57620a73894d84110))
* **release:** Automate release process and overhaul win rate calculation ([18f6929](https://github.com/dnldev/wrdraft.com/commit/18f692986262895d94b08c8ac812bea95ebe488d)), closes [#32](https://github.com/dnldev/wrdraft.com/issues/32) [#39](https://github.com/dnldev/wrdraft.com/issues/39)

## 2.0.0 (2025-11-12)

### **Release Notes: v2.0.0 - The Data Persistence Update**

Version 2.0.0 marks a major milestone for the Wild Rift Playbook, fundamentally transforming it from a static
calculation tool into a dynamic, data-driven platform. This release introduces a complete data persistence layer,
allowing users to save, track, and analyze their draft history over time.

The core of this update is the introduction of a **Match History** system. You can now log the outcome of every draft
analysis, including picks, bans, KDA, and subjective ratings. A new "History" view provides a central place to browse,
review, and delete these saved matches, laying the groundwork for future features like personalized performance
insights.

To support this, the application's architecture has been significantly overhauled:

- **Breaking Change: Data Structure & Persistence:** The data layer has been migrated to a robust, serverless-first
  architecture using the official `@upstash/redis` SDK. This change, along with the new `SavedDraft` data structure, is
  a breaking change that enables all new persistence features.
- **Smarter Win Rate Calculation:** The calculator's "win chance" logic has been completely re-architected. It no longer
  relies on a static formula. Instead, it now uses a **weighted and normalized scoring system** where hard counters are
  more impactful, and the 50% "even" matchup baseline is dynamically calculated based on the average score of all
  possible picks in the current draft context. This provides a much more accurate and realistic assessment of a draft's
  quality.

Additionally, this release introduces a fully automated release process using `release-it`, which will allow for faster
and more consistent updates in the future.

### **Changelog**

#### `v2.0.0` (2025-11-12)

#### Features

- **history:** Implement a full draft persistence system and a "History" view to browse and manage saved
  matches ([27519c7](https://github.com/dnldev/wrdraft.com/commit/27519c76d33c0a5a5983addbc8b7bd92194eb7ec)).
- **calculator:** Rearchitect the win chance calculation with a weighted and normalized scoring system for improved
  accuracy ([ddd3526](https://github.com/dnldev/wrdraft.com/commit/ddd352633dee264719b6087f2259c384dd344be6)),
  closes [#32](https://github.com/dnldev/wrdraft.com/issues/32) [#39](https://github.com/dnldev/wrdraft.com/issues/39).
- **data:** Update the meta tier list to reflect Patch
  6.3c ([267e761](https://github.com/dnldev/wrdraft.com/commit/267e7611503535590b57966f8ddea90ae352629a)).
- **logging:** Implement structured server-side logging with `pino` and a custom client-side logger, enforcing a
  `no-console` rule ([da9b60e](https://github.com/dnldev/wrdraft.com/commit/da9b60eca95d995889db54af6eb96841b877f445)).

#### Bug Fixes

- **core:** Resolve multiple test failures and logic errors identified during
  integration ([d11c950](https://github.com/dnldev/wrdraft.com/commit/d11c950a5d9c76a50b8990ca283d5d1f91aaf00a)).
- **linter:** Address all outstanding SonarQube and ESLint issues across the codebase to improve code quality and
  maintainability ([5a262d4](https://github.com/dnldev/wrdraft.com/commit/5a262d4eeb64a5b558ce1c5135dc923e6239eedc)).

#### Chores & Refactoring

- **release:** Integrate `release-it` to automate the entire release workflow, including versioning, changelog
  generation, and GitHub
  releases ([ddd3526](https://github.com/dnldev/wrdraft.com/commit/ddd352633dee264719b6087f2259c384dd344be6)).
- **db:** Migrate the data persistence layer from `redis` to `@upstash/redis` to ensure stability and compatibility with
  Vercel's serverless environment.
- **refactor(calculator):** Reduce cognitive complexity in the calculator components by extracting logic into hooks and
  container components.
