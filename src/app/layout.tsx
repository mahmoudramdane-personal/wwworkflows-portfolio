import type { Metadata } from "next";
import { Archivo, Martian_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const martian = Martian_Mono({
  variable: "--font-martian",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wwworkflows.com"),
  title: {
    default: "WWWORKFLOWS — Design computationnel et intelligence artificielle pour les architectes",
    template: "%s — WWWORKFLOWS",
  },
  description:
    "Un partenaire créatif pour les architectes et designers. Nous développons des workflows algorithmiques, avec le design computationnel et l'intelligence artificielle, qui aident à imaginer, modéliser et produire.",
  openGraph: {
    siteName: "WWWORKFLOWS",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 400,
        height: 214,
        alt: "WWWORKFLOWS",
      },
    ],
  },
  twitter: {
    card: "summary",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${archivo.variable} ${martian.variable} font-sans antialiased bg-papier text-encre`}>
        <Header />
        <main className="pt-16">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
