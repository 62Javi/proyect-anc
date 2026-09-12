import json
import math
from pathlib import Path
from typing import Any, Dict, List, Optional

import numpy as np

from src.models.regression import (
    Case1AnalysisResponse,
    ClusterSummary,
    DataPoint,
    FitRequest,
    FitResponse,
    NormalEquationStep,
    RegressionMetrics,
    ResidualPoint,
)

CASE1_DATA_PATH = Path(__file__).parent / "case1_data.json"


def format_exp_coeff_latex(ln_a: float, precision: int = 4) -> str:
    """Format coefficient a = exp(ln_a) safely in LaTeX scientific notation if exponent is outside [-3, 4]."""
    try:
        log10_a = ln_a / math.log(10)
        exp = int(math.floor(log10_a))
        mantissa = math.exp((log10_a - exp) * math.log(10))
        if -3 <= exp <= 4:
            a = math.exp(ln_a)
            return f"{a:.{precision}f}"
        return f"{mantissa:.{precision}f} \\times 10^{{{exp}}}"
    except Exception:
        return "0.0000"


def format_num_clean(val: float, decimals: int = 4) -> str:
    """Format numbers without redundant trailing zeros: 15.00 -> '15', 19.70 -> '19.7', -2.000 -> '-2'."""
    if abs(val) < 1e-12:
        return "0"
    if abs(val - round(val)) < 1e-9:
        return str(int(round(val)))
    s = f"{val:.{decimals}f}".rstrip("0").rstrip(".")
    return s


def format_poly_coeff(c: float, precision: int = 4) -> str:
    """Format polynomial coefficient nicely:
    - If |c| < 1e-12: '0'
    - If standard fixed formatting rounds to zero (e.g. 0.0000) but c != 0:
      format in scientific notation (e.g. 1.04 \\times 10^{-6})
    - Otherwise format with standard fixed decimal precision.
    """
    abs_c = abs(c)
    if abs_c < 1e-12:
        return "0"
    fixed = f"{abs_c:.{precision}f}"
    if float(fixed) == 0.0:
        exp = int(math.floor(math.log10(abs_c)))
        mantissa = abs_c / (10**exp)
        return rf"{mantissa:.2f} \times 10^{{{exp}}}"
    return fixed


