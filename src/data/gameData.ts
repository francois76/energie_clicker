import type { Documentary, Energy, Era, Milestone, Technology, Upgrade } from '../types';

export const ENERGIES: Energy[] = ['heat', 'mechanical', 'fuel', 'electricity'];

export const ENERGY_META: Record<Energy, { label: string; short: string; unit: string; rateUnit: string; icon: string; cssVar: string }> = {
  heat: { label: 'Chaleur', short: 'Chaleur', unit: 'kW', rateUnit: 'kW/h', icon: 'assets/icons/energy-heat.svg', cssVar: '--energy-heat' },
  mechanical: { label: 'Force mécanique', short: 'Force', unit: 'kW', rateUnit: 'kW/h', icon: 'assets/icons/energy-mechanical.svg', cssVar: '--energy-mechanical' },
  fuel: { label: 'Carburants', short: 'Carburants', unit: 'kW', rateUnit: 'kW/h', icon: 'assets/icons/energy-fuel.svg', cssVar: '--energy-fuel' },
  electricity: { label: 'Électricité', short: 'Élec.', unit: 'kW', rateUnit: 'kW/h', icon: 'assets/icons/energy-electricity.svg', cssVar: '--energy-electricity' }
};

export const INITIAL_CAPACITY: Record<Energy, number> = {
  heat: 140,
  mechanical: 120,
  fuel: 280,
  electricity: 120
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
    passiveGainMultiplier: 0.62,
    constructionSlotBonus: 0
  },
  demo: {
    milestoneTotalSeconds: 30,
    milestoneVisibleSeconds: 22,
    transitionSeconds: 43,
    finalHoldSeconds: 15,
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
    entryConsumptionDelta: { mechanical: 1.2 },
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
    entryConsumptionDelta: { heat: 1.8, mechanical: 3.2 },
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
    entryConsumptionDelta: { electricity: 2.2, fuel: 2.0 },
    entryStockDelta: { fuel: 90 },
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
    entryConsumptionDelta: { fuel: 5.0, electricity: 4.8, heat: 2.4 },
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
    entryConsumptionDelta: { electricity: 10.0, fuel: -2.8 },
    technologiesUnlocked: ['modern_nuclear', 'solar_farm', 'wind_farm', 'batteries', 'pumped_hydro', 'heat_pumps', 'electric_vehicles', 'smart_grid', 'experimental_fusion'],
    milestones: ['data_centers', 'transport_electrification', 'low_carbon_industry'],
    transitionAnnouncementSeconds: 170,
    documentaryId: 'era_moderne_futur'
  }
];

export const MILESTONES: Milestone[] = [
  { id: 'regular_cooking', name: 'Cuisson régulière', era: 'prehistoire', consumptionDelta: { heat: 1.0 }, documentaryId: 'milestone_cooking' },
  { id: 'heated_habitat', name: 'Habitat chauffé', era: 'prehistoire', consumptionDelta: { heat: 1.9 }, documentaryId: 'milestone_heated_habitat' },
  { id: 'bread_production', name: 'Production régulière de pain', era: 'agriculture', consumptionDelta: { heat: 1.8, mechanical: 2.6 }, documentaryId: 'milestone_bread' },
  { id: 'agricultural_tools', name: 'Fabrication d’outils agricoles', era: 'agriculture', consumptionDelta: { heat: 3.4, mechanical: 3.2 }, documentaryId: 'milestone_tools' },
  { id: 'mechanized_textile', name: 'Production textile mécanisée', era: 'industrie', consumptionDelta: { mechanical: 8.5, heat: 4.6 }, hiddenPollutionDebtDelta: 4, documentaryId: 'milestone_textile' },
  { id: 'rail_freight', name: 'Transport ferroviaire de marchandises', era: 'industrie', consumptionDelta: { mechanical: 13.5, heat: 8.0 }, hiddenPollutionDebtDelta: 7, documentaryId: 'milestone_rail' },
  { id: 'urban_lighting', name: 'Éclairage urbain', era: 'electricite_petrole', consumptionDelta: { electricity: 8.5 }, documentaryId: 'milestone_lighting' },
  { id: 'motorized_transport', name: 'Premiers transports motorisés', era: 'electricite_petrole', consumptionDelta: { fuel: 10.5, mechanical: 3.2 }, hiddenPollutionDebtDelta: 7, pollutionDeltaPerSecond: 0.022, documentaryId: 'milestone_motorized_transport' },
  { id: 'mass_car', name: 'Voiture individuelle de masse', era: 'trente_glorieuses', consumptionDelta: { fuel: 18 }, pollutionDeltaPerSecond: 0.055, documentaryId: 'milestone_mass_car' },
  { id: 'domestic_appliances', name: 'Électroménager domestique', era: 'trente_glorieuses', consumptionDelta: { electricity: 22 }, documentaryId: 'milestone_appliances' },
  { id: 'modern_heating', name: 'Chauffage moderne des logements', era: 'trente_glorieuses', consumptionDelta: { heat: 13, fuel: 14, electricity: 8 }, pollutionDeltaPerSecond: 0.05, documentaryId: 'milestone_modern_heating' },
  { id: 'data_centers', name: 'Numérisation et data centers', era: 'moderne_futur', consumptionDelta: { electricity: 28 }, documentaryId: 'milestone_data_centers' },
  { id: 'transport_electrification', name: 'Électrification des transports', era: 'moderne_futur', consumptionDelta: { electricity: 36, fuel: -16 }, pollutionDeltaPerSecond: -0.045, documentaryId: 'milestone_transport_electrification' },
  { id: 'low_carbon_industry', name: 'Industrie bas-carbone', era: 'moderne_futur', consumptionDelta: { electricity: 52, heat: 14, fuel: -14 }, pollutionDeltaPerSecond: -0.055, documentaryId: 'milestone_low_carbon_industry' }
];

