# Lords of Esport - Setup Instructions

## Issue Fixed

The error `n.auth.getSession is not a function` has been resolved by replacing the dummy Supabase configuration with a proper Supabase client implementation.

## What Was Changed

1. **Updated `src/lib/supabase.ts`**:
   - Replaced dummy/mock Supabase object with real `createClient` from `@supabase/supabase-js`
   - Added proper error handling and fallback data
   - Implemented real database queries with fallback to sample data

2. **Created `.env.local`**:
   - Added environment variables template with placeholder values
   - Configured for Supabase authentication

## Setup Instructions

### 1. Supabase Setup (Required)

To fully fix the authentication, you need to set up a Supabase project:

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to Settings > API
3. Copy your project URL and anon key
4. Update `.env.local` with your actual values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
   ```

### 2. Database Schema (Optional)

If you want full functionality, create these tables in your Supabase database:

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  discord_username TEXT,
  vr_experience_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);

-- Tournaments table
CREATE TABLE tournaments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  game_mode TEXT NOT NULL,
  tournament_type TEXT NOT NULL,
  max_participants INTEGER NOT NULL,
  entry_fee DECIMAL(10,2) NOT NULL,
  prize_pool DECIMAL(10,2) NOT NULL,
  registration_start TIMESTAMP WITH TIME ZONE NOT NULL,
  registration_end TIMESTAMP WITH TIME ZONE NOT NULL,
  tournament_start TIMESTAMP WITH TIME ZONE NOT NULL,
  tournament_end TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'upcoming',
  created_by UUID REFERENCES auth.users,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tournament registrations table
CREATE TABLE tournament_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID REFERENCES tournaments ON DELETE CASCADE,
  team_id UUID,
  user_id UUID REFERENCES auth.users,
  registration_type TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_id TEXT,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### 3. Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### 4. Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Current Status

- ✅ **Authentication Error Fixed**: The `getSession` error is resolved
- ✅ **Fallback Data**: App will work even without database setup
- ✅ **Environment Configuration**: Proper environment variable setup
- ⚠️ **Database Setup**: Optional but recommended for full functionality
- ⚠️ **Payment Integration**: Square/Stripe setup needed for tournament registration

## Testing the Fix

1. The app should now load without the JavaScript error
2. Authentication forms will appear (though they need Supabase setup to work)
3. Sample tournament data will display
4. No more `n.auth.getSession is not a function` errors

## Next Steps

1. Set up your Supabase project and update environment variables
2. Create the database schema if you want full functionality
3. Configure payment processing (Square/Stripe) for tournament registration
4. Deploy to your preferred hosting platform (Vercel, Netlify, etc.)
