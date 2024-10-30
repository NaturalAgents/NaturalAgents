from server.modeltypes import DataModel, HandleFolder, HandleFile, FileWrite
from fastapi import FastAPI, HTTPException, WebSocket, Security, Query
from fastapi.security import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from server.session.manager import Manager
import shutil
import json 
import os

app = FastAPI()

KEY_MAP = {"OpenAI": "OPENAI_API_KEY", "Anthropic": "ANTHROPIC_API_KEY"}

# Allow CORS for the frontend
origins = ["*"]  # Allow your frontend's URL
api_key_header = APIKeyHeader(name="X-API-Key")


@app.get("/")
def home():
    return {"message":"Health Check Passed!"}

@app.post("/api-key")
def write_api_key(
    api_key_header: str = Security(api_key_header), 
    provider_name: str = Query("provider_name", description="Name of the API key to store in .env")
):
    env_file_path = "/workspace/.env"

    if provider_name in KEY_MAP:
        provider_key_prefix = KEY_MAP[provider_name]
    else:
        return {"message": "Unsupported provider"}

    try:
        if os.path.exists(env_file_path):
            with open(env_file_path, "r") as env_file:
                lines = env_file.readlines()

            # Filter out any line that starts with the key name followed by '='
            lines = [line for line in lines if not line.startswith(f"{provider_key_prefix}=")]
        else:
            lines = []

        # Add the new API key entry
        lines.append(f"{provider_key_prefix}={api_key_header}")

        # Write the updated content back to the .env file
        with open(env_file_path, "w") as env_file:
            env_file.writelines(lines)

        return {"message": f"'{provider_name}' provider added successfully!"}

    
    except Exception as e:
        return {"message": "Unexpected error occured :("}




@app.post("/api/data")
def receive_data(data: DataModel):
    # Process the received data
    # response = processPayload(data.content)
    response = "hello"

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

    print(data)

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
def retrieve_file(path: str):
    file_path = os.path.join("/workspace/useragents", path)
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            text = file.read()
        return {"data": text}
    
    raise HTTPException(status_code=400, detail="File does not exist")



@app.post("/api/save-file")
def save_file(data: FileWrite):
    file_path = os.path.join("/workspace/useragents", data.path)
    if os.path.exists(file_path):
        text = json.dumps({"title": data.title, "text": data.text})
        with open(file_path, 'w') as file:
            file.write(text)
            return {"message": "success"}
        
    raise HTTPException(status_code=400, detail="File does not exist")


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
        {action: "initialize"} # setup workspace if it doesn't exist
        {action: "read", file: "/workspace/useragents/filename.txt"}
        {action: "read", file: "/workspace/useragents/filename.txt"}
        {action: "run", content: {}} # run recipe
        {action: "ping_agent", msg: {}} # ping agent whether or not its waiting for a response
    
    """
    
    await websocket.accept()
    Manager.set_websocket(websocket)

    while True:
        data = await websocket.receive_text()
        data = json.loads(data)

        if data["action"] == "set_api_key":
            provider_name = data["llm_provider"]
            llm_api_key = data["llm_api_key"]
            env_file_path = "/workspace/.env"

            if provider_name in KEY_MAP:
                provider_key_prefix = KEY_MAP[provider_name]
                if os.path.exists(env_file_path):
                    with open(env_file_path, "r") as env_file:
                        lines = env_file.readlines()

                    # Filter out any line that starts with the key name followed by '='
                    lines = [line for line in lines if not line.startswith(f"{provider_key_prefix}=")]
                else:
                    lines = []

                # Add the new API key entry
                lines.append(f"{provider_key_prefix}={llm_api_key}\n")

                # Write the updated content back to the .env file
                print(lines)
                with open(env_file_path, "w") as env_file:
                    env_file.writelines(lines)

                await websocket.send_json({"message": f"'{provider_name}' provider added successfully!"})
            else:
                await websocket.send_json({"message": "Unsupported provider"})


        if data["action"] == "get_config":
            providers = []
            if os.path.exists(env_file_path):
                with open(env_file_path, "r") as env_file:
                    lines = env_file.readlines()
                lines = [line.split("=")[0] for line in lines]
                KEY_MAP_INV =  {v: k for k, v in KEY_MAP.items()}
                providers = [KEY_MAP_INV[key_name] for key_name in lines]
            
            await websocket.send_json({"config": json.dumps(providers)})
            

        if data["action"] == "run":
            await Manager.incoming(data)

        if data["action"] == "ping_agent":
            await Manager.incoming(data)


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
