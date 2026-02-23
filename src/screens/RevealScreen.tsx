import { useState } from "react";

import { GlassCard } from "../components/GlassCard";
import { PlayerChip } from "../components/PlayerChip";
import { useGameStore } from "../state/gameStore";

export function RevealScreen() {
  const players = useGameStore((state) => state.players);
  const revealedAnswerText = useGameStore((state) => state.revealedAnswerText);
  const revealedAnswerId = useGameStore((state) => state.revealedAnswerId);
  const loading = useGameStore((state) => state.loading);
  const submitGuess = useGameStore((state) => state.submitGuess);

  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  const onGuess = async () => {
    if (!revealedAnswerId || !selectedPlayer || submitted) {
      return;
    }
    await submitGuess(revealedAnswerId, selectedPlayer);
    setSubmitted(true);
  };

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-6 md:grid-cols-2">
      <GlassCard className="space-y-4">
        <h2 className="font-heading text-3xl text-blush">Who wrote this?</h2>
        <p className="rounded-2xl border border-blush/25 bg-white/5 p-5 text-lg leading-relaxed text-white">
          {revealedAnswerText ?? "Waiting for reveal..."}
        </p>
        <button
          type="button"
          className="w-full rounded-xl bg-ember px-4 py-3 font-medium text-dusk disabled:opacity-50"
          disabled={!selectedPlayer || submitted || loading}
          onClick={onGuess}
        >
          {submitted ? "Guess Locked" : loading ? "Submitting..." : "Submit Guess"}
        </button>
      </GlassCard>

      <GlassCard className="space-y-3">
        <h3 className="font-heading text-2xl text-blush">Players</h3>
        {players.map((player) => (
          <PlayerChip
            key={player.id}
            name={player.name}
            score={player.score}
            isHost={player.is_host}
            selected={selectedPlayer === player.id}
            onClick={() => setSelectedPlayer(player.id)}
          />
        ))}
      </GlassCard>
    </div>
  );
}
