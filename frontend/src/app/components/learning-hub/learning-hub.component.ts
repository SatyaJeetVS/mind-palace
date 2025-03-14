import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// TODO: Create interfaces in a shared models directory
interface Topic {
  id: number;
  title: string;
  description: string;
  progress: number;
  imageUrl?: string;
  subtopics: Subtopic[];
}

interface Subtopic {
  id: number;
  title: string;
  description: string;
  progress: number;
  parentId: number;
  content?: {
    text?: string;
    imageUrl?: string;
    videoUrl?: string;
    codeSnippet?: string;
    quizzes?: any[];
  };
}

@Component({
  selector: 'app-learning-hub',
  templateUrl: './learning-hub.component.html',
  styleUrls: ['./learning-hub.component.scss']
})
export class LearningHubComponent implements OnInit {
  topics: Topic[] = [];
  expandedTopicId: number | null = 1; // Default to first topic expanded
  expandedSubtopicId: number | null = 101; // Default to first subtopic expanded
  
  constructor(private router: Router) { }
  
  ngOnInit(): void {
    // TODO: Replace with API call to fetch topics and subtopics
    // API endpoint: GET /api/topics
    this.loadMockData();
    console.log('Topics loaded:', this.topics);
  }
  
  toggleTopic(topicId: number): void {
    this.expandedTopicId = this.expandedTopicId === topicId ? null : topicId;
    console.log('Toggled topic:', topicId, 'Expanded:', this.expandedTopicId);
  }
  
  toggleSubtopic(subtopicId: number): void {
    this.expandedSubtopicId = this.expandedSubtopicId === subtopicId ? null : subtopicId;
    console.log('Toggled subtopic:', subtopicId, 'Expanded:', this.expandedSubtopicId);
  }
  
  isTopicExpanded(topicId: number): boolean {
    return this.expandedTopicId === topicId;
  }
  
  isSubtopicExpanded(subtopicId: number): boolean {
    return this.expandedSubtopicId === subtopicId;
  }
  
  getProgressColor(progress: number): string {
    if (progress < 30) return '#FF3366'; // Low progress - accent color
    if (progress < 70) return '#FFA500'; // Medium progress - orange
    return '#4CAF50'; // High progress - green
  }
  
