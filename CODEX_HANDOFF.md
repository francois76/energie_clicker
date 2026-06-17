# Codex handoff

## Ce qui est prêt

- Projet Vite + React + TypeScript compilable.
- Boucle clicker jouable.
- 4 énergies + pollution cachée/révélée.
- Jalons historiques automatiques.
- Transitions d’époque automatiques.
- Slots de construction.
- Achats avec modale, quantité et options alternatives.
- Technologies producteurs/stockages/upgrades/conversions.
- Démantèlement.
- Mode démo avec panneau debug et continuation après game over.
- Assets SVG cohérents : 52 fichiers.

## Commandes validées

```bash
npm install
npm run build
```

Le build TypeScript + Vite passe.

## Prochaines itérations utiles

1. Équilibrage des chiffres dans `src/data/gameData.ts`.
2. Ajout de retrofits dédiés au lieu d’upgrades globales simples.
3. Amélioration du modèle de pollution cachée/visible.
4. Ajout de notifications plus discrètes pour les encarts déjà vus.
5. Sauvegarde localStorage.
6. Meilleure UX mobile pour les cards de boutique.
7. Ajout d’un graphe simple de mix final.
8. Ajout d’un mode “review script” qui force une trajectoire équilibrée pour démo jury.

## Où modifier

- Game loop : `src/hooks/useGame.ts`
- Data design : `src/data/gameData.ts`
- UI : `src/components/*`
- Style : `src/styles.css`
- Assets : `public/assets/*`

## Points d’attention

- Les assets sont servis par Vite via `public/assets/...`, donc les chemins dans les données commencent par `/assets/...`.
- Les technologies et upgrades sont volontairement dans le même tableau logique `ALL_ITEMS` pour simplifier la boutique.
- En mode démo, l’équilibrage est permissif via `MODE_CONFIG.demo`.
- Les valeurs ne sont pas historiques : les sources servent au contexte documentaire, pas au calibrage numérique.
