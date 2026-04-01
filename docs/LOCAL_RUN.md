# Local Run Guide

This guide helps you run the full project locally:

- Backend: Spring Boot API
- Frontend: React app (Vite)
- Database: MongoDB Atlas or local MongoDB

## 1) Prerequisites

### Required versions

- Java 25
- Maven 3.9+
- Node.js 18+
- npm 9+

### Verify tools

```bash
java -version
mvn -v
node -v
npm -v
```

## 2) Configure environment

### Backend env

Backend reads env vars directly from your system or terminal session.

Main variables:

- MONGODB_URI
- CORS_ALLOWED_ORIGINS
- SEED_DATA_ENABLED
- PORT

Example for PowerShell:

```powershell
$env:MONGODB_URI="mongodb://localhost:27017/deploy_guide"
$env:CORS_ALLOWED_ORIGINS="http://localhost:5173,http://localhost:5174,http://localhost:3000"
$env:SEED_DATA_ENABLED="true"
$env:PORT="8080"
```

If using MongoDB Atlas, set:

```text
mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
```

### Frontend env

Create frontend env file from template:

```bash
cd frontend
cp .env.example .env
```

On Windows PowerShell (without cp alias), use:

```powershell
Copy-Item .env.example .env
```

Default value in .env:

```text
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

## 3) Start backend

In terminal #1:

```bash
cd backend
mvn spring-boot:run
```

Expected:

- Server starts on http://localhost:8080
- Health endpoint works: http://localhost:8080/api/v1/health

## 4) Start frontend

In terminal #2:

```bash
cd frontend
npm install
npm run dev
```

Expected:

- Vite starts on http://localhost:5173 (or next free port, for example http://localhost:5174)
- UI shows stack selector and step list

## 5) Quick API checks

Use browser or curl:

```bash
curl http://localhost:8080/api/v1/stacks
curl "http://localhost:8080/api/v1/steps?stackId=<stack-id>"
```

PowerShell alternative:

```powershell
Invoke-RestMethod http://localhost:8080/api/v1/stacks
```

## 6) End-to-end local validation

1. Open http://localhost:5173
2. Choose a stack from selector
3. Click steps in left panel
4. Use Previous and Next buttons
5. Click Copy in command blocks
6. Confirm images load in step details

## 7) Common local issues

### mvn command not found

Cause:

- Maven not installed or not in PATH.

Fix:

1. Install Maven 3.9+
2. Add Maven bin folder to PATH
3. Open a new terminal and run mvn -v again

### CORS error in browser

Cause:

- Frontend origin not included in backend CORS_ALLOWED_ORIGINS.

Fix:

- Ensure CORS_ALLOWED_ORIGINS includes frontend origin (http://localhost:5173 and/or http://localhost:5174)

### Frontend cannot reach API

Cause:

- Wrong VITE_API_BASE_URL or backend is not running.

Fix:

1. Check backend health endpoint
2. Check frontend .env value
3. Restart frontend after changing .env

### Empty steps data

Cause:

- Seed data disabled or DB already has different data.

Fix:

1. Set SEED_DATA_ENABLED=true for first run
2. Verify data in MongoDB

## 8) Optional: local deployment-style check

After backend is up:

```powershell
./scripts/verify-deploy.ps1 -BackendBaseUrl "http://localhost:8080" -FrontendUrl "http://localhost:5173"
```
