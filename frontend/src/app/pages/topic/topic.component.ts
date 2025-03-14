import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TopicService, Topic, Subtopic } from '../../services/topic.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit {
  topic: Topic | null = null;
  subtopics: Subtopic[] = [];
  error: string | null = null;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private topicService: TopicService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const topicSlug = params['topicSlug'];
      if (topicSlug) {
        this.loading = true;
        this.error = null;
        
        // Load topic details
        this.topicService.getTopic(topicSlug).pipe(
          catchError(error => {
            this.error = 'Failed to load topic. Please try again later.';
            return of(null);
          })
        ).subscribe(topic => {
          this.topic = topic;
          
          // Load subtopics after topic is loaded
          if (topic) {
            this.loadSubtopics(topicSlug);
          } else {
            this.loading = false;
          }
        });
      }
    });
  }

  private loadSubtopics(topicSlug: string) {
    this.topicService.getSubtopics(topicSlug).pipe(
      catchError(error => {
        this.error = 'Failed to load subtopics. Please try again later.';
        return of([]);
      })
    ).subscribe(subtopics => {
      this.subtopics = subtopics.sort((a, b) => a.order - b.order);
      this.loading = false;
    });
  }
} 