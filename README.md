# Eidos

A luxury streaming web application with a glassmorphism aesthetic, true OLED blacks, and cyan accent glows. Built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- Glassmorphism UI with frosted glass surfaces and backdrop blur
- OLED-ready pure black backgrounds
- Facade with Intent-Driven Pre-connection streaming player
- Circuit-breaker multi-server fallback
- Immersive details pages with full-bleed backdrops
- Personal watchlist persisted to Supabase (no sign-in required)
- Live TMDB data with curated fallback catalog
- Responsive for mobile and desktop

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | For watchlist | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | For watchlist | Supabase anon public key |
| `VITE_TMDB_API_KEY` | Optional | TMDB v3 API key |
| `VITE_TMDB_ACCESS_TOKEN` | Optional | TMDB v4 read access token (recommended) |

Get your TMDB API key at https://www.themoviedb.org/settings/api

## Tech Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- Supabase (database)
- Lucide React (icons)
