import { execSync } from "child_process";
import { defineConfig } from "cypress";
import { Client } from "pg";

const DATABASE_URL =
  "postgresql://postgres:123456789@localhost:5432/premios_top_brasil?schema=test";

export default defineConfig({
  projectId: "jq81v8",
  e2e: {
    baseUrl: "http://localhost:4000",
    experimentalInteractiveRunEvents: true,
    experimentalSessionAndOrigin: true,
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      /*       on("")
      on("before:browser:launch", (browser, launchOptions) => {
        process.env.DATABASE_URL = DATABASE_URL;
        execSync("yarn prisma migrate dev");
      }); */
      on("before:spec", () => {
        process.env.DATABASE_URL = DATABASE_URL;
        execSync("yarn prisma migrate dev");
      });
      on("after:spec", async (results) => {
        const client = new Client({
          connectionString: DATABASE_URL,
        });
        await client.connect();
        await client.query(`DROP SCHEMA IF EXISTS "test" CASCADE`);
        await client.end();
      });
    },
  },
  env: {
    // implement environment variables here
    DATABASE_URL,
    TEST_API_KEY: "otpR2iV3sHzmqgRh+UmWVA==", // this key is used on api tests, need to be de same as the one on the .env.test file
  },
});
