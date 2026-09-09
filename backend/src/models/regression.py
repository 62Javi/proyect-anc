from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class DataPoint(BaseModel):
    x: float
    y: float
    context: Optional[float] = Field(
        None, description="Optional contextual value, e.g. ambient temperature"
    )


class FitRequest(BaseModel):
    model_type: str = Field(
        ...,
        description="Regression model type: 'linear', 'polynomial', 'exponential', 'power', 'saturation', 'newton_cooling'",
    )
    points: List[DataPoint] = Field(..., min_length=2)
    degree: Optional[int] = Field(
        2, ge=1, le=10, description="Degree for polynomial regression"
    )
    t_amb: Optional[float] = Field(
        None, description="Ambient temperature for Newton cooling model"
    )


class NormalEquationStep(BaseModel):
    matrix_a: List[List[float]]
    vector_b: List[float]
    variable_names: List[str]
    matrix_latex: str
    sums_table: Dict[str, float]
    solution_latex: str


class ResidualPoint(BaseModel):
    x: float
    y_actual: float
    y_pred: float
    residual: float


class RegressionMetrics(BaseModel):
    st: float
    sr: float
    r2: float
    r: float
    syx: float


class FitResponse(BaseModel):
    model_type: str
    formula_latex: str
    transformed_latex: Optional[str] = None
    parameters: Dict[str, float]
    metrics: RegressionMetrics
    normal_equations: NormalEquationStep
    residuals: List[ResidualPoint]
    curve_x: List[float]
    curve_y: List[float]
    points_x: List[float]
    points_y: List[float]
    explanation: str


class ClusterSummary(BaseModel):
    cluster_name: str
    code: str
    k_cooling_rate: float
    t_half: float
    temp_final: float
    temp_initial: float
    best_model: str
    r2_best: float


class Case1AnalysisResponse(BaseModel):
    clusters: Dict[str, Dict[str, Any]]
    summaries: List[ClusterSummary]
    general_conclusions: List[str]
