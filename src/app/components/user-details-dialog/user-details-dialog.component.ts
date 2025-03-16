import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../interfaces/User';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-details-dialog',
  imports: [
    CommonModule
  ],
  templateUrl: './user-details-dialog.component.html',
  styleUrl: './user-details-dialog.component.scss'
})
export class UserDetailsDialogComponent {

  user!: User
  nombreHeureRestant: string = "23h";
  nombrePaye: string = "10h";
nombreSeanceFaits: any;
  constructor(
    public dialogRef: MatDialogRef<UserDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User }

  ) {

    this.user = data.user
  }

  onClose() {
    this.dialogRef.close()
  }
}