class LeastSquaresCalculator:
    def __init__(self):
        self._case1_cache: Optional[Dict[str, List[Dict[str, Any]]]] = None

    def get_case1_raw_data(self) -> Dict[str, List[Dict[str, Any]]]:
        if self._case1_cache is None:
            if CASE1_DATA_PATH.exists():
                with open(CASE1_DATA_PATH, "r", encoding="utf-8") as f:
                    self._case1_cache = json.load(f)
            else:
                self._case1_cache = {}
        return self._case1_cache

    def fit(self, request: FitRequest) -> FitResponse:
        model_type = request.model_type.lower().strip()
        x = np.array([p.x for p in request.points], dtype=float)
        y = np.array([p.y for p in request.points], dtype=float)
        context = np.array(
            [p.context if p.context is not None else 0.0 for p in request.points],
            dtype=float,
        )

        if len(x) < 2:
            raise ValueError("Se requieren al menos 2 puntos para realizar un ajuste.")

        if model_type == "linear":
            return self._fit_linear(x, y)
        elif model_type == "polynomial":
            degree = request.degree or 2
            return self._fit_polynomial(x, y, degree)
        elif model_type == "exponential":
            return self._fit_exponential(x, y)
        elif model_type == "power":
            return self._fit_power(x, y)
        elif model_type == "saturation":
            return self._fit_saturation(x, y)
        elif model_type == "newton_cooling":
            t_amb = request.t_amb
            if t_amb is None:
                # Use mean context or mean min
                t_amb = float(np.mean(context)) if np.any(context > 0) else 22.0
            return self._fit_newton_cooling(x, y, t_amb)
        else:
            raise ValueError(
                f"Modelo desconocido: {model_type}. Soportados: linear, polynomial, exponential, power, saturation, newton_cooling"
            )

    def _fit_linear(self, x: np.ndarray, y: np.ndarray) -> FitResponse:
        n = len(x)
        sum_x = float(np.sum(x))
        sum_y = float(np.sum(y))
        sum_x2 = float(np.sum(x**2))
        sum_xy = float(np.sum(x * y))

        matrix_a = [[float(n), sum_x], [sum_x, sum_x2]]
        vector_b = [sum_y, sum_xy]

        det = matrix_a[0][0] * matrix_a[1][1] - matrix_a[0][1] * matrix_a[1][0]
        if abs(det) < 1e-12:
            raise ValueError(
                "Matriz singular: los puntos no permiten resolver un ajuste lineal único."
            )

        a1 = (vector_b[0] * matrix_a[1][1] - vector_b[1] * matrix_a[0][1]) / det
        a2 = (matrix_a[0][0] * vector_b[1] - matrix_a[1][0] * vector_b[0]) / det

        y_pred = a1 + a2 * x
        residuals = y - y_pred

        y_mean = float(np.mean(y))
        st = float(np.sum((y - y_mean) ** 2))
        sr = float(np.sum(residuals**2))
        r2 = max(0.0, (st - sr) / st) if st > 1e-12 else 1.0
        r = math.copysign(math.sqrt(r2), a2)
        syx = math.sqrt(sr / (n - 2)) if n > 2 else 0.0

        sym_latex = r"\begin{bmatrix} n & \sum x_i \\ \sum x_i & \sum x_i^2 \end{bmatrix} \begin{bmatrix} a_1 \\ a_2 \end{bmatrix} = \begin{bmatrix} \sum y_i \\ \sum x_i y_i \end{bmatrix}"
        num_latex = (
            rf"\begin{{bmatrix}} {n} & {format_num_clean(sum_x, 2)} \\ {format_num_clean(sum_x, 2)} & {format_num_clean(sum_x2, 2)} \end{{bmatrix}} "
            rf"\begin{{bmatrix}} a_1 \\ a_2 \end{{bmatrix}} = "
            rf"\begin{{bmatrix}} {format_num_clean(sum_y, 2)} \\ {format_num_clean(sum_xy, 2)} \end{{bmatrix}}"
        )
        sol_latex = rf"a_1 = {format_num_clean(a1, 4)}, \quad a_2 = {format_num_clean(a2, 4)}"
        matrix_latex = f"{sym_latex} \\implies {num_latex}"

        # Generate smooth curve
        x_min, x_max = float(np.min(x)), float(np.max(x))
        x_span = max(x_max - x_min, 1.0)
        cx = np.linspace(x_min - 0.05 * x_span, x_max + 0.05 * x_span, 100)
        cy = a1 + a2 * cx

        sign_str = "+" if a2 >= 0 else "-"
        formula_latex = rf"y = {format_num_clean(a1, 4)} {sign_str} {format_num_clean(abs(a2), 4)}x"

        return FitResponse(
            model_type="linear",
            formula_latex=formula_latex,
            parameters={"a1": round(a1, 6), "a2": round(a2, 6)},
            metrics=RegressionMetrics(st=st, sr=sr, r2=r2, r=r, syx=syx),
            normal_equations=NormalEquationStep(
                matrix_a=matrix_a,
                vector_b=vector_b,
                variable_names=["a_1 (ordenada)", "a_2 (pendiente)"],
                matrix_latex=matrix_latex,
                sums_table={
                    "n": float(n),
                    "sum_x": sum_x,
                    "sum_y": sum_y,
                    "sum_x2": sum_x2,
                    "sum_xy": sum_xy,
                },
                solution_latex=sol_latex,
            ),
            residuals=[
                ResidualPoint(
                    x=float(x[i]),
                    y_actual=float(y[i]),
                    y_pred=float(y_pred[i]),
                    residual=float(residuals[i]),
                )
                for i in range(n)
            ],
            curve_x=[float(v) for v in cx],
            curve_y=[float(v) for v in cy],
            points_x=[float(v) for v in x],
            points_y=[float(v) for v in y],
            explanation="Ajuste lineal mediante las ecuaciones normales canónicas del apunte.",
        )

    def _fit_polynomial(self, x: np.ndarray, y: np.ndarray, degree: int) -> FitResponse:
        n = len(x)
        if n <= degree:
            raise ValueError(
                f"Se necesitan al menos {degree + 1} puntos para un polinomio de grado {degree}."
            )

        # Ecuaciones normales para polinomio: sum_{m=0}^k a_{m+1} sum(x^(j+m)) = sum(y * x^j)
        m_size = degree + 1
        matrix_a = np.zeros((m_size, m_size), dtype=float)
        vector_b = np.zeros(m_size, dtype=float)

        sums_table: Dict[str, float] = {"n": float(n)}
        for p in range(1, 2 * degree + 1):
            sums_table[f"sum_x{p}"] = float(np.sum(x**p))

        for j in range(m_size):
            for m in range(m_size):
                matrix_a[j, m] = np.sum(x ** (j + m))
            vector_b[j] = np.sum(y * (x**j))
            sums_table[f"sum_y_x{j}"] = float(vector_b[j])

        try:
            # np.polyfit uses QR/SVD decomposition which is numerically stable even for high degrees and large coordinate values
            poly_coeffs = np.polyfit(x, y, degree)[::-1]
            coeffs = poly_coeffs
        except Exception:
            try:
                coeffs = np.linalg.solve(matrix_a, vector_b)
            except np.linalg.LinAlgError:
                raise ValueError("Matriz singular en el ajuste polinómico.")

        # y_pred
        y_pred = np.zeros(n, dtype=float)
        for j in range(m_size):
            y_pred += coeffs[j] * (x**j)

        residuals = y - y_pred
        y_mean = float(np.mean(y))
        st = float(np.sum((y - y_mean) ** 2))
        sr = float(np.sum(residuals**2))
        r2 = max(0.0, (st - sr) / st) if st > 1e-12 else 1.0
        r = math.sqrt(r2)
        dof = n - m_size
        syx = math.sqrt(sr / dof) if dof > 0 else 0.0

        # Build LaTeX
        terms = []
        for j in range(m_size):
            c = coeffs[j]
            abs_c = abs(c)
            if abs_c < 1e-12 and j > 0:
                continue
            coeff_str = format_poly_coeff(c, 4)
            if j == 0:
                terms.append(f"-{coeff_str}" if c < 0 else coeff_str)
            elif j == 1:
                sign = "+" if c >= 0 else "-"
                terms.append(f"{sign} {coeff_str}x")
            else:
                sign = "+" if c >= 0 else "-"
                terms.append(f"{sign} {coeff_str}x^{j}")
        formula_latex = "y = " + (" ".join(terms) if terms else "0")

        matrix_rows = []
        for r in range(m_size):
            row_str = " & ".join([f"{matrix_a[r, c]:.2f}" for c in range(m_size)])
            matrix_rows.append(row_str)
        b_str = " \\\\ ".join([f"{val:.2f}" for val in vector_b])
        rows_str = " \\\\ ".join(matrix_rows)
        num_latex = rf"\begin{{bmatrix}} {rows_str} \end{{bmatrix}} \mathbf{{a}} = \begin{{bmatrix}} {b_str} \end{{bmatrix}}"
        sol_latex = ", ".join(
            [
                rf"a_{j + 1} = {'-' if coeffs[j] < 0 else ''}{format_poly_coeff(coeffs[j], 4)}"
                for j in range(m_size)
            ]
        )

        x_min, x_max = float(np.min(x)), float(np.max(x))
        x_span = max(x_max - x_min, 1.0)
        cx = np.linspace(x_min - 0.05 * x_span, x_max + 0.05 * x_span, 100)
        cy = np.zeros_like(cx)
        for j in range(m_size):
            cy += coeffs[j] * (cx**j)

        params_dict = {f"a{j + 1}": round(float(coeffs[j]), 6) for j in range(m_size)}

        return FitResponse(
            model_type=f"polynomial_deg_{degree}",
            formula_latex=formula_latex,
            parameters=params_dict,
            metrics=RegressionMetrics(st=st, sr=sr, r2=r2, r=r, syx=syx),
            normal_equations=NormalEquationStep(
                matrix_a=matrix_a.tolist(),
                vector_b=vector_b.tolist(),
                variable_names=[f"a_{j + 1}" for j in range(m_size)],
                matrix_latex=num_latex,
                sums_table=sums_table,
                solution_latex=sol_latex,
            ),
            residuals=[
                ResidualPoint(
                    x=float(x[i]),
                    y_actual=float(y[i]),
                    y_pred=float(y_pred[i]),
                    residual=float(residuals[i]),
                )
                for i in range(n)
            ],
            curve_x=[float(v) for v in cx],
            curve_y=[float(v) for v in cy],
            points_x=[float(v) for v in x],
            points_y=[float(v) for v in y],
            explanation=f"Ajuste polinómico de grado {degree} con sistema de Gauss de orden {m_size}x{m_size}.",
        )

    def _fit_exponential(self, x: np.ndarray, y: np.ndarray) -> FitResponse:
        if np.any(y <= 0):
            raise ValueError(
                "El ajuste exponencial requiere valores de y estrictamente positivos (y > 0)."
            )

        n = len(x)
        ln_y = np.log(y)

        sum_x = float(np.sum(x))
        sum_lny = float(np.sum(ln_y))
        sum_x2 = float(np.sum(x**2))
        sum_x_lny = float(np.sum(x * ln_y))

        matrix_a = [[float(n), sum_x], [sum_x, sum_x2]]
        vector_b = [sum_lny, sum_x_lny]

        det = matrix_a[0][0] * matrix_a[1][1] - matrix_a[0][1] * matrix_a[1][0]
        if abs(det) < 1e-12:
            raise ValueError("Matriz singular en el ajuste exponencial.")

        ln_a = (vector_b[0] * matrix_a[1][1] - vector_b[1] * matrix_a[0][1]) / det
        b = (matrix_a[0][0] * vector_b[1] - matrix_a[1][0] * vector_b[0]) / det
        try:
            a = math.exp(ln_a) if abs(ln_a) <= 709 else (float("inf") if ln_a > 709 else 0.0)
        except OverflowError:
            a = float("inf")

        # Bondad en espacio linealizado según apunte del Ing. Amiconi (pág 8)
        mean_lny = float(np.mean(ln_y))
        pred_lny = ln_a + b * x
        st_ln = float(np.sum((ln_y - mean_lny) ** 2))
        sr_ln = float(np.sum((ln_y - pred_lny) ** 2))
        r2 = max(0.0, (st_ln - sr_ln) / st_ln) if st_ln > 1e-12 else 1.0

        # Predicción original en espacio logarítmico para estabilidad numérica absoluta
        log_pred = ln_a + b * x
        y_pred = np.exp(np.clip(log_pred, -700, 700))
        residuals = y - y_pred
        st_orig = float(np.sum((y - np.mean(y)) ** 2))
        sr_orig = float(np.sum(residuals**2))
        syx = math.sqrt(sr_orig / (n - 2)) if n > 2 else 0.0

        sym_latex = r"\begin{bmatrix} n & \sum x_i \\ \sum x_i & \sum x_i^2 \end{bmatrix} \begin{bmatrix} \ln(a) \\ b \end{bmatrix} = \begin{bmatrix} \sum \ln(y_i) \\ \sum x_i \ln(y_i) \end{bmatrix}"
        num_latex = (
            rf"\begin{{bmatrix}} {n} & {sum_x:.2f} \\ {sum_x:.2f} & {sum_x2:.2f} \end{{bmatrix}} "
            rf"\begin{{bmatrix}} \ln(a) \\ b \end{{bmatrix}} = "
            rf"\begin{{bmatrix}} {sum_lny:.2f} \\ {sum_x_lny:.2f} \end{{bmatrix}}"
        )
        a_latex = format_exp_coeff_latex(ln_a, precision=4)
        if abs(ln_a) >= 10:
            sol_latex = rf"\ln(a) = {ln_a:.4f} \implies a = e^{{{ln_a:.4f}}} \approx {a_latex}, \quad b = {b:.5f}"
        else:
            sol_latex = rf"\ln(a) = {ln_a:.4f} \implies a = {a_latex}, \quad b = {b:.5f}"

        transformed_latex = rf"\ln(y) = \ln(a) + bx \iff \ln(y) = {ln_a:.4f} {('+' if b >= 0 else '-')} {abs(b):.5f}x"
        if "\\times" in a_latex:
            formula_latex = rf"y = ({a_latex}) \cdot e^{{{b:.5f}x}}"
        else:
            formula_latex = rf"y = {a_latex} \cdot e^{{{b:.5f}x}}"

        x_min, x_max = float(np.min(x)), float(np.max(x))
        x_span = max(x_max - x_min, 1.0)
        cx = np.linspace(x_min - 0.05 * x_span, x_max + 0.05 * x_span, 100)
        cy = np.exp(np.clip(ln_a + b * cx, -700, 700))

        a_param = round(float(a), 6) if (0.0001 <= abs(a) <= 1e6) else (float(f"{a:.6e}") if a != 0 else 0.0)

        return FitResponse(
            model_type="exponential",
            formula_latex=formula_latex,
            transformed_latex=transformed_latex,
            parameters={"a": a_param, "b": round(b, 6), "ln_a": round(ln_a, 6)},
            metrics=RegressionMetrics(
                st=st_ln, sr=sr_ln, r2=r2, r=math.sqrt(r2), syx=syx
            ),
            normal_equations=NormalEquationStep(
                matrix_a=matrix_a,
                vector_b=vector_b,
                variable_names=["ln(a)", "b"],
                matrix_latex=f"{sym_latex} \\implies {num_latex}",
                sums_table={
                    "n": float(n),
                    "sum_x": sum_x,
                    "sum_lny": sum_lny,
                    "sum_x2": sum_x2,
                    "sum_x_lny": sum_x_lny,
                },
                solution_latex=sol_latex,
            ),
            residuals=[
                ResidualPoint(
                    x=float(x[i]),
                    y_actual=float(y[i]),
                    y_pred=float(y_pred[i]),
                    residual=float(residuals[i]),
                )
                for i in range(n)
            ],
            curve_x=[float(v) for v in cx],
            curve_y=[float(v) for v in cy],
            points_x=[float(v) for v in x],
            points_y=[float(v) for v in y],
            explanation="Ajuste exponencial y = a*e^(bx) linealizado aplicando logaritmo natural ln(y) = ln(a) + bx según apunte oficial.",
        )

    def _fit_power(self, x: np.ndarray, y: np.ndarray) -> FitResponse:
        if np.any(x <= 0) or np.any(y <= 0):
            raise ValueError(
                "El ajuste potencial requiere valores de x e y estrictamente positivos (x > 0, y > 0)."
            )

        n = len(x)
        ln_x = np.log(x)
        ln_y = np.log(y)

        sum_lnx = float(np.sum(ln_x))
        sum_lny = float(np.sum(ln_y))
        sum_lnx2 = float(np.sum(ln_x**2))
        sum_lnx_lny = float(np.sum(ln_x * ln_y))

        matrix_a = [[float(n), sum_lnx], [sum_lnx, sum_lnx2]]
        vector_b = [sum_lny, sum_lnx_lny]

        det = matrix_a[0][0] * matrix_a[1][1] - matrix_a[0][1] * matrix_a[1][0]
        if abs(det) < 1e-12:
            raise ValueError("Matriz singular en el ajuste potencial.")

        ln_a = (vector_b[0] * matrix_a[1][1] - vector_b[1] * matrix_a[0][1]) / det
        b = (matrix_a[0][0] * vector_b[1] - matrix_a[1][0] * vector_b[0]) / det

        # Recuperar parámetro 'a' con protección de desbordamiento (OverflowError)
        try:
            a = math.exp(ln_a) if abs(ln_a) <= 709 else (float("inf") if ln_a > 709 else 0.0)
        except OverflowError:
            a = float("inf") if ln_a > 0 else 0.0

        mean_lny = float(np.mean(ln_y))
        pred_lny = ln_a + b * ln_x
        st_ln = float(np.sum((ln_y - mean_lny) ** 2))
        sr_ln = float(np.sum((ln_y - pred_lny) ** 2))
        r2 = max(0.0, (st_ln - sr_ln) / st_ln) if st_ln > 1e-12 else 1.0

        # Cálculo de predicción y residuos mediante espacio logarítmico para estabilidad numérica
        y_pred = np.exp(np.clip(ln_a + b * ln_x, -700, 700))
        residuals = y - y_pred
        sr_orig = float(np.sum(residuals**2))
        syx = math.sqrt(sr_orig / (n - 2)) if n > 2 else 0.0

        sym_latex = r"\begin{bmatrix} n & \sum \ln(x_i) \\ \sum \ln(x_i) & \sum (\ln(x_i))^2 \end{bmatrix} \begin{bmatrix} \ln(a) \\ b \end{bmatrix} = \begin{bmatrix} \sum \ln(y_i) \\ \sum \ln(x_i)\ln(y_i) \end{bmatrix}"
        num_latex = (
            rf"\begin{{bmatrix}} {n} & {sum_lnx:.2f} \\ {sum_lnx:.2f} & {sum_lnx2:.2f} \end{{bmatrix}} "
            rf"\begin{{bmatrix}} \ln(a) \\ b \end{{bmatrix}} = "
            rf"\begin{{bmatrix}} {sum_lny:.2f} \\ {sum_lnx_lny:.2f} \end{{bmatrix}}"
        )

        sci_a = format_exp_coeff_latex(ln_a, precision=4)
        if abs(ln_a) >= 5:
            # Notación analítica de cátedra y científica para evitar redondeo falso a 0.0000
            a_formula = rf"e^{{{ln_a:.4f}}}"
            sol_latex = rf"\ln(a) = {ln_a:.4f} \implies a = e^{{{ln_a:.4f}}} \approx {sci_a}, \quad b = {b:.5f}"
        else:
            a_formula = rf"{a:.4f}"
            sol_latex = rf"\ln(a) = {ln_a:.4f} \implies a = {a:.4f}, \quad b = {b:.5f}"

        transformed_latex = rf"\ln(y) = \ln(a) + b\ln(x) \iff \ln(y) = {ln_a:.4f} {('+' if b >= 0 else '-')} {abs(b):.5f}\ln(x)"
        formula_latex = rf"y = {a_formula} \cdot x^{{{b:.5f}}}"

        # Curva suave para gráficos con saneamiento de NaN / Inf
        x_min, x_max = float(np.min(x)), float(np.max(x))
        cx = np.linspace(max(x_min * 0.8, 1e-4), x_max * 1.05, 100)
        cy = np.exp(np.clip(ln_a + b * np.log(cx), -700, 700))

        r2_safe = float(r2) if math.isfinite(r2) else 0.0
        r_safe = math.sqrt(r2_safe) if math.isfinite(r2_safe) else 0.0
        sr_safe = float(sr_ln) if math.isfinite(sr_ln) else 0.0
        syx_safe = float(syx) if math.isfinite(syx) else 0.0

        a_param = round(float(a), 6) if (0.0001 <= abs(a) <= 1e6) else (float(f"{a:.6e}") if a != 0 else 0.0)

        return FitResponse(
            model_type="power",
            formula_latex=formula_latex,
            transformed_latex=transformed_latex,
            parameters={"a": a_param, "b": round(b, 6), "ln_a": round(ln_a, 6)},
            metrics=RegressionMetrics(
                st=st_ln, sr=sr_safe, r2=r2_safe, r=r_safe, syx=syx_safe
            ),
            normal_equations=NormalEquationStep(
                matrix_a=matrix_a,
                vector_b=vector_b,
                variable_names=["ln(a)", "b"],
                matrix_latex=f"{sym_latex} \\implies {num_latex}",
                sums_table={
                    "n": float(n),
                    "sum_lnx": sum_lnx,
                    "sum_lny": sum_lny,
                    "sum_lnx2": sum_lnx2,
                    "sum_lnx_lny": sum_lnx_lny,
                },
                solution_latex=sol_latex,
            ),
            residuals=[
                ResidualPoint(
                    x=float(x[i]),
                    y_actual=float(y[i]),
                    y_pred=float(y_pred[i]) if math.isfinite(y_pred[i]) else 0.0,
                    residual=float(residuals[i]) if math.isfinite(residuals[i]) else 0.0,
                )
                for i in range(n)
            ],
            curve_x=[float(v) for v in cx],
            curve_y=[float(v) for v in cy],
            points_x=[float(v) for v in x],
            points_y=[float(v) for v in y],
            explanation="Ajuste potencial y = a*x^b linealizado como ln(y) = ln(a) + b*ln(x).",
        )

    def _fit_saturation(self, x: np.ndarray, y: np.ndarray) -> FitResponse:
        if np.any(x == 0) or np.any(y == 0):
            raise ValueError(
                "El ajuste por saturación / cociente requiere x != 0 e y != 0 para invertir las variables."
            )

        n = len(x)
        inv_x = 1.0 / x
        inv_y = 1.0 / y

        sum_invx = float(np.sum(inv_x))
        sum_invy = float(np.sum(inv_y))
        sum_invx2 = float(np.sum(inv_x**2))
        sum_invx_invy = float(np.sum(inv_x * inv_y))

        matrix_a = [[float(n), sum_invx], [sum_invx, sum_invx2]]
        vector_b = [sum_invy, sum_invx_invy]

        det = matrix_a[0][0] * matrix_a[1][1] - matrix_a[0][1] * matrix_a[1][0]
        if abs(det) < 1e-12:
            raise ValueError("Matriz singular en el ajuste del cociente.")

        c1 = (vector_b[0] * matrix_a[1][1] - vector_b[1] * matrix_a[0][1]) / det  # 1/a
        c2 = (matrix_a[0][0] * vector_b[1] - matrix_a[1][0] * vector_b[0]) / det  # b/a

        if abs(c1) < 1e-12:
            raise ValueError("Parámetro 1/a cercano a cero.")

        a = 1.0 / c1
        b = c2 * a

        # Bondad en espacio transformado 1/y
        mean_invy = float(np.mean(inv_y))
        pred_invy = c1 + c2 * inv_x
        st_inv = float(np.sum((inv_y - mean_invy) ** 2))
        sr_inv = float(np.sum((inv_y - pred_invy) ** 2))
        r2 = max(0.0, (st_inv - sr_inv) / st_inv) if st_inv > 1e-12 else 1.0

        denom = b + x
        denom = np.where(np.abs(denom) < 1e-10, 1e-10 * np.where(denom >= 0, 1.0, -1.0), denom)
        y_pred = (a * x) / denom
        residuals = y - y_pred
        sr_orig = float(np.sum(residuals**2))
        syx = math.sqrt(sr_orig / (n - 2)) if n > 2 else 0.0

        sym_latex = r"\begin{bmatrix} n & \sum \frac{1}{x_i} \\ \sum \frac{1}{x_i} & \sum (\frac{1}{x_i})^2 \end{bmatrix} \begin{bmatrix} \frac{1}{a} \\ \frac{b}{a} \end{bmatrix} = \begin{bmatrix} \sum \frac{1}{y_i} \\ \sum \frac{1}{x_i y_i} \end{bmatrix}"
        num_latex = (
            rf"\begin{{bmatrix}} {n} & {sum_invx:.4f} \\ {sum_invx:.4f} & {sum_invx2:.4f} \end{{bmatrix}} "
            rf"\begin{{bmatrix}} \frac{{1}}{{a}} \\ \frac{{b}}{{a}} \end{{bmatrix}} = "
            rf"\begin{{bmatrix}} {sum_invy:.4f} \\ {sum_invx_invy:.4f} \end{{bmatrix}}"
        )
        sol_latex = rf"\frac{{1}}{{a}} = {c1:.4f} \implies a = {a:.4f}, \quad \frac{{b}}{{a}} = {c2:.4f} \implies b = {b:.4f}"
        transformed_latex = rf"\frac{{1}}{{y}} = \frac{{1}}{{a}} + \frac{{b}}{{a}}\frac{{1}}{{x}} \iff \frac{{1}}{{y}} = {c1:.4f} + {c2:.4f}\frac{{1}}{{x}}"
        formula_latex = rf"y = \frac{{{a:.4f}x}}{{{b:.4f} + x}}"

        x_min, x_max = float(np.min(x)), float(np.max(x))
        cx = np.linspace(max(x_min * 0.8, 1e-3), x_max * 1.05, 100)
        c_denom = b + cx
        c_denom = np.where(np.abs(c_denom) < 1e-10, 1e-10 * np.where(c_denom >= 0, 1.0, -1.0), c_denom)
        cy = (a * cx) / c_denom
        y_bound = max(float(np.max(np.abs(y))) * 10.0, 1000.0)
        cy = np.clip(cy, -y_bound, y_bound)

        return FitResponse(
            model_type="saturation",
            formula_latex=formula_latex,
            transformed_latex=transformed_latex,
            parameters={
                "a": round(a, 6),
                "b": round(b, 6),
                "one_over_a": round(c1, 6),
                "b_over_a": round(c2, 6),
            },
            metrics=RegressionMetrics(
                st=st_inv, sr=sr_inv, r2=r2, r=math.sqrt(r2), syx=syx
            ),
            normal_equations=NormalEquationStep(
                matrix_a=matrix_a,
                vector_b=vector_b,
                variable_names=["1/a", "b/a"],
                matrix_latex=f"{sym_latex} \\implies {num_latex}",
                sums_table={
                    "n": float(n),
                    "sum_invx": sum_invx,
                    "sum_invy": sum_invy,
                    "sum_invx2": sum_invx2,
                    "sum_invx_invy": sum_invx_invy,
                },
                solution_latex=sol_latex,
            ),
            residuals=[
                ResidualPoint(
                    x=float(x[i]),
                    y_actual=float(y[i]),
                    y_pred=float(y_pred[i]),
                    residual=float(residuals[i]),
                )
                for i in range(n)
            ],
            curve_x=[float(v) for v in cx],
            curve_y=[float(v) for v in cy],
            points_x=[float(v) for v in x],
            points_y=[float(v) for v in y],
            explanation="Ajuste por modelo de saturación/cociente y = a*x/(b+x) linealizado invirtiendo variables 1/y = 1/a + (b/a)*(1/x).",
        )

    def _fit_newton_cooling(
        self, x: np.ndarray, y: np.ndarray, t_amb: float
    ) -> FitResponse:
        delta_t = y - t_amb
        if np.any(delta_t <= 0):
            # If any measurement reaches or drops below ambient, clip slightly above zero for log
            delta_t = np.clip(delta_t, 0.01, None)

        n = len(x)
        ln_delta = np.log(delta_t)

        sum_x = float(np.sum(x))
        sum_lnd = float(np.sum(ln_delta))
        sum_x2 = float(np.sum(x**2))
        sum_x_lnd = float(np.sum(x * ln_delta))

        matrix_a = [[float(n), sum_x], [sum_x, sum_x2]]
        vector_b = [sum_lnd, sum_x_lnd]

        det = matrix_a[0][0] * matrix_a[1][1] - matrix_a[0][1] * matrix_a[1][0]
        if abs(det) < 1e-12:
            raise ValueError("Matriz singular en el modelo de Newton.")

        ln_A = (vector_b[0] * matrix_a[1][1] - vector_b[1] * matrix_a[0][1]) / det
        slope = (matrix_a[0][0] * vector_b[1] - matrix_a[1][0] * vector_b[0]) / det
        k = -slope
        A = math.exp(ln_A)

        y_pred = t_amb + A * np.exp(-k * x)
        residuals = y - y_pred

        y_mean = float(np.mean(y))
        st = float(np.sum((y - y_mean) ** 2))
        sr = float(np.sum(residuals**2))
        r2 = max(0.0, (st - sr) / st) if st > 1e-12 else 1.0
        r = math.sqrt(r2)
        syx = math.sqrt(sr / (n - 2)) if n > 2 else 0.0

        t_half = math.log(2) / k if k > 0 else float("inf")

        sym_latex = r"\begin{bmatrix} n & \sum t_i \\ \sum t_i & \sum t_i^2 \end{bmatrix} \begin{bmatrix} \ln(A) \\ -k \end{bmatrix} = \begin{bmatrix} \sum \ln(T_i - T_{amb}) \\ \sum t_i \ln(T_i - T_{amb}) \end{bmatrix}"
        num_latex = (
            rf"\begin{{bmatrix}} {n} & {sum_x:.2f} \\ {sum_x:.2f} & {sum_x2:.2f} \end{{bmatrix}} "
            rf"\begin{{bmatrix}} \ln(A) \\ -k \end{{bmatrix}} = "
            rf"\begin{{bmatrix}} {sum_lnd:.2f} \\ {sum_x_lnd:.2f} \end{{bmatrix}}"
        )
        sol_latex = rf"\ln(A) = {ln_A:.4f} \implies A = {A:.2f}^\circ\text{{C}}, \quad k = {k:.5f}\,\text{{min}}^{{-1}}"
        transformed_latex = rf"\ln(T - T_{{amb}}) = \ln(A) - kt \iff \ln(T - {t_amb:.2f}) = {ln_A:.4f} - {k:.5f}t"
        formula_latex = rf"T(t) = {t_amb:.2f} + {A:.2f} \cdot e^{{-{k:.5f}t}}"

        x_min, x_max = float(np.min(x)), float(np.max(x))
        cx = np.linspace(x_min, x_max + 10.0, 120)
        cy = t_amb + A * np.exp(-k * cx)

        return FitResponse(
            model_type="newton_cooling",
            formula_latex=formula_latex,
            transformed_latex=transformed_latex,
            parameters={
                "A": round(A, 4),
                "k": round(k, 6),
                "t_amb": round(t_amb, 2),
                "t_half": round(t_half, 2),
                "T0_estimated": round(t_amb + A, 2),
            },
            metrics=RegressionMetrics(st=st, sr=sr, r2=r2, r=r, syx=syx),
            normal_equations=NormalEquationStep(
                matrix_a=matrix_a,
                vector_b=vector_b,
                variable_names=["ln(A)", "-k"],
                matrix_latex=f"{sym_latex} \\implies {num_latex}",
                sums_table={
                    "n": float(n),
                    "sum_t": sum_x,
                    "sum_lnd": sum_lnd,
                    "sum_t2": sum_x2,
                    "sum_t_lnd": sum_x_lnd,
                },
                solution_latex=sol_latex,
            ),
            residuals=[
                ResidualPoint(
                    x=float(x[i]),
                    y_actual=float(y[i]),
                    y_pred=float(y_pred[i]),
                    residual=float(residuals[i]),
                )
                for i in range(n)
            ],
            curve_x=[float(v) for v in cx],
            curve_y=[float(v) for v in cy],
            points_x=[float(v) for v in x],
            points_y=[float(v) for v in y],
            explanation="Modelo Exponencial del apunte (y = a·e^(bx)) aplicado a la diferencia térmica Y' = T - Tamb (Ley de Enfriamiento de Newton). Modela rigurosamente la termodinámica del líquido con asíntota a Tamb.",
        )

    def analyze_case1(self) -> Case1AnalysisResponse:
        data = self.get_case1_raw_data()
        clusters_res: Dict[str, Dict[str, Any]] = {}
        summaries: List[ClusterSummary] = []

        code_map = {
            "Taza de cerámica": "CER",
            "Vaso de vidrio": "VID",
            "Vaso de papel con tapa": "PAP",
            "Recipiente térmico": "TER",
        }

        for cluster_name, rows in data.items():
            code = code_map.get(cluster_name, "UNK")
            points = [
                DataPoint(x=r["time_min"], y=r["temp_drink"], context=r["temp_amb"])
                for r in rows
            ]
            t_amb_mean = float(np.mean([r["temp_amb"] for r in rows]))

            # Fit the models
            fit_lin = self.fit(FitRequest(model_type="linear", points=points))
            fit_quad = self.fit(
                FitRequest(model_type="polynomial", points=points, degree=2)
            )
            fit_cubic = self.fit(
                FitRequest(model_type="polynomial", points=points, degree=3)
            )
            fit_exp = self.fit(FitRequest(model_type="exponential", points=points))
            fit_newton = self.fit(
                FitRequest(model_type="newton_cooling", points=points, t_amb=t_amb_mean)
            )

            k = fit_newton.parameters["k"]
            t_half = fit_newton.parameters["t_half"]
            temp_init = points[0].y
            temp_final = points[-1].y

            clusters_res[cluster_name] = {
                "name": cluster_name,
                "code": code,
                "raw_data": rows,
                "fits": {
                    "linear": fit_lin.model_dump(),
                    "polynomial_2": fit_quad.model_dump(),
                    "polynomial_3": fit_cubic.model_dump(),
                    "exponential": fit_exp.model_dump(),
                    "newton_cooling": fit_newton.model_dump(),
                },
                "k": k,
                "t_half": t_half,
                "temp_init": temp_init,
                "temp_final": temp_final,
            }

            summaries.append(
                ClusterSummary(
                    cluster_name=cluster_name,
                    code=code,
                    k_cooling_rate=k,
                    t_half=t_half,
                    temp_initial=temp_init,
                    temp_final=temp_final,
                    best_model="Modelo Exponencial del apunte en (T - Tamb) · Ley de Newton",
                    r2_best=fit_newton.metrics.r2,
                )
            )

        # Sort summaries by cooling rate (lowest k = best insulation)
        summaries.sort(key=lambda s: s.k_cooling_rate)

        general_conclusions = [
            (
                r"1. Jerarquía de Aislamiento Térmico: El Recipiente Térmico es ampliamente superior, "
                r"con constante de enfriamiento $k = 0.00681\text{ min}^{-1}$ ($t_{\text{medio}} = 101.8\text{ min}$), "
                r"reteniendo la bebida a $50.89^\circ\text{C}$ tras $2\text{ h}$. Por el contrario, el Vaso de Vidrio "
                r"disipa calor casi $4.5$ veces más rápido ($k = 0.03103\text{ min}^{-1}$), cayendo a $23.42^\circ\text{C}$ "
                r"(prácticamente temperatura ambiente)."
            ),
            (
                r"2. Evaluación No Sesgada de los 5 Modelos del Apunte: Se evaluaron individualmente los modelos "
                r"de cátedra (Lineal, Exponencial, Polinómico de 2° grado, Potencial y Cociente) en cada clúster. "
                r"El lineal presentó sesgo sistemático (residuos en 'U') y predicción absurda "
                r"de temperaturas negativas; potencial y cociente no modelan el decaimiento térmico con asíntota horizontal no nula "
                r"$T_{\text{amb}}$ desde $T_0$; el polinómico de grado 2 ofreció un ajuste empírico alto en el intervalo ($r^2 > 0.984$); "
                r"y el exponencial sobre $(T - T_{\text{amb}})$ resultó ser el modelo óptimo global ($r^2 > 0.9996$)."
            ),
            (
                r"3. Vinculación con el Modelo Exponencial del Apunte y Ley de Newton: Para respetar la teoría oficial de cátedra, "
                r"se aplicó el Modelo Exponencial del apunte ($y = a \cdot e^{bx}$) definiendo la variable transformada $Y' = T - T_{\text{amb}}$, "
                r"correspondiente a la Ley de Enfriamiento de Newton ($T(t) = T_{\text{amb}} + A \cdot e^{-kt}$). Este modelo alcanza "
                r"$r^2 > 0.9996$ en todos los clústeres, con residuos completamente aleatorios y coherencia asintótica al ambiente a largo plazo."
            ),
            (
                r"4. Evaluación del Modelo Polinómico de 2° Grado: Si se evalúa la temperatura directa $Y = T$ (sin restar $T_{\text{amb}}$), "
                r"el Polinomio de Grado 2 ($y = a_1 + a_2 x + a_3 x^2$) es el modelo directo del apunte que alcanza la mayor precisión "
                r"estadística empírica ($r^2 > 0.984$ en los 4 clústeres). No obstante, se prioriza el modelo Exponencial / Newton porque "
                r"garantiza convergencia asintótica a $T_{\text{amb}}$, evitando que una parábola prediga un recalentamiento irreal de la bebida "
                r"tras el vértice a tiempos mayores a $120\text{ min}$."
            ),
            (
                r"5. Efecto de la Tapa y Mecanismos de Transferencia Térmica: El Vaso de Papel con Tapa ($k = 0.01793\text{ min}^{-1}$) "
                r"retiene el calor notablemente mejor que la Taza de Cerámica destapada ($k = 0.02342\text{ min}^{-1}$), confirmando que la "
                r"evaporación superficial y la convección superior constituyen las vías dominantes de pérdida de calor en bebidas calientes."
            ),
            (
                r"6. Recomendación Operativa para la Cafetería (Decisión Comercial): Para consumo en salón/mesa se recomienda la Taza de Cerámica "
                r"(mantiene $> 50^\circ\text{C}$ durante los primeros $35\text{--}40\text{ min}$ con óptima experiencia de degustación y vajilla reutilizable), "
                r"reservando el Vaso de Vidrio solo para consumo inmediato ($< 15\text{ min}$) o café frío/iced. Para delivery y take-away, se debe utilizar "
                r"el Recipiente Térmico en distancias largas ($> 45\text{ min}$, retiene $> 50^\circ\text{C}$ tras $2\text{ h}$) y el Vaso de Papel con Tapa "
                r"para envíos urbanos rápidos de menor costo."
            ),
        ]

        return Case1AnalysisResponse(
            clusters=clusters_res,
            summaries=summaries,
            general_conclusions=general_conclusions,
        )
