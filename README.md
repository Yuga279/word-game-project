# Impostor Game - Word Mismatch SaaS

A production-ready, scalable SaaS application for the "Word Mismatch Impostor Game". Built with React, TypeScript, Express, Socket.io, and PostgreSQL.

## 🚀 One-Click Deploy (Render)

1.  **Database**: Create a free PostgreSQL database on [Neon](https://neon.tech/) or [Render](https://render.com/).
2.  **Backend + Frontend**:
    *   Create a new **Web Service** on Render.
    *   Connect your repository.
    *   **Runtime**: Node
    *   **Build Command**: `npm install && npm run build`
    *   **Start Command**: `node dist/server/index.js` (Ensure your build script transpile the server or use ts-node in dev)
    *   **Environment Variables**:
        *   `DATABASE_URL`: Your Postgres connection string.
        *   `SESSION_SECRET`: A long random string.
        *   `CLIENT_URL`: Your Render dashboard URL (e.g., `https://impostor-game.onrender.com`).
        *   `NODE_ENV`: `production`

## 🛠️ Local Setup

1.  **Clone the repo**.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Setup**:
    *   Copy `.env.example` to `.env`.
    *   Update `DATABASE_URL` with your local Postgres or Neon string.
4.  **Database Migration & Seed**:
    ```bash
    npx knex migrate:latest
    npx knex seed:run
    ```
5.  **Run Development**:
    *   Terminal 1 (Backend): `npx nodemon server/index.ts` (using ts-node)
    *   Terminal 2 (Frontend): `npm run dev`

## 🎮 Core Game Logic

*   **Waiting**: Create or join a room. Need 3+ players.
*   **Active**: Everyone gets a word. One person is the Impostor with a different but related word.
*   **Discussion**: Players describe their words without revealing them too easily.
*   **Voting**: Vote for who you think is the Impostor.
*   **Completed**: Identity and words are revealed!

## 🔐 Security Constraints

*   **Server-side Role Assignment**: Roles and words are never exposed to clients until completion.
*   **Strict Isolation**: Each room uses a unique UUID and session-based authentication.
*   **Anti-Cheat**: Duplicate votes and cross-game access are prevented via server-side validation.

## 📦 Tech Stack

*   **Frontend**: React 19, TypeScript, Vite, Framer Motion, Lucide Icons, Axios.
*   **Backend**: Node.js, Express, Socket.io, Passport.js (Local Strategy), Express Session.
*   **Database**: PostgreSQL, Knex.js Query Builder.
*   **Hosting**: Render (Web Service), Neon (PostgreSQL).

## 📄 License
MIT
