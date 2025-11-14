from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routers import auth, incentives, builders, submissions, admin, saved_searches, marketing
from middleware import RateLimitMiddleware, CacheInvalidationMiddleware

app = FastAPI(title=settings.PROJECT_NAME, version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add middleware
app.add_middleware(CacheInvalidationMiddleware)
app.add_middleware(RateLimitMiddleware)

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Include routers
app.include_router(auth.router, prefix=settings.API_V1_STR, tags=["Auth"])
app.include_router(incentives.router, prefix=settings.API_V1_STR, tags=["Incentives"])
app.include_router(builders.router, prefix=settings.API_V1_STR, tags=["Builders"])
app.include_router(submissions.router, prefix=settings.API_V1_STR, tags=["Submissions"])
app.include_router(admin.router, prefix=settings.API_V1_STR, tags=["Admin"])
app.include_router(saved_searches.router, prefix=settings.API_V1_STR, tags=["Saved Searches"])
app.include_router(marketing.router, prefix=settings.API_V1_STR, tags=["Marketing"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