export const TECHNOLOGIES: Technology[] = [
  { id: 'campfire', name: 'Feu de camp', era: 'prehistoire', kind: 'producer', description: 'Production de chaleur fragile mais très rapide à construire.', asset: 'assets/technologies/campfire.svg', tags: ['fire', 'primitive'], productionPerSecond: { heat: 1.4 }, purchaseOptions: [{ id: 'dry_wood', label: 'Bois sec', cost: { heat: 10 }, buildTimeSeconds: 2, note: 'Simple et propre.' }], removable: true, documentaryId: 'tech_campfire' },
  { id: 'foyer', name: 'Foyer', era: 'prehistoire', kind: 'producer', description: 'Meilleur rendement que le feu de camp, bon socle de début de partie.', asset: 'assets/technologies/foyer.svg', tags: ['fire', 'heat'], productionPerSecond: { heat: 3.2 }, purchaseOptions: [{ id: 'stone_ring', label: 'Pierres et braises', cost: { heat: 28 }, buildTimeSeconds: 5 }], removable: true, documentaryId: 'tech_foyer' },
  { id: 'wood_reserve', name: 'Réserve de bois', era: 'prehistoire', kind: 'storage', description: 'Ajoute un buffer de chaleur. Pas magique, mais précieux avant les jalons.', asset: 'assets/technologies/wood_reserve.svg', tags: ['storage', 'heat'], storageBonus: { heat: 120 }, purchaseOptions: [{ id: 'stack_wood', label: 'Empiler le bois', cost: { heat: 24 }, buildTimeSeconds: 8 }], documentaryId: 'tech_storage' },
  { id: 'charcoal', name: 'Charbon de bois', era: 'prehistoire', kind: 'producer', description: 'Plus dense que le bois, avec un léger coût environnemental caché.', asset: 'assets/technologies/charcoal.svg', tags: ['fire', 'fossil_like'], productionPerSecond: { heat: 5.4 }, hiddenPollutionDebtPerSecond: 0.005, storageBonus: { heat: 45 }, purchaseOptions: [{ id: 'slow_pit', label: 'Meule lente', cost: { heat: 58 }, buildTimeSeconds: 12, pollutionDebt: 1 }], removable: true },

  { id: 'animal_traction', name: 'Traction animale', era: 'agriculture', kind: 'producer', description: 'Production mécanique régulière, consomme un peu de chaleur indirecte.', asset: 'assets/technologies/animal_traction.svg', tags: ['mechanical', 'agriculture'], productionPerSecond: { mechanical: 2.6 }, consumptionPerSecond: { heat: 0.25 }, storageBonus: { mechanical: 80 }, purchaseOptions: [{ id: 'organized_stables', label: 'Organisation des attelages', cost: { heat: 55, mechanical: 8 }, buildTimeSeconds: 18 }, { id: 'trained_team', label: 'Attelages entraînés', cost: { heat: 85, mechanical: 22 }, buildTimeSeconds: 9 }], removable: true, documentaryId: 'tech_animal_traction' },
  { id: 'water_mill', name: 'Moulin à eau', era: 'agriculture', kind: 'producer', description: 'Excellent producteur mécanique bas-carbone, mais plus long à installer.', asset: 'assets/technologies/water_mill.svg', tags: ['mechanical', 'water', 'mill'], productionPerSecond: { mechanical: 5.6 }, storageBonus: { mechanical: 120 }, purchaseOptions: [{ id: 'river_site', label: 'Site de rivière', cost: { heat: 95, mechanical: 30 }, buildTimeSeconds: 30 }, { id: 'prepared_site', label: 'Chantier préparé', cost: { heat: 145, mechanical: 55 }, buildTimeSeconds: 15 }], removable: true, documentaryId: 'tech_mill' },
  { id: 'wind_mill', name: 'Moulin à vent', era: 'agriculture', kind: 'producer', description: 'Un peu moins stable que l’eau dans cette version, mais très utile.', asset: 'assets/technologies/wind_mill.svg', tags: ['mechanical', 'wind', 'mill'], productionPerSecond: { mechanical: 4.8 }, storageBonus: { mechanical: 100 }, purchaseOptions: [{ id: 'ridge_site', label: 'Site exposé', cost: { heat: 82, mechanical: 28 }, buildTimeSeconds: 26 }, { id: 'prefab_frame', label: 'Charpente préparée', cost: { heat: 125, mechanical: 50 }, buildTimeSeconds: 13 }], removable: true },
  { id: 'forge', name: 'Forge', era: 'agriculture', kind: 'producer', description: 'Produit beaucoup de chaleur et prépare l’industrie, au prix d’une pollution cachée légère.', asset: 'assets/technologies/forge.svg', tags: ['heat', 'industry', 'fossil_like'], productionPerSecond: { heat: 7.0 }, consumptionPerSecond: { mechanical: 0.7 }, storageBonus: { heat: 120, mechanical: 70 }, hiddenPollutionDebtPerSecond: 0.012, purchaseOptions: [{ id: 'standard_payment', label: 'Foyer de forge simple', cost: { heat: 110, mechanical: 36 }, buildTimeSeconds: 34, pollutionDebt: 2 }, { id: 'larger_payment', label: 'Atelier renforcé', cost: { heat: 170, mechanical: 70 }, buildTimeSeconds: 16, pollutionDebt: 2, requirements: ['wood_reserve'] }], removable: true, documentaryId: 'tech_forge' },

  { id: 'coal_mine', name: 'Mine de charbon', era: 'industrie', kind: 'producer', description: 'Très forte chaleur disponible. Très tentant. Très sale.', asset: 'assets/technologies/coal_mine.svg', tags: ['coal', 'fossil', 'heat'], productionPerSecond: { heat: 16 }, storageBonus: { heat: 220, mechanical: 80 }, hiddenPollutionDebtPerSecond: 0.045, pollutionPerSecond: 0.045, purchaseOptions: [{ id: 'open_gallery', label: 'Galeries manuelles', cost: { heat: 160, mechanical: 55 }, buildTimeSeconds: 44, pollutionDebt: 8 }, { id: 'mechanized_gallery', label: 'Galeries mécanisées', cost: { heat: 250, mechanical: 105 }, buildTimeSeconds: 22, pollutionDebt: 6 }], removable: true, documentaryId: 'tech_coal' },
  { id: 'boiler', name: 'Chaudière', era: 'industrie', kind: 'producer', description: 'Convertit de la chaleur en force mécanique. À surveiller si la chaleur tombe.', asset: 'assets/technologies/boiler.svg', tags: ['steam', 'mechanical', 'fossil'], productionPerSecond: { mechanical: 9.5 }, consumptionPerSecond: { heat: 3.2 }, storageBonus: { mechanical: 150 }, hiddenPollutionDebtPerSecond: 0.035, pollutionPerSecond: 0.035, purchaseOptions: [{ id: 'riveted', label: 'Chaudière rivetée', cost: { heat: 190, mechanical: 70 }, buildTimeSeconds: 42, pollutionDebt: 4 }, { id: 'workshop_built', label: 'Atelier de chaudronnerie', cost: { heat: 285, mechanical: 125 }, buildTimeSeconds: 20, pollutionDebt: 4 }], removable: true, documentaryId: 'tech_steam' },
  { id: 'steam_engine', name: 'Machine à vapeur', era: 'industrie', kind: 'producer', description: 'Grosse production mécanique. Accélère tout, y compris la pollution cachée.', asset: 'assets/technologies/steam_engine.svg', tags: ['steam', 'mechanical', 'fossil'], productionPerSecond: { mechanical: 18 }, consumptionPerSecond: { heat: 5.2 }, storageBonus: { mechanical: 260 }, hiddenPollutionDebtPerSecond: 0.065, pollutionPerSecond: 0.065, purchaseOptions: [{ id: 'coal_line', label: 'Filière charbon', cost: { heat: 300, mechanical: 125 }, buildTimeSeconds: 60, pollutionDebt: 7 }, { id: 'factory_line', label: 'Chaîne d’usine', cost: { heat: 460, mechanical: 220 }, buildTimeSeconds: 30, pollutionDebt: 5 }], removable: true, documentaryId: 'tech_steam' },
  { id: 'blast_furnace', name: 'Haut fourneau', era: 'industrie', kind: 'producer', description: 'Boost massif de chaleur industrielle, mais dette de pollution sévère.', asset: 'assets/technologies/blast_furnace.svg', tags: ['industry', 'fossil', 'heat'], productionPerSecond: { heat: 26 }, consumptionPerSecond: { mechanical: 1.8 }, storageBonus: { heat: 320, mechanical: 120 }, hiddenPollutionDebtPerSecond: 0.08, pollutionPerSecond: 0.08, purchaseOptions: [{ id: 'coke_route', label: 'Filière coke lente', cost: { heat: 420, mechanical: 210 }, buildTimeSeconds: 70, pollutionDebt: 10 }, { id: 'integrated_site', label: 'Site intégré', cost: { heat: 620, mechanical: 330 }, buildTimeSeconds: 36, pollutionDebt: 9 }], removable: true },

  { id: 'dynamo', name: 'Dynamo', era: 'electricite_petrole', kind: 'producer', description: 'Première production électrique simple. Faible puissance mais très sûre.', asset: 'assets/technologies/dynamo.svg', tags: ['electricity', 'mechanical'], productionPerSecond: { electricity: 4.0 }, consumptionPerSecond: { mechanical: 0.8 }, storageBonus: { electricity: 100 }, purchaseOptions: [{ id: 'workshop', label: 'Atelier mécanique', cost: { heat: 160, mechanical: 80 }, buildTimeSeconds: 30 }, { id: 'copper_workshop', label: 'Atelier cuivre', cost: { heat: 240, mechanical: 135 }, buildTimeSeconds: 14 }], removable: true, documentaryId: 'tech_dynamo' },
  { id: 'hydro', name: 'Hydroélectricité', era: 'electricite_petrole', kind: 'producer', description: 'Production électrique robuste et presque sans pollution directe.', asset: 'assets/technologies/hydro.svg', tags: ['electricity', 'water', 'low-carbon'], productionPerSecond: { electricity: 13 }, storageBonus: { electricity: 180, mechanical: 80 }, purchaseOptions: [{ id: 'valley_work', label: 'Travaux de vallée', cost: { heat: 290, mechanical: 170 }, buildTimeSeconds: 78, pollutionDebt: 1.5 }, { id: 'industrial_civil_work', label: 'Génie civil accéléré', cost: { heat: 430, mechanical: 260 }, buildTimeSeconds: 38, pollutionDebt: 2 }], removable: true, documentaryId: 'tech_hydro' },
  { id: 'coal_power_plant', name: 'Centrale charbon', era: 'electricite_petrole', kind: 'producer', description: 'Très forte électricité rapide. Le raccourci fossile classique.', asset: 'assets/technologies/coal_power_plant.svg', tags: ['electricity', 'coal', 'fossil'], productionPerSecond: { electricity: 24 }, consumptionPerSecond: { heat: 7 }, storageBonus: { electricity: 160 }, hiddenPollutionDebtPerSecond: 0.14, pollutionPerSecond: 0.14, purchaseOptions: [{ id: 'thermal_route', label: 'Filière thermique lente', cost: { heat: 410, mechanical: 210 }, buildTimeSeconds: 54, pollutionDebt: 13 }, { id: 'turbine_contract', label: 'Turbines sous contrat', cost: { heat: 620, mechanical: 330, electricity: 60 }, buildTimeSeconds: 26, pollutionDebt: 10 }], removable: true, documentaryId: 'tech_coal_power' },
  { id: 'early_fuels', name: 'Premiers carburants', era: 'electricite_petrole', kind: 'producer', description: 'Stockage confortable et forte inertie. C’est pratique, donc dangereux.', asset: 'assets/technologies/early_fuels.svg', tags: ['fuel', 'fossil'], productionPerSecond: { fuel: 11 }, storageBonus: { fuel: 360 }, hiddenPollutionDebtPerSecond: 0.055, pollutionPerSecond: 0.055, purchaseOptions: [{ id: 'oil_depot', label: 'Dépôt pétrolier', cost: { heat: 200, mechanical: 120 }, buildTimeSeconds: 22, pollutionDebt: 4 }, { id: 'tank_farm', label: 'Parc de cuves', cost: { heat: 290, mechanical: 190 }, buildTimeSeconds: 11, pollutionDebt: 5 }], removable: true, documentaryId: 'tech_fuels' },
  { id: 'electric_grid', name: 'Petit réseau électrique', era: 'electricite_petrole', kind: 'storage', description: 'Augmente la capacité électrique et amortit les premiers déficits.', asset: 'assets/technologies/electric_grid.svg', tags: ['electricity', 'storage', 'grid'], storageBonus: { electricity: 320, mechanical: 60 }, purchaseOptions: [{ id: 'copper_lines', label: 'Lignes locales', cost: { heat: 220, mechanical: 150, electricity: 40 }, buildTimeSeconds: 36 }, { id: 'standardized_grid', label: 'Réseau standardisé', cost: { heat: 300, mechanical: 210, electricity: 80 }, buildTimeSeconds: 18 }], documentaryId: 'tech_grid' },

  { id: 'refinery', name: 'Raffinerie', era: 'trente_glorieuses', kind: 'producer', description: 'Fournit beaucoup de carburants et de stockage, mais alimente la crise pollution.', asset: 'assets/technologies/refinery.svg', tags: ['fuel', 'fossil', 'industry'], productionPerSecond: { fuel: 30 }, storageBonus: { fuel: 700, mechanical: 120 }, pollutionPerSecond: 0.12, purchaseOptions: [{ id: 'fuel_route', label: 'Filière pétrole longue', cost: { fuel: 180, heat: 360, mechanical: 210 }, buildTimeSeconds: 74, pollutionDebt: 9 }, { id: 'electrified_route', label: 'Filière partiellement électrifiée', cost: { fuel: 300, heat: 520, mechanical: 330, electricity: 95 }, buildTimeSeconds: 34, pollutionDebt: 5 }], removable: true, documentaryId: 'tech_refinery' },
  { id: 'gas_power_plant', name: 'Centrale gaz', era: 'trente_glorieuses', kind: 'producer', description: 'Électricité flexible, utile pour survivre, mais encore fossile.', asset: 'assets/technologies/gas_power_plant.svg', tags: ['electricity', 'fuel', 'fossil'], productionPerSecond: { electricity: 38 }, consumptionPerSecond: { fuel: 2.5 }, storageBonus: { electricity: 180 }, pollutionPerSecond: 0.095, purchaseOptions: [{ id: 'gas_turbine', label: 'Turbine gaz', cost: { fuel: 220, mechanical: 220, electricity: 80 }, buildTimeSeconds: 56, pollutionDebt: 6 }, { id: 'combined_cycle', label: 'Cycle combiné', cost: { fuel: 320, mechanical: 340, electricity: 140 }, buildTimeSeconds: 28, pollutionDebt: 5 }], removable: true },
  { id: 'modern_dam', name: 'Barrage moderne', era: 'trente_glorieuses', kind: 'producer', description: 'Gros socle électrique bas-carbone et capacité réseau.', asset: 'assets/technologies/modern_dam.svg', tags: ['electricity', 'water', 'low-carbon'], productionPerSecond: { electricity: 34 }, storageBonus: { electricity: 420, mechanical: 180 }, purchaseOptions: [{ id: 'civil_engineering', label: 'Génie civil lourd', cost: { heat: 650, mechanical: 360, electricity: 140 }, buildTimeSeconds: 96, pollutionDebt: 3 }, { id: 'national_program', label: 'Programme national', cost: { heat: 900, mechanical: 560, electricity: 260 }, buildTimeSeconds: 46, pollutionDebt: 3 }], removable: true, documentaryId: 'tech_hydro' },
  { id: 'nuclear_gen1', name: 'Nucléaire première génération', era: 'trente_glorieuses', kind: 'producer', description: 'Très forte électricité, peu de pollution directe, long à construire.', asset: 'assets/technologies/nuclear_gen1.svg', tags: ['electricity', 'nuclear', 'low-carbon'], productionPerSecond: { electricity: 60 }, storageBonus: { electricity: 240, mechanical: 220 }, pollutionPerSecond: 0.008, purchaseOptions: [{ id: 'thermal_route', label: 'Filière thermique longue', cost: { heat: 820, mechanical: 520, electricity: 160 }, buildTimeSeconds: 130, pollutionDebt: 5 }, { id: 'electrified_route', label: 'Filière électrifiée', cost: { heat: 1180, mechanical: 740, electricity: 320 }, buildTimeSeconds: 62, pollutionDebt: 2 }], removable: true, documentaryId: 'tech_nuclear' },
  { id: 'energy_efficiency', name: 'Efficacité énergétique', era: 'trente_glorieuses', kind: 'conversion', description: 'Réduit fortement les besoins de chaleur et de carburants, avec une légère hausse électrique de pilotage.', asset: 'assets/technologies/energy_efficiency.svg', tags: ['efficiency', 'conversion'], consumptionPerSecond: { heat: -12, fuel: -10, electricity: 2 }, pollutionDeltaPerSecond: -0.04, maxQuantity: 1, purchaseOptions: [{ id: 'renovation_program', label: 'Programme de sobriété technique', cost: { electricity: 100, mechanical: 180, heat: 220 }, buildTimeSeconds: 50 }, { id: 'industrial_standards', label: 'Normes industrielles', cost: { electricity: 180, mechanical: 320, heat: 320 }, buildTimeSeconds: 24 }], documentaryId: 'tech_efficiency' },

  { id: 'modern_nuclear', name: 'Nucléaire moderne', era: 'moderne_futur', kind: 'producer', description: 'Très puissant, lent, faible pollution directe. Le pari de stabilité électrique.', asset: 'assets/technologies/modern_nuclear.svg', tags: ['electricity', 'nuclear', 'low-carbon'], productionPerSecond: { electricity: 100 }, storageBonus: { electricity: 360, mechanical: 250 }, pollutionPerSecond: 0.004, purchaseOptions: [{ id: 'industrial_route', label: 'Filière industrielle longue', cost: { electricity: 500, mechanical: 720, heat: 760 }, buildTimeSeconds: 150, pollutionDebt: 3 }, { id: 'electrified_route', label: 'Chantier électrifié', cost: { electricity: 820, mechanical: 1020, heat: 1040 }, buildTimeSeconds: 70, pollutionDebt: 1.2 }], removable: true, documentaryId: 'tech_nuclear' },
  { id: 'solar_farm', name: 'Parc solaire', era: 'moderne_futur', kind: 'producer', description: 'Bas-carbone rapide à déployer, mais puissance unitaire modérée dans cette version.', asset: 'assets/technologies/solar_farm.svg', tags: ['electricity', 'renewable', 'low-carbon'], productionPerSecond: { electricity: 30 }, storageBonus: { mechanical: 180 }, purchaseOptions: [{ id: 'standard_panels', label: 'Panneaux standard', cost: { electricity: 150, mechanical: 220 }, buildTimeSeconds: 58, pollutionDebt: 1 }, { id: 'high_yield_panels', label: 'Haut rendement', cost: { electricity: 280, mechanical: 390 }, buildTimeSeconds: 24, pollutionDebt: 0.6 }], removable: true, documentaryId: 'tech_solar' },
  { id: 'wind_farm', name: 'Parc éolien', era: 'moderne_futur', kind: 'producer', description: 'Production électrique renouvelable, très utile couplée au stockage.', asset: 'assets/technologies/wind_farm.svg', tags: ['electricity', 'renewable', 'wind', 'low-carbon'], productionPerSecond: { electricity: 33 }, storageBonus: { mechanical: 220 }, purchaseOptions: [{ id: 'wind_corridor', label: 'Couloir de vent', cost: { electricity: 170, mechanical: 250 }, buildTimeSeconds: 64, pollutionDebt: 1 }, { id: 'offshore_contracts', label: 'Contrats industriels', cost: { electricity: 310, mechanical: 440 }, buildTimeSeconds: 28, pollutionDebt: 1.2 }], removable: true, documentaryId: 'tech_wind' },
  { id: 'batteries', name: 'Batteries avancées', era: 'moderne_futur', kind: 'storage', description: 'Gros buffer électrique pour encaisser les jalons modernes.', asset: 'assets/technologies/batteries.svg', tags: ['electricity', 'storage'], storageBonus: { electricity: 840, mechanical: 160 }, purchaseOptions: [{ id: 'battery_line', label: 'Ligne batteries', cost: { electricity: 220, mechanical: 240 }, buildTimeSeconds: 54, pollutionDebt: 1.4 }, { id: 'gigafactory_slot', label: 'Créneau gigafactory', cost: { electricity: 380, mechanical: 430 }, buildTimeSeconds: 24, pollutionDebt: 1.6 }], documentaryId: 'tech_batteries' },
  { id: 'pumped_hydro', name: 'STEP', era: 'moderne_futur', kind: 'storage', description: 'Stockage massif et très robuste. Cher, mais game saver.', asset: 'assets/technologies/pumped_hydro.svg', tags: ['electricity', 'storage', 'water', 'low-carbon'], storageBonus: { electricity: 1250, mechanical: 300 }, productionPerSecond: { electricity: 12 }, purchaseOptions: [{ id: 'mountain_reservoir', label: 'Réservoirs en altitude', cost: { electricity: 380, mechanical: 500, heat: 420 }, buildTimeSeconds: 95, pollutionDebt: 1.5 }, { id: 'accelerated_civil_work', label: 'Génie civil accéléré', cost: { electricity: 640, mechanical: 780, heat: 680 }, buildTimeSeconds: 42, pollutionDebt: 1.8 }], removable: true, documentaryId: 'tech_pumped_hydro' },
  { id: 'heat_pumps', name: 'Pompes à chaleur', era: 'moderne_futur', kind: 'conversion', description: 'Réduit fortement chaleur et carburants, en ajoutant une demande électrique modérée.', asset: 'assets/technologies/heat_pumps.svg', tags: ['conversion', 'electricity', 'heating'], consumptionPerSecond: { fuel: -18, heat: -16, electricity: 7 }, pollutionDeltaPerSecond: -0.08, maxQuantity: 1, purchaseOptions: [{ id: 'housing_program', label: 'Rénovation + PAC', cost: { electricity: 210, mechanical: 180, heat: 120 }, buildTimeSeconds: 58 }, { id: 'mass_rollout', label: 'Déploiement massif', cost: { electricity: 340, mechanical: 320, heat: 200 }, buildTimeSeconds: 26 }], documentaryId: 'tech_heat_pumps' },
  { id: 'electric_vehicles', name: 'Véhicules électriques', era: 'moderne_futur', kind: 'conversion', description: 'Réduit massivement les carburants du transport, avec une hausse électrique contenue.', asset: 'assets/technologies/electric_vehicles.svg', tags: ['conversion', 'transport', 'electricity'], consumptionPerSecond: { fuel: -28, electricity: 11 }, pollutionDeltaPerSecond: -0.09, maxQuantity: 1, purchaseOptions: [{ id: 'charging_network', label: 'Recharge + véhicules', cost: { electricity: 290, mechanical: 260 }, buildTimeSeconds: 62 }, { id: 'battery_supply_chain', label: 'Chaîne batteries', cost: { electricity: 460, mechanical: 430, fuel: 80 }, buildTimeSeconds: 28 }], documentaryId: 'tech_electric_vehicles' },
  { id: 'experimental_fusion', name: 'Fusion expérimentale', era: 'moderne_futur', kind: 'producer', description: 'Objectif final symbolique : très chère, très longue, stabilisatrice.', asset: 'assets/technologies/experimental_fusion.svg', tags: ['electricity', 'future', 'low-carbon'], productionPerSecond: { electricity: 170 }, storageBonus: { electricity: 560, mechanical: 420 }, maxQuantity: 1, purchaseOptions: [{ id: 'prototype', label: 'Prototype expérimental', cost: { electricity: 900, mechanical: 980, heat: 780 }, buildTimeSeconds: 160, pollutionDebt: 1 }, { id: 'international_program', label: 'Programme international', cost: { electricity: 1350, mechanical: 1450, heat: 1200 }, buildTimeSeconds: 80, pollutionDebt: 1.2 }], removable: false, documentaryId: 'tech_fusion' }
];

