from fastapi import Request
from cache import cache
import time
import logging

logger = logging.getLogger(__name__)

class RateLimitMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, request: Request, call_next):
        # Get client IP
        client_ip = request.client.host if request.client else "unknown"
        
        # Rate limit key
        rate_limit_key = f"rate_limit:{client_ip}"
        
        # Get current count
        current_count = cache.get(rate_limit_key) or 0
        
        # Check limit (1000 requests per hour)
        if current_count >= 1000:
            return {"error": "Rate limit exceeded"}, 429
        
        # Increment counter
        cache.set(rate_limit_key, current_count + 1, ttl=3600)
        
        response = await call_next(request)
        response.headers["X-RateLimit-Remaining"] = str(1000 - current_count - 1)
        
        return response

class CacheInvalidationMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, request: Request, call_next):
        response = await call_next(request)
        
        # Invalidate incentives cache on POST/PUT/DELETE
        if request.method in ["POST", "PUT", "DELETE"] and "/incentives" in request.url.path:
            cache.clear_pattern("incentives:*")
            logger.info("Invalidated incentives cache")
        
        return response