  // TODO: Move data fetching to a dedicated service
  private loadMockData(): void {
    // This is mock data that will be replaced with API calls to the FastAPI backend
    this.topics = [
      {
        id: 1,
        title: 'Python',
        description: 'Learn Python programming language',
        progress: 75,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png',
        subtopics: [
          {
            id: 101,
            title: 'Data Types',
            description: 'Variables, numbers, strings, lists, dictionaries',
            progress: 100,
            parentId: 1,
            content: {
              text: 'Python has several built-in data types including integers, floats, strings, lists, tuples, dictionaries, and sets.',
              imageUrl: 'https://www.tutorialsteacher.com/Content/images/python/python-datatypes.png',
              codeSnippet: `# Examples of Python data types
num = 42          # integer
pi = 3.14159      # float
name = "Python"   # string
fruits = ["apple", "banana", "cherry"]  # list
coordinates = (10.5, 20.3)  # tuple
person = {"name": "John", "age": 30}  # dictionary`
            }
          },
          {
            id: 102,
            title: 'Functions',
            description: 'Defining and using functions',
            progress: 50,
            parentId: 1,
            content: {
              text: 'Functions are reusable blocks of code that perform specific tasks.',
              codeSnippet: `# Defining and calling functions
def greet(name):
    """This function greets the person passed in as a parameter"""
    return f"Hello, {name}!"

# Function call
message = greet("Alice")
print(message)  # Output: Hello, Alice!

# Function with default parameter
def greet_with_time(name, time="morning"):
    return f"Good {time}, {name}!"`
            }
          },
          {
            id: 103,
            title: 'Control Flow',
            description: 'Conditionals and loops in Python',
            progress: 65,
            parentId: 1,
            content: {
              text: 'Control flow statements direct the order of execution in a program.',
              codeSnippet: `# If statements
age = 20
if age < 18:
    print("Minor")
elif age >= 18 and age < 65:
    print("Adult")
else:
    print("Senior")

# For loops
for i in range(5):
    print(i)  # Prints 0, 1, 2, 3, 4

# While loops
count = 0
while count < 5:
    print(count)
    count += 1`
            }
          }
        ]
      },
      {
        id: 2,
        title: 'Web Development',
        description: 'Learn web development technologies',
        progress: 30,
        imageUrl: 'https://cdn-icons-png.flaticon.com/512/1183/1183672.png',
        subtopics: [
          {
            id: 201,
            title: 'HTML',
            description: 'Structure of web pages',
            progress: 90,
            parentId: 2,
            content: {
              text: 'HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser.',
              codeSnippet: `<!DOCTYPE html>
<html>
<head>
    <title>My First Web Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is a paragraph.</p>
    <ul>
        <li>List item 1</li>
        <li>List item 2</li>
    </ul>
</body>
</html>`
            }
          },
          {
            id: 202,
            title: 'CSS',
            description: 'Styling web pages',
            progress: 70,
            parentId: 2,
            content: {
              text: 'CSS (Cascading Style Sheets) is used to style and layout web pages.',
              codeSnippet: `/* Basic CSS styling */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f0f0f0;
}

h1 {
    color: #333;
    text-align: center;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}`
            }
          },
          {
            id: 203,
            title: 'JavaScript',
            description: 'Adding interactivity to web pages',
            progress: 40,
            parentId: 2,
            content: {
              text: 'JavaScript is a programming language that enables interactive web pages.',
              codeSnippet: `// Basic JavaScript examples
// Variables and data types
let name = "John";
const age = 30;
let isStudent = false;

// Functions
function greet(name) {
    return "Hello, " + name + "!";
}

// DOM manipulation
document.getElementById("demo").innerHTML = "Hello JavaScript!";
document.querySelector(".button").addEventListener("click", function() {
    alert("Button clicked!");
});`
            }
          }
        ]
      },
      {
        id: 3,
        title: 'Data Science',
        description: 'Learn data analysis and visualization',
        progress: 10,
        imageUrl: 'https://cdn-icons-png.flaticon.com/512/2103/2103658.png',
        subtopics: [
          {
            id: 301,
            title: 'Pandas',
            description: 'Data manipulation and analysis',
            progress: 20,
            parentId: 3,
            content: {
              text: 'Pandas is a Python library for data manipulation and analysis, particularly with tabular data.',
              codeSnippet: `# Basic Pandas operations
import pandas as pd

# Create a DataFrame
data = {
    'Name': ['John', 'Anna', 'Peter', 'Linda'],
    'Age': [28, 34, 29, 42],
    'City': ['New York', 'Paris', 'Berlin', 'London']
}
df = pd.DataFrame(data)

# Data exploration
print(df.head())  # View first 5 rows
print(df.describe())  # Statistical summary
print(df['Age'].mean())  # Calculate mean age

# Filtering data
adults = df[df['Age'] > 30]  # Get people older than 30`
            }
          },
          {
            id: 302,
            title: 'Machine Learning',
            description: 'Building predictive models',
            progress: 5,
            parentId: 3,
            content: {
              text: 'Machine learning is a field of AI that enables systems to learn from data and make predictions.',
              codeSnippet: `# Simple machine learning example with scikit-learn
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import numpy as np

# Generate sample data
X = np.random.rand(100, 1) * 10  # Feature
y = 2 * X + 1 + np.random.randn(100, 1)  # Target with noise

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train a linear regression model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions
predictions = model.predict(X_test)

# Evaluate the model
score = model.score(X_test, y_test)
print(f"Model accuracy: {score:.2f}")`
            }
          }
        ]
      }
    ];
  }

  navigateToSubtopic(subtopicId: string) {
    this.router.navigate(['/subtopic', subtopicId]);
  }
} 