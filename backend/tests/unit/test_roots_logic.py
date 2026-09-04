import pytest
import math
from src.core.roots import RootFindingCalculator
from src.models.roots import NewtonRequest, FixedPointRequest


@pytest.fixture
def calculator():
    return RootFindingCalculator()


def test_newton_amiconi_quadratic(calculator):
    # f(x) = x^2 - 4x - 45 = (x - 9)(x + 5)
    # x0 = 4 -> should converge to 9 or -5
    req = NewtonRequest(expression="x**2 - 4*x - 45", x0=4.0, tolerance=1e-5, max_iterations=20)
    res = calculator.calculate_newton(req)
    assert res.converged is True
    assert res.root is not None
    assert math.isclose(res.root, -5.0, abs_tol=1e-4) or math.isclose(res.root, 9.0, abs_tol=1e-4)
    assert len(res.steps) > 0


def test_newton_amiconi_trig(calculator):
    # f(x) = x - 0.8 - 0.2*sin(x), x0 = pi/4
    req = NewtonRequest(expression="x - 0.8 - 0.2*sin(x)", x0=0.7854, tolerance=1e-5, max_iterations=20)
    res = calculator.calculate_newton(req)
    assert res.converged is True
    assert res.root is not None
    # Verify f(root) is close to 0
    val = res.root - 0.8 - 0.2 * math.sin(res.root)
    assert abs(val) < 1e-4


def test_newton_cos_root(calculator):
    # f(x) = x - cos(x)
    req = NewtonRequest(expression="x - cos(x)", x0=0.7854, tolerance=1e-4, max_iterations=20)
    res = calculator.calculate_newton(req)
    assert res.converged is True
    assert res.root is not None
    assert math.isclose(res.root, 0.739085, abs_tol=1e-3)


def test_newton_zero_derivative_failure(calculator):
    # f(x) = x^2 - 4, f'(0) = 0
    req = NewtonRequest(expression="x**2 - 4", x0=0.0, tolerance=1e-4, max_iterations=10)
    res = calculator.calculate_newton(req)
    assert res.converged is False
    assert res.status == "derivative_zero"


def test_fixed_point_amiconi_convergence(calculator):
    # g(x) = 0.8 + 0.2*sin(x)
    req = FixedPointRequest(g_expression="0.8 + 0.2*sin(x)", x0=0.7854, tolerance=1e-4, max_iterations=20)
    res = calculator.calculate_fixed_point(req)
    assert res.converged is True
    assert res.root is not None
    assert res.k_constant_est is not None
    assert res.k_constant_est < 1.0  # |g'(x)| = |0.2*cos(x)| <= 0.2 < 1 (Teorema 1 and 2)


def test_fixed_point_cos(calculator):
    # g(x) = cos(x)
    req = FixedPointRequest(g_expression="cos(x)", x0=0.5, tolerance=1e-4, max_iterations=50)
    res = calculator.calculate_fixed_point(req)
    assert res.converged is True
    assert res.root is not None
    assert math.isclose(res.root, 0.739085, abs_tol=1e-3)


def test_symbolic_seeds(calculator):
    # Newton with symbolic pi/4
    req_newton = NewtonRequest(expression="x - cos(x)", x0="pi/4", tolerance=1e-4, max_iterations=20)
    res_newton = calculator.calculate_newton(req_newton)
    assert res_newton.converged is True
    assert res_newton.root is not None
    assert math.isclose(res_newton.root, 0.739085, abs_tol=1e-3)

    # Fixed point with symbolic pi/4
    req_fp = FixedPointRequest(g_expression="cos(x)", x0="pi/4", tolerance=1e-4, max_iterations=30)
    res_fp = calculator.calculate_fixed_point(req_fp)
    assert res_fp.converged is True
    assert res_fp.root is not None
    assert math.isclose(res_fp.root, 0.739085, abs_tol=1e-3)

