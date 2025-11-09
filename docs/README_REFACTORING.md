# Hooks Refactoring - SOLID Principles (Pragmatic Approach)

## Overview

The hooks have been refactored to follow SOLID principles while avoiding unnecessary abstractions. This provides better separation of concerns, maintainability, and testability without the overhead of a full service layer.

## Philosophy

**Backend handles business logic, frontend handles presentation logic.**

Since the backend already has a proper service layer with business logic, the frontend doesn't need to duplicate this pattern. The frontend's responsibility is to:

1. Make HTTP requests to the backend
2. Manage client-side state (caching, invalidation)
3. Handle UI interactions

## Changes Made

### **Separation of Concerns**

Previously, `useApi.ts` mixed multiple responsibilities. Now we have:

- **`lib/api.ts`** - HTTP client + endpoint definitions (simple, functional)
- **`hooks/useUser.ts`** - User-related React Query hooks + cache management
- **`hooks/useGroup.ts`** - Group-related React Query hooks + cache management

### **SOLID Principles Applied (Pragmatically)**

#### ✅ **Single Responsibility Principle**

- `lib/api.ts` → HTTP communication & endpoint organization
- `hooks/useUser.ts` → User state management & React Query logic
- `hooks/useGroup.ts` → Group state management & React Query logic

#### ✅ **Open/Closed Principle**

Query keys are hierarchical for easy extension:

```typescript
export const userQueryKeys = {
  all: ["users"] as const,
  lists: () => [...userQueryKeys.all, "list"] as const,
  list: (params) => [...userQueryKeys.lists(), params] as const,
  details: () => [...userQueryKeys.all, "detail"] as const,
  detail: (id) => [...userQueryKeys.details(), id] as const,
};
```

#### ✅ **Don't Repeat Yourself (DRY)**

Authentication headers are centralized, not repeated in every API call.

#### ✅ **Interface Segregation**

Each hook serves one specific purpose - no god hooks that do everything.

## New Architecture (Simplified)

```
┌─────────────────────────────────────────────────────────────┐
│                      Components/Pages                        │
│                  (User Management Page)                      │
└───────────────────┬─────────────────────────────────────────┘
                    │ uses hooks
                    ↓
┌─────────────────────────────────────────────────────────────┐
│                    React Query Hooks                         │
│              (useUser.ts, useGroup.ts)                       │
│  • Query key management                                      │
│  • Cache invalidation logic                                  │
│  • React Query configuration                                 │
└───────────────────┬─────────────────────────────────────────┘
                    │ calls API
                    ↓
┌─────────────────────────────────────────────────────────────┐
│                    API Layer (lib/api.ts)                    │
│  • Generic HTTP methods (GET, POST, PUT, DELETE)             │
│  • Authentication header injection                           │
│  • Endpoint definitions (users, groups)                      │
│  • Request/response handling                                 │
└───────────────────┬─────────────────────────────────────────┘
                    │ HTTP requests
                    ↓
┌─────────────────────────────────────────────────────────────┐
│                    Backend API (NestJS)                      │
│  • Business logic (in services)                              │
│  • Data validation                                           │
│  • Database operations                                       │
└─────────────────────────────────────────────────────────────┘
```

**Why this is better:**

- ✅ No redundant service layer on frontend
- ✅ Backend handles business logic (as it should)
- ✅ Frontend focuses on presentation and state management
- ✅ Less boilerplate, easier to maintain
- ✅ Still follows SOLID principles where it matters

## Benefits

### 1. **Simplicity**

- No unnecessary abstractions
- Easy to understand the data flow
- Less code to maintain

### 2. **Testability**

- Mock `api` object when testing hooks
- Mock hooks when testing components
- Clear boundaries between layers

### 3. **Maintainability**

- API changes only require updates to `lib/api.ts`
- Query logic centralized in hooks
- Auth headers managed in one place

### 4. **Type Safety**

- Strong typing throughout
- TypeScript infers types from API definitions
- Compile-time error detection

### 5. **Scalability**

Adding a new resource is straightforward:

1. Add endpoint definitions to `lib/api.ts`
2. Create hooks file following existing pattern
3. Use in components

## Migration Guide

### Before (Monolithic Pattern)

```typescript
// Everything in one file
import { useUsers, useGroups, useCreateUser } from "@/hooks/useApi";

const { data: users } = useUsers({ page: 1, limit: 10 });
const { data: groups } = useGroups();
const createUser = useCreateUser();
```

### After (Organized Pattern)