export const UPGRADES: Upgrade[] = [
  { id: 'better_foyer', name: 'Foyer amélioré', era: 'prehistoire', description: 'Les foyers et feux futurs produisent +25 % de chaleur et durent plus longtemps.', asset: 'assets/technologies/better_foyer.svg', affectsTags: ['fire'], effect: { productionMultiplier: 1.25, lifetimeMultiplier: 1.15 }, appliesTo: 'both', purchaseOptions: [{ id: 'careful_airflow', label: 'Tirage optimisé', cost: { heat: 70 }, buildTimeSeconds: 8 }], documentaryId: 'upgrade_efficiency' },
  { id: 'optimized_blades', name: 'Pales optimisées', era: 'agriculture', description: 'Les moulins produisent +20 % de force mécanique et s’usent moins vite.', asset: 'assets/technologies/optimized_blades.svg', affectsTags: ['mill'], effect: { productionMultiplier: 1.2, lifetimeMultiplier: 1.2 }, appliesTo: 'both', purchaseOptions: [{ id: 'carpentry', label: 'Charpenterie précise', cost: { heat: 140, mechanical: 70 }, buildTimeSeconds: 14 }] },
  { id: 'high_pressure_boiler', name: 'Chaudière haute pression', era: 'industrie', description: 'La vapeur produit +30 %, mais les équipements fossiles polluent +10 %.', asset: 'assets/technologies/high_pressure_boiler.svg', affectsTags: ['steam'], effect: { productionMultiplier: 1.3, pollutionMultiplier: 1.1 }, appliesTo: 'both', purchaseOptions: [{ id: 'pressure_valves', label: 'Soupapes et pression', cost: { heat: 360, mechanical: 190 }, buildTimeSeconds: 42, pollutionDebt: 4 }, { id: 'factory_valves', label: 'Vannes industrielles', cost: { heat: 520, mechanical: 310 }, buildTimeSeconds: 20, pollutionDebt: 4 }] },
  { id: 'industrial_filters', name: 'Filtres industriels', era: 'trente_glorieuses', description: 'Les moyens fossiles polluent -35 % et tiennent mieux dans le temps.', asset: 'assets/technologies/industrial_filters.svg', affectsTags: ['fossil'], effect: { pollutionMultiplier: 0.65, lifetimeMultiplier: 1.25 }, appliesTo: 'both', purchaseOptions: [{ id: 'smoke_filters', label: 'Filtres de fumée', cost: { electricity: 150, mechanical: 220 }, buildTimeSeconds: 54 }, { id: 'industrial_scrubbers', label: 'Dépoussiéreurs lourds', cost: { electricity: 260, mechanical: 380 }, buildTimeSeconds: 24 }], documentaryId: 'tech_filters' },
  { id: 'smart_grid', name: 'Smart grid simplifié', era: 'moderne_futur', description: 'Booste le clic final et augmente les stockages électriques de 25 %.', asset: 'assets/technologies/smart_grid.svg', affectsTags: ['electricity', 'storage'], effect: { storageMultiplier: 1.25, clickMultiplier: 1.35 }, appliesTo: 'both', purchaseOptions: [{ id: 'digital_grid', label: 'Pilotage numérique', cost: { electricity: 420, mechanical: 360 }, buildTimeSeconds: 60 }, { id: 'national_dispatch', label: 'Dispatching national', cost: { electricity: 700, mechanical: 620 }, buildTimeSeconds: 28 }], documentaryId: 'tech_smart_grid' }
];

