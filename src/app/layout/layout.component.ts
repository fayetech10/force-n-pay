import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter, map, mergeMap, Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { PageInfo } from '../interfaces/InfoPages';
import { PageTitleService } from '../services/components/page.title.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { User } from '../interfaces/User';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatMenuModule,
    MatListModule,
    TitleCasePipe,
    MatExpansionModule


  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit, OnDestroy {
  openProfileDialog() {
    throw new Error('Method not implemented.');
  }
  isUserSubMenuOpen: boolean = false;
  user!: User
  toggleUserSubMenu(): void {
    this.isUserSubMenuOpen = !this.isUserSubMenuOpen;
  }

  navigation = [
    { path: '/dashboard', icon: 'dashboard', title: 'Accueil' },
    { path: '/missions', icon: 'assignment', title: 'Missions' },
    // { path: '/users', icon: 'people', title: 'Utilisateurs' },
    { path: '/reports', icon: 'description', title: 'Rapports' },
    { path: '/seances', icon: 'description', title: 'Seances' },
    { path: '/payments', icon: 'payments', title: 'Paiements' },
    // { path: '/mentorship', icon: 'school', title: 'Mentorat' }
  ];
  userSubNavigation = [
    { path: '/users/mentor', icon: 'school', title: 'Mentor' },
    { path: '/users/consultant', icon: 'business_center', title: 'Consultant' },
    { path: '/users/validation-team', icon: 'verified_user', title: 'Équipe de validation' },
    { path: '/users/admin', icon: 'admin_panel_settings', title: 'Admin' }
  ];

  notifications = [
    { title: 'Nouvelle mission ajoutée', time: 'Il y a 5 minutes', icon: "" },
    { title: 'Rapport soumis', time: 'Il y a 2 heures', icon: "" },
    { title: 'Paiement validé', time: 'Hier', icon: "" }
  ];
  currentPageTitle: any;
  isDarkMode = false;
  user$!: User
  private destry$ = new Subject<void>()
  isLoading: boolean = false
  error: string | null = null
  unreadNotifications = 0
  currentPage: any
  private routerSubscription!: Subscription
  private notificationsSubscription!: Subscription
  constructor(
    private readonly authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private readonly router: Router) { }



  ngOnInit(): void {
    this.checkAuthentication()
    this.loadProfile()
    this.loadCurrentPage()
    this.logOut()
  }
  logOut(): void {
    this.isLoading = true
    this.authService.getUserProfile().subscribe({
      next: (user) => {
        this.user = user
        if (!this.user.roles.includes("MENTOR")) {
          console.log(this.user);
          this.authService.logout()
          this.isLoading = false
        }
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false

      }
    })
  }

  loadCurrentPage(): void {
    // Configuration de la détection de la page courante
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      mergeMap(route => route.data)
    ).subscribe(data => {
      this.currentPage = {
        title: data['title'] || this.getDefaultTitle(),
        subtitle: data['subtitle'] || null,
        icon: data['icon'] || null
      };
    });
  }


  getDefaultTitle(): string {
    // Extraire le nom de la page à partir de l'URL actuelle
    const url = this.router.url;
    const segments = url.split('/').filter(segment => segment);

    if (segments.length === 0) {
      return 'Dashboard';
    }



    // Convertir première lettre en majuscule et remplacer les tirets par des espaces
    return segments[segments.length - 1]
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());

  }
  loadProfile(): void {
    this.authService.getUserProfile()
      .pipe(takeUntil(this.destry$))
      .subscribe({
        next: (user) => {
          this.user$ = user,
            this.isLoading = false
        },
        error: (err) => {
          console.log("Failled to load user profile", err)
          this.error = "Failled to load user profile"
          this.isLoading = false
          this.authService.logout()
          this.router.navigate(['/login'])

        }
      })
  }
  checkAuthentication(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'])
    }
  }


  toggleDarkMode() {
    throw new Error('Method not implemented.');
  }
  ngOnDestroy(): void {
    this.destry$.next()
    this.destry$.complete()
  }

}
