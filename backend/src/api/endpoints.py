from fastapi import APIRouter, Depends
from src.models.fourier import FourierRequest, FourierResponse
from src.core.fourier import FourierSeriesCalculator

router = APIRouter()


def get_calculator():
    return FourierSeriesCalculator()


@router.post("/calculate", response_model=FourierResponse)
async def calculate(
    request: FourierRequest, calc: FourierSeriesCalculator = Depends(get_calculator)
):
    # 1. Detect symmetry
    symmetry = calc.detect_symmetry(request.functions)

    # 2. Calculate symbolic coefficients
    coeff_data = calc.calculate_coefficients(request.functions, request.harmonics)

    # 3. Evaluate plot data
    plot_data = calc.evaluate_plot_data(coeff_data, request.harmonics, request.points, request.periods)

    return FourierResponse(
        a0=coeff_data["a0"],
        an=coeff_data["an"],
        bn=coeff_data["bn"],
        symmetry=symmetry,
        plot_data=plot_data,
    )
