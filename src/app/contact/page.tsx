import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Un projet, une formation d'équipe, un conseil : écrivez à WWWORKFLOWS.",
};

// Page Contact : le bloc de contact est celui du footer (le même qu'en bas de l'accueil) ;
// la page n'ajoute rien devant, on arrive directement sur le fondu puis le contact.
export default function ContactPage() {
  return <h1 className="sr-only">Contact</h1>;
}
