import pytest, httpx, os
BASE = os.getenv("API", "http://localhost:8000")

@pytest.mark.asyncio
async def test_health():
    async with httpx.AsyncClient() as c:
        r = await c.get(f"{BASE}/health")
        assert r.status_code == 200
        assert r.json().get("status") == "ok"
