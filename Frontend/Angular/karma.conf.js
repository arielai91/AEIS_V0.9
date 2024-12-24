module.exports = function (config) {
  config.set({
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage"),
      require("@angular-devkit/build-angular/plugins/karma"),
    ],
    client: {
      clearContext: false, // Deja el contexto de pruebas después de completarlas
    },
    coverageReporter: {
      dir: require("path").join(__dirname, "./coverage"),
      subdir: ".",
      reporters: [{ type: "html" }, { type: "text-summary" }],
    },
    reporters: ["progress", "kjhtml"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO, // Solo información básica
    autoWatch: false, // No observar cambios en los archivos
    browsers: ["ChromeHeadless"], // Solo ChromeHeadless
    customLaunchers: {
      ChromeHeadless: {
        base: "Chrome",
        flags: [
          "--headless",
          "--disable-gpu",
          "--no-sandbox",
          "--disable-dev-shm-usage",
        ],
      },
    },
    singleRun: true, // Ejecutar pruebas una sola vez
    restartOnFileChange: false, // No reiniciar el proceso si se detectan cambios
    captureTimeout: 60000, // 60 segundos de espera máxima para capturar el navegador
    browserNoActivityTimeout: 10000, // Desconectar navegador si no hay actividad por 10 segundos
    browserDisconnectTimeout: 10000, // 10 segundos de espera para desconectar el navegador
    timeout: 60000, // Máximo 60 segundos para que las pruebas terminen
  });
};
