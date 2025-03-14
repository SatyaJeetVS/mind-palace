import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface Section {
  title: string;
  content: string;
  codeExample?: string;
}

interface SubtopicContent {
  title: string;
  sections: Section[];
}

interface AllContent {
  [key: string]: SubtopicContent;
}

@Component({
  selector: 'app-python-basics',
  templateUrl: './python-basics.component.html',
  styleUrls: ['./python-basics.component.scss']
})
export class PythonBasicsComponent implements OnInit {
  allContent: AllContent = {
    'variables-data-types': {
      title: 'Variables and Data Types',
      sections: [
        {
          title: 'Introduction to Variables',
          content: `Variables are containers for storing data values. Python has no command for declaring a variable.
                   A variable is created the moment you first assign a value to it.`,
          codeExample: `# Variable assignment
x = 5
name = "John"
is_student = True
price = 19.99

# Print variables
print(x)         # Output: 5
print(name)      # Output: John
print(is_student)  # Output: True
print(price)     # Output: 19.99`
        },
        {
          title: 'Data Types',
          content: `Python has several built-in data types:
                   • Numbers (int, float, complex)
                 • Strings (str)
                   • Boolean (bool)
                 • Lists
                   • Tuples
                   • Dictionaries`,
          codeExample: `# Different data types
age = 25              # integer
height = 1.75         # float
name = "Alice"        # string
is_valid = True       # boolean
numbers = [1, 2, 3]   # list
coordinates = (5, 6)  # tuple
person = {            # dictionary
    "name": "Bob",
    "age": 30
}`
        }
      ]
    },
    'control-flow': {
      title: 'Control Flow',
      sections: [
        {
          title: 'If Statements',
          content: `Control flow statements allow you to control the execution path of your program.
                   The if statement is used for conditional execution.`,
          codeExample: `age = 18

if age >= 21:
    print("You can vote and drink")
elif age >= 18:
    print("You can vote")
else:
    print("You're too young")`
        },
        {
          title: 'Loops',
          content: `Python has two types of loops:
                   • for loops - iterate over a sequence
                   • while loops - repeat as long as a condition is true`,
          codeExample: `# For loop
for i in range(5):
    print(i)

# While loop
count = 0
while count < 5:
    print(count)
    count += 1`
        }
      ]
    }
    // Add other subtopics similarly
  };

  subtopicContent: SubtopicContent = this.allContent['variables-data-types'];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const subtopicId = this.route.snapshot.url[1].path;
      this.subtopicContent = this.allContent[subtopicId] || this.allContent['variables-data-types'];
    });
  }
} 