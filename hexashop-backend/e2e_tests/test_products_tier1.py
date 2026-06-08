import pytest
import requests

BASE_URL = "http://localhost:8080"
PRODUCTS_ENDPOINT = f"{BASE_URL}/api/products"

# F1: Product Search
def test_search_exact_match(api_client):
    response = api_client.get(f"{PRODUCTS_ENDPOINT}?search=Classic Spring")
    assert response.status_code == 200
    data = response.json()
    content = data.get("content", [])
    assert len(content) >= 1
    assert any(p.get("name") == "Classic Spring" for p in content)

def test_search_partial_match(api_client):
    response = api_client.get(f"{PRODUCTS_ENDPOINT}?search=spring")
    assert response.status_code == 200
    data = response.json()
    content = data.get("content", [])
    # Validating that the search term is either in the name or description
    for p in content:
        name_match = "spring" in p.get("name", "").lower()
        desc_match = "spring" in p.get("description", "").lower()
        assert name_match or desc_match

def test_search_no_match(api_client):
    response = api_client.get(f"{PRODUCTS_ENDPOINT}?search=NonExistentProductXYZ")
    assert response.status_code == 200
    assert response.json().get("content", []) == []

def test_search_description_match(api_client):
    response = api_client.get(f"{PRODUCTS_ENDPOINT}?search=Lorem")
    assert response.status_code == 200
    content = response.json().get("content", [])
    for p in content:
        assert "lorem" in p.get("description", "").lower()

def test_search_empty(api_client):
    response = api_client.get(f"{PRODUCTS_ENDPOINT}?search=")
    assert response.status_code == 200
    data = response.json()
    assert "content" in data
    assert isinstance(data["content"], list)

# F2: Category Filtering
def test_category_men(api_client):
    response = api_client.get(f"{PRODUCTS_ENDPOINT}?category=men")
    assert response.status_code == 200
    for item in response.json().get("content", []):
        assert item.get("category") == "men"

def test_category_women(api_client):
    response = api_client.get(f"{PRODUCTS_ENDPOINT}?category=women")
    assert response.status_code == 200
    for item in response.json().get("content", []):
        assert item.get("category") == "women"

def test_category_kids(api_client):
    response = api_client.get(f"{PRODUCTS_ENDPOINT}?category=kids")
    assert response.status_code == 200
    for item in response.json().get("content", []):
        assert item.get("category") == "kids"

def test_category_accessories(api_client):
    response = api_client.get(f"{PRODUCTS_ENDPOINT}?category=accessories")
    assert response.status_code == 200
    for item in response.json().get("content", []):
        assert item.get("category") == "accessories"

def test_category_missing(api_client):
    response = api_client.get(f"{PRODUCTS_ENDPOINT}?category=electronics")
    assert response.status_code == 200
    assert response.json().get("content", []) == []

# F3: Price Range Filtering
def test_price_min_only(api_client):
    response = api_client.get(f"{PRODUCTS_ENDPOINT}?minPrice=100")
    assert response.status_code == 200
    for item in response.json().get("content", []):
        assert item.get("price", 0) >= 100

def test_price_max_only(api_client):
    response = api_client.get(f"{PRODUCTS_ENDPOINT}?maxPrice=50")
    assert response.status_code == 200
    for item in response.json().get("content", []):
        assert item.get("price", float('inf')) <= 50

def test_price_range(api_client):
    response = api_client.get(f"{PRODUCTS_ENDPOINT}?minPrice=50&maxPrice=100")
    assert response.status_code == 200
    for item in response.json().get("content", []):
        assert 50 <= item.get("price", 0) <= 100

def test_price_exact_match(api_client):
    response = api_client.get(f"{PRODUCTS_ENDPOINT}?minPrice=120&maxPrice=120")
    assert response.status_code == 200
    for item in response.json().get("content", []):
        assert item.get("price") == 120

def test_price_no_matches(api_client):
    response = api_client.get(f"{PRODUCTS_ENDPOINT}?minPrice=5000&maxPrice=6000")
    assert response.status_code == 200
    assert response.json().get("content", []) == []

# F4: Sorting
def test_sort_price_asc(api_client):
    response = api_client.get(f"{PRODUCTS_ENDPOINT}?sort=price-asc")
    assert response.status_code == 200
    content = response.json().get("content", [])
    prices = [item.get("price", 0) for item in content]
    assert prices == sorted(prices)

