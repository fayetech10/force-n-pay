import { Component, Inject } from '@angular/core';
import { Activity } from '../../../interfaces/Actiites';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-paiement-show',
  imports: [],
  templateUrl: './paiement-show.component.html',
  styleUrl: './paiement-show.component.scss'
})
export class PaiementShowComponent {

  activities!: Activity
  constructor(public dialogRef: MatDialogRef<PaiementShowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { activity: Activity }
  ) {
    this.activities = data.activity
    console.log(this.activities)
  }

  onClose() {
    this.dialogRef.close()
  }

}
