import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wwworkflows.com"),
  title: {
    default: "WWWorkflows — Studio de Design Computationnel",
    template: "%s — WWWorkflows",
  },
  description:
    "Computational Design as a Service. Systèmes algorithmiques de façade, planification paramétrique de fabrication et automatisation digitale pour l'architecture.",
  openGraph: {
    siteName: "WWWorkflows",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} font-sans antialiased bg-[#f1f1f1] text-neutral-900`}>
        <Header />
        <main className="pt-16">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
