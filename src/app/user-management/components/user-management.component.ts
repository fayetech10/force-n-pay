import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { User } from '../../interfaces/User';
import { UserService } from '../../services/users.service';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, Observable, of, Subject, takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ContactItem } from '../../interfaces/ContactItem';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserFormDialogComponent } from '../../components/user-form-dialog/user-form-dialog.component';
import { UserDetailsDialogComponent } from '../../components/user-details-dialog/user-details-dialog.component';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-user-management',
  imports: [
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    CommonModule,
    MatProgressSpinner,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatTooltipModule,
    MatButtonModule,
    MatPaginatorModule
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})


export class UserManagementComponent implements OnInit, OnDestroy {

  isLoading = false;
  totalUsers = 0;
  pageSize = 6;
  currentPage = 0;
  searchTerm = '';
  filterRole = '';
  filterQualification = '';
  hasActiveFilters = false;

  allRoles: string[] = [];
  allQualifications: string[] = [];
  contactItems!: ContactItem[];
  users$!: Observable<User[]>
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }
  ngOnInit(): void {
    this.loadingUserByresolver()
    this.loadRolesAndQualifications();
    this.setupContactItems();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  setupContactItems(): void {
    this.contactItems = [
      {
        icon: 'phone',
        type: 'link',
        getContent: (user: User) => user.telephone || 'Non renseigné',
        getAriaLabel: (user: User) => `Téléphone de ${user.prenom} ${user.nom}`,
        getLink: (user: User) => `tel:${user.telephone}`
      },
      {
        icon: 'home',
        type: 'text',
        getContent: (user: User) => user.adresse || 'Non renseigné',
        getAriaLabel: (user: User) => `Adresse de ${user.prenom} ${user.nom}`
      },
      {
        icon: 'cake',
        type: 'text',
        getContent: (user: User) => this.formatDate(user.dateNaissance),
        getAriaLabel: (user: User) => `Date de naissance de ${user.prenom} ${user.nom}`
      },
      {
        icon: 'account_balance',
        type: 'text',
        getContent: (user: User) => user.rib ? `RIB : ${user.rib}` : 'RIB non renseigné',
        getAriaLabel: (user: User) => `RIB de ${user.prenom} ${user.nom}`
      }
    ];
  }

  getDefaultContactItems(): ContactItem[] {
    return this.setupContactItems(), this.contactItems;
  }

  formatDate(date: string | Date): string {
    if (!date) return 'Non renseigné';
    try {
      return new Date(date).toLocaleDateString('fr-FR');
    } catch (error) {
      return 'Date invalide';
    }
  }

  loadRolesAndQualifications(): void {
    // this.userService.getAllRoles()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(roles => this.allRoles = roles);

    // this.userService.getAllQualifications()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(qualifications => this.allQualifications = qualifications);
  }

  loadUsers(): void {
    this.isLoading = true;
    const params = {
      page: this.currentPage,
      size: this.pageSize,
      search: this.searchTerm,
      role: this.filterRole,
      qualification: this.filterQualification
    };

    // this.users$ = this.userService.getUsers(params).pipe(
    //   map(response => {
    //     this.totalUsers = response.total;
    //     return response.data;
    //   }),
    //   catchError(error => {
    //     this.showSnackBar('Erreur lors du chargement des utilisateurs', 'error');
    //     console.error('Error loading users:', error);
    //     return of([]);
    //   }),
    //   finalize(() => {
    //     this.isLoading = false;
    //   })
    // );
  }

  applyFilters(): void {
    this.hasActiveFilters = !!(this.searchTerm || this.filterRole || this.filterQualification);
    this.currentPage = 0;
    this.loadUsers();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filterRole = '';
    this.filterQualification = '';
    this.hasActiveFilters = false;
    this.loadUsers();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadUsers();
  }

  editUser(user: User): void {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '600px',
      data: { user, mode: 'edit' }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.loadUsers();
          this.showSnackBar(`L'utilisateur ${user.prenom} ${user.nom} a été modifié`, 'success');
        }
      });
  }

  viewDetails(user: User): void {
    this.dialog.open(UserDetailsDialogComponent, {
      width: '700px',
      data: { user }
    });
  }

  toggleUserStatus(user: User): void {
    const message = user.actif
      ? `Êtes-vous sûr de vouloir désactiver l'utilisateur ${user.prenom} ${user.nom} ?`
      : `Êtes-vous sûr de vouloir activer l'utilisateur ${user.prenom} ${user.nom} ?`;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: user.actif ? 'Désactiver l\'utilisateur' : 'Activer l\'utilisateur',
        message,
        confirmText: 'Confirmer',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          const updatedUser = { ...user, actif: !user.actif };
          this.userService.updateUser(updatedUser)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
              () => {
                this.loadUsers();
                const action = updatedUser.actif ? 'activé' : 'désactivé';
                this.showSnackBar(`L'utilisateur a été ${action}`, 'success');
              },
              error => {
                console.error('Error updating user status:', error);
                this.showSnackBar('Erreur lors de la mise à jour du statut', 'error');
              }
            );
        }
      });
  }

  deleteUser(user: User): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Supprimer l\'utilisateur',
        message: `Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.prenom} ${user.nom} ?`,
        confirmText: 'Supprimer',
        cancelText: 'Annuler',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.userService.deleteUser(user.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
              () => {
                this.loadUsers();
                this.showSnackBar(`L'utilisateur ${user.prenom} ${user.nom} a été supprimé`, 'success');
              },
              error => {
                console.error('Error deleting user:', error);
                this.showSnackBar('Erreur lors de la suppression de l\'utilisateur', 'error');
              }
            );
        }
      });
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }

  private showSnackBar(message: string, type: 'success' | 'error' | 'info'): void {
    const panelClass = {
      'success': ['snackbar-success'],
      'error': ['snackbar-error'],
      'info': ['snackbar-info']
    }[type];

    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass
    });
  }
  loadingUserByresolver(): void {
    this.isLoading = true
    this.users$ = this.route.data.pipe(
      map((data) => data["users"]),
      tap(() => this.isLoading = false)),
      catchError((error) => {
        console.error("Erreur de chargement:", error);
        this.isLoading = false;
        return of([]);
      })

  }

}
