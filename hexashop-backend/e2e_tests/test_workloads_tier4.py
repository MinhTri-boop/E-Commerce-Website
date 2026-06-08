import pytest
import requests
import uuid

BASE_URL = "http://localhost:8080/api"

def check_error_format(response, expected_status=None):
    if expected_status:
        assert response.status_code == expected_status, f"Expected {expected_status}, got {response.status_code}"
    else:
        assert response.status_code >= 400, f"Expected an error status code, got {response.status_code}"
    
    try:
        data = response.json()
    except ValueError:
        pytest.fail(f"Response is not valid JSON. Status: {response.status_code}, Body: {response.text}")
    
    assert "error" in data, "Missing 'error' field in response"
    assert data["error"] is True, "'error' field should be true"
    assert "message" in data, "Missing 'message' field in response"
    assert "details" in data, "Missing 'details' field in response"


def register_user():
    email = f"test_{uuid.uuid4()}@example.com"
    password = "password123"
    name = "Test User"
    res = requests.post(f"{BASE_URL}/auth/register", json={
        "name": name, "email": email, "password": password
    })
    return email, password, res

def login_user(email, password):
    res = requests.post(f"{BASE_URL}/auth/login", json={
        "email": email, "password": password
    })
    return res

def test_scenario_1_signup_browse_cart():
    # Register
    email, password, reg_res = register_user()
    assert reg_res.status_code in [200, 201]

    # Login
    login_res = login_user(email, password)
    assert login_res.status_code == 200
    token = login_res.json().get("token")
    assert token

    headers = {"Authorization": f"Bearer {token}"}

    # Fetch products with pagination
    prod_res = requests.get(f"{BASE_URL}/products", params={"page": 1, "limit": 5})
    assert prod_res.status_code == 200
    prod_data = prod_res.json()
    assert "products" in prod_data
    assert "total" in prod_data
    assert "page" in prod_data
    assert "limit" in prod_data
    
    products = prod_data["products"]
    assert len(products) <= 5
    
    if len(products) > 0:
        first_product_id = products[0]["id"]
        
        # Add to cart
        cart_add_res = requests.post(f"{BASE_URL}/cart", json={
            "productId": first_product_id,
            "quantity": 1
        }, headers=headers)
        assert cart_add_res.status_code == 200
        
        # Fetch cart
        cart_res = requests.get(f"{BASE_URL}/cart", headers=headers)
        assert cart_res.status_code == 200
        cart_items = cart_res.json().get("items", [])
        
        item_found = False
        for item in cart_items:
            # item might wrap product or just have productId
            p_id = item.get("productId") or item.get("product", {}).get("id")
            if p_id == first_product_id:
                item_found = True
                assert item["quantity"] == 1
        assert item_found, "Product not found in cart"

def test_scenario_2_guest_auth_flow():
    # Guest access /me and /cart
    me_res = requests.get(f"{BASE_URL}/auth/me")
    check_error_format(me_res, 401)
    
    cart_res = requests.get(f"{BASE_URL}/cart")
    check_error_format(cart_res, 401)
    
    # Login
    email, password, reg_res = register_user()
    assert reg_res.status_code in [200, 201]
    login_res = login_user(email, password)
    assert login_res.status_code == 200
    token = login_res.json().get("token")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Authenticated access
    me_res_auth = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    assert me_res_auth.status_code == 200
    assert me_res_auth.json().get("email") == email
    
    cart_res_auth = requests.get(f"{BASE_URL}/cart", headers=headers)
    assert cart_res_auth.status_code == 200

def test_scenario_3_complex_shopping_journey():
    # Fetch with multiple query params
    params = {
        "category": "electronics",
        "minPrice": 100,
        "maxPrice": 1000,
        "sortBy": "price",
        "sortOrder": "desc"
    }
    prod_res = requests.get(f"{BASE_URL}/products", params=params)
    assert prod_res.status_code == 200
    products = prod_res.json().get("products", [])
    
    if len(products) > 0:
        prev_price = float('inf')
        for p in products:
            # Assert category
            p_category = p.get("category", "")
            # Check string or nested object for category
            if isinstance(p_category, dict):
                assert p_category.get("name", "").lower() == "electronics"
            else:
                assert "electronics" in str(p_category).lower()
            
            # Assert price boundaries
            price = float(p.get("price", 0))
            assert 100 <= price <= 1000
            
            # Assert sorting desc
            assert price <= prev_price
            prev_price = price
            
        first_product = products[0]
        first_product_id = first_product["id"]
        
        # Request details
        detail_res = requests.get(f"{BASE_URL}/products/{first_product_id}")
        assert detail_res.status_code == 200
        detail_data = detail_res.json()
        assert detail_data["id"] == first_product_id
        assert detail_data["name"] == first_product["name"]
        
        # Login and Add to cart
        email, password, _ = register_user()
        login_res = login_user(email, password)
        token = login_res.json().get("token")
        headers = {"Authorization": f"Bearer {token}"}
        
        add_res = requests.post(f"{BASE_URL}/cart", json={
            "productId": first_product_id,
            "quantity": 2
        }, headers=headers)
        assert add_res.status_code == 200
        
        # Fetch cart
        cart_res = requests.get(f"{BASE_URL}/cart", headers=headers)
        assert cart_res.status_code == 200
        cart_data = cart_res.json()
        
        items = cart_data.get("items", [])
        total_price = cart_data.get("totalPrice", 0)
        
        item_found = False
        for item in items:
            p_id = item.get("productId") or item.get("product", {}).get("id")
            if p_id == first_product_id:
                item_found = True
                assert item["quantity"] == 2
                
        assert item_found
        # Calculate expected total
        expected_total = sum((float(i.get("price", 0)) * i.get("quantity", 0)) for i in items)
        # or rely on the single item
        # If the API computes totalPrice directly, we assert it's roughly correct
        if expected_total > 0:
            assert abs(float(total_price) - expected_total) < 0.01

