import { FormEvent, useEffect, useState } from "react";

import { GlassCard } from "../components/GlassCard";
import { TimerRing } from "../components/TimerRing";
import { ROUND_SECONDS } from "../lib/constants";
import { useGameStore } from "../state/gameStore";

export function QuestionScreen() {
  const question = useGameStore((state) => state.question);
  const round = useGameStore((state) => state.round);
  const playerId = useGameStore((state) => state.playerId);
  const players = useGameStore((state) => state.players);
  const loading = useGameStore((state) => state.loading);
  const submitAnswer = useGameStore((state) => state.submitAnswer);
  const revealAnswer = useGameStore((state) => state.revealAnswer);

  const [answer, setAnswer] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS);
  const [submitted, setSubmitted] = useState(false);

  const currentPlayer = players.find((player) => player.id === playerId);
  const isHost = currentPlayer?.is_host ?? false;

  useEffect(() => {
    setAnswer("");
    setSubmitted(false);
    setSecondsLeft(ROUND_SECONDS);
  }, [round]);

  useEffect(() => {
    if (submitted) {
      return;
    }
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [submitted]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!answer.trim()) {
      return;
    }
    await submitAnswer(answer.trim());
    setSubmitted(true);
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <GlassCard className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Round {round}</p>
          <h2 className="mt-1 font-heading text-3xl text-blush">Private Answer Time</h2>
        </div>
        <TimerRing secondsLeft={secondsLeft} totalSeconds={ROUND_SECONDS} />
      </GlassCard>

      <GlassCard className="space-y-5">
        <p className="text-lg leading-relaxed text-white">{question ?? "Waiting for question..."}</p>
        <form className="space-y-4" onSubmit={onSubmit}>
          <textarea
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            className="h-36 w-full resize-none rounded-2xl border border-blush/30 bg-white/5 p-4 outline-none focus:border-ember"
            placeholder="Type your secret answer..."
            maxLength={1000}
            required
            disabled={submitted}
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-ember px-4 py-3 font-medium text-dusk disabled:opacity-50"
            disabled={loading || submitted}
          >
            {submitted ? "Submitted" : loading ? "Submitting..." : "Submit Answer"}
          </button>
        </form>
        <button
          type="button"
          className="w-full rounded-xl border border-blush/30 px-4 py-3 text-white/90 disabled:opacity-40"
          disabled={!isHost || loading}
          onClick={() => revealAnswer()}
        >
          Reveal Random Answer
        </button>
      </GlassCard>
    </div>
  );
}
