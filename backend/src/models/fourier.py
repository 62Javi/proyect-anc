from pydantic import BaseModel, Field
from typing import List


class FunctionInterval(BaseModel):
    expression: str = Field(..., description="SymPy-compatible string (e.g., x**2)")
    start: float = Field(..., description="Start of the interval")
    end: float = Field(..., description="End of the interval")


class FourierRequest(BaseModel):
    functions: List[FunctionInterval] = Field(
        ..., description="List of expressions and their intervals"
    )
    harmonics: int = Field(
        10, ge=1, le=100, description="Number of terms in the partial sum"
    )
    points: int = Field(1000, description="Number of points to evaluate for plotting")


class PlotData(BaseModel):
    x: List[float]
    y_original: List[float]
    y_approx: List[float]


class FourierResponse(BaseModel):
    a0: str = Field(..., description="LaTeX string for a0")
    an: str = Field(..., description="LaTeX string for an formula")
    bn: str = Field(..., description="LaTeX string for bn formula")
    symmetry: str = Field(..., description="Par, Impar, or Ninguna")
    plot_data: PlotData = Field(..., description="Points for Plotly rendering")
