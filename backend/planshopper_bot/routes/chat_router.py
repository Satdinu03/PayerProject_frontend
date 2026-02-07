from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from planshopper_bot.models.chatmodel import ChatRequest, ChatResponse, ErrorResponse
from planshopper_bot.services.azure_rag_service import AzureRAGService
import json

router = APIRouter(prefix="/api", tags=["chat"])

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        if not request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        rag_service = AzureRAGService()
        response = await rag_service.chat_completion(request.message, request.session_id)
        
        return response
        
    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"Configuration error: {str(e)}")
    except Exception as e:
        error_msg = str(e)
        if "timeout" in error_msg.lower():
            raise HTTPException(status_code=504, detail="Request timed out. Please try again.")
        elif "api error" in error_msg.lower():
            raise HTTPException(status_code=502, detail=f"External API error: {error_msg}")
        else:
            raise HTTPException(status_code=500, detail=f"Internal server error: {error_msg}")

@router.post("/chat/stream")
async def chat_stream_endpoint(request: ChatRequest):
    async def generate_stream():
        try:
            if not request.message.strip():
                error_data = json.dumps({"error": "Message cannot be empty"})
                yield f"data: {error_data}\n\n"
                return
            
            rag_service = AzureRAGService()
            async for chunk in rag_service.chat_completion_stream(request.message, request.session_id):
                chunk_data = json.dumps(chunk)
                yield f"data: {chunk_data}\n\n"
        except Exception as e:
            error_data = json.dumps({"error": str(e)})
            yield f"data: {error_data}\n\n"
        yield "data: [DONE]\n\n"
    
    return StreamingResponse(generate_stream(), media_type="text/plain", headers={
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
    })
