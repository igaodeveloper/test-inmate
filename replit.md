# CardEx - Collectible Card Trading Marketplace

## Overview

CardEx is a modern, senior-level React 18 + TypeScript single-page application for trading collectible cards. Built following enterprise architecture patterns, it provides a comprehensive marketplace for card enthusiasts to discover, collect, and trade cards with a premium user experience. The application consumes the external API at `https://cards-marketplace-api-2fjj.onrender.com` without requiring a backend implementation.

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
- **Card Marketplace API**: Primary data source at `https://cards-marketplace-api-2fjj.onrender.com`
- **Authentication**: JWT token-based with localStorage persistence
- **Error Handling**: Comprehensive API hibernation and retry logic

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
├── client/src/
│   ├── components/        # Domain-separated UI components
│   │   ├── auth/         # Authentication forms & modals
│   │   ├── cards/        # Card management components
│   │   ├── trades/       # Trading functionality
│   │   ├── layout/       # Navigation, footer, protected routes
│   │   ├── ui/           # Base shadcn/ui components
│   │   └── common/       # Shared utilities (pagination, etc.)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Configuration & utilities
│   ├── pages/            # Route components
│   ├── store/            # Zustand stores by domain
│   └── types/            # TypeScript definitions
├── shared/               # Common schemas & types
├── server/               # Minimal Express setup for dev
└── README.md            # Comprehensive project documentation
```

### Recent Changes (January 2025)
- ✅ Complete implementation of senior-level React 18 + TypeScript SPA
- ✅ JWT authentication with Zustand state management
- ✅ Card management system with search and filtering
- ✅ Trading system with create/view/delete functionality
- ✅ Public marketplace with pagination and responsive design
- ✅ Dark/light mode toggle with persistence
- ✅ Framer Motion animations throughout the application
- ✅ Accessibility improvements with proper ARIA labels
- ✅ Comprehensive error handling and loading states
- ✅ Complete README documentation with deployment instructions

The application successfully meets all challenge requirements with enterprise-level code quality, modern UI/UX design, and comprehensive functionality for a trading card marketplace.