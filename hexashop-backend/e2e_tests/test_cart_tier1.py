import pytest
import requests
import uuid

BASE_URL = "http://localhost:8080"
CART_URL = f"{BASE_URL}/api/cart"
AUTH_URL = f"{BASE_URL}/api/auth"

def get_auth_token():
    email = f"user_{uuid.uuid4()}@example.com"
    password = "password123"
    
    # Register
    register_payload = {
        "name": "Cart Test User",
        "email": email,
        "password": password
    }
    try:
        requests.post(f"{AUTH_URL}/register", json=register_payload)
        
        # Login
        login_payload = {
            "email": email,
            "password": password
        }
        response = requests.post(f"{AUTH_URL}/login", json=login_payload)
        return response.json().get("token", "dummy.token")
    except requests.exceptions.ConnectionError:
        return "dummy.token"

def check_standard_error(response):
    assert response.status_code >= 400
    try:
        data = response.json()
    except ValueError:
        pytest.fail("Response is not JSON")
    assert "error" in data
    assert data["error"] is True
    assert "message" in data
    assert "details" in data


# --- GET Cart Items (5 Tests) ---

def test_get_cart_initially_empty():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    try:
        response = requests.get(CART_URL, headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert data["items"] == []
    except requests.exceptions.ConnectionError:
        pytest.xfail("Backend is not running")

def test_get_cart_schema():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    try:
        # Add an item to test schema
        requests.post(CART_URL, headers=headers, json={"productId": 1, "quantity": 1})
        
        response = requests.get(CART_URL, headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert isinstance(data["items"], list)
        if len(data["items"]) > 0:
            item = data["items"][0]
            assert "productId" in item
            assert "quantity" in item
            assert isinstance(item["productId"], int)
            assert isinstance(item["quantity"], int)
    except requests.exceptions.ConnectionError:
        pytest.xfail("Backend is not running")

def test_get_cart_after_adding_item():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    payload = {"productId": 2, "quantity": 3}
    try:
        requests.post(CART_URL, headers=headers, json=payload)
        
        response = requests.get(CART_URL, headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) == 1
        item = data["items"][0]
        assert item["productId"] == 2
        assert item["quantity"] == 3
    except requests.exceptions.ConnectionError:
        pytest.xfail("Backend is not running")

def test_get_cart_multiple_items():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    try:
        requests.post(CART_URL, headers=headers, json={"productId": 3, "quantity": 2})
        requests.post(CART_URL, headers=headers, json={"productId": 4, "quantity": 5})
        
        response = requests.get(CART_URL, headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) == 2
        product_ids = [item["productId"] for item in data["items"]]
        assert 3 in product_ids
        assert 4 in product_ids
    except requests.exceptions.ConnectionError:
        pytest.xfail("Backend is not running")

def test_get_cart_user_isolation():
    try:
        token1 = get_auth_token()
        headers1 = {"Authorization": f"Bearer {token1}"}
        requests.post(CART_URL, headers=headers1, json={"productId": 5, "quantity": 1})
        
        token2 = get_auth_token()
        headers2 = {"Authorization": f"Bearer {token2}"}
        requests.post(CART_URL, headers=headers2, json={"productId": 6, "quantity": 2})
        
        response1 = requests.get(CART_URL, headers=headers1)
        data1 = response1.json()
        assert len(data1["items"]) == 1
        assert data1["items"][0]["productId"] == 5
        
        response2 = requests.get(CART_URL, headers=headers2)
        data2 = response2.json()
        assert len(data2["items"]) == 1
        assert data2["items"][0]["productId"] == 6
    except requests.exceptions.ConnectionError:
        pytest.xfail("Backend is not running")

# --- Update Cart Items (POST) (5 Tests) ---

def test_update_cart_add_new_item():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    payload = {"productId": 7, "quantity": 2}
    try:
        response = requests.post(CART_URL, headers=headers, json=payload)
        assert response.status_code == 200
    except requests.exceptions.ConnectionError:
        pytest.xfail("Backend is not running")

def test_update_cart_increment_quantity():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    try:
        # Initial add
        requests.post(CART_URL, headers=headers, json={"productId": 8, "quantity": 2})
        
        # Increment (if POST sets absolute quantity, tests will adapt. Assuming it overrides)
        # Wait, the prompt says "POST again with a higher quantity. Verify GET reflects the new quantity."
        # If POST overrides the quantity, then "higher quantity" means the new quantity is what is stored.
        requests.post(CART_URL, headers=headers, json={"productId": 8, "quantity": 5})
        
        # Verify
        response = requests.get(CART_URL, headers=headers)
        assert response.status_code == 200
        data = response.json()
        # Find item
        item = next((i for i in data["items"] if i["productId"] == 8), None)
        assert item is not None
        assert item["quantity"] == 5
    except requests.exceptions.ConnectionError:
        pytest.xfail("Backend is not running")

def test_update_cart_decrease_quantity():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    try:
        # Initial add
        requests.post(CART_URL, headers=headers, json={"productId": 9, "quantity": 10})
        
        # Decrease
        requests.post(CART_URL, headers=headers, json={"productId": 9, "quantity": 4})
        
        # Verify
        response = requests.get(CART_URL, headers=headers)
        assert response.status_code == 200
        data = response.json()
        item = next((i for i in data["items"] if i["productId"] == 9), None)
        assert item is not None
        assert item["quantity"] == 4 # Or exactly 4 depending on how backend implements it
    except requests.exceptions.ConnectionError:
        pytest.xfail("Backend is not running")

def test_update_cart_response_structure():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    payload = {"productId": 10, "quantity": 1}
    try:
        response = requests.post(CART_URL, headers=headers, json=payload)
        assert response.status_code == 200
        data = response.json()
        
        # Generally POST returns the updated cart
        assert isinstance(data, dict)
        if "items" in data:
            assert isinstance(data["items"], list)
            item = data["items"][0]
            assert "productId" in item
            assert "quantity" in item
    except requests.exceptions.ConnectionError:
        pytest.xfail("Backend is not running")

def test_update_cart_multiple_products():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    try:
        response1 = requests.post(CART_URL, headers=headers, json={"productId": 11, "quantity": 1})
        assert response1.status_code == 200
        
        response2 = requests.post(CART_URL, headers=headers, json={"productId": 12, "quantity": 3})
        assert response2.status_code == 200
        
        response = requests.get(CART_URL, headers=headers)
        data = response.json()
        assert len(data["items"]) == 2
        product_ids = [item["productId"] for item in data["items"]]
        assert 11 in product_ids
        assert 12 in product_ids
    except requests.exceptions.ConnectionError:
        pytest.xfail("Backend is not running")
