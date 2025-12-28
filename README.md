# MERN Task Manager

A full-stack task management app built using the MERN stack (MongoDB, Express, React, Node.js) with user authentication, CRUD operations, and a responsive UI.

## Features

- **User Authentication** using JWT
- **Manage Tasks**: create, read, update, delete
- **Protected Routes**: only authenticated users can access tasks
- **Form Validation** on frontend and backend
- **Success/Error Notifications** via toasts
- **Responsive Layout** built with Tailwind CSS
- **Global State Management** using Redux
- **Dynamic Document Titles** and navigational redirects
- **Custom Hooks & Middleware** for fetching, auth verification, and route protection

## Tech Stack

- **Frontend**: React, Redux, React Router, Tailwind CSS, Axios, React Toastify
- **Backend**: Node.js, Express, MongoDB, Mongoose, JSON Web Tokens, bcrypt, CORS, dotenv
- **Dev Tools**: nodemon

## Prerequisites

- Node.js (v14 or later)
- MongoDB database (local or cloud)
- A code editor (e.g. VS Code)

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/alcanivorax/MERN-Task-Manager.git
   cd MERN-Task-Manager
   ```

2. Configure Environment:

   ```
   cd backend/
   cp .env.example .env
   ```

3. Set up your .env file

   - Use `openssl rand -hex 64` to generate a key and add it under `JWT_SECRET` in the .env file.
   - Add your mongo_url under `MONGO_URL` in the .env file.

4. Launch the app:

   ```
   # In one terminal
   cd backend
   npm install
   npm run dev

   # In another terminal
   cd frontend
   npm install
   npm run dev
   ```

5. Access the frontend at http://localhost:5173

## API Endpoints

| Method | Endpoint             | Description                | Protected |
| ------ | -------------------- | -------------------------- | --------- |
| POST   | `/api/auth/signup`   | Register a new user        | ❌        |
| POST   | `/api/auth/login`    | Log in user & return token | ❌        |
| GET    | `/api/tasks`         | List all tasks             | ✅        |
| GET    | `/api/tasks/:taskId` | Get task by ID             | ✅        |
| POST   | `/api/tasks`         | Create a new task          | ✅        |
| PUT    | `/api/tasks/:taskId` | Update a task              | ✅        |
| DELETE | `/api/tasks/:taskId` | Remove a task              | ✅        |
<!--| GET    | `/api/profile`       | Retrieve user profile      | ✅        | -->

## App Pages/Routes

- / — Public landing page or dashboard (if authenticated)

- /signup — User registration

- /login — User login

- /tasks/add — Add new task form

- /tasks/:taskId — Edit task page

- \* — 404 page for unspecified routes

## Contributing

1. Fork the repo

2. Create a feature branch (git checkout -b feature/foo)

3. Commit your changes (git commit -am 'Add feature')

4. Push to branch (git push origin feature/foo)

5. Open a pull request

## License

Distributed under the [MIT License](./LICENSE).
