# HSR Material - GitHub Copilot Instructions

HSR Material is a web application providing tools for Honkai: Star Rail. It's built with Nuxt.js (Vue 3, TypeScript, Vuetify), Firebase Cloud Functions, and Algolia search in a monorepo structure.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap and Setup
- Install Bun 1.x: `curl -fsSL https://bun.sh/install | bash && source ~/.bashrc`
- Install dependencies: `bun install` (takes 45-60 seconds, NEVER CANCEL)
- Verify Node.js 20.x is available: `node --version`

### Workspace Commands
- Build from root: `bun run build:nuxt` (equivalent to `cd packages/nuxt && bun run generate`)
- Post-install setup: `bun run postinstall` (runs automatically after `bun install`)

### Core Build and Test Commands
- Lint code: `bun lint` (takes 6 seconds)
- TypeScript checking: `cd packages/nuxt && bun typecheck` (takes 15-20 seconds)
- Run tests: `cd packages/nuxt && bun run test` (takes 2 seconds, 71 tests)
- Build Nuxt app: `cd packages/nuxt && bun run build` (takes 2+ minutes, NEVER CANCEL - timeout 180+ seconds)
- Generate static site: `cd packages/nuxt && bun run generate` (takes 2+ minutes, NEVER CANCEL - timeout 180+ seconds)
- Build Firebase functions: `cd packages/firebase/functions && bun run build` (takes 1-2 seconds)

### Development Servers
- Nuxt development server: `cd packages/nuxt && bun run dev` (starts on http://localhost:3000)
- Nuxt with Firebase emulators: `cd packages/nuxt && bun run dev:local-server` (requires environment setup)
- Preview generated site: `cd packages/nuxt && bun run preview` (requires Cloudflare Wrangler configuration)
- Firebase emulators require authentication and project setup (use `bunx firebase-tools` commands)

### Environment Variables Required
For full functionality, set these environment variables:
- `FIREBASE_CONFIG`: Firebase config JSON string
- `ALGOLIA_SEARCH_API_KEY`: Algolia search API key (App ID and index in `algolia.json`)
- `RECAPTCHA_SITE_KEY`: reCAPTCHA site key
- `USE_FIREBASE_EMULATOR=true`: For local development with emulators

## Validation

### Build Validation
- ALWAYS run full build validation after code changes: `cd packages/nuxt && bun run build`
- NEVER CANCEL builds - they take 2+ minutes to complete 774 static routes
- Static site generation creates a complete build in `packages/nuxt/dist/`

### Test Validation
- Run unit tests: `cd packages/nuxt && bun run test` (must pass all 71 tests)
- Tests cover utilities, libraries, and core functionality
- Test files located in `packages/nuxt/test/`

### Quality Assurance
- Run linting: `bun lint` (must pass without errors)
- Run type checking: `cd packages/nuxt && bun typecheck` (must pass without errors)
- Both are required for CI to pass

### Manual Validation Steps
After making changes:
1. Build succeeds: `cd packages/nuxt && bun run build`
2. All tests pass: `cd packages/nuxt && bun run test`
3. Linting passes: `bun lint`
4. Type checking passes: `cd packages/nuxt && bun typecheck`
5. Development server starts: `cd packages/nuxt && bun run dev`

### Complete End-to-End Validation
For major changes, run complete validation:
```bash
# From repository root
bun install
bun lint
cd packages/nuxt
bun typecheck
bun run test
bun run build
bun run dev  # Ctrl+C to stop after confirming it starts
```

## Repository Structure

### Key Packages
- `packages/nuxt/` - Main web application (Nuxt.js, Vue 3, TypeScript, Vuetify)
- `packages/firebase/functions/` - Firebase Cloud Functions backend
- `packages/algolia-sync/` - Algolia search index synchronization utility

### Important Directories in Nuxt Package
- `packages/nuxt/assets/data/` - Game data files (YAML, CSV)
- `packages/nuxt/components/` - Vue components
- `packages/nuxt/composables/` - Vue composables
- `packages/nuxt/i18n/locales/` - Internationalization files (Japanese, English)
- `packages/nuxt/pages/` - Nuxt pages and routes
- `packages/nuxt/plugins/` - Nuxt plugins (Firebase, etc.)
- `packages/nuxt/stores/` - Pinia state management
- `packages/nuxt/test/` - Unit tests (Vitest)
- `packages/nuxt/types/` - TypeScript type definitions
- `packages/nuxt/utils/` - Utility functions

### Configuration Files
- `package.json` - Root workspace configuration
- `packages/nuxt/package.json` - Nuxt package configuration
- `packages/nuxt/nuxt.config.ts` - Nuxt configuration
- `packages/nuxt/vitest.config.ts` - Test configuration
- `eslint.config.mjs` - ESLint configuration
- `.github/workflows/` - GitHub Actions CI/CD

## Common Tasks

### Adding New Features
1. Create/modify files in appropriate directories
2. Add tests in `packages/nuxt/test/` if adding utilities
3. Update types in `packages/nuxt/types/` if needed
4. Run validation steps: build, test, lint, typecheck
5. Test manually in development server

### Modifying Game Data
- Character data: `packages/nuxt/assets/data/characters.yaml`
- Material data: `packages/nuxt/assets/data/materials.csv`
- Light cone data: `packages/nuxt/assets/data/light-cones.yaml`
- Relic data: `packages/nuxt/assets/data/relic-*.csv`

### Working with Internationalization
- Primary language (Japanese): `packages/nuxt/i18n/locales/ja.yaml`
- English translations: `packages/nuxt/i18n/locales/en.yaml`
- Type generation script: `packages/nuxt/scripts/generate-loc-type.ts`

### Algolia Search Sync
- Source code: `packages/algolia-sync/src/`
- Development: `cd packages/algolia-sync && bun run dev` (requires `ALGOLIA_API_KEY`)
- Production sync: `cd packages/algolia-sync && bun start` (triggered by GitHub Actions)

### Firebase Functions Development
- Source code: `packages/firebase/functions/src/`
- Build: `cd packages/firebase/functions && bun run build`
- Local testing requires Firebase emulator setup and authentication

## Troubleshooting

### Build Issues
- If build fails, check for TypeScript errors first: `bun typecheck`
- Ensure all dependencies are installed: `bun install`
- Clear Nuxt cache: `rm -rf packages/nuxt/.nuxt`

### Test Failures
- Run specific test file: `cd packages/nuxt && bun run test test/path/to/file.test.ts`
- Test files follow pattern: `*.test.ts` in `packages/nuxt/test/`

### Environment Issues
- Verify Bun version: `bun --version` (should be 1.x)
- Verify Node.js version: `node --version` (should be 20.x)
- Firebase CLI access: `bunx firebase-tools --version`

### Preview Issues
- Preview command requires Cloudflare Wrangler configuration for Cloudflare Pages
- Alternative: Use development server for local testing (`bun run dev`)
- Build artifacts are in `packages/nuxt/dist/` (774 static HTML files)

### Performance Notes
- Initial `bun install` downloads ~1354 packages (45+ seconds)
- Build/generate commands process 774 static routes (2+ minutes)
- NEVER CANCEL long-running build operations
- Use appropriate timeouts: 180+ seconds for builds, 30+ seconds for type checking

## CI/CD Pipeline
GitHub Actions workflows:
- `lint-and-test-nuxt.yml` - Runs linting, type checking, and tests
- `deploy-functions.yml` - Deploys Firebase functions
- `sync-algolia.yml` - Syncs search index data

All quality checks must pass for PR merges.