import math
import re
from typing import Any, Dict, List, Tuple

import numpy as np
import sympy as sp
from sympy.parsing.sympy_parser import (
    implicit_multiplication_application,
    parse_expr,
    standard_transformations,
)

from src.core.exceptions import InvalidExpressionError
from src.models.roots import (
    FixedPointPlotData,
    FixedPointRequest,
    FixedPointResponse,
    FixedPointStep,
    NewtonPlotData,
    NewtonRequest,
    NewtonResponse,
    NewtonStep,
)


class RootFindingCalculator:
    def __init__(self):
        self.x = sp.Symbol("x", real=True)
        self.transformations = standard_transformations + (
            implicit_multiplication_application,
        )

    def _parse_expression(self, expr_str: str) -> sp.Expr:
        try:
            clean_expr = (
                expr_str.replace("^", "**")
                .replace("·", "*")
                .replace("cdot", "*")
                .replace("÷", "/")
                .replace("π", "pi")
                .replace("\\ ", " ")
            )

            # Handle pipe notation for absolute value |x| -> abs(x)
            while "|" in clean_expr:
                new_expr = re.sub(r"\|([^|]+)\|", r"abs(\1)", clean_expr)
                if new_expr == clean_expr:
                    break
                clean_expr = new_expr

            # Handle implicit multiplication like 2x -> 2*x or x2 -> x*2
            clean_expr = re.sub(r"([xX])(\d)", r"\1*\2", clean_expr)
            clean_expr = re.sub(r"(\d)([xX])", r"\1*\2", clean_expr)

            # Security check
            if "_" in clean_expr:
                raise InvalidExpressionError(expr_str)

            allowed_names = {
                "x": self.x,
                "sin": sp.sin,
                "cos": sp.cos,
                "tan": sp.tan,
                "asin": sp.asin,
                "acos": sp.acos,
                "atan": sp.atan,
                "sinh": sp.sinh,
                "cosh": sp.cosh,
                "tanh": sp.tanh,
                "exp": sp.exp,
                "e": sp.E,
                "E": sp.E,
                "sqrt": sp.sqrt,
                "pi": sp.pi,
                "log": sp.log,
                "ln": sp.log,
                "abs": sp.Abs,
                "Abs": sp.Abs,
                "Integer": sp.Integer,
                "Float": sp.Float,
                "Rational": sp.Rational,
            }

            parsed = parse_expr(
                clean_expr,
                transformations=self.transformations,
                global_dict={"__builtins__": {}},
                local_dict=allowed_names,
            )
            return parsed
        except Exception:
            raise InvalidExpressionError(expr_str)

    def calculate_newton(self, request: NewtonRequest) -> NewtonResponse:
        f_expr = self._parse_expression(request.expression)
        f_prime_expr = sp.diff(f_expr, self.x)

        latex_f = sp.latex(f_expr)
        latex_f_prime = sp.latex(f_prime_expr)

        f_lambdified = sp.lambdify(self.x, f_expr, modules=["numpy", "math"])
        f_prime_lambdified = sp.lambdify(self.x, f_prime_expr, modules=["numpy", "math"])

        steps: List[NewtonStep] = []
        tangents: List[Dict[str, Any]] = []

        xn = float(request.x0)
        converged = False
        status = "running"
        message = ""

        visited_x = [xn]

        for i in range(1, request.max_iterations + 1):
            try:
                fxn = float(f_lambdified(xn))
                f_prime_xn = float(f_prime_lambdified(xn))
            except Exception as e:
                status = "error"
                message = f"Error al evaluar la función o su derivada en x = {xn:.6g}: {str(e)}"
                break

            if math.isnan(fxn) or math.isinf(fxn):
                status = "diverged"
                message = f"La función diverge o produce un valor indefinido en x = {xn:.6g}."
                break

            if abs(f_prime_xn) < 1e-14:
                status = "derivative_zero"
                message = (
                    f"Derivada casi nula f'({xn:.6g}) ≈ 0 en la iteración {i}. "
                    "El método de Newton falla por división entre cero (recta tangente horizontal)."
                )
                steps.append(
                    NewtonStep(
                        iteration=i,
                        xn=round(xn, 8),
                        fxn=round(fxn, 8),
                        f_prime_xn=round(f_prime_xn, 8),
                        xn_plus_1=round(xn, 8),
                        error_abs=float("inf"),
                        error_rel=None,
                    )
                )
                break

            # Newton formula
            xn_plus_1 = xn - (fxn / f_prime_xn)
            error_abs = abs(xn_plus_1 - xn)
            error_rel = (error_abs / abs(xn_plus_1)) if abs(xn_plus_1) > 1e-12 else None

            # Tangent line details for visualization
            tangent_info = {
                "iteration": i,
                "x_point": xn,
                "y_point": fxn,
                "slope": f_prime_xn,
                "x_intercept": xn_plus_1,
            }
            tangents.append(tangent_info)

            steps.append(
                NewtonStep(
                    iteration=i,
                    xn=round(xn, 8),
                    fxn=round(fxn, 8),
                    f_prime_xn=round(f_prime_xn, 8),
                    xn_plus_1=round(xn_plus_1, 8),
                    error_abs=round(error_abs, 8),
                    error_rel=round(error_rel, 8) if error_rel is not None else None,
                )
            )

            visited_x.append(xn_plus_1)

            if error_abs < request.tolerance or abs(fxn) < request.tolerance:
                converged = True
                status = "converged"
                message = f"Convergencia alcanzada en {i} iteraciones con tolerancia {request.tolerance:.1e}."
                xn = xn_plus_1
                break

            # Check for oscillating 2-cycle
            if len(visited_x) >= 4 and abs(visited_x[-1] - visited_x[-3]) < 1e-7 and abs(visited_x[-2] - visited_x[-4]) < 1e-7:
                status = "oscillation"
                message = (
                    f"Se detectó un ciclo oscilatorio infinito entre x ≈ {visited_x[-1]:.6g} "
                    f"y x ≈ {visited_x[-2]:.6g}. El método no converge hacia una raíz."
                )
                xn = xn_plus_1
                break

            xn = xn_plus_1

        if not converged and status == "running":
            status = "max_iterations_reached"
            message = (
                f"Se alcanzó el número máximo de iteraciones ({request.max_iterations}) "
                f"sin alcanzar la tolerancia {request.tolerance:.1e}."
            )

        final_root = xn if converged else None

        # Build plot data
        min_x = min(visited_x)
        max_x = max(visited_x)
        margin = max(abs(max_x - min_x) * 0.4, 2.0)
        x_start = min_x - margin
        x_end = max_x + margin

        x_grid = np.linspace(x_start, x_end, 300)
        y_grid = []
        valid_x = []
        for val in x_grid:
            try:
                y_val = float(f_lambdified(val))
                if not math.isnan(y_val) and not math.isinf(y_val) and abs(y_val) < 1e6:
                    y_grid.append(y_val)
                    valid_x.append(float(val))
            except Exception:
                continue

        plot_data = NewtonPlotData(
            curve_x=valid_x,
            curve_y=y_grid,
            tangents=tangents,
            roots_x=[final_root] if final_root is not None else [],
            roots_y=[0.0] if final_root is not None else [],
        )

        return NewtonResponse(
            root=round(final_root, 8) if final_root is not None else None,
            converged=converged,
            status=status,
            message=message,
            iterations_count=len(steps),
            steps=steps,
            latex_f=latex_f,
            latex_f_prime=latex_f_prime,
            plot_data=plot_data,
        )

    def calculate_fixed_point(self, request: FixedPointRequest) -> FixedPointResponse:
        g_expr = self._parse_expression(request.g_expression)
        g_prime_expr = sp.diff(g_expr, self.x)

        latex_g = sp.latex(g_expr)
        latex_g_prime = sp.latex(g_prime_expr)

        g_lambdified = sp.lambdify(self.x, g_expr, modules=["numpy", "math"])
        g_prime_lambdified = sp.lambdify(self.x, g_prime_expr, modules=["numpy", "math"])

        steps: List[FixedPointStep] = []
        cobweb_x: List[float] = [float(request.x0)]
        cobweb_y: List[float] = [0.0]

        xn = float(request.x0)
        converged = False
        status = "running"
        message = ""
        visited_x = [xn]
        max_abs_g_prime = 0.0

        for i in range(1, request.max_iterations + 1):
            try:
                gxn = float(g_lambdified(xn))
                g_prime_val = float(g_prime_lambdified(xn))
                max_abs_g_prime = max(max_abs_g_prime, abs(g_prime_val))
            except Exception as e:
                status = "error"
                message = f"Error al evaluar g(x) en x = {xn:.6g}: {str(e)}"
                break

            if math.isnan(gxn) or math.isinf(gxn) or abs(gxn) > 1e12:
                status = "diverged"
                message = f"La iteración de punto fijo diverge en x = {xn:.6g}."
                break

            # Cobweb trajectory: (xn, xn_previous_or_0) -> (xn, gxn) -> (gxn, gxn)
            cobweb_x.extend([xn, gxn])
            cobweb_y.extend([gxn, gxn])

            xn_plus_1 = gxn
            error_abs = abs(xn_plus_1 - xn)
            error_rel = (error_abs / abs(xn_plus_1)) if abs(xn_plus_1) > 1e-12 else None

            steps.append(
                FixedPointStep(
                    iteration=i,
                    xn=round(xn, 8),
                    gxn=round(gxn, 8),
                    xn_plus_1=round(xn_plus_1, 8),
                    error_abs=round(error_abs, 8),
                    error_rel=round(error_rel, 8) if error_rel is not None else None,
                )
            )

            visited_x.append(xn_plus_1)

            if error_abs < request.tolerance:
                converged = True
                status = "converged"
                message = f"Convergencia alcanzada en {i} iteraciones con tolerancia {request.tolerance:.1e}."
                xn = xn_plus_1
                break

            xn = xn_plus_1

        if not converged and status == "running":
            status = "max_iterations_reached"
            message = (
                f"Se alcanzó el número máximo de iteraciones ({request.max_iterations}) "
                f"sin alcanzar la tolerancia {request.tolerance:.1e}."
            )

        final_root = xn if converged else None

        # Build plot data for y = g(x) and y = x
        min_x = min(visited_x)
        max_x = max(visited_x)
        margin = max(abs(max_x - min_x) * 0.4, 2.0)
        x_start = min_x - margin
        x_end = max_x + margin

        x_grid = np.linspace(x_start, x_end, 300)
        y_grid = []
        valid_x = []
        for val in x_grid:
            try:
                y_val = float(g_lambdified(val))
                if not math.isnan(y_val) and not math.isinf(y_val) and abs(y_val) < 1e6:
                    y_grid.append(y_val)
                    valid_x.append(float(val))
            except Exception:
                continue

        plot_data = FixedPointPlotData(
            curve_x=valid_x,
            curve_y=y_grid,
            line_y_eq_x=valid_x,
            cobweb_x=cobweb_x,
            cobweb_y=cobweb_y,
            roots_x=[final_root] if final_root is not None else [],
            roots_y=[final_root] if final_root is not None else [],
        )

        return FixedPointResponse(
            root=round(final_root, 8) if final_root is not None else None,
            converged=converged,
            status=status,
            message=message,
            iterations_count=len(steps),
            steps=steps,
            latex_g=latex_g,
            latex_g_prime=latex_g_prime,
            k_constant_est=round(max_abs_g_prime, 4) if max_abs_g_prime > 0 else None,
            plot_data=plot_data,
        )
