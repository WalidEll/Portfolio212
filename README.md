# Portfolio212

Spring Boot backend for a portfolio tracker driven by transactions (average cost) and delayed price snapshots from WafaBourse.

## Features (current)
- Transactions CRUD: BUY / SELL / DIVIDEND / FEE
- Auto-create instruments from transactions
- Holdings calculation (average cost)
- Price ingestion from WafaBourse JSON endpoint (`VALEUR-INDICATORS`)
- Scheduled price refresh (Morocco timezone)

## Run locally (Docker)

```bash
docker compose up --build
```

API will be on: `http://localhost:8080`

## Useful endpoints
- `GET /api/transactions`
- `POST /api/transactions`
- `GET /api/holdings`
- `POST /api/prices/refresh`

## Notes
- Price fetch: `POST https://www.wafabourse.com/api/proxy/data/JNNJ` with body containing `VALEUR-INDICATORS` and `Symbol_`.
- Next step: CSV import from the Google Sheet.
