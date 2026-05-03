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
  start: number;
  end: number;
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

export default api;
