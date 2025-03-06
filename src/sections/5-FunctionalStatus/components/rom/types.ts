export interface ROMData {
  cervical: JointRegion;
  thoracolumbar: JointRegion;
  upperExtremity: JointRegion;
  lowerExtremity: JointRegion;
  generalNotes: string;
}

export interface JointRegion {
  [movement: string]: MovementData;
  notes: string;
}

export interface MovementData {
  range: string;
  painLimited?: boolean;
  weakness?: boolean;
}

export type JointRegionKey = 'cervical' | 'thoracolumbar' | 'upperExtremity' | 'lowerExtremity';