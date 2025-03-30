import { Component, Inject, OnInit } from '@angular/core';
import { RapportService } from '../../services/rapport.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Mission } from '../../interfaces/Mission';

@Component({
  selector: 'app-create-reports',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './create-reports.component.html',
  styleUrl: './create-reports.component.scss'
})
export class CreateReportsComponent implements OnInit {
  selectedFile?: File;
  titre = '';
  missionId?: number;
  uploadProgress = 0;
  uploadCompleted = false;
  errorMessage = '';
  mission!: Mission
  formattedStartDate: string = '';
  formattedEndDate: string = '';
  showUploadForm: boolean = false;

  daysLeft: number = 0;
  constructor(
    private readonly dialogRef: MatDialogRef<CreateReportsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mission: Mission },
    private rapportService: RapportService) {
    this.mission = data.mission
  }
  ngOnInit(): void {
    this.missionId = this.mission.id
    this.formattedStartDate = this.formatDate(new Date(this.mission.dateDebut));
    this.formattedEndDate = this.formatDate(new Date(this.mission.dateFin));
    const endDate = new Date(this.mission.dateFin);
    const today = new Date();
    this.daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0]
    this.errorMessage = ''

    if (this.selectedFile?.type !== 'application/pdf') {
      this.errorMessage = "Seul les fichiers PDF sont autorises"
      this.selectedFile = undefined
    }
  }

  onSubmit(): void {
    if (!this.selectedFile || !this.titre || !this.missionId) {
      this.errorMessage = "Tous les champs sont requis"

      return;
    }
    this.rapportService.uploadRapport(this.selectedFile, this.titre, this.missionId).subscribe({
      next: (response) => {
        console.log("Upload reussi", response)
        this.uploadCompleted = true
        this.resetForm()
        setTimeout(() => {
          this.showUploadForm = false

        }, 1500);

      },
      error: (err) => {
        console.error('Erreur upload:', err);
        this.errorMessage = err.error?.message || 'Erreur lors de l\'upload';
      }
    })
  }
  resetForm(): void {
    this.selectedFile = undefined
    this.titre = ''
    this.missionId = undefined

    setTimeout(() => {
      this.uploadCompleted = false
    }, 1000);
  }
  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('fr-FR', options);
  }
  onClose() {
    this.dialogRef.close()
  }
  getStatusClass(): string {
    switch (this.mission.status_mission) {
      case 'Termine':
        return 'bg-green-100 text-green-800';
      case 'En cours':
        return 'bg-blue-100 text-blue-800';
      case 'Annule':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  getProgressColor(): string {
    const progress = this.mission.progress;
    if (progress < 25) return 'bg-red-500';
    if (progress < 50) return 'bg-orange-500';
    if (progress < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  }
}
