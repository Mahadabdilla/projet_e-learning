import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { Notification, NotificationType } from '../../../shared/models/notification.model';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount: number = 0;
  showDropdown = false;
  loading = false;
  private refreshSubscription?: Subscription;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.loadNotifications();
    this.loadUnreadCount();
    
    // Rafraîchir toutes les 30 secondes
    this.refreshSubscription = interval(30000).subscribe(() => {
      this.loadNotifications();
      this.loadUnreadCount();
    });

    // Écouter les changements du compteur
    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    });
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadNotifications() {
    this.loading = true;
    this.notificationService.getMyNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des notifications:', err);
        this.loading = false;
      }
    });
  }

  loadUnreadCount() {
    this.notificationService.getUnreadCount().subscribe({
      next: (count) => {
        this.unreadCount = count;
      },
      error: (err) => {
        console.error('Erreur lors du chargement du compteur:', err);
      }
    });
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
    if (this.showDropdown) {
      this.loadNotifications();
    }
  }

  markAsRead(notification: Notification) {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).subscribe({
        next: () => {
          notification.isRead = true;
          this.loadUnreadCount();
        },
        error: (err) => {
          console.error('Erreur lors du marquage comme lu:', err);
        }
      });
    }
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.isRead = true);
        this.loadUnreadCount();
      },
      error: (err) => {
        console.error('Erreur lors du marquage de toutes comme lues:', err);
      }
    });
  }

  deleteNotification(notificationId: number, event: Event) {
    event.stopPropagation();
    if (confirm('Êtes-vous sûr de vouloir supprimer cette notification ?')) {
      this.notificationService.deleteNotification(notificationId).subscribe({
        next: () => {
          this.notifications = this.notifications.filter(n => n.id !== notificationId);
          this.loadUnreadCount();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
        }
      });
    }
  }

  getNotificationIcon(type: NotificationType): string {
    const icons: { [key in NotificationType]: string } = {
      ENROLLMENT: '📚',
      PAYMENT_COMPLETED: '✅',
      PAYMENT_FAILED: '❌',
      MENTORING_REQUEST: '👥',
      MENTORING_ACCEPTED: '✓',
      MENTORING_REJECTED: '✗',
      FORMATION_COMPLETED: '🎓',
      NEW_MESSAGE: '💬',
      REVIEW_RECEIVED: '⭐',
      SYSTEM: '🔔'
    };
    return icons[type] || '🔔';
  }

  getNotificationColor(type: NotificationType): string {
    const colors: { [key in NotificationType]: string } = {
      ENROLLMENT: 'bg-blue-100 text-blue-800',
      PAYMENT_COMPLETED: 'bg-green-100 text-green-800',
      PAYMENT_FAILED: 'bg-red-100 text-red-800',
      MENTORING_REQUEST: 'bg-purple-100 text-purple-800',
      MENTORING_ACCEPTED: 'bg-green-100 text-green-800',
      MENTORING_REJECTED: 'bg-red-100 text-red-800',
      FORMATION_COMPLETED: 'bg-yellow-100 text-yellow-800',
      NEW_MESSAGE: 'bg-blue-100 text-blue-800',
      REVIEW_RECEIVED: 'bg-orange-100 text-orange-800',
      SYSTEM: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      return 'À l\'instant';
    }
  }

  hasUnreadNotifications(): boolean {
    return this.unreadCount > 0 || this.notifications.some(n => !n.isRead);
  }
}


