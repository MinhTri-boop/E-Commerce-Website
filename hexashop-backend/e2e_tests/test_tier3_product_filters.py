import pytest
import requests

BASE_URL = "http://localhost:8080"

def check_standard_error(response):
    try:
        data = response.json()
        assert data.get("error") is True, f"Expected 'error': true in response, got {data}"
        assert "message" in data, "Expected 'message' in response"
        assert "details" in data, "Expected 'details' in response"
    except ValueError:
        pytest.fail(f"Response is not JSON: {response.text}")

def test_search_and_category(api_client):
    params = {"search": "laptop", "categoryId": 1}
    resp = api_client.get(f"{BASE_URL}/api/products", params=params)
    if resp.status_code == 200:
        data = resp.json()
        products = data.get("content", [])
        for p in products:
            name = p.get("name", "").lower()
            desc = p.get("description", "").lower()
            assert "laptop" in name or "laptop" in desc
            
            category = p.get("category", {})
            assert category.get("id") == 1 or p.get("categoryId") == 1

def test_category_price_sort(api_client):
    params = {"categoryId": 1, "minPrice": 500, "maxPrice": 1500, "sortBy": "price_asc"}
    resp = api_client.get(f"{BASE_URL}/api/products", params=params)
    if resp.status_code == 200:
        data = resp.json()
        products = data.get("content", [])
        prev_price = -1
        for p in products:
            price = p.get("price", 0)
            assert 500 <= price <= 1500
            assert price >= prev_price
            prev_price = price
            
            category = p.get("category", {})
            assert category.get("id") == 1 or p.get("categoryId") == 1

def test_search_price_pagination(api_client):
    params_p1 = {"search": "laptop", "minPrice": 500, "page": 1, "size": 2}
    resp1 = api_client.get(f"{BASE_URL}/api/products", params=params_p1)
    
    params_p2 = {"search": "laptop", "minPrice": 500, "page": 2, "size": 2}
    resp2 = api_client.get(f"{BASE_URL}/api/products", params=params_p2)
    
    if resp1.status_code == 200 and resp2.status_code == 200:
        p1_items = resp1.json().get("content", [])
        p2_items = resp2.json().get("content", [])
        
        p1_ids = [item.get("id") for item in p1_items]
        p2_ids = [item.get("id") for item in p2_items]
        
        overlap = set(p1_ids).intersection(set(p2_ids))
        assert len(overlap) == 0

def test_sort_pagination(api_client):
    params_p1 = {"sortBy": "price_asc", "page": 1, "size": 2}
    resp1 = api_client.get(f"{BASE_URL}/api/products", params=params_p1)
    
    params_p2 = {"sortBy": "price_asc", "page": 2, "size": 2}
    resp2 = api_client.get(f"{BASE_URL}/api/products", params=params_p2)
    
    if resp1.status_code == 200 and resp2.status_code == 200:
        p1_items = resp1.json().get("content", [])
        p2_items = resp2.json().get("content", [])
        
        if p1_items and p2_items:
            last_p1_price = p1_items[-1].get("price", 0)
            first_p2_price = p2_items[0].get("price", 0)
            assert last_p1_price <= first_p2_price

def test_all_combined(api_client):
    params = {
        "search": "laptop",
        "categoryId": 1,
        "minPrice": 500,
        "maxPrice": 1500,
        "sortBy": "price_desc",
        "page": 1,
        "size": 5
    }
    resp = api_client.get(f"{BASE_URL}/api/products", params=params)
    if resp.status_code == 200:
        data = resp.json()
        products = data.get("content", [])
        prev_price = float('inf')
        for p in products:
            price = p.get("price", 0)
            assert 500 <= price <= 1500
            assert price <= prev_price
            prev_price = price
            
            name = p.get("name", "").lower()
            desc = p.get("description", "").lower()
            assert "laptop" in name or "laptop" in desc
            
            category = p.get("category", {})
            assert category.get("id") == 1 or p.get("categoryId") == 1
        
        assert len(products) <= 5

def test_invalid_combination(api_client):
    params = {"minPrice": 1500, "maxPrice": 500}
    resp = api_client.get(f"{BASE_URL}/api/products", params=params)
    assert resp.status_code == 400
    check_standard_error(resp)
