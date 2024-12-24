module.exports = {
  preset: "ts-jest", // Usa el preset de ts-jest para TypeScript
  testEnvironment: "node", // Configura el entorno de pruebas para Node.js
  moduleFileExtensions: ["ts", "js"], // Permite pruebas tanto en archivos .ts como .js
  testMatch: ["**/src/tests/**/*.test.ts"], // Define dónde buscar archivos de prueba
};
