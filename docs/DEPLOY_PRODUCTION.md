# Production Deployment Guide

This guide covers the full public deployment flow:

- Backend: Render
- Frontend: Vercel
- Database: MongoDB Atlas

## 1) MongoDB Atlas setup

1. Create a cluster.
2. Create a database user with readWrite permission for your project database.
3. Configure Network Access:
- For easiest start: allow 0.0.0.0/0 (then lock down later).
- For better security: allow only Render egress ranges if available.
4. Copy connection string and replace placeholders:

```text
mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
```

## 2) Deploy backend to Render

### Create service

1. New Web Service -> connect repository.
2. Root directory: backend
3. Runtime: Java

### Build and start

- Build command:

```bash
mvn clean package -DskipTests
```

- Start command:

```bash
java -Dserver.port=$PORT -jar target/deploy-guide-api-0.0.1-SNAPSHOT.jar
```

### Environment variables

Set these in Render:

- MONGODB_URI = <atlas-uri>
- CORS_ALLOWED_ORIGINS = https://<your-vercel-domain>
- SEED_DATA_ENABLED = true (first deploy only)
- SPRING_PROFILES_ACTIVE = prod

After first successful deploy with seeded data:

- Set SEED_DATA_ENABLED = false
- Redeploy once

### Verify backend

- https://<render-domain>/api/v1/health
- https://<render-domain>/api/v1/stacks

## 3) Deploy frontend to Vercel

1. Import the same repository.
2. Root directory: frontend
3. Framework preset: Vite (or use vercel.json)

Environment variable:

- VITE_API_BASE_URL = https://<your-render-domain>/api/v1

Build output:

- dist

Deploy and open the generated Vercel URL.

## 4) End-to-end verification

Run from workspace root:

```powershell
./scripts/verify-deploy.ps1 -BackendBaseUrl "https://<your-render-domain>" -FrontendUrl "https://<your-vercel-domain>"
```

Expected:

- Backend health returns ok
- Stacks endpoint returns count > 0
- Steps endpoint returns count > 0 for at least one stack
- Frontend responds with HTTP 200

## 5) Troubleshooting

### Backend deploy succeeds but API returns 500

Check:

- MONGODB_URI value and credentials
- Atlas network access
- Render logs for Mongo connection errors

### Browser shows CORS errors

Check:

- CORS_ALLOWED_ORIGINS exactly matches your Vercel URL (including https)
- If testing preview deployments, include preview domain

### Frontend loads but no data

Check:

- VITE_API_BASE_URL points to Render backend + /api/v1
- Backend /stacks endpoint works directly in browser

### Render free tier cold starts

Behavior:

- First request can be slow after inactivity.

Mitigation:

- Retry after a few seconds or use a lightweight uptime monitor.
