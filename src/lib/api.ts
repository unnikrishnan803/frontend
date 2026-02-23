import { API_URL } from "./constants";
import type { BootstrapPayload, RoomSnapshot } from "./types";

type JsonRecord = Record<string, unknown>;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const payload = await response.json();
  if (!response.ok) {
    const message = typeof payload?.detail === "string" ? payload.detail : "Request failed";
    throw new Error(message);
  }
  return payload as T;
}

export function createRoom(name: string): Promise<BootstrapPayload> {
  return request<BootstrapPayload>("/rooms/create/", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export function joinRoom(roomCode: string, name: string): Promise<BootstrapPayload> {
  return request<BootstrapPayload>("/rooms/join/", {
    method: "POST",
    body: JSON.stringify({ room_code: roomCode, name }),
  });
}

export function fetchRoomState(roomCode: string): Promise<RoomSnapshot> {
  return request<RoomSnapshot>(`/rooms/${roomCode}/state/`);
}

export function startRound(roomCode: string): Promise<RoomSnapshot> {
  return request<RoomSnapshot>("/rooms/start-round/", {
    method: "POST",
    body: JSON.stringify({ room_code: roomCode }),
  });
}

export function revealAnswer(roomCode: string): Promise<RoomSnapshot> {
  return request<RoomSnapshot>(`/rooms/${roomCode}/reveal/`, {
    method: "POST",
  });
}

export function finishRoom(roomCode: string): Promise<RoomSnapshot> {
  return request<RoomSnapshot>(`/rooms/${roomCode}/finish/`, {
    method: "POST",
  });
}

export function submitAnswer(
  roomCode: string,
  playerId: string,
  text: string,
): Promise<RoomSnapshot> {
  return request<RoomSnapshot>("/rooms/submit-answer/", {
    method: "POST",
    body: JSON.stringify({
      room_code: roomCode,
      player_id: playerId,
      text,
    }),
  });
}

export function submitGuess(
  roomCode: string,
  playerId: string,
  answerId: number,
  guessedPlayerId: string,
): Promise<RoomSnapshot> {
  return request<RoomSnapshot>("/rooms/submit-guess/", {
    method: "POST",
    body: JSON.stringify({
      room_code: roomCode,
      player_id: playerId,
      answer_id: answerId,
      guessed_player_id: guessedPlayerId,
    }),
  });
}

export async function tryRequest(path: string, body: JsonRecord): Promise<void> {
  await request(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
