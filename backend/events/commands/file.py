import asyncio
import base64
import fitz
import os

class File:
    def __init__(self, ws, node, run_instance):
        self.ws = ws
        self.node = node
        self.output = None
        self.user_input_future = None
        self.run_instance = run_instance

    async def emit(self):
        await self.ws.send_json({"request": "file", "type": self.node.file_type}) 

    def __processPDF(self, data):

        base64_data = data.split(",", 1)[1]
        pdf_data = base64.b64decode(base64_data)
        if not os.path.exists('/workspace/tmp'):
            os.mkdir('/workspace/tmp')
        
        file_path = '/workspace/tmp/tmp.pdf'
        with open(file_path, "wb") as pdf_file:
            pdf_file.write(pdf_data)


        text = ""
        doc = fitz.open(file_path)
        for page in doc:
            text += page.get_text()

        return text
        

    async def process(self):
        node = self.node
        if node.file_type == "PDF":
            await self.emit()
            self.user_input_future = asyncio.Future()
            self.run_instance.register_future("UserInput", self.user_input_future)

            user_input = await self.user_input_future                
            text = self.__processPDF(user_input)
            self.output = text
            info_request = "User uploaded {} with the following content\n\n{}".format(node.file_type, text)
            node.memory.queue_history(info_request, "user", node.node_type, node.id, visible=node.vis)


        