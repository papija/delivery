const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8080, // Убедитесь, что порт совпадает с вашим фронтендом (по умолчанию 8080 для vue-cli)
    proxy: {
      '/test/hs/deliveryInfo/1c': {
        target: 'http://localhost', // Целевой сервер 1С
        changeOrigin: true, // Изменяет заголовок Origin на целевой сервер
        secure: false, // Отключает проверку SSL (для HTTP)
        logLevel: 'debug', // Включает отладочные сообщения в консоли
      }
    }
  }
})