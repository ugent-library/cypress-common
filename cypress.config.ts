import { defineConfig } from "cypress";

export default defineConfig({
	projectId: "dkufj2",
	defaultBrowser: "chrome",
	video: false,
	retries: 2,
	blockHosts: [
		"*google-analytics.com",
		"*hotjar.com",
		"*ugent.containers.piwik.pro",
		"*onetrust.com",
	],
	expose: {
		testUrl: "https://lib.ugent.be",
	},

	e2e: {
		specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
		experimentalRunAllSpecs: true,
		experimentalOriginDependencies: true,
	},
});
