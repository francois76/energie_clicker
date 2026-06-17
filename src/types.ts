export type Energy = 'heat' | 'mechanical' | 'fuel' | 'electricity';

export type EraId =
  | 'prehistoire'
  | 'agriculture'
  | 'industrie'
  | 'electricite_petrole'
  | 'trente_glorieuses'
  | 'moderne_futur';

export type ItemKind = 'producer' | 'storage' | 'upgrade' | 'conversion' | 'retrofit';

export type PurchaseOption = {
  id: string;
  label: string;
  cost: Partial<Record<Energy, number>>;
  buildTimeSeconds: number;
  pollutionDebt?: number;
  pollutionInstant?: number;
  requirements?: string[];
  note?: string;
};

export type Technology = {
  id: string;
  name: string;
  era: EraId;
  kind: ItemKind;
  description: string;
  asset: string;
  purchaseOptions: PurchaseOption[];
  productionPerSecond?: Partial<Record<Energy, number>>;
  consumptionPerSecond?: Partial<Record<Energy, number>>;
  storageBonus?: Partial<Record<Energy, number>>;
  pollutionPerSecond?: number;
  hiddenPollutionDebtPerSecond?: number;
  pollutionDeltaPerSecond?: number;
  removable?: boolean;
  maxQuantity?: number;
  tags?: string[];
  documentaryId?: string;
};

export type Upgrade = {
  id: string;
  name: string;
  era: EraId;
  description: string;
  asset: string;
  purchaseOptions: PurchaseOption[];
  affectsTags?: string[];
  affectsTechnologyIds?: string[];
  effect: {
    productionMultiplier?: number;
    pollutionMultiplier?: number;
    buildTimeMultiplier?: number;
    costMultiplier?: number;
    storageMultiplier?: number;
    clickMultiplier?: number;
  };
  appliesTo: 'future' | 'existing' | 'both';
  unlocksRetrofitId?: string;
  documentaryId?: string;
};

export type Milestone = {
  id: string;
  name: string;
  era: EraId;
  consumptionDelta: Partial<Record<Energy, number>>;
  productionDelta?: Partial<Record<Energy, number>>;
  storageDelta?: Partial<Record<Energy, number>>;
  hiddenPollutionDebtDelta?: number;
  pollutionDeltaPerSecond?: number;
  documentaryId: string;
};

export type Era = {
  id: EraId;
  name: string;
  shortName: string;
  description: string;
  asset: string;
  buttonAsset: string;
  unlockedEnergies: Energy[];
  clickAction: {
    label: string;
    gain: Partial<Record<Energy, number>>;
  };
  constructionSlots: number;
  technologiesUnlocked: string[];
  milestones: string[];
  transitionAnnouncementSeconds: number;
  nextEraId?: EraId;
  documentaryId: string;
};

export type Documentary = {
  id: string;
  title: string;
  body: string;
  gameplay: string;
  sourceLabel?: string;
  sourceUrl?: string;
};

export type EnergyState = {
  stock: number;
  capacity: number;
  productionPerSecond: number;
  consumptionPerSecond: number;
  crisisCountdown: number | null;
  unlocked: boolean;
};

export type Construction = {
  id: string;
  technologyId: string;
  optionId: string;
  quantity: number;
  remainingSeconds: number;
  totalSeconds: number;
  startedAt: number;
};

export type GamePhase = 'milestone' | 'transition' | 'finalHold' | 'final' | 'gameOver';

export type GameMode = 'normal' | 'demo';
