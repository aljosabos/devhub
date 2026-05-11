# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Devhub

A developer knowledge hub for snippets, commands, prompts, notes, files, images, links and custom types. 

## Context Files

Read the following to get the full context of the project:

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/current-feature.md

## Commands

- `npm run dev` - Start the development server at http://localhost:3000
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality



### Key Points

- **Next.js Version**: This is Next.js 16.2.6, which has breaking changes from earlier versions. APIs, conventions, and file structure may differ from older versions. Always consult `node_modules/next/dist/docs/` for current APIs before writing code.
- **App Router**: Uses the App Router structure with routes defined in `src/app/`
- **TypeScript Path Alias**: Uses `@/*` alias that maps to `./src/*` for cleaner imports
- **Font Setup**: Uses `next/font/google` with Geist Sans and Geist Mono fonts, configured in `src/app/layout.tsx`
- **Tailwind CSS**: Uses Tailwind CSS v4 with PostCSS, imported in `src/app/globals.css`

### Project Structure

- `src/app/` - App Router pages and layouts
  - `layout.tsx` - Root layout with font configuration
  - `page.tsx` - Home page
  - `globals.css` - Global styles (currently just Tailwind import)
