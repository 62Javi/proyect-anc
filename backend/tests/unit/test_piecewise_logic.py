from src.core.fourier import FourierSeriesCalculator
from src.models.fourier import FunctionInterval


def test_piecewise_calculation():
    calc = FourierSeriesCalculator()
    # f(x) = 1 on [-1, 0], f(x) = -1 on [0, 1] (Square wave)
    intervals = [
        FunctionInterval(expression="1", start="-1.0", end="0.0"),
        FunctionInterval(expression="-1", start="0.0", end="1.0"),
    ]
    results = calc.calculate_coefficients(intervals, harmonics=5)

    assert results["a0"] == "0"
    assert results["an"] == "0"
    assert results["bn"] != "0"

    plot_data = calc.evaluate_plot_data(results, harmonics=5, num_points=10)
    assert len(plot_data["x"]) == 10
    # Original function should be 1 at start and -1 just before the end
    assert plot_data["y_original"][0] == 1.0
    assert plot_data["y_original"][-2] == -1.0
