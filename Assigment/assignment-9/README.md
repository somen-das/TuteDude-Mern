# Visitor Pass Management System

A digital Visitor Pass Management System built with the MERN stack.

## Features
- **Role-Based Access**: Multi-role support (`Admin`, `Employee`, `Security`).
- **Visitor Pre-Registration**: Visitors can book an appointment publicly.
- **Pass Approval Flow**: Employees can approve/reject visitor requests.
- **QR Code Integrated Passes**: Generating a Digital Pass with a QR Code for scanning.
- **Security Scanner**: Built-in QR scanner dashboard for the frontdesk.
- **Admin Analytics**: Central logging of check-in and check-out activities.
- **Premium UI**: Dark mode, dynamic layout with glassmorphism design.

## Project Structure
- `/backend`: Node.js, Express, MongoDB (Mongoose ODMs).
- `/frontend`: React 18, Vite.

## Setup Instructions

### Pre-requisites
- Node.js installed.
- MongoDB server running locally or accessible via URL.

### 1. Database Setup (Seeding)
To test the application, you need to populate the database with a few necessary users (Roles: Admin, Security, Employee).

```bash
cd backend
npm install
npm run seed
```
This will insert the following users:
- **Admin**: admin@example.com / password123
- **Security**: security@example.com / password123
- **Employee (Host)**: jane.host@example.com / password123

### 2. Run Backend
```bash
cd backend
# Edit `.env` if you need to point MONGODB_URI differently
npm run dev
```

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```

### Usage
- Start the Frontend and Backend.
- Go to `http://localhost:5173/` (Frontend URL)
- You will be redirected to the **Visitor Pre-registration Form**. A visitor selects an **Employee (Host)** from the dropdown.
- After a visitor requests a pass, **Login as Employee** (`jane.host@example.com / password123`).
- Go to the Employee Dashboard to **Approve** the pass. Once approved, the **QR string/badge** is randomly generated and rendered on screen.
- Log out, and **Login as Security Guard** (`security@example.com / password123`).
- In the security dashboard, either use your camera to scan the QR visually, or paste the `Pass ID` string manually. Doing so will securely log the Check In, and a subsequent scan logs the Check Out.

## Demo Video & Evidence
*(Generate through Antigravity Browser Recorder Tool during walkthroughs).*
