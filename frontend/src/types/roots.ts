export type RootMethod = 'newton' | 'fixed-point';

export interface SolverConfig {
  method: RootMethod;
  expression: string;
  x0: number;
  tolerance: number;
  maxIterations: number;
}