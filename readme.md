# RealTime Chat App

A full-stack real-time chat application built with React, Vite, Zustand, DaisyUI, Express, MongoDB, Socket.IO, and Cloudinary.

---

## Features

- Real-time messaging with Socket.IO
- User authentication (signup, login, logout)
- Profile management with avatar upload (Cloudinary)
- Theme switching (DaisyUI themes)
- Responsive UI with Tailwind CSS and DaisyUI
- User presence (online/offline status)

---

## Project Structure

```
chat-app/
├── backend/
│   ├── src/
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   └── package.json
├── package.json
└── README.md
```

---

## Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account

---

## Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
MONGO_URL=your_mongodb_connection_string
PORT=5001
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## Setup Instructions

### 1. Clone the repository

```sh
git clone https://github.com/your-username/chat-app.git
cd chat-app
```

### 2. Install dependencies

```sh
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Configure environment variables

- Copy the example above into `backend/.env` and fill in your values.

### 4. Seed the database (optional)

If you want to seed users for testing, run:

```sh
cd backend
node src/seeds/user.seed.js
```

### 5. Start the backend server

```sh
cd backend
npm run dev
```

### 6. Start the frontend development server

```sh
cd frontend
npm run dev
```

- The frontend will run on [http://localhost:5173](http://localhost:5173)
- The backend will run on [http://localhost:5001](http://localhost:5001)

---

## Build for Production

```sh
# Build frontend
cd frontend
npm run build

# Serve with backend (make sure NODE_ENV=production in backend/.env)
cd ../backend
npm start
```

---

## License

MIT

---

## Acknowledgements

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [DaisyUI](https://daisyui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express](https://expressjs.com/)
- [Socket.IO](https://socket.io/)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary](https://cloudinary.com/)