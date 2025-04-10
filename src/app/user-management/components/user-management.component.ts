import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { User } from '../../interfaces/User';
import { UserService } from '../../services/users.service';
import { ActivatedRoute } from '@angular/router';
import { catchError, delay, EMPTY, map, Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ContactItem } from '../../interfaces/ContactItem';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserFormDialogComponent } from '../../components/user-form-dialog/user-form-dialog.component';
import { UserDetailsDialogComponent } from '../../components/user-details-dialog/user-details-dialog.component';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { JsonPatchOperation } from '../../interfaces/JsonPatchOperation';
import { FormUserAddComponent } from '../../components/form-user-add/form-user-add.component';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { UserDataService } from '../../services/components/UsersDataService.service';

@Component({
  selector: 'app-user-management',
  imports: [
    MatCardModule,
    MatListModule,

    MatChipsModule,
    MatDividerModule,
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    ReactiveFormsModule,
    FormsModule,

  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})


export class UserManagementComponent implements OnInit, OnDestroy {
  sortBy: any;
  userInitials(_t135: any) {
    throw new Error('Method not implemented.');
  }
  filterStatus: any;
  exportUsers() {
    throw new Error('Method not implemented.');
  }
  showActiveOnly: any;


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
  displayedColumns: string[] = ['status', 'name', 'role', 'qualifications', 'rate', 'actions'];

  private destroy$ = new Subject<void>();
  dataSource!: MatTableDataSource<User>;
  searchControl!: FormControl<any>;
  activeUsersCount: any;
  newUsersCount: any;
  averageRate!: string | number;
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private usersDataService: UserDataService
  ) { }

  users!: Observable<User[]>
  ngOnInit(): void {
    // this.loadingUserByresolver()
    this.loadUsersFromApi()

  }
  loadUsersFromApi(): void {
    this.users = this.usersDataService.users$
    this.usersDataService.loadUsers().subscribe({
      next: (users) => {
        this.dataSource = new MatTableDataSource(users)
        this.totalUsers = users.length
        this.activeUsersCount = users.filter(user => user.actif == true).length
      }
    })
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  addUser(): void {
    const dialogRef = this.dialog.open(FormUserAddComponent, {
      width: "1000px",
      disableClose: true,
      data: {} // Vous pouvez passer des données initiales ici si nécessaire
    });

    dialogRef.afterClosed()
      .subscribe({
        next: (createdUser: User | undefined) => {
          if (createdUser) {
            // 1. Ajout optimiste local
            this.dataSource.data = [createdUser, ...this.dataSource.data];
            dialogRef.close()
            // 3. Notification utilisateur
            this.snackBar.open('Utilisateur créé avec succès', 'Fermer', {
              duration: 4000,
              panelClass: 'success-snackbar'
            });
          }
        },
        error: (error) => {
          console.error('Erreur lors de la création:', error);
          this.snackBar.open('Échec de la création de l\'utilisateur', 'Fermer', {
            duration: 4000,
            panelClass: 'error-snackbar'
          });
        }
      });
  }
  editUser(user: User): void {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '1000px',
      disableClose: true,
      data: {
        user: { ...user },
        mode: 'edit',
      }

    });

    dialogRef.afterClosed()
      .subscribe({
        next: (createUser: User | undefined) => {
          if (createUser) {
            this.dataSource.data = [...this.dataSource.data, createUser]
            this.snackBar.open('Utilisateur créé avec succès', 'Fermer', {
              duration: 4000,
              panelClass: 'success-snackbar'
            });
          }

        },
        error: (err) => {
          console.error('Erreur lors de la création:', err);
          this.snackBar.open('Échec de la création de l\'utilisateur', 'Fermer', {
            duration: 4000,
            panelClass: 'error-snackbar'
          });

        }
      })

  }

  viewDetails(user: User): void {
    this.dialog.open(UserDetailsDialogComponent, {
      width: '1000px',
      data: {
        user,


      },

    });
  }

  toggleUserStatus(user: User): void {
    const message = user.actif
      ? `Désactiver l'utilisateur ${user.prenom} ${user.nom} ?`
      : `Activer l'utilisateur ${user.prenom} ${user.nom} ?`;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: user.actif ? 'Désactivation' : 'Activation',
        message
      }
    });

    dialogRef.afterClosed().pipe(
      takeUntil(this.destroy$)
    ).subscribe(confirmed => {
      if (confirmed) {
        const operations: JsonPatchOperation[] = [{
          op: "replace",
          path: "/actif",
          value: !user.actif
        }];

        this.userService.updateActif(user.id, operations).subscribe({
          next: () => {
            user.actif = !user.actif;
            this.showSnackBar(`Statut ${user.actif ? 'activé' : 'désactivé'}`, 'success');
          },
          error: (err) => {
            console.error('Erreur:', err);
            this.showSnackBar('Échec de la mise à jour', 'error');
          }
        });
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
      .pipe(
        takeUntil(this.destroy$),
        switchMap(result => result
          ? this.userService.deleteUser(user.id)
          : EMPTY
        )
      )
      .subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(u => u.id !== user.id);
          this.dataSource.data = [...this.dataSource.data];

          this.showSnackBar("Utilisateur a été supprimé avec succès", "success");
        },
        error: (err) => {
          this.showSnackBar("Erreur lors de la suppression de l'utilisateur", "error");
          console.error(err);
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

    this.users$.subscribe({
      next: (users) => {
        this.dataSource = new MatTableDataSource(users)

      },
      error: (error) => {
        console.log("Erreur lors du chargment des utilisateurs", error)
      }
    })
  }

}
