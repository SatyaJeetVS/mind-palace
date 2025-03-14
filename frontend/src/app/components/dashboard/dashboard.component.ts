import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Subtopic {
  id: string;
  title: string;
  description: string;
}

interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  subtopics: Subtopic[];
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
  filteredTopics: Topic[] = [];
  expandedTopicId: string | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.filteredTopics = [...this.topics];
  }

  filterTopics(event: any) {
    if (!this.searchQuery.trim()) {
      this.filteredTopics = [...this.topics];
      return;
    }
    
    this.filteredTopics = this.topics.filter(topic => 
      topic.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  toggleTopic(topicId: string) {
    this.expandedTopicId = this.expandedTopicId === topicId ? null : topicId;
  }

  navigateToSubtopic(topicId: string, subtopicId: string) {
    this.router.navigate(['/subtopic', `${topicId}-${subtopicId}`]);
  }
} 