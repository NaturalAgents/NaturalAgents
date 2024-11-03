from .routers import api, ws, api_key
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

#Include routers
app.include_router(api_key.router, prefix="/api-key", tags=["api-key"])
app.include_router(api.router, prefix="/api", tags=["api"])
app.include_router(ws.router, prefix="/ws", tags=["ws"])

# Allow CORS for the frontend
origins = ["*"]  # Allow your frontend's URL

@app.get("/")
def home():
    return {"message":"Health Check Passed!"}

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
