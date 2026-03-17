# Task Canvas

Task Canvas is a full-stack to-do app built for the MB Technologies assessment. It allows users to create tasks with a title and description, shows only the latest 5 incomplete tasks, and hides a task from the list once it is marked as done.

## Tech Stack

- Java 21
- Spring Boot 3
- Maven
- React
- Vite
- Tailwind CSS
- MySQL 8
- Docker
- Docker Compose

## Build And Run

1. Copy `.env.example` to `.env`
```bash
cp .env.example .env
```
2. From the project root, run:

```bash
docker compose up --build
```

3. Open:

- Frontend: `http://localhost:4173`
- Backend: `http://localhost:8080/api/tasks`

If port `3306` is already being used on your machine, change the MySQL port mapping in `docker-compose.yml`, for example:

```yml
ports:
  - "3307:3306"
```

## Tests

Implemented tests:

- Backend unit tests for task creation, listing, completion, and not-found cases
- Backend integration tests using Spring Boot Test and Testcontainers
- Frontend unit tests for form, list, card, loading state, and empty state
- Playwright end-to-end test for the main task flow

Run tests with:

```bash
cd backend
mvn test
```

```bash
cd frontend
npm install
npm test
npx playwright install
npm run test:e2e
```
