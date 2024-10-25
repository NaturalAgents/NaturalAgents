class Paragraph:
    def __init__(self, ws, node):
        self.ws = ws
        self.node = node

    async def emit(self):
        await self.ws.send_json({"output": self.node.prompt}) 
        
    async def process(self):
        await self.emit()