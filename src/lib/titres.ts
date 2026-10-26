// Intertitres (##) d'un texte en markdown : sert au sommaire et aux ancres des h2.
export function idTitre(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[*_`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function titresDe(body: string): { id: string; texte: string }[] {
  return body
    .split("\n")
    .map((l) => l.match(/^##\s+(.+?)\s*#*\s*$/))
    .filter((m): m is RegExpMatchArray => m !== null)
    .map((m) => {
      const texte = m[1].replace(/[*_`]/g, "");
      return { id: idTitre(texte), texte };
    });
}

export function minutesDeLecture(body: string): number {
  const mots = body.replace(/\{\{.+?\}\}/g, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(mots / 220));
}
