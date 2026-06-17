import type { Documentary, Energy, Era, Milestone, Technology, Upgrade } from '../types';

export const ENERGIES: Energy[] = ['heat', 'mechanical', 'fuel', 'electricity'];

export const ENERGY_META: Record<Energy, { label: string; short: string; unit: string; rateUnit: string; icon: string; cssVar: string }> = {
  heat: {
    label: 'Chaleur',
    short: 'Chaleur',
    unit: 'kW',
    rateUnit: 'kW/h',
    icon: 'assets/icons/energy-heat.svg',
    cssVar: '--energy-heat'
  },
  mechanical: {
    label: 'Force mécanique',
    short: 'Force',
    unit: 'kW',
    rateUnit: 'kW/h',
    icon: 'assets/icons/energy-mechanical.svg',
    cssVar: '--energy-mechanical'
  },
  fuel: {
    label: 'Carburants',
    short: 'Carburants',
    unit: 'kW',
    rateUnit: 'kW/h',
    icon: 'assets/icons/energy-fuel.svg',
    cssVar: '--energy-fuel'
  },
  electricity: {
    label: 'Électricité',
    short: 'Élec.',
    unit: 'kW',
    rateUnit: 'kW/h',
    icon: 'assets/icons/energy-electricity.svg',
    cssVar: '--energy-electricity'
  }
};

export const INITIAL_CAPACITY: Record<Energy, number> = {
  heat: 120,
  mechanical: 80,
  fuel: 260,
  electricity: 100
};

export const INITIAL_STOCK_RATIO: Record<Energy, number> = {
  heat: 0.45,
  mechanical: 0.3,
  fuel: 0.35,
  electricity: 0.35
};

export const INITIAL_BASE_CONSUMPTION: Record<Energy, number> = {
  heat: 0.85,
  mechanical: 0,
  fuel: 0,
  electricity: 0
};

export const MODE_CONFIG = {
  normal: {
    milestoneTotalSeconds: 120,
    milestoneVisibleSeconds: 90,
    transitionSeconds: 170,
    finalHoldSeconds: 60,
    crisisSeconds: 10,
    clickMultiplier: 1,
    costMultiplier: 1,
    buildTimeMultiplier: 1,
    milestoneImpactMultiplier: 1.75,
    passiveGainMultiplier: 0.58,
    constructionSlotBonus: 0
  },
  demo: {
    milestoneTotalSeconds: 22,
    milestoneVisibleSeconds: 14,
    transitionSeconds: 35,
    finalHoldSeconds: 35,
    crisisSeconds: 14,
    clickMultiplier: 10,
    costMultiplier: 0.38,
    buildTimeMultiplier: 0.28,
    milestoneImpactMultiplier: 0.55,
    passiveGainMultiplier: 0.85,
    constructionSlotBonus: 1
  }
} as const;

export const ERAS: Era[] = [
  {
    id: 'prehistoire',
    name: 'Préhistoire : feu et chaleur',
    shortName: 'Feu',
    description: 'On apprend à maintenir une réserve de chaleur. La mécanique et l’électricité n’existent pas encore dans le modèle.',
    asset: 'assets/eras/era-01-fire.svg',
    buttonAsset: 'assets/buttons/click-era-01.svg',
    unlockedEnergies: ['heat'],
    clickAction: { label: 'Frotter du bois', gain: { heat: 2.2 } },
    constructionSlots: 1,
    technologiesUnlocked: ['campfire', 'foyer', 'wood_reserve', 'charcoal', 'better_foyer'],
    milestones: ['regular_cooking', 'heated_habitat'],
    transitionAnnouncementSeconds: 170,
    nextEraId: 'agriculture',
    documentaryId: 'era_prehistoire'
  },
  {
    id: 'agriculture',
    name: 'Agriculture, moulins et forges',
    shortName: 'Moulins',
    description: 'La force mécanique arrive avec la traction, les moulins et les ateliers. Le jeu cesse d’être mono-jauge.',
    asset: 'assets/eras/era-02-mills.svg',
    buttonAsset: 'assets/buttons/click-era-02.svg',
    unlockedEnergies: ['heat', 'mechanical'],
    clickAction: { label: 'Actionner un soufflet', gain: { heat: 1.4, mechanical: 1.2 } },
    constructionSlots: 2,
    entryConsumptionDelta: { mechanical: 0.9 },
    technologiesUnlocked: ['animal_traction', 'water_mill', 'wind_mill', 'forge', 'optimized_blades'],
    milestones: ['bread_production', 'agricultural_tools'],
    transitionAnnouncementSeconds: 170,
    nextEraId: 'industrie',
    documentaryId: 'era_agriculture'
  },
  {
    id: 'industrie',
    name: 'Charbon, vapeur et industrie',
    shortName: 'Vapeur',
    description: 'Le charbon rend tout plus puissant, plus rapide, plus confortable… et commence à charger une dette de pollution invisible.',
    asset: 'assets/eras/era-03-steam.svg',
    buttonAsset: 'assets/buttons/click-era-03.svg',
    unlockedEnergies: ['heat', 'mechanical'],
    clickAction: { label: 'Pelleter du charbon', gain: { heat: 3.4, mechanical: 0.8 } },
    constructionSlots: 3,
    entryConsumptionDelta: { heat: 1.2, mechanical: 2.4 },
    technologiesUnlocked: ['coal_mine', 'boiler', 'steam_engine', 'blast_furnace', 'high_pressure_boiler'],
    milestones: ['mechanized_textile', 'rail_freight'],
    transitionAnnouncementSeconds: 170,
    nextEraId: 'electricite_petrole',
    documentaryId: 'era_industrie'
  },
  {
    id: 'electricite_petrole',
    name: 'Électricité, ville moderne et pétrole naissant',
    shortName: 'Dynamo',
    description: 'L’électricité et les carburants apparaissent ensemble : deux vecteurs puissants, mais pas avec les mêmes risques.',
    asset: 'assets/eras/era-04-electric-oil.svg',
    buttonAsset: 'assets/buttons/click-era-04.svg',
    unlockedEnergies: ['heat', 'mechanical', 'fuel', 'electricity'],
    clickAction: { label: 'Tourner une dynamo', gain: { electricity: 2.4 } },
    constructionSlots: 4,
    entryConsumptionDelta: { electricity: 1.4, fuel: 1.2 },
    technologiesUnlocked: ['dynamo', 'hydro', 'coal_power_plant', 'early_fuels', 'electric_grid'],
    milestones: ['urban_lighting', 'motorized_transport'],
    transitionAnnouncementSeconds: 170,
    nextEraId: 'trente_glorieuses',
    documentaryId: 'era_electricite_petrole'
  },
  {
    id: 'trente_glorieuses',
    name: 'Trente Glorieuses, pétrole, gaz et nucléaire',
    shortName: 'Nucléaire',
    description: 'La demande explose. La pollution devient visible : les choix fossiles passés ne tuent pas instantanément, mais ils comptent.',
    asset: 'assets/eras/era-05-nuclear.svg',
    buttonAsset: 'assets/buttons/click-era-05.svg',
    unlockedEnergies: ['heat', 'mechanical', 'fuel', 'electricity'],
    clickAction: { label: 'Lancer une turbine', gain: { electricity: 3.2, heat: 0.8 } },
    constructionSlots: 5,
    entryConsumptionDelta: { fuel: 3.6, electricity: 3.2, heat: 1.4 },
    technologiesUnlocked: ['refinery', 'gas_power_plant', 'modern_dam', 'nuclear_gen1', 'industrial_filters', 'energy_efficiency'],
    milestones: ['mass_car', 'domestic_appliances', 'modern_heating'],
    transitionAnnouncementSeconds: 170,
    nextEraId: 'moderne_futur',
    documentaryId: 'era_trente_glorieuses'
  },
  {
    id: 'moderne_futur',
    name: 'France moderne et futur proche',
    shortName: 'Mix',
    description: 'Décarboner déplace la pression vers l’électricité. La stabilité vient du mix : production, stockage, conversions et démantèlements.',
    asset: 'assets/eras/era-06-future.svg',
    buttonAsset: 'assets/buttons/click-era-06.svg',
    unlockedEnergies: ['heat', 'mechanical', 'fuel', 'electricity'],
    clickAction: { label: 'Optimiser le mix', gain: { electricity: 3.8 } },
    constructionSlots: 6,
    entryConsumptionDelta: { electricity: 7.2, fuel: -2.2 },
    technologiesUnlocked: ['modern_nuclear', 'solar_farm', 'wind_farm', 'batteries', 'pumped_hydro', 'heat_pumps', 'electric_vehicles', 'smart_grid', 'experimental_fusion'],
    milestones: ['data_centers', 'transport_electrification', 'low_carbon_industry'],
    transitionAnnouncementSeconds: 170,
    documentaryId: 'era_moderne_futur'
  }
];

