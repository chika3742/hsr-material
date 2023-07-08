# 崩壊：スターレイル素材ノート / HSR Material Note

Tools for Honkai: Star Rail

Alpha version website is live at [alpha.hsr-material.chikach.net](https://alpha.hsr-material.chikach.net/)

## Development (Nuxt)

If you are using IntelliJ IDEA (or any other Jetbrains IDE), you can use the provided run configurations to run the dev
server.

### Requirements

- Node.js 18.x
- Yarn 1.x

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
