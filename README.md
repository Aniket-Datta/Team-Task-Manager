# Team Task Manager

A robust, full-stack task management application built with the MERN stack (MongoDB, Express, React, Node.js) and Tailwind CSS. Features role-based access control, task status tracking, real-time commenting, and a beautiful modern SaaS UI.

## Features

- **Role-Based Access Control**: Admins can manage projects and tasks; Members can view assigned work and update status.
- **Project Management**: Create, edit, and monitor active projects with visual progress bars.
- **Task Board**: Filter tasks by status, manage priorities, and track overdue items.
- **Modern UI**: Polished, responsive layout built with Tailwind CSS, featuring split-screen authentication, glassmorphism, and smooth animations.
- **Secure Authentication**: JWT-based secure sessions with robust password hashing.

---

## Local Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (Local installation or MongoDB Atlas cluster)

### 1. Clone & Install
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Variables
Create a `.env` file in both `server` and `client` directories.

**server/.env**
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0...
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
```

**client/.env**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Locally
```bash
# In the server directory
npm run dev

# In the client directory
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## Deployment Guide (Railway & MongoDB Atlas)

This application is configured for seamless deployment on Railway.

### 1. MongoDB Atlas Setup
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user with a secure password.
3. Under **Network Access**, add the IP address `0.0.0.0/0` to allow Railway to connect.
4. Copy your connection string (replace `<password>` with your actual password).

### 2. Railway Backend Setup
1. Log in to [Railway](https://railway.app/) and create a new project from your GitHub repository.
2. Select your repository and add a **New Service**.
3. **Configure the Backend Service**:
   - **Root Directory**: `/server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add the following **Environment Variables**:
   - `PORT`: `5000`
   - `MONGO_URI`: `your_atlas_connection_string`
   - `JWT_SECRET`: `your_jwt_secret`
   - `CLIENT_URL`: `https://your-frontend-url.up.railway.app` (Add this *after* you deploy the frontend)
5. Generate a domain for your backend service in Railway Settings.

### 3. Railway Frontend Setup
1. In the same Railway project, click **New** -> **GitHub Repo** (select the same repo).
2. **Configure the Frontend Service**:
   - **Root Directory**: `/client`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview -- --host 0.0.0.0 --port $PORT`
3. Add the following **Environment Variable**:
   - `VITE_API_URL`: `https://your-backend-url.up.railway.app/api` (Use the domain generated in Step 2)
4. Generate a domain for your frontend service.

### 4. API Testing
To verify your backend is running correctly on Railway, open your backend URL in the browser:
`https://your-backend-url.up.railway.app/`
You should see:
> `Team Task Manager API is running`

Once both are deployed, open your frontend URL, create an account, and start managing tasks!
