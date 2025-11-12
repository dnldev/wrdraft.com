Of course. This is the perfect time to create a professional `README.md` that reflects the project's maturity and to
establish a solid release workflow for `v1.0.0`.

I will provide a complete, new `README.md` file for you to use and a clear, step-by-step guide on how to manage your
versioning and release `v1.0.0`.

---

### Part 1: New `README.md` File

This new `README.md` is tailored specifically to your project, explaining what it is, its features, the tech stack, and
how to get it running locally. Replace the entire content of your current `README.md` with the following.

````markdown
# WR Draft: The Dragon Lane Playbook

[![Vercel Deployment](https://img.shields.io/badge/Live_Demo-wrdraft.com-black?style=for-the-badge&logo=vercel)](https://wrdraft.com)

**WR Draft** is a data-driven strategy tool and playbook designed for League of Legends: Wild Rift players who
specialize in the Dragon Lane (ADC and Support). This application provides in-depth insights and tactical advantages for
champion selection, drafting, and in-game strategy.

---

### Key Features

- **Matchup Calculator**: A powerful, data-driven tool that provides weighted champion recommendations based on allied,
  enemy, and meta picks.
- **Champion Guides**: Detailed guides for every ADC and Support, including playstyle tips, comfort picks, and core
  build paths.
- **Synergy & Counters**: In-depth breakdowns of the best ADC/Support pairings, complete with notes on why they work and
  how to execute their strategies.
- **Team Composition Archetypes**: A guide to the most common team compositions (e.g., Poke, Dive, Protect the Carry),
  which champions fit into them, and how to draft accordingly.
- **Meta Tier List**: A continuously updated tier list for both ADC and Support roles based on the latest patch data.
- **Customizable Theming**: A theme switcher with multiple professionally designed, League of Legends-inspired color
  palettes for a personalized experience.

### Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 14 (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [@heroui/react](https://github.com/hero-UI/glory)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Vercel Redis](https://vercel.com/storage/redis) (managed by Upstash)
- **Deployment**: [Vercel](https://vercel.com/)
- **Testing**: [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/)

---

### Getting Started: Local Development

Follow these instructions to set up and run the project locally.

#### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20.x or later recommended)
- [npm](https://www.npmjs.com/) or another package manager (Yarn, pnpm)
- A Redis database instance. You can get a free one from [Upstash](https://upstash.com/) or use Vercel's Hobby plan.

#### 1. Clone the Repository

```bash
git clone https://github.com/dnldev/wrdraft.com.git
cd wrdraft.com
```
````

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Set Up Environment Variables

Create a new file in the root of the project named `.env.development.local`. This file is ignored by Git and will store
your secret keys. Add your Redis connection URL to this file:

```.env.development.local
REDIS_URL="your_redis_connection_url_here"
```

#### 4. Seed the Database

The application's data (champions, synergies, etc.) is managed in the codebase and needs to be seeded into your Redis
database.

````bash
npm run db:seed```

#### 5. Run the Development Server

```bash
npm run dev
````

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Available Scripts

- `npm run dev`: Starts the development server piping into pino-pretty.
- `npm run dev:windows`: Starts a dev server without non unix problematic piping into pino.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the codebase for errors.
- `npm run format:check`: Checks for code formatting issues.
- `npm run test`: Runs the Jest test suite.
- `npm run db:seed`: Seeds the Redis database with project data.

### Deployment

This project is configured for continuous deployment on [Vercel](https://vercel.com/). Every push to the `main` branch
automatically triggers a new production deployment. The build process automatically runs the `db:seed` script to ensure
the production database is always up-to-date.
