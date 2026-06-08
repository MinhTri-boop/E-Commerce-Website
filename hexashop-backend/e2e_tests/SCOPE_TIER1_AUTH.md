# Scope: E2E Tier 1 Tests - Auth

## Architecture
- `pytest` based testing in `F:\E-Comerce-Web\hexashop-backend\e2e_tests\test_auth_tier1.py`
- Test against `http://localhost:8080`
- Tests should not assume the server is running yet.
- Opaque-box testing ONLY. Use `requests` to test endpoints.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Auth Tier 1 Tests | Implement 15 tests (5 per feature: Register, Login, /me) validating HTTP requests/responses and standard error format. | none | PLANNED |

## Interface Contracts
- Standard Error Format must be checked for error conditions.
