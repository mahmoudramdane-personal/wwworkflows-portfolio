# Guide de Rédaction Obsidian → WWWorkflows

Ce guide décrit exactement comment écrire un article ou un projet dans Obsidian pour qu’il soit publié sur le site avec une seule commande.

---

## Structure de dossier attendue

Chaque note doit être dans son propre dossier avec un sous-dossier `attachments/` :

```
Articles/
  Mon Article/
    note.md              ← ton fichier Obsidian
    attachments/
      hero.jpg           ← images, GIFs, vidéos
      diagram.gif
      process.mp4
```

> **Important :** Pas d’espaces dans les noms de fichiers des images.
> Utiliser des tirets : `facade-diagram.png` et non `facade diagram.png`.

---

## Frontmatter — Article

Copie ce bloc en haut de chaque article et remplis les champs :

```yaml
---
type: article
title: "Titre de l’article"
slug: titre-de-larticle
date: 2026-02-24
excerpt: "Une ou deux phrases qui résument l’article. Ce texte apparaît dans la liste des articles et dans les previews LinkedIn/WhatsApp."
category: Insights
thumbnail: attachments/hero.jpg
order: 1
---
```

### Champs requis
| Champ | Description |
|-------|-------------|
| `type` | Toujours `article` |
| `title` | Titre complet |
| `slug` | URL de la page — minuscules, tirets, sans accents (`mon-article`) |
| `date` | Format `YYYY-MM-DD` |
| `excerpt` | Résumé court (1–2 phrases, 100–160 caractères idéal) |
| `thumbnail` | Chemin vers l’image de couverture dans `attachments/` |

### Champs optionnels
| Champ | Description |
|-------|-------------|
| `category` | Catégorie libre (`Insights`, `Méthodes`, `Projets`, etc.) |
| `order` | Ordre d’affichage (1 = premier) |

---

## Frontmatter — Projet (Case Study)

```yaml
---
type: project
title: "Nom du Projet"
slug: nom-du-projet
subtitle: "Une phrase qui décrit le projet"
client: "Nom du Client"
year: 2024
location: "Casablanca, Maroc"
category: facade-design
status: "Livré"
collaborators: "Collaborateur A, Collaborateur B"
order: 1
thumbnail: attachments/thumbnail.jpg
heroImage: attachments/hero-full.jpg
---
```

### Valeurs de `category`
| Valeur | Label affiché |
|--------|---------------|
| `facade-design` | Design de Façade |
| `algorithmic-systems` | Systèmes Algorithmiques |
| `fabrication-planning` | Planification de Fabrication |
| `landscape-urban` | Paysage & Urbanisme |
| `interior` | Intérieur |

---

## Embeds dans le corps de l’article

### Image standard
Utilise les wiki-links Obsidian ou le markdown standard :

```markdown
![[nom-image.jpg]]
```
ou
```markdown
![](./attachments/nom-image.jpg)
```

→ Affiché en pleine largeur sur le site.

### GIF animé
```markdown
![[animation.gif]]
```
→ Le script le convertit en WebP animé (même animation, taille réduite de 40–70%).

### Vidéo MP4
```markdown
![[process-timelapse.mp4]]
```
→ Affiché avec un lecteur vidéo natif (play/pause, plein écran).

### YouTube
Colle simplement l’URL sur sa propre ligne, sans rien d’autre :

```markdown
https://youtu.be/dQw4w9WgXcQ
```
ou
```markdown
https://www.youtube.com/watch?v=dQw4w9WgXcQ
```
→ Intégré en iframe 16:9.

---

## Mise en forme du texte (Markdown standard)

```markdown
## Titre de section

### Sous-titre

Paragraphe normal avec du **texte en gras** et de l’*italique*.

- Élément de liste
- Autre élément

> Citation ou note importante

---

| Colonne A | Colonne B |
|-----------|-----------|
| Valeur 1  | Valeur 2  |
```

---

## Conventions de nommage des fichiers

| À faire | À éviter |
|---------|----------|
| `facade-diagram.png` | `facade diagram.png` |
| `hero-image.jpg` | `HeroImage.jpg` |
| `process-v2.gif` | `process (v2).gif` |
| `mon-article` (slug) | `Mon Article` (slug) |

---

## Checklist avant de publier

- [ ] Le frontmatter est complet (tous les champs requis remplis)
- [ ] Le `slug` est unique, en minuscules, sans espaces ni accents
- [ ] La `thumbnail` existe dans `attachments/`
- [ ] Tous les noms de fichiers dans `attachments/` sont sans espaces
- [ ] `CONTENTFUL_MANAGEMENT_TOKEN` est dans `.env.local`

## Commande de publication

```bash
npm run publish-note "C:/chemin/vers/Obsidian/Articles/Mon Article/note.md"
```

L’article sera en ligne en moins de 60 secondes.

---

## Optimisations automatiques

Le script s’occupe automatiquement de tout cela :

| Format source | Résultat |
|---------------|----------|
| `.jpg` / `.png` | WebP, max 1200px (corps) ou 2400px (hero/thumbnail) |
| `.gif` | WebP animé (même animation, −40 à −70% de taille) |
| `.mp4` | Passé tel quel |
| Lien YouTube | Embed iframe 16:9 |
