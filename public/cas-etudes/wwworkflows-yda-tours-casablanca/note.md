---
type: project
title: 'Trois tours, une seule console'
slug: yda-tours
subtitle: >-
  Trois semaines pour dessiner trois tours d'une même famille, avec quelques
  réglages plutôt que trois façades.
client: YDA Architect
year: 2025
location: 'Casablanca, Maroc'
order: 2
category: facade-design
status: Concours
collaborators: YDA Architect
thumbnail: 00-hero-trois-tours-jour.webp
heroImage: 00-hero-trois-tours-jour.webp
---

{{construction:yda-tours|Le site#e4e3e0:Le terrain et les bâtiments voisins.|Le sol#cbc2b1:Parvis et terrasses calepinés.|Les socles#8e897f:Les socles commerciaux qui portent les tours.|Noyaux et poteaux#2f5da8:Le noyau central et les poteaux de la grande tour.|Les dalles#4f82cf:Des planchers sculptés, découpés étage par étage.|Le vitrage#bfdde3:Le verre suit chaque nez de dalle.|Les montants#2a8584:La trame verticale de la façade, une teinte par tour.|Les obliques#5b4a94:Les éléments inclinés qui donnent son mouvement à la façade.|La peau#a82746:Les lames de la peau extérieure, réglées par le script.|Canopée et mobilier#7fae76:Arbres-canopée, parasols, fontaine et bancs du parvis.}}

> Trois tours, un socle, un parvis, et trois semaines pour un concours. Plutôt que de dessiner trois façades, on a construit une console : quelques réglages qui les dessinent toutes.

**Mission** : conseil en design computationnel · **Durée** : 3 semaines, juin 2025, à distance · **Outils** : Rhino, Grasshopper, Ladybug, Archicad

---

## Le contexte

YDA Architect prépare un concours sur un lot de Casablanca-Anfa. Le programme demande une tour et des émergences. L'agence en fait trois tours de hauteurs différentes, d'environ 60, 33 et 25 mètres, posées sur un socle commun et reliées par un parvis planté.

L'équipe de l'agence travaille sur Archicad. Elle a besoin d'un modèle qui tienne la forme, les façades, le socle et les espaces extérieurs, et qu'elle puisse reprendre pour ses plans et ses rendus. Le rendu du concours tombe trois semaines plus tard, et toute la mission se fait à distance.

![[01-trois-tours-avenue.webp|Trois hauteurs, une même famille de façades, posées sur un socle commun.]]

## La difficulté

Une tour se dessine. Trois tours qui doivent parler la même langue, beaucoup moins.

Chaque tour a sa hauteur, ses retraits et ses découpes. Leurs façades doivent pourtant appartenir à une même famille. Le mur-rideau, ses montants et ses brise-soleil doivent suivre chaque nez de dalle, sur près de deux mille panneaux. Et pendant un concours, tout bouge : la hauteur sous plafond, l'épaisseur des dalles, la coupe d'un volume. Un modèle dessiné à la main aurait été à refaire à chaque échange.

## L'idée : une console

Au lieu de dessiner trois façades, on a dessiné une console. C'est un seul script Grasshopper, avec une poignée de réglages nommés en français, que l'agence peut lire sans connaître le code : « Largeur des panneaux en verre », « Pourcentage des panels obliques », « Pourcentage de fluctuation », « Extrusion des lames ».

On tourne un réglage et les trois tours changent ensemble. Elles restent de la même famille, chacune à son échelle.

![[02-console-obliques.mp4]]

## Le système mis en place

**1. Des volumes réglés, pas dessinés.** Un générateur de niveaux construit les dalles, les planchers vitrés et les socles des trois tours. Il gère aussi les découpes qui sculptent leurs silhouettes. Les hauteurs du rez-de-chaussée, des étages et des acrotères se règlent avec des Number Sliders. Quand l'agence a demandé de passer les dalles de 30 à 20 centimètres, il a suffi d'un réglage.

**2. Des façades qui sortent d'un même script.** La console de façade compte environ 1 500 components et 70 Number Sliders. Elle génère, pour chaque tour, le vitrage, les montants, des obliques réparties au hasard selon un pourcentage, puis les lames de la peau extérieure. Les variantes étudiées, coupe lisse ou décalée, avec ou sans lames verticales, panneaux de 1,40 mètre avec ou sans panneaux de rive, se comparent sans rien redessiner.

![[04-deux-tours.webp]]

![[03-tour-nuit.webp|La nuit, les lames de la peau dessinent la silhouette de la grande tour.]]

**3. Un parvis tiré au sort, puis choisi.** D'autres scripts génèrent la canopée d'arbres, les parasols et le calepinage du parvis. Le calepinage est tiré au hasard plusieurs fois, puis on retient le motif qui sert le mieux le projet. Les bancs, la fontaine sèche et les rampes y trouvent leur place.

![[05-parvis-tirages.mp4]]

{{paire:05-parvis-parasols.webp|06-terrasse-canopee.webp|Le parvis entre les tours, sous la canopée de parasols, et une terrasse du socle.}}

**4. Un modèle rangé pour être partagé.** Chaque famille d'éléments est bakée sur son propre calque, tour par tour : dalles, vitrage, montants, obliques, peau, canopée, mobilier. Elle porte un identifiant de matériau pour les moteurs de rendu. Le modèle final compte près de 12 700 éléments répartis en 83 calques, avec un document qui explique son arborescence. Les itérations de peau sont gardées pour la phase suivante.

{{familles:yda-familles|12 700 éléments sur 83 calques.|Le site#e4e3e0:Le terrain et les bâtiments voisins.|Le sol#cbc2b1:Parvis et terrasses calepinés.|Les socles#8e897f:Les socles commerciaux qui portent les tours.|Noyaux et poteaux#2f5da8:Le noyau central et les poteaux de la grande tour.|Les dalles#4f82cf:Des planchers sculptés, découpés étage par étage.|Le vitrage#bfdde3:Le verre suit chaque nez de dalle.:≈ 1 900|Les montants#2a8584:La trame verticale de la façade, une teinte par tour.:≈ 1 800|Les obliques#5b4a94:Les éléments inclinés, répartis selon un pourcentage réglé dans la console.:≈ 950|La peau#a82746:Les lames de la peau extérieure, réglées par le script.:≈ 1 800|Canopée et mobilier#7fae76:Arbres-canopée, parasols, fontaine et bancs du parvis.}}

**5. Un passage vers l'outil de l'agence.** Les épaisseurs de dalles sont alignées sur celles d'Archicad. Un script tire des maquettes les contours des tours en DWG, pour les plans. Le modèle est livré en Rhino 7 et 8, et une maquette est préparée pour l'impression 3D.

## Le résultat

Trois semaines après le premier échange, YDA Architect disposait de trois choses :

- trois tours d'une même famille, aux façades réglables ;
- un parvis et une canopée dessinés avec le même soin que les tours ;
- un modèle 3D complet et rangé, prêt pour le rendu et la production.

Surtout, l'agence a gardé la main jusqu'au rendu. Chaque demande de sa part s'est traduite par un réglage de la console, pas par un nouveau dessin.

![[08-bureau-facade-interieur.webp|La façade vue de l'intérieur : obliques et montants cadrent la vue sur le parvis.]]

![[07-facade.webp]]

## Ce que l'on en retient

Quand trois bâtiments doivent parler la même langue, il vaut mieux écrire la langue que les bâtiments. Une console bien nommée met le système entre les mains de l'architecte. Il n'a plus besoin d'un spécialiste pour essayer une idée : il tourne un réglage et regarde.

**Des agences augmentées, de l'algorithme à l'IA.**

---

*Rendus photoréalistes : YDA Architect.*

*Votre agence prépare un concours avec plusieurs bâtiments, ou une façade à décliner ? WWWORKFLOWS met en place avec vos équipes les outils et la méthode pour garder la main sur la forme jusqu'au rendu.*
