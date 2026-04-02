# To-Do List API (Backend)

This is the Express.js backend for the To-Do List Application. It provides a robust RESTful API to manage tasks and connects with MongoDB.

## Features
 Code is logically organized into Models, Controllers, Services, and Routes for maintainability.

## Setup and Installation
1. Ensure MongoDB is running locally (default expectation is `mongodb://127.0.0.1:27017/todoapp`) or define it in standard environment variables.
2. Navigate to the backend directory: using 'cd backend'
3. Install local dependencies: 'npm i'
4. Start the server (runs on port 5000): 
    Using nodemon (live reload): 'npm run dev'

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | Fetch all tasks, also search|
| `POST` | `/api/tasks` | Create a newly added task. title is required |
| `PUT` | `/api/tasks/:id` | Update a task's full details. |
| `PATCH` | `/api/tasks/:id/status`| Specifically toggle the 'complete' property. |
| `DELETE` | `/api/tasks/:id` | Delete a single task. |

## Tech Stack
- Node.js ==>  JavaScript Runtime.
- Express.js ==>  Backend framework and server.
- Mongoose ==> library for MongoDB interaction.
- Cors ==>  Middleware to handle cross-origin requests.
- Dotenv ==>  Environment variable loader.
