import uuid 
from events.run import Run
from fastapi import WebSocket
import asyncio


class Manager:
    session = {}
    websocket: WebSocket
    
    @classmethod
    def set_websocket(self, websocket):
        self.websocket = websocket

    @classmethod
    def create_agent_session(self):
        sid = str(uuid.uuid4())
        self.session[sid] = Run(sid)
        return sid

    @classmethod
    async def incoming(self, data):
        if data["action"] == "run":
            content = data["content"]
            sid = Manager.create_agent_session()
            asyncio.create_task(self.session[sid].run(content, self.websocket))
            await self.websocket.send_json({"sid": sid})

        if data["action"] == "ping":
            content = data["content"]
            sid = data["sid"]
            self.session[sid].set_user_info(content)
            

    @classmethod
    async def dispatch(self, msg):
        await self.websocket.send(msg)
