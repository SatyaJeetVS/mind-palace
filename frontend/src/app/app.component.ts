import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

interface Topic {
  id: string;
  title: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'mind-palace';
  isLoggedIn = false; // This should be managed by an auth service
  sidebarOpen = false;
  showTopicsDropdown = false;
  topics: Topic[] = [
    { id: 'python-basics', title: 'Python Basics' },
    { id: 'web-development', title: 'Web Development' },
    { id: 'data-science', title: 'Data Science' },
    { id: 'algorithms', title: 'Algorithms' },
    { id: 'system-design', title: 'System Design' },
    { id: 'cloud-computing', title: 'Cloud Computing' }
  ];
  currentTopicId: string | null = null;

  constructor(private router: Router) {
    // TODO: Check login status on init
    this.isLoggedIn = false;
  }

  ngOnInit(): void {
    // In a real app, you would fetch topics from a service
    
    // Set initial topic from URL if available
    const path = window.location.pathname;
    if (path.includes('/topics/')) {
      const topicId = path.split('/topics/')[1];
      this.currentTopicId = topicId;
    }
  }

  logout() {
    // TODO: Implement proper logout logic
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  openSidebar() {
    this.sidebarOpen = true;
  }

  closeSidebar() {
    this.sidebarOpen = false;
    this.showTopicsDropdown = false;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleTopicsDropdown(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    this.showTopicsDropdown = !this.showTopicsDropdown;
  }

  showTopics() {
    this.showTopicsDropdown = true;
  }

  hideTopics() {
    // Add a small delay to prevent the menu from closing immediately
    // when moving from the link to the dropdown content
    setTimeout(() => {
      // Only hide if the mouse is not over the dropdown container
      if (!document.querySelector('.dropdown-container:hover')) {
        this.showTopicsDropdown = false;
      }
    }, 100);
  }

  navigateToTopic(topicId: string) {
    // Update current topic
    this.currentTopicId = topicId;
    
    // Navigate to the topic
    this.router.navigate(['/topics', topicId]);
    this.closeSidebar();
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    // For hover functionality, we don't need to close on document click
    // But we'll keep this for mobile devices where hover doesn't work
    if (window.innerWidth <= 768) {
      const dropdownContainer = document.querySelector('.dropdown-container');
      if (dropdownContainer && !dropdownContainer.contains(event.target as Node)) {
        this.showTopicsDropdown = false;
      }
    }
  }
}
