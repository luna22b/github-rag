# 🛸 Orbit

Orbit is a full-stack application that allows users to connect their GitHub account, import repositories, and ask natural language questions about their codebase using Retrieval-Augmented Generation (RAG).

## Technologies Used

- React
- TypeScript
- FastAPI
- PostgreSQL
- Docker

## Features

- Authentication with JWT and GitHub OAuth
- Import public and private GitHub repositories
- Repository indexing and chunking
- Vector search using pgvector
- AI-powered chat with repository context
- Persistent storage with PostgreSQL
- Containerized development environment with Docker

## Future Improvements

- Support multiple repositories in a single conversation
- Users that are signed in without GitHub can look up public repositories
- The line numbers that the AI sources from
- Generated names for the chat history

## Running with Docker

Clone the repository.

```
git clone https://github.com/luna22b/github-rag.git
```

Navigate to the project.

```
cd github-rag
```

Start the application.

```
docker compose up --build
```

Once the containers are running:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
  

## Running Without Docker

### Backend

```
cd backend

python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt

fastapi dev app/main.py
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

## Preview


### Main Page
<img width="1317" height="1237" alt="Image" src="https://github.com/user-attachments/assets/d50a5b2c-d16d-4f73-bdca-1561f6a48f82" />

### Repositories
<img width="1327" height="1081" alt="Image" src="https://github.com/user-attachments/assets/082c3ff4-c7c8-4873-9ad0-3ad94a0f969f" />

### Chats
<img width="1337" height="1310" alt="Image" src="https://github.com/user-attachments/assets/50c197f2-1cd9-44dd-9792-060e5bf7c510" />





