import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000', {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    this.registerBasicListeners();
  }

  private registerBasicListeners(): void {
    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('❌ Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });
  }

  emit(event: string, data: any): void {
    if (this.socket.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected. Emit queued:', event);
    }
  }

  emitWithAck(event: string, data: any): Observable<any> {
    return new Observable(observer => {
      if (this.socket.connected) {
        this.socket.emit(event, data, (response: any) => {
          observer.next(response);
          observer.complete();
        });
      } else {
        observer.error('Socket not connected');
      }
    });
  }

  listen(event: string): Observable<any> {
    return new Observable(observer => {
      this.socket.on(event, (data) => {
        observer.next(data);
      });
    });
  }

  joinGame(gameId: string): void {
    this.emit('join-game', gameId);
  }

  leaveGame(gameId: string): void {
    this.emit('leave-game', gameId);
  }

  disconnect(): void {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  connect(): void {
    if (!this.socket.connected) {
      this.socket.connect();
    }
  }
}
