# API Contract: Fourier Series Backend

## Endpoints

### `POST /calculate`
Calculates the Fourier coefficients and evaluates the partial sum for visualization.

**Request Body**: `FourierRequest`
```json
{
  "functions": [
    {
      "expression": "x",
      "start": -1.0,
      "end": 1.0
    }
  ],
  "harmonics": 10,
  "points": 1000
}
```

**Response**: `FourierResponse`
```json
{
  "a0": "0",
  "an": "0",
  "bn": "\\frac{2(-1)^{n+1}}{n\\pi}",
  "symmetry": "Impar",
  "plot_data": {
    "x": [-1.0, -0.99, ...],
    "y_original": [-1.0, -0.99, ...],
    "y_approx": [-0.95, -0.94, ...]
  }
}
```

**Errors**:
- `400 Bad Request`: If expressions are mathematically invalid.
- `422 Unprocessable Entity`: If `harmonics` > 100.
