
import { useEffect, useState } from "react";

type UseCachingFetch = (url: string) => {
  isLoading: boolean;
  data: unknown;
  error: Error | null;
};

/**
 * 1. Implement a caching fetch hook. The hook should return an object with the following properties:
 * - isLoading: a boolean that is true when the fetch is in progress and false otherwise
 * - data: the data returned from the fetch, or null if the fetch has not completed
 * - error: an error object if the fetch fails, or null if the fetch is successful
 *
 * This hook is called three times on the client:
 *  - 1 in App.tsx
 *  - 2 in Person.tsx
 *  - 3 in Name.tsx
 *
 * Acceptance Criteria:
 * 1. The application at /appWithoutSSRData should properly render, with JavaScript enabled, you should see a list of people.✅
 * 2. You should only see 1 network request in the browser's network tab when visiting the /appWithoutSSRData route.✅
 * 3. You have not changed any code outside of this file to achieve this.✅
 * 4. This file passes a type-check.✅
 *
 */

const cache: Record<string, unknown> = {};
const ongoingFetches = new Map<string, Promise<void>>();


export const useCachingFetch: UseCachingFetch = (url) => {
  // constraint: 1 network request per url = must set up a tracker.
const [data, setData] = useState<unknown | null>(() => {
    return cache.hasOwnProperty(url) ? cache[url] ?? null : null;
  });
  const [isLoading, setIsLoading] = useState(() => !Object.prototype.hasOwnProperty.call(cache, url));
  const [error, setError] = useState<Error | null>(null);


  useEffect(() => {
    // if the data is already cached, set it and return
    if (Object.prototype.hasOwnProperty.call(cache, url)) {
      setData(cache[url]);
      setIsLoading(false);
      return;
    }

    if(ongoingFetches.has(url)) {
      // if there is an ongoing fetch, wait for it to complete
      ongoingFetches.get(url)?.then(() => {
        setData(cache[url]);
        setIsLoading(false);
      }).catch((err) => {
        setError(err as Error);
        setIsLoading(false);
      });
      return;
    } 

    // if there is no cached data or on going fetch, start a new fetch
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch data from ${url}`);
        }
        const result = await response.json();
        cache[url] = result; // cache the result
        setData(result);
        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      } finally {
        ongoingFetches.delete(url); // remove from ongoing fetches
      }
    };
    ongoingFetches.set(url, fetchData());
    fetchData();
  }, [url]);    

    console.log({ data,
    isLoading,
    error})
  return {
    data,
    isLoading,
    error
  };
};

/**
 * 2. Implement a preloading caching fetch function. The function should fetch the data.
 *
 * This function will be called once on the server before any rendering occurs.
 *
 * Any subsequent call to useCachingFetch should result in the returned data being available immediately.
 * Meaning that the page should be completely serverside rendered on /appWithSSRData
 *
 * Acceptance Criteria:
 * 1. The application at /appWithSSRData should properly render, with JavaScript disabled, you should see a list of people.
 * 2. You have not changed any code outside of this file to achieve this.
 * 3. This file passes a type-check.
 *
 */
export const preloadCachingFetch = async (url: string): Promise<void> => {
  // if url exists in cache, return  
  if(cache[url]) {
    return;
  } 

  if(ongoingFetches.has(url)) {
    // if there is an ongoing fetch, wait for it to complete
    await ongoingFetches.get(url);
    return;
  } 

  // if there is no cached data or ongoing fetch, start a new fetch
  const fetchData = async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
      }
      const result = await response.json();
      cache[url] = result; // cache the result
    } catch (err) {
      throw new Error(`Error fetching data from ${url}: ${(err as Error).message}`);
    } finally {
      ongoingFetches.delete(url); // remove from ongoing fetches
    }
  };
  ongoingFetches.set(url, fetchData());
  await fetchData();  

};

/**
 * 3.1 Implement a serializeCache function that serializes the cache to a string.
 * 3.2 Implement an initializeCache function that initializes the cache from a serialized cache string.
 *
 * Together, these two functions will help the framework transfer your cache to the browser.
 *
 * The framework will call `serializeCache` on the server to serialize the cache to a string and inject it into the dom.
 * The framework will then call `initializeCache` on the browser with the serialized cache string to initialize the cache.
 *
 * Acceptance Criteria:
 * 1. The application at /appWithSSRData should properly render, with JavaScript enabled, you should see a list of people.
 * 2. You should not see any network calls to the people API when visiting the /appWithSSRData route.
 * 3. You have not changed any code outside of this file to achieve this.
 * 4. This file passes a type-check.
 *
 */
export const serializeCache = (): string => JSON.stringify(cache);

export const initializeCache = (serializedCache: string): void => {
  try {
    const parsedCache = JSON.parse(serializedCache);
     for (const key in parsedCache) {
      cache[key] = parsedCache[key];
    }
  }
  catch (error) {
    console.error("Failed to initialize cache:", error);
  }
};

export const wipeCache = (): void => {
  for (const key in cache) {
    if (Object.prototype.hasOwnProperty.call(cache, key)) {
      delete cache[key];
    }
  }
  ongoingFetches.clear();
  console.log("Cache wiped");
};


// Helper functions
const fetchAndCache = async (url: string): Promise<void> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${url}`);
    }
    const result = await response.json();
    cache[url] = result;
  } finally {
    ongoingFetches.delete(url);
  }
};
