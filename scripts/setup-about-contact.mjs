import contentful from "contentful-management";

const CMA_TOKEN = process.env.CONTENTFUL_CMA_TOKEN;
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID || "dn6s7kpaqpjg";

async function main() {
  const client = contentful.createClient({ accessToken: CMA_TOKEN });
  const spaces = await client.getSpaces();
  const space = spaces.items.find((s) => s.sys.id === SPACE_ID);
  if (!space) throw new Error("Space not found");
  const env = await space.getEnvironment("master");

  // --- About Page ---
  console.log("Creating aboutPage content type...");
  let aboutType;
  try {
    aboutType = await env.getContentType("aboutPage");
    console.log("aboutPage already exists, updating...");
  } catch {
    aboutType = await env.createContentTypeWithId("aboutPage", {
      name: "About Page",
      description: "Content for the About page",
      displayField: "title",
      fields: [
        {
          id: "title",
          name: "Title",
          type: "Symbol",
          required: true,
        },
        {
          id: "intro",
          name: "Intro",
          type: "Text",
          required: true,
        },
        {
          id: "body",
          name: "Body",
          type: "Text",
          required: false,
        },
        {
          id: "services",
          name: "Services (JSON)",
          type: "Text",
          required: false,
        },
        {
          id: "tools",
          name: "Tools (comma-separated)",
          type: "Symbol",
          required: false,
        },
      ],
    });
  }
  await aboutType.publish();
  console.log("aboutPage content type published");

  // --- Contact Page ---
  console.log("Creating contactPage content type...");
  let contactType;
  try {
    contactType = await env.getContentType("contactPage");
    console.log("contactPage already exists, updating...");
  } catch {
    contactType = await env.createContentTypeWithId("contactPage", {
      name: "Contact Page",
      description: "Content for the Contact page",
      displayField: "title",
      fields: [
        {
          id: "title",
          name: "Title",
          type: "Symbol",
          required: true,
        },
        {
          id: "intro",
          name: "Intro Text",
          type: "Text",
          required: false,
        },
        {
          id: "email",
          name: "Email",
          type: "Symbol",
          required: false,
        },
        {
          id: "linkedinUrl",
          name: "LinkedIn URL",
          type: "Symbol",
          required: false,
        },
        {
          id: "linkedinLabel",
          name: "LinkedIn Label",
          type: "Symbol",
          required: false,
        },
        {
          id: "instagramUrl",
          name: "Instagram URL",
          type: "Symbol",
          required: false,
        },
        {
          id: "instagramLabel",
          name: "Instagram Label",
          type: "Symbol",
          required: false,
        },
        {
          id: "footerNote",
          name: "Footer Note",
          type: "Symbol",
          required: false,
        },
      ],
    });
  }
  await contactType.publish();
  console.log("contactPage content type published");

  // --- Seed About entry ---
  console.log("Creating About entry...");
  const aboutEntry = await env.createEntry("aboutPage", {
    fields: {
      title: { "en-US": "About" },
      intro: {
        "en-US":
          "WWWorkflows is a computational design studio specializing in algorithmic systems for architecture and construction. We develop parametric tools that compress design timelines, absorb late-stage changes, and bridge the gap between digital geometry and physical fabrication.\n\nOur work spans facade design, fabrication planning, landscape automation, and digital process consulting. We collaborate with architecture firms, developers, and contractors — providing Computational Design as a Service.",
      },
      services: {
        "en-US": JSON.stringify([
          {
            title: "Facade Systems",
            description:
              "Parametric facade design, double-skin systems, panel optimization, and curtain wall algorithms.",
          },
          {
            title: "Algorithmic Design",
            description:
              "Generative design tools, form-finding, and optimization scripts for architectural projects.",
          },
          {
            title: "Fabrication Planning",
            description:
              "CNC-ready models, assembly planning, and digital-to-physical fabrication workflows.",
          },
          {
            title: "Digital Automation",
            description:
              "Process automation, batch rendering, configurators, and custom Grasshopper tools.",
          },
        ]),
      },
      tools: {
        "en-US":
          "Rhino, Grasshopper, Revit, Ladybug, Python, Hops, Lumion, Miro",
      },
    },
  });
  await aboutEntry.publish();
  console.log("About entry published:", aboutEntry.sys.id);

  // --- Seed Contact entry ---
  console.log("Creating Contact entry...");
  const contactEntry = await env.createEntry("contactPage", {
    fields: {
      title: { "en-US": "Contact" },
      intro: {
        "en-US":
          "For project inquiries, consultations, or collaborations — get in touch.",
      },
      email: { "en-US": "hello@wwworkflows.com" },
      linkedinUrl: { "en-US": "https://linkedin.com" },
      linkedinLabel: { "en-US": "WWWorkflows" },
      instagramUrl: { "en-US": "https://instagram.com" },
      instagramLabel: { "en-US": "@wwworkflows" },
      footerNote: {
        "en-US": "Based in Morocco. Working internationally.",
      },
    },
  });
  await contactEntry.publish();
  console.log("Contact entry published:", contactEntry.sys.id);

  console.log("\nDone! About and Contact content types + entries created.");
}

main().catch((e) => console.error("Error:", e.message));
