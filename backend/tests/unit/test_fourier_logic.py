from src.core.fourier import FourierSeriesCalculator
from src.models.fourier import FunctionInterval


def test_symmetry_detection_odd():
    calc = FourierSeriesCalculator()
    # f(x) = x on [-1, 1] is odd
    intervals = [FunctionInterval(expression="x", start=-1.0, end=1.0)]
    symmetry = calc.detect_symmetry(intervals)
    assert symmetry == "Impar"


def test_symmetry_detection_even():
    calc = FourierSeriesCalculator()
    # f(x) = x**2 on [-1, 1] is even
    intervals = [FunctionInterval(expression="x**2", start=-1.0, end=1.0)]
    symmetry = calc.detect_symmetry(intervals)
    assert symmetry == "Par"


def test_coefficient_calculation_x():
    calc = FourierSeriesCalculator()
    intervals = [FunctionInterval(expression="x", start=-1.0, end=1.0)]
    results = calc.calculate_coefficients(intervals, harmonics=5)

    assert results["a0"] == "0"
    assert results["an"] == "0"
    assert results["bn"] != "0"  # Should be non-zero for odd function
