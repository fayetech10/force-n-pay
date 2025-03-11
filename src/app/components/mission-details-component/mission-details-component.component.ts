import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Mission } from '../../interfaces/Mission';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

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
    public dialogRef: MatDialogRef<MissionDetailsComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mission: Mission }
  ) { }
  onClose(): void {
    this.dialogRef.close()
  }
}
