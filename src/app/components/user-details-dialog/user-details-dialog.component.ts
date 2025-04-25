import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../interfaces/User';
import { CommonModule } from '@angular/common';
import { SeanceService } from '../../services/seance.service';

@Component({
  selector: 'app-user-details-dialog',
  imports: [
    CommonModule
  ],
  templateUrl: './user-details-dialog.component.html',
  styleUrl: './user-details-dialog.component.scss'
})
export class UserDetailsDialogComponent implements OnInit {

  user!: User
  nombreHeureRestant: string = "23h";
  nombrePaye: string = "10h";
  nombreSeanceFaits!: number;
  constructor(
    private seanceService: SeanceService,
    public dialogRef: MatDialogRef<UserDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User }

  ) {

    this.user = data.user
  }
  ngOnInit(): void {
    this.loadTotalHour()
  }

  loadTotalHour() {
    this.seanceService.getTotalHour(this.user.id).subscribe({
      next: (totalhour) => {
        this.nombreSeanceFaits = totalhour

      }
    })
  }

  onClose() {
    this.dialogRef.close()
  }
}
