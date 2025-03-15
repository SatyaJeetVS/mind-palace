import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface ConfirmDialogData {
  currentTopic: string;
  newTopic: string;
}

@Component({
  selector: 'app-topic-switch-confirmation',
  template: `
    <h2 mat-dialog-title>Switch Learning Mode?</h2>
    <mat-dialog-content>
      <p>You are currently learning <strong>{{ data.currentTopic }}</strong>.</p>
      <p>Are you sure you want to switch to <strong>{{ data.newTopic }}</strong>?</p>
      <p>Your progress will be saved, but switching topics frequently may slow down your learning.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="true">Yes, Switch</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-height: 80px;
    }
    
    p {
      margin-bottom: 10px;
    }
    
    strong {
      color: #8A2BE2;
    }
  `]
})
export class TopicSwitchConfirmationComponent {
  constructor(
    public dialogRef: MatDialogRef<TopicSwitchConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
} 