class Mention:
    def __init__(self, ws, node, blockholds):
        self.ws = ws
        self.node = node
        self.output = None
        self.blockholds = blockholds

    async def emit(self):
        await self.ws.send_json({"output": self.output})


    async def process(self):
        node = self.node
        if node.mention != None:
            value = self.blockholds.retrieve_mention(node.mention[0], node.mention[1])
            self.output = value
            if node.vis:
                await self.emit()