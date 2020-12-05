'use strict'

module.exports = {
  devServer: {
    proxy: {
      '/dev-api': {
        target: 'http://140.143.247.32/api',
        changeOrigin: true,
        pathRewrite: {    
          '^/dev-api': ''
        }
      }
    }
  }
}