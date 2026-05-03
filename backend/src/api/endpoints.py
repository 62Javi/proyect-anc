from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from src.models.fourier import FourierRequest, FourierResponse
from src.core.fourier import FourierSeriesCalculator
from src.models.harmonics import AudioAnalysisResponse
from src.core.harmonics import HarmonicAnalyzer

router = APIRouter()
harmonics_analyzer = HarmonicAnalyzer()

def get_calculator():
    return FourierSeriesCalculator()

@router.post("/calculate", response_model=FourierResponse)
async def calculate(
    request: FourierRequest, calc: FourierSeriesCalculator = Depends(get_calculator)
):
    # ... (existing code)
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
