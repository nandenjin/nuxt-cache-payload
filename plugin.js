/*!

  nuxt-cache-payload (plugin)
  Copyright (c) 2019 Kazumi Inada

*/


import axios from 'axios';
import consola from 'consola';

const filename = '<%= options.filename %>';

export default ( { app, route, isStatic }, inject ) => {

  app.getPayload = async path => {

    // Retrive path to payload
    const filePath = joinPath( path, filename );

    // is on generated site && is not in process of generate
    if( isStatic && process.client ) {

      try {

        return ( await axios.get( filePath ) ).data;

      }catch( e ) {

        return null;

      }

    }else {

      return null;

    }

  };

};

// Helper method to join path fragments
function joinPath( ...fragments ) {

  return fragments.join( '/' ).replace( /\/{1,}/g, '/' );

}
