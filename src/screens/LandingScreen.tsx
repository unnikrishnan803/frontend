import { FormEvent, useState } from "react";

import { GlassCard } from "../components/GlassCard";
import { useGameStore } from "../state/gameStore";

export function LandingScreen() {
  const createRoom = useGameStore((state) => state.createRoom);
  const joinRoom = useGameStore((state) => state.joinRoom);
  const loading = useGameStore((state) => state.loading);
  const error = useGameStore((state) => state.error);
  const clearError = useGameStore((state) => state.clearError);

  const [createName, setCreateName] = useState("");
  const [joinName, setJoinName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const onCreate = async (event: FormEvent) => {
    event.preventDefault();
    clearError();
    await createRoom(createName.trim());
  };

  const onJoin = async (event: FormEvent) => {
    event.preventDefault();
    clearError();
    await joinRoom(joinCode.trim().toUpperCase(), joinName.trim());
  };

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-6 md:grid-cols-2">
      <GlassCard className="space-y-5">
        <div>
          <h2 className="font-heading text-3xl text-blush">Create Room</h2>
          <p className="mt-1 text-sm text-white/60">Start a private romantic guessing session.</p>
        </div>
        <form className="space-y-4" onSubmit={onCreate}>
          <input
            value={createName}
            onChange={(event) => setCreateName(event.target.value)}
            className="w-full rounded-xl border border-blush/30 bg-white/5 px-4 py-3 outline-none focus:border-ember"
            placeholder="Your name"
            required
            minLength={2}
            maxLength={32}
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-ember px-4 py-3 font-medium text-dusk transition hover:bg-blush disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Room"}
          </button>
        </form>
      </GlassCard>

      <GlassCard className="space-y-5">
        <div>
          <h2 className="font-heading text-3xl text-blush">Join Room</h2>
          <p className="mt-1 text-sm text-white/60">Enter code and jump into the round.</p>
        </div>
        <form className="space-y-4" onSubmit={onJoin}>
          <input
            value={joinCode}
            onChange={(event) => setJoinCode(event.target.value)}
            className="w-full rounded-xl border border-blush/30 bg-white/5 px-4 py-3 font-mono uppercase tracking-[0.3em] outline-none focus:border-ember"
            placeholder="ROOM01"
            required
            maxLength={6}
          />
          <input
            value={joinName}
            onChange={(event) => setJoinName(event.target.value)}
            className="w-full rounded-xl border border-blush/30 bg-white/5 px-4 py-3 outline-none focus:border-ember"
            placeholder="Your name"
            required
            minLength={2}
            maxLength={32}
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-ember px-4 py-3 font-medium text-dusk transition hover:bg-blush disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Joining..." : "Join Room"}
          </button>
        </form>
      </GlassCard>

      {error ? (
        <p className="md:col-span-2 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}
    </div>
  );
}
