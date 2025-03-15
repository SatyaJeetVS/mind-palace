import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TopicSwitchConfirmationComponent } from '../dialogs/topic-switch-confirmation.component';

interface Subtopic {
  id: string;
  title: string;
  description: string;
  completed?: boolean;
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
  children?: TreeNode[];
  level: number;
  expanded?: boolean;
  completed?: boolean;
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
  topics: Topic[] = [
    {
      id: 'python-basics',
      title: 'Python Basics',
      description: 'Learn the fundamentals of Python programming',
      icon: '🐍',
      progress: 0,
      subtopics: [
        {
          id: 'variables-data-types',
          title: 'Variables and Data Types',
          description: 'Learn about Python variables and basic data types'
        },
        {
          id: 'control-flow',
          title: 'Control Flow',
          description: 'Master if statements, loops, and conditional expressions'
        },
        {
          id: 'functions',
          title: 'Functions',
          description: 'Create reusable blocks of code'
        },
        {
          id: 'data-structures',
          title: 'Data Structures',
          description: 'Work with lists, dictionaries, and more'
        },
        {
          id: 'file-handling',
          title: 'File Handling',
          description: 'Learn to work with files in Python'
        }
      ]
    },
    {
      id: 'web-development',
      title: 'Web Development',
      description: 'Master modern web development techniques',
      icon: '🌐',
      progress: 0,
      subtopics: [
        { id: 'html-css', title: 'HTML & CSS', description: 'Learn the building blocks of web pages' },
        { id: 'javascript', title: 'JavaScript', description: 'Add interactivity to your websites' },
        { id: 'responsive-design', title: 'Responsive Design', description: 'Create websites that work on all devices' },
        { id: 'frameworks', title: 'Web Frameworks', description: 'Build applications with Angular, React, or Vue' },
        { id: 'backend', title: 'Backend Development', description: 'Create server-side applications with Node.js or Python' }
      ]
    },
    {
      id: 'data-science',
      title: 'Data Science',
      description: 'Explore data analysis and machine learning',
      icon: '📊',
      progress: 0,
      subtopics: [
        { id: 'data-analysis', title: 'Data Analysis', description: 'Learn to analyze and visualize data' },
        { id: 'pandas', title: 'Pandas', description: 'Master data manipulation with Pandas' },
        { id: 'visualization', title: 'Data Visualization', description: 'Create insightful visualizations with Matplotlib and Seaborn' },
        { id: 'machine-learning', title: 'Machine Learning', description: 'Build predictive models with scikit-learn' },
        { id: 'deep-learning', title: 'Deep Learning', description: 'Explore neural networks with TensorFlow and PyTorch' }
      ]
    },
    {
      id: 'algorithms',
      title: 'Algorithms',
      description: 'Study fundamental algorithms and data structures',
      icon: '🔍',
      progress: 0,
      subtopics: [
        { id: 'complexity', title: 'Algorithm Complexity', description: 'Understand Big O notation and algorithm efficiency' },
        { id: 'sorting', title: 'Sorting Algorithms', description: 'Learn various sorting techniques and their applications' },
        { id: 'searching', title: 'Searching Algorithms', description: 'Master binary search and other searching methods' },
        { id: 'graph-algorithms', title: 'Graph Algorithms', description: 'Explore algorithms for graph traversal and shortest paths' },
        { id: 'dynamic-programming', title: 'Dynamic Programming', description: 'Solve complex problems by breaking them down' }
      ]
    },
    {
      id: 'system-design',
      title: 'System Design',
      description: 'Learn to design scalable systems',
      icon: '⚙️',
      progress: 0,
      subtopics: [
        { id: 'architecture', title: 'System Architecture', description: 'Understand different architectural patterns' },
        { id: 'scalability', title: 'Scalability', description: 'Design systems that can handle growth' },
        { id: 'databases', title: 'Database Design', description: 'Choose and optimize databases for your applications' },
        { id: 'api-design', title: 'API Design', description: 'Create effective and user-friendly APIs' },
        { id: 'microservices', title: 'Microservices', description: 'Build applications using microservices architecture' }
      ]
    },
    {
      id: 'cloud-computing',
      title: 'Cloud Computing',
      description: 'Understand cloud platforms and deployment',
      icon: '☁️',
      progress: 0,
      subtopics: [
        { id: 'cloud-basics', title: 'Cloud Basics', description: 'Understand fundamental cloud computing concepts' },
        { id: 'aws', title: 'AWS', description: 'Learn Amazon Web Services' },
        { id: 'azure', title: 'Azure', description: 'Explore Microsoft Azure services' },
        { id: 'gcp', title: 'Google Cloud', description: 'Master Google Cloud Platform' },
        { id: 'devops', title: 'DevOps', description: 'Implement CI/CD pipelines and automation' }
      ]
    }
  ];
  
