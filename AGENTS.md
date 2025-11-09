# AGENTS.md - AI Assistant Guide

This document provides comprehensive guidance for AI assistants working with this monorepo containing a community management system.

## Repository Overview

This is a monorepo containing two interconnected applications:

1. **legacy-website** - Next.js frontend application for community management
2. **community-core-api** - NestJS backend API providing business logic and data services

### Project Purpose

A community management system for church/religious organizations featuring:

- User management with role-based access control (MEMBER, ADMIN, MENTOR)
- Connect group management (small groups with mentors and mentees)
- Attendance tracking for events and connect groups
- Dashboard with analytics and charts
- User attributes tracking (baptism status, commitment level, training completion)

---

## Architecture

### Frontend (legacy-website)

- **Framework**: Next.js 14+ with App Router
- **Authentication**: Supabase Auth with Google Sign-In
- **State Management**: Zustand (global auth state)
- **Data Fetching**: React Query (@tanstack/react-query)
- **UI Components**: Radix UI + Shadcn/ui
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Database ORM**: Prisma (for type generation)
- **HTTP Client**: Axios with custom interceptors

### Backend (community-core-api)

- **Framework**: NestJS
- **Authentication**: JWT via Supabase
- **Database ORM**: Prisma with PostgreSQL
- **API Documentation**: Swagger/OpenAPI
- **Error Tracking**: Sentry
- **Scheduling**: @nestjs/schedule
- **Package Manager**: pnpm

---

## Key Patterns & Conventions

### 1. API Integration Pattern (Frontend) - PRAGMATIC APPROACH

**Philosophy**: Backend handles business logic, frontend handles presentation logic.

The frontend uses a **simple, layered approach**:

#### Layer 1: API Client (`lib/api.ts`)

```typescript
// Simple HTTP client with endpoint definitions
export const api = {
  // Generic HTTP methods
  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axios.get(`${API_URL}${endpoint}`, {
      ...config,
      headers: { ...getAuthHeaders(), ...config?.headers },
    });
    return response.data;
  },

  // Resource-specific endpoints
  users: {
    getAll: (params) => api.get<PaginatedResponse<User>>("/users", { params }),
    create: (data) => api.post<User>("/users", data),
  },
};
```

#### Layer 2: React Query Hooks (`hooks/useUser.ts`, `hooks/useGroup.ts`)

```typescript
// Use ES6 arrow functions
export const useUsers = (params: {
  page: number;
  limit: number;
  search?: string;
}) => {
  const { session } = useAuthStore();

  return useQuery({
    queryKey: ["users", "list", params], // Inline query keys - simple!
    queryFn: () => api.users.getAll(params),
    enabled: !!session?.access_token,
    staleTime: 30000,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.users.create,
    onSuccess: () => {
      // Cache invalidation happens in hooks, not components
      queryClient.invalidateQueries({ queryKey: ["users", "list"] });
    },
  });
};
```

**Critical Rules**:

✅ **DO**:

- Use inline query keys: `["users", "list", params]`
- Handle cache invalidation in hooks' `onSuccess` callbacks
- Use ES6 arrow functions: `export const useUsers = () => {}`
- Keep API client simple - just HTTP calls and endpoint organization
- Let components call hooks without worrying about cache management

❌ **DON'T**:

