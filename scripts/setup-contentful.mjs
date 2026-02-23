/**
 * Contentful Setup Script
 * Creates the caseStudy content type with all fields.
 *
 * Usage:
 *   node scripts/setup-contentful.mjs <CMA_TOKEN>
 *
 * The CMA token must have access to space: dn6s7kpaqpjg
 */

import contentfulManagement from "contentful-management";

const SPACE_ID = "dn6s7kpaqpjg";
const ENVIRONMENT_ID = "master";

const cmaToken = process.argv[2];
if (!cmaToken) {
  console.error("Usage: node scripts/setup-contentful.mjs <CMA_TOKEN>");
  process.exit(1);
}

async function main() {
  const client = contentfulManagement.createClient({ accessToken: cmaToken });

  console.log("Connecting to space...");
  const space = await client.getSpace(SPACE_ID);
  const env = await space.getEnvironment(ENVIRONMENT_ID);
  console.log(`Connected to space: ${space.name}`);

  // Check if content type already exists
  try {
    const existing = await env.getContentType("caseStudy");
    console.log("Content type 'caseStudy' already exists. Updating...");
    existing.name = "Case Study";
    existing.description = "Portfolio case study / project entry";
    existing.displayField = "title";
    existing.fields = getFields();
    const updated = await existing.update();
    await updated.publish();
    console.log("Content type updated and published.");
    return;
  } catch {
    console.log("Creating content type 'caseStudy'...");
  }

  const contentType = await env.createContentTypeWithId("caseStudy", {
    name: "Case Study",
    description: "Portfolio case study / project entry",
    displayField: "title",
    fields: getFields(),
  });

  await contentType.publish();
  console.log("Content type 'caseStudy' created and published!");
}

function getFields() {
  return [
    {
      id: "title",
      name: "Title",
      type: "Symbol",
      required: true,
      localized: false,
    },
    {
      id: "slug",
      name: "Slug",
      type: "Symbol",
      required: true,
      localized: false,
      validations: [
        { unique: true },
        { regexp: { pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$", flags: null } },
      ],
    },
    {
      id: "subtitle",
      name: "Subtitle",
      type: "Symbol",
      required: true,
      localized: false,
    },
    {
      id: "client",
      name: "Client",
      type: "Symbol",
      required: true,
      localized: false,
    },
    {
      id: "year",
      name: "Year",
      type: "Integer",
      required: true,
      localized: false,
    },
    {
      id: "location",
      name: "Location",
      type: "Symbol",
      required: true,
      localized: false,
    },
    {
      id: "category",
      name: "Category",
      type: "Symbol",
      required: true,
      localized: false,
      validations: [
        {
          in: [
            "facade-design",
            "algorithmic-systems",
            "fabrication-planning",
            "landscape-urban",
            "interior",
          ],
        },
      ],
    },
    {
      id: "status",
      name: "Status",
      type: "Symbol",
      required: true,
      localized: false,
    },
    {
      id: "collaborators",
      name: "Collaborators",
      type: "Symbol",
      required: false,
      localized: false,
    },
    {
      id: "order",
      name: "Order",
      type: "Integer",
      required: false,
      localized: false,
    },
    {
      id: "thumbnail",
      name: "Thumbnail",
      type: "Link",
      linkType: "Asset",
      required: true,
      localized: false,
      validations: [{ linkMimetypeGroup: ["image"] }],
    },
    {
      id: "heroImage",
      name: "Hero Image",
      type: "Link",
      linkType: "Asset",
      required: true,
      localized: false,
      validations: [{ linkMimetypeGroup: ["image"] }],
    },
    {
      id: "body",
      name: "Body",
      type: "Text",
      required: true,
      localized: false,
    },
    {
      id: "projectImages",
      name: "Project Images",
      type: "Array",
      required: false,
      localized: false,
      items: {
        type: "Link",
        linkType: "Asset",
        validations: [{ linkMimetypeGroup: ["image"] }],
      },
    },
    {
      id: "bodyMedia",
      name: "Body Media",
      type: "Array",
      required: false,
      localized: false,
      items: {
        type: "Link",
        linkType: "Asset",
        validations: [{ linkMimetypeGroup: ["image", "video"] }],
      },
    },
  ];
}

main().catch((err) => {
  console.error("Setup failed:", err.message);
  process.exit(1);
});
