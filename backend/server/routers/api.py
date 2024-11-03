
from server.modeltypes import DataModel, HandleFolder, HandleFile, FileWrite
from fastapi import HTTPException, APIRouter
import shutil
import json 
import os

router = APIRouter()

@router.post("/data")
def receive_data(data: DataModel):
    # Process the received data
    # response = processPayload(data.content)
    response = "hello"

    return {"message": response}

@router.get("/directory-tree")
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

@router.post("/handle-folder")
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
    
@router.post("/handle-file")
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

@router.get("/retrieve-file")
def retrieve_file(path: str):
    file_path = os.path.join("/workspace/useragents", path)
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            text = file.read()
        return {"data": text}
    
    raise HTTPException(status_code=400, detail="File does not exist")

@router.post("/save-file")
def save_file(data: FileWrite):
    file_path = os.path.join("/workspace/useragents", data.path)
    if os.path.exists(file_path):
        text = json.dumps({"title": data.title, "text": data.text})
        with open(file_path, 'w') as file:
            file.write(text)
            return {"message": "success"}
        
    raise HTTPException(status_code=400, detail="File does not exist")
