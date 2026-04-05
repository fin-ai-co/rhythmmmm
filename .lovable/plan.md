
## Phase 1: Database Schema
Create tables for all app data:
- **habits** — name, streak, friction, user_id
- **habit_completions** — daily completion records
- **journal_entries** — content, mood, date
- **rituals** — name, icon, linked steps
- **ritual_steps** — habit name, duration, order
- **user_settings** — preferences per user

All tables secured with Row Level Security (users can only access their own data).

## Phase 2: Authentication
- Add login/signup page (email + password)
- Add Google sign-in (managed by Lovable Cloud)
- Protect all routes — redirect to login if not authenticated

## Phase 3: Connect Frontend to Database
- Replace local state with database queries (React Query + Supabase client)
- Sync habits, journal, rituals, and settings to/from the database

## Phase 4: Capacitor Setup
- Install Capacitor dependencies
- Configure for iOS/Android builds
- Provide instructions for building and submitting to App Store
