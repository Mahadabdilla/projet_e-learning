import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

export interface Message {
  id: number;
  sender: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  receiver: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  conversation: Conversation;
  content: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface Conversation {
  id: number;
  participant1: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  participant2: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  lastMessage: Message | null;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'http://localhost:8080/api/messages';
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.loadUnreadCount();
  }

  sendMessage(receiverId: number, content: string): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/send`, {
      receiverId,
      content
    });
  }

  getMyConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.apiUrl}/conversations`);
  }

  getConversationMessages(conversationId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/conversations/${conversationId}/messages`);
  }

  getOrCreateConversation(otherUserId: number): Observable<Conversation> {
    return this.http.post<Conversation>(`${this.apiUrl}/conversations`, {
      otherUserId
    });
  }

  markMessagesAsRead(conversationId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/conversations/${conversationId}/read`, {});
  }

  getUnreadMessageCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/unread/count`);
  }

  getUnreadMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/unread`);
  }

  loadUnreadCount(): void {
    this.getUnreadMessageCount().subscribe({
      next: (count) => {
        this.unreadCountSubject.next(count);
      },
      error: (err) => {
        console.error('Erreur lors du chargement du compteur de messages:', err);
      }
    });
  }

  updateUnreadCount(count: number): void {
    this.unreadCountSubject.next(count);
  }
}


