import asyncio


class UserInput:
    def __init__(self, ws, node, run_instance):
        self.ws = ws
        self.node = node
        self.input = None
        self.output = None
        self.user_input_future = None
        self.run_instance = run_instance



    async def emit(self):
        await self.ws.send_json({"request": "userinput", "msg": self.node.prompt}) 


    async def process(self):
        node = self.node
        self.input = node.prompt
        await self.emit()
        
        self.user_input_future = asyncio.Future()
        self.run_instance.register_future("UserInput", self.user_input_future)

        user_input = await self.user_input_future

        info_request = "Information requested from user: {}\n\nUser response: {}".format(node.prompt, user_input)
        node.memory.queue_history(info_request, "user", node.node_type, node.id, visible=node.vis)
        self.output = info_request
