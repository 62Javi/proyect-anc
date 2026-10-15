export interface DerivativeInfo {
  order: number;
  order_label: string;
  symbolic_expr: string;
  latex: string;
}

export interface TaylorStep {
  step: number;
  xn: number;
  yn: number;
  derivatives_values: number[];
  yn_plus_1: number;
  y_exact?: number | null;
  error_abs?: number | null;
  error_rel?: number | null;
  explanation_latex: string;
  explanation_text: string;
}

export interface ComparisonMethodResult {
  name: string;
  order: number;
  points_x: number[];
  points_y: number[];
  final_value: number;
  final_error_abs?: number | null;
  final_error_rel?: number | null;
}

export interface DiscretePoint {
  step: number;
  x: number;
  y: number;
}

export interface TaylorPlotData {
  approx_x: number[];
  approx_y: number[];
  exact_x?: number[] | null;
  exact_y?: number[] | null;
  discrete_points: DiscretePoint[];
  error_x?: number[] | null;
  error_y?: number[] | null;
}

export interface TaylorResponse {
  expression: string;
  x_var: string;
  y_var: string;
  x0: number;
  y0: number;
  xf: number;
  h: number;
  n_steps: number;
  order: number;
  derivatives: DerivativeInfo[];
  generic_formula_latex: string;
  exact_solution_latex?: string | null;
  has_exact_solution: boolean;
  final_approx_value: number;
  final_exact_value?: number | null;
  final_error_abs?: number | null;
  final_error_rel?: number | null;
  steps: TaylorStep[];
  comparison_methods?: ComparisonMethodResult[];
  plot_data: TaylorPlotData;
  amiconi_summary: string[];
}

export interface TaylorRequest {
  expression: string;
  x_var?: string;
  y_var?: string;
  x0: number | string;
  y0: number | string;
  xf: number | string;
  h?: number;
  n_steps?: number;
  order: number;
}

export interface TaylorPreset {
  id: string;
  title: string;
  subtitle: string;
  expression: string;
  displayExpression?: string;
  x_var: string;
  y_var: string;
  x0: number;
  y0: number;
  xf: number;
  h: number;
  order: number;
  exactFormula?: string;
  source: 'amiconi' | 'tp5';
}
