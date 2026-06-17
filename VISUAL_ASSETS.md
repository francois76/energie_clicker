# Direction artistique et assets

## Intention

Le POC doit rester “clicker-first” : les visuels servent à identifier vite une époque, une énergie ou un danger. Pas de carte, pas de simulation réseau, pas d’illustration réaliste complexe.

Style retenu :

- pastel semi-flat ;
- formes simples ;
- contours arrondis épais ;
- ombres douces ;
- pas de photoréalisme ;
- cohérence entre icônes, boutons et cartes.

## Palette

| Usage | Couleur |
|---|---|
| Fond | `#f7f3ea` |
| Encre | `#27313f` |
| Muted | `#6c7684` |
| Chaleur | `#ff9f7a` |
| Mécanique | `#91c7b1` |
| Carburants | `#c7a17a` |
| Électricité | `#8fb3ff` |
| Pollution | `#b0a7bd` |
| Danger | `#d85a5a` |
| Succès | `#3e9d78` |

Voir aussi `public/assets/design-tokens.json`.

## Assets fournis

### Icônes ressources

- `icons/energy-heat.svg`
- `icons/energy-mechanical.svg`
- `icons/energy-fuel.svg`
- `icons/energy-electricity.svg`
- `icons/pollution.svg`

### Époques

- `eras/era-01-fire.svg`
- `eras/era-02-mills.svg`
- `eras/era-03-steam.svg`
- `eras/era-04-electric-oil.svg`
- `eras/era-05-nuclear.svg`
- `eras/era-06-future.svg`

### Bouton central

- `buttons/click-era-01.svg`
- `buttons/click-era-02.svg`
- `buttons/click-era-03.svg`
- `buttons/click-era-04.svg`
- `buttons/click-era-05.svg`
- `buttons/click-era-06.svg`

### Technologies

35 SVG homogènes sont disponibles dans `public/assets/technologies`.

## Notes pour itérations Codex

- Garder le `viewBox="0 0 128 128"` pour les icônes.
- Garder `viewBox="0 0 320 220"` pour les illustrations d’époque.
- Ne pas mélanger styles outline-only et pictos remplis : ici, tous les assets utilisent formes pastel + stroke sombre.
- Les assets sont référencés dans `src/data/gameData.ts`, pas hardcodés dans les composants.
- Pour ajouter une technologie : créer un SVG dans `public/assets/technologies`, puis ajouter la config dans `TECHNOLOGIES` ou `UPGRADES`.
