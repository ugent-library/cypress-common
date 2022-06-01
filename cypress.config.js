const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'dkufj2',
  video: false,
  retries: 2,
  e2e: {
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
