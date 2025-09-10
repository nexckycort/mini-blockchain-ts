import type { Socket } from 'bun';

export class Connection {
  private socket: Socket;
  private peerUrl: string;
  private isAlive: boolean = true;
  private lastSeen: Date;

  constructor(peerUrl: string, socket: Socket) {
    this.peerUrl = peerUrl;
    this.socket = socket;
    this.lastSeen = new Date();
  }

  public send(message: any): void {
    try {
      const payload = JSON.stringify(message);
      this.socket.write(payload);
    } catch (err) {
      console.error(`❌ Error sending to ${this.peerUrl}:`, err);
    }
  }

  public markAlive(): void {
    this.isAlive = true;
    this.lastSeen = new Date();
  }
}
