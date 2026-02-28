import contentful from "contentful-management";
import { readFileSync } from "fs";

const CMA_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID || "dn6s7kpaqpjg";
const ENTRY_ID = "2GHolc9hziVM9kuugYHkxT";

// Read the markdown body from file
const markdownBody = readFileSync("scripts/yda-body.md", "utf-8");

async function main() {
  const client = contentful.createClient({ accessToken: CMA_TOKEN });
  const spaces = await client.getSpaces();
  const space = spaces.items.find((s) => s.sys.id === SPACE_ID);
  if (!space) throw new Error("Space not found");

  const env = await space.getEnvironment("master");
  const entry = await env.getEntry(ENTRY_ID);

  entry.fields.body = { "en-US": markdownBody };
  const updated = await entry.update();
  console.log("Entry updated, version:", updated.sys.version);

  const published = await updated.publish();
  console.log("Entry published, version:", published.sys.version);
}

main().catch((e) => console.error("Error:", e.message));
