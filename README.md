# 🗄 nuxt-cache-payload

[![npm version](https://badge.fury.io/js/nuxt-cache-payload.svg)](https://badge.fury.io/js/nuxt-cache-payload)
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)
[![CircleCI](https://circleci.com/gh/nandenjin/nuxt-cache-payload.svg?style=shield)](https://circleci.com/gh/nandenjin/nuxt-cache-payload)
[![Maintainability](https://api.codeclimate.com/v1/badges/9ecd9efd584ef69a51cc/maintainability)](https://codeclimate.com/github/nandenjin/nuxt-cache-payload/maintainability)
[![Dependencies](https://david-dm.org/nandenjin/nuxt-cache-payload.svg)](https://david-dm.org/nandenjin/nuxt-cache-payload)
[![devDependencies](https://david-dm.org/nandenjin/nuxt-cache-payload/dev-status.svg)](https://david-dm.org/nandenjin/nuxt-cache-payload?type=dev)

## 💡 ATTENTION PLEASE - you may not need this now 🤔

From `nuxt@2.14.0`, Nuxt supports [**full static generation** that enables you to mock `asyncData()` and `fetch()` natively](https://ja.nuxtjs.org/blog/going-full-static/). By using this, you may not need to install `nuxt-cache-payload`.

As the way to the end of its mission, `nuxt-cache-payload` is now going to deprecated status.

* Only severe security fix will provided.
* No more features will be added.
* In the future this repo will be archived and in read-only mode.

If you are using this package for your existing project, please consider upgrading Nuxt.js and using native full static generation. **It is NOT recommended using this package for new project.**

---

## What's this
This is a module to generate cache file for `nuxt generate`ed sites.

By default, Nuxt provides payload object from `config.generate.routes()` only on first one page of the session. Other pages that are navigated programmably such as by `<nuxt-link>` cannot get payload objects.

```js
// nuxt.config.js
module.exports = {
  generate: {
    routes() {
      return [
        {
          route: '/dynamic/routed/page',
          payload: await fetchPagePayload(), // Get something from network resource, etc.
        }
      ];
    }
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

This modules generate cache files of payload object from `config.generate()` and make it to be able to **reduce payload generate requests.**

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

**Note:** Cache files will be generated only with `nuxt generate` and `context.getPayload()` will returns `null` when called in non-static environment. You should fetch payload data manually from original source in devMode or at server-side rendering.

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

## Contributing
Pull requests or feature requests are welcome. Please submit them from GitHub.

## License
MIT License: Copyright (c) Kazumi Inada
