import time
from src.core.fourier import FourierSeriesCalculator
from src.models.fourier import FunctionInterval

def test_performance():
    calc = FourierSeriesCalculator()
    intervals = [
        FunctionInterval(expression='x', start=0, end=1)
    ]
    t0 = time.time()
    coeff_data = calc.calculate_coefficients(intervals, 10)
    print(f'Coefficients took: {time.time() - t0:.4f}s')
    
    t0 = time.time()
    harmonics = calc.calculate_harmonics(coeff_data, 10)
    print(f'Harmonics took: {time.time() - t0:.4f}s')
    
    t0 = time.time()
    plot_data = calc.evaluate_plot_data(coeff_data, 50, 500)
    print(f'Plot data took: {time.time() - t0:.4f}s')

if __name__ == '__main__':
    test_performance()
