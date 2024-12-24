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
    logLevel: config.LOG_DEBUG, // Para obtener más detalles de los errores
    autoWatch: false, // Cambiado a `false` para evitar que Karma quede esperando
    browsers: ["ChromeHeadless"], // Asegúrate de que solo ChromeHeadless esté listado aquí
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
    singleRun: true, // Esto asegura que Karma ejecute las pruebas solo una vez y luego termine
    restartOnFileChange: false, // Evita reiniciar el proceso si se detectan cambios
    captureTimeout: 60000, // Añadido para evitar tiempos de espera largos
  });
};
