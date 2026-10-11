import math
import re
from typing import Any, Dict, List, Optional, Tuple, Union

import numpy as np
import sympy as sp
from sympy.parsing.sympy_parser import (
    implicit_multiplication_application,
    parse_expr,
    standard_transformations,
)

from src.core.exceptions import InvalidExpressionError
from src.models.taylor import (
    ComparisonMethodResult,
    DerivativeInfo,
    TaylorPlotData,
    TaylorRequest,
    TaylorResponse,
    TaylorStep,
)


class TaylorODECalculator:
    def __init__(self):
        self.transformations = standard_transformations + (
            implicit_multiplication_application,
        )

    def _parse_scalar(self, val: Union[float, int, str], name: str = "valor") -> float:
        if isinstance(val, (int, float)):
            return float(val)
        try:
            return float(val)
        except (ValueError, TypeError):
            pass
        try:
            parsed = self._parse_symbolic(str(val))
            return float(parsed.evalf())
        except Exception:
            raise InvalidExpressionError(f"Valor numérico inválido para {name}: {val}")

    def _parse_symbolic(self, expr_str: str) -> sp.Expr:
        clean = (
            str(expr_str)
            .replace("^", "**")
            .replace("·", "*")
            .replace("⋅", "*")
            .replace("÷", "/")
            .replace("π", "pi")
        )
        allowed_names = {
            "pi": sp.pi,
            "E": sp.E,
            "e": sp.E,
            "exp": sp.exp,
            "sin": sp.sin,
            "sen": sp.sin,
            "cos": sp.cos,
            "tan": sp.tan,
            "tg": sp.tan,
            "sqrt": sp.sqrt,
            "log": sp.log,
            "ln": sp.log,
            "abs": sp.Abs,
        }
        return parse_expr(clean, local_dict=allowed_names, transformations=self.transformations)

    def _clean_ode_expression(self, expr_str: str) -> str:
        s = (
            str(expr_str)
            .replace("^", "**")
            .replace("·", "*")
            .replace("⋅", "*")
            .replace("÷", "/")
            .replace("π", "pi")
            .replace("sen", "sin")
            .replace("tg", "tan")
        )
        if "_" in s:
            raise InvalidExpressionError("Variables con guión bajo no permitidas")
        return s

    def _parse_ode_function(
        self, expr_str: str, x_sym: sp.Symbol, y_sym: sp.Symbol
    ) -> sp.Expr:
        clean = self._clean_ode_expression(expr_str)
        allowed_names = {
            x_sym.name: x_sym,
            y_sym.name: y_sym,
            "x": x_sym if x_sym.name == "x" else sp.Symbol("x", real=True),
            "t": x_sym if x_sym.name == "t" else sp.Symbol("t", real=True),
            "y": y_sym,
            "pi": sp.pi,
            "E": sp.E,
            "e": sp.E,
            "exp": sp.exp,
            "sin": sp.sin,
            "cos": sp.cos,
            "tan": sp.tan,
            "sqrt": sp.sqrt,
            "log": sp.log,
            "ln": sp.log,
            "abs": sp.Abs,
        }
        try:
            parsed = parse_expr(clean, local_dict=allowed_names, transformations=self.transformations)
            # Remap any 'x' or 't' to x_sym if needed
            subs_map = {}
            for atom in parsed.free_symbols:
                if atom.name in ("x", "t") and atom.name != x_sym.name:
                    subs_map[atom] = x_sym
                elif atom.name == "y" and y_sym.name != "y":
                    subs_map[atom] = y_sym
            if subs_map:
                parsed = parsed.subs(subs_map)
            return parsed
        except Exception as e:
            raise InvalidExpressionError(f"Error al analizar la función f({x_sym.name}, {y_sym.name}): {expr_str} ({e})")

    def compute_derivatives(
        self, f_expr: sp.Expr, x_sym: sp.Symbol, y_sym: sp.Symbol, max_order: int = 4
    ) -> List[DerivativeInfo]:
        """
        Calcula las derivadas sucesivas de y respecto a x:
        y' = f(x, y)
        y'' = ∂f/∂x + ∂f/∂y * y' = ∂f/∂x + ∂f/∂y * f(x, y)
        y''' = ∂(y'')/∂x + ∂(y'')/∂y * f(x, y)
        y'''' = ∂(y''')/∂x + ∂(y''')/∂y * f(x, y)
        """
        derivatives: List[DerivativeInfo] = []
        labels = ["y'", 'y\'\'', 'y\'\'\'', "y^{(4)}"]

        current_deriv = f_expr
        for order in range(1, max_order + 1):
            simplified = sp.simplify(current_deriv)
            latex_code = sp.latex(simplified)
            label = labels[order - 1]
            derivatives.append(
                DerivativeInfo(
                    order=order,
                    order_label=label,
                    symbolic_expr=str(simplified),
                    latex=latex_code,
                )
            )

            if order < max_order:
                # Regla de la cadena: D_next = ∂(D_curr)/∂x + ∂(D_curr)/∂y * f(x, y)
                df_dx = sp.diff(current_deriv, x_sym)
                df_dy = sp.diff(current_deriv, y_sym)
                next_deriv = df_dx + df_dy * f_expr
                current_deriv = sp.simplify(next_deriv)

        return derivatives

    def build_generic_formula_latex(
        self, derivatives: List[DerivativeInfo], order: int, x_name: str, y_name: str
    ) -> str:
        """
        Construye la expresión LaTeX para la Ordenada Genérica y_{n+1} al estilo Amiconi.
        y_{n+1} = y_n + h*y'_n + (h^2/2!)*y''_n + ...
        """
        terms = [f"{y_name}_n"]
        if order >= 1:
            terms.append(f"h \\cdot \\left[{derivatives[0].latex}\\right]_n")
        if order >= 2:
            terms.append(f"\\frac{{h^2}}{{2!}} \\cdot \\left[{derivatives[1].latex}\\right]_n")
        if order >= 3:
            terms.append(f"\\frac{{h^3}}{{3!}} \\cdot \\left[{derivatives[2].latex}\\right]_n")
        if order >= 4:
            terms.append(f"\\frac{{h^4}}{{4!}} \\cdot \\left[{derivatives[3].latex}\\right]_n")

        return f"{y_name}_{{n+1}} = " + " + ".join(terms)

    def solve_exact_ode(
        self, f_expr: sp.Expr, x_sym: sp.Symbol, y_sym: sp.Symbol, x0: float, y0: float
    ) -> Tuple[Optional[sp.Expr], Optional[str]]:
        """
        Intenta resolver analíticamente la EDO de valor inicial con SymPy dsolve.
        """
        try:
            y_func = sp.Function(y_sym.name)(x_sym)
            f_subs = f_expr.subs({y_sym: y_func})
            ode = sp.Eq(y_func.diff(x_sym), f_subs)
            
            # Intentar con condición inicial
            sol = sp.dsolve(ode, y_func, ics={y_func.subs(x_sym, x0): y0})
            if hasattr(sol, "rhs"):
                exact_expr = sol.rhs
                exact_latex = f"{y_sym.name}({x_sym.name}) = " + sp.latex(exact_expr)
                return exact_expr, exact_latex
            elif isinstance(sol, list) and len(sol) > 0 and hasattr(sol[0], "rhs"):
                exact_expr = sol[0].rhs
                exact_latex = f"{y_sym.name}({x_sym.name}) = " + sp.latex(exact_expr)
                return exact_expr, exact_latex
        except Exception:
            pass

        # Intento sin ics y buscando constante C1
        try:
            y_func = sp.Function(y_sym.name)(x_sym)
            f_subs = f_expr.subs({y_sym: y_func})
            ode = sp.Eq(y_func.diff(x_sym), f_subs)
            sol = sp.dsolve(ode, y_func)
            if hasattr(sol, "rhs"):
                c_symbols = sol.rhs.free_symbols - {x_sym}
                if len(c_symbols) == 1:
                    c = list(c_symbols)[0]
                    c_eq = sp.Eq(sol.rhs.subs(x_sym, x0), y0)
                    c_vals = sp.solve(c_eq, c)
                    if c_vals:
                        exact_expr = sp.simplify(sol.rhs.subs(c, c_vals[0]))
                        exact_latex = f"{y_sym.name}({x_sym.name}) = " + sp.latex(exact_expr)
                        return exact_expr, exact_latex
        except Exception:
            pass

        return None, None

    def solve(self, req: TaylorRequest) -> TaylorResponse:
        x_name = req.x_var.strip() or "x"
        y_name = req.y_var.strip() or "y"
        x_sym = sp.Symbol(x_name, real=True)
        y_sym = sp.Symbol(y_name, real=True)

        x0 = self._parse_scalar(req.x0, "x0")
        y0 = self._parse_scalar(req.y0, "y0")
        xf = self._parse_scalar(req.xf, "xf")

        if xf <= x0:
            raise InvalidExpressionError(f"El punto final ({xf}) debe ser mayor que el inicial ({x0})")

        # Determinar h y n_steps
        if req.h is not None and req.h > 0:
            h = float(req.h)
            calc_steps = (xf - x0) / h
            n_steps = int(round(calc_steps))
            # Ajustar h si hay mínima discrepancia de redondeo
            if abs(x0 + n_steps * h - xf) > 1e-7:
                # Si el usuario pasó h y no coincide exactamente, ajustamos o permitimos
                h = (xf - x0) / n_steps if n_steps > 0 else req.h
        elif req.n_steps is not None and req.n_steps > 0:
            n_steps = int(req.n_steps)
            h = (xf - x0) / n_steps
        else:
            n_steps = 3
            h = (xf - x0) / n_steps

        if n_steps <= 0 or n_steps > 1000:
            raise InvalidExpressionError("El número de iteraciones debe estar entre 1 y 1000")

        order = max(1, min(4, req.order))

        # Parsear función diferencial
        f_expr = self._parse_ode_function(req.expression, x_sym, y_sym)

        # Derivadas sucesivas
        derivatives_info = self.compute_derivatives(f_expr, x_sym, y_sym, max_order=order)
        generic_formula_latex = self.build_generic_formula_latex(
            derivatives_info, order, x_name, y_name
        )

        # Solución exacta si existe
        exact_expr, exact_latex = self.solve_exact_ode(f_expr, x_sym, y_sym, x0, y0)
        has_exact = exact_expr is not None

        # Lambdify derivadas para evaluación rápida
        lambdified_derivs = [
            sp.lambdify((x_sym, y_sym), sp.parse_expr(d.symbolic_expr), modules=["math", "numpy"])
            for d in derivatives_info
        ]

        # Lambdify exact function si existe
        exact_fn = None
        if has_exact:
            try:
                exact_fn = sp.lambdify(x_sym, exact_expr, modules=["math", "numpy"])
            except Exception:
                has_exact = False
                exact_latex = None

        # Iteración de Taylor
        steps: List[TaylorStep] = []
        current_x = x0
        current_y = y0

        factorials = [1, 1, 2, 6, 24]

        amiconi_summary = [
            f"Ecuación diferencial: {y_name}' = {req.expression}",
            f"Condición inicial: {y_name}({x0}) = {y0}  ==>  {x_name}_0 = {x0}, {y_name}_0 = {y0}",
            f"Intervalo de trabajo: [{x0}, {xf}], con paso h = {h}",
            f"Cantidad de iteraciones a realizar: N = ({xf} - {x0}) / {h} = {n_steps}",
            f"Método aplicado: Taylor de Orden {order}",
        ]

        discrete_points: List[Dict[str, float]] = [
            {"step": 0, "x": current_x, "y": current_y}
        ]

        for n in range(n_steps):
            xn_val = current_x
            yn_val = current_y

            # Evaluar derivadas en (xn, yn)
            deriv_vals: List[float] = []
            for k in range(order):
                try:
                    val_k = float(lambdified_derivs[k](xn_val, yn_val))
                except Exception:
                    # Fallback simbólico
                    val_k = float(
                        sp.parse_expr(derivatives_info[k].symbolic_expr)
                        .subs({x_sym: xn_val, y_sym: yn_val})
                        .evalf()
                    )
                deriv_vals.append(val_k)

            # Calcular yn+1 por Taylor
            increment = 0.0
            for k in range(1, order + 1):
                increment += ((h**k) / factorials[k]) * deriv_vals[k - 1]

            yn_next = yn_val + increment
            xn_next = x0 + (n + 1) * h

            # Comparar con exacta si existe
            y_exact_val: Optional[float] = None
            err_abs: Optional[float] = None
            err_rel: Optional[float] = None

            if has_exact and exact_fn is not None:
                try:
                    y_exact_val = float(exact_fn(xn_next))
                    err_abs = abs(yn_next - y_exact_val)
                    if abs(y_exact_val) > 1e-12:
                        err_rel = (err_abs / abs(y_exact_val)) * 100.0
                    else:
                        err_rel = 0.0
                except Exception:
                    pass

            # Explicación estilo Amiconi
            # Construir texto detallado y LaTeX
            step_word = "Primer" if n == 0 else ("Segunda" if n == 1 else ("Tercer" if n == 2 else f"{n+1}ª"))
            
            terms_latex_eval = [f"{round(yn_val, 6)}"]
            terms_text_eval = [f"{yn_val:.6g}"]
            for k in range(1, order + 1):
                dk_val = deriv_vals[k - 1]
                h_pow = h**k
                fact_k = factorials[k]
                if fact_k == 1:
                    terms_latex_eval.append(f"{h} \\cdot ({round(dk_val, 6)})")
                    terms_text_eval.append(f"{h} * ({dk_val:.6g})")
                else:
                    terms_latex_eval.append(f"\\frac{{{h}^{{{k}}}}}{{{fact_k}!}} \\cdot ({round(dk_val, 6)})")
                    terms_text_eval.append(f"({h}^{k}/{fact_k}!) * ({dk_val:.6g})")

            explanation_latex = (
                f"{y_name}_{{{n+1}}} = "
                + " + ".join(terms_latex_eval)
                + f" = {round(yn_next, 6)}"
            )

            remaining = n_steps - (n + 1)
            rem_text = (
                f"Llegamos al final del intervalo (${x_name}_f = {xn_next:.4g}$), el cálculo concluye aquí."
                if remaining == 0
                else f"Aún faltan {remaining} iteración{'es' if remaining > 1 else ''} para alcanzar ${x_name}_f = {xf}$."
            )

            explanation_text = (
                f"• {step_word} iteración: $n = {n}$\n"
                f"Parados en ${x_name}_{n} = {xn_val:.4g}$, ${y_name}_{n} = {yn_val:.6g}$.\n"
                + "\n".join([f"  ${derivatives_info[k].order_label}_{n} = {deriv_vals[k]:.6g}$" for k in range(order)])
                + f"\nReemplazando en la Ordenada Genérica:\n"
                f"  ${y_name}_{{{n+1}}} = " + " + ".join(terms_text_eval) + f" = {yn_next:.6g}$\n"
                f"Esto se lee así: el valor aproximado es ${y_name}({xn_next:.4g}) \\approx {yn_next:.6g}$.\n"
                f"{rem_text}"
            )

            step_obj = TaylorStep(
                step=n + 1,
                xn=round(xn_val, 6),
                yn=round(yn_val, 6),
                derivatives_values=[round(v, 6) for v in deriv_vals],
                yn_plus_1=round(yn_next, 6),
                y_exact=round(y_exact_val, 6) if y_exact_val is not None else None,
                error_abs=round(err_abs, 6) if err_abs is not None else None,
                error_rel=round(err_rel, 4) if err_rel is not None else None,
                explanation_latex=explanation_latex,
                explanation_text=explanation_text,
            )
            steps.append(step_obj)

            # Avanzar estado
            current_x = xn_next
            current_y = yn_next
            discrete_points.append({"step": n + 1, "x": current_x, "y": current_y})

        # Multi-Method Comparison (Taylor 1..4, Euler Mejorado, RK2)
        comparison_methods = self._compute_comparison_methods(
            f_expr=f_expr,
            derivatives_info=derivatives_info,
            x_sym=x_sym,
            y_sym=y_sym,
            x0=x0,
            y0=y0,
            xf=xf,
            h=h,
            n_steps=n_steps,
            exact_fn=exact_fn,
        )

        # Construir curvas de Plot Data
        plot_data = self._generate_plot_data(
            steps=steps,
            x0=x0,
            xf=xf,
            exact_fn=exact_fn,
            discrete_points=discrete_points,
        )

        final_approx = steps[-1].yn_plus_1 if steps else y0
        final_exact = steps[-1].y_exact if (steps and steps[-1].y_exact is not None) else None
        final_err_abs = steps[-1].error_abs if (steps and steps[-1].error_abs is not None) else None
        final_err_rel = steps[-1].error_rel if (steps and steps[-1].error_rel is not None) else None

        return TaylorResponse(
            expression=req.expression,
            x_var=x_name,
            y_var=y_name,
            x0=x0,
            y0=y0,
            xf=xf,
            h=h,
            n_steps=n_steps,
            order=order,
            derivatives=derivatives_info,
            generic_formula_latex=generic_formula_latex,
            exact_solution_latex=exact_latex,
            has_exact_solution=has_exact,
            final_approx_value=final_approx,
            final_exact_value=final_exact,
            final_error_abs=final_err_abs,
            final_error_rel=final_err_rel,
            steps=steps,
            comparison_methods=comparison_methods,
            plot_data=plot_data,
            amiconi_summary=amiconi_summary,
        )

    def _compute_comparison_methods(
        self,
        f_expr: sp.Expr,
        derivatives_info: List[DerivativeInfo],
        x_sym: sp.Symbol,
        y_sym: sp.Symbol,
        x0: float,
        y0: float,
        xf: float,
        h: float,
        n_steps: int,
        exact_fn: Any,
    ) -> List[ComparisonMethodResult]:
        """
        Calcula la comparación entre:
        - Taylor Orden 1 (Euler)
        - Taylor Orden 2
        - Taylor Orden 3 (si está disponible)
        - Euler Mejorado (Heun)
        - Runge-Kutta de grado 2 (Punto Medio / Amiconi)
        """
        f_num = sp.lambdify((x_sym, y_sym), f_expr, modules=["math", "numpy"])

        # 1. Euler (Taylor Ord 1)
        euler_xs = [x0]
        euler_ys = [y0]
        cur_y = y0
        for i in range(n_steps):
            cx = x0 + i * h
            cur_y = cur_y + h * float(f_num(cx, cur_y))
            euler_xs.append(x0 + (i + 1) * h)
            euler_ys.append(cur_y)

        # 2. Euler Mejorado
        heun_xs = [x0]
        heun_ys = [y0]
        cur_y = y0
        for i in range(n_steps):
            cx = x0 + i * h
            nx = x0 + (i + 1) * h
            k1 = float(f_num(cx, cur_y))
            k2 = float(f_num(nx, cur_y + h * k1))
            cur_y = cur_y + (h / 2.0) * (k1 + k2)
            heun_xs.append(nx)
            heun_ys.append(cur_y)

        # 3. Runge-Kutta 2 (Amiconi / Punto Medio)
        # k1 = h * f(xn, yn)
        # yn+1 = yn + h * f(xn + h/2, yn + k1/2)
        rk2_xs = [x0]
        rk2_ys = [y0]
        cur_y = y0
        for i in range(n_steps):
            cx = x0 + i * h
            nx = x0 + (i + 1) * h
            k1 = h * float(f_num(cx, cur_y))
            cur_y = cur_y + h * float(f_num(cx + h / 2.0, cur_y + k1 / 2.0))
            rk2_xs.append(nx)
            rk2_ys.append(cur_y)

        # 4. Taylor Orden 2
        d1_num = f_num
        d2_expr = sp.parse_expr(derivatives_info[1].symbolic_expr) if len(derivatives_info) >= 2 else (
            sp.diff(f_expr, x_sym) + sp.diff(f_expr, y_sym) * f_expr
        )
        d2_num = sp.lambdify((x_sym, y_sym), d2_expr, modules=["math", "numpy"])

        taylor2_xs = [x0]
        taylor2_ys = [y0]
        cur_y = y0
        for i in range(n_steps):
            cx = x0 + i * h
            nx = x0 + (i + 1) * h
            y_prime = float(d1_num(cx, cur_y))
            y_double = float(d2_num(cx, cur_y))
            cur_y = cur_y + h * y_prime + ((h**2) / 2.0) * y_double
            taylor2_xs.append(nx)
            taylor2_ys.append(cur_y)

        results: List[ComparisonMethodResult] = []

        def make_res(name: str, order: int, xs: List[float], ys: List[float]) -> ComparisonMethodResult:
            final_val = ys[-1]
            err_abs = None
            err_rel = None
            if exact_fn is not None:
                try:
                    exact_val = float(exact_fn(xs[-1]))
                    err_abs = abs(final_val - exact_val)
                    if abs(exact_val) > 1e-12:
                        err_rel = (err_abs / abs(exact_val)) * 100.0
                except Exception:
                    pass
            return ComparisonMethodResult(
                name=name,
                order=order,
                points_x=[round(x, 6) for x in xs],
                points_y=[round(y, 6) for y in ys],
                final_value=round(final_val, 6),
                final_error_abs=round(err_abs, 6) if err_abs is not None else None,
                final_error_rel=round(err_rel, 4) if err_rel is not None else None,
            )

        results.append(make_res("Euler (Taylor Ord 1)", 1, euler_xs, euler_ys))
        results.append(make_res("Taylor Orden 2", 2, taylor2_xs, taylor2_ys))
        results.append(make_res("Euler Mejorado (Heun)", 2, heun_xs, heun_ys))
        results.append(make_res("Runge-Kutta 2 (Amiconi)", 2, rk2_xs, rk2_ys))

        return results

    def _generate_plot_data(
        self,
        steps: List[TaylorStep],
        x0: float,
        xf: float,
        exact_fn: Any,
        discrete_points: List[Dict[str, float]],
    ) -> TaylorPlotData:
        approx_x = [p["x"] for p in discrete_points]
        approx_y = [p["y"] for p in discrete_points]

        exact_x: Optional[List[float]] = None
        exact_y: Optional[List[float]] = None
        error_x: Optional[List[float]] = None
        error_y: Optional[List[float]] = None

        if exact_fn is not None:
            dense_xs = np.linspace(x0, xf, 150)
            dense_ys: List[float] = []
            valid = True
            for gx in dense_xs:
                try:
                    gy = float(exact_fn(gx))
                    if math.isnan(gy) or math.isinf(gy):
                        valid = False
                        break
                    dense_ys.append(gy)
                except Exception:
                    valid = False
                    break
            if valid:
                exact_x = [round(float(x), 5) for x in dense_xs]
                exact_y = [round(float(y), 5) for y in dense_ys]

            # Curva de error absoluto en los puntos discretos
            error_x = [s.xn for s in steps]
            error_y = [s.error_abs for s in steps if s.error_abs is not None]

        return TaylorPlotData(
            approx_x=approx_x,
            approx_y=approx_y,
            exact_x=exact_x,
            exact_y=exact_y,
            discrete_points=discrete_points,
            error_x=error_x,
            error_y=error_y,
        )
