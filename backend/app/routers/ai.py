from fastapi import APIRouter, Depends, HTTPException, status
import httpx
import json
from app.models.user import User
from app.schemas.ai import AIGenerateRequest, AIGenerateResponse
from app.dependencies.auth import get_current_user

router = APIRouter(
    prefix="/api/ai",
    tags=["AI Assistant"]
)

OLLAMA_URL = "http://localhost:11434/api/generate"

SYSTEM_PROMPT = """You are an empathetic personal diary assistant. Based on the user's prompt, generate a thoughtful diary entry.
Return EXACTLY a JSON object with this structure:
{
  "title": "A short, engaging title",
  "content": "The full diary entry content in markdown format",
  "tags": ["tag1", "tag2"]
}
Do not return any markdown code blocks (like ```json), just the raw JSON object."""

@router.post("/generate", response_model=AIGenerateResponse)
async def generate_diary_entry(request: AIGenerateRequest, current_user: User = Depends(get_current_user)):
    payload = {
        "model": request.model,
        "prompt": request.prompt,
        "system": SYSTEM_PROMPT,
        "stream": False,
        "format": "json"
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(OLLAMA_URL, json=payload, timeout=60.0)
            
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to generate content with Ollama.")
            
        data = response.json()
        result_text = data.get("response", "")
        
        # Parse the JSON from the model
        try:
            parsed = json.loads(result_text)
            return AIGenerateResponse(**parsed)
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Model returned invalid JSON format.")
            
    except httpx.RequestError:
        raise HTTPException(
            status_code=503, 
            detail="Could not connect to local Ollama instance. Is it running on port 11434?"
        )
