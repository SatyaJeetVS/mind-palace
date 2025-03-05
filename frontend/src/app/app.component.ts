import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Mind Palace';
  
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}
  
  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 