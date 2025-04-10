// payment.component.ts
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { loadStripe, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {CommonModule} from '@angular/common';
import {AuthServiceConfig} from '../../services/AuthServiceConfig';

@Component({
  selector: 'app-payment',
  imports:[
    CommonModule,
  ],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  @ViewChild('cardElement') cardElement!: ElementRef;

  stripe: Stripe | null = null;
  elements?: StripeElements;
  card?: StripeCardElement;
  clientSecret: string = '';
  loading = false;
  paymentError: string | null = null;
  paymentSuccess = false;

  private baseUrl = "/api";

  constructor(private auth: AuthServiceConfig,  private http: HttpClient) {}

  async ngOnInit() {
    // Load Stripe with your public key
    this.stripe = await loadStripe('pk_test_51K0u7RBxDQ5YARqJMH1mMybdd8cFpYIwLOnpoUPjV9TpQVtIrcnvizgNRpWBOf6Unmq2pkh7c6S551j3ZRnYeNL70021MMCXpi');

    if (!this.stripe) {
      console.error('Failed to load Stripe');
      return;
    }

    // Initialize Stripe Elements after the view is ready
    setTimeout(() => this.initStripeElements(), 0);
  }

  initStripeElements() {
    if (!this.stripe || !this.cardElement) {
      return;
    }

    this.elements = this.stripe.elements();
    this.card = this.elements.create('card');
    this.card.mount(this.cardElement.nativeElement);
  }

  async createPaymentIntent() {
    if (!this.stripe || !this.card) {
      console.error('Stripe or card element not initialized');
      return;
    }

    this.loading = true;
    this.paymentError = null;
    this.paymentSuccess = false;

    try {
      // Example: amount in cents (e.g., 1000 = 10€)
      const paymentData = { amount: 1000 };

      // Call your backend to create a PaymentIntent
      const response = await firstValueFrom(
        this.http.post<{clientSecret: string}>(`${this.baseUrl}/payment/create`, paymentData, {headers: this.auth.createAuthHeaders()})
      );

      this.clientSecret = response.clientSecret;

      // Use the clientSecret to confirm payment via Stripe.js
      const result = await this.stripe.confirmCardPayment(this.clientSecret, {
        payment_method: {
          card: this.card,
          billing_details: {
            name: 'Client Name'
          }
        }
      });

      if (result.error) {
        this.paymentError = result.error.message || 'An error occurred during payment';
        console.error('Payment error:', result.error);
      } else if (result.paymentIntent?.status === 'succeeded') {
        this.paymentSuccess = true;
        console.log('Payment successful:', result.paymentIntent);
      }
    } catch (err: any) {
      this.paymentError = err.message || 'Failed to process payment';
      console.error('Payment processing error:', err);
    } finally {
      this.loading = false;
    }
  }
}
