import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../interfaces/User';
import { Seance } from '../../interfaces/Seance';
import { AuthService } from '../../services/auth.service';
import { SeanceService } from '../../services/seance.service';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CommonModule, DatePipe, SlicePipe } from '@angular/common';
import { Cohorte } from '../../interfaces/Cohorte';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-seance-list-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DatePipe,
    SlicePipe
  ],
  templateUrl: './seance-list-component.component.html',
  styleUrl: './seance-list-component.component.scss'
})
export class SeanceListComponentComponent implements OnInit, OnDestroy {

  user!: User
  // Données et état
  seances: Seance[] = [];
  filteredSeances: Seance[] = [];
  cohortes: Cohorte[] = [];

  // Variables pour formulaire modal
  seanceForm!: FormGroup;
  isEditMode = false;
  showFormModal = false;
  currentSeanceId: number | null = null;

  // Variables pour modal de suppression
  showDeleteModal = false;
  seanceToDelete: Seance | null = null;

  // Variables pour la recherche et le filtrage
  searchTerm = '';
  filterCohorte = '';
  filterDate = '';
  sortColumn = '';
  sortDirection = 'asc';

  // Variables pour la pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  pageNumbers: number[] = [];

  hourTotal!: number

  // Pour utiliser Math dans le template
  Math = Math;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private seanceService: SeanceService,
    private fb: FormBuilder

  ) { }

  ngOnInit(): void {
    this.initForm()
    this.loadSeanceByIdUser()
    this.loadCohortes();
  }
  loadhourTotal(userId: number): void {
    this.seanceService.getTotalHour(userId).subscribe({
      next: (hourTotal) => {
        this.hourTotal = hourTotal
        console.log(this.hourTotal)
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  loadCohortes() {
    this.seanceService.getCohortes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cohortes) => {
          this.cohortes = cohortes
        },
        error: (err) => {
          console.log(err)
        }
      })
  }

  applyFilters(): void {
    let results = [...this.seances];

    // Appliquer la recherche
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      results = results.filter(seance =>
        seance.activite?.toLowerCase().includes(term) ||
        seance.cohorte.nom.toLowerCase().includes(term) ||
        seance.cohorte.groupe.nom.toLowerCase().includes(term)
      );
    }

    // Filtrer par cohorte
    if (this.filterCohorte) {
      results = results.filter(seance =>
        seance.cohorte.id.toString() === this.filterCohorte
      );
    }

    // Filtrer par date
    if (this.filterDate) {
      const filterDateObj = new Date(this.filterDate);
      results = results.filter(seance => {
        if (!seance.date) return false;

        const seanceDateObj = new Date(seance.date);
        return seanceDateObj.toDateString() === filterDateObj.toDateString();
      });
    }

    // Appliquer le tri
    if (this.sortColumn) {
      results.sort((a, b) => {
        let valueA: any;
        let valueB: any;

        // Extraire les valeurs selon la colonne de tri
        switch (this.sortColumn) {
          case 'date':
            valueA = a.date ? new Date(a.date).getTime() : 0;
            valueB = b.date ? new Date(b.date).getTime() : 0;
            break;
          case 'heuresTotaux':
            valueA = parseFloat(a?.heuresTotaux);
            valueB = parseFloat(b?.heuresTotaux);
            break;
          default:
            valueA = a[this.sortColumn as keyof Seance];
            valueB = b[this.sortColumn as keyof Seance];
        }

        // Comparer les valeurs
        if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    this.filteredSeances = results;
    this.updatePagination();
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      // Inverser la direction si la même colonne est cliquée
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filterCohorte = '';
    this.filterDate = '';
    this.sortColumn = '';
    this.sortDirection = 'asc';
    this.applyFilters();
  }

  // Fonctions de pagination
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredSeances.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    this.currentPage = Math.max(1, this.currentPage);

    // Générer les numéros de page
    const maxPageButtons = 5;
    this.pageNumbers = [];

    if (this.totalPages <= maxPageButtons) {
      // Afficher toutes les pages si leur nombre total est inférieur ou égal à maxPageButtons
      for (let i = 1; i <= this.totalPages; i++) {
        this.pageNumbers.push(i);
      }
    } else {
      // Calculer les pages à afficher
      let startPage = Math.max(1, this.currentPage - Math.floor(maxPageButtons / 2));
      let endPage = startPage + maxPageButtons - 1;

      // Ajustement si on dépasse le nombre total de pages
      if (endPage > this.totalPages) {
        endPage = this.totalPages;
        startPage = Math.max(1, endPage - maxPageButtons + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        this.pageNumbers.push(i);
      }
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Fonctions pour le modal de formulaire (ajout/modification)
  openAddModal(): void {
    this.isEditMode = false;
    this.currentSeanceId = null;
    this.seanceForm.reset({
      cohorteId: this.cohortes.length > 0 ? this.cohortes[0].id : '',
      heureDebut: '09:00',
      heureFin: '10:00',
      heuresTotaux: '1'
    });
    this.showFormModal = true;
  }

  openEditModal(seance: Seance): void {
    this.isEditMode = true;
    this.currentSeanceId = seance.id; // Supposons que la séance a un identifiant unique

    this.seanceForm.patchValue({
      activite: seance.activite,
      cohorteId: seance.cohorte.id,
      date: seance.date ? this.formatDateForInput(seance.date) : null,
      heureDebut: seance.heureDebut,
      heureFin: seance.heureFin,
      heuresTotaux: seance.heuresTotaux
    });

    this.showFormModal = true;
  }

  closeFormModal(): void {
    this.showFormModal = false;
  }
  formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().substring(0, 10);
  }
  submitSeance(): void {
    if (this.seanceForm.valid) {
      const formValues = this.seanceForm.value;
      const selectedCohorte = this.cohortes.find(c => c.id === parseInt(formValues.cohorteId, 10));

      if (selectedCohorte) {

        const seanceData: Seance = {
          id: this.isEditMode ? this.currentSeanceId! : null, // Utiliser un ID existant ou en générer un nouveau
          activite: formValues.activite,
          cohorte: selectedCohorte,
          date: formValues.date ? new Date(formValues.date) : null,
          heureDebut: formValues.heureDebut,
          heureFin: formValues.heureFin,

          heuresTotaux: '',
          utilisateur: this.user
        };

        if (this.isEditMode) {
          this.seanceService.updateSeance(seanceData).subscribe({
            next: (response) => {
              this.loadSeanceByIdUser()
              this.closeFormModal()
            },
            error: (err) => {
              console.log(err)
            }
          });
        } else {
          this.seanceService.addSeance(seanceData).subscribe({
            next: (seance) => {
              console.log(seance)
              this.loadSeanceByIdUser()
              this.closeFormModal()
            }, error: (err) => {
              console.log(err)
            }
          })
        }
      }
    }
  }

  // Fonctions pour le modal de suppression
  openDeleteConfirmation(seance: Seance): void {
    this.seanceToDelete = seance;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.seanceToDelete = null;
  }

  deleteSeance(): void {
    if (this.seanceToDelete?.id) {
      // this.seanceService.deleteSeance(this.seanceToDelete.id).subscribe(() => {
      //   this.loadSeances();
      //   this.closeDeleteModal();
      // });
    }
  }

  // Fonction pour dupliquer une séance
  duplicateSeance(seance: Seance): void {
    console.log(seance)
    const duplicatedSeance: Seance = {
      ...seance,
       // Nouvel ID pour la séance dupliquée
      activite: `Copie de ${seance}`
    };
    this.seanceService.addSeance(duplicatedSeance).subscribe({
      next: (seance) => {
        console.log(seance)
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  initForm() {
    this.seanceForm = this.fb.group({
      activite: ['', Validators.required],
      cohorteId: ['', Validators.required],
      date: [null],
      heureDebut: ['', Validators.required],
      heureFin: ['', Validators.required],
    })
  }

  loadSeanceByIdUser(): void {
    this.authService.getUserProfile().pipe(
      switchMap((user) => {
        this.user = user
        this.loadhourTotal(user.id)
        return this.seanceService.getSeanceByUserId(user.id)
      }),
      tap({
        next: (seances) => {
          this.seances = seances
          this.applyFilters()
        }
      }),
      takeUntil(this.destroy$)


    ).subscribe({
      error: (err) => {
        console.error("Erreur lors du chargement :", err);
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
