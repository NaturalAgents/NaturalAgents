from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from events.run import processPayload
import json 

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
    response = processPayload(data.content)

    return {"message": response}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
        {action: "initialize"} # setup workspace if it doesn't exist
        {action: "read", file: "/workspace/useragents/filename.txt"}
        {action: "read", file: "/workspace/useragents/filename.txt"}
        {action: "run"}
        {action: ""}
    
    """
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        data = json.loads(data)
        if data["action"] == "run":
            response = processPayload(data.content)
            await websocket.send_text({"message": json.dumps(response)})

        else:
            await websocket.send_text({"message": "action not supported"})
        



        



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
