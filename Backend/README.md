# Backend Form Project

A full-stack login/signup demo built with:

- **Express.js** backend API
- **React + Vite** frontend
- JSON request handling for login and signup

## Project Overview

This repository demonstrates a small authentication-style app where the frontend sends credentials to an Express backend.

The backend is the primary focus:

- `server.js` creates an Express server on `http://localhost:5000`
- The backend exposes two API routes:
  - `POST /signup` — receives `username` and `password` in JSON
  - `POST /login` — receives `username` and `password` in JSON
- Each endpoint returns a JSON response with a status message and the submitted username

The frontend in `Frontend/signup-login` is a React app that collects username/password input and sends it to the backend using `fetch()`.

## Backend Details

The backend is intentionally simple so you can focus on API flow and integration.

### Key backend behavior

- Uses `express.json()` middleware to parse incoming JSON bodies
- Implements `POST /signup` and `POST /login` routes
- Logs submitted credentials to the console
- Sends back success messages and status codes

### Example request body

```json
{
  "username": "user123",
  "password": "secret"
}
```

### Example response

```json
{
  "message": "Logged in Successful",
  "user": "user123"
}
```

## Frontend Details

The frontend app lives in `Frontend/signup-login`.

- Uses React for the form UI
- Tracks `username`, `password`, and `action` state
- Sends requests to the backend on submit
- Supports login/signup mode switching

## Running the project

### 1. Start the backend

From the repository root:

```bash
node server.js
```

### 2. Start the frontend

From the `Frontend/signup-login` folder:

```bash
npm install
npm run dev
```

### 3. Use the app

Open the Vite dev URL shown in the terminal, then submit the form.

The frontend will send a request to the backend API at `http://localhost:5000/login` or `/signup`.

## Notes

- If the frontend is served from a different port than the backend, enable CORS in Express.
- This project is ideal for learning API integration with React and Express.
- The backend currently does not store data or handle authentication tokens.

## Recommended next steps

- Add persistent user storage with a database
- Add real validation and password hashing
- Expand the API to return structured error codes
- Implement protected routes and authentication tokens
