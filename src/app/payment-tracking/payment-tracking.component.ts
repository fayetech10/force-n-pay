import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-payment-tracking',
  standalone: true,
  imports: [
    MatChipsModule,
     
    CommonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule
  
    // MatChipSelectionChange
  ],
  templateUrl: './payment-tracking.component.html',
  styleUrl: './payment-tracking.component.scss'
})
export class PaymentTrackingComponent {
copyToClipboard(arg0: any) {
throw new Error('Method not implemented.');
}
getMissionStatus() {
throw new Error('Method not implemented.');
}
formatDate(arg0: any) {
throw new Error('Method not implemented.');
}
formatCurrency(arg0: any) {
throw new Error('Method not implemented.');
}
paymentData: any;

}
