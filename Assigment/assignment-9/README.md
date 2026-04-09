# MERN Visitor Management System

A full-stack Node.js, Express, React, and MongoDB application with role-based access control, QR code scanning, PDF visitor badge generation, comprehensive analytics, and seamless file upload capabilities for managing visitors.

## Features

- **Frontend:**
  - Modern, responsive React GUI.
  - Role-based Dashboards (Admin, Employee, Security).
  - Visitor Photo Upload to the registration form.
  - Interactive Analytics & Data Tables built with Recharts.
  - Data Export to CSV functionality.
  - In-browser Native QR Scanner built with `html5-qrcode` to scan digital passes.

- **Backend:**
  - RESTful APIs built with Express and MongoDB.
  - Clean error handling and manually crafted analytics pipelines.
  - Middleware-driven route protection and input validation using `Joi`.
  - Advanced DDOS protection with `helmet` and `express-rate-limit`.
  - Visitor photos storage logic via `multer`.
  - Generates downloadable Visitor Pass PDFs using `pdfkit`.

## Prerequisites

- Node.js (v18+)
- MongoDB connection string (`MONGODB_URI`)
- Valid Gmail account for NodeMailer (`EMAIL_USER`, `EMAIL_PASS`)

## Installation & Setup

1. **Clone & Install Dependencies**
   Open your terminal and navigate to each folder to install dependencies.
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Backend Configuration**
   In the `backend` directory, create a `.env` file containing:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your.email@gmail.com
   EMAIL_PASS=your_app_password
   ```

3. **Frontend Configuration**
   In the `frontend` directory, create a `.env` file containing:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

## Running the Application

Open two separate terminals:

**Terminal 1 (Backend - Express Server):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend - Vite Dev Server):**
```bash
cd frontend
npm run dev
```

Navigate to `http://localhost:5173` to see the application running.

## Screenshots

*Add screenshots using Markdown image syntax once you have the app running locally:*
- `![Dashboard](path/to/img)`
- `![Scanner](path/to/img)`
- `![Registration](path/to/img)`

## System Modules

The core business logic centers around 3 entities:
1. **Users** (Staff, Admin, Security) - created by Admin in the system.
2. **Visitors** - unique entities tracked by email and phone.
3. **Appointments/Passes** - ties User and Visitor together. Generates unique QR strings that map to a `CheckLog`.

## Security Features Built-in

- Rate limiting restricts high API request volumes to prevent brute force scraping or attacks.
- Document storage isolates valid upload file properties only.
- Validation bounds verify incoming `req.body` parameters precisely explicitly enforcing type schema definitions.
