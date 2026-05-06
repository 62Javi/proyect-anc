from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from src.models.fourier import FourierRequest, FourierResponse
from src.core.fourier import FourierSeriesCalculator
from src.models.harmonics import AudioAnalysisResponse
from src.core.harmonics import HarmonicAnalyzer
from sse_starlette.sse import EventSourceResponse
import asyncio
import json

router = APIRouter()
harmonics_analyzer = HarmonicAnalyzer()

def get_calculator():
    return FourierSeriesCalculator()

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

    # 5. Calculate first 10 harmonics An and Bn
    harmonics_data = calc.calculate_harmonics(coeff_data, num_harmonics=10)

    return FourierResponse(
        a0=coeff_data["a0"],
        an=coeff_data["an"],
        bn=coeff_data["bn"],
        symmetry=symmetry,
        plot_data=plot_data,
        convergence_results=convergence_results,
        harmonics=harmonics_data
    )

@router.get("/calculate-stream")
async def calculate_stream(
    functions: str, 
    harmonics: int = 10, 
    points: int = 1000, 
    periods: int = 1,
    convergence_points: str = "",
    calc: FourierSeriesCalculator = Depends(get_calculator)
):
    async def event_generator():
        try:
            # Parse inputs
            parsed_functions = json.loads(functions)
            parsed_conv_points = [float(p) for p in convergence_points.split(",")] if convergence_points else []
            
            # Step 1: Symmetry
            yield {"event": "progress", "data": json.dumps({"step": "Simetría", "progress": 10})}
            await asyncio.sleep(0.1)
            symmetry = calc.detect_symmetry(parsed_functions)
            
            # Step 2: Coefficients
            yield {"event": "progress", "data": json.dumps({"step": "Coeficientes", "progress": 30})}
            await asyncio.sleep(0.1)
            coeff_data = calc.calculate_coefficients(parsed_functions, harmonics)
            
            # Step 3: Plot data
            yield {"event": "progress", "data": json.dumps({"step": "Gráfica", "progress": 60})}
            await asyncio.sleep(0.1)
            plot_data = calc.evaluate_plot_data(coeff_data, harmonics, points, periods)
            
            # Step 4: Convergence
            yield {"event": "progress", "data": json.dumps({"step": "Dirichlet", "progress": 85})}
            await asyncio.sleep(0.1)
            convergence_results = []
            if parsed_conv_points:
                convergence_results = calc.calculate_convergence(coeff_data, parsed_conv_points)
                
            # Step 5: Harmonics
            yield {"event": "progress", "data": json.dumps({"step": "Finalizando", "progress": 95})}
            harmonics_data = calc.calculate_harmonics(coeff_data, num_harmonics=10)
            
            # Final result
            result = FourierResponse(
                a0=coeff_data["a0"],
                an=coeff_data["an"],
                bn=coeff_data["bn"],
                symmetry=symmetry,
                plot_data=plot_data,
                convergence_results=convergence_results,
                harmonics=harmonics_data
            )
            
            yield {
                "event": "result",
                "data": result.json()
            }
        except Exception as e:
            yield {"event": "error", "data": str(e)}

    return EventSourceResponse(event_generator())

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
