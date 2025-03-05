import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CurriculumService } from '../../services/curriculum.service';

@Component({
  selector: 'app-curriculum-creator',
  templateUrl: './curriculum-creator.component.html',
  styleUrls: ['./curriculum-creator.component.scss']
})
export class CurriculumCreatorComponent implements OnInit {
  topicForm: FormGroup;
  loading = false;
  error = '';
  success = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private curriculumService: CurriculumService
  ) {
    this.topicForm = this.formBuilder.group({
      topic: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.topicForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = false;

    this.curriculumService.createCurriculum(this.topicForm.value.topic)
      .subscribe({
        next: (curriculum) => {
          this.success = true;
          this.loading = false;
          // Navigate to the curriculum view after a short delay
          setTimeout(() => {
            this.router.navigate(['/curriculum', curriculum.id]);
          }, 1500);
        },
        error: error => {
          this.error = error.error?.detail || 'Failed to create curriculum. Please try again.';
          this.loading = false;
        }
      });
  }
} 