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
}

export interface PlotData {
  x: number[];
  y_original: number[];
  y_approx: number[];
}

export interface FourierResponse {
  a0: string;
  an: string;
  bn: string;
  symmetry: string;
  plot_data: PlotData;
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

export default api;
