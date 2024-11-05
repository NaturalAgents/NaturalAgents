from litellm import completion
from dotenv import load_dotenv

load_dotenv("/workspace/.env")

class Generate:
    def __init__(self, ws, node):
        self.input = None
        self.output = None
        self.ws = ws
        self.node = node

    async def emit(self):
        await self.ws.send_json({"output": self.output})

    def text_generate(self, prompt, system=None, model="gpt-4o", history=[]):
        msg_history = history.copy()
        messages = []
        
        # Including all previous history; possibly a better idea to perform RAG for the necessary context?
        for msg in msg_history:
            messages.append(msg)
            if messages[-1]["content"][-1]["type"] == "image_url":
                messages[-1]["role"] = "user" 

        if system:
            messages.append({"content": system, "role": "system"})
        

        messages.append({ "content": prompt,"role": "user"})
        response = completion(model=model, messages=messages)
        return response['choices'][0]['message']['content']



    async def process(self):
        node = self.node
        history = node.memory.get_history()
        self.input = node.prompt
        response = self.text_generate(node.prompt, history=history, model=node.provider)
        self.output = response
        node.memory.queue_history(node.prompt, "user", node.node_type, node.id, visible=node.vis)
        node.memory.queue_history(response, "assistant", node.node_type, node.id, visible=node.vis)

        if node.vis:
            await self.emit()

