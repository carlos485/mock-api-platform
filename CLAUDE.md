# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Mock API Platform built with Astro 5.x, Tailwind CSS 4.x (with DaisyUI), and Firebase. The project uses pnpm as its package manager.

## Development Commands

All commands run from the root directory:

- `pnpm install` - Install dependencies
- `pnpm dev` - Start dev server at `localhost:4321`
- `pnpm build` - Build production site to `./dist/`
- `pnpm preview` - Preview production build locally
- `pnpm astro ...` - Run Astro CLI commands (e.g., `pnpm astro check` for type checking)

## Architecture

### Framework & Styling
- **Astro 5.x**: SSG/SSR framework with `.astro` component format
- **Tailwind CSS 4.x**: Integrated via Vite plugin in [astro.config.mjs](astro.config.mjs)
  - Content paths configured in [tailwind.config.mjs](tailwind.config.mjs) for all Astro components
- **DaisyUI**: Component library plugin configured in Tailwind
- **TypeScript**: Strict mode enabled with path alias `@/*` → `./src/*`

### API Layer (Hono)
- **Hono**: Lightweight web framework handling mock API endpoints
- **API Routes**: Located in `src/pages/api/` using Astro's file-based routing
- **CORS Configuration**:
  - Origin: `*` (public access)
  - Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
  - Headers: Content-Type, Authorization
- **Integration**: Hono app integrated via catch-all route `[...path].ts` using Astro's `APIRoute`

### Firebase Integration
The project includes both client (`firebase`) and admin (`firebase-admin`) SDKs, indicating server-side and client-side Firebase functionality.

### Project Structure
- `src/pages/` - File-based routing (Astro convention)
  - `src/pages/api/` - API endpoints using Hono
- `src/layouts/` - Page layout components (e.g., [Layout.astro](src/layouts/Layout.astro))
- `src/components/` - Reusable Astro components
- `src/assets/` - Static assets imported in components
- `public/` - Static files served as-is

### Astro Component Pattern
Astro components use a frontmatter section (between `---`) for imports and logic, followed by HTML template. Components can import and use other Astro components, and reference assets via imports (returning URLs).

## Key Technical Details

- **Package Manager**: pnpm (use pnpm, not npm/yarn)
- **TypeScript Config**:
  - Extends Astro's strict preset with `strict: true`
  - Path alias: `@/*` maps to `./src/*`
  - Types: `astro/client` configured
- **Build Output**: `./dist/` directory (excluded from TypeScript compilation)
- **Styling**: Tailwind configured via Vite plugin, not PostCSS
- **API Access**: All API routes available at `/api/*` endpoint

## Code Quality Standards

### TypeScript Best Practices
- **Strict Typing**: Always use explicit types, avoid `any`
- **Type Definitions**: Create interfaces/types in `@/types/` for domain models
- **Type Guards**: Implement runtime type validation for API responses and user inputs
- **Generics**: Use generics for reusable utilities and components
- **Const Assertions**: Use `as const` for literal types and immutable data structures

### Architecture Principles
- **Separation of Concerns**: Keep business logic separate from presentation
  - API logic in `src/lib/api/`
  - Business logic in `src/lib/services/`
  - UI components in `src/components/`
  - Utilities in `src/lib/utils/`
- **Single Responsibility**: Each module/function should have one clear purpose
- **Dependency Injection**: Pass dependencies explicitly, avoid global state
- **Layered Architecture**:
  - Presentation Layer: Astro components and pages
  - Application Layer: Business logic and services
  - Data Layer: Firebase integration and API calls

### Clean Code Guidelines
- **Naming Conventions**:
  - Components: PascalCase (e.g., `UserProfile.astro`)
  - Functions/variables: camelCase (e.g., `getUserById`)
  - Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
  - Types/Interfaces: PascalCase with descriptive names (e.g., `UserResponse`)
- **Function Design**:
  - Keep functions small and focused (ideally < 20 lines)
  - Use descriptive names that explain intent
  - Limit parameters (max 3-4, use objects for more)
  - Avoid side effects in pure functions
- **Error Handling**:
  - Use try-catch for async operations
  - Create custom error types for domain-specific errors
  - Always handle errors at API boundaries
  - Log errors with context for debugging
- **Code Organization**:
  - Group related functionality in modules
  - Use barrel exports (`index.ts`) for public APIs
  - Keep files focused (< 200 lines when possible)

### API Development Standards
- **RESTful Design**: Follow REST conventions for endpoints
- **Response Structure**: Consistent JSON response format:
  ```typescript
  { data: T, error?: string, success: boolean }
  ```
- **Status Codes**: Use appropriate HTTP status codes (200, 201, 400, 404, 500)
- **Validation**: Validate inputs at API boundaries using Zod or similar
- **Error Messages**: Return descriptive, user-friendly error messages
- **Versioning**: Consider API versioning (`/api/v1/`) for breaking changes

### Testing Considerations
- Write testable code by avoiding tight coupling
- Mock external dependencies (Firebase, APIs)
- Test edge cases and error scenarios
- Use descriptive test names that explain behavior

### Performance Best Practices
- **Code Splitting**: Leverage Astro's island architecture for interactive components
- **Lazy Loading**: Load heavy components/data only when needed
- **Caching**: Implement appropriate caching strategies for API responses
- **Bundle Size**: Monitor and minimize bundle size, avoid unnecessary dependencies
- **Image Optimization**: Use Astro's image optimization features

### Security Practices
- **Input Validation**: Sanitize and validate all user inputs
- **Environment Variables**: Never commit secrets, use `.env` files
- **Authentication**: Implement proper authentication/authorization with Firebase
- **CORS**: CORS is currently open (`*`) for development; restrict in production
- **XSS Prevention**: Sanitize rendered user content

### Firebase Integration Guidelines
- **Client vs Admin SDK**: Use client SDK for browser, admin SDK for server routes
- **Security Rules**: Implement proper Firestore/Storage security rules
- **Data Modeling**: Design efficient Firestore collections with proper indexing
- **Error Handling**: Handle Firebase errors gracefully with user-friendly messages
