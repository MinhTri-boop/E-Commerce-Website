import pytest
import requests

BASE_URL = "http://localhost:8080"

@pytest.fixture
def api_client():
    session = requests.Session()
    return session
