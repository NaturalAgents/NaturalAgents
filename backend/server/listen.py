from fastapi import FastAPI, HTTPException
from fastapi.middleware import Middleware
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any


app = FastAPI()


# Allow CORS for the frontend
origins = ["*"]  # Allow your frontend's URL



# Define a Pydantic model for the data to be received
class DataModel(BaseModel):
    content: str  # Adjust this field based on your expected data structure

@app.get("/")
def home():
    return {"message":"Health Check Passed!"}

@app.get("/api/data")
def read_data():
    return {"message": "Hello from the backend!"}

@app.post("/api/data")
def receive_data(data: DataModel):
    # Process the received data
    return {"message": "Data received", "content": data.content}


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
