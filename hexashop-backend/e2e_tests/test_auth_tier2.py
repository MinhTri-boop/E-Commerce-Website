import pytest
import requests
import uuid

# Base URL from conftest.py usually or hardcoded for these tests
BASE_URL = "http://localhost:8080/api/auth"

def check_error_format(response):
    assert response.status_code >= 400, f"Expected an error status code, got {response.status_code}"
    try:
        data = response.json()
    except ValueError:
        pytest.fail("Response is not valid JSON")
    
    assert "error" in data, "Missing 'error' field in response"
    assert data["error"] is True, "'error' field should be true"
    assert "message" in data, "Missing 'message' field in response"
    assert "details" in data, "Missing 'details' field in response"

# --- Registration Boundary Tests ---

def test_register_missing_fields():
    # Missing password
    payload = {
        "name": "Test User",
        "email": f"test{uuid.uuid4()}@example.com"
    }
    res = requests.post(f"{BASE_URL}/register", json=payload)
    check_error_format(res)

def test_register_invalid_email_format():
    payload = {
        "name": "Test User",
        "email": "invalid-email-format",
        "password": "password123"
    }
    res = requests.post(f"{BASE_URL}/register", json=payload)
    check_error_format(res)

def test_register_duplicate_email():
    email = f"duplicate{uuid.uuid4()}@example.com"
    payload = {
        "name": "Test User",
        "email": email,
        "password": "password123"
    }
    # First registration
    try:
        requests.post(f"{BASE_URL}/register", json=payload)
    except requests.exceptions.ConnectionError:
        pytest.fail("Connection error to server")
    
    # Second registration should fail
    res = requests.post(f"{BASE_URL}/register", json=payload)
    check_error_format(res)

def test_register_empty_payload():
    res = requests.post(f"{BASE_URL}/register", json={})
    check_error_format(res)

def test_register_password_too_short_or_empty():
    payload = {
        "name": "Test User",
        "email": f"shortpass{uuid.uuid4()}@example.com",
        "password": ""
    }
    res = requests.post(f"{BASE_URL}/register", json=payload)
    check_error_format(res)

# --- Login Boundary Tests ---

def test_login_missing_email():
    payload = {
        "password": "password123"
    }
    res = requests.post(f"{BASE_URL}/login", json=payload)
    check_error_format(res)

def test_login_missing_password():
    payload = {
        "email": "test@example.com"
    }
    res = requests.post(f"{BASE_URL}/login", json=payload)
    check_error_format(res)

def test_login_invalid_email_format():
    payload = {
        "email": "invalid-email",
        "password": "password123"
    }
    res = requests.post(f"{BASE_URL}/login", json=payload)
    check_error_format(res)

def test_login_wrong_password():
    # Try to login with non-existent or wrong password
    payload = {
        "email": f"nonexistent{uuid.uuid4()}@example.com",
        "password": "wrongpassword"
    }
    res = requests.post(f"{BASE_URL}/login", json=payload)
    check_error_format(res)

def test_login_empty_payload():
    res = requests.post(f"{BASE_URL}/login", json={})
    check_error_format(res)

# --- /me Boundary Tests ---

def test_me_missing_auth_header():
    res = requests.get(f"{BASE_URL}/me")
    check_error_format(res)

def test_me_invalid_auth_header_format():
    headers = {
        "Authorization": "BearerTokenWithoutSpace"
    }
    res = requests.get(f"{BASE_URL}/me", headers=headers)
    check_error_format(res)

def test_me_invalid_token():
    headers = {
        "Authorization": "Bearer invalid.token.here"
    }
    res = requests.get(f"{BASE_URL}/me", headers=headers)
    check_error_format(res)

def test_me_missing_bearer_prefix():
    headers = {
        "Authorization": "invalid.token.here"
    }
    res = requests.get(f"{BASE_URL}/me", headers=headers)
    check_error_format(res)

def test_me_empty_auth_header():
    headers = {
        "Authorization": ""
    }
    res = requests.get(f"{BASE_URL}/me", headers=headers)
    check_error_format(res)
