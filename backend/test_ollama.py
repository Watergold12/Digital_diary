import httpx
import asyncio

async def test():
    OLLAMA_URL = "http://localhost:11434/api/generate"
    # Try 127.0.0.1 too
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(OLLAMA_URL, json={"model": "llama3.2", "prompt": "hi", "stream": False}, timeout=10)
            print(f"localhost: {resp.status_code}")
    except Exception as e:
        print(f"localhost error: {e}")
        
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post("http://127.0.0.1:11434/api/generate", json={"model": "llama3.2", "prompt": "hi", "stream": False}, timeout=10)
            print(f"127.0.0.1: {resp.status_code}")
    except Exception as e:
        print(f"127.0.0.1 error: {e}")

asyncio.run(test())
