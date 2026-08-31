import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface FunctionInterval {
  expression: string;
  start: string;
  end: string;
}

export interface FourierRequest {
  functions: FunctionInterval[];
  harmonics: number;
  points: number;
  periods?: number;
  convergence_points?: number[];
}

export interface ConvergenceResult {
   x: number;
   value: number;
   formula: string;
 }

 export interface PlotData {
   x: number[];
   y_original: number[];
   y_approx: number[];
 }

 export interface HarmonicComponent {
   n: number;
   an: number;
   bn: number;
 }

 export interface FourierResponse {
   a0: string;
   an: string;
   bn: string;
   symmetry: string;
   plot_data: PlotData;
   convergence_results?: ConvergenceResult[];
   harmonics?: HarmonicComponent[];
 }

export interface HarmonicResult {
  frequency: number;
  amplitude: number;
  harmonic_index: number;
}

export interface AnalysisFrame {
  time: number;
  fundamental_frequency: number;
  harmonics: HarmonicResult[];
}

export interface AudioAnalysisResponse {
  fundamental_frequency: number;
  harmonics: HarmonicResult[];
  spectrum_x: number[];
  spectrum_y: number[];
  timeline: AnalysisFrame[];
  sample_rate: number;
  duration: number;
}

export const calculateFourier = async (request: FourierRequest): Promise<FourierResponse> => {
  try {
    const response = await api.post<FourierResponse>('/calculate', request);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.detail || 'Failed to calculate Fourier series');
    }
    throw new Error('Network error or server unreachable');
  }
};

export const analyzeAudio = async (file: File): Promise<AudioAnalysisResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await api.post<AudioAnalysisResponse>('/harmonics/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.detail || 'Failed to analyze audio');
    }
    throw new Error('Network error or server unreachable');
  }
};

// --- Numerical Methods: Root Finding (Newton & Fixed Point) ---

export interface NewtonRequest {
  expression: string;
  x0: number;
  tolerance: number;
  max_iterations: number;
}

export interface FixedPointRequest {
  g_expression: string;
  x0: number;
  tolerance: number;
  max_iterations: number;
}

export interface NewtonStep {
  iteration: number;
  xn: number;
  fxn: number;
  f_prime_xn: number;
  xn_plus_1: number;
  error_abs: number;
  error_rel?: number | null;
}

export interface FixedPointStep {
  iteration: number;
  xn: number;
  gxn: number;
  xn_plus_1: number;
  error_abs: number;
  error_rel?: number | null;
}

export interface NewtonPlotData {
  curve_x: number[];
  curve_y: number[];
  tangents: Array<{
    iteration: number;
    x_point: number;
    y_point: number;
    slope: number;
    x_intercept: number;
  }>;
  roots_x: number[];
  roots_y: number[];
}

export interface FixedPointPlotData {
  curve_x: number[];
  curve_y: number[];
  line_y_eq_x: number[];
  cobweb_x: number[];
  cobweb_y: number[];
  roots_x: number[];
  roots_y: number[];
}

export interface NewtonResponse {
  root: number | null;
  converged: boolean;
  status: string;
  message: string;
  iterations_count: number;
  steps: NewtonStep[];
  latex_f: string;
  latex_f_prime: string;
  plot_data: NewtonPlotData;
}

export interface FixedPointResponse {
  root: number | null;
  converged: boolean;
  status: string;
  message: string;
  iterations_count: number;
  steps: FixedPointStep[];
  latex_g: string;
  latex_g_prime: string;
  k_constant_est?: number | null;
  plot_data: FixedPointPlotData;
}

export const calculateNewtonRoot = async (request: NewtonRequest): Promise<NewtonResponse> => {
  try {
    const response = await api.post<NewtonResponse>('/roots/newton', request);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.detail || 'Error al calcular por el método de Newton');
    }
    throw new Error('Error de conexión con el servidor');
  }
};

export const calculateFixedPointRoot = async (request: FixedPointRequest): Promise<FixedPointResponse> => {
  try {
    const response = await api.post<FixedPointResponse>('/roots/fixed-point', request);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.detail || 'Error al calcular por Punto Fijo');
    }
    throw new Error('Error de conexión con el servidor');
  }
};

export default api;

