const { execSync } = require("child_process");
const { Client } = require("pg");
const NodeEnvironment = require("jest-environment-node").TestEnvironment;

class CustomEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
    this.schema = new Date().toISOString();
    this.connectString = process.env.DATABASE_URL + "_" + this.schema;
  }

  setup() {
    process.env.DATABASE_URL = this.connectString;
    this.global.process.env.DATABASE_URL = this.connectString;

    execSync(`prisma migrate dev`);
  }

  async teardown() {
    const client = new Client({
      connectionString: this.connectString,
    });
    await client.connect();
    await client.query(`DROP SCHEMA IF EXISTS "test_${this.schema}" CASCADE`);
    await client.end();
  }
}

module.exports = CustomEnvironment;
