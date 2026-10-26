---
type: project
title: Un turban pour un stade
slug: uas-stade
subtitle: >-
  Trois semaines pour trouver l'enveloppe d'un stade, l'organiser et la faire
  entrer dans Revit.
client: Urban Archi Studio
year: 2024
location: 'Rabat, Maroc'
order: 1
category: facade-design
status: Concours
collaborators: Urban Archi Studio
thumbnail: rendu-principal.webp
heroImage: rendu-principal.webp
---

{{construction:uas-construction|Le bowl existant#A9A49B:La pelouse, le socle et les gradins reçus de l'agence.|Les poteaux#2F5DA8:Les fûts en béton, 104 poteaux principaux et 364 poteaux secondaires.|La sous-structure#2F5DA8:La sous-structure de façade, sur trois niveaux.|Les rubans#D0566F:Les quatre rubans de la peau, enroulés autour du bowl.|La structure de toiture#16666B:Structure, poutres de rive, câbles et porte-écrans.|La membrane#BFE0DB:La membrane et le polycarbonate qui couvrent les tribunes.}}

> Une agence a déjà dessiné les gradins de son stade. Il lui reste trois semaines pour trouver l'enveloppe, l'organiser et la faire entrer dans Revit. Récit d'un système construit à deux.

**Mission** : conseil en design computationnel · **Durée** : 3 semaines, juillet 2024 · **Outils** : Rhino, Grasshopper, Kangaroo, Rhino.Inside.Revit, Revit

## Le contexte

Urban Archi Studio prépare sa réponse au concours du stade Prince Moulay El Hassan, à Rabat. Le cœur du projet existe : le bowl, c'est-à-dire l'anneau des gradins autour de la pelouse. Il manque ce que le public verra d'abord, l'enveloppe.

![[01-site-avenue.webp]]

*Le site aujourd'hui, depuis l'avenue.*

L'agence veut une double peau : une façade extérieure qui habille le stade, et derrière elle, l'ossature qui la porte. Le linéaire fait près de 570 mètres pour une trentaine de mètres de haut. Le rendu du concours tombe trois semaines plus tard.

![[02-bowl-existant.webp]]

*Le point de départ : le bowl reçu de l'agence, avec ses premiers axes.*

## La difficulté

Dessiner une belle courbe autour d'un stade est facile. La garder cohérente quand tout bouge l'est beaucoup moins.

Chaque choix en entraîne d'autres. Si la peau monte, les poteaux s'allongent. Si l'on change le matériau, verre, membrane ou bandes pleines, le rythme de l'ossature change aussi. Et pendant un concours, les plans de l'agence évoluent chaque semaine. Un modèle dessiné à la main aurait été à refaire à chaque échange.

La vraie question était donc de trouver le bon compromis entre la peau et ce qu'elle cache. Il fallait pouvoir le chercher longtemps, sans tout redessiner.

## L'idée : le turban

Au premier échange, sur un tableau Miro partagé, une image s'est imposée : le turban marocain. Une bande de tissu qui s'enroule sur elle-même, se croise, se superpose et laisse voir des jours entre ses tours.

![[03-croquis-turban.webp]]

*Premier croquis : des bandes qui s'enroulent et se croisent.*

Transposée au stade, l'image donne des rubans. Plusieurs couches s'enroulent autour du bowl, s'écartent pour laisser entrer la lumière et se resserrent pour abriter les tribunes. L'idée était simple à dire. Il fallait maintenant un système pour la tenir.

![[04-rubans.webp]]

## Le système mis en place

**1. Une forme pilotée, pas dessinée.** La forme générale est construite dans Grasshopper à partir du bowl reçu de l'agence. Une centaine de Number Sliders règlent la hauteur, l'inclinaison, le nombre de rubans et leurs écarts. En deux semaines, cinq itérations ont été comparées côte à côte, en maquette et depuis la rue, avec les bâtiments voisins.

![[05-iterations.mp4]]

**2. Plusieurs habillages essayés sur la même base.** Peau vitrée, lames, bandes pleines, coussins de membrane gonflés simulés avec Kangaroo : chaque variante s'appuie sur les mêmes courbes de base. Changer de matériau ne demande pas de recommencer.

![[06-habillages.webp]]

*Quatre habillages sur les mêmes courbes de base.*

**3. Une ossature qui suit la peau.** Une fois la forme choisie, le même script génère tout ce qui la porte : 104 poteaux principaux, 364 poteaux secondaires, une sous-structure sur trois niveaux, les câbles et la toiture. Quand l'agence déplace un axe, l'ensemble se recalcule.

{{eclate:uas-ossature|Bowl existant#A9A49B|Ossature de façade#2F5DA8|Peau en rubans#D0566F|Structure de toiture#16666B|Membrane#BFE0DB}}

*Ce que la peau cache : survolez l'image pour séparer les couches, du bowl existant jusqu'à la membrane de toiture.*

**4. Un modèle rangé pour être partagé.** Chaque famille d'éléments est bakée sur son propre calque, avec ses informations attachées (User Keys et User Values) : la façade, la toiture, les courbes de base, les rubans. Le modèle final compte plus de 5 200 éléments répartis en 42 calques. Un collaborateur qui l'ouvre sait tout de suite ce qu'il regarde.

![[08-modele-calques.webp]]

**5. Un passage direct vers Revit.** Les éléments partent dans Revit par Rhino.Inside.Revit, typologie par typologie. L'équipe de l'agence documente dans son outil habituel, sans réimport ni ressaisie. La toiture est aussi exportée dans les formats que demandaient ses autres logiciels.

![[09-revit.webp]]

## Le résultat

Trois semaines après le premier croquis, Urban Archi Studio disposait de trois choses :

- une enveloppe au parti clair, le turban, défendable devant un jury ;
- un modèle 3D complet et ordonné, de la peau jusqu'aux poteaux ;
- ce même modèle dans Revit, prêt pour les plans et les rendus du concours.

Le modèle 3D remis à l'agence, vu de tous les côtés :

{{vues:uas-vues|so:Sud-ouest|se:Sud-est|ne:Nord-est|no:Nord-ouest|rasante:Vue rasante|plan:Plan}}

![[10-depuis-la-rue.webp]]

*Depuis la rue : les rubans à hauteur de piéton.*

![[11-couches.webp]]

*Variante en peau vitrée, sur les mêmes courbes de base.*

![[12-interieur.webp]]

*Depuis les tribunes. Rendus d'essai du concours.*

Surtout, l'agence a gardé la main jusqu'au bout. Chaque retour de sa part s'est traduit par un réglage, pas par un nouveau dessin.

## Ce que l'on en retient

Sur un projet de cette taille, le temps se perd à refaire, pas à concevoir. En construisant d'abord le système (des courbes de base, des paramètres, un rangement, un pont vers Revit), on a rendu les décisions réversibles. L'architecte peut alors faire ce pour quoi il est là : comparer, choisir et affiner.

**Des agences augmentées, de l'algorithme à l'IA.**

---

*Votre agence prépare un concours ou une façade complexe ? WWWORKFLOWS met en place avec vos équipes les outils et la méthode pour garder la main sur la forme jusqu'au rendu.*
