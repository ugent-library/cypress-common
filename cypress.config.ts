import { defineConfig } from "cypress";

export default defineConfig({
	projectId: "dkufj2",
	defaultBrowser: "chrome",
	video: false,
	retries: {
		runMode: 2,
		openMode: 0,
	},
	blockHosts: [
		"*google-analytics.com",
		"*hotjar.com",
		"*piwik.pro",
		"*onetrust.com",
	],

	e2e: {
		baseUrl: "https://lib.ugent.be/en/libraries",
		experimentalRunAllSpecs: true,
	},
});
