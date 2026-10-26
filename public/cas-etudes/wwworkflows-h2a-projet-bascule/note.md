---
title: Des joysticks pour une façade
subtitle: >-
  Une façade qui se recompose seule quand les plans changent, pour un immeuble
  mixte à l'entrée de Mons.
client: H2A Ir Architecte & Associés
year: 2025
location: 'Mons, Belgique'
category: facade-design
status: Esquisse
collaborators: ''
order: 3
thumbnail: thumbnail.webp
---

{{construction:h2a-facade|Les dalles#8e8e8e:Le script part des niveaux et construit les planchers, étage par étage.|Les nez de dalle#B5B3AE:Les horizontales qui dessinent chaque étage.|Les fenêtres#3b5bdb:Plan A en bleu, plan B en magenta, en alternance d'un étage à l'autre.|Les garde-corps#8fb35a:Garde-corps des coursives et des terrasses.|Les rideaux#2A938B:Les rideaux semi-ouverts.|Les lames#c9c1b0:La double peau de lames verticales, 40 × 10 cm tous les 60 cm.}}

> Une agence dessine ses plans et sa façade en même temps, et les plans bougent encore. Voici un système de façade qui suit les plans au lieu d'être redessiné à chaque version.

**Mission** : conseil en design computationnel · **Durée** : une dizaine de jours, mars 2025 · **Outils** : Rhino, Grasshopper, Lumion

---

## Le contexte

À l'entrée est de Mons, sur la chaussée de Binche, un carrefour sépare la ville du campus universitaire. H2A y prépare un immeuble mixte : commerces et restauration au rez-de-chaussée, une crèche, un cabinet médical, des logements pour étudiants et jeunes actifs dans les étages, et un hub de mobilité avec son abri bus sur toute la longueur de la parcelle.

La parcelle est longue et étroite : 105 mètres sur 21, avec plus de trois mètres de dénivelé. Après une dizaine d'esquisses, l'agence a retenu un volume souple aux angles arrondis, quatre étages de logements au-dessus d'un socle vitré. Il lui restait à habiller ce volume.

![[bascule-intro.webp]]

## La difficulté

Une façade de logements traduit ce qui se passe derrière elle : une fenêtre ici parce qu'il y a une chambre, une terrasse là parce qu'un séjour s'y ouvre. Or les plans d'H2A n'étaient pas figés. L'agence nous avait prévenus : les portes-fenêtres et les terrasses allaient encore changer de place.

Dessiner la façade à la main, c'était la redessiner à chaque nouvelle version des plans. Il fallait au contraire qu'elle se recompose seule quand un plan change.

![[analyse-plans.webp]]

## Le système mis en place

**1. Une enveloppe pleine, étage par étage.** Le script part des niveaux du bâtiment et construit une enveloppe fermée. Il en retire d'abord la bande des coursives et des terrasses, 2,20 mètres de profondeur, pour obtenir le volume réellement habité.

![[joystick-1-planchers.webp]]

**2. Des « volumes joystick » qui creusent la façade.** Ce sont de simples boîtes paramétriques, posées sur les ouvertures des plans : porte-fenêtre, accès à une terrasse, passage de coursive. Chaque boîte creuse l'enveloppe là où elle se trouve. Déplacer une ouverture dans le plan, c'est déplacer sa boîte, et la façade suit. Les vides ne sont jamais arbitraires : ils sont là où la vie intérieure les demande.

![[joystick-2-volumes.webp]]

![[joystick-rendu.webp]]

**3. Un ratio plein / vide réglé en direct.** Avec 68 Number Sliders, on règle la taille des boîtes, leur nombre et la proportion entre surfaces pleines et ouvertes. Chaque réglage se voit aussitôt, en maquette comme en rendu, depuis la rue.

![[ratio-plein-vide-1.webp]]

![[ratio-plein-vide-2.webp]]

**4. Deux plans types en alternance.** H2A avait étudié deux versions du plan d'étage. Plutôt que d'en choisir une, nous les avons alternées : la première aux 1er et 3e étages, la seconde aux 2e et 4e.

![[alternance-plans.webp]]

Les ouvertures se décalent d'un étage à l'autre et dessinent un rythme en quinconce, sans qu'aucune ne soit placée pour l'effet.

![[alternance-elevation.webp]]

**5. Une double peau de lames verticales.** Devant l'enveloppe, une peau de lames enveloppe tout le volume. Deux profondeurs de lames (30 et 40 cm) et deux espacements (60 et 80 cm) ont été comparés, chaque combinaison sur son propre calque, avec des vues depuis la coursive pour juger la lumière entre les lames. Le choix s'est arrêté sur des lames de 40 × 10 cm espacées de 60 cm.

Dans le script, une lame n'est pas dessinée : c'est une profondeur, une épaisseur et un espacement. Changer un chiffre redessine toute la double peau. Essayez-le sur un fragment de la façade, à l'angle arrondi : les quatre combinaisons comparées sont en raccourci, et vous pouvez aller au-delà, jusqu'aux rythmes quinconce, aléatoire et crescendo.

{{module:h2a-lames}}

![[bardage-coursive.webp]]

**6. Tout le reste généré par le même script.** Dalles et nez de dalle, fenêtres, garde-corps, rideaux semi-ouverts : chaque famille est bakée sur son calque, avec ses informations attachées. La maquette finale compte plus de 10 600 éléments rangés en 42 calques.

{{familles:h2a-familles|Plus de 10 600 éléments rangés en 42 calques.|Les dalles#8e8e8e:Les planchers et le socle, étage par étage.|Les nez de dalle#B5B3AE:Les horizontales qui dessinent chaque étage.|Les fenêtres#3b5bdb:Fenêtres et portes-fenêtres, chacune à la place d'une pièce du plan.|Les garde-corps#8fb35a:Les garde-corps des coursives et des terrasses.|Les rideaux#2A938B:Les rideaux semi-ouverts.|La double peau#c9c1b0:Les lames verticales, 40 × 10 cm tous les 60 cm.}}

## Les variantes explorées

Une fois le système en place, explorer ne coûte presque rien. Avec H2A, nous avons ouvert plusieurs pistes à partir de rendus rapides : des couleurs vives pour marquer l'entrée de ville, des semi-transparences, des fenêtres en bandeau pour les chambres, des espacements de lames cassés, aléatoires ou en quinconce, des rythmes qui montent ou descendent avec la hauteur, une double peau propre aux coursives, un jeu sur le profil des nez de dalle.

![[variantes-1.webp]]

![[variantes-2.webp]]

![[materiaux-facade.webp]]

## Le résultat

En une dizaine de jours, H2A disposait de trois choses :

- une façade dont chaque ouverture correspond à une pièce, défendable devant la ville et le maître d'ouvrage ;
- une série de rendus de jour et de nuit, sur les quatre façades, pour comparer les variantes ;
- un système capable d'absorber les prochaines versions des plans sans que la façade soit redessinée.

![[bascule.webp]]

## Ce que l'on en retient

Quand les plans et la façade avancent en même temps, le temps se perd à refaire la façade, pas à la concevoir. En reliant chaque ouverture à une boîte que l'on peut déplacer, on a transformé l'incertitude des plans en un réglage. L'architecte garde la main sur ce qui compte : le rythme, la lumière, la matière.

**Des agences augmentées, de l'algorithme à l'IA.**

---

*Cette mission s'est déroulée en phase d'esquisse.*

*Votre agence dessine une façade sur des plans qui bougent encore ? WWWORKFLOWS met en place avec vos équipes les outils et la méthode pour que la façade suive.*
