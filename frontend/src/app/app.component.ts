import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

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
  topics: Topic[] = [];
  currentTopicId: string | null = null;

  constructor(private router: Router, private http: HttpClient) {
    // TODO: Check login status on init
    this.isLoggedIn = false;
  }

  /**
   * Generic HTTP call service method
   * @param url The endpoint URL
   * @param method HTTP method (GET, POST, PUT, DELETE, etc.)
   * @param payload Optional request body or params
   * @returns Promise<any> with the response
   */
  httpCall(url: string, method: string, payload?: any): Promise<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    switch (method.toUpperCase()) {
      case 'GET':
        return firstValueFrom(this.http.get(url, httpOptions));
      case 'POST':
        return firstValueFrom(this.http.post(url, payload, httpOptions));
      case 'PUT':
        return firstValueFrom(this.http.put(url, payload, httpOptions));
      case 'DELETE':
        return firstValueFrom(this.http.delete(url, httpOptions));
      case 'PATCH':
        return firstValueFrom(this.http.patch(url, payload, httpOptions));
      default:
        throw new Error('Unsupported HTTP method: ' + method);
    }
  }

  ngOnInit(): void {
    // Fetch topics from backend
    this.getTopics();

    // Set initial topic from URL if available
    // const path = window.location.pathname;
    // if (path.includes('/topics/')) {
    //   const topicId = path.split('/topics/')[1];
    //   this.currentTopicId = topicId;
    // }
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
  
getTopics(): void {
    // Call backend API to get curriculum names using httpCall
    this.httpCall('http://localhost:8000/curriculum/list-names', 'GET')
      .then((data: Topic[]) => {
        this.topics = data;
      })
      .catch((err) => {
        console.error('Failed to fetch topics', err);
        this.topics = [];
      });
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

