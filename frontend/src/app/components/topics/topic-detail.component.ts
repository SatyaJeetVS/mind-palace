import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface Subtopic {
  id: number;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
}

@Component({
  selector: 'app-topic-detail',
  template: `
    <div class="topic-detail">
      <div class="topic-header" [style.backgroundImage]="'url(' + topicImage + ')'">
        <div class="overlay"></div>
        <div class="content">
          <h1>{{topicTitle}}</h1>
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress" [style.width.%]="topicProgress"></div>
            </div>
            <span>{{topicProgress}}% Complete</span>
          </div>
        </div>
      </div>
      
      <div class="subtopics-container">
        <h2>Subtopics</h2>
        
        <div class="subtopics-list">
          <div class="subtopic-item" *ngFor="let subtopic of subtopics">
            <div class="subtopic-status">
              <div class="status-icon" [class.completed]="subtopic.completed">
                <i class="check-icon" *ngIf="subtopic.completed">✓</i>
              </div>
            </div>
            <div class="subtopic-content">
              <h3>{{subtopic.title}}</h3>
              <p>{{subtopic.description}}</p>
              <div class="subtopic-meta">
                <span class="duration">{{subtopic.duration}}</span>
              </div>
            </div>
          </div>
        </div>
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
      margin: 0 0 1rem 0;
      font-size: 2.5rem;
      font-weight: 700;
    }
    
    .progress-container {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .progress-bar {
      flex: 1;
      height: 8px;
      background-color: rgba(255,255,255,0.3);
      border-radius: 4px;
      overflow: hidden;
    }
    
    .progress {
      height: 100%;
      background: linear-gradient(90deg, #8A2BE2, #FF3366);
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
    
    .subtopic-status {
      padding: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .status-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid #ddd;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .status-icon.completed {
      border-color: #8A2BE2;
      background-color: #8A2BE2;
      color: white;
    }
    
    .check-icon {
      font-size: 14px;
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
  `]
})
export class TopicDetailComponent implements OnInit {
  topicId: number = 0;
  topicTitle: string = '';
  topicImage: string = '';
  topicProgress: number = 0;
  subtopics: Subtopic[] = [];
  
  constructor(private route: ActivatedRoute) {}
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.topicId = +params['id'];
      this.loadTopicDetails();
    });
  }
  
  loadTopicDetails() {
    // Mock data - in a real app, this would come from an API
    const topics = [
      {
        id: 1,
        title: 'Python Basics',
        image: 'https://images.unsplash.com/photo-1526379879527-8559ecfcb0c8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
        progress: 75
      },
      {
        id: 2,
        title: 'Web Development',
        image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
        progress: 30
      }
    ];
    
    const topic = topics.find(t => t.id === this.topicId);
    if (topic) {
      this.topicTitle = topic.title;
      this.topicImage = topic.image;
      this.topicProgress = topic.progress;
    }
    
    // Mock subtopics data
    if (this.topicId === 1) { // Python Basics
      this.subtopics = [
        {
          id: 1,
          title: 'Introduction to Python',
          description: 'Learn about Python history, installation, and basic syntax',
          duration: '45 min',
          completed: true
        },
        {
          id: 2,
          title: 'Variables and Data Types',
          description: 'Understand different data types and how to use variables',
          duration: '1 hour',
          completed: true
        },
        {
          id: 3,
          title: 'Control Flow',
          description: 'Master if statements, loops, and conditional logic',
          duration: '1.5 hours',
          completed: true
        },
        {
          id: 4,
          title: 'Functions and Modules',
          description: 'Learn to create reusable code with functions and modules',
          duration: '2 hours',
          completed: false
        },
        {
          id: 5,
          title: 'Working with Files',
          description: 'Read and write files in Python',
          duration: '1 hour',
          completed: false
        }
      ];
    } else if (this.topicId === 2) { // Web Development
      this.subtopics = [
        {
          id: 1,
          title: 'HTML Fundamentals',
          description: 'Learn the building blocks of web pages',
          duration: '1 hour',
          completed: true
        },
        {
          id: 2,
          title: 'CSS Styling',
          description: 'Make your web pages beautiful with CSS',
          duration: '1.5 hours',
          completed: true
        },
        {
          id: 3,
          title: 'JavaScript Basics',
          description: 'Add interactivity to your websites',
          duration: '2 hours',
          completed: false
        },
        {
          id: 4,
          title: 'Responsive Design',
          description: 'Make your websites work on all devices',
          duration: '1 hour',
          completed: false
        },
        {
          id: 5,
          title: 'Web APIs',
          description: 'Connect to external services and data',
          duration: '1.5 hours',
          completed: false
        }
      ];
    } else {
      this.subtopics = [];
    }
  }
} 