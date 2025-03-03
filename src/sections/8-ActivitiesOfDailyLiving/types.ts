export interface ADLItemData {
  independence: string;
  notes: string;
}

export type ADLCategoryData = {
  [key: string]: ADLItemData;
}

export interface ADLData {
  basic: {
    bathing: ADLCategoryData;
    dressing: ADLCategoryData;
    feeding: ADLCategoryData;
    transfers: ADLCategoryData;
  };
  iadl: {
    household: ADLCategoryData;
    community: ADLCategoryData;
  };
  health: {
    management: ADLCategoryData;
    routine: ADLCategoryData;
  };
  work: {
    status: ADLCategoryData;
  };
  leisure: {
    sports: ADLCategoryData;
    social: ADLCategoryData;
    travel: ADLCategoryData;
    community: ADLCategoryData;
  };
}