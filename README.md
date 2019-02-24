# 🗄 nuxt-cache-payload
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)
[![Maintainability](https://api.codeclimate.com/v1/badges/9ecd9efd584ef69a51cc/maintainability)](https://codeclimate.com/github/nandenjin/nuxt-cache-payload/maintainability)
![Dependencies](https://david-dm.org/nandenjin/nuxt-cache-payload.svg)

## What's this
This is a module to generate cache file for `nuxt generate`ed sites. 

By default, Nuxt provides payload object from `config.generate()` only on first one page of the session. Other pages that are navigated programmably such as by `<nuxt-link>` cannot get payload objects.

```js
// nuxt.config.js
module.exports = {
  generate() {
    return [
      {
        route: '/dynamic/routed/page',
        payload: await fetchPagePayload(), // Get something from network resource, etc.
      }
    ];
  }
};

// /pages/dynamic/routed/_page.vue
exports default {
  async asyncData( { payload } ) {
    if( payload ) return { payload }; // For as first one page (production) this one is used.
    else return { payload: async fetchPagePayload() }; // For other pages...
  }
};
```
If `fetchPagePayload()` contains heavy process (Ex: with long latency), it delays page loading.

This modules generate cache files of payload object from `config.generate()` and able to **build 100% static sites.**

## Usage
Install with `npm install nuxt-cache-payload` and [register in `nuxt.config.js`](https://nuxtjs.org/api/configuration-modules).

```js
// /pages/dynamic/routed/_page.vue
exports default {
  async asyncData( { getPayload, payload, route } ) {
    return {
      payload:    payload                         // For as the first one page
               || await getPayload( route.path )  // For as the 2nd (or later) page: fetch cached payload
               || await fetchPagePayload()        // Fallback & for development mode
    };
  }
};
```

Module generate cache files with `nuxt generate` and it can be fetched by using `context.getPayload()` inside `asyncData()`.

## Options
```js
// nuxt.config.js
module.exports = {
  modules: [
    [ 'nuxt-cache-payload', {
      
      // Custom file for cache files (optional).
      // Default: '_payload.${randomHash}.json'
      filename: 'cachefile.json',
      
      // Encoding of cache files (optional).
      // Default: 'utf8'
      encoding: 'utf8',
      
    } ];
  ]
};
```

## License
MIT License: Copyright (c) Kazumi Inada
