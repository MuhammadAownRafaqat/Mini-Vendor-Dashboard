# Mini Vendor Dashboard

A lightweight vendor dashboard for managing services, tracking bookings, and monitoring earnings. Watch this video for more details about this project: https://youtu.be/sP36qoSviHE

## Features

- User authentication (login)
- Add and view services
- Real-time data updates
- Dashboard with stats overview
- Responsive design with dark mode support

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| [React 19](https://react.dev/) | UI library for building the interface |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Vite](https://vite.dev/) | Build tool and dev server |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS styling |
| [ShadCN UI](https://ui.shadcn.com/) | Pre-built UI components (Button, Card, Input, Table) |
| [Lucide React](https://lucide.dev/) | Icon library |

### Backend

| Technology | Purpose |
|------------|---------|
| [Supabase](https://supabase.com/) | Backend-as-a-Service providing authentication and PostgreSQL database |

### Form Handling

| Technology | Purpose |
|------------|---------|
| [React Hook Form](https://react-hook-form.com/) | Form state management |
| [Zod](https://zod.dev/) | Schema validation |

## Project Structure

```
src/
├── components/ui/    # Reusable UI components (ShadCN)
├── lib/              # Utilities and Supabase client
├── pages/            # Application pages (Login, Dashboard)
├── App.tsx           # Main app with auth routing
└── main.tsx          # Entry point
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```
3. Create a `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the development server:
   ```bash
   bun dev
   ```

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server |
| `bun run build` | Build for production |
| `bun run lint` | Run ESLint |
| `bun run preview` | Preview production build |

## Database Schema

The app expects a `services` table in Supabase:

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Reference to auth.users |
| name | text | Service name |
| price | numeric | Service price |
| created_at | timestamp | Auto-generated timestamp |
