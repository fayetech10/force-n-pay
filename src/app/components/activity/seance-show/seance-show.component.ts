import { Component, Inject } from '@angular/core';
import { Activity } from '../../../interfaces/Actiites';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-seance-show',
  imports: [],
  templateUrl: './seance-show.component.html',
  styleUrl: './seance-show.component.scss'
})
export class SeanceShowComponent {
  activities!: Activity
  constructor(public dialogRef: MatDialogRef<SeanceShowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { activity: Activity }
  ) {
    this.activities = data.activity
    console.log(this.activities)
  }

  onClose() {
    this.dialogRef.close()
  }
}
