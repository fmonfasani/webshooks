import httpx, os, pytest
BASE = os.getenv("API", "http://localhost:8000")

@pytest.mark.asyncio
async def test_flow_core_reporte():
    async with httpx.AsyncClient() as c:
        # login rápido
        r = await c.post(f"{BASE}/auth/login",
                         json={"email":"test@example.com","password":"Passw0rd!"})
        token = r.json()["access_token"]
        H = {"Authorization": f"Bearer {token}"}
        # crear recurso
        r = await c.post(f"{BASE}/reports", json={"title":"Smoke"}, headers=H)
        assert r.status_code in (200,201)
        rid = r.json()["id"]
        # consultar
        r = await c.get(f"{BASE}/reports/{rid}", headers=H)
        assert r.status_code == 200
