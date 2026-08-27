from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from src.core.fourier import FourierSeriesCalculator
from src.core.harmonics import HarmonicAnalyzer
from src.core.roots import RootFindingCalculator
from src.models.fourier import FourierRequest, FourierResponse
from src.models.harmonics import AudioAnalysisResponse
from src.models.roots import (
    FixedPointRequest,
    FixedPointResponse,
    NewtonRequest,
    NewtonResponse,
)

router = APIRouter()
harmonics_analyzer = HarmonicAnalyzer()
root_calculator = RootFindingCalculator()

def get_calculator():
    return FourierSeriesCalculator()

def get_root_calculator():
    return root_calculator

@router.post("/calculate", response_model=FourierResponse)
def calculate(
    request: FourierRequest, calc: FourierSeriesCalculator = Depends(get_calculator)
):
    # 1. Detect symmetry
    symmetry = calc.detect_symmetry(request.functions)

    # 2. Calculate symbolic coefficients
    coeff_data = calc.calculate_coefficients(request.functions, request.harmonics)

    # 3. Evaluate plot data
    plot_data = calc.evaluate_plot_data(coeff_data, request.harmonics, request.points, request.periods)

    # 4. Calculate convergence points
    convergence_results = []
    if request.convergence_points:
        convergence_results = calc.calculate_convergence(coeff_data, request.convergence_points)

    # 5. Calculate harmonics An and Bn up to the requested harmonics
    harmonics_data = calc.calculate_harmonics(coeff_data, num_harmonics=request.harmonics)

    return FourierResponse(
        a0=coeff_data["a0"],
        an=coeff_data["an"],
        bn=coeff_data["bn"],
        symmetry=symmetry,
        plot_data=plot_data,
        convergence_results=convergence_results,
        harmonics=harmonics_data
    )

@router.post("/harmonics/analyze", response_model=AudioAnalysisResponse)
async def analyze_audio(file: UploadFile = File(...)):
    if not file.filename.endswith(('.wav')):
        raise HTTPException(status_code=400, detail="Only WAV files are supported")
    
    try:
        content = await file.read()
        result = harmonics_analyzer.analyze_audio(content)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing audio: {str(e)}")


@router.post("/roots/newton", response_model=NewtonResponse)
def calculate_newton_root(
    request: NewtonRequest, calc: RootFindingCalculator = Depends(get_root_calculator)
):
    try:
        return calc.calculate_newton(request)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/roots/fixed-point", response_model=FixedPointResponse)
def calculate_fixed_point_root(
    request: FixedPointRequest, calc: RootFindingCalculator = Depends(get_root_calculator)
):
    try:
        return calc.calculate_fixed_point(request)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

