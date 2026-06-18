import type { Documentary } from '../types';

export const DOCUMENTARY_DRAFTS: Record<string, Documentary> = {
  era_prehistoire: {
    id: 'era_prehistoire',
    title: 'Le feu, première infrastructure',
    body: 'Le jeu démarre avec la chaleur parce que le feu est le premier grand “réseau” énergétique humain : il éclaire, protège, chauffe et rend la cuisson régulière possible. Les dates exactes restent discutées, mais l’usage contrôlé du feu s’inscrit sur des centaines de milliers d’années, bien avant les systèmes agricoles ou industriels. Ici, la Préhistoire est donc volontairement simple : une seule jauge, mais déjà une contrainte de stock.',
    gameplay: 'Construis production et stockage de chaleur avant de chercher le rendement : le feu donne du temps, pas une garantie infinie.',
    sourceLabel: 'Smithsonian — Human Origins: control of fire',
    sourceUrl: 'https://humanorigins.si.edu/evidence/behavior/control-fire'
  },
  era_agriculture: {
    id: 'era_agriculture',
    title: 'Du muscle au moulin',
    body: 'Avec l’agriculture, l’énergie ne sert plus seulement à survivre : elle organise le travail. La traction animale, les moulins à eau ou à vent et les ateliers déplacent une partie de l’effort humain vers des forces mécaniques régulières. Le pain résume cette bascule : cultiver, moudre, cuire, transporter. Dans le jeu, l’arrivée de la force mécanique traduit cette complexification.',
    gameplay: 'La mécanique devient la jauge de l’organisation : les moulins stabilisent mieux la partie que la seule forge.',
    sourceLabel: 'Encyclopaedia Britannica — Waterwheel',
    sourceUrl: 'https://www.britannica.com/technology/waterwheel-engineering'
  },
  era_industrie: {
    id: 'era_industrie',
    title: 'Charbon, vapeur, accélération',
    body: 'La révolution industrielle fait passer une économie largement agraire vers la production manufacturée à grande échelle. Les perfectionnements de la machine à vapeur, la mécanisation et la métallurgie rendent possible un saut de puissance, mais au prix d’une dépendance massive au charbon. Le jeu transforme cela en tentation : beaucoup de chaleur et de mécanique, mais une dette de pollution qui s’accumule.',
    gameplay: 'Le fossile est excellent pour passer une crise immédiate. Le vrai piège, c’est de le laisser devenir ton socle permanent.',
    sourceLabel: 'Ministère de l’Économie — La révolution industrielle',
    sourceUrl: 'https://www.economie.gouv.fr/facileco/culture-economique/120-000-ans-dhistoire/la-revolution-industrielle'
  },
  era_electricite_petrole: {
    id: 'era_electricite_petrole',
    title: 'La ville s’allume, le pétrole circule',
    body: 'La fin du XIXe siècle et le début du XXe n’ajoutent pas seulement une nouvelle énergie : ils changent les usages. L’électricité rend visibles l’éclairage, les moteurs et le réseau ; les carburants liquides apportent une énergie dense, stockable et mobile. Les deux arrivent ensemble dans le jeu pour montrer que la modernité énergétique n’est pas une ligne droite : elle combine réseau électrique et mobilité fossile.',
    gameplay: 'L’électricité est tendue mais propre en usage direct ; les carburants sont confortables parce qu’ils se stockent bien, donc faciles à surconsommer.',
    sourceLabel: 'Encyclopaedia Britannica — Electric light',
    sourceUrl: 'https://www.britannica.com/technology/electric-light'
  },
  era_trente_glorieuses: {
    id: 'era_trente_glorieuses',
    title: 'Abondance, confort, pollution visible',
    body: 'Après 1945, la France entre dans une période de forte croissance, d’équipement des foyers, d’automobilisation et de grands choix d’infrastructure. Le jeu condense cette phase en trois pressions : carburants pour la voiture, électricité pour le confort domestique, chaleur pour les bâtiments. C’est aussi le moment où la pollution cesse d’être un simple arrière-plan et devient une contrainte de système.',
    gameplay: 'Tu peux encore gagner avec des fossiles, mais tu dois commencer à corriger : filtres, efficacité, démantèlements et premières bases bas-carbone.',
    sourceLabel: 'Ministère de l’Économie — Les Trente Glorieuses',
    sourceUrl: 'https://www.economie.gouv.fr/facileco/culture-economique/120-000-ans-dhistoire/les-trente-glorieuses'
  },
  era_moderne_futur: {
    id: 'era_moderne_futur',
    title: 'Décarboner, c’est électrifier',
    body: 'La période moderne ne raconte pas la fin de la contrainte énergétique : elle la déplace. Réduire les carburants dans les transports, chauffer autrement, numériser les usages et produire une industrie bas-carbone augmentent la demande électrique. Les scénarios français de neutralité carbone insistent justement sur l’électrification, les flexibilités et le mix de production. Le futur proche du jeu est donc un problème d’équilibre, pas un bouton magique.',
    gameplay: 'Avant de convertir transports, chaleur et industrie, construis un socle électrique pilotable et du stockage.',
    sourceLabel: 'RTE — Futurs énergétiques 2050',
    sourceUrl: 'https://www.rte-france.com/analyses-tendances-et-prospectives/bilan-previsionnel-2050-futurs-energetiques'
  },
  milestone_cooking: {
    id: 'milestone_cooking',
    title: 'Cuisson régulière',
    body: 'La cuisson transforme le feu en usage quotidien. Elle rend certains aliments plus digestes, réduit des risques sanitaires et crée un point fixe autour duquel s’organisent les groupes. Dans le jeu, ce jalon augmente la demande de chaleur parce qu’un feu utile n’est plus un événement : c’est une habitude.',
    gameplay: 'Un foyer automatique suffit souvent, mais sans production continue le stock va fondre très vite.',
    sourceLabel: 'Nature Ecology & Evolution — Earliest evidence for cooking fish',
    sourceUrl: 'https://www.nature.com/articles/s41559-022-01910-z'
  },
  milestone_heated_habitat: {
    id: 'milestone_heated_habitat',
    title: 'Habitat chauffé',
    body: 'Chauffer l’habitat, c’est passer d’une chaleur de survie à une chaleur de confort et de protection. Le feu permet d’occuper des environnements plus froids, de prolonger les activités après la nuit et de sécuriser l’espace domestique. Cette logique de demande permanente reviendra plus tard avec le chauffage moderne.',
    gameplay: 'Le stockage retarde la crise, mais seul un solde de chaleur positif permet de tenir.',
    sourceLabel: 'Smithsonian — Human Origins: control of fire',
    sourceUrl: 'https://humanorigins.si.edu/evidence/behavior/control-fire'
  },
  milestone_bread: {
    id: 'milestone_bread',
    title: 'Pain : moudre et cuire',
    body: 'Le pain est un excellent marqueur énergétique : il faut produire des céréales, les moudre en farine, puis cuire. Les moulins hydrauliques ou éoliens réduisent l’effort humain et animal en transformant une force naturelle en travail mécanique. Le jalon mélange donc chaleur et mécanique, exactement comme une chaîne productive préindustrielle.',
    gameplay: 'Les moulins sont la réponse saine : ils produisent de la mécanique sans charger la pollution.',
    sourceLabel: 'Encyclopaedia Britannica — Waterwheel',
    sourceUrl: 'https://www.britannica.com/technology/waterwheel-engineering'
  },
  milestone_tools: {
    id: 'milestone_tools',
    title: 'Outils agricoles et forge',
    body: 'Des outils plus nombreux et plus résistants améliorent les rendements agricoles, mais demandent des ateliers, du combustible et du travail mécanique. La forge représente cette chaleur productive : elle ne sert plus seulement à cuire ou chauffer, elle transforme la matière. C’est le premier pas vers une énergie d’atelier.',
    gameplay: 'La forge débloque de la puissance, mais elle annonce déjà le compromis rendement/pollution.',
    sourceLabel: 'Encyclopaedia Britannica — Iron processing',
    sourceUrl: 'https://www.britannica.com/technology/iron-processing'
  },
  milestone_textile: {
    id: 'milestone_textile',
    title: 'Textile mécanisé',
    body: 'Le textile est l’un des moteurs de l’industrialisation : mécaniser le filage et le tissage multiplie la production et concentre le travail dans des ateliers puis des usines. Dans le récit du jeu, ce jalon fait exploser la demande mécanique parce que la machine ne remplace pas l’énergie : elle la rend continue.',
    gameplay: 'Prépare chaudière et machine à vapeur avant le jalon ; sinon la mécanique passe négative en chaîne.',
    sourceLabel: 'Ministère de l’Économie — La révolution industrielle',
    sourceUrl: 'https://www.economie.gouv.fr/facileco/culture-economique/120-000-ans-dhistoire/la-revolution-industrielle'
  },
  milestone_rail: {
    id: 'milestone_rail',
    title: 'Rail et marchandises',
    body: 'En France, les premières lignes ferroviaires naissent dans des régions minières : Saint-Étienne–Andrézieux est inaugurée en 1828 pour transporter le charbon vers les voies d’eau. Le rail accélère les flux, agrandit les marchés et rend le charbon encore plus central. Le jeu augmente donc chaleur et mécanique en même temps.',
    gameplay: 'Le rail est un gros choc : anticipe les temps de construction, pas seulement le coût.',
    sourceLabel: 'Histoire par l’image — Les premiers chemins de fer',
    sourceUrl: 'https://histoire-image.org/etudes/premiers-chemins-fer'
  },
  milestone_lighting: {
    id: 'milestone_lighting',
    title: 'Éclairage urbain',
    body: 'L’éclairage urbain rend l’électricité immédiatement visible : rues, gares, vitrines, lieux publics. Historiquement, il prolonge la vie nocturne et transforme la perception de la ville, même si le gaz et l’électricité coexistent longtemps. Dans le jeu, c’est le premier usage électrique socialement massif.',
    gameplay: 'Une dynamo amorce le système, mais hydroélectricité et réseau évitent la panne.',
    sourceLabel: 'Encyclopaedia Britannica — Electric light',
    sourceUrl: 'https://www.britannica.com/technology/electric-light'
  },
  milestone_motorized_transport: {
    id: 'milestone_motorized_transport',
    title: 'Transports motorisés',
    body: 'Le moteur à combustion rend l’énergie mobile : les carburants concentrent beaucoup d’énergie dans un volume facile à transporter. C’est une force historique énorme pour les transports, mais aussi le début d’une dépendance durable aux produits pétroliers. Le jeu le traduit par une jauge carburants confortable, puis risquée.',
    gameplay: 'Stocke des carburants pour survivre, mais prépare déjà une alternative électrique.',
    sourceLabel: 'Encyclopaedia Britannica — Internal-combustion engine',
    sourceUrl: 'https://www.britannica.com/technology/internal-combustion-engine'
  },
  milestone_mass_car: {
    id: 'milestone_mass_car',
    title: 'Voiture individuelle de masse',
    body: 'La voiture individuelle devient un symbole de liberté et de croissance, mais elle installe aussi une demande pétrolière massive. En France, le transport est l’activité qui contribue le plus aux émissions de gaz à effet de serre, et l’essentiel de ces émissions vient de la combustion de carburants. Le jalon est donc volontairement brutal côté carburants et pollution.',
    gameplay: 'Les raffineries aident à court terme ; les conversions transports deviennent indispensables ensuite.',
    sourceLabel: 'Ministère de la Transition écologique — véhicules électriques',
    sourceUrl: 'https://www.ecologie.gouv.fr/politiques-publiques/developper-vehicules-electriques'
  },
  milestone_appliances: {
    id: 'milestone_appliances',
    title: 'Électroménager domestique',
    body: 'Réfrigérateur, lave-linge, cuisson électrique ou petits appareils transforment l’électricité en confort quotidien. Le foyer moderne dépend d’un réseau disponible en permanence : l’énergie devient moins visible, mais plus indispensable. Dans le jeu, cette invisibilité est représentée par une forte demande électrique de fond.',
    gameplay: 'Avant ce jalon, sécurise au moins une grosse source électrique et de la capacité réseau.',
    sourceLabel: 'ADEME — Électricité spécifique',
    sourceUrl: 'https://agirpourlatransition.ademe.fr/particuliers/maison/economies-denergie/electricite-specifique'
  },
  milestone_modern_heating: {
    id: 'milestone_modern_heating',
    title: 'Chauffage moderne',
    body: 'Le chauffage des logements peut reposer sur plusieurs vecteurs : combustibles, réseaux de chaleur, électricité directe ou pompes à chaleur. Cette diversité est utile, mais elle rend la transition plus complexe : sortir des combustibles fossiles peut déplacer une partie de l’effort vers l’électricité et la rénovation. Le jeu simplifie ce dilemme en gardant trois tensions : chaleur, carburants, électricité.',
    gameplay: 'Les pompes à chaleur seront puissantes plus tard, mais seulement si le réseau électrique tient déjà.',
    sourceLabel: 'IEA — The Future of Heat Pumps',
    sourceUrl: 'https://www.iea.org/reports/the-future-of-heat-pumps'
  },
  milestone_data_centers: {
    id: 'milestone_data_centers',
    title: 'Numérisation et data centers',
    body: 'La numérisation ne supprime pas la matérialité de l’énergie : serveurs, refroidissement et réseaux demandent de l’électricité. L’IEA rappelle qu’il n’y a pas d’IA sans électricité pour les data centers et publie des projections dédiées à cette demande. Le jeu place donc les data centers comme un choc électrique moderne, pas comme un simple bonus abstrait.',
    gameplay: 'Stockage électrique vivement conseillé : ce jalon punit les mix trop justes.',
    sourceLabel: 'IEA — Energy and AI',
    sourceUrl: 'https://www.iea.org/reports/energy-and-ai'
  },
  milestone_transport_electrification: {
    id: 'milestone_transport_electrification',
    title: 'Électrification des transports',
    body: 'Électrifier les transports réduit la combustion de carburants à l’usage, mais transfère une partie de la demande vers le système électrique. La stratégie française combine décarbonation de l’énergie, efficacité, maîtrise de la demande et report modal : le jeu garde surtout la tension la plus lisible, moins de carburants contre plus d’électricité.',
    gameplay: 'N’enchaîne pas les conversions si ton solde électrique est fragile : commence par produire et stocker.',
    sourceLabel: 'Ministère de la Transition écologique — véhicules électriques',
    sourceUrl: 'https://www.ecologie.gouv.fr/politiques-publiques/developper-vehicules-electriques'
  },
  milestone_low_carbon_industry: {
    id: 'milestone_low_carbon_industry',
    title: 'Industrie bas-carbone',
    body: 'Décarboner l’industrie demande efficacité, chaleur bas-carbone, électrification de procédés, hydrogène bas-carbone ou capture de carbone selon les secteurs. Ce n’est pas une baisse simple de la consommation : certains procédés fossiles sont remplacés par de l’électricité ou par des molécules produites avec de l’électricité. Le jeu en fait le “boss final” de tension électrique.',
    gameplay: 'Combine nucléaire, renouvelables, STEP/batteries et efficacité : aucune brique ne suffit seule.',
    sourceLabel: 'IEA — Industry',
    sourceUrl: 'https://www.iea.org/energy-system/industry'
  }
};
