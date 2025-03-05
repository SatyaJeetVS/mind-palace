import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Curriculum } from '../models/curriculum.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CurriculumService {
  private apiUrl = `${environment.apiUrl}/curriculum`;

  constructor(private http: HttpClient) { }

  getAllCurricula(): Observable<Curriculum[]> {
    return this.http.get<Curriculum[]>(this.apiUrl);
  }

  getCurriculum(id: string): Observable<Curriculum> {
    return this.http.get<Curriculum>(`${this.apiUrl}/${id}`);
  }

  createCurriculum(topic: string): Observable<Curriculum> {
    return this.http.post<Curriculum>(this.apiUrl, { topic });
  }

  updateCurriculum(id: string, data: any): Observable<Curriculum> {
    return this.http.put<Curriculum>(`${this.apiUrl}/${id}`, data);
  }

  updateTopic(curriculumId: string, topicId: string, data: any): Observable<Curriculum> {
    return this.http.put<Curriculum>(`${this.apiUrl}/${curriculumId}/topics/${topicId}`, data);
  }

  updateTopicProgress(curriculumId: string, topicId: string, progress: number): Observable<Curriculum> {
    return this.http.put<Curriculum>(`${this.apiUrl}/${curriculumId}/topics/${topicId}/progress`, { progress });
  }
} 