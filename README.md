# 🎨 HRMS Lite - Frontend

The modern, responsive user interface for **HRMS Lite**, built with **React**, **Vite**, and **Tailwind CSS**.

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-4.4+-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.3+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

---

## 📋 Table of Contents
- [Overview](#-overview)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running Locally](#-running-locally)
- [Deployment](#-deployment)

---

## 🌟 Overview
A clean and intuitive dashboard for managing human resources.
*   **Dashboard**: At-a-glance metrics.
*   **Employees**: Manage staff details efficiently.
*   **Attendance**: Track daily presence and absence.
*   **Responsive**: Works seamlessly on desktop and tablet.

---

## 🛠 Prerequisites
*   **Node.js** (v18 or higher recommended).
*   **npm** or **yarn**.

---

## 📥 Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/vinay-kumarr/HRMS_Frontend.git
    cd HRMS_Frontend
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

---

## ⚙️ Configuration

Create a `.env` file in the root directory to connect to your backend:

```bash
# .env
VITE_API_URL=http://localhost:8001
# For production, change this to your live backend URL
```

---

## 🏃 Running Locally

Start the Vite development server:

```bash
npm run dev
```

Open your browser at: `http://localhost:5173`

---

## 🚀 Deployment (Vercel)
This project is optimized for **Vercel**.

1.  Push this code to a GitHub repository.
2.  Import the project into Vercel.
3.  **Environment Variables**:
    *   Add `VITE_API_URL` pointing to your deployed backend (e.g., `https://hrms-backend.onrender.com`).
4.  Deploy!