export const MILESTONES: Milestone[] = [
  {
    id: 'regular_cooking',
    name: 'Cuisson régulière',
    era: 'prehistoire',
    consumptionDelta: { heat: 0.9 },
    documentaryId: 'milestone_cooking'
  },
  {
    id: 'heated_habitat',
    name: 'Habitat chauffé',
    era: 'prehistoire',
    consumptionDelta: { heat: 1.5 },
    documentaryId: 'milestone_heated_habitat'
  },
  {
    id: 'bread_production',
    name: 'Production régulière de pain',
    era: 'agriculture',
    consumptionDelta: { heat: 1.3, mechanical: 1.8 },
    documentaryId: 'milestone_bread'
  },
  {
    id: 'agricultural_tools',
    name: 'Fabrication d’outils agricoles',
    era: 'agriculture',
    consumptionDelta: { heat: 2.2, mechanical: 1.2 },
    documentaryId: 'milestone_tools'
  },
  {
    id: 'mechanized_textile',
    name: 'Production textile mécanisée',
    era: 'industrie',
    consumptionDelta: { mechanical: 6.2, heat: 1.2 },
    hiddenPollutionDebtDelta: 3,
    documentaryId: 'milestone_textile'
  },
  {
    id: 'rail_freight',
    name: 'Transport ferroviaire de marchandises',
    era: 'industrie',
    consumptionDelta: { mechanical: 7.4, heat: 3.2 },
    hiddenPollutionDebtDelta: 5,
    documentaryId: 'milestone_rail'
  },
  {
    id: 'urban_lighting',
    name: 'Éclairage urbain',
    era: 'electricite_petrole',
    consumptionDelta: { electricity: 4.8 },
    documentaryId: 'milestone_lighting'
  },
  {
    id: 'motorized_transport',
    name: 'Premiers transports motorisés',
    era: 'electricite_petrole',
    consumptionDelta: { fuel: 5.8, mechanical: 1.5 },
    hiddenPollutionDebtDelta: 6,
    pollutionDeltaPerSecond: 0.02,
    documentaryId: 'milestone_motorized_transport'
  },
  {
    id: 'mass_car',
    name: 'Voiture individuelle de masse',
    era: 'trente_glorieuses',
    consumptionDelta: { fuel: 12.5 },
    pollutionDeltaPerSecond: 0.05,
    documentaryId: 'milestone_mass_car'
  },
  {
    id: 'domestic_appliances',
    name: 'Électroménager domestique',
    era: 'trente_glorieuses',
    consumptionDelta: { electricity: 12.5 },
    documentaryId: 'milestone_appliances'
  },
  {
    id: 'modern_heating',
    name: 'Chauffage moderne des logements',
    era: 'trente_glorieuses',
    consumptionDelta: { heat: 5.8, fuel: 8.5, electricity: 2.2 },
    pollutionDeltaPerSecond: 0.05,
    documentaryId: 'milestone_modern_heating'
  },
  {
    id: 'data_centers',
    name: 'Numérisation et data centers',
    era: 'moderne_futur',
    consumptionDelta: { electricity: 18 },
    documentaryId: 'milestone_data_centers'
  },
  {
    id: 'transport_electrification',
    name: 'Électrification des transports',
    era: 'moderne_futur',
    consumptionDelta: { electricity: 24, fuel: -10 },
    pollutionDeltaPerSecond: -0.04,
    documentaryId: 'milestone_transport_electrification'
  },
  {
    id: 'low_carbon_industry',
    name: 'Industrie bas-carbone',
    era: 'moderne_futur',
    consumptionDelta: { electricity: 32, heat: 6, fuel: -8 },
    pollutionDeltaPerSecond: -0.05,
    documentaryId: 'milestone_low_carbon_industry'
  }
];

