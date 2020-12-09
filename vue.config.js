'use strict'

module.exports = {
  publicPath: '/',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://140.143.247.32:81/prod-api/',
        changeOrigin: true,
        pathRewrite: {    
          '^/api': ''
        }
      }
    }
  }
}

