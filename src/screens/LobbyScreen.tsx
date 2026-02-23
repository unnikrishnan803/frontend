import { GlassCard } from "../components/GlassCard";
import { PlayerChip } from "../components/PlayerChip";
import { useGameStore } from "../state/gameStore";

export function LobbyScreen() {
  const roomCode = useGameStore((state) => state.roomCode);
  const players = useGameStore((state) => state.players);
  const playerId = useGameStore((state) => state.playerId);
  const isConnected = useGameStore((state) => state.isConnected);
  const startRound = useGameStore((state) => state.startRound);
  const disconnect = useGameStore((state) => state.disconnect);
  const loading = useGameStore((state) => state.loading);

  const currentPlayer = players.find((player) => player.id === playerId);
  const isHost = currentPlayer?.is_host ?? false;

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-6 md:grid-cols-[1.2fr,0.8fr]">
      <GlassCard className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-heading text-3xl text-blush">Lobby</h2>
            <p className="text-sm text-white/60">Share this room code with friends.</p>
          </div>
          <span
            className={`mt-2 inline-flex h-3 w-3 rounded-full ${
              isConnected ? "bg-mint shadow-[0_0_14px_rgba(133,225,200,0.8)]" : "bg-red-400"
            }`}
          />
        </div>

        <div className="rounded-2xl border border-blush/25 bg-white/5 px-5 py-4 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Room Code</p>
          <p className="mt-1 font-mono text-4xl tracking-[0.35em] text-blush">{roomCode}</p>
        </div>

        <div className="space-y-3">
          {players.map((player) => (
            <PlayerChip
              key={player.id}
              name={player.name}
              score={player.score}
              isHost={player.is_host}
              selected={player.id === playerId}
            />
          ))}
        </div>
      </GlassCard>

      <GlassCard className="space-y-4">
        <h3 className="font-heading text-2xl text-blush">Host Controls</h3>
        <p className="text-sm text-white/60">
          {isHost
            ? "Start the first question when everyone is ready."
            : "Waiting for host to start the game."}
        </p>
        <button
          type="button"
          className="w-full rounded-xl bg-ember px-4 py-3 font-medium text-dusk disabled:opacity-50"
          disabled={!isHost || loading}
          onClick={() => startRound()}
        >
          {loading ? "Starting..." : "Start Game"}
        </button>
        <button
          type="button"
          className="w-full rounded-xl border border-blush/30 px-4 py-3 text-white/90"
          onClick={disconnect}
        >
          Leave Room
        </button>
      </GlassCard>
    </div>
  );
}
