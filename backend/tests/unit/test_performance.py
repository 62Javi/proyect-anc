import time
from src.core.fourier import FourierSeriesCalculator
from src.models.fourier import FunctionInterval


def test_performance_heavy():
    calc = FourierSeriesCalculator()
    # Piecewise with many harmonics
    intervals = [
        FunctionInterval(expression="x**2", start=-1.0, end=0.0),
        FunctionInterval(expression="sin(x)", start=0.0, end=1.0),
    ]

    start_time = time.time()
    results = calc.calculate_coefficients(intervals, harmonics=100)
    plot_data = calc.evaluate_plot_data(results, harmonics=100, num_points=1000)
    end_time = time.time()

    duration = end_time - start_time
    print(f"\nCalculation and evaluation took: {duration:.4f}s")
    assert duration < 5.0  # Goal for Raspberry Pi
