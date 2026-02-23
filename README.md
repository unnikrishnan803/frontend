# Frontend (React + Vite + Tailwind)

## Setup

1. Install dependencies:
   - `npm install`
2. Configure environment:
   - copy `.env.example` to `.env`
3. Start:
   - `npm run dev`

## Key Modules

- `src/state/gameStore.ts`: global game state + API actions
- `src/screens/*`: game flow screens
- `src/lib/socket.ts`: websocket wrapper
- `src/lib/api.ts`: HTTP API client
