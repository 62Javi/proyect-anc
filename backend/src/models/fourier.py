from pydantic import BaseModel, Field
from typing import List


class FunctionInterval(BaseModel):
    expression: str = Field(..., min_length=1, max_length=1000, description="SymPy-compatible string (e.g., x**2)")
    start: float = Field(..., description="Start of the interval")
    end: float = Field(..., description="End of the interval")


class ConvergenceResult(BaseModel):
    x: float
    value: float
    formula: str


class FourierRequest(BaseModel):
    functions: List[FunctionInterval] = Field(
        ..., min_items=1, max_items=10, description="List of expressions and their intervals"
    )
    harmonics: int = Field(
        10, ge=1, le=100, description="Number of terms in the partial sum"
    )
    points: int = Field(1000, ge=10, le=1000, description="Number of points to evaluate for plotting")
    periods: int = Field(1, ge=1, le=5, description="Number of periods to display")
    convergence_points: List[float] = Field(default_factory=list, description="Points to check convergence (Dirichlet)")


class PlotData(BaseModel):
    x: List[float]
    y_original: List[float]
    y_approx: List[float]


class HarmonicComponent(BaseModel):
    n: int = Field(..., description="Harmonic number")
    an: float = Field(..., description="Numeric value of an")
    bn: float = Field(..., description="Numeric value of bn")


class FourierResponse(BaseModel):
    a0: str = Field(..., description="LaTeX string for a0")
    an: str = Field(..., description="LaTeX string for an formula")
    bn: str = Field(..., description="LaTeX string for bn formula")
    symmetry: str = Field(..., description="Par, Impar, or Ninguna")
    plot_data: PlotData = Field(..., description="Points for Plotly rendering")
    convergence_results: List[ConvergenceResult] = Field(default_factory=list)
    harmonics: List[HarmonicComponent] = Field(default_factory=list, description="First 10 harmonics with An and Bn values")
