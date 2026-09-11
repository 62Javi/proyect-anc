import math

import pytest

from src.core.regression import LeastSquaresCalculator
from src.models.regression import DataPoint, FitRequest


@pytest.fixture
def calculator():
    return LeastSquaresCalculator()


def test_linear_regression_perfect(calculator):
    # y = 3 + 2x
    pts = [DataPoint(x=x, y=3 + 2 * x) for x in [1, 2, 3, 4, 5]]
    req = FitRequest(model_type="linear", points=pts)
    res = calculator.fit(req)
    assert math.isclose(res.metrics.r2, 1.0, abs_tol=1e-5)
    assert math.isclose(res.parameters["a1"], 3.0, abs_tol=1e-4)
    assert math.isclose(res.parameters["a2"], 2.0, abs_tol=1e-4)
    assert len(res.residuals) == 5
    assert len(res.curve_x) > 0


def test_tp4_exercise_1(calculator):
    # TP4 Ejercicio 1:
    # X: 1, 2, 3, 4, 5
    # Y: 0.5, 1.7, 3.4, 5.7, 8.4
    raw_pts = [(1, 0.5), (2, 1.7), (3, 3.4), (4, 5.7), (5, 8.4)]
    pts = [DataPoint(x=x, y=y) for x, y in raw_pts]

    # 1. Lineal
    res_lin = calculator.fit(FitRequest(model_type="linear", points=pts))
    assert res_lin.metrics.r2 > 0.97

    # 2. Polinómico grado 2
    res_poly = calculator.fit(FitRequest(model_type="polynomial", points=pts, degree=2))
    assert res_poly.metrics.r2 > 0.999

    # 3. Exponencial
    res_exp = calculator.fit(FitRequest(model_type="exponential", points=pts))
    assert res_exp.metrics.r2 > 0.94

    # 4. Potencial
    res_pow = calculator.fit(FitRequest(model_type="power", points=pts))
    assert res_pow.metrics.r2 > 0.999

    # 5. Cociente / Saturación
    res_sat = calculator.fit(FitRequest(model_type="saturation", points=pts))
    assert res_sat.metrics.r2 > 0.98


def test_case1_full_analysis(calculator):
    analysis = calculator.analyze_case1()
    assert len(analysis.clusters) == 4
    assert len(analysis.summaries) == 4

    # Recipiente térmico should have the lowest cooling rate k
    best_insulation = analysis.summaries[0]
    assert best_insulation.cluster_name == "Recipiente térmico"
    assert best_insulation.k_cooling_rate < 0.01

    # Glass should have the highest cooling rate k
    worst_insulation = analysis.summaries[-1]
    assert worst_insulation.cluster_name == "Vaso de vidrio"
    assert worst_insulation.k_cooling_rate > 0.025

    # Check conclusions are present
    assert len(analysis.general_conclusions) >= 4


def test_tp4_exercise_6_oil_complete_dataset(calculator):
    # Complete 28 historical data points from ONU (1880 - 1990)
    data = [
        (1880, 30), (1890, 77), (1900, 149), (1905, 215), (1910, 328),
        (1915, 432), (1920, 689), (1925, 1069), (1930, 1412), (1935, 1655),
        (1940, 2150), (1945, 2595), (1950, 3803), (1955, 5626), (1960, 7674),
        (1962, 8882), (1964, 10310), (1966, 12016), (1968, 14104), (1970, 16669),
        (1972, 18584), (1974, 20389), (1976, 20188), (1978, 21922), (1980, 21732),
        (1982, 19403), (1984, 19608), (1990, 17153),
    ]
    assert len(data) == 28

    pts = [DataPoint(x=p[0], y=p[1]) for p in data]

    # Fit cubic polynomial
    res_cubic = calculator.fit(FitRequest(model_type="polynomial", degree=3, points=pts))
    assert res_cubic.metrics.r2 > 0.90
    assert len(res_cubic.residuals) == 28

    # Fit degree 4 polynomial
    res_deg4 = calculator.fit(FitRequest(model_type="polynomial", degree=4, points=pts))
    assert res_deg4.metrics.r2 > 0.95

