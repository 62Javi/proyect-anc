import math
import pytest
from src.core.taylor import TaylorODECalculator
from src.models.taylor import TaylorRequest


@pytest.fixture
def calculator():
    return TaylorODECalculator()


def test_taylor_amiconi_exercise_1(calculator):
    """
    Ejercicio 1 de Amiconi (EDO):
    y' = 2xy, y(1) = 1, h = 0.1, xf = 1.3
    Taylor Orden 2:
    y(1.1) = 1.23
    y(1.2) = 1.5426
    y(1.3) = 1.9727
    """
    req = TaylorRequest(
        expression="2*x*y",
        x0=1.0,
        y0=1.0,
        xf=1.3,
        h=0.1,
        order=2,
    )
    res = calculator.solve(req)
    assert res.order == 2
    assert res.n_steps == 3
    assert len(res.steps) == 3

    # Paso 1: n=0 -> y_1 = 1.23
    assert math.isclose(res.steps[0].yn_plus_1, 1.23, abs_tol=1e-3)
    # Paso 2: n=1 -> y_2 = 1.5426
    assert math.isclose(res.steps[1].yn_plus_1, 1.5426, abs_tol=1e-3)
    # Paso 3: n=2 -> y_3 = 1.9727
    assert math.isclose(res.steps[2].yn_plus_1, 1.9727, abs_tol=1e-3)

    # Verificación de solución exacta e^(x^2 - 1)
    assert res.has_exact_solution is True
    assert res.final_exact_value is not None
    exact_at_1_3 = math.exp(1.3**2 - 1.0)
    assert math.isclose(res.final_exact_value, exact_at_1_3, abs_tol=1e-4)


def test_taylor_practica_1a(calculator):
    """
    Práctica 05 - Ejercicio 1a:
    y' = -3x^2 y, y(0) = 3, h = 0.1, x in [0, 0.5]
    Solución analítica: y(x) = 3*e^(-x^3)
    """
    req = TaylorRequest(
        expression="-3*x**2*y",
        x0=0.0,
        y0=3.0,
        xf=0.5,
        h=0.1,
        order=2,
    )
    res = calculator.solve(req)
    assert res.n_steps == 5
    assert len(res.steps) == 5
    assert res.has_exact_solution is True
    exact_0_5 = 3.0 * math.exp(-(0.5**3))
    assert math.isclose(res.final_exact_value, exact_0_5, abs_tol=1e-3)
    # La aproximación de Taylor de orden 2 debe estar muy cerca
    assert math.isclose(res.final_approx_value, exact_0_5, abs_tol=0.05)


def test_taylor_practica_1b(calculator):
    """
    Práctica 05 - Ejercicio 1b:
    y' = 1/4 * (1 + y^2), y(0) = 1, h = 0.1, x in [0, 0.5]
    """
    req = TaylorRequest(
        expression="(1/4)*(1 + y**2)",
        x0=0.0,
        y0=1.0,
        xf=0.5,
        h=0.1,
        order=2,
    )
    res = calculator.solve(req)
    assert res.n_steps == 5
    assert res.has_exact_solution is True
    assert res.final_approx_value > 1.0


def test_taylor_practica_1d_time_variable(calculator):
    """
    Práctica 05 - Ejercicio 1d:
    y' = 1/t * (y^2 + y), y(1) = -2, h = 0.5, t in [1, 3]
    """
    req = TaylorRequest(
        expression="(1/t)*(y**2 + y)",
        x_var="t",
        y_var="y",
        x0=1.0,
        y0=-2.0,
        xf=3.0,
        h=0.5,
        order=2,
    )
    res = calculator.solve(req)
    # N = (3 - 1) / 0.5 = 4 iteraciones
    assert res.n_steps == 4
    assert len(res.steps) == 4


def test_taylor_orders_progression(calculator):
    """
    Comprobar que a mayor orden (1 -> 2 -> 3 -> 4), el error absoluto disminuye para h=0.1.
    """
    errors = []
    for order in [1, 2, 3, 4]:
        req = TaylorRequest(
            expression="2*x*y",
            x0=1.0,
            y0=1.0,
            xf=1.2,
            h=0.1,
            order=order,
        )
        res = calculator.solve(req)
        assert res.final_error_abs is not None
        errors.append(res.final_error_abs)

    # Los errores deben ser decrecientes
    assert errors[0] > errors[1] >= errors[2] >= errors[3]


def test_taylor_comparison_methods(calculator):
    """
    Verificar que se generen los métodos comparativos (Euler, Taylor 2, Heun, RK2).
    """
    req = TaylorRequest(
        expression="2*x*y",
        x0=1.0,
        y0=1.0,
        xf=1.3,
        h=0.1,
        order=2,
    )
    res = calculator.solve(req)
    names = [m.name for m in res.comparison_methods]
    assert "Euler (Taylor Ord 1)" in names
    assert "Taylor Orden 2" in names
    assert "Euler Mejorado (Heun)" in names
    assert "Runge-Kutta 2 (Amiconi)" in names

    # Comprobar el valor de RK2 con el apunte de Amiconi pág 18: 1.9779
    rk2 = next(m for m in res.comparison_methods if "Runge-Kutta 2" in m.name)
    assert math.isclose(rk2.final_value, 1.9779, abs_tol=1e-3)
