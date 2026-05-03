from pydantic import BaseModel
from typing import List, Dict

class HarmonicResult(BaseModel):
    frequency: float
    amplitude: float
    harmonic_index: int

class AudioAnalysisResponse(BaseModel):
    fundamental_frequency: float
    harmonics: List[HarmonicResult]
    spectrum_x: List[float]
    spectrum_y: List[float]
    sample_rate: int
    duration: float
