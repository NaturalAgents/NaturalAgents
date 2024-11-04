from fastapi import WebSocket, APIRouter
from server.session.manager import Manager
import json 
import os

router = APIRouter()

KEY_MAP = {"OpenAI": "OPENAI_API_KEY", "Anthropic": "ANTHROPIC_API_KEY", "Gemini": "GEMINI_API_KEY"}

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
        {action: "set_api_key", llm_provider: "OpenAI", llm_api_key: "sk-test", type: "add"} # setup workspace if it doesn't exist
        {action: "get_config"}
        {action: "read", file: "/workspace/useragents/filename.txt"}
        {action: "ping_agent", msg: {}} # ping agent whether or not its waiting for a response
    
    """
    
    await websocket.accept()
    Manager.set_websocket(websocket)

    while True:
        data = await websocket.receive_text()
        data = json.loads(data)

        if data["action"] == "set_api_key":
            provider_name = data["llm_provider"]
            env_file_path = "/workspace/.env"
            

            if provider_name in KEY_MAP:
                provider_key_prefix = KEY_MAP[provider_name]
                if os.path.exists(env_file_path):
                    with open(env_file_path, "r") as env_file:
                        lines = env_file.readlines()

                    lines = [line for line in lines if not line.startswith(f"{provider_key_prefix}=")]
                else:
                    lines = []

                
                event_type = data["type"]

                # Add the new API key entry
                if event_type == "add":
                    llm_api_key = data["llm_api_key"]
                    lines.append(f"{provider_key_prefix}={llm_api_key}\n")
                

                # Write the updated content back to the .env file
                with open(env_file_path, "w") as env_file:
                    env_file.writelines(lines)

                await websocket.send_json({"config": f"'{provider_name}' provider {event_type}ed successfully!", "type": "sucess"})
            else:
                await websocket.send_json({"config": "Unsupported provider", "type": "error"})


        if data["action"] == "get_config":
            env_file_path = "/workspace/.env"
            providers = []
            if os.path.exists(env_file_path):
                with open(env_file_path, "r") as env_file:
                    lines = env_file.readlines()
                lines = [line.split("=")[0] for line in lines]
                KEY_MAP_INV =  {v: k for k, v in KEY_MAP.items()}
                providers = [KEY_MAP_INV[key_name] for key_name in lines]
            
            await websocket.send_json({"config": json.dumps(providers), "type": "info"})
            

        if data["action"] == "run":
            await Manager.incoming(data)

        if data["action"] == "ping_agent":
            await Manager.incoming(data)
