from typing import Any, Dict, List

import numpy as np
import sympy as sp
from sympy.parsing.sympy_parser import (
    implicit_multiplication_application,
    parse_expr,
    standard_transformations,
)

from src.core.exceptions import InvalidExpressionError, NonIntegrableError
from src.models.fourier import FunctionInterval


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
            
            # Handle implicit multiplication for cases like x3 -> x*3
            # and ensure numbers before variables are handled if implicit_multiplication fails
            import re
            clean_expr = re.sub(r"([xXnN])(\d)", r"\1*\2", clean_expr)
            clean_expr = re.sub(r"(\d)([xXnN])", r"\1*\2", clean_expr)
            
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
        # Parse limits first
        numeric_intervals = []
        for i in intervals:
            try:
                s = float(self._parse_expression(i.start).evalf())
                e = float(self._parse_expression(i.end).evalf())
                numeric_intervals.append((s, e))
            except: continue

        if not numeric_intervals: return "Ninguna"

        # Check if the total range is symmetric around 0
        start = min(ni[0] for ni in numeric_intervals)
        end = max(ni[1] for ni in numeric_intervals)
        
        if abs(start + end) > 1e-9:
            return "Ninguna"

        # Build the full function for comparison
        pw_args = []
        for idx, i in enumerate(intervals):
            try:
                f = self._parse_expression(i.expression)
                s, e = numeric_intervals[idx]
                pw_args.append((f, (self.x >= s) & (self.x <= e)))
            except: continue
            
        if not pw_args: return "Ninguna"
        
        f_pw = sp.Piecewise(*pw_args)
        
        try:
            # Numerical symmetry check with points unlikely to be boundaries
            test_points = [0.123, 0.456, 0.789]
            is_even = True
            is_odd = True
            
            for p in test_points:
                # Scaled points to fit L if needed, but start/end is safer
                val_p = float(f_pw.subs(self.x, p).evalf())
                val_neg_p = float(f_pw.subs(self.x, -p).evalf())
                
                if abs(val_p - val_neg_p) > 1e-6:
                    is_even = False
                if abs(val_p + val_neg_p) > 1e-6:
                    is_odd = False
            
            if is_even: return "Par"
            if is_odd: return "Impar"
        except:
            pass
            
        return "Ninguna"

    def calculate_coefficients(
        self, intervals: List[FunctionInterval], harmonics: int
    ) -> Dict[str, Any]:
        # Parse limits and build piecewise args
        parsed_intervals = []
        for i in intervals:
            s = float(self._parse_expression(i.start).evalf())
            e = float(self._parse_expression(i.end).evalf())
            f = self._parse_expression(i.expression)
            parsed_intervals.append({"f": f, "start": s, "end": e})

        # Determine period T and L
        start = min(pi["start"] for pi in parsed_intervals)
        end = max(pi["end"] for pi in parsed_intervals)
        T = end - start
        L = T / 2

        # Build Piecewise function
        pw_args = []
        for pi in parsed_intervals:
            pw_args.append((pi["f"], (self.x >= pi["start"]) & (self.x <= pi["end"])))

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
        eps = sp.Symbol('eps', positive=True)
        for x0 in points:
            # Map x0 to base interval [start, end)
            x_base = ((x0 - start) % T) + start
            
            try:
                # Use a symbolic epsilon to evaluate limits of Piecewise safely
                if abs(x_base - start) < 1e-7:
                    f_right = f_sym.subs(self.x, start + eps).limit(eps, 0, "+")
                    f_left = f_sym.subs(self.x, end - eps).limit(eps, 0, "+")
                else:
                    f_right = f_sym.subs(self.x, x_base + eps).limit(eps, 0, "+")
                    f_left = f_sym.subs(self.x, x_base - eps).limit(eps, 0, "+")
                
                conv_val = (f_right + f_left) / 2
                
                # Format formula according to Dirichlet Theorem for Fourier Series
                # S_f(x) is the standard notation for the value of the Fourier series at x
                # Format x0 to remove .0 if it is an integer
                x_fmt = f"{x0:g}"
                latex_val = sp.latex(sp.nsimplify(conv_val))
                formula = f"S_f({x_fmt}) = \\frac{{f({x_fmt}^+) + f({x_fmt}^-)}}{{2}} = {latex_val}"
                
                results.append({
                    "x": float(x0),
                    "value": float(conv_val.evalf()),
                    "formula": formula
                })
            except Exception:
                # Fallback to direct evaluation if limit fails
                try:
                    val = float(f_sym.subs(self.x, x_base).evalf())
                    x_fmt = f"{x0:g}"
                    val_fmt = f"{val:g}"
                    results.append({
                        "x": float(x0),
                        "value": val,
                        "formula": f"S_f({x_fmt}) \\approx {val_fmt}"
                    })
                except:
                    continue
        return results

    def _get_numeric_harmonics(self, coeff_data: Dict[str, Any], max_n: int):
        if "an_vals" in coeff_data and len(coeff_data["an_vals"]) >= max_n:
            return coeff_data["an_vals"][:max_n], coeff_data["bn_vals"][:max_n]
            
        an_expr = coeff_data["an_expr"]
        bn_expr = coeff_data["bn_expr"]
        
        n_array = np.arange(1, max_n + 1)
        an_vals = np.zeros(max_n)
        bn_vals = np.zeros(max_n)
        
        if "an_func" not in coeff_data:
            coeff_data["an_func"] = sp.lambdify(self.n, an_expr, modules=["numpy"])
            coeff_data["bn_func"] = sp.lambdify(self.n, bn_expr, modules=["numpy"])
        
        an_func = coeff_data["an_func"]
        bn_func = coeff_data["bn_func"]
        
        try:
            an_res = an_func(n_array)
            bn_res = bn_func(n_array)
            
            # Prevent SymPy objects from sneaking into the NumPy array
            if isinstance(an_res, np.ndarray) and an_res.dtype == object:
                raise ValueError("an_func returned an object array")
            if isinstance(bn_res, np.ndarray) and bn_res.dtype == object:
                raise ValueError("bn_func returned an object array")
                
            if np.isscalar(an_res):
                an_vals = np.full(max_n, float(an_res))
            else:
                an_vals = np.array(an_res, dtype=float)
                
            if np.isscalar(bn_res):
                bn_vals = np.full(max_n, float(bn_res))
            else:
                bn_vals = np.array(bn_res, dtype=float)
        except Exception:
            # Fallback for complex symbolic expressions that fail with array inputs
            for i, n_val in enumerate(range(1, max_n + 1)):
                try:
                    an_vals[i] = float(an_func(n_val))
                except Exception:
                    try:
                        an_vals[i] = float(an_expr.subs(self.n, n_val).evalf())
                    except:
                        pass
                        
                try:
                    bn_vals[i] = float(bn_func(n_val))
                except Exception:
                    try:
                        bn_vals[i] = float(bn_expr.subs(self.n, n_val).evalf())
                    except:
                        pass
                        
        coeff_data["an_vals"] = an_vals
        coeff_data["bn_vals"] = bn_vals
        return an_vals, bn_vals

    def evaluate_plot_data(
        self, coeff_data: Dict[str, Any], harmonics: int, num_points: int, periods: int = 1
    ) -> Dict[str, List[float]]:
        L = coeff_data["L"]
        a0_val = coeff_data["a0_val"]
        f_sym = coeff_data["f_sym"]
        start = float(coeff_data["start"])
        end = float(coeff_data["end"])
        T = end - start

        plot_start = start
        plot_end = start + (T * periods)
        x_vals = np.linspace(plot_start, plot_end, num_points)

        # Lambdify original function
        f_func = sp.lambdify(self.x, f_sym, modules=["numpy"])
        try:
            x_periodic = (x_vals - start) % T + start
            y_original = f_func(x_periodic)
            if np.isscalar(y_original):
                y_original = np.full_like(x_vals, float(y_original))
            else:
                y_original = np.array(y_original, dtype=float)
        except Exception:
            y_original = np.zeros_like(x_vals)

        # Optimization: Pre-calculate all coefficients at once
        y_approx = np.full_like(x_vals, float(a0_val / 2.0))
        
        an_vals, bn_vals = self._get_numeric_harmonics(coeff_data, harmonics)
        
        n_array = np.arange(1, harmonics + 1)
        arg = (np.pi / L) * np.outer(n_array, x_vals)
        
        an_vals = np.nan_to_num(an_vals)
        bn_vals = np.nan_to_num(bn_vals)
        
        y_approx += np.dot(an_vals, np.cos(arg))
        y_approx += np.dot(bn_vals, np.sin(arg))

        return {
            "x": x_vals.tolist(),
            "y_original": y_original.tolist(),
            "y_approx": y_approx.tolist(),
        }

    def calculate_harmonics(
        self, coeff_data: Dict[str, Any], num_harmonics: int = 10
    ) -> List[Dict[str, Any]]:
        """Calculate the first num_harmonics An and Bn values."""
        an_vals, bn_vals = self._get_numeric_harmonics(coeff_data, num_harmonics)
        
        harmonics = []
        for i in range(num_harmonics):
            harmonics.append({
                "n": i + 1,
                "an": float(np.nan_to_num(an_vals[i])),
                "bn": float(np.nan_to_num(bn_vals[i]))
            })
        
        return harmonics
