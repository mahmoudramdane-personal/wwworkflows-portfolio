# WWWorkflows × YDA — Cas d'étude
## Conception algorithmique de façade — Trois tours à Casablanca

**Client :** Younes Diouri Architectes (YDA)
**Mission :** Consulting en Computational Design
**Livrables :** Système façade génératif + déclinaison esthétique
**Phase :** Concours d'architecture — Lot 7.1
**Date :** Mai – Juin 2025

---

## Contexte

WWWorkflows a été mandaté par Younes Diouri pour une consultation en conception algorithmique sur un projet de tours à Casablanca.

Le site — Lot 7.1 — est un pignon stratégique à l'intersection de quatre avenues. Les trois volumes s'organisent en cascade, créant un effet sculptural et signalétique depuis l'espace public traversant. La position d'angle offre une visibilité maximale depuis plusieurs directions simultanément : c'est autant une contrainte qu'une opportunité.

---

## Étape 1 — Analyse et nomenclature

À la réception du modèle 3D, notre première action a été d'analyser la géométrie et d'établir une nomenclature de travail partagée :

| Identifiant | Description |
|---|---|
| **Tour L** | La plus grande — point de départ de toute la conception |
| **Tour M** | La moyenne |
| **Tour S** | La plus petite |
| **Socle** | Élément de jonction des trois masses — à traiter avec attention particulière |

Sur notre Miro Board partagé avec l'équipe YDA, nous avons reçu les premières références : des tours reprenant les grandes directives esthétiques souhaitées pour la façade extérieure. Nous avons analysé ces références pour distinguer les gestes répétitifs et dégager un esprit général.

---

## Étape 2 — Form Finding

La déclinaison volumétrique s'est construite à partir des contraintes réglementaires et programmatiques du site :

- Hauteur maximale à ne pas dépasser
- SHOB à respecter
- SHON (Surface de Plancher)
- Analyse des dimensions fonctionnelles par niveau
- Reculs par rapport aux zones mitoyennes

Dès les premières réunions, un geste dialectique fort au niveau du coin a été identifié comme point de départ : **l'espace tronqué**. C'est à partir de cette découpe que la composition des trois tours prend son sens.

Il a également été établi que la façade serait composée de verre et de brise-soleil à déclinaisons différentes. L'effet de découpe aux derniers étages a inspiré l'idée d'un *shift latéral des meneaux et des murs-rideaux* — pour donner plus de dynamisme au volume, en commençant par la tour L.

---

## Étape 3 — Système façade algorithmique

### Clustering des panneaux de verre

Avant d'entamer la double peau, une analyse des géométries de verre était nécessaire. Le script développé sur **Grasshopper** nous a permis de **clusteriser et grouper les panneaux de verre par niveau**, à partir des plans fournis par l'équipe YDA.

Un traitement différencié a été prévu pour les zones tronquées : les dalles dans ces espaces inclinés reçoivent un système façade distinct du reste du volume.

### La double peau paramétrique

La double peau émerge directement des murs-rideaux. Les meneaux verticaux constituent la colonne vertébrale du système : **si les panneaux de verre changent, les meneaux et la double peau suivent automatiquement.**

Ce principe de *dépendance paramétrique* est au cœur de la valeur de notre approche : chaque modification du volume hôte se propage à l'ensemble du système façade, sans intervention manuelle.

La double peau est composée de panneaux d'aluminium d'épaisseurs et de largeurs variables qui sortent de la façade — créant du dynamisme pour l'ensemble volumétrique.

---

## Étape 4 — Itérations de façade

### Itération 1 — Les trois gestes fondateurs

La première itération a établi les trois actions de base appliquées à la façade :

1. **Découpage** — Division par largeurs spécifiques et mur-rideau
2. **Shifting** — Déplacement latéral des meneaux par niveau pour créer le dynamisme voulu : un effet de tremblement ou de fausse quinconce
3. **Extrusion** — Extension des meneaux vers l'extérieur pour donner un effet écaillé à la façade

### Itération 2 — Introduction des obliques

L'ajout d'éléments obliques a enrichi le système en créant trois typologies de panneaux pour le mur-rideau :

1. **Panneau fixe**
2. **Panneau ouvrant**
3. **Panneau oblique** — qui, une fois miroité, offre une lecture supplémentaire et enrichit la façade

Nous avons également cherché à densifier la partie tronquée du volume pour lui donner plus de poids, tout en allégeant progressivement vers le bas pour créer un *maillage descendant*.

### Rationalisation des brise-soleil

Les brise-soleil ont été travaillés en **gradients définis par l'élévation** — leur profondeur varie en fonction de la hauteur par rapport au sol. Une étude analytique de l'apport solaire a été réalisée avec **Ladybug** pour visualiser leur impact sur la volumétrie, notamment pour la façade sud.

