# Visitor Management System (Frontend)

A modern React-based frontend for the Visitor Management System (VMS). This application allows visitors to register, schedule appointments, and enables staff to manage visitor flow efficiently.

---

##  Features

* Visitor Pre-Registration
* Visitor Login & Dashboard
* Appointment Scheduling
* Admin Dashboard (Staff Management, Staff delete and add)
* Security Dashboard (Check-in / Check-out)
* CSV Export for Logs (Only Admin can Export)
* Role-Based UI Rendering


---

##  Tech Stack

* React.js (Vite)
* React Router DOM
* Axios
* Context API (Auth Management)
* CSS (Custom Styling)

---

##  Project Structure

```
frontend/
│── src/
|   |── assets
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── utils/
│   └── views
│   ├── App.css/
│   ├── App.jsx/
│   ├── index.css/
│   ├── main.jsx/
│
│── public/
│── package.json
│── vite.config.js
│── .env/
│── dockerfile

```

---

##  Setup Instructions

# Run Project(Setup Instructions):
  1. Clone the repo
    git clone <https://github.com/somen-das/TuteDude-Mern.git>

  2. Go to the mail file: 
    cd .\TuteDude-Mern\Assigment\assignment-9\frontend\

  3. Install dependencies
    npm install

  4. Create .env file (see the .env.example)

  5. Run server
    npm run dev

App will run at:
 http://localhost:5173

---

### 5. Build for production

```bash
npm run build
```

---

##  Environment Variables

 VITE_API_URL: 

---

##  API Integration

Frontend communicates with backend APIs using Axios via a centralized AuthContext.

Example:

```js
API.get('/appointments')
API.post('/visitors/register')
```

---

##  User Roles

* **Visitor**

  * Register & login
  * Schedule appointments

* **Employee (Host)**

  * Approve/reject/delete appointments

* **Security**

  * Scan QR & manage check-ins

* **Admin**

  * Manage users & system logs

---

##  Deployment

### Build the project:

```bash
npm run build
```

### Serve using:

* Vercel for production

---

## Docker Support

Make sure `.env` is configured properly before running:

```bash
docker-compose up --build
```

---

## Notes

* Do not commit `.env` files
* Use `.env.example` for sharing config template
* Ensure backend server is running before frontend

---

## Future Improvements
* Real-time notifications (WebSockets)
* Advanced analytics dashboard
* Mobile app version
* Improved UI/UX and accessibility

---

## Author

Developed by:  Somen Das (software engineer)
