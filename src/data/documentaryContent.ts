import type { Documentary } from '../types';

// Contenus documentaires à réécrire dans une passe dédiée.
// Pour chaque phase ou jalon, prévoir :
// - les nouvelles consommations d'énergie introduites ;
// - les items débloqués, en présentation courte ;
// - un fait culturel ou historique lié à la période.
// Les textes ci-dessous sont volontairement placeholders pour faciliter une passe ChatGPT dédiée.
export const DOCUMENTARY_DRAFTS: Record<string, Partial<Documentary>> = {
  placeholder: {
    title: 'Lorem ipsum',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    gameplay: 'Lorem ipsum dolor sit amet.'
  }
};
