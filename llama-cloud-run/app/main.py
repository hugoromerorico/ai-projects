from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import ollama
from typing import List

app = FastAPI()

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    model: str = "llama3.2:1b"

class ChatResponse(BaseModel):
    content: str

@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    try:
        response = ollama.chat(
            model=request.model,
            messages=[message.dict() for message in request.messages]
        )
        return ChatResponse(content=response['message']['content'])
    except ollama.ResponseError as e:
        raise HTTPException(status_code=e.status_code, detail=e.error)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
