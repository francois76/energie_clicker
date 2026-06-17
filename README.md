# Énergie Clicker — POC

Un POC de jeu web statique inspiré de Cookie Clicker, centré sur l’histoire énergétique française.

Le joueur clique pour produire une énergie cohérente avec l’époque, achète des technologies avec ses stocks d’énergie, anticipe des jalons historiques automatiques et survit à deux risques : crise énergétique et crise pollution.

> Ce jeu est une simplification pédagogique. Il s’inspire de l’histoire énergétique française, mais ne prétend pas être une simulation scientifique exacte.

## Lancer le projet

```bash
npm install
npm run dev
```

Puis ouvrir :

- mode normal : `http://localhost:5173/`
- mode démo : `http://localhost:5173/?demo=1`

## Stack

- Vite
- React
- TypeScript
- CSS vanilla
- Assets SVG dans `public/assets`
- Données de jeu dans `src/data/gameData.ts`

## Concept

Le jeu n’utilise pas d’argent. Les énergies sont à la fois ressources, stocks et jauges de risque.

Énergies :

- **Chaleur** — feu, cuisson, chauffage, vapeur, chaleur industrielle.
- **Force mécanique** — traction, moulins, machines, ateliers.
- **Carburants** — pétrole, essence, gazole, gaz simplifié.
- **Électricité** — dynamos, centrales, réseau, usages modernes.
- **Pollution** — cachée au début, visible à partir des Trente Glorieuses.

La boucle principale :

1. Cliquer sur le bouton central.
2. Construire des technologies.
3. Stocker et stabiliser les soldes.
4. Anticiper les jalons historiques.
5. Changer automatiquement d’époque.
6. Démanteler ou convertir quand la pollution devient dangereuse.
7. Tenir le timer final après le dernier jalon.

## Règles de perte

### Crise énergétique

Pour chaque énergie active :

- si le stock tombe à zéro et que le solde net reste négatif, un compte à rebours démarre ;
- si le stock remonte ou si le solde redevient positif, le compte à rebours s’annule ;
- sinon, game over.

### Crise pollution

La pollution est inactive au début. Les technologies sales peuvent pourtant accumuler une dette cachée.

À l’époque **Trente Glorieuses**, la pollution devient visible. Sa valeur initiale est plafonnée à 65 % pour éviter un game over immédiat.

Après révélation :

- si la pollution atteint 100 %, un compte à rebours démarre ;
- si elle repasse sous 100 %, il s’annule ;
- sinon, game over.

## Mode démo

Le mode démo est pensé pour review/jury en quelques minutes.

Différences principales :

- jalons accélérés ;
- coûts réduits ;
- temps de construction réduits ;
- impacts de jalons réduits ;
- un slot de construction bonus ;
- panneau debug visible ;
- après game over : bouton **Refuel et continuer**.

Le panneau debug permet :

- d’ajouter chaque énergie ;
- de refuel les jauges à 30 % ;
- de sauter au prochain jalon ;
- de sauter à la prochaine époque ;
- d’accélérer le temps ;
- de désactiver temporairement le game over.

## Époques implémentées

1. **Préhistoire : feu et chaleur**
2. **Agriculture, moulins et forges**
3. **Charbon, vapeur et industrie**
4. **Électricité, ville moderne et pétrole naissant**
5. **Trente Glorieuses, pétrole, gaz et nucléaire**
6. **France moderne et futur proche**

Chaque époque définit :

- énergies actives ;
- action de clic ;
- nombre de slots ;
- technologies débloquées ;
- jalons ;
- illustration d’époque ;
- bouton central.

## Jalons historiques

Les jalons ne sont pas achetés. Ils représentent des usages sociaux ou économiques qui augmentent automatiquement la demande.

Exemples :

- Cuisson régulière
- Production régulière de pain
- Transport ferroviaire de marchandises
- Éclairage urbain
- Voiture individuelle de masse
- Numérisation et data centers
- Industrie bas-carbone

En mode normal, le jalon est caché puis annoncé avant application. En mode démo, tout est accéléré.

## Technologies

Les technologies peuvent être :

- `producer` — produit une énergie ;
- `storage` — augmente la capacité ;
- `upgrade` — modifie des familles de technologies ;
- `conversion` — déplace une demande d’une énergie vers une autre ;
- `retrofit` — prévu dans le modèle, à enrichir ensuite.

Le POC inclut :

