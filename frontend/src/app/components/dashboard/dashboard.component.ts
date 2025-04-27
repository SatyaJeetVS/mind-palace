import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TopicSwitchConfirmationComponent } from '../dialogs/topic-switch-confirmation.component';
import { CurriculumService } from '../../services/curriculum.service';
import { Topic, SubTopic } from '../../models/curriculum.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface TreeNode {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  expanded: boolean;
  children?: TreeNode[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  searchQuery: string = '';
  topics: Topic[] = [];
  currentTopic: Topic | null = null;
  treeNodes: TreeNode[] = [];
  showConfirmDialog = false;
  pendingTopicId: string | null = null;
  topicDropdown = false;
  isLoading = false;
  errorMessage = '';
  curriculumId = '';
  
  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private curriculumService: CurriculumService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.curriculumId = params['curriculumId'];
      if (this.curriculumId) {
        this.loadCurriculum();
      } else {
        // If no curriculum ID is provided, load all curricula and use the first one
        this.loadAllCurricula();
      }
    });
  }

  loadAllCurricula(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.curriculumService.getAllCurricula()
      .pipe(
        catchError(error => {
          this.errorMessage = 'Unable to load curricula. Please try again later.';
          this.isLoading = false;
          return of([]);
        })
      )
      .subscribe(curricula => {
        if (curricula.length > 0) {
          this.curriculumId = curricula[0].id;
          this.loadCurriculum();
        } else {
          this.isLoading = false;
          this.errorMessage = 'No curricula found. Create a new curriculum to get started.';
        }
      });
  }

  loadCurriculum(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.curriculumService.getCurriculum(this.curriculumId)
      .pipe(
        catchError(error => {
          this.errorMessage = 'Unable to load curriculum. Please try again later.';
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe(curriculum => {
        if (curriculum) {
          this.topics = curriculum.topics;
          
          // Set the first topic as current by default or keep the current one if it exists
          if (this.currentTopic) {
            const existingTopic = this.topics.find(t => t.id === this.currentTopic!.id);
            if (existingTopic) {
              this.setCurrentTopic(existingTopic.id);
            } else if (this.topics.length > 0) {
              this.setCurrentTopic(this.topics[0].id);
            }
          } else if (this.topics.length > 0) {
            this.setCurrentTopic(this.topics[0].id);
          }
        }
        
        this.isLoading = false;
      });
  }

  setCurrentTopic(topicId: string): void {
    const topic = this.topics.find(t => t.id === topicId);
    if (topic) {
      this.currentTopic = topic;
      this.buildTreeNodes();
    }
  }

  buildTreeNodes(): void {
    if (!this.currentTopic) return;
    
    // Create a root node for the current topic
    const rootNode: TreeNode = {
      id: this.currentTopic.id,
      title: this.currentTopic.title,
      description: this.currentTopic.description,
      completed: this.currentTopic.is_completed,
      expanded: true,
      children: []
    };
    
    // Build child nodes from subtopics
    if (this.currentTopic.subtopics) {
      rootNode.children = this.buildSubtopicNodes(this.currentTopic.subtopics);
    }
    
    this.treeNodes = [rootNode];
  }
  
  buildSubtopicNodes(subtopics: SubTopic[]): TreeNode[] {
    return subtopics.map(subtopic => {
      const node: TreeNode = {
        id: subtopic.id,
        title: subtopic.title,
        description: subtopic.description,
        completed: subtopic.is_completed,
        expanded: false
      };
      
      // Check if there are child subtopics (this would need to be added to your model)
      const childSubtopics = this.findChildSubtopics(subtopic.id);
      if (childSubtopics.length > 0) {
        node.children = this.buildSubtopicNodes(childSubtopics);
      }
      
      return node;
    });
  }
  
  findChildSubtopics(parentId: string): SubTopic[] {
    // This assumes subtopics in your model have a parent_id field
    // You might need to adjust this based on your actual data structure
    if (!this.currentTopic) return [];
    
    return this.currentTopic.subtopics.filter(s => s.parent_id === parentId);
  }

  toggleNode(node: TreeNode): void {
    node.expanded = !node.expanded;
  }

  navigateToSubtopic(subtopicId: string, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    
    // Find the subtopic
    const subtopic = this.findSubtopicById(subtopicId);
    
    if (subtopic) {
      // Check if this subtopic has children
      const hasChildren = this.findChildSubtopics(subtopicId).length > 0;
      
      if (hasChildren) {
        // If it has children, expand it in the tree instead of navigating
        this.expandNodeInTree(this.treeNodes, subtopicId);
      } else {
        // Otherwise navigate to the subtopic content
        this.router.navigate(['/topic', this.currentTopic?.id, 'subtopic', subtopicId], {
          queryParams: { curriculumId: this.curriculumId }
        });
      }
    }
  }
  
  findSubtopicById(subtopicId: string): SubTopic | undefined {
    if (!this.currentTopic) return undefined;
    return this.currentTopic.subtopics.find(s => s.id === subtopicId);
  }
  
  expandNodeInTree(nodes: TreeNode[], nodeId: string): boolean {
    for (const node of nodes) {
      if (node.id === nodeId) {
        node.expanded = true;
        return true;
      }
      
      if (node.children && node.children.length > 0) {
        const found = this.expandNodeInTree(node.children, nodeId);
        if (found) {
          node.expanded = true;
          return true;
        }
      }
    }
    
    return false;
  }

  updateTopicProgress(): void {
    if (!this.currentTopic || !this.curriculumId) return;
    
    this.curriculumService.updateTopicProgress(
      this.curriculumId,
      this.currentTopic.id,
      this.currentTopic.progress_percentage
    ).subscribe(
      updatedCurriculum => {
        // Refresh topics with updated progress data
        this.topics = updatedCurriculum.topics;
        this.setCurrentTopic(this.currentTopic!.id);
      },
      error => {
        console.error('Failed to update progress', error);
      }
    );
  }

  switchTopic(topicId: string): void {
    if (this.currentTopic?.id !== topicId) {
      this.pendingTopicId = topicId;
      this.showConfirmDialog = true;
    }
  }

  confirmTopicSwitch(): void {
    if (this.pendingTopicId) {
      this.setCurrentTopic(this.pendingTopicId);
      this.pendingTopicId = null;
    }
    this.showConfirmDialog = false;
  }

  cancelTopicSwitch(): void {
    this.pendingTopicId = null;
    this.showConfirmDialog = false;
  }
}