```typescript
// Separated by resource
import { useUsers, useCreateUser } from "@/hooks/useUser";
import { useGroups } from "@/hooks/useGroup";

const { data: users } = useUsers({ page: 1, limit: 10 });
const { data: groups } = useGroups();
const createUser = useCreateUser();
```

The hook interfaces remain the same, only import paths change!

## Adding New Resources

### Step 1: Add to API (lib/api.ts)

```typescript
export const api = {
  // ... existing endpoints

  // Add new resource endpoints
  resources: {
    getAll: () => api.get<Resource[]>("/resources"),
    getById: (id: string) => api.get<Resource>(`/resources/${id}`),
    create: (data: Partial<Resource>) => api.post<Resource>("/resources", data),
    update: (id: string, data: Partial<Resource>) =>
      api.put<Resource>(`/resources/${id}`, data),
    delete: (id: string) => api.delete(`/resources/${id}`),
  },
};
```

### Step 2: Create Hooks (hooks/useResource.ts)

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export const resourceQueryKeys = {
  all: ["resources"] as const,
  lists: () => [...resourceQueryKeys.all, "list"] as const,
  list: () => [...resourceQueryKeys.lists()] as const,
  details: () => [...resourceQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...resourceQueryKeys.details(), id] as const,
};

export function useResources() {
  const { session } = useAuthStore();

  return useQuery({
    queryKey: resourceQueryKeys.list(),
    queryFn: () => api.resources.getAll(),
    enabled: !!session?.access_token,
  });
}

export function useCreateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.resources.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resourceQueryKeys.lists() });
    },
  });
}
```

### Step 3: Use in Components

```typescript
import { useResources, useCreateResource } from "@/hooks/useResource";

function MyComponent() {
  const { data, isLoading } = useResources();
  const createResource = useCreateResource();

  // Use them...
}
```

That's it! No service layer needed.

## Query Key Best Practices

### Hierarchical Structure

```typescript
export const userQueryKeys = {
  all: ["users"], // matches: ["users"]
  lists: () => [...userQueryKeys.all, "list"], // matches: ["users", "list", ...]
  list: (params) => [...userQueryKeys.lists(), params],
  details: () => [...userQueryKeys.all, "detail"],
  detail: (id) => [...userQueryKeys.details(), id],
};
```

### Cache Invalidation Strategies

```typescript
// Invalidate everything
queryClient.invalidateQueries({ queryKey: userQueryKeys.all });

// Invalidate only lists (all pages, all params)
queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });

// Invalidate specific list with params
queryClient.invalidateQueries({
  queryKey: userQueryKeys.list({ page: 1, limit: 10 }),
});

// Invalidate specific detail
queryClient.invalidateQueries({
  queryKey: userQueryKeys.detail("user-id"),
});
```

## Key Insight: Frontend vs Backend Services

### ❌ **What NOT to do:**

Don't create a service layer on the frontend that just wraps API calls. That's what the backend is for!

```typescript
// DON'T: Unnecessary abstraction
class UserService {
  async getAll() {
    return apiClient.get("/users"); // Just proxying...
  }
}
```

### ✅ **What TO do:**

Define your API endpoints in one place and call them directly from hooks.

```typescript
// DO: Simple and direct
export const api = {
  users: {
    getAll: (params) => api.get("/users", { params }),
    create: (data) => api.post("/users", data),
  },
};
```

**Remember:** Business logic lives in the backend. The frontend's job is to consume that API and manage UI state.

---

## Files Created/Modified

✅ Created:

- `lib/api.ts` (unified API client + endpoints)
- `README_REFACTORING.md` (this documentation)

✅ Modified:

- `hooks/useUser.ts` (React Query hooks for users)
- `hooks/useGroup.ts` (React Query hooks for groups)
- `app/dashboard/user-management/page.tsx` (updated imports)
- `types/common.d.ts` (added `PaginatedResponse`)

✅ Deleted:

- `hooks/useApi.ts` (split into organized hooks)
- `services/` directory (unnecessary layer removed)

---

## Additional Resources

- [React Query Best Practices](https://tkdodo.eu/blog/effective-react-query-keys)
- [SOLID Principles in TypeScript](https://medium.com/backticks-tildes/the-s-o-l-i-d-principles-in-pictures-b34ce2f1e898)
- [Why Backend Services != Frontend Services](https://kentcdodds.com/blog/aha-programming)

---

**Last Updated**: 2025-11-09
**Migration Status**: Complete ✅
