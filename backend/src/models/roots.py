from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class NewtonRequest(BaseModel):
    expression: str = Field(..., description="Mathematical function f(x) = 0", example="x**2 - 4*x - 45")
    x0: float = Field(..., description="Initial starting value x0", example=0.5)
    tolerance: float = Field(1e-4, description="Stopping error tolerance |x_{n+1} - x_n| < tol", example=1e-3)
    max_iterations: int = Field(50, description="Maximum number of iterations", example=20)


class FixedPointRequest(BaseModel):
    g_expression: str = Field(..., description="Iteration function g(x) such that x = g(x)", example="0.8 + 0.2*sin(x)")
    x0: float = Field(..., description="Initial starting value x0", example=0.7854)
    tolerance: float = Field(1e-4, description="Stopping error tolerance |x_{n+1} - x_n| < tol", example=1e-3)
    max_iterations: int = Field(50, description="Maximum number of iterations", example=20)


class NewtonStep(BaseModel):
    iteration: int
    xn: float
    fxn: float
    f_prime_xn: float
    xn_plus_1: float
    error_abs: float
    error_rel: Optional[float] = None


class FixedPointStep(BaseModel):
    iteration: int
    xn: float
    gxn: float
    xn_plus_1: float
    error_abs: float
    error_rel: Optional[float] = None


class NewtonPlotData(BaseModel):
    curve_x: List[float]
    curve_y: List[float]
    tangents: List[Dict[str, Any]]
    roots_x: List[float]
    roots_y: List[float]


class FixedPointPlotData(BaseModel):
    curve_x: List[float]
    curve_y: List[float]
    line_y_eq_x: List[float]
    cobweb_x: List[float]
    cobweb_y: List[float]
    roots_x: List[float]
    roots_y: List[float]


class NewtonResponse(BaseModel):
    root: Optional[float]
    converged: bool
    status: str
    message: str
    iterations_count: int
    steps: List[NewtonStep]
    latex_f: str
    latex_f_prime: str
    plot_data: NewtonPlotData


class FixedPointResponse(BaseModel):
    root: Optional[float]
    converged: bool
    status: str
    message: str
    iterations_count: int
    steps: List[FixedPointStep]
    latex_g: str
    latex_g_prime: str
    k_constant_est: Optional[float] = None
    plot_data: FixedPointPlotData
