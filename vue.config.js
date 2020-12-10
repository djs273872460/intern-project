'use strict'

module.exports = {
  publicPath: '/',
  devServer: {
    proxy: {
      '/dev-api': {
        target: 'http://140.143.247.32:81',
        changeOrigin: true,
        pathRewrite: {    
          '^/dev-api': '/api'
        }
      }
    }
  }
}

