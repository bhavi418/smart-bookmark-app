Project Overview

Smart Bookmark App is a full-stack web application that allows users to securely save, manage, and view personal bookmarks.The app uses Google Authentication, Supabase Database, and Realtime updates so bookmarks appear instantly without refreshing the page.

Tech Stack
•	Frontend: Next.js (App Router), React, TypeScript
•	Backend as a Service: Supabase
•	Authentication: Google OAuth via Supabase Auth
•	Database: PostgreSQL (Supabase)
•	Realtime: Supabase Realtime subscriptions
•	Deployment: Vercel

 Features
•	Google Login Authentication
•	Add bookmarks
•	Delete bookmarks
•	Realtime updates (no page refresh required)
•	Cloud deployment on Vercel

Setup Instructions
1.	Clone the Repository
git clone YOUR_REPO_URL
cd smart-bookmark-app
npm install

2.	 Add Environment Variables
 Create .env.local:
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
Run: npm run dev

3.	Supabase Setup
Create a Supabase project
Enable Google Provider
Create table:
create table bookmarks (
id uuid primary key default uuid_generate_v4(),
 user_id uuid,
title text,
 url text,
 created_at timestamp default now());
4.	 Enable Security (RLS)
 alter table bookmarks enable row level security;
 create policy "Users see own data"
on bookmarks
for all
using (auth.uid() = user_id);

Whenever a bookmark is inserted, updated, or deleted, the UI automatically refreshes state without manual reload.

 Problems Faced & How I Solved Them
Problem 1 — Google OAuth redirect_uri_mismatch
Issue: Login failed with error 400.
Solution: Added Supabase callback URL inside Google Cloud Console → Authorized Redirect URIs.

 Problem 2 — Realtime updates not working
Issue: Bookmarks updated only after refresh.
Cause: Table was not enabled inside Supabase Realtime Publications.
Solution:
Database → Publications → Enable bookmarks table.

 Problem 3 — Slow insertion updates
Issue: New bookmark appeared with delay.
Solution:
Used realtime subscription to listen for postgres_changes instead of manual refresh.

 Problem 4 — GitHub Push Errors (non-fast-forward)
Issue: Local branch behind remote repository.
Solution:
git pull origin main --allow-unrelated-histories
resolve README conflicts
git push origin main

 Problem 5 — Supabase Environment Variables Not Loading
Issue: supabaseUrl is required runtime error.
Solution:
Added .env.local
Restarted dev server after changes.

Live Deployment: (https://smart-bookmark-app-ten-opal.vercel.app/)


