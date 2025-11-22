import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService, PaymentMethod } from '../../core/services/payment.service';
import { Formation } from '../../shared/models/formation.model';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  @Input() formation!: Formation;
  @Output() paymentCompleted = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  selectedPaymentMethod: PaymentMethod = PaymentMethod.ORANGE_MONEY;
  phoneNumber: string = '';
  isLoading = false;
  error: string | null = null;
  success = false;
  currentPayment: any = null;

  paymentMethods = [
    { value: PaymentMethod.ORANGE_MONEY, label: 'Orange Money', icon: '🟠' },
    { value: PaymentMethod.WAVE, label: 'Wave', icon: '🌊' },
    { value: PaymentMethod.M_PESA, label: 'M-Pesa', icon: '📱' },
    { value: PaymentMethod.MOBILE_MONEY, label: 'Mobile Money', icon: '💳' },
    { value: PaymentMethod.CARD, label: 'Carte bancaire', icon: '💳' },
    { value: PaymentMethod.BANK_TRANSFER, label: 'Virement bancaire', icon: '🏦' }
  ];

  constructor(private paymentService: PaymentService) {}

  ngOnInit() {
    if (!this.formation) {
      this.error = 'Formation non trouvée';
    }
  }

  initiatePayment() {
    if (!this.formation || !this.formation.id) {
      this.error = 'Formation invalide';
      return;
    }

    // Vérifier le numéro de téléphone pour Mobile Money
    const isMobileMoney = [
      PaymentMethod.ORANGE_MONEY,
      PaymentMethod.WAVE,
      PaymentMethod.M_PESA,
      PaymentMethod.MOBILE_MONEY
    ].includes(this.selectedPaymentMethod);

    if (isMobileMoney && (!this.phoneNumber || this.phoneNumber.trim().length < 8)) {
      this.error = 'Veuillez entrer un numéro de téléphone valide';
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.success = false;

    // Étape 1: Créer le paiement
    this.paymentService.createPayment(this.formation.id, this.selectedPaymentMethod).subscribe({
      next: (payment) => {
        this.currentPayment = payment;
        
        // Étape 2: Initier le paiement Mobile Money si nécessaire
        if (isMobileMoney) {
          this.paymentService.initiateMobileMoneyPayment(payment.id, this.phoneNumber).subscribe({
            next: (updatedPayment) => {
              this.currentPayment = updatedPayment;
              // Simuler le processus de paiement (dans un vrai système, cela redirigerait vers le provider)
              this.simulatePayment(updatedPayment.transactionId);
            },
            error: (err) => {
              console.error('Erreur lors de l\'initiation du paiement:', err);
              this.error = err.error?.message || 'Erreur lors de l\'initiation du paiement. Veuillez réessayer.';
              this.isLoading = false;
            }
          });
        } else {
          // Pour les autres méthodes (carte, virement), simuler directement
          this.simulatePayment(payment.transactionId);
        }
      },
      error: (err) => {
        console.error('Erreur lors de la création du paiement:', err);
        this.error = err.error?.message || 'Erreur lors de la création du paiement. Veuillez réessayer.';
        this.isLoading = false;
      }
    });
  }

  simulatePayment(transactionId: string) {
    // Dans un vrai système, cela redirigerait vers le provider de paiement
    // Pour l'instant, on simule un paiement réussi après 2 secondes
    setTimeout(() => {
      this.completePayment(transactionId, 'SIM-' + Date.now());
    }, 2000);
  }

  completePayment(transactionId: string, providerReference: string) {
    this.paymentService.completePayment(transactionId, providerReference).subscribe({
      next: (payment) => {
        this.success = true;
        this.isLoading = false;
        setTimeout(() => {
          this.paymentCompleted.emit();
        }, 1500);
      },
      error: (err) => {
        console.error('Erreur lors de la complétion du paiement:', err);
        this.error = 'Erreur lors de la confirmation du paiement.';
        this.isLoading = false;
      }
    });
  }

  cancelPayment() {
    if (this.currentPayment && this.currentPayment.transactionId) {
      this.paymentService.cancelPayment(this.currentPayment.transactionId).subscribe({
        next: () => {
          this.cancelled.emit();
        },
        error: (err) => {
          console.error('Erreur lors de l\'annulation:', err);
        }
      });
    } else {
      this.cancelled.emit();
    }
  }

  getPaymentMethodLabel(method: PaymentMethod): string {
    const pm = this.paymentMethods.find(m => m.value === method);
    return pm ? pm.label : method;
  }
}


