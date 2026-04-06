# Docker Setup Walkthrough

I have dockerized your project for development.

## Files Created
- `docker-compose.yml`: The main compose file for development.
- `backend/Dockerfile.dev`: Development Dockerfile for Django backend.
- `frontend/Dockerfile.dev`: Development Dockerfile for React frontend.

## How to Run

1.  Stop any running local servers (Django `runserver`, `npm run dev`).
2.  Run the following command in the project root:
    ```bash
    docker-compose up --build
    ```
3.  Access the application:
    - Frontend: [http://localhost:3000](http://localhost:3000)
    - Backend API: [http://localhost:8000](http://localhost:8000)
    - Database: Exposed on port 5432.

## Notes
- The backend mounts `./backend` to `/app`, so changes to python files will trigger auto-reload.
- The frontend mounts `./frontend/lab_sign_off_fe` to `/app`, so changes to source files will trigger HMR (Hot Module Replacement).
- Database data is persisted in `postgres_data` volume.
- Backend runs migrations automatically on startup.
