import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doubt, DoubtCreate, DoubtUpdate } from '../models/doubt.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DoubtService {
  private apiUrl = `${environment.apiUrl}/doubts`;

  constructor(private http: HttpClient) { }

  getAllDoubts(): Observable<Doubt[]> {
    return this.http.get<Doubt[]>(this.apiUrl);
  }

  getDoubtsByCurriculum(curriculumId: string): Observable<Doubt[]> {
    return this.http.get<Doubt[]>(`${this.apiUrl}/curriculum/${curriculumId}`);
  }

  getDoubt(id: string): Observable<Doubt> {
    return this.http.get<Doubt>(`${this.apiUrl}/${id}`);
  }

  createDoubt(doubt: DoubtCreate): Observable<Doubt> {
    return this.http.post<Doubt>(this.apiUrl, doubt);
  }

  updateDoubt(id: string, doubt: DoubtUpdate): Observable<Doubt> {
    return this.http.put<Doubt>(`${this.apiUrl}/${id}`, doubt);
  }
} 