- foyers, réserves de bois ;
- moulins, forge ;
- mine de charbon, chaudière, machine à vapeur ;
- dynamo, hydro, centrale charbon ;
- raffinerie, centrale gaz, barrage moderne, nucléaire première génération ;
- nucléaire moderne, solaire, éolien, batteries, STEP, pompes à chaleur, véhicules électriques, fusion expérimentale.

## Prix alternatifs

Plusieurs technologies ont plusieurs options d’achat.

Exemple : une centrale ou un réacteur peut être construit via une filière plus thermique, moins chère mais plus polluante, ou une filière plus électrifiée, plus exigeante mais plus propre/rapide.

L’UI utilise une modale :

1. choix de quantité ;
2. choix d’option ;
3. paiement immédiat ;
4. occupation d’un slot ;
5. effet appliqué à la fin du timer.

## Démantèlement

Les producteurs `removable` peuvent être démantelés.

Le démantèlement :

- retire leur production ;
- retire leur pollution/s associée ;
- ne rembourse rien ;
- est utile après révélation de la pollution.

## Conversions

Les conversions sont des technologies qui modifient les consommations.

Exemples :

- **Pompes à chaleur** : baisse carburants/chaleur, augmente électricité.
- **Véhicules électriques** : baisse carburants, augmente électricité.
- **Efficacité énergétique** : réduit plusieurs demandes.

## Assets visuels

Les assets sont dans `public/assets`.

- `icons/` : icônes d’énergies et pollution.
- `eras/` : illustrations par époque.
- `buttons/` : gros bouton central décliné par époque.
- `technologies/` : icônes de technologies.
- `design-tokens.json` : palette et langage visuel.

Direction artistique : pastel semi-flat, contours arrondis épais, ombres douces, lisibilité UI-first.

## Fichiers importants

```txt
src/App.tsx
src/hooks/useGame.ts
src/data/gameData.ts
src/types.ts
src/components/*
src/styles.css
public/assets/*
```

## Limites connues du POC

- Les chiffres ne sont pas calibrés historiquement ; ils sont calibrés pour créer une tension de jeu.
- Le réseau électrique n’est pas simulé.
- Les intermittences renouvelables ne sont pas modélisées finement.
- Le stockage est simplifié.
- Les upgrades s’appliquent aux existants et futurs dans ce POC, pour garder une boucle lisible.
- Les retrofits sont prévus dans les types mais pas encore séparés en parcours complet.
- Les sources historiques sont citées dans certains encarts, mais les valeurs de gameplay restent fictionnelles.

## Sources de contexte à conserver

- RTE — Bilan électrique 2025 : production totale 547,5 TWh, production bas-carbone à un maximum historique et thermique fossile au plus bas depuis 75 ans.  
  https://www.rte-france.com/actualites/bilan-electrique-2025-conditions-sont-reunies-permettre-france-accelerer-electrification

- RTE — Bilan électrique 2024 : consommation électrique corrigée à 449,2 TWh.  
  https://analysesetdonnees.rte-france.com/bilan-electrique-2024/synthese

- SDES — Bilan énergétique de la France en 2024 : consommation finale énergétique autour de 1 499 TWh.  
  https://www.statistiques.developpement-durable.gouv.fr/bilan-energetique-de-la-france-en-2024-synthese

- SDES — Chiffres clés de l’énergie 2024 : répartition de la consommation finale par énergie en 2023.  
  https://www.statistiques.developpement-durable.gouv.fr/chiffres-cles-de-lenergie-edition-2024

- CEA Marcoule — histoire du site : G1 en 1956, puis G2 et G3, premiers kilowattheures français d’origine nucléaire.  
  https://marcoule.cea.fr/Marcoule/Pages/histoire-de-marcoule.aspx

- Histoire par l’image — premiers chemins de fer : ligne Saint-Étienne–Andrézieux pour transporter le charbon vers Loire et Rhône.  
  https://histoire-image.org/etudes/premiers-chemins-fer

- Ministère de la Transition écologique — véhicules électriques : transport comme principal secteur d’émissions de GES en France, émissions liées à la combustion de carburants.  
  https://www.ecologie.gouv.fr/politiques-publiques/developper-vehicules-electriques

- Ministère de l’Économie — révolution industrielle : passage à une production manufacturée à grande échelle au début du XIXe siècle en France.  
  https://www.economie.gouv.fr/facileco/culture-economique/120-000-ans-dhistoire/la-revolution-industrielle
