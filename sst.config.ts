/// <reference path="./.sst/platform/config.d.ts" />

// Project configuration constants
const PROJECT_NAME: string = "arbitrum-connect-alt"; // Must be set by developer, must only contain alphanumeric characters and hyphens
const CUSTOMER: string = "arbitrum"; // Must be set by developer, must only contain alphanumeric characters and hyphens

const UI_URL = process.env.UI_URL!;

// Validation function for project configuration
function validateConfig() {
  const errors: string[] = [];

  if (!PROJECT_NAME || PROJECT_NAME.trim() === "") {
    errors.push("PROJECT_NAME must be set (e.g., 'testing-monorepo-1')");
  }

  if (!CUSTOMER || CUSTOMER.trim() === "") {
    errors.push("CUSTOMER must be set (e.g., 'testing')");
  }
  if (!UI_URL || CUSTOMER.trim() === "")
    errors.push(
      "UI_URL must be set (e.g., 'https://project-name.wakeuplabs.link' or 'https://www.project-name.xyz')",
    );

  if (errors.length > 0) {
    // Print error directly to console
    console.error("\n\n==============================================");
    console.error("⛔️ Configuration Error");
    console.error("==============================================");
    console.error("Missing required values in sst.config.ts:");
    errors.forEach((err) => console.error(`  • ${err}`));
    console.error("\n❌ Deployment blocked until these values are set");
    console.error("==============================================\n\n");

    // Also throw error for SST to catch
    throw new Error("Configuration validation failed");
  }
}

export default $config({
  app(input) {
    // Validate configuration before proceeding
    validateConfig();

    return {
      name: PROJECT_NAME,
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          defaultTags: {
            tags: { customer: CUSTOMER, stage: input.stage },
          },
        },
      },
    };
  },
  async run() {
    // Validate configuration again in case run() is called directly
    validateConfig();

    // -> API Function
    const api = new sst.aws.Function(`${$app.stage}-${PROJECT_NAME}-api`, {
      bundle: "packages/api/dist",
      handler: "bundle.handler",
      url: true,
      environment: {
        DATABASE_URL: process.env.DATABASE_URL ?? "",
        UI_URL: UI_URL,
      },
    });
    // API Function <-

    // -> Lambda API (delete the unused one)
    const apiGateway = new sst.aws.ApiGatewayV2(`${$app.stage}-${PROJECT_NAME}-gateway`);

    apiGateway.route("$default", api.arn);
    // Lambda API <-

    // -> UI
    const domainRoot = UI_URL.replace(/^https?:\/\/(www\.)?/, "");
    const domainAlias = UI_URL.replace(/^https?:\/\//, "");

    const ui = new sst.aws.StaticSite(`${PROJECT_NAME}-ui`, {
      path: "packages/ui",
      domain: {
        name: domainRoot,
        aliases: domainAlias !== domainRoot ? [domainAlias] : [],
      },
      build: {
        command: "npm run build",
        output: "dist",
      },
      environment: {
        VITE_API_URL: apiGateway.url,
      },
      assets: {
        textEncoding: "utf-8",
        fileOptions: [
          {
            files: ["**/*.css", "**/*.js"],
            cacheControl: "max-age=31536000,public,immutable",
          },
          {
            files: "**/*.html",
            cacheControl: "max-age=0,no-cache,no-store,must-revalidate",
          },
          {
            files: ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.gif", "**/*.svg", "**/*.webp"],
            cacheControl: "max-age=31536000,public,immutable",
          },
        ],
      },
      indexPage: "index.html",
      errorPage: "index.html",
      invalidation: {
        wait: true,
        paths: ["/*"],
      },
      transform: {
        cdn: {
          comment: "SPA routing support",
          defaultRootObject: "index.html",
          customErrorResponses: [
            {
              errorCode: 404,
              responseCode: 200,
              responsePagePath: "/index.html",
            },
          ],
        },
      },
    });
    // UI <-

    return {
      api: apiGateway.url,
      ui: ui.url,
    };
  },
});
