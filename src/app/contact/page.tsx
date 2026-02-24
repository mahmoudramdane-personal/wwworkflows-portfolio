import { getContactPage } from "@/lib/contentful";

export const revalidate = 60;

export default async function ContactPage() {
  const contact = await getContactPage();

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12">
      <section className="pt-24 pb-16 md:pt-32 md:pb-20">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900">
          {contact.title}
        </h1>
      </section>

      <section className="max-w-xl space-y-12 pb-24">
        {contact.intro && (
          <p className="text-neutral-600 text-sm leading-[1.9] tracking-wide">
            {contact.intro}
          </p>
        )}

        <div className="space-y-6">
          {contact.email && (
            <ContactItem
              label="Email"
              value={contact.email}
              href={`mailto:${contact.email}`}
            />
          )}
          {contact.linkedinLabel && contact.linkedinUrl && (
            <ContactItem
              label="LinkedIn"
              value={contact.linkedinLabel}
              href={contact.linkedinUrl}
            />
          )}
          {contact.instagramLabel && contact.instagramUrl && (
            <ContactItem
              label="Instagram"
              value={contact.instagramLabel}
              href={contact.instagramUrl}
            />
          )}
        </div>

        {contact.footerNote && (
          <div className="border-t border-black/10 pt-8">
            <p className="text-neutral-400 text-xs tracking-wide leading-relaxed">
              {contact.footerNote}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function ContactItem({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <div>
      <dt className="text-neutral-400 text-[10px] tracking-[0.15em] uppercase mb-1">
        {label}
      </dt>
      <dd>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-900 text-sm hover:opacity-60 transition-opacity duration-300"
        >
          {value}
        </a>
      </dd>
    </div>
  );
}
