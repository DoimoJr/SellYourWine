# Deploy su Render

## Panoramica

La monorepo è configurata per deploy indipendenti su Render:

- **Backend**: NestJS API con PostgreSQL 
- **Frontend**: React/Vite SPA
- **Shared**: Package condiviso (incluso automaticamente nei build)

## Deploy Backend

1. **Crea nuovo servizio Web su Render**
2. **Collega repository GitHub**
3. **Configura servizio:**
   - **Build Command**: `npm run build:standalone`
   - **Start Command**: `npm run start:prod`
   - **Root Directory**: `apps/backend`
   - **Health Check Path**: `/health`

4. **Variabili ambiente richieste:**
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=[Render genera automaticamente]
   JWT_SECRET=[Render genera automaticamente]
   JWT_EXPIRES_IN=24h
   ```

5. **Database PostgreSQL:**
   - Crea database su Render (piano gratuito)
   - Render collegherà automaticamente `DATABASE_URL`

## Deploy Frontend

1. **Crea nuovo servizio Web su Render**
2. **Configura servizio:**
   - **Build Command**: `npm run build:standalone`
   - **Start Command**: `npm run start`
   - **Root Directory**: `apps/frontend`
   - **Static Publish Path**: `./dist`

3. **Variabili ambiente richieste:**
   ```
   NODE_ENV=production
   VITE_API_URL=https://[nome-backend].onrender.com
   ```

## File di configurazione

- `render-backend.yaml` - Configurazione Infrastructure as Code per backend
- `render-frontend.yaml` - Configurazione Infrastructure as Code per frontend
- `apps/backend/.env.example` - Template variabili backend
- `apps/frontend/.env.example` - Template variabili frontend

## Note importanti

- **Build standalone**: I script `build:standalone` installano tutte le dipendenze del workspace
- **Health check**: Backend espone endpoint `/health` per monitoring Render
- **CORS**: Backend configurato per accettare richieste dal frontend
- **Prisma**: Il database si inizializza automaticamente con `prisma generate`

## Ordine di deploy

1. **Prima il backend** (con database)
2. **Poi il frontend** (usando URL backend in `VITE_API_URL`)

## Monitoraggio

- Backend: `https://[nome-backend].onrender.com/health`
- Swagger: `https://[nome-backend].onrender.com/api`
- Frontend: `https://[nome-frontend].onrender.com`