export const ALL_ITEMS = [...TECHNOLOGIES, ...UPGRADES];

function doc(id: string, title: string, body: string, gameplay = 'Anticipe la demande et lance les infrastructures longues avant le jalon.'): Documentary {
  return { id, title, body, gameplay };
}

export const DOCUMENTARIES: Record<string, Documentary> = {
  era_prehistoire: doc('era_prehistoire', 'Feu et chaleur', 'Le début du jeu réduit volontairement l’énergie à la chaleur : cuisson, chauffage et protection.', 'Surveille le stock de chaleur et construis du buffer avant les jalons.'),
  era_agriculture: doc('era_agriculture', 'Moulins et agriculture', 'L’agriculture transforme les besoins : il ne suffit plus de chauffer, il faut moudre, pomper, actionner et fabriquer.', 'La force mécanique devient critique : installe traction et moulins avant la forge.'),
  era_industrie: doc('era_industrie', 'Industrialisation', 'Le charbon et la vapeur apportent une grosse montée en puissance, avec une dette de pollution en arrière-plan.', 'Les petites mines répondent vite, mais les machines à vapeur et hauts fourneaux doivent être lancés tôt.'),
  era_electricite_petrole: doc('era_electricite_petrole', 'Électricité et pétrole', 'L’électricité et les carburants deviennent centraux dans les usages modernes.', 'Amorce l’électricité avec la dynamo, puis sécurise réseau et grosses sources.'),
  era_trente_glorieuses: doc('era_trente_glorieuses', 'Pollution révélée', 'La demande explose et la pollution accumulée devient visible.', 'Démantèle les moyens les plus sales, achète filtres et prépare des conversions.'),
  era_moderne_futur: doc('era_moderne_futur', 'Décarboner électrifie', 'Réduire les carburants et la pollution augmente fortement la consommation électrique.', 'Avant les conversions finales, produis et stocke massivement l’électricité.'),
  milestone_cooking: doc('milestone_cooking', 'Cuisson régulière', 'La cuisson rend la chaleur quotidienne.', 'Un foyer ou une réserve de bois suffit généralement à absorber le choc.'),
  milestone_heated_habitat: doc('milestone_heated_habitat', 'Habitat chauffé', 'Le chauffage transforme un usage ponctuel en demande permanente.', 'Ajoute de la production et pas seulement du stockage.'),
  milestone_bread: doc('milestone_bread', 'Production régulière de pain', 'Le pain combine chaleur de cuisson et mécanique de mouture.', 'Les moulins sont la réponse la plus saine.'),
  milestone_tools: doc('milestone_tools', 'Outils agricoles', 'La fabrication d’outils ajoute des besoins d’atelier : chaleur de forge et force mécanique.', 'La forge aide, mais elle consomme de la mécanique.'),
  milestone_textile: doc('milestone_textile', 'Textile mécanisé', 'L’industrialisation fait exploser les besoins mécaniques continus.', 'Prépare chaudière ou machine à vapeur avant le jalon.'),
  milestone_rail: doc('milestone_rail', 'Transport ferroviaire de marchandises', 'Le rail augmente fortement chaleur et mécanique.', 'Anticipe les temps de construction.'),
  milestone_lighting: doc('milestone_lighting', 'Éclairage urbain', 'L’éclairage est un premier usage électrique très visible.', 'Une dynamo seule est insuffisante : hydro ou réseau deviennent utiles.'),
  milestone_motorized_transport: doc('milestone_motorized_transport', 'Transports motorisés', 'Les carburants se stockent facilement, ce qui rend leur croissance très tentante.', 'Construis du stockage carburant, mais garde une voie électrique en tête.'),
  milestone_mass_car: doc('milestone_mass_car', 'Voiture individuelle de masse', 'La voiture installe une demande pétrolière massive.', 'Les raffineries aident à court terme, les conversions sauveront la suite.'),
  milestone_appliances: doc('milestone_appliances', 'Électroménager domestique', 'L’équipement des foyers fait de l’électricité une énergie de confort quotidien.', 'Avant ce jalon, le réseau et au moins une grosse source électrique sont recommandés.'),
  milestone_modern_heating: doc('milestone_modern_heating', 'Chauffage moderne', 'Le chauffage moderne repose sur plusieurs vecteurs : chaleur, carburants et électricité.', 'Les pompes à chaleur réduiront la pollution plus tard, mais chargeront l’électricité.'),
  milestone_data_centers: doc('milestone_data_centers', 'Numérisation et data centers', 'La numérisation est représentée comme une demande électrique supplémentaire.', 'Stockage électrique fortement recommandé.'),
  milestone_transport_electrification: doc('milestone_transport_electrification', 'Électrification des transports', 'L’électrification réduit les carburants mais demande davantage d’électricité.', 'Ne convertis pas trop vite si ton solde électrique est fragile.'),
  milestone_low_carbon_industry: doc('milestone_low_carbon_industry', 'Industrie bas-carbone', 'L’industrie bas-carbone est volontairement représentée comme très électrique.', 'Combine nucléaire, renouvelables et stockage.'),
  tech_campfire: doc('tech_campfire', 'Premier feu entretenu', 'Un feu entretenu transforme un clic ponctuel en production automatique.'),
  tech_foyer: doc('tech_foyer', 'Foyer domestique', 'Le foyer canalise la chaleur et stabilise les usages.'),
  tech_storage: doc('tech_storage', 'Stocker n’est pas produire', 'Une capacité plus grande retarde les crises, mais ne corrige pas un solde négatif.'),
  tech_animal_traction: doc('tech_animal_traction', 'Traction organisée', 'La force animale représente une mécanique régulière avant les machines.'),
  tech_mill: doc('tech_mill', 'Moulins', 'Les moulins convertissent eau ou vent en travail mécanique.'),
  tech_forge: doc('tech_forge', 'Forge', 'La forge met en scène la chaleur productive, pas seulement domestique.'),
  tech_coal: doc('tech_coal', 'Charbon', 'Le charbon fournit une énergie dense et facile à mobiliser pour l’industrie.'),
  tech_steam: doc('tech_steam', 'Machine à vapeur', 'La vapeur permet de convertir la chaleur en mouvement mécanique massif.'),
  tech_dynamo: doc('tech_dynamo', 'Dynamo', 'La dynamo rend visible la conversion de mécanique en électricité.'),
  tech_hydro: doc('tech_hydro', 'Hydroélectricité', 'L’hydroélectricité joue le rôle de pilier bas-carbone historique.'),
  tech_coal_power: doc('tech_coal_power', 'Centrale charbon', 'La centrale charbon est un bouton panique : beaucoup d’électricité, vite, avec une pollution forte.'),
  tech_fuels: doc('tech_fuels', 'Carburants', 'Les carburants sont très stockables.'),
  tech_grid: doc('tech_grid', 'Réseau électrique simplifié', 'Le réseau augmente la capacité électrique et amortit les déficits.'),
  tech_refinery: doc('tech_refinery', 'Raffinerie', 'La raffinerie matérialise le confort du pétrole dans les Trente Glorieuses.'),
  tech_nuclear: doc('tech_nuclear', 'Nucléaire français', 'Le nucléaire fournit beaucoup d’électricité pilotable avec peu de pollution directe.'),
  tech_efficiency: doc('tech_efficiency', 'Efficacité énergétique', 'Réduire les besoins peut sauver une partie.'),
  tech_filters: doc('tech_filters', 'Filtres industriels', 'Les filtres ne rendent pas le fossile neutre, mais corrigent une trajectoire trop sale.'),
  tech_solar: doc('tech_solar', 'Solaire', 'Le solaire complète le mix bas-carbone.'),
  tech_wind: doc('tech_wind', 'Éolien', 'L’éolien apporte une production renouvelable utile avec du stockage.'),
  tech_batteries: doc('tech_batteries', 'Batteries', 'Le stockage électrique devient essentiel quand la consommation est très électrifiée.'),
  tech_pumped_hydro: doc('tech_pumped_hydro', 'STEP', 'La STEP est un stockage électrique massif avec un effet stabilisateur.'),
  tech_heat_pumps: doc('tech_heat_pumps', 'Pompes à chaleur', 'Les pompes à chaleur déplacent une part du chauffage vers l’électricité.'),
  tech_electric_vehicles: doc('tech_electric_vehicles', 'Véhicules électriques', 'Les véhicules électriques convertissent carburants en demande électrique.'),
  tech_smart_grid: doc('tech_smart_grid', 'Smart grid simplifié', 'Le smart grid représente un pilotage plus fin de la demande et du stockage.'),
  tech_fusion: doc('tech_fusion', 'Prototype de fusion', 'La fusion expérimentale est un symbole de stabilisation, pas une solution magique.'),
  upgrade_efficiency: doc('upgrade_efficiency', 'Amélioration de rendement', 'Les améliorations rendent l’anticipation rentable.')
};
