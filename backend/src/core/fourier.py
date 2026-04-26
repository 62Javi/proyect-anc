import sympy as sp
import numpy as np
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application
from typing import List, Dict, Any
from src.models.fourier import FunctionInterval
from src.core.exceptions import InvalidExpressionError, NonIntegrableError


class FourierSeriesCalculator:
    def __init__(self):
        self.x = sp.Symbol("x")
        self.n = sp.Symbol("n", integer=True, positive=True)
        self.transformations = standard_transformations + (implicit_multiplication_application,)

    def _parse_expression(self, expr_str: str):
        try:
            # Replace common MathLive ascii-math and LaTeX artifacts
            clean_expr = (
                expr_str.replace("^", "**")
                .replace("·", "*")
                .replace("cdot", "*")
                .replace("÷", "/")
                .replace("π", "pi")
                .replace("\\ ", " ")
            )
            
            # Handle pipe notation for absolute value |x| -> abs(x)
            import re
            while "|" in clean_expr:
                new_expr = re.sub(r"\|([^|]+)\|", r"abs(\1)", clean_expr)
                if new_expr == clean_expr:
                    break
                clean_expr = new_expr
            
            # Security check to prevent dunder method access
            if "_" in clean_expr:
                raise InvalidExpressionError(expr_str)
            
            # Security: Restrict global and local dicts to prevent RCE
            # Allow specific mathematical functions, symbols and base types
            allowed_names = {
                "x": self.x,
                "n": self.n,
                "sin": sp.sin,
                "cos": sp.cos,
                "tan": sp.tan,
                "exp": sp.exp,
                "sqrt": sp.sqrt,
                "pi": sp.pi,
                "log": sp.log,
                "abs": sp.Abs,
                "Integer": sp.Integer,
                "Float": sp.Float,
                "Rational": sp.Rational,
            }
            
            return parse_expr(
                clean_expr, 
                transformations=self.transformations,
                global_dict={"__builtins__": {}},  # Disable built-ins like __import__
                local_dict=allowed_names
            )
        except Exception:
            raise InvalidExpressionError(expr_str)

    def detect_symmetry(self, intervals: List[FunctionInterval]) -> str:
        # Simplistic symmetry detection for symmetric intervals around 0
        # For piecewise, we need to build the full function first
        if len(intervals) == 1:
            interval = intervals[0]
            if abs(interval.start + interval.end) < 1e-9:
                f = self._parse_expression(interval.expression)
                f_neg = f.subs(self.x, -self.x)
                if sp.simplify(f - f_neg) == 0:
                    return "Par"
                if sp.simplify(f + f_neg) == 0:
                    return "Impar"
        return "Ninguna"

    def calculate_coefficients(
        self, intervals: List[FunctionInterval], harmonics: int
    ) -> Dict[str, Any]:
        # Determine period T and L
        start = min(i.start for i in intervals)
        end = max(i.end for i in intervals)
        T = end - start
        L = T / 2

        # Build Piecewise function if needed
        pw_args = []
        for i in intervals:
            f = self._parse_expression(i.expression)
            pw_args.append((f, (self.x >= i.start) & (self.x <= i.end)))

        f_pw = sp.Piecewise(*pw_args)

        try:
            # a0 calculation
            a0_sym = (1 / L) * sp.integrate(f_pw, (self.x, start, end))

            # an and bn as formulas (symbolic n)
            an_sym = (1 / L) * sp.integrate(
                f_pw * sp.cos(self.n * sp.pi * self.x / L), (self.x, start, end)
            )
            bn_sym = (1 / L) * sp.integrate(
                f_pw * sp.sin(self.n * sp.pi * self.x / L), (self.x, start, end)
            )

            # Simplify and convert floats to exact rational fractions
            a0_sym = sp.nsimplify(sp.simplify(a0_sym))
            an_sym = sp.nsimplify(sp.simplify(an_sym))
            bn_sym = sp.nsimplify(sp.simplify(bn_sym))

            return {
                "a0": sp.latex(a0_sym),
                "an": sp.latex(an_sym),
                "bn": sp.latex(bn_sym),
                "a0_val": float(a0_sym.evalf()) if a0_sym.is_number else 0.0,
                "an_expr": an_sym,
                "bn_expr": bn_sym,
                "L": L,
                "f_sym": f_pw,
                "start": start,
                "end": end,
            }
        except Exception as e:
            raise NonIntegrableError(str(e))

    def calculate_convergence(
        self, coeff_data: Dict[str, Any], points: List[float]
    ) -> List[Dict[str, Any]]:
        f_sym = coeff_data["f_sym"]
        start = float(coeff_data["start"])
        end = float(coeff_data["end"])
        T = end - start
        
        results = []
        for x0 in points:
            # Map x0 to base interval [start, end)
            x_base = ((x0 - start) % T) + start
            
            try:
                # Use a small epsilon to avoid issues with Piecewise at exact boundaries
                # and help limit detection
                if abs(x_base - start) < 1e-7:
                    f_right = f_sym.limit(self.x, start, "+")
                    f_left = f_sym.limit(self.x, end, "-")
                else:
                    f_right = f_sym.limit(self.x, x_base, "+")
                    f_left = f_sym.limit(self.x, x_base, "-")
                
                conv_val = (f_right + f_left) / 2
                
                # Format formula according to Dirichlet Theorem for Fourier Series
                # S_f(x) is the standard notation for the value of the Fourier series at x
                latex_val = sp.latex(sp.nsimplify(conv_val))
                formula = f"S_f({x0}) = \\frac{{f({x0}^+) + f({x0}^-)}}{{2}} = {latex_val}"
                
                results.append({
                    "x": float(x0),
                    "value": float(conv_val.evalf()),
                    "formula": formula
                })
            except Exception as e:
                # Fallback to direct evaluation if limit fails
                try:
                    val = float(f_sym.subs(self.x, x_base).evalf())
                    results.append({
                        "x": float(x0),
                        "value": val,
                        "formula": f"S_f({x0}) \\approx {val:.4f}"
                    })
                except:
                    continue
        return results

    def evaluate_plot_data(
        self, coeff_data: Dict[str, Any], harmonics: int, num_points: int, periods: int = 1
    ) -> Dict[str, List[float]]:
        L = coeff_data["L"]
        an_expr = coeff_data["an_expr"]
        bn_expr = coeff_data["bn_expr"]
        a0_val = coeff_data["a0_val"]
        f_sym = coeff_data["f_sym"]
        start = float(coeff_data["start"])
        end = float(coeff_data["end"])
        T = end - start

        # Expand range based on periods
        # We'll center it around the original interval if possible
        # or just start from 'start' and go for N periods
        plot_start = start
        plot_end = start + (T * periods)
        
        x_vals = np.linspace(plot_start, plot_end, num_points)

        # lambdify original function with periodic extension
        f_func = sp.lambdify(self.x, f_sym, modules=["numpy"])
        try:
            # Periodic extension: map x to the [start, end] interval
            x_periodic = (x_vals - start) % T + start
            y_original = f_func(x_periodic)
            # Ensure it's a numeric array, not scalar or object array
            if np.isscalar(y_original):
                y_original = np.full_like(x_vals, float(y_original))
            else:
                y_original = np.array(y_original, dtype=float)
        except Exception:
            y_original = np.zeros_like(x_vals)

        # Summation for partial sum
        y_approx = np.full_like(x_vals, float(a0_val / 2.0))

        # Vectorized evaluation for an and bn
        for n_val in range(1, harmonics + 1):
            try:
                an_val = float(an_expr.subs(self.n, n_val).evalf())
                bn_val = float(bn_expr.subs(self.n, n_val).evalf())

                y_approx += an_val * np.cos(n_val * np.pi * x_vals / L)
                y_approx += bn_val * np.sin(n_val * np.pi * x_vals / L)
            except Exception:
                continue

        return {
            "x": x_vals.tolist(),
            "y_original": y_original.tolist(),
            "y_approx": y_approx.tolist(),
        }
