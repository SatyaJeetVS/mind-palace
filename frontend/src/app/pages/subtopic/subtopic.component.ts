import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TopicService, Topic, Subtopic } from '../../services/topic.service';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-subtopic',
  templateUrl: './subtopic.component.html',
  styleUrls: ['./subtopic.component.scss']
})
export class SubtopicComponent implements OnInit {
  topic: Topic | null = null;
  subtopic: Subtopic | null = null;
  previousSubtopic: Subtopic | null = null;
  nextSubtopic: Subtopic | null = null;
  error: string | null = null;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private topicService: TopicService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const topicSlug = params['topicSlug'];
      const subtopicSlug = params['subtopicSlug'];
      
      if (topicSlug && subtopicSlug) {
        this.loading = true;
        this.error = null;

        // Load topic details and all subtopics
        this.topicService.getTopic(topicSlug).pipe(
          catchError(error => {
            this.error = 'Failed to load topic. Please try again later.';
            return of(null);
          }),
          switchMap(topic => {
            this.topic = topic;
            if (topic) {
              return this.topicService.getSubtopics(topicSlug);
            }
            return of([]);
          })
        ).subscribe(subtopics => {
          if (subtopics.length > 0) {
            // Sort subtopics by order
            const sortedSubtopics = subtopics.sort((a, b) => a.order - b.order);
            
            // Find current subtopic index
            const currentIndex = sortedSubtopics.findIndex(s => s.slug === subtopicSlug);
            
            // Set current subtopic
            this.subtopic = sortedSubtopics[currentIndex];
            
            // Set previous and next subtopics
            this.previousSubtopic = currentIndex > 0 ? sortedSubtopics[currentIndex - 1] : null;
            this.nextSubtopic = currentIndex < sortedSubtopics.length - 1 ? sortedSubtopics[currentIndex + 1] : null;
          }
          this.loading = false;
        });
      }
    });
  }
} 