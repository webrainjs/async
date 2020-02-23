import { FetchHttpClient } from '../../common/api/FetchHttpClient';
import { fetchCached } from '../../common/scraper/fetch-cached';
import { Scraper } from '../../common/scraper/Scraper';
import { createCache } from './cache'; // @ts-ignore

import { nodeFetch } from './helpers-cjs';
const httpClient = new FetchHttpClient({
  fetch: fetchCached({
    fetch: nodeFetch,
    cache: createCache('Scraper', 0)
  })
});
let startCount = 0;
httpClient.loadingObservable.subscribe(e => {
  startCount++;
  console.log('START ' + startCount.toString().padEnd(5, ' ') + e.url);
});
let endCount = 0;
httpClient.loadedObservable.subscribe(e => {
  endCount++;
  console.log('END   ' + endCount.toString().padEnd(5, ' ') + e.url);
});
httpClient.errorObservable.subscribe(e => {
  endCount++;
  console.log('ERROR ' + endCount.toString().padEnd(5, ' ') + e.url);
});
export const scraper = new Scraper({
  httpClient: new FetchHttpClient({
    fetch: fetchCached({
      fetch: nodeFetch,
      cache: createCache('Scraper', 0)
    })
  })
});