import {Component, ViewChild} from '@angular/core';
import {MatSidenav, MatSidenavContainer, MatSidenavModule} from '@angular/material/sidenav';
import {MatListItem, MatListModule, MatNavList} from '@angular/material/list';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-dashboard-mentor',
  imports: [
    MatSidenavContainer,
    MatNavList,
    MatListItem,
    MatIcon,
    RouterOutlet,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatSidenav,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './dashboard-mentor.component.html',
  styleUrl: './dashboard-mentor.component.scss'
})
export class DashboardMentorComponent {

  sidebarOpen = true;
  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(private breakpointObserver: BreakpointObserver) {
    // Adaptation automatique pour mobile
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.sidebarOpen = !result.matches;
        if (result.matches) {
          this.sidenav.close();
        } else {
          this.sidenav.open();
        }
      });
  }

  toggleSidebar() {
    this.sidenav.toggle();
    this.sidebarOpen = this.sidenav.opened;
  }
}
