from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ChatRequest(BaseModel):
    message: str
    session_id: str

class StreamChunk(BaseModel):
    type: str  # 'content', 'done', 'error'
    content: Optional[str] = None
    done: bool = False
    error: Optional[str] = None

class Citation(BaseModel):
    content: str
    title: Optional[str] = None
    url: Optional[str] = None
    filepath: Optional[str] = None

class RetrievedChunk(BaseModel):
    content: str
    score: Optional[float] = None
    metadata: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    answer: str
    citations: List[Citation]
    retrieved_chunks: List[RetrievedChunk]
    token_usage: Optional[Dict[str, int]] = None
    has_table: bool = False
    table_data: Optional[str] = None

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
