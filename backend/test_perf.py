import time

from src.core.fourier import FourierSeriesCalculator
from src.models.fourier import FunctionInterval


def test_performance():
    calc = FourierSeriesCalculator()
    
    # A simple square wave
    intervals = [
        FunctionInterval(expression="1", start=0, end=1),
        FunctionInterval(expression="-1", start=1, end=2)
    ]
    
    t0 = time.time()
    coeff_data = calc.calculate_coefficients(intervals, 10)
    t1 = time.time()
    print(f"Coefficients took: {t1 - t0:.4f}s")
    
    t0 = time.time()
    harmonics = calc.calculate_harmonics(coeff_data, 10)
    t1 = time.time()
    print(f"Harmonics took: {t1 - t0:.4f}s")
    
    t0 = time.time()
    plot_data = calc.evaluate_plot_data(coeff_data, 50, 500)
    t1 = time.time()
    print(f"Plot data took: {t1 - t0:.4f}s")

if __name__ == "__main__":
    test_performance()
