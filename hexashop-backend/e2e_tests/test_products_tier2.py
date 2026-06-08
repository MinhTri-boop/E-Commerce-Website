import pytest
import requests
import json

BASE_URL = "http://localhost:8080"

def is_server_running():
    try:
        requests.get(BASE_URL)
        return True
    except requests.ConnectionError:
        return False

pytestmark = pytest.mark.skipif(not is_server_running(), reason="Server is not running")

def check_error_format(response):
    if response.status_code >= 400:
        try:
            data = response.json()
        except ValueError:
            pytest.fail(f"Response is not valid JSON. Status code: {response.status_code}, Body: {response.text}")
        
        assert "error" in data, "Missing 'error' in response"
        assert data["error"] is True, "'error' should be True"
        assert "message" in data, "Missing 'message' in response"
        assert "details" in data, "Missing 'details' in response"
    else:
        # If it happens to be 200/OK, verify it's a valid JSON response
        try:
            response.json()
        except ValueError:
            pytest.fail(f"Response is not valid JSON. Status code: {response.status_code}, Body: {response.text}")

# --- Search Boundary Tests ---
def test_search_empty_string(api_client):
    response = api_client.get(f"{BASE_URL}/api/products?search=")
    check_error_format(response)

def test_search_extremely_long_string(api_client):
    long_str = "A" * 2000
    response = api_client.get(f"{BASE_URL}/api/products?search={long_str}")
    check_error_format(response)

def test_search_special_characters(api_client):
    response = api_client.get(f"{BASE_URL}/api/products?search=!@#$%^&*()")
    check_error_format(response)

def test_search_sql_injection(api_client):
    response = api_client.get(f"{BASE_URL}/api/products?search=' OR 1=1 --")
    check_error_format(response)

def test_search_whitespace_only(api_client):
    response = api_client.get(f"{BASE_URL}/api/products?search=%20%20%20")
    check_error_format(response)

# --- Category Boundary Tests ---
def test_category_empty_string(api_client):
    response = api_client.get(f"{BASE_URL}/api/products?category=")
    check_error_format(response)

def test_category_extremely_long_string(api_client):
    long_str = "C" * 2000
    response = api_client.get(f"{BASE_URL}/api/products?category={long_str}")
    check_error_format(response)

def test_category_special_characters(api_client):
    response = api_client.get(f"{BASE_URL}/api/products?category=!@#$%^&*()")
    check_error_format(response)

def test_category_sql_injection(api_client):
    response = api_client.get(f"{BASE_URL}/api/products?category=' OR 1=1 --")
    check_error_format(response)

def test_category_whitespace_only(api_client):
    response = api_client.get(f"{BASE_URL}/api/products?category=%20%20%20")
    check_error_format(response)

# --- Price Filter Boundary Tests ---
def test_price_negative_min(api_client):
    response = api_client.get(f"{BASE_URL}/api/products?minPrice=-10")
    check_error_format(response)

def test_price_negative_max(api_client):
    response = api_client.get(f"{BASE_URL}/api/products?maxPrice=-100")
    check_error_format(response)

def test_price_string_type(api_client):
    response = api_client.get(f"{BASE_URL}/api/products?minPrice=abc&maxPrice=xyz")
    check_error_format(response)

def test_price_extremely_large(api_client):
    response = api_client.get(f"{BASE_URL}/api/products?maxPrice=99999999999999999999")
    check_error_format(response)

def test_price_min_greater_than_max(api_client):
    response = api_client.get(f"{BASE_URL}/api/products?minPrice=100&maxPrice=50")
    check_error_format(response)

# --- Sort Boundary Tests ---
def test_sort_empty_string(api_client):
    response = api_client.get(f"{BASE_URL}/api/products?sort=")
    check_error_format(response)

def test_sort_invalid_key(api_client):
    response = api_client.get(f"{BASE_URL}/api/products?sort=invalid_column")
    check_error_format(response)

def test_sort_sql_injection(api_client):
    response = api_client.get(f"{BASE_URL}/api/products?sort=price; DROP TABLE products;")
    check_error_format(response)

def test_sort_extremely_long_string(api_client):
    long_str = "S" * 2000
    response = api_client.get(f"{BASE_URL}/api/products?sort={long_str}")
    check_error_format(response)

def test_sort_numeric_value(api_client):
    response = api_client.get(f"{BASE_URL}/api/products?sort=123")
    check_error_format(response)

# --- Pagination Boundary Tests ---
def test_pagination_negative_page(api_client):
    response = api_client.get(f"{BASE_URL}/api/products?page=-1")
    check_error_format(response)

def test_pagination_negative_limit(api_client):
    response = api_client.get(f"{BASE_URL}/api/products?limit=-10")
    check_error_format(response)

def test_pagination_zero_page_and_limit(api_client):
    response = api_client.get(f"{BASE_URL}/api/products?page=0&limit=0")
    check_error_format(response)

def test_pagination_extremely_large_limit(api_client):
    response = api_client.get(f"{BASE_URL}/api/products?limit=999999999999999999")
    check_error_format(response)

def test_pagination_invalid_type(api_client):
    response = api_client.get(f"{BASE_URL}/api/products?page=abc&limit=xyz")
    check_error_format(response)

# --- Get Details Boundary Tests ---
def test_details_negative_id(api_client):
    response = api_client.get(f"{BASE_URL}/api/products/-1")
    check_error_format(response)

def test_details_zero_id(api_client):
    response = api_client.get(f"{BASE_URL}/api/products/0")
    check_error_format(response)

def test_details_extremely_large_id(api_client):
    response = api_client.get(f"{BASE_URL}/api/products/9999999999999999999999999999")
    check_error_format(response)

def test_details_string_id(api_client):
    response = api_client.get(f"{BASE_URL}/api/products/abc")
    check_error_format(response)

def test_details_special_characters_id(api_client):
    response = api_client.get(f"{BASE_URL}/api/products/!@#")
    check_error_format(response)
