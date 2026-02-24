import contentful from "contentful-management";

const CMA_TOKEN = process.env.CONTENTFUL_CMA_TOKEN;
const SPACE_ID = "dn6s7kpaqpjg";

async function main() {
  const cma = contentful.createClient({ accessToken: CMA_TOKEN });
  const spaces = await cma.getSpaces();
  const space = spaces.items.find((s) => s.sys.id === SPACE_ID);
  const env = await space.getEnvironment("master");

  // =============================================
  // 1. UPDATE ABOUT PAGE
  // =============================================
  console.log("Updating About page...");
  const aboutEntries = await env.getEntries({ content_type: "aboutPage", limit: 1 });
  if (aboutEntries.items.length) {
    const about = aboutEntries.items[0];
    about.fields.intro = {
      "en-US": `Nous contribuons à la réalisation de structures complexes, de géométries de forme libre et à l'automatisation des processus de conception et de fabrication grâce à la planification paramétrique en 3D et l'interopérabilité BIM.

Chez Workflows, nous disposons d'une expertise, d'une flexibilité de service et d'une performance orientée projet. Nous portons une double casquette : architectes designers et technologistes.

Notre motivation est de réaliser des projets non-standards à travers l'utilisation créative de la technologie. La clé du succès réside dans la création d'algorithmes exclusifs, développés sur la base de projets spécifiques.

Notre objectif est de combiner complexité technique et cohérence esthétique. L'approche innovante des projets oblige à penser au-delà des normes établies. Nous nous appuyons sur un vaste réseau international d'architectes, de programmeurs, d'artistes, de planificateurs spécialisés et d'entreprises de fabrication.`
    };

    about.fields.services = {
      "en-US": JSON.stringify([
        { title: "Design de Systèmes de Façade", description: "Approche paramétrique pour le design de façades complexes, murs-rideaux et systèmes double peau." },
        { title: "Panelisation & Optimisation", description: "Rationalisation géométrique, optimisation de panneaux et découpe pour la fabrication digitale." },
        { title: "Études de Faisabilité", description: "Analyse de faisabilité technique et géométrique pour des géométries complexes et non-standards." },
        { title: "Form Finding & Structures Complexes", description: "Recherche de forme structurelle, optimisation topologique et modélisation de structures à géométrie libre." },
        { title: "Design d'Ornement", description: "Systèmes paramétriques de moucharabieh, motifs génératifs et patterns architecturaux." },
        { title: "Landscape Design", description: "Design paramétrique paysager, topographie algorithmique et aménagement urbain génératif." }
      ])
    };

    about.fields.tools = { "en-US": "Rhino, Grasshopper, Revit, Python, Ladybug, Hops, Lumion, AutoCAD, Miro" };

    await about.update();
    const updated = await env.getEntry(about.sys.id);
    await updated.publish();
    console.log("✓ About page updated");
  }

  // =============================================
  // 2. ADD PHONE FIELD TO CONTACT TYPE + UPDATE
  // =============================================
  console.log("Adding phone to contact...");
  try {
    const contactType = await env.getContentType("contactPage");
    if (!contactType.fields.find((f) => f.id === "phone")) {
      contactType.fields.push({
        id: "phone",
        name: "Phone",
        type: "Symbol",
        required: false,
      });
      await contactType.update();
      const updatedType = await env.getContentType("contactPage");
      await updatedType.publish();
      console.log("✓ Phone field added to contactPage type");
    }
  } catch (e) {
    console.log("Phone field might already exist:", e.message);
  }

  const contactEntries = await env.getEntries({ content_type: "contactPage", limit: 1 });
  if (contactEntries.items.length) {
    const contact = contactEntries.items[0];
    contact.fields.phone = { "en-US": "+212 6 23 63 32 22" };
    await contact.update();
    const updatedContact = await env.getEntry(contact.sys.id);
    await updatedContact.publish();
    console.log("✓ Contact page updated with phone");
  }

  // =============================================
  // 3. CREATE 5 PLACEHOLDER PROJECTS
  // =============================================
  console.log("Creating placeholder projects...");

  const projects = [
    {
      title: "WWW × ILO – Technology Lab OCP",
      slug: "www-ilo-technology-lab-ocp",
      subtitle: "Design computationnel de la façade du laboratoire technologique ILO pour OCP.",
      client: "Orange Ateliers",
      category: "facade-design",
      year: 2022,
      location: "Khouribga, Maroc",
      status: "Livré",
      collaborators: "Orange Ateliers",
      body: "## ILO – Technology Lab OCP\n\nProjet de design computationnel pour la façade du laboratoire technologique ILO, réalisé pour OCP en collaboration avec Orange Ateliers.\n\nContenu détaillé à venir.",
      order: 3,
    },
    {
      title: "WWW × Borj Fez – Rénovation de Façade",
      slug: "www-borj-fez-facade-renovation",
      subtitle: "Rénovation paramétrique de la façade et identité visuelle du centre commercial Borj Fez.",
      client: "Orange Ateliers",
      category: "facade-design",
      year: 2023,
      location: "Fès, Maroc",
      status: "En cours",
      collaborators: "Orange Ateliers",
      body: "## Borj Fez – Façade Renovation & Brand Identity\n\nDesign paramétrique pour la rénovation de la façade et l'intégration de l'identité visuelle du centre commercial Borj Fez.\n\nContenu détaillé à venir.",
      order: 4,
    },
    {
      title: "WWW × MED VI Tower – Lobby Ceiling",
      slug: "www-med-vi-tower-lobby-ceiling",
      subtitle: "Système de panneaux de plafond pour le lobby de la Tour Mohammed VI — analyse de courbure et faisabilité.",
      client: "CMS Company",
      category: "fabrication-planning",
      year: 2023,
      location: "Rabat, Maroc",
      status: "Livré",
      collaborators: "CMS Company",
      body: "## MED VI Tower – Lobby Ceiling Panelling System\n\nDesign et analyse de courbure pour le système de panneaux du plafond du lobby d'entrée de la Tour Mohammed VI.\n\nContenu détaillé à venir.",
      order: 5,
    },
    {
      title: "WWW × Stade La Poste – Concours",
      slug: "www-stade-la-poste-concours",
      subtitle: "Phase concours pour le stade La Poste — design paramétrique de la structure et de l'enveloppe.",
      client: "STILL Industries",
      category: "algorithmic-systems",
      year: 2023,
      location: "Maroc",
      status: "Concours",
      collaborators: "STILL Industries",
      body: "## Stade La Poste – Phase Concours\n\nDesign paramétrique de la structure et de l'enveloppe du stade dans le cadre d'un concours d'architecture.\n\nContenu détaillé à venir.",
      order: 6,
    },
    {
      title: "WWW × Stade Mly Hassan – Rabat",
      slug: "www-stade-mly-hassan-rabat",
      subtitle: "Modélisation BIM et système structurel paramétrique du stade Moulay Hassan à Rabat.",
      client: "UrbanArchiStudio",
      category: "algorithmic-systems",
      year: 2024,
      location: "Rabat, Maroc",
      status: "En cours",
      collaborators: "UrbanArchiStudio",
      body: "## Stade Mly Hassan – Rabat\n\nDéveloppement du système structurel paramétrique et modélisation BIM complète du stade Moulay Hassan.\n\nContenu détaillé à venir.",
      order: 7,
    },
  ];

  for (const proj of projects) {
    // Check if already exists
    const existing = await env.getEntries({
      content_type: "caseStudy",
      "fields.slug": proj.slug,
      limit: 1,
    });
    if (existing.items.length) {
      console.log(`  ↳ Skipping "${proj.title}" (already exists)`);
      continue;
    }

    const entry = await env.createEntry("caseStudy", {
      fields: {
        title: { "en-US": proj.title },
        slug: { "en-US": proj.slug },
        subtitle: { "en-US": proj.subtitle },
        client: { "en-US": proj.client },
        category: { "en-US": proj.category },
        year: { "en-US": proj.year },
        location: { "en-US": proj.location },
        status: { "en-US": proj.status },
        collaborators: { "en-US": proj.collaborators },
        body: { "en-US": proj.body },
        order: { "en-US": proj.order },
      },
    });
    // Don't publish — they have no images yet, publish would fail on required fields
    console.log(`  ✓ Created draft: "${proj.title}" (id: ${entry.sys.id})`);
  }

  console.log("\n✅ All done!");
}

main().catch(console.error);
