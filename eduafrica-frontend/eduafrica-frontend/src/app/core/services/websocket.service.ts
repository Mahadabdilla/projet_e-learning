import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Message, MessageService } from './message.service';
import { AuthService } from './auth.service';
import SockJS from 'sockjs-client';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client | null = null;
  private messageSubject = new Subject<Message>();
  public messages$ = this.messageSubject.asObservable();
  private notificationSubject = new Subject<any>();
  public notifications$ = this.notificationSubject.asObservable();
  private connected = false;
  private subscriptions: StompSubscription[] = [];

  constructor(
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  connect(): void {
    if (this.connected || !this.authService.isAuthenticated()) {
      return;
    }

    const token = this.authService.getToken();
    const currentUser = this.authService.getCurrentUser();
    
    if (!token || !currentUser?.id) {
      console.warn('Token ou utilisateur non disponible pour WebSocket');
      return;
    }

    // Créer le client STOMP
    this.stompClient = new Client({
      webSocketFactory: () => {
        return new SockJS('http://localhost:8080/ws') as unknown as WebSocket;
      },
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        this.connected = true;
        console.log('WebSocket connecté');

        // S'abonner aux messages personnels
        const messageSub = this.stompClient!.subscribe(
          `/queue/messages/${currentUser.id}`,
          (message: IMessage) => {
            const msg: Message = JSON.parse(message.body);
            this.messageSubject.next(msg);
            this.messageService.loadUnreadCount();
          }
        );
        this.subscriptions.push(messageSub);

        // S'abonner aux notifications
        const notificationSub = this.stompClient!.subscribe(
          `/queue/notifications/${currentUser.id}`,
          (notification: IMessage) => {
            const notif = JSON.parse(notification.body);
            this.notificationSubject.next(notif);
            if (notif.unreadCount !== undefined) {
              this.messageService.updateUnreadCount(notif.unreadCount);
            }
          }
        );
        this.subscriptions.push(notificationSub);
      },
      onStompError: (frame) => {
        console.error('Erreur STOMP:', frame);
        this.connected = false;
      },
      onWebSocketError: (event) => {
        console.error('Erreur WebSocket:', event);
        this.connected = false;
      },
      onDisconnect: () => {
        console.log('WebSocket déconnecté');
        this.connected = false;
        this.subscriptions = [];
      }
    });

    // Activer le client
    this.stompClient.activate();
  }

  subscribeToConversation(conversationId: number): void {
    if (!this.connected || !this.stompClient) {
      return;
    }

    const sub = this.stompClient.subscribe(
      `/topic/conversation/${conversationId}`,
      (message: IMessage) => {
        const msg: Message = JSON.parse(message.body);
        this.messageSubject.next(msg);
        this.messageService.loadUnreadCount();
      }
    );
    this.subscriptions.push(sub);
  }

  disconnect(): void {
    if (this.stompClient && this.connected) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
      this.subscriptions = [];
      this.stompClient.deactivate();
      this.connected = false;
      console.log('WebSocket déconnecté');
    }
  }

  isConnected(): boolean {
    return this.connected && this.stompClient?.active === true;
  }
}

