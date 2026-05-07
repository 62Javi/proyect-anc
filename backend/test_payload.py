import sys
import sympy as sp
from src.core.fourier import FourierSeriesCalculator
from src.models.fourier import FunctionInterval

calc = FourierSeriesCalculator()
# Raw string because of backslashes
expr = r"\begin{cases} 1 & 0 \le x \le 1 \\ -1 & -1 < x \le 0 \end{cases}"
intervals = [
    FunctionInterval(expression=expr, start="-1", end="1")
]

try:
    res = calc.calculate_coefficients(intervals, 10)
    print("a0:", res["a0"])
    print("a0_val:", res["a0_val"])
    print("an:", res["an"])
    print("bn:", res["bn"])
    print("symmetry:", calc.detect_symmetry(intervals))
except Exception as e:
    print("Error:", e)
