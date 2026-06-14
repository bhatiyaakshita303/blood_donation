<div align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/3209/3209141.png" alt="Blood Donation Logo" width="120" />
</div>

<h1 align="center">Blood Donation Management System 🩸</h1>

<p align="center">
  <strong>A comprehensive Full-Stack application seamlessly connecting blood donors with patients in need.</strong>
</p>

<div align="center">
  <img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
</div>

<br />

## 📖 Overview

The **Blood Donation Management System** is a robust application meticulously designed to bridge the crucial gap between blood donors, hospitals, and recipients. It allows users to register as Donors, Patients, or Administrators with role-based dashboards and interactions.

The project features a **RESTful backend API** built with Node.js, Express, and a lightweight SQLite database, coupled with a highly dynamic **frontend application** developed in Angular.

---

## ✨ Key Features

<ul>
  <li>👤 <strong>Role-Based Access:</strong> Distinct functionalities tailored for Donors, Patients, and Admin users.</li>
  <li>🩸 <strong>Donation Requests:</strong> Patients can seamlessly request specific blood types when urgent.</li>
  <li>🤝 <strong>Donor Management:</strong> Donors can easily track their past donations and schedule new ones.</li>
  <li>🔒 <strong>Secure Authentication:</strong> Password protection via robust <code>bcrypt</code> hashing.</li>
  <li>📱 <strong>Responsive UI:</strong> An intuitive and accessible frontend interface created with Angular.</li>
  <li>🛠️ <strong>Lightweight Backend:</strong> Utilizes SQLite for swift setup and localized data management natively.</li>
</ul>

---

## 🛠️ Technology Stack

<table align="center">
  <tr>
    <th><strong>Stack Area</strong></th>
    <th><strong>Technologies & Frameworks</strong></th>
  </tr>
  <tr>
    <td>🎨 <strong>Frontend</strong></td>
    <td>Angular 17+, TypeScript, HTML5, CSS3</td>
  </tr>
  <tr>
    <td>⚙️ <strong>Backend</strong></td>
    <td>Node.js, Express.js</td>
  </tr>
  <tr>
    <td>🗄️ <strong>Database</strong></td>
    <td>SQLite3</td>
  </tr>
  <tr>
    <td>🔐 <strong>Security</strong></td>
    <td>bcrypt (Password Hashing), CORS Configuration</td>
  </tr>
</table>

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/blood-donation.git
cd blood-donation
```

### 2. Backend Setup

```bash
# Navigate to the backend directory
cd blood-donation-backend

# Install the required dependencies
npm install

# Start the application in development mode
npm run dev
# The API will be running locally (usually on http://localhost:3000)
```

### 3. Frontend Setup

Open a new terminal window or tab to run the frontend server simultaneously.

```bash
# Navigate to the frontend directory
cd blood-donation-frontend

# Install the required dependencies
npm install

# Start the Angular development server
npm start
# Navigate to http://localhost:4200/ in your browser to view the application
```

---

## 📁 Project Structure Built Together

<details>
  <summary><b>Click to expand</b> project tree view</summary>

```text
blood_donation/
│
├── blood-donation-backend/      # Node.js + Express backend service
│   ├── server.js                # Entry point for backend API
│   ├── package.json             # Backend dependencies & scripts
│   └── ...                      # Controllers, Models, Routes
│
└── blood-donation-frontend/     # Angular web client application
    ├── src/                     # Application source code
    │   ├── app/                 # Components, Services, Guards
    │   ├── assets/              # Static files (images, icons)
    │   └── index.html           # Main HTML file
    ├── package.json             # Frontend dependencies & scripts
    └── ...                      # Config files (angular.json, tsconfig.json)
```

</details>

---

## 📜 License

This project is licensed under the **MIT License**.

---

<p align="center">
  <i>"You don't have to be somebody's family member to donate blood."</i> ❤️
</p>
