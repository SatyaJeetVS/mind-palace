import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mind-palace';
  isLoggedIn = false; // This should be managed by an auth service
  sidebarOpen = false;

  constructor(private router: Router) {
    // TODO: Check login status on init
    this.isLoggedIn = false;
  }

  logout() {
    // TODO: Implement proper logout logic
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  openSidebar() {
    this.sidebarOpen = true;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
