import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MentoringRequestService } from '../../core/services/mentoring-request.service';
import { MentorProfile } from '../../core/services/mentor.service';

@Component({
  selector: 'app-request-mentor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './request-mentor.component.html',
  styleUrls: ['./request-mentor.component.css']
})
export class RequestMentorComponent implements OnInit {
  @Input() mentor!: MentorProfile;
  @Output() requestCreated = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  message: string = '';
  isLoading = false;
  error: string | null = null;
  success = false;

  constructor(private mentoringRequestService: MentoringRequestService) {}

  ngOnInit() {
    if (!this.mentor) {
      this.error = 'Mentor non trouvé';
    }
  }

  submitRequest() {
    if (!this.mentor || !this.mentor.id) {
      this.error = 'Mentor invalide';
      return;
    }

    if (!this.message.trim()) {
      this.error = 'Veuillez saisir un message';
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.success = false;

    this.mentoringRequestService.createMentoringRequest(this.mentor.id, this.message.trim()).subscribe({
      next: () => {
        this.success = true;
        this.isLoading = false;
        setTimeout(() => {
          this.requestCreated.emit();
        }, 1500);
      },
      error: (err) => {
        console.error('Erreur lors de la création de la demande:', err);
        this.error = err.error?.message || 'Erreur lors de la création de la demande. Veuillez réessayer.';
        this.isLoading = false;
      }
    });
  }

  cancel() {
    this.cancelled.emit();
  }
}

