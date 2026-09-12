import type { RegressionDataPoint } from '../services/api';

export type RegressionModelType = 
  | 'linear' 
  | 'polynomial' 
  | 'exponential' 
  | 'power' 
  | 'saturation' 
  | 'newton_cooling';

export interface RegressionSolverConfig {
  modelType: RegressionModelType;
  degree?: number;
  tAmb?: number;
  points: RegressionDataPoint[];
  title?: string;
  source?: string;
}
