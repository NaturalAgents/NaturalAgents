from fastapi import  APIRouter, Security, Query
from fastapi.security import APIKeyHeader
import os

KEY_MAP = {"OpenAI": "OPENAI_API_KEY", "Anthropic": "ANTHROPIC_API_KEY"}
api_key_header = APIKeyHeader(name="X-API-Key")

router = APIRouter()

@router.post("/")
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

