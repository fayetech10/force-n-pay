import { Component, Inject } from '@angular/core';
import { Activity } from '../../../interfaces/Actiites';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-rapport-show',
  imports: [],
  templateUrl: './rapport-show.component.html',
  styleUrl: './rapport-show.component.scss'
})
export class RapportShowComponent {
  activities!: Activity
  constructor(public dialogRef: MatDialogRef<RapportShowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { activity: Activity }
  ) {
    this.activities = data.activity
    console.log(this.activities)
  }

  onClose() {
    this.dialogRef.close()
  }
}
