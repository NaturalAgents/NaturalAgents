from server.modeltypes import DataModel, HandleFolder, HandleFile, FileReadWrite
from fastapi import FastAPI, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from events.run import processPayload
import shutil
import json 
import os

app = FastAPI()


# Allow CORS for the frontend
origins = ["*"]  # Allow your frontend's URL


@app.get("/")
def home():
    return {"message":"Health Check Passed!"}


@app.post("/api/data")
def receive_data(data: DataModel):
    # Process the received data
    response = processPayload(data.content)

    return {"message": response}

@app.get("/api/directory-tree")
def get_directory_tree(path: str = "."):
    base_path = "/workspace/useragents"
    try:
        full_path = os.path.join(base_path, path)
        tree = []
        for entry in os.scandir(full_path):
            relative_path = os.path.relpath(entry.path, base_path)
            tree.append({
                "name": entry.name,
                "path": f"./{relative_path}",
                "is_file": entry.is_file(),
                "is_directory": entry.is_dir(),
            })

        return {"tree": tree}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/handle-folder")
def handle_folder(data: HandleFolder):
    base_path = os.path.join("/workspace/useragents", data.path)

    if data.action == "create":
        folder_path = os.path.join(base_path, data.name)

        # If the folder already exists, add a suffix like (1), (2), etc.
        if os.path.exists(folder_path):
            index = 1
            while os.path.exists(f"{folder_path}({index})"):
                index += 1
            folder_path = f"{folder_path}({index})"

        try:
            os.makedirs(folder_path, exist_ok=True)
            return {"message": f"Folder created successfully at {folder_path}"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

        
    elif data.action == "rename":
        if not data.new_name:
            raise HTTPException(status_code=400, detail="New name is required for renaming")

        old_folder_path = os.path.join(base_path, data.name)
        new_folder_path = os.path.join(base_path, data.new_name)

        if not os.path.exists(old_folder_path):
            raise HTTPException(status_code=404, detail="Folder does not exist")

        # If the new folder name already exists, add a suffix like (1), (2), etc.
        if os.path.exists(new_folder_path):
            index = 1
            while os.path.exists(f"{new_folder_path}({index})"):
                index += 1
            new_folder_path = f"{new_folder_path}({index})"

        try:
            os.rename(old_folder_path, new_folder_path)
            return {"message": f"Folder renamed successfully to {os.path.basename(new_folder_path)}"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    elif data.action == "delete":
        folder_path = os.path.join(base_path, data.name)

        if not os.path.exists(folder_path):
            raise HTTPException(status_code=404, detail="Folder does not exist")

        if not os.path.isdir(folder_path):
            raise HTTPException(status_code=400, detail="Path is not a folder")

        try:
            shutil.rmtree(folder_path)  # Deletes the entire folder, even if it's not empty
            return {"message": "Folder deleted successfully"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    raise HTTPException(status_code=500, detail="Action is not supported")
    

@app.post("/api/handle-file")
def handle_file(data: HandleFile):
    base_path = os.path.join("/workspace/useragents", data.path)

    if data.action == "create":
        try:
            file_path = os.path.join(base_path, data.name)

            if os.path.exists(file_path):
                base_name, ext = os.path.splitext(data.name)
                index = 1
                while os.path.exists(os.path.join(base_path, f"{base_name}({index}){ext}")):
                    index += 1
                file_path = os.path.join(base_path, f"{base_name}({index}){ext}")
                
            with open(file_path, 'w') as _:
                pass
            
            return {"message": "File created successfully"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        
    elif data.action == "rename":
        if not data.new_name:
            raise HTTPException(status_code=400, detail="New name is required for renaming")

        old_file_path = os.path.join(base_path, data.name)
        new_file_path = os.path.join(base_path, data.new_name)

        if not os.path.exists(old_file_path):
            raise HTTPException(status_code=404, detail="File does not exist")

        # If the new file name already exists, add a suffix like (1), (2), etc.
        if os.path.exists(new_file_path):
            base_name, ext = os.path.splitext(data.new_name)
            index = 1
            while os.path.exists(os.path.join(base_path, f"{base_name}({index}){ext}")):
                index += 1
            new_file_path = os.path.join(base_path, f"{base_name}({index}){ext}")

        try:
            os.rename(old_file_path, new_file_path)
            return {"message": f"File renamed successfully to {os.path.basename(new_file_path)}"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    elif data.action == "delete":
        file_path = os.path.join(base_path, data.name)

        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File does not exist")

        if not os.path.isfile(file_path):
            raise HTTPException(status_code=400, detail="Path is not a file")

        try:
            os.remove(file_path)  # Deletes the file
            return {"message": "File deleted successfully"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    raise HTTPException(status_code=400, detail="Action is not supported")


@app.get("/api/retrieve-file")
def retrieve_file(data: FileReadWrite):
    base_path = os.path.join("/workspace/useragents", data.path)
    file_path = os.path.join(base_path, data.name)
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            text = file.read()
        return {"data": text}
    
    raise HTTPException(status_code=400, detail="File does not exist")



@app.post("/api/save-file")
def save_file(data: FileReadWrite):
    base_path = os.path.join("/workspace/useragents", data.path)
    file_path = os.path.join(base_path, data.name)
    if os.path.exists(file_path):
        with open(file_path, 'w') as file:
            file.write(data.text)
            return {"message": "success"}
        
    raise HTTPException(status_code=400, detail="File does not exist")


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
    print("connection")
    # print("room_id", room_id)
    while True:
        data = await websocket.receive_text()
        print(data)
        await websocket.send_text(f"Message text was: {data}")

        # if data["action"] == "run":
        #     response = processPayload(data.content)
        #     await websocket.send_text({"message": json.dumps(response)})

        # else:
        #     await websocket.send_text({"message": "action not supported"})
        



        



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
