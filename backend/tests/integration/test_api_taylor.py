from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)


def test_api_taylor_solve_amiconi():
    payload = {
        "expression": "2*x*y",
        "x0": 1.0,
        "y0": 1.0,
        "xf": 1.3,
        "h": 0.1,
        "order": 2,
    }
    response = client.post("/api/taylor/solve", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["order"] == 2
    assert data["n_steps"] == 3
    assert len(data["steps"]) == 3
    assert round(data["steps"][0]["yn_plus_1"], 2) == 1.23
    assert round(data["steps"][1]["yn_plus_1"], 4) == 1.5427 or round(data["steps"][1]["yn_plus_1"], 4) == 1.5426
    assert "plot_data" in data
    assert "comparison_methods" in data
    assert len(data["comparison_methods"]) >= 4


def test_api_taylor_invalid_domain():
    payload = {
        "expression": "2*x*y",
        "x0": 2.0,
        "y0": 1.0,
        "xf": 1.0,  # xf < x0
        "h": 0.1,
        "order": 2,
    }
    response = client.post("/api/taylor/solve", json=payload)
    assert response.status_code == 400
