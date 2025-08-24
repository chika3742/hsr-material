# 崩壊：スターレイル素材ノート / HSR Material Note

Tools for Honkai: Star Rail

## Development (Nuxt)

If you are using IntelliJ IDEA (or any other Jetbrains IDE), you can use the provided run configurations to run the dev
server.

### Requirements

- Node.js 20.x
- Bun 1.x

### Environment Variables

- `FIREBASE_CONFIG`: Firebase config JSON string
- `ALGOLIA_SEARCH_API_KEY`: Algolia search API key. App ID and index name are in `algolia.json`.
- `RECAPTCHA_SITE_KEY`: reCAPTCHA site key

### Setup

```bash
bun install
```

### Run Dev Server

```bash
cd packages/nuxt
bun dev
```

### Generate Static Site

```bash
cd packages/nuxt
bun generate
bun preview # to preview the generated site
```

## Development (Firebase)

### Requirements

- Node.js 20.x
- Yarn 1.x (runs v3.x)
- Firebase CLI (can be installed with `npm -g install firebase-tools`)

### Run Firebase Emulators

```bash
cd ..
yarn ts-build-server &
yarn emulators
kill %1 # when you want to stop the server
```

## Dependency Management

This project uses automated dependency management with [Renovate](https://renovatebot.com/) for keeping dependencies up-to-date while maintaining stability.

### Automated Dependency Updates

Dependencies are automatically managed through Renovate with the following configuration:

#### Package-specific Rules

- **Nuxt Package** (`packages/nuxt/`):
  - Production dependencies: Separate branch prefix `deps/` with label `deps:nuxt`
  - Dev dependencies: Standard branch prefix with label `deps:nuxt`
  - Most critical package requiring careful dependency management

- **Firebase Functions** (`packages/firebase/functions/`):
  - All dependencies labeled `deps:functions`
  - Node.js runtime dependencies for serverless functions

- **Algolia Sync** (`packages/algolia-sync/`):
  - All dependencies labeled `deps:algolia-sync`  
  - Data synchronization service dependencies

- **Root Package** (`package.json`):
  - Workspace-level dependencies labeled `deps:root`
  - ESLint and build tooling

- **GitHub Workflows**:
  - Action version updates labeled `deps:workflow`
  - CI/CD pipeline dependencies

#### Branch Strategy

- Production dependencies: `deps/` prefix for immediate attention
- Other dependencies: `deps-pages-nodeploy/` prefix for batch processing
- Semantic commit scopes based on package location

### Manual Dependency Updates

When manual dependency updates are needed:

```bash
# Update all workspaces
bun update

# Update specific workspace
cd packages/nuxt
bun update

# Update specific dependency
bun update <package-name>

# Check for outdated dependencies
bun outdated
```

### Key Dependencies by Package

#### Nuxt Application (`packages/nuxt/`)
- **Framework**: `nuxt@3.17.4` - Main application framework
- **Database**: `dexie@4.0.11` - IndexedDB wrapper for local storage  
- **Firebase**: `firebase@11.6.0` - Authentication and data sync
- **UI**: `vuetify@3.8.7` - Material Design components
- **State**: `@pinia/nuxt@0.11.0` - State management
- **Search**: `@algolia/client-search@5.25.0` - Search functionality

#### Firebase Functions (`packages/firebase/functions/`)
- **Runtime**: `firebase-functions@6.3.2` - Serverless function runtime
- **Admin**: `firebase-admin@13.2.0` - Server-side Firebase SDK
- **HTTP**: `axios@1.9.0` - HTTP client for external APIs

#### Algolia Sync (`packages/algolia-sync/`)
- **Search**: `@algolia/client-search@5.25.0` - Search index management
- **Config**: `dotenv@16.4.7`, `js-yaml@4.1.0` - Configuration handling

### Upgrade Considerations

#### Breaking Changes
- Monitor major version updates, especially for:
  - `nuxt` - Framework breaking changes
  - `firebase` - API changes affecting authentication/database
  - `vuetify` - UI component breaking changes
  - `dexie` - Database schema migration requirements

#### Testing Strategy
- All dependency updates are automatically tested through CI
- Manual testing recommended for major framework updates
- Database migration testing critical for Dexie updates

#### Security Updates
- Security patches are prioritized and auto-merged when possible
- Monitor Renovate dashboard for security-related updates

### Package Manager

This project uses **Bun** (`bun@1.2.13`) as the package manager:
- Fast installation and dependency resolution
- Workspace support for monorepo management
- Compatible with npm registry and package.json format
