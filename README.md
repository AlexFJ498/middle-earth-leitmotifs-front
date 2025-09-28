# Middle‑earth Leitmotifs Frontend

A React web application for discovering and exploring the leitmotifs in Howard Shore's scores for Middle‑earth, as documented by Doug Adams.

## Table of Contents
- [About this project](#about-this-project)
- [Project overview](#project-overview)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Routes](#routes)
- [Setup](#setup)
- [Configuration](#configuration)
- [Running locally](#running-locally)
- [Building](#building)
- [Testing](#testing)
- [Linting](#linting)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## About this project

This project began as a personal initiative to learn and use modern web development tools through a subject I care about. After reading Doug Adams' book, it became clear that a concise, well‑structured way to browse the leitmotifs would be both useful and enjoyable. I hope the fans of LOTR music find it helpful as well.

It is free, non‑commercial, and released under the MIT License. The goal is not to provide exhaustive analysis, but rather a practical, readable interface that offers context without attempting to replace the source material. Suggestions, issues, and pull requests are welcome. This is an independent, non‑commercial fan project, not affiliated with New Line Cinema, Warner Bros., The Saul Zaentz Company, or The Tolkien Estate. Please support the creators by purchasing official editions and licensed soundtracks.

Music compositions and track titles are the property of Howard Shore and the respective rights holders. "Middle‑earth", film titles, character names, place names, and other related names and terms are the property of The Tolkien Estate and other rights holders.

No sheet music or film audio is hosted; embedded players link only to official Spotify releases. Images on this site were generated using AI and serve only as illustrative placeholders; they are not official artwork.

The thematic names and structure presented here are derived from Doug Adams' book "The Music of The Lord of the Rings Films". All original naming remains the property of the author. The brief descriptions were written specifically for this site and are intentionally limited.

## Project overview

This repository contains a React TypeScript frontend application that provides a user‑friendly interface for browsing Middle‑earth leitmotifs. The application follows clean architecture principles with a clear separation between domain models, infrastructure adapters, and UI components. It uses a modern React setup with Vite, TypeScript, and TailwindCSS for optimal developer experience and performance.

## Tech stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite 7.1.4
- **Styling:** TailwindCSS 4.1.13 + CSS Modules + SCSS
- **UI Library:** HeroUI 2.8.4 (NextUI successor)
- **Routing:** React Router DOM 7.8.2
- **State Management:** React Hooks + Custom hooks
- **HTTP Client:** Fetch API
- **Testing:** Jest 29.5.0 + Testing Library + Cypress 15.1.0
- **Linting:** ESLint + Stylelint
- **Markdown:** react‑markdown with remark plugins

## Architecture

The application follows a clean architecture pattern with clear separation of concerns:

### Domain Layer (`src/domain/`)
- **Entities:** Core business models (`Group.ts`, `Theme.ts`, `Track.ts`, `Movie.ts`, `Category.ts`)
- **Repositories:** Abstract interfaces defining data access contracts (`GroupRepository.ts`, `ThemeRepository.ts`)

### Infrastructure Layer (`src/infrastructure/`)
- **API Adapters:** Concrete implementations of repository interfaces (`ApiGroupRepository.ts`, `ApiThemeRepository.ts`)
- **Data Transfer Objects:** API response types and transformers (`ApiResponse.ts`)

### Presentation Layer (`src/sections/`)
- **Feature Modules:** Self‑contained sections with their own components, hooks, and factories:
  - `home/` - Landing page
  - `groupsList/` - Browse all leitmotif groups
  - `groupDetail/` - Detailed view of themes within a group
  - `about/` - Project information
  - `layout/` - Application layout and navigation
  - `dev/` - Development tools (theme editor)

### Shared Components (`src/components/`)
- **Reusable UI:** Common components like `MarkdownText`, `TipSpotifySignIn`, and icon components

### Factory Pattern
Each section uses a Factory pattern for dependency injection:
```typescript
export class GroupsListFactory {
    static create(): React.ReactElement {
        return <GroupsList repository={new ApiGroupRepository()} />;
    }
}
```

### Custom Hooks
Business logic is encapsulated in custom hooks:
- `useGroups.ts` - Manages group fetching and state
- `useThemesByGroup.ts` - Handles theme data for specific groups
- `useGroup.tsx` - Individual group data management

## Routes

- **`/`** - Home page with project introduction
- **`/themes`** - Browse all leitmotif groups
- **`/themes/:groupId`** - View themes within a specific group  
- **`/about`** - About the project and acknowledgments
- **`*`** - Catch‑all redirects to home

## Setup

### Requirements
- Node.js 20.x or higher
- npm or yarn package manager

### Install dependencies
```powershell
npm install
```

## Configuration

Configuration is handled through environment variables using Vite's built‑in environment system:

### Environment Variables
- **`VITE_API_URL`** - Backend API base URL (defaults to `http://localhost:8080`)

### Configuration Files
Create a `.env.local` file for local development:
```properties
VITE_API_URL=http://localhost:8080
```

For production, set `VITE_API_URL` to your deployed backend URL.

## Running locally

### Development Server
```powershell
npm start
# or
npm run start
```

The application will be available at http://localhost:3000 and will automatically open in your browser.

### Using Make (optional)
```powershell
make start
```

## Building

### Production Build
```powershell
npm run build
```

### Preview Production Build
```powershell
npm run preview
```

### Using Make
```powershell
make build  # Install deps + build
make compile  # Build only
```

## Testing

### Unit Tests (Jest + Testing Library)
```powershell
npm test        # Run in watch mode
npm run test    # Run in watch mode
```

### End‑to‑End Tests (Cypress)
```powershell
npm run cy:open  # Open Cypress UI
npm run cy:run   # Run headlessly
```

### Using Make
```powershell
make test
```

### Test Structure
- **Unit tests:** Located in `tests/` directory
- **E2E tests:** Located in `tests/e2e/tests/`
- **Test helpers:** Mother objects for test data generation
- **Setup:** `tests/setupTests.ts` configures Jest environment

## Linting

### Run Linters
```powershell
npm run lint      # Check ESLint + Stylelint
npm run lint:fix  # Auto-fix issues
```

### Using Make
```powershell
make lint      # Check only
make lint-fix  # Auto-fix
```

### Linting Configuration
- **ESLint:** Extends Codely TypeScript config + React
- **Stylelint:** SCSS standard configuration with rational ordering
- **EditorConfig:** Consistent formatting across editors

## License

MIT License. See `LICENSE`.

## Acknowledgments

- You may purchase Doug Adams' book here: [The Music of The Lord of the Rings Films](https://www.amazon.com/Music-Lord-Rings-Films-Comprehensive/dp/0739071572?ref_=ast_author_dp)
- This project was made from zero following this [course](https://github.com/CodelyTV/go-hexagonal_http_api-course)
- UI components powered by [HeroUI](https://heroui.com/) (NextUI successor)
- Icons from the community and custom implementations
