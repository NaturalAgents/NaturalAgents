
from pydantic import BaseModel
from typing import Optional


class DataModel(BaseModel):
    content: str  # Adjust this field based on your expected data structure

class HandleFolder(BaseModel):
    path: str
    name: str
    action: str
    new_name: str = ""

class HandleFile(BaseModel):
    path: str
    name: str
    action: str
    new_name : str = ""

class FileWrite(BaseModel):
    path: str
    title: str
    text: str