- Create a service layer on frontend (backend already has it!)
- Export complex query key objects unless shared across files
- Manually invalidate queries in components (use hooks' `onSuccess`)
- Use traditional `function` syntax - prefer arrow functions
- Create class-based services that just proxy API calls

**Key Points**:

- All API calls use Axios with centralized auth headers
- React Query manages caching and invalidation
- Auth tokens retrieved from Zustand store
- Mutations automatically invalidate related queries in hooks
- Components stay clean and focused on UI logic

### 2. Authentication Flow

**Frontend**:

- Supabase SSR for cookie-based auth
- Middleware checks session on all routes
- Auth state stored in Zustand (`store/authStore.ts`)
- Protected routes redirect via middleware

**Backend**:

- JWT validation via Supabase
- Role-based guards using `@Roles()` decorator
- Guards check user role from JWT claims

### 3. Component Organization

- **Page components**: In `app/` directory (Next.js App Router)
- **Feature components**: In `components/dashboard/[feature]/`
- **Shared UI**: In `components/ui/` (Shadcn components)
- **Layouts**: Co-located with pages (`layout.tsx`)
- **Hooks**: Organized by resource in `hooks/use[Resource].ts`
- **API Layer**: Centralized in `lib/api.ts`

### 3a. File Structure Best Practices

```
lib/
  ├── api.ts                 # API client + all endpoint definitions

hooks/
  ├── useUser.ts             # User-specific React Query hooks
  ├── useGroup.ts            # Group-specific React Query hooks
  ├── useAuth.ts             # Auth-related hooks
  └── use[Resource].ts       # One file per resource

components/
  └── dashboard/
      ├── users-management/  # Feature-specific components
      └── connect/

types/
  ├── user.d.ts              # User types
  ├── common.d.ts            # Shared types (PaginatedResponse, etc)
  └── [resource].d.ts
```

### 4. Type Safety

- **Frontend**: Types defined in `types/` directory
- **Backend**: Prisma generates types automatically
- **Shared types**: User, Group, Role, Gender enums
- **API responses**: Typed with `PaginatedResponse<T>` pattern

### 5. Database Schema (Prisma)

Key models:

- **User**: Core user entity with roles, attributes, group membership
- **Group**: Connect groups with mentor-mentee relationships
- **ConnectAttendance**: Attendance records for group meetings
- **EventAttendance**: Attendance for special events

Relationships:

- User → Group (many-to-one via `group_id`)
- User → Group (one-to-many as mentor via `mentor_id`)
- Group → ConnectAttendance (one-to-many)

---

## Common Tasks

### Adding a New Feature

#### Frontend:

1. **Add API endpoints** to `lib/api.ts`:

   ```typescript
   export const api = {
     // ... existing
     newResource: {
       getAll: () => api.get("/new-resource"),
       create: (data) => api.post("/new-resource", data),
     },
   };
   ```

2. **Create hooks** in `hooks/useNewResource.ts`:

   ```typescript
   export const useNewResources = () => {
     const { session } = useAuthStore();
     return useQuery({
       queryKey: ["new-resources", "list"],
       queryFn: () => api.newResource.getAll(),
       enabled: !!session?.access_token,
     });
   };

   export const useCreateNewResource = () => {
     const queryClient = useQueryClient();
     return useMutation({
       mutationFn: api.newResource.create,
       onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["new-resources", "list"] });
       },
     });
   };
   ```

3. **Create page** in `app/dashboard/[feature]/page.tsx`
4. **Create components** in `components/dashboard/[feature]/`
5. **Define types** in `types/[feature].d.ts`
6. **Update navigation** in dashboard sidebar/header

#### Backend:

1. Generate module: `nest g module modules/[feature]`
2. Generate controller: `nest g controller modules/[feature]`
3. Generate service: `nest g service modules/[feature]`
4. Add DTOs for validation (use class-validator)
5. Register module in `app.module.ts`
6. Add Swagger decorators for API docs

### Database Changes

#### Frontend:

```bash
# Update Prisma schema
cd /path/to/legacy-website
# Edit prisma/schema.prisma

# Generate Prisma Client (for types)
npx prisma generate
```

#### Backend:

```bash
cd /path/to/community-core-api
# Edit prisma/schema.prisma

# Create migration
npx prisma migrate dev --name descriptive_name

# Apply migration
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

### Adding UI Components

```bash
cd /path/to/legacy-website
# Add a shadcn component
npx shadcn-ui@latest add [component-name]
```

Components are added to `components/ui/` and can be customized.

### Working with Authentication

**Getting current user**:

```typescript
// Frontend - Client component
import { useAuthStore } from '@/store/authStore';
const { session, user } = useAuthStore();

// Frontend - Server component
import { createClient } from '@/utils/supabase/server';
const supabase = createClient();
const { data: { user } } = await supabase.auth.getUser();

// Backend - In controller
@Get()
@Roles('ADMIN')
async getData(@Req() request) {
  const user = request.user; // From JWT
}
```

---

## Environment Variables

### Frontend (.env.local)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# API
NEXT_PUBLIC_API_URL=http://localhost:3001

# Database (for Prisma)
DATABASE_URL=postgresql://...
```

### Backend (.env)

```bash
# Database
DATABASE_URL=postgresql://...

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
SUPABASE_JWT_SECRET=your_jwt_secret

# App
PORT=3001
```

---

## Development Commands

### Frontend (legacy-website)

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npx prisma studio    # Open Prisma database GUI
npx prisma generate  # Generate Prisma Client
```

### Backend (community-core-api)

```bash
pnpm run start:dev   # Start development server with watch mode
pnpm run start:prod  # Start production server
pnpm run build       # Build TypeScript to JavaScript
pnpm run lint        # Run ESLint
pnpm run test        # Run unit tests
pnpm run test:e2e    # Run end-to-end tests
pnpm run seed        # Seed database with initial data
npx prisma studio    # Open Prisma database GUI
```

---

## Important Concepts

### Roles & Permissions

- **MEMBER**: Basic user access, can view own data
- **MENTOR**: Can manage assigned connect group
- **ADMIN**: Full system access, user management

### Connect Groups

- Small groups for community connection
- Each group has one optional mentor
- Multiple mentees per group
- Track attendance per meeting

### User Attributes

Boolean flags tracking spiritual journey:

- `is_committed`: User has made commitment
- `is_baptized`: User is baptized
- `encounter`: Completed encounter program
- `establish`: Completed establish program
- `equip`: Completed equip program
- `kom_100`: Completed KOM 100 training

### Pagination Pattern

API responses use consistent pagination:

```typescript
{
  results: T[],      // or records: T[]
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
```

---

## Code Quality Guidelines

### Frontend

1. **Use TypeScript strictly** - No `any` types
2. **Server vs Client components** - Default to Server Components, use 'use client' only when needed
3. **Error handling** - Use error boundaries and toast notifications
4. **Loading states** - Use Suspense and loading.tsx files
5. **Form validation** - Use Zod schemas with React Hook Form
6. **Styling** - Use Tailwind classes, leverage `cn()` utility for conditional classes
7. **ES6 Arrow Functions** - Use `export const useHook = () => {}` not `export function useHook() {}`
8. **Pragmatic Abstractions** - Avoid over-engineering; keep it simple
9. **Cache Management** - Handle invalidation in hooks, not components
10. **No Frontend Services** - Backend has services; frontend just calls API

### Backend

1. **DTOs for validation** - Use class-validator decorators
2. **Error handling** - Use NestJS exception filters
3. **Logging** - Use LoggingService, not console.log
4. **Swagger docs** - Add @ApiProperty, @ApiOperation decorators
5. **Guards** - Apply @Roles() decorator for protected routes
6. **Database queries** - Use Prisma transactions for multi-step operations

---

## Common Issues & Solutions

### Issue: Authentication fails after deployment

**Solution**: Ensure email templates in Supabase point to correct domain, update redirect URLs in Supabase dashboard

### Issue: CORS errors from API

**Solution**: Check NestJS CORS configuration in `main.ts`, ensure frontend URL is whitelisted

### Issue: Prisma Client out of sync

**Solution**: Run `npx prisma generate` after schema changes

### Issue: React Query not refetching

**Solution**: Check `enabled` condition in useQuery, verify query key structure

### Issue: Module not found errors

**Solution**: Check tsconfig.json path aliases (@/ for frontend, @src/ for backend)

---

## Testing Strategy

### Frontend

- **Unit tests**: Component testing with React Testing Library (to be added)
- **Integration tests**: Test API hooks and data flows
- **E2E tests**: Critical user journeys (auth, CRUD operations)

### Backend

- **Unit tests**: Service layer with mocked dependencies
- **Integration tests**: Controller endpoints with test database
- **E2E tests**: Full API flows in `test/` directory

---

## Deployment

### Frontend

- Platform: Vercel (recommended) or any Node.js host
- Build command: `npm run build`
- Environment variables: Set in hosting platform
- Database: Connect to Supabase PostgreSQL

### Backend

- Platform: Fly.io (configured) or any Docker host
- Build: Uses Dockerfile
- Database migrations: Run before deployment
- Health check: `/health` endpoint

---

## When Working With This Codebase

### Before Making Changes

1. **Read relevant code first** - Use grep/codebase_search to understand existing patterns
2. **Check types** - Review `types/` directory for data structures
3. **Test locally** - Both frontend and backend must run together
4. **Check dependencies** - Frontend calls backend API, ensure both are aligned

### Making Changes

1. **Follow existing patterns** - Match code style and structure
2. **Update types** - Keep TypeScript definitions in sync
3. **Test interactions** - Verify frontend-backend communication
4. **Handle errors** - Add proper error handling and user feedback
5. **Update documentation** - Modify this file if adding major features

### After Changes

1. **Run linters** - Check for TypeScript and ESLint errors
2. **Test manually** - Verify changes in running application
3. **Check console** - Look for errors in browser and server logs
4. **Verify auth** - Test with different user roles if relevant

---

## Resources

### Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [NestJS Docs](https://docs.nestjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [Supabase Docs](https://supabase.com/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [Shadcn/ui](https://ui.shadcn.com)

### Project-Specific

- Frontend README: `/Users/yosuahalim/Documents/Projects/Personal/legacy-website/README.md`
- Backend README: `/Users/yosuahalim/Documents/Projects/Personal/community-core-api/README.md`
- Prisma Schema: `prisma/schema.prisma` (in both projects)

---

## Quick Reference

### File Path Aliases

- `@/` → `legacy-website/` root (frontend)
- `@src/` → `community-core-api/src/` (backend)

### Key Files to Know

- `middleware.ts` - Auth middleware for frontend
- `app.module.ts` - Backend module registration
- `authStore.ts` - Global auth state
- `lib/api.ts` - Centralized API client and endpoints
- `hooks/use*.ts` - React Query hooks per resource
- `role.guard.ts` - Backend role authorization

### Port Configuration

- Frontend: `localhost:3000`
- Backend: `localhost:3001`
- Prisma Studio: `localhost:5555`

---

## Version Information

- Node.js: 20+ (LTS recommended)
- npm/pnpm: Latest stable
- Next.js: Latest (14+)
- NestJS: 10+
- Prisma: 5-6+
- React: 18+
- TypeScript: 5+

---

## Anti-Patterns to Avoid

### ❌ Over-Engineering

**Don't create unnecessary abstractions:**

```typescript
// BAD: Service layer that just proxies API calls
class UserService {
  async getAll() {
    return apiClient.get("/users");
  }
}

// BAD: Complex query key objects for internal use only
export const userQueryKeys = {
  all: ["users"] as const,
  lists: () => [...userQueryKeys.all, "list"] as const,
  list: (params) => [...userQueryKeys.lists(), params] as const,
};

// BAD: Manual cache invalidation in components
const queryClient = useQueryClient();
await createUser(data);
queryClient.invalidateQueries({ queryKey: ["users"] });
```

**Do keep it simple:**

```typescript
// GOOD: Direct API calls in lib/api.ts
export const api = {
  users: {
    getAll: (params) => api.get("/users", { params }),
  },
};

// GOOD: Inline query keys
queryKey: ["users", "list", params];

// GOOD: Cache invalidation in hooks
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.users.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "list"] });
    },
  });
};
```

### Key Principles

1. **KISS (Keep It Simple, Stupid)** - Simple code is maintainable code
2. **YAGNI (You Aren't Gonna Need It)** - Don't add features/abstractions you don't need yet
3. **Separation of Concerns** - Backend = business logic, Frontend = presentation
4. **Pragmatic SOLID** - Apply principles where they add value, not everywhere

---

**Last Updated**: 2025-11-09
**Maintained by**: Development Team
**For Questions**: Refer to README files in each project root