export const TECHNOLOGIES: Technology[] = [
  {
    id: 'campfire',
    name: 'Feu de camp',
    era: 'prehistoire',
    kind: 'producer',
    description: 'Production de chaleur fragile mais très rapide à construire.',
    asset: 'assets/technologies/campfire.svg',
    tags: ['fire', 'primitive'],
    productionPerSecond: { heat: 1.4 },
    purchaseOptions: [
      { id: 'dry_wood', label: 'Bois sec', cost: { heat: 10 }, buildTimeSeconds: 2, note: 'Simple et propre.' }
    ],
    removable: true,
    documentaryId: 'tech_campfire'
  },
  {
    id: 'foyer',
    name: 'Foyer',
    era: 'prehistoire',
    kind: 'producer',
    description: 'Meilleur rendement que le feu de camp, bon socle de début de partie.',
    asset: 'assets/technologies/foyer.svg',
    tags: ['fire', 'heat'],
    productionPerSecond: { heat: 3.2 },
    purchaseOptions: [
      { id: 'stone_ring', label: 'Pierres et braises', cost: { heat: 28 }, buildTimeSeconds: 4 }
    ],
    removable: true,
    documentaryId: 'tech_foyer'
  },
  {
    id: 'wood_reserve',
    name: 'Réserve de bois',
    era: 'prehistoire',
    kind: 'storage',
    description: 'Ajoute du buffer de chaleur. Pas magique, mais précieux avant les jalons.',
    asset: 'assets/technologies/wood_reserve.svg',
    tags: ['storage', 'heat'],
    storageBonus: { heat: 80 },
    purchaseOptions: [
      { id: 'stack_wood', label: 'Empiler le bois', cost: { heat: 24 }, buildTimeSeconds: 5 }
    ],
    documentaryId: 'tech_storage'
  },
  {
    id: 'charcoal',
    name: 'Charbon de bois',
    era: 'prehistoire',
    kind: 'producer',
    description: 'Plus dense que le bois, avec un léger coût environnemental caché.',
    asset: 'assets/technologies/charcoal.svg',
    tags: ['fire', 'fossil_like'],
    productionPerSecond: { heat: 5.2 },
    hiddenPollutionDebtPerSecond: 0.005,
    purchaseOptions: [
      { id: 'slow_pit', label: 'Meule lente', cost: { heat: 55 }, buildTimeSeconds: 8, pollutionDebt: 1 }
    ],
    removable: true
  },
  {
    id: 'animal_traction',
    name: 'Traction animale',
    era: 'agriculture',
    kind: 'producer',
    description: 'Production mécanique régulière, consomme un peu de chaleur indirecte.',
    asset: 'assets/technologies/animal_traction.svg',
    tags: ['mechanical', 'agriculture'],
    productionPerSecond: { mechanical: 2.4 },
    consumptionPerSecond: { heat: 0.25 },
    purchaseOptions: [
      { id: 'organized_stables', label: 'Organisation des attelages', cost: { heat: 65, mechanical: 12 }, buildTimeSeconds: 8 }
    ],
    removable: true,
    documentaryId: 'tech_animal_traction'
  },
  {
    id: 'water_mill',
    name: 'Moulin à eau',
    era: 'agriculture',
    kind: 'producer',
    description: 'Excellent producteur mécanique bas-carbone, mais plus long à installer.',
    asset: 'assets/technologies/water_mill.svg',
    tags: ['mechanical', 'water', 'mill'],
    productionPerSecond: { mechanical: 5.2 },
    purchaseOptions: [
      { id: 'river_site', label: 'Site de rivière', cost: { heat: 90, mechanical: 24 }, buildTimeSeconds: 12 }
    ],
    removable: true,
    documentaryId: 'tech_mill'
  },
  {
    id: 'wind_mill',
    name: 'Moulin à vent',
    era: 'agriculture',
    kind: 'producer',
    description: 'Un peu moins stable que l’eau dans cette version, mais très utile.',
    asset: 'assets/technologies/wind_mill.svg',
    tags: ['mechanical', 'wind', 'mill'],
    productionPerSecond: { mechanical: 4.4 },
    purchaseOptions: [
      { id: 'ridge_site', label: 'Site exposé', cost: { heat: 75, mechanical: 28 }, buildTimeSeconds: 10 }
    ],
    removable: true
  },
  {
    id: 'forge',
    name: 'Forge',
    era: 'agriculture',
    kind: 'producer',
    description: 'Produit beaucoup de chaleur et prépare l’industrie, au prix d’une pollution cachée légère.',
    asset: 'assets/technologies/forge.svg',
    tags: ['heat', 'industry', 'fossil_like'],
    productionPerSecond: { heat: 6.5 },
    consumptionPerSecond: { mechanical: 0.7 },
    hiddenPollutionDebtPerSecond: 0.012,
    purchaseOptions: [
      { id: 'standard_payment', label: 'Paiement standard', cost: { heat: 120, mechanical: 38 }, buildTimeSeconds: 18, pollutionDebt: 2 },
      { id: 'larger_payment', label: 'Paiement renforcé', cost: { heat: 160, mechanical: 48 }, buildTimeSeconds: 10, pollutionDebt: 2, requirements: ['wood_reserve'] }
    ],
    removable: true,
    documentaryId: 'tech_forge'
  },
  {
    id: 'coal_mine',
    name: 'Mine de charbon',
    era: 'industrie',
    kind: 'producer',
    description: 'Très forte chaleur disponible. Très tentant. Très sale.',
    asset: 'assets/technologies/coal_mine.svg',
    tags: ['coal', 'fossil', 'heat'],
    productionPerSecond: { heat: 15 },
    hiddenPollutionDebtPerSecond: 0.045,
    pollutionPerSecond: 0.045,
    purchaseOptions: [
      { id: 'open_gallery', label: 'Galeries rapides', cost: { heat: 210, mechanical: 80 }, buildTimeSeconds: 24, pollutionDebt: 8 },
      { id: 'ventilated_gallery', label: 'Galeries ventilées', cost: { heat: 260, mechanical: 110 }, buildTimeSeconds: 30, pollutionDebt: 4 }
    ],
    removable: true,
    documentaryId: 'tech_coal'
  },
  {
    id: 'boiler',
    name: 'Chaudière',
    era: 'industrie',
    kind: 'producer',
    description: 'Convertit de la chaleur en force mécanique. À surveiller si la chaleur tombe.',
    asset: 'assets/technologies/boiler.svg',
    tags: ['steam', 'mechanical', 'fossil'],
    productionPerSecond: { mechanical: 9 },
    consumptionPerSecond: { heat: 3.2 },
    hiddenPollutionDebtPerSecond: 0.035,
    pollutionPerSecond: 0.035,
    purchaseOptions: [
      { id: 'riveted', label: 'Chaudière rivetée', cost: { heat: 180, mechanical: 90 }, buildTimeSeconds: 25, pollutionDebt: 4 }
    ],
    removable: true,
    documentaryId: 'tech_steam'
  },
  {
    id: 'steam_engine',
    name: 'Machine à vapeur',
    era: 'industrie',
    kind: 'producer',
    description: 'Grosse production mécanique. Accélère tout, y compris la pollution cachée.',
    asset: 'assets/technologies/steam_engine.svg',
    tags: ['steam', 'mechanical', 'fossil'],
    productionPerSecond: { mechanical: 17 },
    consumptionPerSecond: { heat: 5.2 },
    hiddenPollutionDebtPerSecond: 0.065,
    pollutionPerSecond: 0.065,
    purchaseOptions: [
      { id: 'coal_line', label: 'Filière charbon', cost: { heat: 300, mechanical: 140 }, buildTimeSeconds: 32, pollutionDebt: 7 },
      { id: 'efficient_line', label: 'Rendement amélioré', cost: { heat: 380, mechanical: 165 }, buildTimeSeconds: 40, pollutionDebt: 3.5 }
    ],
    removable: true,
    documentaryId: 'tech_steam'
  },
  {
    id: 'blast_furnace',
    name: 'Haut fourneau',
    era: 'industrie',
    kind: 'producer',
    description: 'Boost massif de chaleur industrielle, mais dette de pollution sévère.',
    asset: 'assets/technologies/blast_furnace.svg',
    tags: ['industry', 'fossil', 'heat'],
    productionPerSecond: { heat: 24 },
    consumptionPerSecond: { mechanical: 1.8 },
    hiddenPollutionDebtPerSecond: 0.08,
    pollutionPerSecond: 0.08,
    purchaseOptions: [
      { id: 'coke_route', label: 'Filière coke', cost: { heat: 420, mechanical: 165 }, buildTimeSeconds: 42, pollutionDebt: 10 }
    ],
    removable: true
  },
  {
    id: 'dynamo',
    name: 'Dynamo',
    era: 'electricite_petrole',
    kind: 'producer',
    description: 'Première production électrique simple. Faible puissance mais très sûre.',
    asset: 'assets/technologies/dynamo.svg',
    tags: ['electricity', 'mechanical'],
    productionPerSecond: { electricity: 3.5 },
    consumptionPerSecond: { mechanical: 0.8 },
    purchaseOptions: [
      { id: 'workshop', label: 'Atelier mécanique', cost: { heat: 180, mechanical: 120 }, buildTimeSeconds: 20 }
    ],
    removable: true,
    documentaryId: 'tech_dynamo'
  },
  {
    id: 'hydro',
    name: 'Hydroélectricité',
    era: 'electricite_petrole',
    kind: 'producer',
    description: 'Production électrique robuste et presque sans pollution directe.',
    asset: 'assets/technologies/hydro.svg',
    tags: ['electricity', 'water', 'low-carbon'],
    productionPerSecond: { electricity: 12 },
    storageBonus: { electricity: 45 },
    purchaseOptions: [
      { id: 'valley_work', label: 'Travaux de vallée', cost: { heat: 280, mechanical: 180 }, buildTimeSeconds: 45, pollutionDebt: 1.5 }
    ],
    removable: true,
    documentaryId: 'tech_hydro'
  },
  {
    id: 'coal_power_plant',
    name: 'Centrale charbon',
    era: 'electricite_petrole',
    kind: 'producer',
    description: 'Très forte électricité rapide. Le raccourci fossile classique.',
    asset: 'assets/technologies/coal_power_plant.svg',
    tags: ['electricity', 'coal', 'fossil'],
    productionPerSecond: { electricity: 22 },
    consumptionPerSecond: { heat: 7 },
    hiddenPollutionDebtPerSecond: 0.14,
    pollutionPerSecond: 0.14,
    purchaseOptions: [
      { id: 'thermal_route', label: 'Filière thermique', cost: { heat: 520, mechanical: 240 }, buildTimeSeconds: 48, pollutionDebt: 13 },
      { id: 'cleaner_boilers', label: 'Chaudières plus propres', cost: { heat: 650, mechanical: 280, electricity: 30 }, buildTimeSeconds: 58, pollutionDebt: 7 }
    ],
    removable: true,
    documentaryId: 'tech_coal_power'
  },
  {
    id: 'early_fuels',
    name: 'Premiers carburants',
    era: 'electricite_petrole',
    kind: 'producer',
    description: 'Stockage confortable et forte inertie. C’est pratique, donc dangereux.',
    asset: 'assets/technologies/early_fuels.svg',
    tags: ['fuel', 'fossil'],
    productionPerSecond: { fuel: 10 },
    storageBonus: { fuel: 260 },
    hiddenPollutionDebtPerSecond: 0.055,
    pollutionPerSecond: 0.055,
    purchaseOptions: [
      { id: 'oil_depot', label: 'Dépôt pétrolier', cost: { heat: 260, mechanical: 140 }, buildTimeSeconds: 26, pollutionDebt: 4 }
    ],
    removable: true,
    documentaryId: 'tech_fuels'
  },
  {
    id: 'electric_grid',
    name: 'Petit réseau électrique',
    era: 'electricite_petrole',
    kind: 'storage',
    description: 'Augmente la capacité électrique et amortit les premiers déficits.',
    asset: 'assets/technologies/electric_grid.svg',
    tags: ['electricity', 'storage', 'grid'],
    storageBonus: { electricity: 160 },
    purchaseOptions: [
      { id: 'copper_lines', label: 'Lignes locales', cost: { heat: 220, mechanical: 180, electricity: 20 }, buildTimeSeconds: 30 }
    ],
    documentaryId: 'tech_grid'
  },
  {
    id: 'refinery',
    name: 'Raffinerie',
    era: 'trente_glorieuses',
    kind: 'producer',
    description: 'Fournit beaucoup de carburants et de stockage, mais alimente la crise pollution.',
    asset: 'assets/technologies/refinery.svg',
    tags: ['fuel', 'fossil', 'industry'],
    productionPerSecond: { fuel: 28 },
    storageBonus: { fuel: 620 },
    pollutionPerSecond: 0.12,
    purchaseOptions: [
      { id: 'fuel_route', label: 'Filière pétrole rapide', cost: { fuel: 220, heat: 420, mechanical: 240 }, buildTimeSeconds: 50, pollutionDebt: 9 },
      { id: 'electrified_route', label: 'Filière partiellement électrifiée', cost: { electricity: 110, mechanical: 260 }, buildTimeSeconds: 62, pollutionDebt: 4 }
    ],
    removable: true,
    documentaryId: 'tech_refinery'
  },
  {
    id: 'gas_power_plant',
    name: 'Centrale gaz',
    era: 'trente_glorieuses',
    kind: 'producer',
    description: 'Électricité flexible, utile pour survivre, mais encore fossile.',
    asset: 'assets/technologies/gas_power_plant.svg',
    tags: ['electricity', 'fuel', 'fossil'],
    productionPerSecond: { electricity: 36 },
    consumptionPerSecond: { fuel: 2.5 },
    pollutionPerSecond: 0.095,
    purchaseOptions: [
      { id: 'gas_turbine', label: 'Turbine gaz', cost: { fuel: 260, mechanical: 240, electricity: 80 }, buildTimeSeconds: 55, pollutionDebt: 6 }
    ],
    removable: true
  },
  {
    id: 'modern_dam',
    name: 'Barrage moderne',
    era: 'trente_glorieuses',
    kind: 'producer',
    description: 'Gros socle électrique bas-carbone et capacité réseau.',
    asset: 'assets/technologies/modern_dam.svg',
    tags: ['electricity', 'water', 'low-carbon'],
    productionPerSecond: { electricity: 32 },
    storageBonus: { electricity: 220 },
    purchaseOptions: [
      { id: 'civil_engineering', label: 'Génie civil lourd', cost: { heat: 720, mechanical: 420, electricity: 120 }, buildTimeSeconds: 70, pollutionDebt: 3 }
    ],
    removable: true,
    documentaryId: 'tech_hydro'
  },
  {
    id: 'nuclear_gen1',
    name: 'Nucléaire première génération',
    era: 'trente_glorieuses',
    kind: 'producer',
    description: 'Très forte électricité, peu de pollution directe, long à construire.',
    asset: 'assets/technologies/nuclear_gen1.svg',
    tags: ['electricity', 'nuclear', 'low-carbon'],
    productionPerSecond: { electricity: 58 },
    pollutionPerSecond: 0.008,
    purchaseOptions: [
      { id: 'thermal_route', label: 'Filière thermique', cost: { heat: 850, mechanical: 480 }, buildTimeSeconds: 95, pollutionDebt: 5 },
      { id: 'electrified_route', label: 'Filière électrifiée', cost: { electricity: 220, mechanical: 520 }, buildTimeSeconds: 82, pollutionDebt: 2 }
    ],
    removable: true,
    documentaryId: 'tech_nuclear'
  },
  {
    id: 'energy_efficiency',
    name: 'Efficacité énergétique',
    era: 'trente_glorieuses',
    kind: 'conversion',
    description: 'Réduit une partie des consommations de chaleur, carburants et électricité. Moins spectaculaire qu’une centrale, souvent décisif.',
    asset: 'assets/technologies/energy_efficiency.svg',
    tags: ['efficiency', 'conversion'],
    consumptionPerSecond: { heat: -3.5, fuel: -3.5, electricity: -1.5 },
    pollutionDeltaPerSecond: -0.025,
    maxQuantity: 4,
    purchaseOptions: [
      { id: 'renovation_program', label: 'Programme de sobriété technique', cost: { electricity: 120, mechanical: 240, heat: 260 }, buildTimeSeconds: 45 }
    ],
    documentaryId: 'tech_efficiency'
  },
  {
    id: 'modern_nuclear',
    name: 'Nucléaire moderne',
    era: 'moderne_futur',
    kind: 'producer',
    description: 'Très puissant, lent, faible pollution directe. Le pari de stabilité électrique.',
    asset: 'assets/technologies/modern_nuclear.svg',
    tags: ['electricity', 'nuclear', 'low-carbon'],
    productionPerSecond: { electricity: 96 },
    pollutionPerSecond: 0.004,
    purchaseOptions: [
      { id: 'industrial_route', label: 'Filière industrielle', cost: { electricity: 420, mechanical: 760, heat: 720 }, buildTimeSeconds: 110, pollutionDebt: 3 },
      { id: 'electrified_route', label: 'Chantier électrifié', cost: { electricity: 620, mechanical: 680 }, buildTimeSeconds: 92, pollutionDebt: 1.2 }
    ],
    removable: true,
    documentaryId: 'tech_nuclear'
  },
  {
    id: 'solar_farm',
    name: 'Parc solaire',
    era: 'moderne_futur',
    kind: 'producer',
    description: 'Bas-carbone rapide à déployer, mais puissance unitaire modérée dans cette version.',
    asset: 'assets/technologies/solar_farm.svg',
    tags: ['electricity', 'renewable', 'low-carbon'],
    productionPerSecond: { electricity: 28 },
    purchaseOptions: [
      { id: 'standard_panels', label: 'Panneaux standard', cost: { electricity: 180, mechanical: 300 }, buildTimeSeconds: 42, pollutionDebt: 1 },
      { id: 'high_yield_panels', label: 'Haut rendement', cost: { electricity: 260, mechanical: 330 }, buildTimeSeconds: 48, pollutionDebt: 0.6 }
    ],
    removable: true,
    documentaryId: 'tech_solar'
  },
  {
    id: 'wind_farm',
    name: 'Parc éolien',
    era: 'moderne_futur',
    kind: 'producer',
    description: 'Production électrique renouvelable, très utile couplée au stockage.',
    asset: 'assets/technologies/wind_farm.svg',
    tags: ['electricity', 'renewable', 'wind', 'low-carbon'],
    productionPerSecond: { electricity: 31 },
    purchaseOptions: [
      { id: 'wind_corridor', label: 'Couloir de vent', cost: { electricity: 220, mechanical: 360 }, buildTimeSeconds: 50, pollutionDebt: 1 }
    ],
    removable: true,
    documentaryId: 'tech_wind'
  },
  {
    id: 'batteries',
    name: 'Batteries avancées',
    era: 'moderne_futur',
    kind: 'storage',
    description: 'Gros buffer électrique pour encaisser les jalons modernes.',
    asset: 'assets/technologies/batteries.svg',
    tags: ['electricity', 'storage'],
    storageBonus: { electricity: 640 },
    purchaseOptions: [
      { id: 'battery_line', label: 'Ligne batteries', cost: { electricity: 260, mechanical: 300 }, buildTimeSeconds: 45, pollutionDebt: 1.4 }
    ],
    documentaryId: 'tech_batteries'
  },
  {
    id: 'pumped_hydro',
    name: 'STEP',
    era: 'moderne_futur',
    kind: 'storage',
    description: 'Stockage massif et très robuste. Cher, mais game saver.',
    asset: 'assets/technologies/pumped_hydro.svg',
    tags: ['electricity', 'storage', 'water', 'low-carbon'],
    storageBonus: { electricity: 980 },
    productionPerSecond: { electricity: 10 },
    purchaseOptions: [
      { id: 'mountain_reservoir', label: 'Réservoirs en altitude', cost: { electricity: 420, mechanical: 520, heat: 420 }, buildTimeSeconds: 75, pollutionDebt: 1.5 }
    ],
    removable: true,
    documentaryId: 'tech_pumped_hydro'
  },
  {
    id: 'heat_pumps',
    name: 'Pompes à chaleur',
    era: 'moderne_futur',
    kind: 'conversion',
    description: 'Baisse carburants et chaleur fossile, mais augmente la tension électrique.',
    asset: 'assets/technologies/heat_pumps.svg',
    tags: ['conversion', 'electricity', 'heating'],
    consumptionPerSecond: { fuel: -8.5, heat: -5.5, electricity: 6.5 },
    pollutionDeltaPerSecond: -0.08,
    maxQuantity: 4,
    purchaseOptions: [
      { id: 'housing_program', label: 'Rénovation + PAC', cost: { electricity: 260, mechanical: 260, heat: 160 }, buildTimeSeconds: 52 }
    ],
    documentaryId: 'tech_heat_pumps'
  },
  {
    id: 'electric_vehicles',
    name: 'Véhicules électriques',
    era: 'moderne_futur',
    kind: 'conversion',
    description: 'Déplace le transport des carburants vers l’électricité.',
    asset: 'assets/technologies/electric_vehicles.svg',
    tags: ['conversion', 'transport', 'electricity'],
    consumptionPerSecond: { fuel: -12, electricity: 10 },
    pollutionDeltaPerSecond: -0.09,
    maxQuantity: 4,
    purchaseOptions: [
      { id: 'charging_network', label: 'Recharge + véhicules', cost: { electricity: 360, mechanical: 330 }, buildTimeSeconds: 58 }
    ],
    documentaryId: 'tech_electric_vehicles'
  },
  {
    id: 'experimental_fusion',
    name: 'Fusion expérimentale',
    era: 'moderne_futur',
    kind: 'producer',
    description: 'Objectif final symbolique : très chère, très longue, stabilisatrice.',
    asset: 'assets/technologies/experimental_fusion.svg',
    tags: ['electricity', 'future', 'low-carbon'],
    productionPerSecond: { electricity: 160 },
    storageBonus: { electricity: 400 },
    maxQuantity: 1,
    purchaseOptions: [
      { id: 'prototype', label: 'Prototype expérimental', cost: { electricity: 980, mechanical: 900, heat: 720 }, buildTimeSeconds: 120, pollutionDebt: 1 }
    ],
    removable: false,
    documentaryId: 'tech_fusion'
  }
];

