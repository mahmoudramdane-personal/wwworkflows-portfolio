import contentful from "contentful-management";

const CMA_TOKEN = process.env.CONTENTFUL_CMA_TOKEN;
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID || "dn6s7kpaqpjg";

async function main() {
  const client = contentful.createClient({ accessToken: CMA_TOKEN });
  const spaces = await client.getSpaces();
  const space = spaces.items.find((s) => s.sys.id === SPACE_ID);
  if (!space) throw new Error("Space not found");
  const env = await space.getEnvironment("master");

  // --- Update About entry ---
  console.log("Fetching About entries...");
  const aboutEntries = await env.getEntries({ content_type: "aboutPage" });
  if (aboutEntries.items.length > 0) {
    const about = aboutEntries.items[0];
    about.fields.title = { "en-US": "Studio" };
    about.fields.intro = {
      "en-US":
        "WWWorkflows est un studio de Computational Design spécialisé dans les systèmes algorithmiques pour l'architecture et la construction. Nous développons des outils paramétriques qui compressent les délais de conception, absorbent les modifications tardives et font le lien entre géométrie digitale et fabrication physique.\n\nNotre travail couvre le design de façade, la planification de fabrication, l'automatisation paysagère et le conseil en processus digitaux. Nous collaborons avec des agences d'architecture, des promoteurs et des entreprises — en offrant du Computational Design as a Service.",
    };
    about.fields.services = {
      "en-US": JSON.stringify([
        {
          title: "Systèmes de Façade",
          description:
            "Design paramétrique de façade, systèmes double peau, optimisation de panneaux et algorithmes de mur-rideau.",
        },
        {
          title: "Design Algorithmique",
          description:
            "Outils de design génératif, form-finding et scripts d'optimisation pour projets architecturaux.",
        },
        {
          title: "Planification de Fabrication",
          description:
            "Modèles prêts CNC, planification d'assemblage et workflows de fabrication digitale.",
        },
        {
          title: "Automatisation Digitale",
          description:
            "Automatisation de processus, rendu par lots, configurateurs et outils Grasshopper sur mesure.",
        },
      ]),
    };
    about.fields.tools = {
      "en-US": "Rhino, Grasshopper, Revit, Ladybug, Python, Hops, Lumion, Miro",
    };
    const updated = await about.update();
    await updated.publish();
    console.log("About entry updated to French");
  }

  // --- Update Contact entry ---
  console.log("Fetching Contact entries...");
  const contactEntries = await env.getEntries({ content_type: "contactPage" });
  if (contactEntries.items.length > 0) {
    const contact = contactEntries.items[0];
    contact.fields.title = { "en-US": "Contact" };
    contact.fields.intro = {
      "en-US":
        "Pour toute demande de projet, consultation ou collaboration — contactez-nous.",
    };
    contact.fields.footerNote = {
      "en-US": "Basé au Maroc. Projets à l'international.",
    };
    const updated = await contact.update();
    await updated.publish();
    console.log("Contact entry updated to French");
  }

  console.log("Done!");
}

main().catch((e) => console.error("Error:", e.message));
