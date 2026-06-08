# E2E Test Infra: HexaShop Backend

## Test Philosophy
- Opaque-box, requirement-driven. No dependency on implementation design.
- Methodology: Category-Partition + BVA + Pairwise + Workload Testing.
- Execution: Python with `pytest` and `requests`.

## Feature Inventory
| # | Feature | Source (requirement) | Tier 1 | Tier 2 | Tier 3 |
|---|---------|---------------------|:------:|:------:|:------:|
| 1 | User Registration | ORIGINAL_REQUEST R2 | 5      | 5      | ✓      |
| 2 | User Login | ORIGINAL_REQUEST R2 | 5      | 5      | ✓      |
| 3 | Get Current User /me | ORIGINAL_REQUEST R2 | 5      | 5      | ✓      |
| 4 | Product Search | ORIGINAL_REQUEST R3 | 5      | 5      | ✓      |
| 5 | Product Category Filtering | ORIGINAL_REQUEST R3 | 5      | 5      | ✓      |
| 6 | Product Price Range Filtering | ORIGINAL_REQUEST R3 | 5      | 5      | ✓      |
| 7 | Product Sorting | ORIGINAL_REQUEST R3 | 5      | 5      | ✓      |
| 8 | Product Pagination | ORIGINAL_REQUEST R3 | 5      | 5      | ✓      |
| 9 | Get Product Details by ID | ORIGINAL_REQUEST R3 | 5      | 5      | ✓      |
| 10 | Get Cart Items | ORIGINAL_REQUEST R4 | 5      | 5      | ✓      |
| 11 | Update Cart Items | ORIGINAL_REQUEST R4 | 5      | 5      | ✓      |
| 12 | Standard Error Format | ORIGINAL_REQUEST R5 | 5      | 5      | ✓      |

## Test Architecture
- Test runner: `pytest`
- Test cases location: `F:\E-Comerce-Web\hexashop-backend\e2e_tests\`
- Invocation: `pytest -v e2e_tests/`
- Expected: all tests pass with exit code 0
- Standard configurations:
  - Base URL: `http://localhost:8080`
  - Authentication: JWT passed via `Authorization: Bearer <token>`
- The test suite handles HTTP responses transparently and parses JSON output.

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | New user sign up, login, browse products, add to cart | 1, 2, 8, 11 | Medium |
| 2 | Guest tries accessing protected endpoints then logs in | 3, 10, 2, 12 | Low |
| 3 | User browses category, filters by price, sorts, views details, adds to cart | 5, 6, 7, 9, 11 | High |
| 4 | Complex cart manipulation over multiple sessions | 2, 10, 11 | Medium |
| 5 | Invalid input exploration and exact error format verification | 1, 4, 11, 12 | High |

## Coverage Thresholds
- Tier 1: ≥5 per feature (60 tests minimum)
- Tier 2: ≥5 per feature (where boundaries exist) (60 tests minimum)
- Tier 3: pairwise coverage of major feature interactions
- Tier 4: ≥5 realistic application scenarios
