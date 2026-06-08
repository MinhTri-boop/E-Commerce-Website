import pytest
import requests
import uuid

CART_URL = "http://localhost:8080/api/cart"
AUTH_URL = "http://localhost:8080/api/auth"

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

@pytest.fixture(scope="module")
def valid_token():
    email = f"cart_test_{uuid.uuid4()}@example.com"
    payload = {
        "name": "Cart Test User",
        "email": email,
        "password": "password123"
    }
    try:
        # Register
        requests.post(f"{AUTH_URL}/register", json=payload)
        # Login
        res = requests.post(f"{AUTH_URL}/login", json={"email": email, "password": "password123"})
        if res.status_code == 200 and "token" in res.json():
            return res.json()["token"]
    except requests.exceptions.ConnectionError:
        pass
    # Return a dummy token if server is down or auth is unimplemented
    return "dummy.jwt.token"

# --- GET Cart Items Boundary Tests ---

def test_get_cart_missing_auth_header():
    res = requests.get(CART_URL)
    check_error_format(res)

def test_get_cart_invalid_auth_header_format():
    headers = {"Authorization": "BearerTokenWithoutSpace"}
    res = requests.get(CART_URL, headers=headers)
    check_error_format(res)

def test_get_cart_invalid_token():
    headers = {"Authorization": "Bearer invalid.token.here"}
    res = requests.get(CART_URL, headers=headers)
    check_error_format(res)

def test_get_cart_missing_bearer_prefix(valid_token):
    headers = {"Authorization": valid_token}
    res = requests.get(CART_URL, headers=headers)
    check_error_format(res)

def test_get_cart_empty_auth_header():
    headers = {"Authorization": ""}
    res = requests.get(CART_URL, headers=headers)
    check_error_format(res)


# --- Update Cart Items Boundary Tests ---

def test_update_cart_missing_auth_header():
    payload = {"productId": 1, "quantity": 2}
    res = requests.post(CART_URL, json=payload)
    check_error_format(res)

def test_update_cart_invalid_product_id(valid_token):
    headers = {"Authorization": f"Bearer {valid_token}"}
    # Using negative product ID
    payload = {"productId": -1, "quantity": 1}
    res = requests.post(CART_URL, json=payload, headers=headers)
    check_error_format(res)

def test_update_cart_negative_quantity(valid_token):
    headers = {"Authorization": f"Bearer {valid_token}"}
    payload = {"productId": 1, "quantity": -5}
    res = requests.post(CART_URL, json=payload, headers=headers)
    check_error_format(res)

def test_update_cart_zero_quantity(valid_token):
    headers = {"Authorization": f"Bearer {valid_token}"}
    payload = {"productId": 1, "quantity": 0}
    res = requests.post(CART_URL, json=payload, headers=headers)
    check_error_format(res)

def test_update_cart_missing_payload(valid_token):
    headers = {"Authorization": f"Bearer {valid_token}"}
    res = requests.post(CART_URL, json={}, headers=headers)
    check_error_format(res)
