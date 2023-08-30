import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'dkufj2',
  video: false,
  retries: 2,
  blockHosts: ['*google-analytics.com', '*hotjar.com', '*ugent.containers.piwik.pro'],

  e2e: {
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    experimentalRunAllSpecs: true,
    experimentalOriginDependencies: true,
  },
})
