# 崩壊：スターレイル素材ノート / HSR Material Note

Tools for Honkai: Star Rail

## Development (Nuxt)

If you are using IntelliJ IDEA (or any other Jetbrains IDE), you can use the provided run configurations to run the dev
server.

### Requirements

- Node.js 18.x
- Yarn 1.x

### Environment Variables

- `FIREBASE_CONFIG`: Firebase config JSON string
- `ALGOLIA_SEARCH_API_KEY`: Algolia search API key. App ID and index name are in `algolia.json`.
- `RECAPTCHA_SITE_KEY`: reCAPTCHA site key

### Setup

```bash
cd nuxt
yarn install
```

### Run Dev Server

```bash
yarn dev
```

### Generate Static Site

```bash
yarn generate
yarn preview # to preview the generated site
```

## Development (Firebase)

### Requirements

- Node.js 18.x
- Yarn 1.x
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
