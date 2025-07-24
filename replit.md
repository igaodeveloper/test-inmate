# CardEx - Collectible Card Trading Marketplace

## Overview

CardEx is a modern, full-stack web application for trading collectible cards. Built with a React 18 frontend and Express.js backend, it provides a comprehensive platform for card enthusiasts to manage their collections and engage in secure trading.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript (strict mode)
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight SPA navigation
- **State Management**: Zustand for domain-separated global state
- **Styling**: TailwindCSS with shadcn/ui components for modern UI
- **Animations**: Framer Motion for smooth transitions and interactions
- **Forms**: React Hook Form with Zod validation for robust form handling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Connect-pg-simple for PostgreSQL-backed sessions

### Data Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Shared TypeScript schema definitions between frontend and backend
- **Migrations**: Drizzle Kit for database schema management
- **Validation**: Zod schemas for runtime type validation

## Key Components

### Authentication System
- JWT-based authentication with persistent storage
- Zustand store for auth state management
- Protected routes with automatic redirection
- Login/Register forms with validation

### Card Management
- User card collections with CRUD operations
- Card search and filtering capabilities
- Image handling with fallback placeholders
- Categorization by rarity and type

### Trading System
- Create trade offers with multiple cards
- Browse public marketplace of active trades
- Trade status management (open, pending, completed, cancelled)
- User-specific trade history

### UI Components
- Responsive design with mobile-first approach
- Dark/light theme support with system preference detection
- Loading states and skeleton screens
- Toast notifications for user feedback
- Reusable component library based on Radix UI

## Data Flow

### Client-Side State
1. **Auth Store**: User authentication state and token management
2. **Cards Store**: User's card collection and marketplace cards
3. **Trades Store**: Trading functionality and trade history
4. **Theme Store**: UI theme preferences with persistence

### API Communication
1. **Axios Client**: Configured with interceptors for auth and error handling
2. **React Query**: Server state management with caching and background updates
3. **Error Handling**: Centralized error processing with user-friendly messages

### Database Schema
- **Users**: Authentication and profile information
- **Cards**: Master card catalog with metadata
- **UserCards**: User-specific card ownership with condition tracking
- **Trades**: Trade requests with status and description
- **TradeCards**: Many-to-many relationship for cards in trades

## External Dependencies

### Core Libraries
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **State Management**: Zustand with persistence middleware
- **HTTP Client**: Axios with interceptors
- **Database**: Drizzle ORM with Neon Database driver
- **Validation**: Zod for schema validation
- **UI Framework**: Radix UI primitives with TailwindCSS

### Development Tools
- **TypeScript**: Strict type checking with path mapping
- **Vite**: Development server and build tool
- **ESBuild**: Backend bundling for production
- **PostCSS**: CSS processing with Autoprefixer

### External Services
- **Neon Database**: Serverless PostgreSQL hosting
- **External Card API**: Consumes third-party card marketplace API at `https://cards-marketplace-api-2fjj.onrender.com`

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR and React Fast Refresh
- **Backend**: tsx for TypeScript execution with auto-reload
- **Database**: Neon Database with connection pooling

### Production Build
- **Frontend**: Static assets built with Vite and served by Express
- **Backend**: Bundled with ESBuild for Node.js execution
- **Database**: PostgreSQL migrations applied via Drizzle Kit

### Environment Configuration
- **Database URL**: Required environment variable for PostgreSQL connection
- **API Base URL**: Configurable external API endpoint
- **Session Storage**: PostgreSQL-backed session management

### File Structure
```
├── client/          # React frontend application
├── server/          # Express.js backend
├── shared/          # Shared TypeScript schemas and types
├── migrations/      # Database migration files
└── dist/           # Production build output
```

The application follows a clean separation of concerns with shared type definitions ensuring consistency between frontend and backend. The architecture supports scalability through modular design and efficient state management patterns.