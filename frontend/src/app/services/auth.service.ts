import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Token, LoginRequest } from '../models/auth.model';
import { User, UserCreate } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  register(user: UserCreate): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  login(loginRequest: LoginRequest): Observable<Token> {
    const formData = new FormData();
    formData.append('username', loginRequest.username);
    formData.append('password', loginRequest.password);

    return this.http.post<Token>(`${this.apiUrl}/login`, formData).pipe(
      tap(token => {
        localStorage.setItem('token', JSON.stringify(token));
        this.loadCurrentUser();
      })
    );
  }

  loadCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }
} 