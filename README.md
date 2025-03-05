# Mind Palace - AI-Powered Self-Learning Platform

Mind Palace is a comprehensive self-learning web application that uses AI to generate personalized learning curricula and provide interactive learning experiences.

## Features

- **AI-Generated Curriculum**: Input any topic you want to master, and the app generates a comprehensive learning path.
- **Tree-Based Knowledge Structure**: All information is organized in intuitive topic trees and subtrees.
- **Interactive Learning Interface**: Navigate through topics with visual progress tracking.
- **AI-Powered Doubt Resolution**: Ask questions and get context-aware responses.
- **Dynamic Curriculum Updates**: The learning path evolves based on your questions and progress.

## Technology Stack

- **Backend**: Python (FastAPI)
- **Frontend**: Angular
- **Database**: MongoDB
- **AI Integration**: OpenAI GPT API

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 14+
- Angular CLI
- MongoDB

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Frontend Setup

```bash
cd frontend
npm install
ng serve
```

## Project Structure

- `backend/`: Python FastAPI backend
  - `app/`: Main application code
    - `api/`: API endpoints
    - `core/`: Core functionality and settings
    - `db/`: Database models and connections
    - `models/`: Data models
    - `services/`: Business logic
- `frontend/`: Angular frontend
  - `src/app/`: Angular components and services

## Environment Variables

The backend requires the following environment variables:

- `MONGODB_URL`: MongoDB connection URL
- `MONGODB_DB_NAME`: MongoDB database name
- `SECRET_KEY`: Secret key for JWT token generation
- `OPENAI_API_KEY`: OpenAI API key for AI features

You can set these in a `.env` file in the backend directory.

## License

MIT