export const UPGRADES: Upgrade[] = [
  {
    id: 'better_foyer',
    name: 'Foyer amélioré',
    era: 'prehistoire',
    description: 'Les foyers et feux futurs produisent +25 % de chaleur et durent plus longtemps.',
    asset: 'assets/technologies/better_foyer.svg',
    affectsTags: ['fire'],
    effect: { productionMultiplier: 1.25, lifetimeMultiplier: 1.15 },
    appliesTo: 'both',
    purchaseOptions: [{ id: 'careful_airflow', label: 'Tirage optimisé', cost: { heat: 70 }, buildTimeSeconds: 8 }],
    documentaryId: 'upgrade_efficiency'
  },
  {
    id: 'optimized_blades',
    name: 'Pales optimisées',
    era: 'agriculture',
    description: 'Les moulins produisent +20 % de force mécanique et s’usent moins vite.',
    asset: 'assets/technologies/optimized_blades.svg',
    affectsTags: ['mill'],
    effect: { productionMultiplier: 1.2, lifetimeMultiplier: 1.2 },
    appliesTo: 'both',
    purchaseOptions: [{ id: 'carpentry', label: 'Charpenterie précise', cost: { heat: 140, mechanical: 70 }, buildTimeSeconds: 14 }]
  },
  {
    id: 'high_pressure_boiler',
    name: 'Chaudière haute pression',
    era: 'industrie',
    description: 'La vapeur produit +30 %, mais les équipements fossiles polluent +10 %.',
    asset: 'assets/technologies/high_pressure_boiler.svg',
    affectsTags: ['steam'],
    effect: { productionMultiplier: 1.3, pollutionMultiplier: 1.1 },
    appliesTo: 'both',
    purchaseOptions: [{ id: 'pressure_valves', label: 'Soupapes et pression', cost: { heat: 360, mechanical: 210 }, buildTimeSeconds: 28, pollutionDebt: 4 }]
  },
  {
    id: 'industrial_filters',
    name: 'Filtres industriels',
    era: 'trente_glorieuses',
    description: 'Les moyens fossiles polluent -35 % et tiennent mieux dans le temps.',
    asset: 'assets/technologies/industrial_filters.svg',
    affectsTags: ['fossil'],
    effect: { pollutionMultiplier: 0.65, lifetimeMultiplier: 1.25 },
    appliesTo: 'both',
    purchaseOptions: [{ id: 'smoke_filters', label: 'Filtres de fumée', cost: { electricity: 180, mechanical: 280 }, buildTimeSeconds: 40 }],
    documentaryId: 'tech_filters'
  },
  {
    id: 'smart_grid',
    name: 'Smart grid simplifié',
    era: 'moderne_futur',
    description: 'Booste le clic final et augmente les stockages électriques de 25 %.',
    asset: 'assets/technologies/smart_grid.svg',
    affectsTags: ['electricity', 'storage'],
    effect: { storageMultiplier: 1.25, clickMultiplier: 1.35 },
    appliesTo: 'both',
    purchaseOptions: [{ id: 'digital_grid', label: 'Pilotage numérique', cost: { electricity: 520, mechanical: 420 }, buildTimeSeconds: 45 }],
    documentaryId: 'tech_smart_grid'
  }
];