def test_sort_price_desc(api_client):
    response = api_client.get(f"{PRODUCTS_ENDPOINT}?sort=price-desc")
    assert response.status_code == 200
    content = response.json().get("content", [])
    prices = [item.get("price", 0) for item in content]
    assert prices == sorted(prices, reverse=True)

def test_sort_name_asc(api_client):
    response = api_client.get(f"{PRODUCTS_ENDPOINT}?sort=name-asc")
    assert response.status_code == 200
    content = response.json().get("content", [])
    names = [item.get("name", "") for item in content]
    assert names == sorted(names)

def test_sort_name_desc(api_client):
    response = api_client.get(f"{PRODUCTS_ENDPOINT}?sort=name-desc")
    assert response.status_code == 200
    content = response.json().get("content", [])
    names = [item.get("name", "") for item in content]
    assert names == sorted(names, reverse=True)

def test_sort_rating_desc(api_client):
    response = api_client.get(f"{PRODUCTS_ENDPOINT}?sort=rating-desc")
    assert response.status_code == 200
    content = response.json().get("content", [])
    ratings = [item.get("rating", 0) for item in content]
    assert ratings == sorted(ratings, reverse=True)

# F5: Pagination
def test_pagination_default(api_client):
    response = api_client.get(PRODUCTS_ENDPOINT)
    assert response.status_code == 200
    data = response.json()
    assert len(data.get("content", [])) <= 10  # Assumed default limit
    assert "limit" in data

def test_pagination_custom(api_client):
    response = api_client.get(f"{PRODUCTS_ENDPOINT}?page=1&limit=5")
    assert response.status_code == 200
    data = response.json()
    assert len(data.get("content", [])) <= 5
    assert data.get("limit") == 5

def test_pagination_next_page(api_client):
    response1 = api_client.get(f"{PRODUCTS_ENDPOINT}?page=1&limit=5")
    response2 = api_client.get(f"{PRODUCTS_ENDPOINT}?page=2&limit=5")
    assert response2.status_code == 200
    data1 = response1.json()
    data2 = response2.json()
    assert data2.get("page") == 2
    content1 = data1.get("content", [])
    content2 = data2.get("content", [])
    if len(content1) > 0 and len(content2) > 0:
        assert content1 != content2

def test_pagination_out_of_bounds(api_client):
    response = api_client.get(f"{PRODUCTS_ENDPOINT}?page=999&limit=10")
    assert response.status_code == 200
    assert response.json().get("content", []) == []

def test_pagination_metadata(api_client):
    response = api_client.get(f"{PRODUCTS_ENDPOINT}?page=1&limit=5")
    assert response.status_code == 200
    data = response.json()
    assert "totalElements" in data
    assert "totalPages" in data
    assert "page" in data
    assert "limit" in data

# F6: Get Product Details by ID
def test_get_by_id_valid_1(api_client):
    response = api_client.get(f"{PRODUCTS_ENDPOINT}/1")
    assert response.status_code == 200
    data = response.json()
    assert data.get("id") == 1
    assert "name" in data
    assert "price" in data

def test_get_by_id_valid_10(api_client):
    response = api_client.get(f"{PRODUCTS_ENDPOINT}/10")
    assert response.status_code == 200
    data = response.json()
    assert data.get("id") == 10

def test_get_by_id_schema_fields(api_client):
    response = api_client.get(f"{PRODUCTS_ENDPOINT}/2")
    assert response.status_code == 200
    data = response.json()
    assert "image" in data
    assert "images" in data
    assert isinstance(data["images"], list)
    assert "rating" in data
    assert "description" in data
    assert "inStock" in data

def test_get_by_id_category(api_client):
    response = api_client.get(f"{PRODUCTS_ENDPOINT}/3")
    assert response.status_code == 200
    data = response.json()
    assert "category" in data
    assert isinstance(data["category"], str)

def test_get_by_id_not_found_standard_error(api_client):
    response = api_client.get(f"{PRODUCTS_ENDPOINT}/9999")
    assert response.status_code == 404
    data = response.json()
    assert data.get("error") is True
    assert "message" in data
    assert "details" in data
