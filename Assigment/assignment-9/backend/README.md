Visitor Management System (Backend)

Overview:
This backend a Visitor Management System (VMS) that handles visitor registration, appointment scheduling, staff management, and security tracking.

Built with:
    Node.js
    Express.js
    MongoDB (Mongoose)
    JWT Authentication
    Cloudinary (file upload)

Features:
    Visitor registration & login
    Staff (Admin, Security, Employee) management
    Appointment booking system
    QR-based check-in system
    Visitor logs & analytics
    CSV export
    Secure API with rate limiting & helmet

 Role-Based Access Control:
        Admin           --- Full access (users, logs, analytics)
        Employee        -- Manage appointments
        Security        --- Scan QR, view logs
        Visitor         --- Register & request appointments

API Endpoints: 
    Auth Routes     ==>(/api/auth)

    Register User ==>    
     POST /api/auth/register

{
  "name": "test test",
  "email": "test@test.com",
  "password": "123456",
  "role": "Employee",
  "department": "HR"
}

Login ==> 
POST /api/auth/login

{
  "email": "test@test.com",
  "password": "123456"
}

Get All Users (Admin)

GET /api/auth/users

Update User Role (Admin)

PUT /api/auth/users/:id

Delete User (Admin)

DELETE /api/auth/users/:id

 Visitor Routes (/api/visitors)

Register Visitor

POST /api/visitors/register

Login Visitor

POST /api/visitors/login

Create Appointment

POST /api/visitors/appointment

{
  "hostId": "userId",
  "date": "2026-04-20T10:00",
  "purpose": "Meeting",
  "email": "visitor@email.com"
}

Get Hosts

GET /api/visitors/hosts

 Appointment Routes (/api/appointments)

Get All Appointments

GET /api/appointments

Update Appointment Status (Employee/Admin)

PUT /api/appointments/:id

Scan QR (Security/Admin)

POST /api/appointments/scan

Get Logs (Admin/Security)

GET /api/appointments/logs

Delete Appointment

DELETE /api/appointments/:id

Search

GET /api/appointments/search?query=

Filter

GET /api/appointments/filter

Export CSV

GET /api/appointments/export

 Analytics (/api/analytics)

Dashboard Stats

GET /api/analytics/stats

 File Upload (/api/upload)

Upload Visitor Photo

POST /api/upload
(photo field)

Response:

{
  "filePath": "cloudinary_url"
}

 Database Schema

User Collection

{
  name: String,
  email: String,
  password: String (hashed),
  role: 'Admin' | 'Security' | 'Employee',
  department: String
}

Visitor Collection

{
  name: String,
  email: String,
  phone: String,
  password: String (hashed),
  role: 'Visitor',
  company: String,
  photoUrl: String
}

Appointment Collection (conceptual)

{
  visitorId: ObjectId,
  hostId: ObjectId,
  date: Date,
  purpose: String,
  status: 'Pending' | 'Approved' | 'Rejected',
  checkStatus: 'Not Checked In' | 'Checked In' | 'Checked Out'
}

 Environment Variables

Create .env in backend:

PORT=5000
MONGODB_URI=my_bongodb_url
JWT_SECRET=jwtsyscretkey
CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx
EMAIL_USER=xxxxx
EMAIL_PASS=xxxxx



# JWT Authentication:
Password hashing (bcrypt)

# Run Project(Setup Instructions):
  1. Clone the repo
    git clone <https://github.com/somen-das/TuteDude-Mern.git>
  2. Go to the AssignMent
  2. Go to backend
    cd backend

  3. Install dependencies
    npm install

  4. Create .env file (see below)

  5. Run server
    npm run dev


 Author: ==> Somen Das