import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-loading-component',
  imports: [
    CommonModule
  ],
  templateUrl: './loading-component.component.html',
  styleUrl: './loading-component.component.scss'
})
export class LoadingComponentComponent {
  constructor(private dialogRef: MatDialogRef<LoadingComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      title?: string;
      message?: string;
      showProgressBar?: boolean;
      progress?: number;
    }
  ) { }

}
