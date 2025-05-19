const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8080, // порт сайта
    proxy: {
      '/test/hs/deliveryInfo/1c': {
        target: 'http://localhost', // Целевой сервер 1С
        changeOrigin: true,
        secure: false,
        logLevel: 'debug',
      }
    }
  }
})