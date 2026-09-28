from pydantic import BaseModel
from typing import List

class AIGenerateRequest(BaseModel):
    prompt: str
    model: str = "llama3.2"

class AIGenerateResponse(BaseModel):
    title: str
    content: str
    tags: List[str]
