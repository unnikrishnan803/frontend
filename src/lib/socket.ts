import { WS_URL } from "./constants";
import type { SocketEvent } from "./types";

type Handler = (event: SocketEvent) => void;

export class GameSocket {
  private socket: WebSocket | null = null;
  private handler: Handler;

  constructor(handler: Handler) {
    this.handler = handler;
  }

  connect(roomCode: string): void {
    this.disconnect();
    this.socket = new WebSocket(`${WS_URL}/${roomCode}/`);
    this.socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data) as SocketEvent;
        this.handler(parsed);
      } catch (error) {
        console.error("Socket parse error", error);
      }
    };
  }

  send(action: string, data: Record<string, unknown> = {}): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }
    this.socket.send(JSON.stringify({ action, data }));
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
