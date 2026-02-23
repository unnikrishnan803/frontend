import { GlassCard } from "../components/GlassCard";
import { ScoreboardTable } from "../components/ScoreboardTable";
import { useGameStore } from "../state/gameStore";

export function FinalScreen() {
  const players = useGameStore((state) => state.players);
  const pairs = useGameStore((state) => state.pairs);
  const disconnect = useGameStore((state) => state.disconnect);

  const mostConnectedPair = [...pairs].sort((a, b) => b.sync_percentage - a.sync_percentage)[0];
  const topGuesser = players[0];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <GlassCard className="space-y-4 text-center">
        <h2 className="font-heading text-4xl text-blush">Final Result</h2>
        {mostConnectedPair ? (
          <p className="text-lg text-white">
            Most Connected Pair:{" "}
            <span className="font-semibold text-mint">
              {mostConnectedPair.player_one_name} + {mostConnectedPair.player_two_name}
            </span>{" "}
            ({mostConnectedPair.sync_percentage}%)
          </p>
        ) : (
          <p className="text-white/70">No sync data available.</p>
        )}
        {topGuesser ? <p className="text-blush">Top Guesser: {topGuesser.name}</p> : null}
      </GlassCard>

      <div className="grid gap-6 md:grid-cols-2">
        <GlassCard className="space-y-4">
          <h3 className="font-heading text-2xl text-blush">Leaderboard</h3>
          <ScoreboardTable rows={players} />
        </GlassCard>

        <GlassCard className="space-y-4">
          <h3 className="font-heading text-2xl text-blush">Sync Breakdown</h3>
          <div className="space-y-3">
            {[...pairs]
              .sort((a, b) => b.sync_percentage - a.sync_percentage)
              .slice(0, 5)
              .map((pair) => (
                <div key={`${pair.player_one}-${pair.player_two}`} className="rounded-xl border border-blush/20 p-4">
                  <p className="font-medium text-white">
                    {pair.player_one_name} x {pair.player_two_name}
                  </p>
                  <p className="text-sm text-mint">Sync: {pair.sync_percentage}%</p>
                </div>
              ))}
          </div>
        </GlassCard>
      </div>

      <button
        type="button"
        className="mx-auto block rounded-xl border border-blush/30 px-5 py-3 text-white/90"
        onClick={disconnect}
      >
        Back To Landing
      </button>
    </div>
  );
}
