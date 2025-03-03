interface CascadeConfig {
  steps: string[];
  required: string[];
  dependencies: Record<string, string[]>;
}

export class CascadeTestRunner {
  private steps: string[];
  private required: string[];
  private dependencies: Record<string, string[]>;
  private state: Record<string, any>;

  constructor(config: CascadeConfig) {
    this.steps = config.steps;
    this.required = config.required;
    this.dependencies = config.dependencies;
    this.state = {};
  }

  async runStep(step: string, options: { simulateError?: boolean } = {}) {
    // Check dependencies
    const deps = this.dependencies[step] || [];
    for (const dep of deps) {
      if (!this.state[dep]) {
        throw new Error(`Dependency ${dep} not met for step ${step}`);
      }
    }

    try {
      // Simulate step execution
      if (options.simulateError) {
        throw new Error(`Step ${step} failed`);
      }

      this.state[step] = true;
      return true;
    } catch (error) {
      if (this.required.includes(step)) {
        throw error;
      }
      return false;
    }
  }

  getStepState(step: string) {
    return this.state[step];
  }

  isComplete() {
    return this.required.every(step => this.state[step]);
  }

  reset() {
    this.state = {};
  }

  async runWorkflow(options: { stopOnError?: boolean } = {}) {
    const completedSteps: string[] = [];
    
    for (const step of this.steps) {
      try {
        const success = await this.runStep(step);
        if (success) {
          completedSteps.push(step);
        } else if (options.stopOnError) {
          break;
        }
      } catch (error) {
        if (options.stopOnError || this.required.includes(step)) {
          throw error;
        }
      }
    }

    return {
      completedSteps,
      isComplete: this.isComplete()
    };
  }
}