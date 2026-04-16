# Deployment Learning App (MVP)

This project is a simple fullstack app for learning deployment:

- Frontend: React SPA (deploy to Vercel)
- Backend: Spring Boot API (deploy to Render)
- Database: MongoDB Atlas

Architecture flow:

React -> Spring Boot API -> MongoDB Atlas

## Project Structure

- frontend: React single-page documentation UI
- backend: Spring Boot API with MongoDB

## Backend API

Base URL:

- /api/v1

Endpoints:

- GET /api/v1/stacks
- GET /api/v1/steps?stackId=<stack-id>
- GET /api/v1/health

Example response for stacks:

```json
[
	{
		"id": "66123...",
		"key": "react-springboot",
		"name": "React + Spring Boot",
		"description": "Deploy React on Vercel, Spring Boot on Render, MongoDB Atlas as cloud DB.",
		"order": 1
	}
]
```

Example response for steps:

```json
[
	{
		"id": "66124...",
		"stackId": "66123...",
		"order": 1,
		"title": "Create Spring Boot backend",
		"description": "Generate a Spring Boot app with Web and MongoDB dependencies.",
		"commands": ["mvn -v", "mvn spring-boot:run"],
		"imagePath": "/images/backend-setup.svg"
	}
]
```

## Local Run

Detailed step-by-step local setup is available at docs/LOCAL_RUN.md.

Production deployment walkthrough is available at docs/DEPLOY_PRODUCTION.md.

### 1. Start Backend

Requirements:

- Java 17+
- Maven 3.9+
- MongoDB URI (Atlas or local)

Commands:

```bash
cd backend
mvn spring-boot:run
```

Optional environment variables:

- MONGODB_URI (default: mongodb://localhost:27017/deploy_guide)
- CORS_ALLOWED_ORIGINS (comma-separated, default includes localhost:5173 and localhost:3000)
- SEED_DATA_ENABLED (default: true)

### 2. Start Frontend

Requirements:

- Node 18+

Commands:

```bash
cd frontend
npm install
npm run dev
```

Set API URL (optional):

```bash
cp .env.example .env
```

Default:

- VITE_API_BASE_URL=http://localhost:8080/api/v1

## Deployment Guide

### 0. Push source code to remote Git repository

If your local repo does not have a remote yet, add one first:

```bash
git remote add origin <your-git-repo-url>
git push -u origin main
```

If remote already exists:

```bash
git push
```

### 1. MongoDB Atlas

1. Create Atlas cluster.
2. Create database user with readWrite on target database.
3. Add network access for your backend runtime.
4. Copy connection string:

```text
mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
```

### 2. Deploy Backend to Render

1. Create a new Web Service from the backend folder.
2. Build command:

```bash
mvn clean package -DskipTests
```

3. Start command:

```bash
java -Dserver.port=$PORT -jar target/deploy-guide-api-0.0.1-SNAPSHOT.jar
```

4. Add environment variables:

- MONGODB_URI=<atlas-uri>
- CORS_ALLOWED_ORIGINS=https://<your-vercel-domain>,https://*.vercel.app
- SEED_DATA_ENABLED=true (only first deploy, then set false)

5. Verify:

- https://<render-domain>/api/v1/health
- https://<render-domain>/api/v1/stacks

### 3. Deploy Frontend to Vercel

1. Import frontend folder in Vercel.
2. Set environment variable:

- VITE_API_BASE_URL=https://<your-render-domain>/api/v1

3. Build command: npm run build
4. Output directory: dist

### 4. End-to-End Check

1. Open Vercel URL.
2. Confirm stack list appears.
3. Click steps from left panel.
4. Use Previous/Next buttons.
5. Click Copy command buttons.
6. Confirm images render from /public/images.

Optional automated check from workspace root:

```powershell
./scripts/verify-deploy.ps1 -BackendBaseUrl "https://<your-render-domain>" -FrontendUrl "https://<your-vercel-domain>"
```

## Notes

- This MVP is intentionally simple: no auth, no admin UI.
- Seed data runs once if database is empty.
- Initial seed includes 2 stacks: React + Spring Boot (main) and React + Node.js (optional).
- Backend env sample is provided in backend/.env.example.
- Frontend deploy config for Vercel is provided in frontend/vercel.json.

