import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      console.log("Setup Cypress Events", { on, config });
    },
  },
});
