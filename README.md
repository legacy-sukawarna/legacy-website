# Legacy Website

A Next.js frontend application for community management, providing a modern dashboard for user management, connect groups, attendance tracking, blogging, and more.

## Features

- **Authentication**: Supabase Auth with Google Sign-In
- **Dashboard**: Admin panel with analytics and charts
- **User Management**: CRUD operations with role-based views
- **Connect Groups**: Group management with mentor-mentee relationships
- **Attendance Tracking**: Record and report connect group attendance
- **Blog System**: Package-based blog with rich text editor (Tiptap)
- **Public Pages**: Blog, sermons, yearly verse
- **Dark/Light Mode**: Theme toggle with next-themes
- **Responsive Design**: Mobile-friendly UI

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5+
- **Authentication**: Supabase Auth (SSR)
- **State Management**: Zustand
- **Data Fetching**: React Query (@tanstack/react-query)
- **UI Components**: Radix UI + Shadcn/ui
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **Rich Text Editor**: Tiptap
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Database Types**: Prisma (for type generation)

## Project Structure

```
app/
├── (auth)/                  # Auth routes
│   ├── auth/callback/       # OAuth callback
│   ├── auth/confirm/        # Email confirmation
│   └── login/               # Login page
├── dashboard/               # Protected dashboard
│   ├── blog/                # Blog management
│   │   ├── packages/        # Package management
│   │   └── posts/           # Post management
│   ├── connect/             # Connect group management
│   ├── connect-attendance/  # Attendance tracking
│   ├── report/              # Reports
│   └── user-management/     # User CRUD
├── blog/                    # Public blog
├── sermons/                 # Sermons page
├── yearly-verse/            # Yearly verse page
└── page.tsx                 # Landing page

components/
├── dashboard/               # Dashboard components
│   ├── blog/                # Blog editor components
│   ├── chart/               # Chart components
│   ├── connect/             # Connect group components
│   ├── connect-attendance/  # Attendance components
│   └── users-management/    # User management components
└── ui/                      # Shadcn UI components

hooks/                       # React Query hooks
├── useAuth.ts               # Auth hooks
├── useBlog.ts               # Blog hooks
├── useConnectAttendance.ts  # Attendance hooks
├── useGroup.ts              # Group hooks
└── useUser.ts               # User hooks

lib/
├── api.ts                   # API client (Axios)
├── supabase/                # Supabase clients
│   ├── client.ts            # Browser client
│   ├── middleware.ts        # Middleware client
│   └── server.ts            # Server client
└── utils.ts                 # Utility functions

store/
└── authStore.ts             # Zustand auth store

types/                       # TypeScript types
├── blog.d.ts
├── common.d.ts
├── connect-absence.d.ts
└── user.d.ts
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- Backend API running (community-core-api)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Generate Prisma types (optional, for type hints)
npx prisma generate
```

### Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# API
NEXT_PUBLIC_API_URL=http://localhost:3001

# Database (for Prisma types)
DATABASE_URL=postgresql://...
```

### Running the Application

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm run start
```

The app will be available at `http://localhost:3000`.

## Development

### Adding UI Components

```bash
# Add Shadcn components
npx shadcn-ui@latest add [component-name]
```

### API Integration Pattern

This project uses a simple, pragmatic approach:

1. **API Client** (`lib/api.ts`) - Centralized HTTP client with endpoint definitions
2. **React Query Hooks** (`hooks/use*.ts`) - Data fetching and cache management

```typescript
// Example: Using a hook in a component
import { useUsers, useCreateUser } from "@/hooks/useUser";

function UserList() {
  const { data, isLoading } = useUsers({ page: 1, limit: 10 });
  const createUser = useCreateUser();
  
  // Cache invalidation is handled automatically in hooks
  const handleCreate = () => {
    createUser.mutate({ name: "John", email: "john@example.com" });
  };
}
```

### Commit Guidelines

This project uses [Conventional Commits](https://www.conventionalcommits.org/).

```bash
# Interactive commit (recommended)
npm run commit

# Manual commit
git commit -m "feat: add new feature"
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation
- `perf`: Performance improvement
- `test`: Tests
- `build`: Build changes
- `chore`: Other changes

### Creating Releases

```bash
# Patch (1.0.0 → 1.0.1)
npm run release

# Minor (1.0.0 → 1.1.0)
npm run release:minor

# Major (1.0.0 → 2.0.0)
npm run release:major
```

## Supabase Configuration

### Email Templates

Update email templates in Supabase dashboard to use the correct confirmation endpoint:

#### Confirm Signup

```html
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your user:</p>
<p>
  <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">
    Confirm your email
  </a>
</p>
```

#### Reset Password

```html
<h2>Reset Password</h2>
<p>Follow this link to reset the password for your user:</p>
<p>
  <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/password-reset">
    Reset Password
  </a>
</p>
```

#### Magic Link

```html
<h2>Magic Link</h2>
<p>Follow this link to login:</p>
<p>
  <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=magiclink">
    Log In
  </a>
</p>
```

#### Change Email

```html
<h2>Confirm Change of Email</h2>
<p>Follow this link to confirm the update of your email:</p>
<p>
  <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email_change">
    Change Email
  </a>
</p>
```

## Pages Overview

### Public Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Login with Google |
| `/blog` | Blog listing |
| `/blog/[package]/[post]` | Blog post |
| `/sermons` | Sermons page |
| `/yearly-verse` | Yearly verse display |

### Dashboard Pages (Protected)

| Route | Description | Roles |
|-------|-------------|-------|
| `/dashboard` | Dashboard home | All authenticated |
| `/dashboard/user-management` | User CRUD | ADMIN |
| `/dashboard/connect` | Connect groups | ADMIN, MENTOR |
| `/dashboard/connect-attendance` | Attendance | ADMIN, MENTOR |
| `/dashboard/report` | Reports | ADMIN, MENTOR |
| `/dashboard/blog/packages` | Blog packages | ADMIN |
| `/dashboard/blog/posts` | Blog posts | ADMIN, WRITER |

## Related Projects

- **community-core-api** - Backend API (NestJS)

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [AGENTS.md](./AGENTS.md) - Detailed development guidelines for AI assistants

## License

[MIT](LICENSE)
