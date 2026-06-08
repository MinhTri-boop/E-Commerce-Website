# Scope: E2E Tier 1 Tests - Products

## Architecture
- `pytest` based testing in `F:\E-Comerce-Web\hexashop-backend\e2e_tests\test_products_tier1.py`
- Test against `http://localhost:8080`
- Tests should not assume the server is running yet.
- Opaque-box testing ONLY. Use `requests` to test endpoints.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Products Tier 1 Tests | Implement 30 tests (5 per feature: Search, Category, Price, Sort, Pagination, ID) validating HTTP requests/responses and standard error format. | none | PLANNED |

## Interface Contracts
- Standard Error Format must be checked for error conditions.
