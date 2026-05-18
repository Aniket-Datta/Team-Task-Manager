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
2. Select your repository and click **Add Service** → **GitHub Repo** (same repo).
3. **Configure the Backend Service**:
   - **Root Directory**: `/server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add the following **Environment Variables**:
   - `PORT`: `5000`
   - `MONGO_URI`: `your_atlas_connection_string`
   - `JWT_SECRET` (required — see note 1)
   - `JWT_EXPIRES_IN`: `7d`
   - `CLIENT_URL`: `https://your-frontend-url.up.railway.app` (Add this *after* deploying frontend)
5. Go to **Settings** → **Networking** → **Generate Domain**. Copy the URL.

### 3. Railway Frontend Setup
1. In the same project, click **New** → **GitHub Repo** (select the same repo).
2. **Configure the Frontend Service**:
   - **Root Directory**: `/client`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview -- --host 0.0.0.0 --port $PORT`
3. Add the following **Environment Variable**:
   - `VITE_API_URL`: `https://your-backend-url.up.railway.app/api` (the backend URL from Step 2)
4. Go to **Settings** → **Networking** → set **Target port** to `8080` and click **Generate Domain**.
5. Copy the frontend URL, go back to the backend service **Variables**, and set `CLIENT_URL` to this URL.

> **Note 1 (JWT_SECRET):** Railway environment variables override `.env` file values. If you don't set `JWT_SECRET` in Railway Variables, the app will crash with `secretOrPrivateKey must have a value`. Always set it manually.
>
> **Note 2 (CORS):** The server is configured to allow both `localhost:5173` and the production `CLIENT_URL`. No additional configuration needed.
>
> **Note 3 (Vite Preview):** If you see `Blocked request` error, add `preview.allowedHosts: true` to `client/vite.config.js` (already included in this repo).

### 4. Verify
- Open your backend URL — you should see: `Team Task Manager API is running`
- Open your frontend URL — you should be able to register/login and use the app.
- If you see a **CORS error**, make sure `CLIENT_URL` is set correctly on the backend Variables.
- If you see a **500 error**, check the Railway backend **Logs** tab for the actual error message.

---

### Deployment (Live)

| Service | URL |
|---|---|
| Backend | `https://team-task-manager-production-8c0b.up.railway.app` |
| Frontend | `https://gregarious-fulfillment-production-5281.up.railway.app` |

