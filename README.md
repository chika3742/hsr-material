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

\* I'm working in progress to work without these environment variables.

### Setup

Create `.env` file in `nuxt` directory with the following content.

```
GITHUB_PACKAGES_TOKEN=<token>
```

You need to create personal access token in Settings > Developer Settings > Personal Access Tokens > Tokens (classic). `read:packages` scope is required.

Then, install npm packages.

```bash
cd nuxt
bun install
```

### Run Dev Server

```bash
bun dev
```

### Generate Static Site

```bash
bun generate
bun preview # to preview the generated site
```

## Development (Firebase)

### Requirements

- Node.js 20.x
- Yarn 1.x (runs v3.x)
- Firebase CLI (can be installed with `npm -g install firebase-tools`)

### Setup

```bash
cd firebase/functions
yarn install
```

### Run Firebase Emulators

```bash
cd ..
yarn ts-build-server &
yarn emulators
kill %1 # when you want to stop the server
```
