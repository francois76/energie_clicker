# Audit d’équilibrage — mode normal

## Problème constaté sur `master`

Le jeu pouvait se bloquer techniquement en mode normal : la capacité mécanique initiale était de 80, mais de nombreux moyens de production exigeaient plus de 80 de force mécanique au paiement. Comme aucun stockage mécanique progressif n’était disponible, certains achats n’étaient pas seulement difficiles : ils étaient impossibles à atteindre.

Exemples constatés avant correction :

- Mine de charbon : option à 110 de force mécanique.
- Chaudière : 90 de force mécanique.
- Machine à vapeur : 140 puis 165 de force mécanique.
- Dynamo : 120 de force mécanique.
- Hydroélectricité : 180 de force mécanique.
- Technologies modernes : souvent entre 300 et 900 de force mécanique.

## Principes de correction

Cette passe ne change aucune mécanique de jeu. Elle modifie uniquement les données d’équilibrage : coûts, temps de construction, productions, stockages et impacts de jalons.

Objectifs appliqués :

1. Rendre le jeu finissable en mode normal.
2. Créer une vraie progression par époque.
3. Faire monter les jalons de manière plus agressive pour forcer l’anticipation.
4. Donner à chaque époque des petits moyens utiles immédiatement, puis des moyens plus puissants mais plus longs.
5. Uniformiser les doubles options :
   - option 1 : moins chère, plus longue ;
   - option 2 : plus chère, plus rapide.
6. Améliorer la cohérence relative des ressources demandées, sans chercher un réalisme chiffré strict.

## Changements notables

- Capacités initiales légèrement augmentées : chaleur, mécanique, carburants, électricité.
- Ajout de stockage mécanique à des infrastructures plausibles : traction, moulins, forge, vapeur, grands chantiers, renouvelables modernes.
- Ajout ou correction d’options doubles sur les technologies structurantes.
- Croissance plus nette des besoins aux jalons, surtout à partir de l’industrie.
- Les technologies fossiles restent puissantes et rapides à stabiliser, mais gardent leur dette pollution.
- Les technologies bas-carbone modernes deviennent indispensables face aux derniers jalons électriques.

## Résultat attendu

Le joueur peut désormais progresser normalement, mais doit anticiper :

- construire du stockage avant les paliers chers ;
- lancer les gros chantiers avant les jalons ;
- utiliser les petites sources comme secours de court terme ;
- préparer le basculement électrique avant les conversions modernes.
