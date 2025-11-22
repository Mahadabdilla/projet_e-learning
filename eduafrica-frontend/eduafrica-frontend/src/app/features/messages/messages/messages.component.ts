import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MessageService, Message, Conversation } from '../../../core/services/message.service';
import { WebSocketService } from '../../../core/services/websocket.service';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {
  conversations: Conversation[] = [];
  selectedConversation: Conversation | null = null;
  messages: Message[] = [];
  loading = false;
  error: string | null = null;
  newMessageContent = '';
  unreadCount = 0;
  
  private subscriptions: Subscription[] = [];
  currentUserId: number | null = null;

  constructor(
    private messageService: MessageService,
    private webSocketService: WebSocketService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    this.currentUserId = currentUser?.id || null;
    
    this.loadConversations();
    this.loadUnreadCount();
    
    // Connecter WebSocket
    this.webSocketService.connect();
    
    // S'abonner aux nouveaux messages
    const messageSub = this.webSocketService.messages$.subscribe((message) => {
      if (this.selectedConversation && 
          message.conversation.id === this.selectedConversation.id) {
        this.messages.push(message);
        this.scrollToBottom();
      }
      this.loadConversations(); // Rafraîchir la liste
      this.loadUnreadCount();
    });
    this.subscriptions.push(messageSub);
    
    // S'abonner au compteur de messages non lus
    const unreadSub = this.messageService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    });
    this.subscriptions.push(unreadSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadConversations() {
    this.loading = true;
    this.messageService.getMyConversations().subscribe({
      next: (conversations) => {
        this.conversations = conversations;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des conversations:', err);
        this.error = 'Impossible de charger les conversations';
        this.loading = false;
      }
    });
  }

  loadUnreadCount() {
    this.messageService.getUnreadMessageCount().subscribe({
      next: (count) => {
        this.unreadCount = count;
      },
      error: (err) => {
        console.error('Erreur lors du chargement du compteur:', err);
      }
    });
  }

  selectConversation(conversation: Conversation) {
    this.selectedConversation = conversation;
    this.loadMessages(conversation.id);
    this.markAsRead(conversation.id);
    
    // S'abonner aux messages de cette conversation via WebSocket
    this.webSocketService.subscribeToConversation(conversation.id);
  }

  loadMessages(conversationId: number) {
    this.loading = true;
    this.messageService.getConversationMessages(conversationId).subscribe({
      next: (messages) => {
        this.messages = messages;
        this.loading = false;
        this.scrollToBottom();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des messages:', err);
        this.error = 'Impossible de charger les messages';
        this.loading = false;
      }
    });
  }

  sendMessage() {
    if (!this.newMessageContent.trim() || !this.selectedConversation) {
      return;
    }

    const otherUser = this.getOtherParticipant(this.selectedConversation);
    if (!otherUser) {
      return;
    }

    this.messageService.sendMessage(otherUser.id, this.newMessageContent.trim()).subscribe({
      next: (message) => {
        this.messages.push(message);
        this.newMessageContent = '';
        this.scrollToBottom();
        this.loadConversations(); // Rafraîchir pour mettre à jour lastMessage
      },
      error: (err) => {
        console.error('Erreur lors de l\'envoi du message:', err);
        this.error = 'Impossible d\'envoyer le message';
      }
    });
  }

  markAsRead(conversationId: number) {
    this.messageService.markMessagesAsRead(conversationId).subscribe({
      next: () => {
        this.loadUnreadCount();
      },
      error: (err) => {
        console.error('Erreur lors du marquage comme lu:', err);
      }
    });
  }

  getOtherParticipant(conversation: Conversation) {
    if (!this.currentUserId) return null;
    
    if (conversation.participant1.id === this.currentUserId) {
      return conversation.participant2;
    }
    return conversation.participant1;
  }

  getUnreadCountForConversation(conversation: Conversation): number {
    // Cette méthode devrait être améliorée avec un compteur côté backend
    // Pour l'instant, on retourne 0
    return 0;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    return date.toLocaleDateString('fr-FR');
  }

  scrollToBottom() {
    setTimeout(() => {
      const messagesContainer = document.getElementById('messages-container');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 100);
  }
}
