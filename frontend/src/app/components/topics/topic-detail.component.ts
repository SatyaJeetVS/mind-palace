import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurriculumService } from '../../services/curriculum.service';
import { Topic, SubTopic } from '../../models/curriculum.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-topic-detail',
  template: `
    <div class="topic-detail" *ngIf="currentTopic">
      <div class="topic-header" [style.backgroundImage]="getBackgroundImage()">
        <div class="overlay"></div>
        <div class="content">
          <h1>{{currentTopic.title}}</h1>
        </div>
      </div>
      
      <div class="subtopics-container">
        <h2>Subtopics</h2>
        
        <div class="subtopics-list">
          <div class="subtopic-item" *ngFor="let subtopic of currentTopic.subtopics">
            <div class="subtopic-content">
              <h3>{{subtopic.title}}</h3>
              <p>{{subtopic.description}}</p>
              <div class="subtopic-meta">
                <span class="duration">{{getDuration(subtopic.estimated_time_minutes)}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="loading-indicator" *ngIf="isLoading">
        Loading topic details...
      </div>
      
      <div class="error-message" *ngIf="errorMessage">
        {{errorMessage}}
      </div>
    </div>
  `,
  styles: [`
    .topic-detail {
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .topic-header {
      height: 240px;
      background-size: cover;
      background-position: center;
      border-radius: 16px;
      position: relative;
      margin-bottom: 2rem;
      display: flex;
      align-items: flex-end;
    }
    
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7));
      border-radius: 16px;
    }
    
    .content {
      position: relative;
      padding: 2rem;
      width: 100%;
      color: white;
    }
    
    h1 {
      margin: 0;
      font-size: 2.5rem;
      font-weight: 700;
    }
    
    h2 {
      font-size: 1.8rem;
      margin-bottom: 1.5rem;
      font-weight: 600;
    }
    
    .subtopics-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .subtopic-item {
      display: flex;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .subtopic-item:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.1);
    }
    
    .subtopic-content {
      flex: 1;
      padding: 1.5rem 1.5rem 1.5rem 0;
    }
    
    .subtopic-content h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.2rem;
    }
    
    .subtopic-content p {
      color: #666;
      margin: 0 0 1rem 0;
      font-size: 0.9rem;
    }
    
    .subtopic-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .duration {
      font-size: 0.8rem;
      color: #888;
      display: flex;
      align-items: center;
    }
    
    @media (max-width: 768px) {
      .topic-header {
        height: 180px;
      }
      
      h1 {
        font-size: 1.8rem;
      }
    }
    
    .loading-indicator {
      text-align: center;
      padding: 2rem;
      color: #666;
    }
    
    .error-message {
      text-align: center;
      padding: 2rem;
      color: #e74c3c;
      background: rgba(231, 76, 60, 0.1);
      border-radius: 8px;
    }
  `]
})
export class TopicDetailComponent implements OnInit {
  topicId: string = '';
  curriculumId: string = '';
  currentTopic: Topic | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  
  constructor(
    private route: ActivatedRoute,
    private curriculumService: CurriculumService
  ) {}
  
  ngOnInit() {
    this.isLoading = true;
    
    this.route.params.subscribe(params => {
      this.topicId = params['id'];
      this.loadTopicDetails();
    });
    
    // Get curriculum ID from query params or from a service if stored elsewhere
    this.route.queryParams.subscribe(queryParams => {
      this.curriculumId = queryParams['curriculumId'];
    });
  }
  
  loadTopicDetails() {
    if (!this.curriculumId) {
      this.errorMessage = 'Curriculum ID is missing. Unable to load topic details.';
      this.isLoading = false;
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    this.curriculumService.getCurriculum(this.curriculumId)
      .pipe(
        catchError(error => {
          this.errorMessage = 'Unable to load topic details. Please try again later.';
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe(curriculum => {
        if (curriculum) {
          this.currentTopic = curriculum.topics.find(t => t.id === this.topicId) || null;
          
          if (!this.currentTopic) {
            this.errorMessage = 'Topic not found.';
          }
        }
        
        this.isLoading = false;
      });
  }
  
  getBackgroundImage(): string {
    // You can implement logic to generate background images based on topic name
    // or add an image field to your Topic model if you want to store custom images
    return `url('https://source.unsplash.com/featured/?${this.currentTopic?.title.replace(' ', ',')}')`;
  }
  
  getDuration(minutes: number): string {
    if (!minutes) return 'Unknown duration';
    
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      
      if (remainingMinutes === 0) {
        return `${hours} hour${hours > 1 ? 's' : ''}`;
      } else {
        return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} min`;
      }
    }
  }
}