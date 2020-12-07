'use strict'

module.exports = {
  devServer: {
    proxy: {
      '/dev-api': {
        changeOrigin: true,
        pathRewrite: {    
          '^/dev-api': ''
        }
      }
    }
  }
}

