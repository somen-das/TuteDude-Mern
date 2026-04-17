# MERN Visitor Management System

A full-stack Visitor Management System built with the MERN stack (MongoDB, Express, React, Node.js). This application helps organizations manage visitor registrations, approvals, and check-ins efficiently using QR-based passes and role-based dashboards.

---

## Overview

This system provides a structured way to:

* Register visitors
* Manage appointments between visitors and employees
* Generate QR-based visitor passes
* Track check-in and check-out using a QR scanner

It supports multiple roles such as **Admin**, **Employee**, and **Security**, each with their own dashboard and permissions.

---

##  Features

### 🔹 Frontend (React)

* Responsive and modern UI
* Role-based dashboards (Admin / Employee / Security)
* Visitor registration with image upload
* QR code scanning using `html5-qrcode`
* Data visualization using Recharts
* CSV export support
* Modal-based interactions and confirmations

###  Backend (Node.js + Express)

* RESTful API architecture
* Role-based authentication and authorization
* Input validation using Joi
* Secure file uploads using Multer
* Visitor pass PDF generation using PDFKit
* Email notifications using NodeMailer
* Error handling middleware

### 🔹 Security

* Helmet for HTTP security headers
* Rate limiting using express-rate-limit
* JWT-based authentication

---

##  System Architecture

The system is based on three core entities:

1. **Users**

   * Roles: Admin, Employee, Security
   * Managed by Admin

2. **Visitors**

   * Identified by email and phone
   * Visitor Can request appointments

3. **Appointments / Passes**

   * Links Visitor and Employee
   * Generates unique Pass ID and QR code
   * Tracks check-in and check-out status

---

##  Tech Stack

 Layer        Technology                    
 -----------  ----------------------------- 
 Frontend    - React (Vite), Axios, Recharts, 
 Backend     - Node.js, Express              
 Database    - MongoDB                       
 Auth        - JWT                           
 File Upload - Multer,                         
 QR Scanner  - html5-qrcode                  
 PDF         - PDFKit                        
 Email       - NodeMailer                    

---

##  Installation & Setup

### 1. Clone the repository

git clone (https://github.com/somen-das/TuteDude-Mern.git)

---

### 2. Install dependencies

# For Backend: 
   1. Go to the mail file: 
    cd .\TuteDude-Mern\Assigment\assignment-9\backend\

   2. Install dependencies
    npm install

   3. Create .env file (see the .env.example)

   4. Run server
    npm run dev

# For Frontend:
   1. Go to the mail file: 
    cd .\TuteDude-Mern\Assigment\assignment-9\frontend\

   2. Install dependencies
    npm install

   3. Create .env file (see the .env.example)

   4. Run server
    npm run dev

---

### 3. Environment Variables

#### Backend (`/backend/.env`)

```env
MONGODB_URI=mongodb:
PORT=0
JWT_SECRET=
FRONTEND_URL=
EMAIL_USER=
EMAIL_PASS=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_CLOUD_NAME=

```

#### Frontend (`/frontend/.env`)

```env
VITE_API_URL=
```

---

##  Running the Application

Run both frontend and backend in separate terminals:

### Backend

```bash
cd backend
npm run dev
```
Backend port
http://localhost:5000


### Frontend

```bash
cd frontend
npm run dev
```

Open in browser for my local machine:
http://localhost:5173

---

##  Security Considerations

* JWT-based authentication for protected routes
* Role-based access control
* Request rate limiting to prevent abuse
* Input validation using Joi
* Secure file upload handling

---

##  Future Improvements

* Real-time notifications (WebSockets)
* Advanced analytics dashboard
* Mobile app version
* Improved UI/UX and accessibility

## Git repo Link
   https://github.com/somen-das/TuteDude-Mern.git

## Video Link
   https://www.loom.com/share/35f73d187a0942fdb2c546336d0d4b8c

## Author

Developed by:  Somen Das (software engineer)
