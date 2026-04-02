To-Do List API Design:
Objective
This document outlines the API design for a To-Do List application. It includes all CRUD operations, endpoints, request/response formats, and task ID generation logic.
1. Technical Stack
Runtime: Node.js
Framework: Express.js
Process Manager: Nodemon 
CORS for CORS error management for FE. 
2. Features
Add Tasks: We create new to-do items.
View Tasks: Fetch the complete list of todos.
Update Tasks: Modify specific todos using their unique ID.
Delete Tasks: Remove specific todos from the list using ID parameters.


3. API Reference & Payload Specifications

Base URL ⇒ http://localhost:3000/



a. Get All Todos
Route: /tasks
Method: GET
Response: 
[{"id": "uuid-123",
"title": "Learn Node",
"completed": false
}]



b. Create New Todo
Route: /tasks
Method: POST
Payload:
{
 "title": "Learn DBMS", 
"complete": false
}
Response: 
{ "message": "Task created successfully!", 
"task": { "id": "e455396f-147c-4b97-98d1-832268248e32", "title": "Learn DBMS", "completed": false } 
}
Validation Error: { "message": "Title is required" }
If title is empty or miss then showing validation error.





c.  Update Todo
Route: /tasks/:id
Method: PUT
Query Params: id is required
Payload: { "title": "Learn NextJs", "completed": false }
Response: 
{ "message": "Task updated successfully",
 "task": { "id": "dda88e1c-9546-4c7f-a112-d483da1e1156", "title": "Learn NextJs", "completed": false } 
}
Error: {"message": "Task not found"}
If input wrong id then error message showing


d. Delete Todo
Route: /tasks/:id
Method: DELETE
Query Params: id is required
Response: 
{ "message": "Task deleted successfully", "total": 4 }
Error: {"message": "Task not found"}
If input wrong id then error message showing



5. Error Handling Strategy 
Status Code: 	200 ⇒Success 
			201⇒	Created 
			400⇒Bad Request 
			404⇒Not Found 
			500⇒Server Error

6. Validation Rules 
title is required 
completed must be boolean 
id must be valid UUID


Development:

	Install nodejs 
	npm i nodemon cors express ⇒ for development
	npm run dev ⇒ project start


RodeMap: 
	Initially npm init ⇒ for install dependency
	Create server.js file ⇒ for server setup
	Map the GET, POST, PUT, and DELETE routes on /Routes/todoroutes.js
	Create Controller folder and inside todoController.js for all logic
	
	We test this on postman. 