  currentTopic: Topic | null = null;
  treeNodes: TreeNode[] = [];
  
  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    // Subscribe to route params to get the current topic
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadTopic(params['id']);
      } else {
        // Default to the first topic if none is specified
        this.loadTopic(this.topics[0].id);
      }
    });
  }

  loadTopic(topicId: string) {
    const topic = this.topics.find(t => t.id === topicId);
    if (topic) {
      this.currentTopic = topic;
      this.buildTreeNodes();
    }
  }

  buildTreeNodes() {
    if (!this.currentTopic) return;
    
    // Create the root node (the topic itself)
    const rootNode: TreeNode = {
      id: this.currentTopic.id,
      title: this.currentTopic.title,
      description: this.currentTopic.description,
      level: 0,
      expanded: true,
      children: []
    };
    
    // Add subtopics as children
    if (this.currentTopic.subtopics) {
      rootNode.children = this.currentTopic.subtopics.map(subtopic => ({
        id: subtopic.id,
        title: subtopic.title,
        description: subtopic.description,
        level: 1,
        expanded: false,
        completed: subtopic.completed || false
      }));
    }
    
    this.treeNodes = [rootNode];
  }

  toggleNode(node: TreeNode) {
    node.expanded = !node.expanded;
  }

  navigateToSubtopic(subtopicId: string) {
    if (this.currentTopic) {
      this.router.navigate(['/subtopic', subtopicId]);
    }
  }

  markSubtopicCompleted(subtopicId: string, event: Event) {
    event.stopPropagation();
    
    if (this.currentTopic) {
      // Find the subtopic in the current topic
      const subtopic = this.currentTopic.subtopics.find(s => s.id === subtopicId);
      if (subtopic) {
        // Toggle completion status
        subtopic.completed = !subtopic.completed;
        
        // Update progress percentage
        this.updateTopicProgress();
        
        // Rebuild tree nodes to reflect changes
        this.buildTreeNodes();
        
        // In a real app, you would save this to a backend
        console.log(`Subtopic ${subtopicId} marked as ${subtopic.completed ? 'completed' : 'incomplete'}`);
      }
    }
  }
  
  updateTopicProgress() {
    if (this.currentTopic && this.currentTopic.subtopics.length > 0) {
      const completedCount = this.currentTopic.subtopics.filter(s => s.completed).length;
      this.currentTopic.progress = Math.round((completedCount / this.currentTopic.subtopics.length) * 100);
    }
  }

  switchTopic(newTopicId: string) {
    if (this.currentTopic && this.currentTopic.id !== newTopicId) {
      // Open confirmation dialog
      this.openConfirmationDialog(this.currentTopic.title, 
        this.topics.find(t => t.id === newTopicId)?.title || 'new topic');
    } else {
      this.loadTopic(newTopicId);
      this.router.navigate(['/topics', newTopicId]);
    }
  }

  openConfirmationDialog(currentTopic: string, newTopic: string) {
    const dialogRef = this.dialog.open(TopicSwitchConfirmationComponent, {
      width: '400px',
      data: { currentTopic, newTopic }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User confirmed the switch
        const newTopicId = this.topics.find(t => t.title === newTopic)?.id;
        if (newTopicId) {
          this.loadTopic(newTopicId);
          this.router.navigate(['/topics', newTopicId]);
        }
      }
    });
  }

  filterTopics(event: any) {
    // This method is no longer needed with the new approach
  }
} 