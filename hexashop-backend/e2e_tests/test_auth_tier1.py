import pytest
import requests
import uuid

BASE_URL = "http://localhost:8080"

def generate_unique_email():
    return f"user_{uuid.uuid4().hex[:8]}@example.com"

def validate_standard_error(response, expected_status):
    assert response.status_code == expected_status
    try:
        data = response.json()
    except ValueError:
        pytest.fail("Response is not JSON")
    assert "error" in data, f"Expected 'error' in response JSON, got {data}"

# ==========================================
# Feature 1: User Registration
# ==========================================

def test_register_success():
    email = generate_unique_email()
    payload = {
        "email": email,
        "password": "SecurePassword123!",
        "name": "Test User"
    }
    response = requests.post(f"{BASE_URL}/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == email
    assert "password" not in data

def test_register_duplicate_email():
    email = generate_unique_email()
    payload = {
        "email": email,
        "password": "SecurePassword123!",
        "name": "Test User"
    }
    # First registration
    setup_res = requests.post(f"{BASE_URL}/register", json=payload)
    assert setup_res.status_code == 201
    
    # Second registration with same email
    response = requests.post(f"{BASE_URL}/register", json=payload)
    validate_standard_error(response, 409)

def test_register_invalid_email_format():
    payload = {
        "email": "not-an-email",
        "password": "SecurePassword123!",
        "name": "Test User"
    }
    response = requests.post(f"{BASE_URL}/register", json=payload)
    validate_standard_error(response, 400)

def test_register_missing_fields():
    payload = {
        "email": generate_unique_email()
        # missing password and name
    }
    response = requests.post(f"{BASE_URL}/register", json=payload)
    validate_standard_error(response, 400)

def test_register_short_password():
    payload = {
        "email": generate_unique_email(),
        "password": "short",
        "name": "Test User"
    }
    response = requests.post(f"{BASE_URL}/register", json=payload)
    validate_standard_error(response, 400)

# ==========================================
# Feature 2: User Login
# ==========================================

def test_login_success():
    email = generate_unique_email()
    password = "SecurePassword123!"
    payload = {
        "email": email,
        "password": password,
        "name": "Test User"
    }
    setup_res = requests.post(f"{BASE_URL}/register", json=payload)
    assert setup_res.status_code == 201

    login_payload = {
        "email": email,
        "password": password
    }
    response = requests.post(f"{BASE_URL}/login", json=login_payload)
    assert response.status_code == 200
    data = response.json()
    assert "token" in data

def test_login_invalid_password():
    email = generate_unique_email()
    password = "SecurePassword123!"
    payload = {
        "email": email,
        "password": password,
        "name": "Test User"
    }
    setup_res = requests.post(f"{BASE_URL}/register", json=payload)
    assert setup_res.status_code == 201

    login_payload = {
        "email": email,
        "password": "WrongPassword123!"
    }
    response = requests.post(f"{BASE_URL}/login", json=login_payload)
    validate_standard_error(response, 401)

def test_login_nonexistent_user():
    login_payload = {
        "email": generate_unique_email(),
        "password": "SecurePassword123!"
    }
    response = requests.post(f"{BASE_URL}/login", json=login_payload)
    validate_standard_error(response, 401)

def test_login_missing_fields():
    login_payload = {
        "email": generate_unique_email()
        # missing password
    }
    response = requests.post(f"{BASE_URL}/login", json=login_payload)
    validate_standard_error(response, 400)

def test_login_invalid_email_format():
    login_payload = {
        "email": "not-an-email",
        "password": "SecurePassword123!"
    }
    response = requests.post(f"{BASE_URL}/login", json=login_payload)
    validate_standard_error(response, 400)

# ==========================================
# Feature 3: Get Current User (/me)
# ==========================================

def test_get_me_success():
    email = generate_unique_email()
    password = "SecurePassword123!"
    setup_res = requests.post(f"{BASE_URL}/register", json={
        "email": email,
        "password": password,
        "name": "Test User"
    })
    assert setup_res.status_code == 201
    
    login_res = requests.post(f"{BASE_URL}/login", json={
        "email": email,
        "password": password
    })
    assert login_res.status_code == 200
    token = login_res.json().get("token", "")

    headers = {
        "Authorization": f"Bearer {token}"
    }
    response = requests.get(f"{BASE_URL}/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == email

def test_get_me_missing_token():
    response = requests.get(f"{BASE_URL}/me")
    validate_standard_error(response, 401)

def test_get_me_invalid_token_signature():
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwi"
    }
    response = requests.get(f"{BASE_URL}/me", headers=headers)
    validate_standard_error(response, 401)

def test_get_me_wrong_auth_scheme():
    headers = {
        "Authorization": "Basic dXNlcjpwYXNz"
    }
    response = requests.get(f"{BASE_URL}/me", headers=headers)
    validate_standard_error(response, 401)

def test_get_me_invalid_header_format():
    headers = {
        "Authorization": "Bearer"
    }
    response = requests.get(f"{BASE_URL}/me", headers=headers)
    validate_standard_error(response, 401)
