import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Payment {
  id: number;
  user: any;
  formation: any;
  amount: number;
  paymentMethod: string;
  status: string;
  transactionId: string;
  providerReference?: string;
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

export enum PaymentMethod {
  ORANGE_MONEY = 'ORANGE_MONEY',
  WAVE = 'WAVE',
  M_PESA = 'M_PESA',
  MOBILE_MONEY = 'MOBILE_MONEY',
  CARD = 'CARD',
  BANK_TRANSFER = 'BANK_TRANSFER'
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api/payments';

  constructor(private http: HttpClient) {}

  createPayment(formationId: number, paymentMethod: PaymentMethod): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/formation/${formationId}`, {
      paymentMethod: paymentMethod
    });
  }

  completePayment(transactionId: string, providerReference: string): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/${transactionId}/complete`, {
      providerReference: providerReference
    });
  }

  cancelPayment(transactionId: string): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/${transactionId}/cancel`, {});
  }

  getMyPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/my-payments`);
  }

  getPaymentById(paymentId: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${paymentId}`);
  }

  hasPaidForFormation(formationId: number): Observable<{hasPaid: boolean}> {
    return this.http.get<{hasPaid: boolean}>(`${this.apiUrl}/formation/${formationId}/has-paid`);
  }

  initiateMobileMoneyPayment(paymentId: number, phoneNumber: string): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/${paymentId}/initiate`, {
      phoneNumber: phoneNumber
    });
  }
}


