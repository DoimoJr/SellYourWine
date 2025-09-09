# 🍷 SellYourWine - Monorepo

Un marketplace moderno per vini italiani costruito con TypeScript, NestJS, React e architettura monorepo.

## 🏗️ Architettura

```
SellYourWine/
├── apps/
│   ├── backend/          # API NestJS + PostgreSQL + Prisma
│   └── frontend/         # React + Vite + Tailwind CSS
├── packages/
│   └── shared/           # Tipi TypeScript condivisi
├── configs/              # Configurazioni condivise
├── .github/workflows/    # CI/CD GitHub Actions
└── [file di configurazione]
```

## 🚀 Stack Tecnologico

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL con Prisma ORM
- **Auth**: JWT con refresh token
- **API**: REST + Swagger documentation
- **Features**: Cart system, multi-vendor orders, password reset

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS + shadcn/ui design system
- **State**: Tanstack Query + Zustand
- **Forms**: React Hook Form + Zod validation
- **Type Safety**: Shared TypeScript types

### DevOps & Tooling
- **Monorepo**: pnpm workspaces + Turborepo
- **CI/CD**: GitHub Actions
- **Containers**: Docker + docker-compose
- **Deploy**: Vercel (frontend) + Railway (backend)
- **Code Quality**: ESLint + Prettier + Husky

## 🛠️ Setup Sviluppo

### Prerequisiti
- Node.js 20+
- pnpm 9+
- PostgreSQL 15+ (o Docker)

### Installazione
```bash
# Clone del repository
git clone <repository-url>
cd SellYourWine

# Installazione dipendenze
pnpm install

# Setup database
cp apps/backend/.env.example apps/backend/.env
# Modifica DATABASE_URL in .env

# Database setup
pnpm db:push
pnpm db:generate

# Build shared package
pnpm build:shared
```

### Comandi Principali

#### Sviluppo
```bash
# Avvia tutto in parallelo
pnpm dev

# Avvia singole applicazioni
pnpm dev:backend    # Backend su http://localhost:3000
pnpm dev:frontend   # Frontend su http://localhost:5173
```

#### Build & Deploy
```bash
# Build completo
pnpm build

# Build singole app
pnpm build:backend
pnpm build:frontend
pnpm build:shared

# Deploy (configurare prima i secrets)
git push origin main  # Trigger deploy automatico
```

#### Database
```bash
# Genera Prisma Client
pnpm db:generate

# Sync schema al database
pnpm db:push

# Crea nuova migrazione
pnpm db:migrate

# Apri Prisma Studio
pnpm db:studio
```

#### Code Quality
```bash
# Lint & format
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:check

# Type checking
pnpm type-check

# Test
pnpm test
```

### Docker Development
```bash
# Avvia stack completo con Docker
docker-compose up -d

# Solo database per sviluppo locale
docker-compose up postgres -d
```

## 📡 API Endpoints

### Autenticazione
- `POST /auth/register` - Registrazione utente
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh token
- `POST /auth/logout` - Logout
- `POST /auth/forgot-password` - Reset password
- `POST /auth/reset-password` - Conferma reset

### Carrello
- `GET /cart` - Ottieni carrello utente
- `POST /cart/items` - Aggiungi al carrello
- `PATCH /cart/items/:id` - Aggiorna quantità
- `DELETE /cart/items/:id` - Rimuovi dal carrello
- `DELETE /cart` - Svuota carrello

### Prodotti & Ordini
- Vedi documentazione Swagger su `/api`

## 🎯 Funzionalità Implementate

### ✅ Backend Complete
- [x] Autenticazione JWT con refresh token
- [x] Sistema password reset sicuro
- [x] Carrello persistente con inventory checking
- [x] Multi-vendor order system
- [x] API documentazione Swagger
- [x] Type-safe DTOs condivisi

### ✅ Frontend Base
- [x] Setup React + Vite + Tailwind
- [x] Design system wine-themed
- [x] Integrazione tipi condivisi
- [x] Responsive layout

### ✅ DevOps & Infrastructure
- [x] Monorepo con pnpm + Turborepo
- [x] Docker containerization
- [x] CI/CD GitHub Actions
- [x] Deploy indipendenti configurati
- [x] Code quality tools

## 🚀 Deploy

### Frontend (Vercel)
```bash
# Auto-deploy su push to main
# Configurare: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID
```

### Backend (Railway/Render)
```bash
# Auto-deploy su push to main
# Configurare: RAILWAY_TOKEN o Render webhook
```

### Environment Variables
```bash
# Backend (.env)
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
JWT_EXPIRES_IN=7d

# Frontend (.env)
VITE_API_URL=https://api.sellyourwine.com
```

## 📚 Sviluppi Futuri

### Frontend da Completare
- [ ] Auth pages (login/register)
- [ ] Product catalog con filtri
- [ ] Shopping cart UI
- [ ] Checkout flow
- [ ] User dashboard
- [ ] Seller dashboard

### Features Avanzate
- [ ] Real-time notifications
- [ ] Advanced search & filtering
- [ ] Payment integration (Stripe)
- [ ] Order tracking
- [ ] Email notifications
- [ ] Mobile app (React Native)

## 🤝 Contribuzione

1. Fork del progetto
2. Crea feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push branch (`git push origin feature/AmazingFeature`)
5. Apri Pull Request

## 📄 Licenza

Distribuito sotto licenza MIT. Vedi `LICENSE` per più informazioni.

## 🏆 Postman Collection

Import la collezione completa da `/postman/SellYourWine-API.postman_collection.json` per testare tutte le API.

---

**Built with ❤️ by SellYourWine Team**