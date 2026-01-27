# Docker Setup for Timeful App

This guide explains how to run Timeful App using Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose v2.0+

## Quick Start

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Configure required environment variables in `.env`:**
   ```bash
   # Required - Google OAuth credentials
   CLIENT_ID=your-google-client-id
   CLIENT_SECRET=your-google-client-secret

   # Required - Security keys (generate with commands below)
   ENCRYPTION_KEY=$(openssl rand -hex 32)
   SESSION_SECRET=$(openssl rand -base64 32)
   ```

3. **Build and start all services:**
   ```bash
   docker compose up -d --build
   ```

4. **Access the application:**
   - App: http://localhost (or your configured `HOST_PORT`)
   - API: http://localhost/api
   - Swagger Docs: http://localhost/swagger/index.html

## Services

| Service | Description | Internal Port |
|---------|-------------|---------------|
| `nginx` | Reverse proxy | 80, 443 |
| `frontend` | Vue.js SPA | 80 |
| `backend` | Go/Gin API | 3002 |
| `mongodb` | MongoDB database | 27017 |

## Configuration

### Environment Variables

All configuration is done through the `.env` file in the root directory. See `.env.example` for all available options.

**Required variables:**
- `CLIENT_ID` - Google OAuth Client ID
- `CLIENT_SECRET` - Google OAuth Client Secret
- `ENCRYPTION_KEY` - Data encryption key (32-byte hex)
- `SESSION_SECRET` - Session cookie secret (min 32 chars)

**Optional variables:**
- `HOST_PORT` - Port to expose the app (default: 80)
- `HOST_SSL_PORT` - HTTPS port (default: 443)
- `VUE_APP_POSTHOG_API_KEY` - PostHog analytics key

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the following APIs:
   - Google Calendar API
   - Google People API (Contacts)
4. Create OAuth 2.0 credentials (Web Application)
5. Add authorized redirect URIs:
   - `http://localhost/api/auth/google/callback` (development)
   - `https://your-domain.com/api/auth/google/callback` (production)
6. Copy Client ID and Client Secret to `.env`

## Commands

```bash
# Start all services
docker compose up -d

# Build and start (after code changes)
docker compose up -d --build

# View logs
docker compose logs -f

# View logs for specific service
docker compose logs -f backend

# Stop all services
docker compose down

# Stop and remove volumes (WARNING: deletes database)
docker compose down -v

# Restart a specific service
docker compose restart backend

# Check service health
docker compose ps
```

## Development

### Rebuilding Individual Services

```bash
# Rebuild only frontend
docker compose build frontend
docker compose up -d frontend

# Rebuild only backend
docker compose build backend
docker compose up -d backend
```

### Accessing the Database

```bash
# Connect to MongoDB shell
docker compose exec mongodb mongosh schej-it

# Backup database
docker compose exec mongodb mongodump --db=schej-it --out=/data/backup

# Restore database
docker compose exec mongodb mongorestore --db=schej-it /data/backup/schej-it
```

## Production Deployment

### SSL/TLS Configuration

1. Obtain SSL certificates (e.g., via Let's Encrypt/Certbot)

2. Create SSL directory and copy certificates:
   ```bash
   mkdir -p nginx/ssl
   cp /path/to/fullchain.pem nginx/ssl/
   cp /path/to/privkey.pem nginx/ssl/
   ```

3. Uncomment SSL section in `nginx/nginx.conf`

4. Uncomment SSL volume mount in `docker-compose.yml`:
   ```yaml
   volumes:
     - ./nginx/ssl:/etc/nginx/ssl:ro
   ```

5. Update `HOST_PORT=80` and `HOST_SSL_PORT=443` in `.env`

### Using External MongoDB

To use an external MongoDB instance:

1. Remove or comment out the `mongodb` service in `docker-compose.yml`

2. Update the backend environment:
   ```yaml
   environment:
     - MONGODB_URI=mongodb://user:password@your-mongodb-host:27017
   ```

## Troubleshooting

### Backend won't start
- Check logs: `docker compose logs backend`
- Verify all required env vars are set
- Ensure MongoDB is healthy: `docker compose ps`

### Frontend build fails
- Check Node.js dependencies: `docker compose logs frontend`
- Try rebuilding: `docker compose build --no-cache frontend`

### MongoDB connection issues
- Wait for MongoDB health check to pass
- Check MongoDB logs: `docker compose logs mongodb`

### Port conflicts
- Change `HOST_PORT` in `.env` if port 80 is in use
- Check for other services: `sudo lsof -i :80`

## Architecture

```
                    ┌─────────────┐
                    │   Client    │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │    Nginx    │ :80/:443
                    │   (Proxy)   │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ Frontend │    │ Backend  │    │ Swagger  │
    │  (Vue)   │    │  (Go)    │    │   Docs   │
    │   :80    │    │  :3002   │    │          │
    └──────────┘    └────┬─────┘    └──────────┘
                         │
                         ▼
                   ┌──────────┐
                   │ MongoDB  │
                   │  :27017  │
                   └──────────┘
```
