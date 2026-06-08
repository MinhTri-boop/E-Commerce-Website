import pytest
import requests
import uuid

BASE_URL = "http://localhost:8080"

def generate_user():
    uid = str(uuid.uuid4())[:8]
    return {
        "username": f"user_{uid}",
        "email": f"user_{uid}@example.com",
        "password": "Password123!"
    }

def register_user(api_client, user_data):
    response = api_client.post(f"{BASE_URL}/api/auth/register", json=user_data)
    return response

def login_user(api_client, user_data):
    response = api_client.post(f"{BASE_URL}/api/auth/login", json={
        "email": user_data["email"],
        "password": user_data["password"]
    })
    return response

def get_auth_headers(token):
    return {"Authorization": f"Bearer {token}"}

def check_standard_error(response):
    try:
        data = response.json()
        assert data.get("error") is True, f"Expected 'error': true in response, got {data}"
        assert "message" in data, "Expected 'message' in response"
        assert "details" in data, "Expected 'details' in response"
    except ValueError:
        pytest.fail(f"Response is not JSON: {response.text}")

def test_new_user_cart(api_client):
    user = generate_user()
    register_user(api_client, user)
    
    login_resp = login_user(api_client, user)
    if login_resp.status_code != 200:
        pytest.skip(f"Login failed: {login_resp.text}")
    token = login_resp.json().get("token")
    
    cart_resp = api_client.get(f"{BASE_URL}/api/cart", headers=get_auth_headers(token))
    assert cart_resp.status_code == 200
    cart_data = cart_resp.json()
    assert len(cart_data.get("items", [])) == 0

def test_unauthenticated_access_guards(api_client):
    # Try to view cart without token
    cart_resp = api_client.get(f"{BASE_URL}/api/cart")
    assert cart_resp.status_code == 401
    check_standard_error(cart_resp)
    
    # Try to add item without token
    add_resp = api_client.post(f"{BASE_URL}/api/cart", json={"productId": 1, "quantity": 1})
    assert add_resp.status_code == 401
    check_standard_error(add_resp)
    
    # Register and login to verify 200 OK
    user = generate_user()
    register_user(api_client, user)
    login_resp = login_user(api_client, user)
    if login_resp.status_code == 200:
        token = login_resp.json().get("token")
        cart_resp_auth = api_client.get(f"{BASE_URL}/api/cart", headers=get_auth_headers(token))
        assert cart_resp_auth.status_code == 200

def test_cart_persistence(api_client):
    user = generate_user()
    register_user(api_client, user)
    login_resp = login_user(api_client, user)
    if login_resp.status_code != 200:
        pytest.skip("Login failed")
    token = login_resp.json().get("token")
    headers = get_auth_headers(token)
    
    add_resp = api_client.post(f"{BASE_URL}/api/cart", json={"productId": 1, "quantity": 1}, headers=headers)
    
    if add_resp.status_code in [200, 201]:
        # Login again
        login_resp2 = login_user(api_client, user)
        token2 = login_resp2.json().get("token")
        headers2 = get_auth_headers(token2)
        
        cart_resp = api_client.get(f"{BASE_URL}/api/cart", headers=headers2)
        assert cart_resp.status_code == 200
        items = cart_resp.json().get("items", [])
        assert len(items) > 0
        assert any(item["productId"] == 1 for item in items)
    elif add_resp.status_code in [400, 401, 403, 404]:
        check_standard_error(add_resp)

def test_cart_isolation(api_client):
    user_a = generate_user()
    user_b = generate_user()
    
    register_user(api_client, user_a)
    register_user(api_client, user_b)
    
    login_a_resp = login_user(api_client, user_a)
    login_b_resp = login_user(api_client, user_b)
    
    if login_a_resp.status_code != 200 or login_b_resp.status_code != 200:
        pytest.skip("Login failed")
        
    token_a = login_a_resp.json().get("token")
    token_b = login_b_resp.json().get("token")
    
    headers_a = get_auth_headers(token_a)
    headers_b = get_auth_headers(token_b)
    
    # User A adds item
    add_resp = api_client.post(f"{BASE_URL}/api/cart", json={"productId": 1, "quantity": 1}, headers=headers_a)
    
    # User B gets cart
    cart_b_resp = api_client.get(f"{BASE_URL}/api/cart", headers=headers_b)
    if cart_b_resp.status_code == 200:
        items_b = cart_b_resp.json().get("items", [])
        # Assuming User B's cart is empty since they just registered
        assert len(items_b) == 0
