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
