// @ts-ignore
import { DiskCache, SparkMD5 } from './helpers-cjs';

function hash(...objects) {
  const spark = new SparkMD5();
  spark.append(JSON.stringify(objects));
  return spark.end(true);
}

function getExpirableCache(cache, defaultExpiry) {
  return {
    get: async (key, expiry) => {
      // cache.remove(key)
      // return null
      const json = await cache.get(key);

      if (!json) {
        return null;
      }

      let item;

      try {
        item = JSON.parse(json);
      } catch (e) {
        console.log('Error parse json: \n' + json);
        throw e;
      }

      if (!expiry) {
        expiry = defaultExpiry || -1;
      }

      if (expiry >= 0 && new Date().getTime() - item.createTime > expiry * 1000) {
        console.log('CACHE REMOVE: ' + key);
        cache.remove(key);
        return null;
      }

      return item.value;
    },
    set: (key, value) => cache.set(key, JSON.stringify({
      createTime: new Date().getTime(),
      value
    })),
    remove: cache.remove
  };
}

export function createCache(id, expiry) {
  const diskCache = new DiskCache(id, {
    location: './tmp/cache'
  });
  const cache = {
    get: async key => (await diskCache.get(key)).value,
    set: (key, value) => diskCache.set(key, value),
    remove: key => diskCache.remove(key)
  };
  return getExpirableCache(cache, expiry);
}