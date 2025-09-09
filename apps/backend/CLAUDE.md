# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NestJS backend for "SellYourWine" - a wine marketplace application with PostgreSQL database using Prisma ORM. The system supports buyers, sellers, product management, orders, and payments.

## Development Commands

- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production (runs `prisma generate` first)  
- `npm start` - Start production server
- `prisma generate` - Generate Prisma client after schema changes
- `prisma db push` - Push schema changes to database
- `prisma migrate dev` - Create and apply new migration
- `prisma studio` - Open Prisma Studio GUI

## Architecture

### Core Modules
- **AuthModule** - JWT-based authentication with Passport
- **PrismaModule** - Database connection and service
- **ProductsModule** - Wine product catalog management
- **OrdersModule** - Order processing and fulfillment
- **SellersModule** - Seller account management
- **CategoriesModule** - Product categorization
- **AddressesModule** - User shipping/billing addresses
- **InventoryModule** - Stock tracking
- **ProductImagesModule** - Product image management

### Database Schema
Uses PostgreSQL with Prisma ORM. Key entities:
- **User** - Buyers/sellers/admins with role-based access
- **Product** - Wine products with vintage, region, grapes metadata
- **Order** - Multi-seller order support with status tracking
- **OrderItem** - Individual items with per-seller fulfillment
- **Seller** - Seller profiles linked to users
- **Category** - Hierarchical product categories
- **Inventory** - Stock management per product

### Key Features
- Multi-tenant seller marketplace
- JWT authentication with role-based access
- Swagger API documentation at `/api`
- Global validation pipes with DTO transformation
- CORS enabled for frontend integration
- Order status tracking (paid → label_generated → shipped → delivered)

### Configuration
- Environment variables in `.env` (see `.env.example`)
- TypeScript compilation outputs to `dist/`
- Swagger UI available at `http://localhost:3000/api`
- Server runs on port 3000 by default (configurable via PORT env var)

### Code Conventions
- Uses NestJS decorators and dependency injection
- DTOs with class-validator for request validation
- Prisma service injection for database operations
- Module-based organization following NestJS patterns
- Italian comments in some files indicating active development