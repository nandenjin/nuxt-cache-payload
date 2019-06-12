/*!

  nuxt-cache-payload (plugin)
  Copyright (c) 2019 Kazumi Inada

*/

import axios from 'axios'

const filename = '<%= options.filename %>'

// Helper method to join path fragments
function joinPath(...fragments) {
  return fragments.join('/').replace(/\/{1,}/g, '/')
}

export default (context, inject) => {
  const isStatic = context.isStatic

  /**
   * Retrive cached payload data.
   * @param {String} path Page path for payload data to retrive. (Ex: context.route.path)
   * @return {Promise<object>} Promise contains retrived payload object (JSON serialized). Resolved with null when it is called in non-generated environment or failed to fetch.
   */
  context.getPayload = async function getPayload(path) {
    // Retrive path to payload
    const filePath = joinPath(path, filename)

    // is on generated site && is not in process of generate
    if (isStatic && process.client) {
      try {
        return (await axios.get(filePath)).data
      } catch (e) {
        return null
      }
    } else {
      return null
    }
  }
}
