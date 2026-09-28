import httpx
import asyncio

async def test():
    async with httpx.AsyncClient() as client:
        # Register a test user
        register_data = {"name": "Test User", "email": "testai@example.com", "password": "password"}
        resp = await client.post("http://127.0.0.1:8000/api/auth/register", json=register_data)
        if resp.status_code == 400: # Already exists
            pass
        
        # Login
        login_data = {"email": "testai@example.com", "password": "password"}
        resp = await client.post("http://127.0.0.1:8000/api/auth/login", json=login_data)
        token = resp.json()["access_token"]
        
        # Call AI
        headers = {"Authorization": f"Bearer {token}"}
        payload = {"prompt": "say hello", "model": "llama3.2"}
        resp = await client.post("http://127.0.0.1:8000/api/ai/generate", json=payload, headers=headers, timeout=60)
        
        print(f"Status Code: {resp.status_code}")
        print(f"Response: {resp.text}")

asyncio.run(test())
