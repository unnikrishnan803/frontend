import { GlassCard } from "../components/GlassCard";
import { ScoreboardTable } from "../components/ScoreboardTable";
import { useGameStore } from "../state/gameStore";

export function ScoreboardScreen() {
  const players = useGameStore((state) => state.players);
  const playerId = useGameStore((state) => state.playerId);
  const round = useGameStore((state) => state.round);
  const maxRounds = useGameStore((state) => state.maxRounds);
  const startRound = useGameStore((state) => state.startRound);
  const finishRoom = useGameStore((state) => state.finishRoom);
  const loading = useGameStore((state) => state.loading);

  const me = players.find((player) => player.id === playerId);
  const isHost = me?.is_host ?? false;
  const isFinalRound = round >= maxRounds;
  const topGuesser = players[0];

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-6 md:grid-cols-[1.1fr,0.9fr]">
      <GlassCard className="space-y-4">
        <h2 className="font-heading text-3xl text-blush">Scoreboard</h2>
        <ScoreboardTable rows={players} />
      </GlassCard>

      <GlassCard className="space-y-4">
        <h3 className="font-heading text-2xl text-blush">Round Summary</h3>
        {topGuesser ? (
          <p className="rounded-xl border border-mint/30 bg-mint/10 px-4 py-3 text-mint">
            Top Guesser: <strong>{topGuesser.name}</strong>
          </p>
        ) : null}
        <p className="text-sm text-white/70">
          {isFinalRound
            ? "Last round complete. Finish room to reveal emotional sync results."
            : "Start next round when everyone is ready."}
        </p>

        {isHost ? (
          isFinalRound ? (
            <button
              type="button"
              className="w-full rounded-xl bg-ember px-4 py-3 font-medium text-dusk disabled:opacity-50"
              disabled={loading}
              onClick={() => finishRoom()}
            >
              {loading ? "Calculating..." : "Finish Game"}
            </button>
          ) : (
            <button
              type="button"
              className="w-full rounded-xl bg-ember px-4 py-3 font-medium text-dusk disabled:opacity-50"
              disabled={loading}
              onClick={() => startRound()}
            >
              {loading ? "Starting..." : "Next Round"}
            </button>
          )
        ) : (
          <p className="text-sm text-white/60">Waiting for host action.</p>
        )}
      </GlassCard>
    </div>
  );
}
