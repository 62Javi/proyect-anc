from typing import Any, Dict, List, Optional, Union
from pydantic import BaseModel, Field


class TaylorRequest(BaseModel):
    expression: str = Field(..., description="Ecuación diferencial y' = f(x, y)", json_schema_extra={"example": "2*x*y"})
    x_var: str = Field("x", description="Nombre de la variable independiente ('x' o 't')", json_schema_extra={"example": "x"})
    y_var: str = Field("y", description="Nombre de la variable dependiente ('y')", json_schema_extra={"example": "y"})
    x0: Union[float, str] = Field(..., description="Valor inicial x0 (o t0)", json_schema_extra={"example": 1.0})
    y0: Union[float, str] = Field(..., description="Condición inicial y(x0) = y0", json_schema_extra={"example": 1.0})
    xf: Union[float, str] = Field(..., description="Punto final xf a evaluar", json_schema_extra={"example": 1.3})
    h: Optional[float] = Field(None, description="Paso de integración h (si no se especifica, se calcula desde n_steps)", json_schema_extra={"example": 0.1})
    n_steps: Optional[int] = Field(None, description="Número de iteraciones (opcional si se pasa h)", json_schema_extra={"example": 3})
    order: int = Field(2, ge=1, le=4, description="Orden del método de Taylor (1, 2, 3 o 4)", json_schema_extra={"example": 2})


class TaylorStep(BaseModel):
    step: int
    xn: float
    yn: float
    derivatives_values: List[float]
    yn_plus_1: float
    y_exact: Optional[float] = None
    error_abs: Optional[float] = None
    error_rel: Optional[float] = None
    explanation_latex: str
    explanation_text: str


class DerivativeInfo(BaseModel):
    order: int
    order_label: str
    symbolic_expr: str
    latex: str


class ComparisonMethodResult(BaseModel):
    name: str
    order: int
    points_x: List[float]
    points_y: List[float]
    final_value: float
    final_error_abs: Optional[float] = None
    final_error_rel: Optional[float] = None


class TaylorPlotData(BaseModel):
    approx_x: List[float]
    approx_y: List[float]
    exact_x: Optional[List[float]] = None
    exact_y: Optional[List[float]] = None
    discrete_points: List[Dict[str, float]]
    error_x: Optional[List[float]] = None
    error_y: Optional[List[float]] = None


class TaylorResponse(BaseModel):
    expression: str
    x_var: str
    y_var: str
    x0: float
    y0: float
    xf: float
    h: float
    n_steps: int
    order: int
    derivatives: List[DerivativeInfo]
    generic_formula_latex: str
    exact_solution_latex: Optional[str] = None
    has_exact_solution: bool
    final_approx_value: float
    final_exact_value: Optional[float] = None
    final_error_abs: Optional[float] = None
    final_error_rel: Optional[float] = None
    steps: List[TaylorStep]
    comparison_methods: List[ComparisonMethodResult]
    plot_data: TaylorPlotData
    amiconi_summary: List[str]
