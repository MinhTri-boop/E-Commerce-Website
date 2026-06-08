# Scope: E2E Tier 1 Tests - Cart

## Architecture
- `pytest` based testing in `F:\E-Comerce-Web\hexashop-backend\e2e_tests\test_cart_tier1.py`
- Test against `http://localhost:8080`
- Tests should not assume the server is running yet.
- Opaque-box testing ONLY. Use `requests` to test endpoints.
- Cart endpoints require JWT authentication. Test must mock or implement valid login if needed, or simply assume it can create a user/get token via auth endpoints or mock. Actually, tests should just call Auth endpoints to get a real JWT.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Cart Tier 1 Tests | Implement 10 tests (5 per feature: GET, POST/PUT) validating HTTP requests/responses and standard error format. | none | PLANNED |

## Interface Contracts
- Standard Error Format must be checked for error conditions.
