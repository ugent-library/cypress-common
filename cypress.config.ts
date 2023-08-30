import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'dkufj2',
  video: false,
  retries: 2,

  e2e: {
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    experimentalRunAllSpecs: true,
    experimentalOriginDependencies: true,
  },
})