def test_scenario_4_multi_session_cart_state():
    email, password, reg_res = register_user()
    assert reg_res.status_code in [200, 201]
    
    login1_res = login_user(email, password)
    assert login1_res.status_code == 200
    token1 = login1_res.json().get("token")
    headers1 = {"Authorization": f"Bearer {token1}"}
    
    # We need 2 products to test. Let's just fetch them.
    prod_res = requests.get(f"{BASE_URL}/products")
    assert prod_res.status_code == 200
    products = prod_res.json().get("products", [])
    
    if len(products) >= 2:
        prod_x_id = products[0]["id"]
        prod_y_id = products[1]["id"]
        
        # Add Product X (qty 1)
        requests.post(f"{BASE_URL}/cart", json={"productId": prod_x_id, "quantity": 1}, headers=headers1)
        # Add Product Y (qty 2)
        requests.post(f"{BASE_URL}/cart", json={"productId": prod_y_id, "quantity": 2}, headers=headers1)
        
        # Update Product X to 3
        requests.post(f"{BASE_URL}/cart", json={"productId": prod_x_id, "quantity": 3}, headers=headers1)
        # Remove Product Y (quantity 0)
        requests.post(f"{BASE_URL}/cart", json={"productId": prod_y_id, "quantity": 0}, headers=headers1)
        
        # Authenticate again
        login2_res = login_user(email, password)
        assert login2_res.status_code == 200
        token2 = login2_res.json().get("token")
        headers2 = {"Authorization": f"Bearer {token2}"}
        
        # Fetch cart with new token
        cart_res = requests.get(f"{BASE_URL}/cart", headers=headers2)
        assert cart_res.status_code == 200
        
        items = cart_res.json().get("items", [])
        
        found_x = False
        found_y = False
        for item in items:
            p_id = item.get("productId") or item.get("product", {}).get("id")
            if p_id == prod_x_id:
                found_x = True
                assert item["quantity"] == 3
            if p_id == prod_y_id:
                found_y = True
        
        assert found_x, "Product X should be in the cart"
        assert not found_y, "Product Y should be removed from the cart"

def test_scenario_5_invalid_input_error_formats():
    # 1. Registration errors
    # Malformed email
    res1 = requests.post(f"{BASE_URL}/auth/register", json={
        "name": "Test", "email": "bad-email", "password": "pwd"
    })
    check_error_format(res1)
    
    # Missing password
    res2 = requests.post(f"{BASE_URL}/auth/register", json={
        "name": "Test", "email": f"test_{uuid.uuid4()}@example.com"
    })
    check_error_format(res2)
    
    # Duplicate username/email
    email, password, reg_res = register_user()
    assert reg_res.status_code in [200, 201]
    res3 = requests.post(f"{BASE_URL}/auth/register", json={
        "name": "Test", "email": email, "password": "pwd"
    })
    check_error_format(res3, 409)  # conflict
    
    # 2. Search errors
    res_search1 = requests.get(f"{BASE_URL}/products", params={"q": "A" * 5000}) # Extremely long string
    if res_search1.status_code != 200:
        check_error_format(res_search1, 400)
    
    res_search2 = requests.get(f"{BASE_URL}/products", params={"q": "'; DROP TABLE users; --"})
    assert res_search2.status_code in [200, 400]
    if res_search2.status_code != 200:
        check_error_format(res_search2, 400)
    
    # 3. Cart errors
    login_res = login_user(email, password)
    token = login_res.json().get("token")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Non-existent product ID
    res_cart1 = requests.post(f"{BASE_URL}/cart", json={
        "productId": 999999999, "quantity": 1
    }, headers=headers)
    check_error_format(res_cart1)
    
    # Negative quantity
    prod_res = requests.get(f"{BASE_URL}/products")
    if prod_res.status_code == 200 and len(prod_res.json().get("products", [])) > 0:
        valid_id = prod_res.json()["products"][0]["id"]
        res_cart2 = requests.post(f"{BASE_URL}/cart", json={
            "productId": valid_id, "quantity": -5
        }, headers=headers)
        check_error_format(res_cart2)
