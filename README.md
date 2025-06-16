# Caching Fetch Library Project

## Overview

This project demonstrates a simple React caching fetch library integrated into a small web app with server-side rendering (SSR) support. The goal is to implement a caching fetch hook and server-side data preloading to optimize network requests and enable SSR.

## Features

- **useCachingFetch**: A React hook that caches fetch results by URL to avoid redundant network requests on the client. The cache is shared between multiple hook instances.
- **preloadCachingFetch**: A server-side function to preload data before rendering, enabling SSR with no network requests on initial page load.
- **Cache serialization**: The cache can be serialized to a string and rehydrated on the client, efficiently transferring server data.
- **Cache invalidation**: A utility to wipe the cache when needed.

## How It Works

- The cache is a plain JavaScript object keyed by URL.
- The client hook checks if data is cached; if yes, it returns immediately.
- Concurrent fetches to the same URL are de-duplicated using an internal `ongoingFetches` Map.
- The server preloads data using `preloadCachingFetch`, populating the cache before rendering.
- The cache is serialized on the server and injected into the HTML.
- On the client, the cache is re-initialized from the serialized data to avoid re-fetching.

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:dotGrimmz/cache-fetch-hook-proj.git
   cd cache-fetch-hook-proj
   ```

2. Install dependencies:

   '''wsl
   npm i

   ```

   ```

3. Run the app locally:

   ````wsl
    npm start```
   ````

4. Open your browser at http://localhost:3000
