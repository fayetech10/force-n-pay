import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Mission } from '../../interfaces/Mission';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { PaymentComponent } from '../payment/payment.component';

@Component({
  selector: 'app-mission-details-component',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatCardModule,
    MatDividerModule,
    MatChipsModule,
    DatePipe,
  ],

  templateUrl: './mission-details-component.component.html',
  styleUrl: './mission-details-component.component.scss'
})
export class MissionDetailsComponentComponent {
  openDetails() {
    throw new Error('Method not implemented.');
  }
  getStatusIcon(arg0: string) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<MissionDetailsComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mission: Mission }
  ) { }
  onClose(): void {
    this.dialogRef.close()
  }
  getStatusClass(status: string) {
    return {
      'bg-green-50 text-green-700 border-green-200': status === 'Termine',
      'bg-blue-50 text-blue-700 border-blue-200': status === 'En Cours',
      'bg-gray-50 text-gray-700 border-gray-200': status === 'En attente'
    };
  }

  getPaymentStatusClass(status: string) {
    return {
      'bg-green-50 text-green-700 border-green-200': status === 'Paye',
      'bg-red-50 text-red-700 border-red-200': status !== 'Paye'
    };
  }
  paiement(mission: Mission) {
    this.dialog.open(PaymentComponent, {
      width: '50%',
      data: mission,
    })
    console.log(mission);
  }
}