export const ALL_ITEMS = [...TECHNOLOGIES, ...UPGRADES];

export const DOCUMENTARIES: Record<string, Documentary> = {
  era_prehistoire: {
    id: 'era_prehistoire',
    title: 'Feu et chaleur',
    body: 'Le début du jeu réduit volontairement l’énergie à la chaleur : cuisson, chauffage et protection. C’est une simplification assumée pour apprendre la boucle clicker sans noyer le joueur.',
    gameplay: 'Surveille surtout le stock de chaleur et construis du buffer avant les jalons.'
  },
  era_agriculture: {
    id: 'era_agriculture',
    title: 'Moulins et agriculture',
    body: 'L’agriculture transforme les besoins : il ne suffit plus de chauffer, il faut moudre, pomper, actionner et fabriquer.',
    gameplay: 'La force mécanique devient une jauge critique, peu stockable.'
  },
  era_industrie: {
    id: 'era_industrie',
    title: 'Industrialisation',
    body: 'La révolution industrielle fait passer la production manufacturière à grande échelle. Le charbon et la vapeur rendent la croissance énergétique très tentante.',
    gameplay: 'Les technologies fossiles sauvent souvent une crise immédiate, mais chargent la pollution cachée.',
    sourceLabel: 'Ministère de l’Économie — Révolution industrielle',
    sourceUrl: 'https://www.economie.gouv.fr/facileco/culture-economique/120-000-ans-dhistoire/la-revolution-industrielle'
  },
  era_electricite_petrole: {
    id: 'era_electricite_petrole',
    title: 'Électricité et pétrole',
    body: 'Le jeu introduit l’électricité et les carburants au même moment pour éviter un récit trop linéaire. Les deux deviennent centraux dans les usages modernes.',
    gameplay: 'Les carburants stockent très bien. L’électricité devient vite la jauge la plus tendue.'
  },
  era_trente_glorieuses: {
    id: 'era_trente_glorieuses',
    title: 'Pollution révélée',
    body: 'La pollution accumulée jusque-là devient visible. Sa valeur est plafonnée à 65 % pour éviter un game over immédiat.',
    gameplay: 'Démantèle les moyens les plus sales, achète des filtres et prépare des conversions.'
  },
  era_moderne_futur: {
    id: 'era_moderne_futur',
    title: 'Décarboner électrifie',
    body: 'Le scénario moderne montre une tension simple : réduire les carburants et la pollution peut fortement augmenter la consommation électrique.',
    gameplay: 'Ne convertis pas tout trop tôt : produis et stocke l’électricité avant.'
  },
  milestone_cooking: {
    id: 'milestone_cooking',
    title: 'Cuisson régulière',
    body: 'La cuisson rend la chaleur quotidienne. Dans le jeu, ce premier jalon sert de test : sans production automatique, le stock chute.',
    gameplay: 'Un foyer ou une réserve de bois suffit généralement à absorber le choc.'
  },
  milestone_heated_habitat: {
    id: 'milestone_heated_habitat',
    title: 'Habitat chauffé',
    body: 'Le chauffage transforme un usage ponctuel en demande permanente. Cette logique reviendra plus tard avec le logement moderne.',
    gameplay: 'Ajoute de la production et pas seulement du stockage.'
  },
  milestone_bread: {
    id: 'milestone_bread',
    title: 'Production régulière de pain',
    body: 'Le pain illustre bien le couple chaleur + mécanique : il faut cuire, mais aussi moudre et organiser le travail.',
    gameplay: 'Les moulins sont la réponse la plus saine.'
  },
  milestone_tools: {
    id: 'milestone_tools',
    title: 'Outils agricoles',
    body: 'La fabrication d’outils ajoute des besoins d’atelier : chaleur de forge et force mécanique.',
    gameplay: 'La forge aide, mais elle amorce déjà une petite dette de pollution.'
  },
  milestone_textile: {
    id: 'milestone_textile',
    title: 'Textile mécanisé',
    body: 'L’industrialisation fait exploser les besoins mécaniques continus. La vapeur devient une réponse évidente.',
    gameplay: 'Si la force mécanique est négative au moment du jalon, construis chaudière ou machine à vapeur.'
  },
  milestone_rail: {
    id: 'milestone_rail',
    title: 'Transport ferroviaire de marchandises',
    body: 'Les premières lignes françaises sont liées à des bassins industriels et au transport du charbon, notamment autour de Saint-Étienne.',
    gameplay: 'Le rail augmente fortement chaleur et mécanique. Anticipe les temps de construction.',
    sourceLabel: 'Histoire par l’image — Premiers chemins de fer',
    sourceUrl: 'https://histoire-image.org/etudes/premiers-chemins-fer'
  },
  milestone_lighting: {
    id: 'milestone_lighting',
    title: 'Éclairage urbain',
    body: 'L’éclairage est un bon premier usage électrique : visible, socialement parlant, et très lisible pour le joueur.',
    gameplay: 'Une dynamo seule risque d’être insuffisante : hydro ou réseau deviennent utiles.'
  },
  milestone_motorized_transport: {
    id: 'milestone_motorized_transport',
    title: 'Transports motorisés',
    body: 'Les carburants sont confortables parce qu’ils se stockent facilement. Cette force devient un piège quand la pollution est révélée.',
    gameplay: 'Construis du stockage carburant, mais garde une voie électrique en tête.'
  },
  milestone_mass_car: {
    id: 'milestone_mass_car',
    title: 'Voiture individuelle de masse',
    body: 'Dans les données récentes françaises, les transports restent le premier secteur émetteur de gaz à effet de serre, très lié à la combustion de carburants.',
    gameplay: 'Les raffineries aident à court terme, les conversions sauveront la suite.',
    sourceLabel: 'Ministère de la Transition écologique — véhicules électriques',
    sourceUrl: 'https://www.ecologie.gouv.fr/politiques-publiques/developper-vehicules-electriques'
  },
  milestone_appliances: {
    id: 'milestone_appliances',
    title: 'Électroménager domestique',
    body: 'L’équipement des foyers fait de l’électricité une énergie de confort quotidien.',
    gameplay: 'Avant ce jalon, le réseau et au moins une grosse source électrique sont recommandés.'
  },
  milestone_modern_heating: {
    id: 'milestone_modern_heating',
    title: 'Chauffage moderne',
    body: 'Le chauffage peut reposer sur plusieurs vecteurs : chaleur, carburants, gaz, électricité. Le jeu simplifie tout en gardant le dilemme.',
    gameplay: 'Les pompes à chaleur réduiront la pollution plus tard, mais chargeront l’électricité.'
  },
  milestone_data_centers: {
    id: 'milestone_data_centers',
    title: 'Numérisation et data centers',
    body: 'La numérisation est représentée comme une demande électrique supplémentaire. Le point important : les usages modernes ne font pas disparaître la tension réseau.',
    gameplay: 'Stockage électrique fortement recommandé.'
  },
  milestone_transport_electrification: {
    id: 'milestone_transport_electrification',
    title: 'Électrification des transports',
    body: 'L’électrification réduit la combustion de carburants, mais demande davantage d’électricité pilotable.',
    gameplay: 'Ne clique pas sur toutes les conversions si ton solde électrique est déjà fragile.'
  },
  milestone_low_carbon_industry: {
    id: 'milestone_low_carbon_industry',
    title: 'Industrie bas-carbone',
    body: 'L’industrie bas-carbone est volontairement représentée comme très électrique. C’est le boss final de tension électrique.',
    gameplay: 'Combine nucléaire, renouvelables et stockage.'
  },
  tech_campfire: {
    id: 'tech_campfire',
    title: 'Premier feu entretenu',
    body: 'Un feu entretenu transforme un clic ponctuel en production automatique. C’est le premier moment “Cookie Clicker”.',
    gameplay: 'La production par seconde devient plus importante que le clic brut.'
  },
  tech_foyer: {
    id: 'tech_foyer',
    title: 'Foyer domestique',
    body: 'Le foyer canalise la chaleur et stabilise les usages. Le jeu l’utilise comme premier vrai producteur efficace.',
    gameplay: 'Bon achat avant “Habitat chauffé”.'
  },
  tech_storage: {
    id: 'tech_storage',
    title: 'Stocker n’est pas produire',
    body: 'Une capacité plus grande retarde les crises, mais ne corrige pas un solde négatif. Ce principe vaut jusqu’au stockage électrique moderne.',
    gameplay: 'Surveille toujours le net, pas seulement le stock.'
  },
  tech_animal_traction: {
    id: 'tech_animal_traction',
    title: 'Traction organisée',
    body: 'La force animale représente une mécanique régulière avant les machines. Elle reste limitée mais très fiable.',
    gameplay: 'Utile pour débloquer rapidement les premiers moulins.'
  },
  tech_mill: {
    id: 'tech_mill',
    title: 'Moulins',
    body: 'Les moulins convertissent eau ou vent en travail mécanique. Dans le jeu, ils sont la réponse propre aux premiers besoins agricoles.',
    gameplay: 'Très bons producteurs mécaniques avant l’industrie.'
  },
  tech_forge: {
    id: 'tech_forge',
    title: 'Forge',
    body: 'La forge met en scène la chaleur productive, pas seulement domestique. Elle prépare le passage vers l’industrie.',
    gameplay: 'Forte chaleur, petite dette cachée.'
  },
  tech_coal: {
    id: 'tech_coal',
    title: 'Charbon',
    body: 'Le charbon fournit une énergie dense et facile à mobiliser pour l’industrie. C’est volontairement très fort en gameplay.',
    gameplay: 'Parfait pour survivre vite, dangereux après révélation pollution.'
  },
  tech_steam: {
    id: 'tech_steam',
    title: 'Machine à vapeur',
    body: 'La vapeur permet de convertir la chaleur en mouvement mécanique massif. Elle rend la croissance plus rapide, mais plus dépendante du charbon.',
    gameplay: 'Vérifie que la chaleur reste positive.'
  },
  tech_dynamo: {
    id: 'tech_dynamo',
    title: 'Dynamo',
    body: 'La dynamo rend visible la conversion de mécanique en électricité. C’est le pont pédagogique vers la ville moderne.',
    gameplay: 'Faible mais sûre, idéale pour amorcer l’électricité.'
  },
  tech_hydro: {
    id: 'tech_hydro',
    title: 'Hydroélectricité',
    body: 'L’hydroélectricité joue le rôle de pilier bas-carbone historique du système électrique français.',
    gameplay: 'Long à construire, excellent avant les gros jalons électriques.'
  },
  tech_coal_power: {
    id: 'tech_coal_power',
    title: 'Centrale charbon',
    body: 'La centrale charbon est volontairement un bouton panique : beaucoup d’électricité, vite, avec une pollution forte.',
    gameplay: 'À démanteler ou filtrer après révélation.'
  },
  tech_fuels: {
    id: 'tech_fuels',
    title: 'Carburants',
    body: 'Les carburants sont très stockables. Cette qualité crée une fausse impression de sécurité.',
    gameplay: 'Bon buffer, mais surveille la pollution.'
  },
  tech_grid: {
    id: 'tech_grid',
    title: 'Réseau électrique simplifié',
    body: 'Le jeu ne simule pas un réseau RTE : il représente seulement la capacité à encaisser et distribuer davantage d’électricité.',
    gameplay: 'Augmente la capacité électrique, pas la production.'
  },
  tech_refinery: {
    id: 'tech_refinery',
    title: 'Raffinerie',
    body: 'La raffinerie matérialise le confort du pétrole dans les Trente Glorieuses. Elle aide beaucoup à court terme.',
    gameplay: 'Produit carburants + stockage, mais pollue.'
  },
  tech_nuclear: {
    id: 'tech_nuclear',
    title: 'Nucléaire français',
    body: 'Le site de Marcoule accueille G1, mis en service en 1956, puis G2 et G3. Ces réacteurs fournissent les premiers kilowattheures français d’origine nucléaire.',
    gameplay: 'Électricité forte, faible pollution directe, temps de construction long.',
    sourceLabel: 'CEA Marcoule — histoire du site',
    sourceUrl: 'https://marcoule.cea.fr/Marcoule/Pages/histoire-de-marcoule.aspx'
  },
  tech_efficiency: {
    id: 'tech_efficiency',
    title: 'Efficacité énergétique',
    body: 'Réduire les besoins est moins spectaculaire que construire, mais peut sauver une partie.',
    gameplay: 'Une conversion défensive pour retrouver du net positif.'
  },
  tech_filters: {
    id: 'tech_filters',
    title: 'Filtres industriels',
    body: 'Les filtres ne rendent pas le fossile neutre. Ils donnent simplement au joueur un moyen de corriger une trajectoire trop sale.',
    gameplay: 'Réduit la pollution/s des moyens fossiles.'
  },
  tech_solar: {
    id: 'tech_solar',
    title: 'Solaire',
    body: 'Le solaire moderne complète le mix bas-carbone. Le jeu le rend rapide mais moins massif qu’un gros socle pilotable.',
    gameplay: 'À combiner avec batteries ou STEP.'
  },
  tech_wind: {
    id: 'tech_wind',
    title: 'Éolien',
    body: 'L’éolien apporte une production renouvelable utile dans la transition, surtout avec du stockage.',
    gameplay: 'Bon ratio coût/délai en fin de partie.'
  },
  tech_batteries: {
    id: 'tech_batteries',
    title: 'Batteries',
    body: 'Le stockage électrique devient essentiel quand la consommation est très électrifiée.',
    gameplay: 'Augmente le temps de réaction avant crise électrique.'
  },
  tech_pumped_hydro: {
    id: 'tech_pumped_hydro',
    title: 'STEP',
    body: 'La STEP est modélisée comme un stockage électrique massif avec un petit effet stabilisateur.',
    gameplay: 'Excellent pour le dernier tiers du jeu.'
  },
  tech_heat_pumps: {
    id: 'tech_heat_pumps',
    title: 'Pompes à chaleur',
    body: 'Les pompes à chaleur déplacent une part du chauffage vers l’électricité et réduisent les carburants.',
    gameplay: 'Très fort contre la pollution, risqué si l’électricité est fragile.'
  },
  tech_electric_vehicles: {
    id: 'tech_electric_vehicles',
    title: 'Véhicules électriques',
    body: 'Dans le jeu, les véhicules électriques sont une conversion : moins de carburants, plus d’électricité.',
    gameplay: 'Attends un solde électrique confortable avant d’enchaîner.'
  },
  tech_smart_grid: {
    id: 'tech_smart_grid',
    title: 'Smart grid simplifié',
    body: 'Le smart grid n’est pas une IA magique : il représente un pilotage plus fin de la demande et du stockage.',
    gameplay: 'Améliore le clic et les capacités électriques.'
  },
  tech_fusion: {
    id: 'tech_fusion',
    title: 'Prototype de fusion',
    body: 'La fusion expérimentale est traitée comme un symbole de stabilisation, pas comme une solution finale à tous les problèmes.',
    gameplay: 'Objectif de prestige : très cher, très long, très puissant.'
  },
  upgrade_efficiency: {
    id: 'upgrade_efficiency',
    title: 'Amélioration de rendement',
    body: 'Les améliorations rendent l’anticipation rentable. Ici, elles s’appliquent aux producteurs existants et futurs pour garder une boucle lisible.',
    gameplay: 'Acheter tôt évite de multiplier les constructions.'
  }
};
