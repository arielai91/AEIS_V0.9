import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["src/**/*.{js,mjs,cjs,ts}"], // Solo analiza los archivos en la carpeta src/
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2021, // Permite usar sintaxis moderna de JavaScript/TypeScript
        sourceType: "module", // Permite usar import/export
        project: "./tsconfig.json", // Asegúrate de que apunta correctamente a tu tsconfig.json
      },
      globals: globals.node, // Define las variables globales de Node.js
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      "no-console": "warn", // Muestra advertencias para console.log
      semi: ["error", "always"], // Exige punto y coma al final de las líneas
      quotes: ["error", "single"], // Usa comillas simples
      "@typescript-eslint/no-unused-vars": ["error"], // Detecta variables no utilizadas
    },
  },
  {
    files: ["*.js", "*.mjs"], // Configuración adicional para archivos específicos
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
    },
    rules: {
      "no-console": "off",
    },
  },
];
