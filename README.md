# Caching Fetch Library Project

## Overview

This project demonstrates a simple React caching fetch library integrated into a small web app with server-side rendering (SSR) support. The goal was to implement a caching fetch hook and server-side data preloading to optimize network requests and enable SSR.

## Features

- **useCachingFetch**: A React hook that caches fetch results by URL to avoid redundant network requests on the client. It shares the cache between multiple hook instances.
- **preloadCachingFetch**: A server-side function to preload data before rendering, enabling SSR with no network requests on initial page load.
- **Cache serialization**: The cache can be serialized to a string and rehydrated on the client, transferring server data efficiently.
- **Cache invalidation**: A utility to wipe the cache when needed.

## How It Works

- The cache is a plain JavaScript object keyed by URL.
- Client hook checks if data is cached; if yes, it returns immediately.
- Concurrent fetches to the same URL are de-duplicated using an internal `ongoingFetches` Map.
- The server preloads data using `preloadCachingFetch`, populating the cache before rendering.
- The cache is serialized on the server and injected into the HTML.
- On the client, the cache is re-initialized from the serialized data to avoid re-fetching.

## Setup & Run

```wsl
npm install
npm start
```
