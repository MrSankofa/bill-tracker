import { defineConfig } from "cypress";
import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

export default defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  e2e: {
    projectId: 'bill-tracker',
    ...nxE2EPreset(__dirname, {
      cypressDir: 'apps/bill-tracker-e2e/src/',
      webServerCommands: {
        default: 'npx nx run bill-tracker:serve',
        production: 'npx nx run bill-tracker:serve-static',
      },
      ciWebServerCommand: 'npx nx run bill-tracker:serve-static',
      ciBaseUrl: 'http://localhost:4200',
    }),
    baseUrl: 'http://localhost:4200',
    testIsolation: true,
    fixturesFolder: false,
    supportFile: 'apps/bill-tracker-e2e/src/e2e/e2e.ts',
    specPattern: ['apps/bill-tracker-e2e/src/e2e/**/*.cy.ts'],
  },
});
