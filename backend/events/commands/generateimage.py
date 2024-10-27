from litellm import image_generation
from dotenv import load_dotenv
load_dotenv("/workspace/.env")


class GenerateImage:
    def __init__(self, ws, node):
        self.ws = ws
        self.input = None
        self.output = None
        self.node = node

    def generate_image(self, prompt, model='dall-e-2'):
        response = image_generation(model=model, prompt=prompt)
        url = response["data"][0]['url']
        return url

    async def emit(self):
        await self.ws.send_json( {"output": f"![generated image]({self.output})"})

    async def process(self):
        node = self.node
        self.input = node.prompt
        image = self.generate_image(node.prompt)
        self.output = image
        node.memory.queue_history(node.prompt, "user", node.node_type, node.id, visible=node.vis, image=True)
        node.memory.queue_history(image, "assistant", node.node_type, node.id, visible=node.vis, image=True)

        if node.vis:
            await self.emit()