Un système rotatif sur axe a été exploré mais écarté pour la complexité structurelle qu'il impliquait. Les tolérances d'extrusion ont été encadrées par un minimum et un maximum définis pour tenir compte des contraintes de vent.

Une partie de la structure supportant les meneaux extrudés a été envisagée en *caillebotis* — son rendu visuel devant être testé avant validation.

---

## Étape 5 — Visualisation et validation

Pour ancrer les décisions dans la réalité, nous avons utilisé **Lumion** et des outils d'intelligence artificielle pour générer des images de référence. L'objectif était de se projeter dans le rendu final et de valider certains choix de composition avant de les figer.

C'est à cette étape que nous avons décidé d'affiner les découpes tronquées de la tour L pour lui donner plus d'inclinaison au niveau du pignon. Une nouvelle coupure a également été ajoutée en bas du socle, visible depuis l'intersection des quatre rues.

La modélisation a également intégré le positionnement des poteaux structurels, rationalisés en rangs sur la base des plans de dalles.

---

## Étape 6 — Coordination entre équipes et gel du volume

### Un problème de SHON en fin de parcours

Alors que nous approchions de la phase finale, un problème de surface a été détecté malgré le gel du volume. La SHON ne correspondait plus aux exigences — le volume devait changer à nouveau.

**C'est précisément ici que la valeur du système algorithmique s'est confirmée.** Refaire l'ensemble manuellement aurait représenté plusieurs jours de travail. Grâce à notre script Grasshopper, il suffisait de :

1. Redessiner les volumes à partir des nouvelles dimensions
2. Les alimenter dans le script
3. Valider la SHON avec l'équipe

### Deux équipes en parallèle

Le projet était organisé en deux équipes distinctes :

- **Équipe Plans (2D)** — planchers, fonctionnalité, noyaux
- **Notre équipe (Volume + Façade)** — volumétrie et système façade algorithmique

Le problème fonctionnel s'est cristallisé aux derniers étages : là où la coupe inclinée créait des espaces inutilisables autour des noyaux (escaliers, ascenseurs). L'équipe plans nous a transmis les nouvelles largeurs à intégrer, ce qui a généré une brisure différente du volume au niveau du pignon.

**Le protocole de communication inter-équipes :** les contours de dalles de chaque niveau ont été exportés automatiquement par Grasshopper en format DWG et transmis à l'équipe plans. Une méthode simple, sans ambiguïté, pour synchroniser deux équipes travaillant sur des logiciels différents.

Une fois les plans gelés définitivement — tout était validé.

---

## Étape 7 — Socle et espace public

Le socle est l'élément qui unifie les trois tours dans une seule lecture urbaine. Son traitement devait être cohérent avec la logique façade tout en répondant aux enjeux de l'espace public traversant.

### Calepinage algorithmique

Un système de calepinage automatisé a été développé pour le sol du socle. Le principe repose sur un **hotspot** — un point librement déplaçable dans la zone — qui détermine l'emplacement de la fontaine sèche. Le calepinage change de teinte et de granulation en fonction de la distance à ce point. Un *gradient aléatoire* a également été appliqué pour varier le texturing de la zone.

### Végétation et mobilier urbain

Les plantations ont été intégrées à partir de la grille générée par le calepinage. Les canopées en parasol, de hauteurs différentes, ont été positionnées selon cette même logique de gradient.

### Terrasses accessibles

Un traitement spécifique a été appliqué aux terrasses accessibles des tours L, M et S — espaces de détente et de restauration. Un **ruban continu au niveau des rez-de-chaussée** englobe les trois masses, dessine les escaliers d'accès aux terrasses et réduit l'exposition solaire directe.

---

## Ce que cette mission démontre

Ce projet illustre la valeur concrète du *Computational Design as a Service* dans le contexte d'un concours à haute pression :

**Adaptabilité sans coût supplémentaire.** Lorsque le volume a dû changer en cours de projet, le script a absorbé les modifications en quelques heures. Sans système paramétrique, c'est plusieurs jours de remodélisation manuelle.

**Coordination fluide entre équipes.** Le script génère automatiquement les livrables inter-équipes — contours DWG par niveau — éliminant les erreurs de communication entre équipe plans et équipe volume.

**Exploration rapide et décisions fondées.** Double peau, brise-soleil, typologies de panneaux — chaque décision a été testée visuellement avant d'être figée, accélérant la prise de décision lors des réunions.

**Scalabilité du système.** Ce qui a été développé pour la tour L a pu être décliné sur les tours M et S avec une cohérence formelle garantie par le même script.

---

> *Note : Cette mission s'est déroulée en phase concours. La rationalisation et l'optimisation structurelle complètes sont accessibles en phase exécution, une fois le projet primé.*

---

*Étude de cas — WWWorkflows × YDA — Juin 2025*
