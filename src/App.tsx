import { useMemo } from "react";

import { FinalScreen } from "./screens/FinalScreen";
import { LandingScreen } from "./screens/LandingScreen";
import { LobbyScreen } from "./screens/LobbyScreen";
import { QuestionScreen } from "./screens/QuestionScreen";
import { RevealScreen } from "./screens/RevealScreen";
import { ScoreboardScreen } from "./screens/ScoreboardScreen";
import { useGameStore } from "./state/gameStore";

function ScreenRouter() {
  const roomCode = useGameStore((state) => state.roomCode);
  const status = useGameStore((state) => state.status);

  if (!roomCode) {
    return <LandingScreen />;
  }

  if (status === "LOBBY") {
    return <LobbyScreen />;
  }
  if (status === "QUESTION") {
    return <QuestionScreen />;
  }
  if (status === "REVEAL") {
    return <RevealScreen />;
  }
  if (status === "SCOREBOARD") {
    return <ScoreboardScreen />;
  }
  if (status === "FINISHED") {
    return <FinalScreen />;
  }
  return <LobbyScreen />;
}

export default function App() {
  const error = useGameStore((state) => state.error);
  const clearError = useGameStore((state) => state.clearError);
  const subtitle = useMemo(
    () => "Real-time guessing game with multilingual AI matching",
    [],
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,rgba(255,108,143,0.17),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(248,184,201,0.12),transparent_38%),linear-gradient(180deg,#0f0a15,#160d1d_40%,#221229)] px-4 py-8 text-white">
      <div className="mx-auto mb-8 max-w-5xl text-center">
        <h1 className="animate-breathe font-heading text-5xl text-blush sm:text-6xl">Romutoo</h1>
        <p className="mt-2 text-sm tracking-[0.18em] text-white/60 sm:text-base">{subtitle}</p>
      </div>

      {error ? (
        <div className="mx-auto mb-6 flex w-full max-w-4xl items-center justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          <span>{error}</span>
          <button className="rounded-lg border border-red-300/40 px-3 py-1" onClick={clearError}>
            Dismiss
          </button>
        </div>
      ) : null}

      <ScreenRouter />
    </div>
  );
}
