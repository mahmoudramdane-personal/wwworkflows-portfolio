---
title: WWWorkflows × H2A — Projet Bascule
subtitle: Système de façade paramétrique pour un immeuble mixte à l'entrée de Mons
client: H2A Ir Architecte & Associés
year: 2025
location: 'Mons, Belgique'
category: facade-design
status: Étude
collaborators: ''
order: 3
thumbnail: thumbnail.webp
---
*Bascule* est un immeuble mixte situé à l'entrée de ville de Mons —. Quatre niveaux d'appartements/studios en superstructure, un rez-de-chaussée commercial animé par un grand abri bus sur toute la longueur de la parcelle. La parcelle elle-même est irrégulière, ce qui a conduit H2A Ir Architecte & Associés à un parti-pris d'une forme arrondie, souple, qui épouse les contraintes géométriques du terrain plutôt que de les subir.

C'est dans ce contexte que WWWorkflows a été mandaté — non pas pour dessiner la façade, mais pour la retraduire algorithmiquement.

{{media:bascule-intro.webp}}

---

## Analyse initiale — lire le volume avant de l'habiller

À la réception du modèle 3D et des plans d'architecte, notre premier réflexe a été d'analyser la façade non pas comme une surface, mais comme une condition. Trois éléments ont immédiatement structuré notre lecture :

- Une **coursive extérieure** qui court sur les façades et crée une discontinuité dans l'enveloppe
- Des **terrasses** accessibles depuis certains appartements, qui percent le volume de manière localisée
- Des **portes-fenêtres de balcon** dont l'emplacement n'était pas encore figé — les architectes nous avaient prévenus : les plans allaient encore évoluer

C'est cette dernière contrainte qui a orienté toute notre stratégie. Concevoir une façade sur des plans instables, c'est concevoir pour l'incertitude.

{{media:analyse-plans.webp}}

---

## Le système Joystick — paramétrer l'incertitude

Plutôt que de modéliser une façade statique vouée à être refaite à chaque modification de plan, nous avons conçu un **système paramétrique à partir du volume plein**.

Le principe : partir d'une enveloppe fermée et complète, puis la perforer dynamiquement à l'aide de ce que nous avons appelé des **joysticks** — des volumes cubiques paramétriques, calés sur les ouvertures du plan (portes-fenêtres, accès terrasses, passages de coursive). Chaque joystick est une interface entre le plan et la façade : déplacer une ouverture dans le plan, c'est déplacer automatiquement le joystick correspondant, et donc la perforation dans l'enveloppe.

Le jeu de plein et de vide qui en résulte n'est pas arbitraire. Il est la traduction directe de la vie intérieure du bâtiment — les espaces découverts au bon endroit, jamais au mauvais.

{{media:joystick-schema.webp}}

{{media:joystick-rendu.webp}}

---

## Optimisation du ratio plein-vide

Ce qui est particulièrement puissant dans cette approche, c'est la **capacité à ajuster en temps réel** la proportion entre surface pleine et vide de la façade. Le script permet de faire varier ces paramètres et de visualiser immédiatement les conséquences — sur l'esthétique extérieure, sur la luminosité des espaces intérieurs, sur la lisibilité des niveaux depuis la rue.

C'est aussi à cette étape que nous avons pu vérifier la cohérence entre l'enveloppe et la structure : chaque configuration générée respecte les contraintes de garde-corps, de profondeur de balcon et d'alignement structural.

{{media:ratio-plein-vide-1.webp}}

{{media:ratio-plein-vide-2.webp}}

---

## Exploration des variantes — tester avant de décider

Avec une base paramétrique solide, la phase d'exploration devient un espace de liberté. À partir de rendus draft rapides, nous avons ouvert le champ des possibles avec H2A :

- Lamelles en **rythme cassé aléatoire** ou en **quinconce**
- Progressions **ascendantes ou descendantes** sur la hauteur du bâtiment
- Tests de **couleurs flash** pour marquer l'entrée de ville
- **Semi-transparences** pour jouer avec la profondeur visuelle
- Fenêtres en **bandeau horizontal continu**
- **Habillage spécifique des coursives** — parfois complètement ouvert, parfois masqué
- Jeu sur les **profils des nez de dalle** pour sculpter les horizontales

{{media:variantes-1.webp}}

{{media:variantes-2.webp}}

---

## Le bardage — une décision ancrée dans la réalité

Après plusieurs réunions et allers-retours, le choix s'est arrêté sur un **système de bardage en façade par accroche mécanique**. La direction était claire — il restait à la préciser.

L'enjeu principal : définir l'espacement et l'épaisseur des lames.

Ces paramètres ont été travaillés directement dans Grasshopper, avec des rendus de **vues depuis la coursive** qui se sont révélés déterminants. Ces vues intérieures montraient comment la lumière se comportait entre les lames selon leur profondeur, et comment l'ambiance changeait selon leur densité. Pour préserver une sensation d'espace et de luminosité à l'intérieur, nous avons opté pour **l'espacement le plus grand**.

{{media:bardage-coursive.webp}}

Le script a ensuite permis de générer automatiquement des **sous-géométries** à partir des éléments déjà modélisés. Les murs-rideaux existants sur les façades côté terrasses ont servi de base pour générer des **stores colorés avec extrusions variables**. Les garde-corps ont reçu des textures en **bois clair ajouré**, intégrées directement dans la modélisation, pour tester l'accord des matières.

{{media:stores-gardes-corps.webp}}

{{media:materiaux-1.webp}}

Nous avons également exploré des **variantes de matérialité par niveau** : bardage bois sur certaines faces, façade bicouche blanc sur d'autres — pour hiérarchiser les volumes et enrichir la lecture du bâtiment depuis l'espace public.

{{media:materiaux-facade.webp}}

{{media:bascule.webp}}

---

## Ce que cette mission démontre

Ce Projet illustre une situation que nous rencontrons souvent : une agence qui avance sur deux fronts en parallèle — volume et plans — et qui a besoin d'un système de façade capable de **suivre sans être refait**.

**Concevoir pour l'incertitude.** Le système joystick transforme l'instabilité des plans en paramètre gérable. Chaque changement d'ouverture se propage dans la façade sans intervention manuelle.

**Explorer vite, décider bien.** Les rendus draft ont permis de tester une dizaine de directions en quelques sessions de travail. La décision finale sur le bardage et l'espacement des lames a été prise avec des données visuelles solides, pas par intuition seule.

**La façade comme système vivant.** Ce qui a été livré à H2A n'est pas une image — c'est une maquette paramétrique entièrement reconfigurable, prête à absorber les modifications à venir en phase exécution.

{{media:conclusion.webp}}

---

> *Note : Cette mission s'est déroulée en phase étude. La maquette paramétrique reste disponible pour accompagner la phase exécution et la consultation des entreprises.*

---

*Étude de cas — WWWorkflows × H2A Ir Architecte & Associés — 2025*
