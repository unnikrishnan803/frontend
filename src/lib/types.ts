export type RoomStatus = "LOBBY" | "QUESTION" | "REVEAL" | "SCOREBOARD" | "FINISHED";

export interface Player {
  id: string;
  name: string;
  score: number;
  is_host: boolean;
}

export interface SyncPair {
  player_one: string;
  player_two: string;
  player_one_name: string;
  player_two_name: string;
  answer_similarity: number;
  correct_guess_rate: number;
  mutual_selection_rate: number;
  sync_percentage: number;
}

export interface RoomSnapshot {
  room_code: string;
  status: RoomStatus;
  round: number;
  max_rounds: number;
  question: string | null;
  question_type: string | null;
  revealed_answer_id: number | null;
  revealed_answer_text: string | null;
  players: Player[];
  pairs?: SyncPair[];
}

export interface BootstrapPayload extends RoomSnapshot {
  player_id: string;
  player_name: string;
}

export interface SocketEvent {
  event: string;
  payload: Record<string, unknown>;
}
