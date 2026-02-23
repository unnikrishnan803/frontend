import { create } from "zustand";

import {
  createRoom as createRoomApi,
  finishRoom as finishRoomApi,
  joinRoom as joinRoomApi,
  revealAnswer as revealAnswerApi,
  startRound as startRoundApi,
  submitAnswer as submitAnswerApi,
  submitGuess as submitGuessApi,
} from "../lib/api";
import { GameSocket } from "../lib/socket";
import type { BootstrapPayload, RoomSnapshot, RoomStatus, SocketEvent, SyncPair } from "../lib/types";

interface GameStore {
  roomCode: string;
  playerId: string;
  playerName: string;
  status: RoomStatus;
  round: number;
  maxRounds: number;
  question: string | null;
  revealedAnswerId: number | null;
  revealedAnswerText: string | null;
  players: Array<{ id: string; name: string; score: number; is_host: boolean }>;
  pairs: SyncPair[];
  loading: boolean;
  error: string | null;
  isConnected: boolean;
  socket: GameSocket | null;
  createRoom: (name: string) => Promise<void>;
  joinRoom: (roomCode: string, name: string) => Promise<void>;
  connectSocket: (roomCode: string) => void;
  startRound: () => Promise<void>;
  submitAnswer: (text: string) => Promise<void>;
  revealAnswer: () => Promise<void>;
  submitGuess: (answerId: number, guessedPlayerId: string) => Promise<void>;
  finishRoom: () => Promise<void>;
  clearError: () => void;
  disconnect: () => void;
}

const emptyState = {
  roomCode: "",
  playerId: "",
  playerName: "",
  status: "LOBBY" as RoomStatus,
  round: 0,
  maxRounds: 5,
  question: null,
  revealedAnswerId: null,
  revealedAnswerText: null,
  players: [],
  pairs: [],
  loading: false,
  error: null,
  isConnected: false,
  socket: null as GameSocket | null,
};

function applySnapshot(
  snapshot: Partial<RoomSnapshot>,
  set: (partial: Partial<GameStore>) => void,
): void {
  set({
    roomCode: (snapshot.room_code ?? "") as string,
    status: (snapshot.status ?? "LOBBY") as RoomStatus,
    round: (snapshot.round ?? 0) as number,
    maxRounds: (snapshot.max_rounds ?? 5) as number,
    question: (snapshot.question ?? null) as string | null,
    revealedAnswerId: (snapshot.revealed_answer_id ?? null) as number | null,
    revealedAnswerText: (snapshot.revealed_answer_text ?? null) as string | null,
    players: (snapshot.players ?? []) as Array<{
      id: string;
      name: string;
      score: number;
      is_host: boolean;
    }>,
  });
}

function bootstrap(
  payload: BootstrapPayload,
  set: (partial: Partial<GameStore>) => void,
): void {
  set({
    playerId: payload.player_id,
    playerName: payload.player_name,
  });
  applySnapshot(payload, set);
}

export const useGameStore = create<GameStore>((set, get) => {
  const onSocketEvent = (message: SocketEvent) => {
    if (message.event === "connected") {
      set({ isConnected: true });
      return;
    }

    if (message.event === "state_updated") {
      applySnapshot(message.payload as Partial<RoomSnapshot>, set);
      return;
    }

    if (message.event === "final_results") {
      const pairs = ((message.payload as { pairs?: SyncPair[] }).pairs ?? []) as SyncPair[];
      set({ pairs, status: "FINISHED" });
      return;
    }

    if (message.event === "error") {
      const payload = message.payload as { message?: string };
      set({ error: payload.message ?? "Socket error" });
    }
  };

  return {
    ...emptyState,
    clearError: () => set({ error: null }),

    createRoom: async (name: string) => {
      set({ loading: true, error: null });
      try {
        const payload = await createRoomApi(name);
        bootstrap(payload, set);
        get().connectSocket(payload.room_code);
      } catch (error) {
        set({ error: error instanceof Error ? error.message : "Failed to create room" });
      } finally {
        set({ loading: false });
      }
    },

    joinRoom: async (roomCode: string, name: string) => {
      set({ loading: true, error: null });
      try {
        const payload = await joinRoomApi(roomCode, name);
        bootstrap(payload, set);
        get().connectSocket(payload.room_code);
      } catch (error) {
        set({ error: error instanceof Error ? error.message : "Failed to join room" });
      } finally {
        set({ loading: false });
      }
    },

    connectSocket: (roomCode: string) => {
      get().socket?.disconnect();
      const socket = new GameSocket(onSocketEvent);
      socket.connect(roomCode);
      set({ socket, isConnected: false });
    },

    startRound: async () => {
      const state = get();
      if (!state.roomCode) {
        return;
      }
      set({ loading: true, error: null });
      try {
        const payload = await startRoundApi(state.roomCode);
        applySnapshot(payload, set);
      } catch (error) {
        set({ error: error instanceof Error ? error.message : "Unable to start round" });
      } finally {
        set({ loading: false });
      }
    },

    submitAnswer: async (text: string) => {
      const state = get();
      if (!state.roomCode || !state.playerId) {
        return;
      }
      set({ loading: true, error: null });
      try {
        const payload = await submitAnswerApi(state.roomCode, state.playerId, text);
        applySnapshot(payload, set);
      } catch (error) {
        set({ error: error instanceof Error ? error.message : "Unable to submit answer" });
      } finally {
        set({ loading: false });
      }
    },

    revealAnswer: async () => {
      const state = get();
      if (!state.roomCode) {
        return;
      }
      set({ loading: true, error: null });
      try {
        const payload = await revealAnswerApi(state.roomCode);
        applySnapshot(payload, set);
      } catch (error) {
        set({ error: error instanceof Error ? error.message : "Unable to reveal answer" });
      } finally {
        set({ loading: false });
      }
    },

    submitGuess: async (answerId: number, guessedPlayerId: string) => {
      const state = get();
      if (!state.roomCode || !state.playerId) {
        return;
      }
      set({ loading: true, error: null });
      try {
        const payload = await submitGuessApi(state.roomCode, state.playerId, answerId, guessedPlayerId);
        applySnapshot(payload, set);
      } catch (error) {
        set({ error: error instanceof Error ? error.message : "Unable to submit guess" });
      } finally {
        set({ loading: false });
      }
    },

    finishRoom: async () => {
      const state = get();
      if (!state.roomCode) {
        return;
      }
      set({ loading: true, error: null });
      try {
        const payload = await finishRoomApi(state.roomCode);
        applySnapshot(payload, set);
        set({ pairs: payload.pairs ?? [], status: "FINISHED" });
      } catch (error) {
        set({ error: error instanceof Error ? error.message : "Unable to finish room" });
      } finally {
        set({ loading: false });
      }
    },

    disconnect: () => {
      get().socket?.disconnect();
      set({ ...emptyState });
    },
  };
});
