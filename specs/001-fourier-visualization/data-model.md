# Data Model: Fourier Series API

## API Request: `FourierRequest`
Represents the user's input for calculation.

| Field | Type | Description |
|-------|------|-------------|
| `functions` | `List[FunctionInterval]` | List of expressions and their intervals. |
| `harmonics` | `int` | Number of terms in the partial sum (1-100). |
| `points` | `int` | Number of points to evaluate for plotting (default: 1000). |

### `FunctionInterval`
| Field | Type | Description |
|-------|------|-------------|
| `expression` | `str` | SymPy-compatible string (e.g., `x**2`). |
| `start` | `float` | Start of the interval. |
| `end` | `float` | End of the interval. |

## API Response: `FourierResponse`
Contains the analytical and numerical results.

| Field | Type | Description |
|-------|------|-------------|
| `a0` | `str` | LaTeX string for $a_0$. |
| `an` | `str` | LaTeX string for $a_n$ formula. |
| `bn` | `str` | LaTeX string for $b_n$ formula. |
| `symmetry` | `str` | "Par", "Impar", or "Ninguna". |
| `plot_data` | `PlotData` | Points for Plotly rendering. |

### `PlotData`
| Field | Type | Description |
|-------|------|-------------|
| `x` | `List[float]` | X-axis values. |
| `y_original` | `List[float]` | Original function values. |
| `y_approx` | `List[float]` | Partial sum values. |
