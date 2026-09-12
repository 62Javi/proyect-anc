from fastapi.testclient import TestClient

from src.main import app

client = TestClient(app)


def test_calculate_endpoint_success():
    payload = {
        "functions": [{"expression": "x", "start": "-1.0", "end": "1.0"}],
        "harmonics": 10,
        "points": 100,
    }
    response = client.post("/api/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "a0" in data
    assert "an" in data
    assert "bn" in data
    assert "symmetry" in data
    assert "plot_data" in data
    assert len(data["plot_data"]["x"]) == 100


def test_calculate_endpoint_invalid_harmonics():
    payload = {
        "functions": [{"expression": "x", "start": -1.0, "end": 1.0}],
        "harmonics": 101,  # ge=1, le=100
        "points": 100,
    }
    response = client.post("/api/calculate", json=payload)
    assert response.status_code == 422


def test_calculate_endpoint_invalid_interval():
    payload = {
        "functions": [{"expression": "x", "start": "0", "end": "-5"}],
        "harmonics": 10,
        "points": 100,
    }
    response = client.post("/api/calculate", json=payload)
    assert response.status_code == 400
    assert "El límite inferior" in response.json()["detail"]


def test_regression_fit_endpoint():
    payload = {
        "model_type": "linear",
        "points": [
            {"x": 1.0, "y": 2.0},
            {"x": 2.0, "y": 4.0},
            {"x": 3.0, "y": 6.0},
        ],
    }
    response = client.post("/api/regression/fit", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["model_type"] == "linear"
    assert data["metrics"]["r2"] > 0.999
    assert "normal_equations" in data


def test_regression_case1_endpoint():
    response = client.get("/api/regression/case1")
    assert response.status_code == 200
    data = response.json()
    assert "clusters" in data
    assert "summaries" in data
    assert len(data["summaries"]) == 4
    assert len(data["general_conclusions"]) >= 4
