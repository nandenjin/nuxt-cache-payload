/*!

  nuxt-cache-payload plugin
  Copyright (c) 2019 Kazumi Inada

*/

const path = require('path')
const fs = require('fs')

const consola = require('consola')

module.exports = function cachePayload(options = {}) {
  const nuxt = this.nuxt
  const nuxtOptions = this.options

  // Path for distDir
  const distPath = nuxtOptions.generate.dir

  // Generate random hash
  const hash = Math.floor(Math.random() * 1000000)

  // Loading options
  const filename = options.filename || `_payload.${hash}.json`
  const encoding = options.encoding || 'utf8'

  let routes

  // Hook for generated routes
  nuxt.hook('generate:extendRoutes', r => routes = [ ...r ])

  // Hook for end of generate
  nuxt.hook('generate:done', () => generateCacheFiles(routes, { distPath, filename, encoding }))

  // Register plugin to provide method to retrive data
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    options: {
      filename
    }
  })
}

// Metadata
module.exports.meta = require('./package.json')

// Generate cache files from routes
function generateCacheFiles(routes, { distPath, filename, encoding }) {
  consola.info('nuxt-cache-payload is writing payload cache files...')
  consola.info(`Payload filename: ${filename}`)

  for (let i = 0; i < routes.length; i++) {
    const route = routes[ i ].route
    const payload = routes[ i ].payload

    // Pass if payload does not be provided
    if (payload === null) continue

    // Write to distDir
    fs.writeFile(
      path.join(distPath, route, filename),
      JSON.stringify(payload),
      encoding,
      (err) => {
        if (!err) consola.success('Generated payload cache for ' + route)

        else {
          consola.error('Failed to create payload file')
          console.dir(err)
        }
      }
    )
  }
}
