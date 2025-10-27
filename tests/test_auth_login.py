import httpx, os, pytest
BASE = os.getenv("API", "http://localhost:8000")

@pytest.mark.asyncio
async def test_login_flow():
    async with httpx.AsyncClient() as c:
        # 1) signup (si aplica) o usa un seed user
        payload = {"email":"test@example.com","password":"Passw0rd!"}
        await c.post(f"{BASE}/auth/signup", json=payload)  # ignora si 409
        # 2) login
        r = await c.post(f"{BASE}/auth/login", json=payload)
        assert r.status_code == 200
        token = r.json().get("access_token")
        assert token
        # 3) recurso protegido
        r2 = await c.get(f"{BASE}/me", headers={"Authorization": f"Bearer {token}"})
        assert r2.status_code == 200
