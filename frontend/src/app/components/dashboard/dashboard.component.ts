import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TopicSwitchConfirmationComponent } from '../dialogs/topic-switch-confirmation.component';

interface Subtopic {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  subtopics?: Subtopic[];
}

interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  subtopics: Subtopic[];
}

interface TreeNode {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  expanded: boolean;
  children?: TreeNode[];
}

interface ConfirmDialogData {
  currentTopic: string;
  newTopic: string;
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
  
  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadTopics();
    // Set the first topic as current by default
    if (this.topics.length > 0) {
      this.setCurrentTopic(this.topics[0].id);
    }
  }

  loadTopics(): void {
    // This would typically be an API call
    this.topics = [
    {
      id: 'python-basics',
      title: 'Python Basics',
      description: 'Learn the fundamentals of Python programming',
      icon: '🐍',
        progress: 45,
      subtopics: [
        {
            id: 'variables',
          title: 'Variables and Data Types',
            description: 'Learn about variables, numbers, strings, and booleans',
            completed: true,
            subtopics: [
              {
                id: 'numbers',
                title: 'Numbers',
                description: 'Integers, floats, and numeric operations',
                completed: true
              },
              {
                id: 'strings',
                title: 'Strings',
                description: 'Text manipulation and formatting',
                completed: false,
                subtopics: [
                  {
                    id: 'string-methods',
                    title: 'String Methods',
                    description: 'Common string operations and methods',
                    completed: false
                  },
                  {
                    id: 'string-formatting',
                    title: 'String Formatting',
                    description: 'Different ways to format strings in Python',
                    completed: false
        }
      ]
    },
    {
                id: 'booleans',
                title: 'Booleans',
                description: 'True, False, and logical operations',
                completed: false
              }
            ]
          },
          {
            id: 'control-flow',
            title: 'Control Flow',
            description: 'Learn about if statements, loops, and control structures',
            completed: false,
      subtopics: [
              {
                id: 'if-statements',
                title: 'If Statements',
                description: 'Conditional execution with if, elif, and else',
                completed: false
              },
              {
                id: 'loops',
                title: 'Loops',
                description: 'Repeated execution with for and while loops',
                completed: false,
      subtopics: [
                  {
                    id: 'for-loops',
                    title: 'For Loops',
                    description: 'Iterating over sequences with for loops',
                    completed: false
                  },
                  {
                    id: 'while-loops',
                    title: 'While Loops',
                    description: 'Conditional loops with while statements',
                    completed: false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'javascript-basics',
        title: 'JavaScript Basics',
        description: 'Learn the fundamentals of JavaScript programming',
        icon: '📜',
        progress: 20,
      subtopics: [
          {
            id: 'js-variables',
            title: 'Variables and Data Types',
            description: 'Learn about let, const, and JavaScript data types',
            completed: true
          },
          {
            id: 'js-functions',
            title: 'Functions',
            description: 'Learn about function declarations, expressions, and arrow functions',
            completed: false
          }
        ]
      }
    ];
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
      completed: false,
      expanded: true,
      children: []
    };
    
    // Build child nodes from subtopics
    if (this.currentTopic.subtopics) {
      rootNode.children = this.buildSubtopicNodes(this.currentTopic.subtopics);
    }
    
    this.treeNodes = [rootNode];
  }
  
  buildSubtopicNodes(subtopics: Subtopic[]): TreeNode[] {
    return subtopics.map(subtopic => {
      const node: TreeNode = {
        id: subtopic.id,
        title: subtopic.title,
        description: subtopic.description,
        completed: subtopic.completed,
        expanded: false
      };
      
      if (subtopic.subtopics && subtopic.subtopics.length > 0) {
        node.children = this.buildSubtopicNodes(subtopic.subtopics);
      }
      
      return node;
    });
  }

  toggleNode(node: TreeNode): void {
    node.expanded = !node.expanded;
  }

  navigateToSubtopic(subtopicId: string, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    
    // Find the subtopic at any level of nesting
    const subtopic = this.findSubtopic(this.currentTopic?.subtopics || [], subtopicId);
    
    if (subtopic) {
      // If the subtopic has children, expand it in the tree instead of navigating
      if (subtopic.subtopics && subtopic.subtopics.length > 0) {
        this.expandNodeInTree(this.treeNodes, subtopicId);
        return;
      }
      
      // Otherwise navigate to the subtopic content
      this.router.navigate(['/topic', this.currentTopic?.id, 'subtopic', subtopicId]);
    }
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

  findSubtopic(subtopics: Subtopic[], subtopicId: string): Subtopic | null {
    for (const subtopic of subtopics) {
      if (subtopic.id === subtopicId) {
        return subtopic;
      }
      
      if (subtopic.subtopics && subtopic.subtopics.length > 0) {
        const found = this.findSubtopic(subtopic.subtopics, subtopicId);
        if (found) {
          return found;
        }
      }
    }
    
    return null;
  }

  updateTopicProgress(): void {
    if (!this.currentTopic) return;
    
    const countSubtopics = (subtopics: Subtopic[]): { total: number, completed: number } => {
      let total = 0;
      let completed = 0;
      
      for (const subtopic of subtopics) {
        total++;
        if (subtopic.completed) {
          completed++;
        }
        
        if (subtopic.subtopics && subtopic.subtopics.length > 0) {
          const counts = countSubtopics(subtopic.subtopics);
          total += counts.total;
          completed += counts.completed;
        }
      }
      
      return { total, completed };
    };
    
    const counts = countSubtopics(this.currentTopic.subtopics);
    
    if (counts.total > 0) {
      this.currentTopic.progress = Math.round((counts.completed / counts.total) * 100);
    } else {
      this.currentTopic.progress = 0;
    }
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

  filterTopics(event: any) {
    // This method is no longer needed with the new approach
  }
}