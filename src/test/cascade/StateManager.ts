export interface StateManager {
  save: (step: string, data: any) => Promise<void>;
  load: (step: string) => Promise<any>;
  validate: (step: string) => Promise<boolean>;
  clear: () => Promise<void>;
}

export class SymptomsStateManager implements StateManager {
  private state: Record<string, any> = {};

  async save(step: string, data: any): Promise<void> {
    this.state[step] = data;
  }

  async load(step: string): Promise<any> {
    return this.state[step];
  }

  async validate(step: string): Promise<boolean> {
    const state = await this.load(step);
    return this.validateStepState(step, state);
  }

  async clear(): Promise<void> {
    this.state = {};
  }

  private validateStepState(step: string, state: any): boolean {
    if (!state) return false;

    const validators: Record<string, (s: any) => boolean> = {
      cognitive: (s: any) => 
        Array.isArray(s.selectedSymptoms) && 
        s.selectedSymptoms.length > 0,
      
      physical: (s: any) => 
        Array.isArray(s.locations) && 
        s.locations.length > 0,
      
      emotional: (s: any) => 
        typeof s.intensity === 'number' && 
        s.intensity >= 0 && 
        s.intensity <= 10
    };

    return validators[step]?.(state) ?? false;
  }
}
