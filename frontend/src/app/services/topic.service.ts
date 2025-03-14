import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Section {
  title: string;
  content: string;
  codeExample?: string;
}

export interface Subtopic {
  _id: string;
  topicId: string;
  title: string;
  slug: string;
  sections: Section[];
  order: number;
}

export interface Topic {
  _id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
}

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // Get all topics
  getAllTopics(): Observable<Topic[]> {
    return this.http.get<Topic[]>(`${this.apiUrl}/topics`);
  }

  // Get specific topic
  getTopic(topicSlug: string): Observable<Topic> {
    return this.http.get<Topic>(`${this.apiUrl}/topics/${topicSlug}`);
  }

  // Get all subtopics for a topic
  getSubtopics(topicSlug: string): Observable<Subtopic[]> {
    return this.http.get<Subtopic[]>(`${this.apiUrl}/topics/${topicSlug}/subtopics`);
  }

  // Get specific subtopic content
  getSubtopicContent(topicSlug: string, subtopicSlug: string): Observable<Subtopic> {
    return this.http.get<Subtopic>(`${this.apiUrl}/topics/${topicSlug}/subtopics/${subtopicSlug}`);
  }
} 