import { connect, listen } from 'bun';

import { Connection } from './connection';

export class P2PNode {
  private peers: Map<string, Connection>;
  private port: number;

  constructor(port: number) {
    this.port = port;
    this.peers = new Map();
  }

  public start(): void {
    const server = listen({
      hostname: 'localhost',
      port: this.port,
      socket: {
        open: (socket) => {
          const peerUrl = `${socket.remoteAddress}:${socket.remotePort}`;
          const connection = new Connection(peerUrl, socket);
          this.peers.set(peerUrl, connection);
          console.log(`Peer connected: ${peerUrl}`);
        },

        data: (socket, data) => {
          const peerUrl = `${socket.remoteAddress}:${socket.remotePort}`;

          const connection = this.peers.get(peerUrl);
          if (connection) connection.markAlive();

          this.handleMessage(data, peerUrl);
        },

        close: (socket) => {
          const peerUrl = `${socket.remoteAddress}:${socket.remotePort}`;
          this.peers.delete(peerUrl);
          console.log('Peer disconnected');
        },
        error(_, error) {
          console.error(`⚡ Error with socket: ${error.message}`);
        },
      },
    });

    console.log(`P2P server listening on ${server.hostname}:${server.port}`);
  }

  public async connectToPeer(peer: string): Promise<void> {
    const [hostname, port] = peer.split(':');
    await connect({
      hostname: hostname,
      port: Number(port),

      socket: {
        open: (socket) => {
          const peerUrl = `${socket.remoteAddress}:${socket.remotePort}`;
          const connection = new Connection(peerUrl, socket);
          this.peers.set(peerUrl, connection);
          console.log(`Connected to peer: ${peerUrl}`);
        },

        data: (socket, data) => {
          const peerUrl = `${socket.remoteAddress}:${socket.remotePort}`;
          this.handleMessage(data, peerUrl);
        },

        close: (socket) => {
          const peerUrl = `${socket.remoteAddress}:${socket.remotePort}`;
          this.peers.delete(peerUrl);
          console.log(`Disconnected from peer ${peerUrl}`);
        },

        error: (_, err) => {
          console.error(`Client connection error: ${err.message}`);
        },
      },
    });
  }

  public broadcast(message: string): void {
    for (const connection of this.peers.values()) {
      connection.send(message);
    }
  }

  public handleMessage(message: Buffer<ArrayBufferLike>, peer: string): void {
    console.log(`Message from ${peer}: ${message.toString()}`);
  }
}
