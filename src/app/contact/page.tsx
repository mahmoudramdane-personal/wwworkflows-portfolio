export default function ContactPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12">
      <section className="pt-24 pb-16 md:pt-32 md:pb-20">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900">
          Contact
        </h1>
      </section>

      <section className="max-w-xl space-y-12 pb-24">
        <p className="text-neutral-600 text-base leading-[1.8] tracking-wide">
          For project inquiries, consultations, or collaborations — get in
          touch.
        </p>

        <div className="space-y-6">
          <ContactItem label="Email" value="hello@wwworkflows.com" href="mailto:hello@wwworkflows.com" />
          <ContactItem label="LinkedIn" value="WWWorkflows" href="https://linkedin.com" />
          <ContactItem label="Instagram" value="@wwworkflows" href="https://instagram.com" />
        </div>

        <div className="border-t border-black/10 pt-8">
          <p className="text-neutral-400 text-xs tracking-wide leading-relaxed">
            Based in Morocco. Working internationally.
          </p>
        </div>
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
