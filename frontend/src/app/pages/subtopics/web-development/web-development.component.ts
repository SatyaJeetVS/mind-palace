import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TopicService, SubtopicContent } from '../../../services/topic.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-web-development',
  templateUrl: './web-development.component.html',
  styleUrls: ['./web-development.component.scss']
})
export class WebDevelopmentComponent implements OnInit {
  subtopicContent: SubtopicContent | null = null;
  error: string | null = null;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private topicService: TopicService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const subtopicId = this.route.snapshot.url[1]?.path;
      if (subtopicId) {
        this.loading = true;
        this.error = null;
        this.topicService.getSubtopicContent('web-development', subtopicId)
          .pipe(
            catchError(error => {
              this.error = 'Failed to load content. Please try again later.';
              return of(null);
            })
          )
          .subscribe(content => {
            this.subtopicContent = content;
            this.loading = false;
          });
      }
    });
  }
} 