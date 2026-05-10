import logging

from fastapi import HTTPException, status

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("fourier-api")


class FourierError(HTTPException):
    def __init__(self, detail: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        super().__init__(status_code=status_code, detail=detail)


class InvalidExpressionError(FourierError):
    def __init__(self, expression: str):
        super().__init__(detail=f"Invalid mathematical expression: {expression}")


class NonIntegrableError(FourierError):
    def __init__(self, expression: str):
        super().__init__(
            detail=f"Expression could not be integrated symbolically: {expression}"
        )
