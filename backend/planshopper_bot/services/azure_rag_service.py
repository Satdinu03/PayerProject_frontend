import os
import httpx
import re
import json
from typing import Dict, Any, List, Optional, Tuple, AsyncGenerator
from planshopper_bot.models.chatmodel import ChatResponse, Citation, RetrievedChunk, ErrorResponse
from planshopper_bot.utils.prompts import PLAN_SHOPPER_SYSTEM_PROMPT

class AzureRAGService:
    def __init__(self):
        self.azure_openai_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
        self.azure_openai_api_key = os.getenv("AZURE_OPENAI_API_KEY")
        self.azure_openai_deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT")
        self.azure_search_endpoint = os.getenv("AZURE_SEARCH_ENDPOINT")
        self.azure_search_index = os.getenv("AZURE_SEARCH_INDEX")
        self.azure_search_api_key = os.getenv("AZURE_SEARCH_API_KEY")
        
        self._validate_credentials()
    
    def _validate_credentials(self):
        required_vars = [
            "AZURE_OPENAI_ENDPOINT", "AZURE_OPENAI_API_KEY", "AZURE_OPENAI_DEPLOYMENT",
            "AZURE_SEARCH_ENDPOINT", "AZURE_SEARCH_INDEX", "AZURE_SEARCH_API_KEY"
        ]
        missing = [var for var in required_vars if not os.getenv(var)]
        if missing:
            raise ValueError(f"Missing required environment variables: {', '.join(missing)}")
    
    def _is_greeting_or_thanks(self, user_message: str) -> Optional[str]:
        message_lower = user_message.lower().strip()
        
        greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening']
        thanks = ['thank', 'thanks', 'thank you', 'appreciate']
        
        if any(greeting in message_lower for greeting in greetings):
            return "Hello! I'm your Plan Shopper assistant. I can help you find and compare Medicare plans, check drug coverage, find providers, and more. What would you like to know?"
        
        if any(thank in message_lower for thank in thanks):
            return "You're welcome! Feel free to ask if you have any other questions about Medicare plans."
        
        return None
    
    async def _is_medicare_related(self, user_message: str) -> bool:
        """Check if the question is related to Medicare/health insurance without RAG"""
        medicare_keywords = [
            'plan', 'medicare', 'insurance', 'health', 'coverage', 'benefit', 'drug', 'prescription',
            'provider', 'doctor', 'hospital', 'copay', 'deductible', 'premium', 'cost', 'network',
            'hmo', 'ppo', 'medicaid', 'cigna', 'formulary', 'pharmacy', 'medical', 'care'
        ]
        
        message_lower = user_message.lower()
        return any(keyword in message_lower for keyword in medicare_keywords)
    
    async def chat_completion(self, user_message: str, session_id: str) -> ChatResponse:
        # Check for greetings/thanks first
        greeting_response = self._is_greeting_or_thanks(user_message)
        if greeting_response:
            return ChatResponse(
                answer=greeting_response,
                citations=[],
                retrieved_chunks=[],
                token_usage=None,
                has_table=False,
                table_data=None
            )
        
        # Guardrail: Check if question is Medicare-related
        if not await self._is_medicare_related(user_message):
            return ChatResponse(
                answer="I'm a Medicare plan assistant and can only help with questions about health insurance plans, benefits, coverage, costs, and providers. Please ask me about Medicare plans or health insurance topics.",
                citations=[],
                retrieved_chunks=[],
                token_usage=None,
                has_table=False,
                table_data=None
            )
        
        try:
            url = f"{self.azure_openai_endpoint}/openai/deployments/{self.azure_openai_deployment}/chat/completions?api-version=2024-10-21"
            
            headers = {
                "Content-Type": "application/json",
                "api-key": self.azure_openai_api_key
            }
            
            payload = {
                "messages": [
                    {"role": "system", "content": PLAN_SHOPPER_SYSTEM_PROMPT},
                    {"role": "user", "content": user_message}
                ],
                "data_sources": [
                    {
                        "type": "azure_search",
                        "parameters": {
                            "endpoint": self.azure_search_endpoint,
                            "index_name": self.azure_search_index,
                            "authentication": {
                                "type": "api_key",
                                "key": self.azure_search_api_key
                            },
                            "top_n_documents": 6,
                            "query_type": "semantic"
                        }
                    }
                ]
            }
            
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(url, json=payload, headers=headers)
                response.raise_for_status()
                
                result = response.json()
                return self._parse_azure_response(result)
                
        except httpx.TimeoutException:
            raise Exception("Request timed out")
        except httpx.HTTPStatusError as e:
            raise Exception(f"Azure API error: {e.response.status_code} - {e.response.text}")
        except Exception as e:
            raise Exception(f"Unexpected error: {str(e)}")
    
    def _clean_answer(self, answer: str) -> str:
        answer = re.sub(r'\[doc\d+\]', '', answer)
        return answer.strip()
    
    def _extract_table(self, answer: str) -> Tuple[bool, Optional[str]]:
        if '|' in answer and '---' in answer:
            return True, answer
        return False, None
    
    def _parse_azure_response(self, result: Dict[str, Any]) -> ChatResponse:
        try:
            choice = result["choices"][0]
            message = choice["message"]
            
            answer = message.get("content", "")
            answer = self._clean_answer(answer)
            
            has_table, table_data = self._extract_table(answer)
            
            citations = []
            retrieved_chunks = []
            
            if "context" in message:
                context = message["context"]
                
                if "citations" in context:
                    for citation in context["citations"]:
                        citations.append(Citation(
                            content=citation.get("content", ""),
                            title=citation.get("title"),
                            url=citation.get("url"),
                            filepath=citation.get("filepath")
                        ))
                
                if "messages" in context:
                    for msg in context["messages"]:
                        if msg.get("role") == "tool":
                            retrieved_chunks.append(RetrievedChunk(
                                content=msg.get("content", ""),
                                metadata={"role": "tool"}
                            ))
            
            token_usage = None
            if "usage" in result:
                token_usage = {
                    "prompt_tokens": result["usage"].get("prompt_tokens", 0),
                    "completion_tokens": result["usage"].get("completion_tokens", 0),
                    "total_tokens": result["usage"].get("total_tokens", 0)
                }
            
            return ChatResponse(
                answer=answer,
                citations=citations,
                retrieved_chunks=retrieved_chunks,
                token_usage=token_usage,
                has_table=has_table,
                table_data=table_data
            )
            
        except KeyError as e:
            raise Exception(f"Unexpected response format: missing {e}")
        except Exception as e:
            raise Exception(f"Error parsing response: {str(e)}")
    
    async def chat_completion_stream(self, user_message: str, session_id: str) -> AsyncGenerator[Dict[str, Any], None]:
        # Check for greetings/thanks first
        greeting_response = self._is_greeting_or_thanks(user_message)
        if greeting_response:
            yield {"type": "content", "content": greeting_response, "done": True}
            return
        
        # Guardrail: Check if question is Medicare-related
        if not await self._is_medicare_related(user_message):
            response = "I'm a Medicare plan assistant and can only help with questions about health insurance plans, benefits, coverage, costs, and providers. Please ask me about Medicare plans or health insurance topics."
            yield {"type": "content", "content": response, "done": True}
            return
        
        try:
            url = f"{self.azure_openai_endpoint}/openai/deployments/{self.azure_openai_deployment}/chat/completions?api-version=2024-10-21"
            
            headers = {
                "Content-Type": "application/json",
                "api-key": self.azure_openai_api_key
            }
            
            payload = {
                "messages": [
                    {"role": "system", "content": PLAN_SHOPPER_SYSTEM_PROMPT},
                    {"role": "user", "content": user_message}
                ],
                "data_sources": [
                    {
                        "type": "azure_search",
                        "parameters": {
                            "endpoint": self.azure_search_endpoint,
                            "index_name": self.azure_search_index,
                            "authentication": {
                                "type": "api_key",
                                "key": self.azure_search_api_key
                            },
                            "top_n_documents": 6,
                            "query_type": "semantic"
                        }
                    }
                ],
                "stream": True
            }
            
            async with httpx.AsyncClient(timeout=60.0) as client:
                async with client.stream('POST', url, json=payload, headers=headers) as response:
                    response.raise_for_status()
                    
                    async for line in response.aiter_lines():
                        if line.startswith('data: '):
                            chunk_data = line[6:].strip()
                            if chunk_data == '[DONE]':
                                yield {"type": "done", "done": True}
                                break
                            
                            try:
                                chunk_json = json.loads(chunk_data)
                                if 'choices' in chunk_json and len(chunk_json['choices']) > 0:
                                    choice = chunk_json['choices'][0]
                                    if 'delta' in choice and 'content' in choice['delta']:
                                        content = choice['delta']['content']
                                        if content:
                                            yield {"type": "content", "content": content, "done": False}
                            except json.JSONDecodeError:
                                continue
                                
        except httpx.TimeoutException:
            yield {"type": "error", "error": "Request timed out"}
        except httpx.HTTPStatusError as e:
            yield {"type": "error", "error": f"Azure API error: {e.response.status_code}"}
        except Exception as e:
            yield {"type": "error", "error": f"Unexpected error: {str(e)}"}
