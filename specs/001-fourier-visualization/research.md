# Research: Fourier Series Optimization for Raspberry Pi

## Decision: Manual Integration with `lambdify` for Evaluation

### Rationale
While `sympy.fourier_series` provides a high-level API, manual integration of $a_n = \frac{1}{L} \int f(x) \cos(\frac{n\pi x}{L}) dx$ and $b_n = \frac{1}{L} \int f(x) \sin(\frac{n\pi x}{L}) dx$ followed by `lambdify` for numerical evaluation is significantly faster for generating the thousands of points required by Plotly.js. `lambdify` can use NumPy as a backend, which is highly optimized for ARM64 (Raspberry Pi).

### Alternatives Considered
- **`sympy.fourier_series`**: Easier to use but can be slow for large $n$ when evaluating partial sums numerically across many points.
- **Pure NumPy**: Fast but lacks the ability to handle arbitrary symbolic input from the user (requires parsing/converting string to NumPy-compatible code).

---

## Decision: Docker Compose with Multi-Stage Builds for ARM64

### Rationale
Using multi-stage builds in Docker ensures that the final image is lean. For ARM64 (Raspberry Pi), we will use base images like `python:3.11-slim` and `node:20-slim`. We will leverage Docker's Buildx to ensure compatibility if building from a non-ARM machine.

### Alternatives Considered
- **Direct Installation**: Harder to maintain and reproduce across different Raspberry Pi setups.
- **Single-Stage Docker**: Resulting images would be too large for SD card storage on Pi.

---

## Decision: Plotly.js for Dynamic Rendering

### Rationale
Plotly.js handles thousands of points efficiently using WebGL where available. It provides built-in zoom and pan, which is essential for observing the Gibbs phenomenon.

### Alternatives Considered
- **Chart.js**: Good for simple charts but can struggle with high-density data and interactive math visualizations.
- **D3.js**: Extremely powerful but requires significantly more development time for basic interactive features like zooming.
