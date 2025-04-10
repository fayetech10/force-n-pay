import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Activity } from '../../../interfaces/Actiites';
import { CommonModule } from '@angular/common';
import { Mission } from '../../../interfaces/Mission';

@Component({
  selector: 'app-mission-show',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './mission-show.component.html',
  styleUrl: './mission-show.component.scss'
})

export class MissionShowComponent {
  mission!: Mission
  constructor(public dialogRef: MatDialogRef<MissionShowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mission: Mission }
  ) {
    this.mission = data.mission
    console.log(this.mission)
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
  onClose() {
    this.dialogRef.close()
  }
}
