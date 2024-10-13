import json
from typing import List
from memory.memory import Memory
from events.tools import generate_image, text_generate, summarize
from events.PROMPTS import SUMMARY_PROMPT
import asyncio 

ACTION_TYPES = {"<command>:generate", "<command>:image_generation", "<command>:summarize", "<command>:userinput"}

class Run:
    memory: Memory
    state: str
    sid: str
    user_inputs: List[str]

    user_input_future = asyncio.Future()


    def __init__(self, sid):
        self.memory = Memory()
        self.state = "idle"
        self.sid = sid
        self.user_inputs = []



    def process_plan(self, editor_content):
        vertical_bubbles = []

        def search_bubbles(content):
            current_chain = []

            for item in content:
                if item['type'] == 'bubble':
                    current_chain.append((item["props"]["text"], item["content"][0]["text"]))
                    
                    

                if item["type"] == 'noparam':
                    current_chain.append((item["props"]["text"],))
                

                if 'children' in item and item['children']:
                    child_bubbles = search_bubbles(item['children'])
                    current_chain.extend(child_bubbles)


            return current_chain

        for item in editor_content:
            if item['type'] == 'bubble':
                chain = [(item["props"]["text"], item["content"][0]["text"])]
                if 'children' in item and item['children']:
                    child_bubbles = search_bubbles(item['children'])
                    chain.extend(child_bubbles)
                vertical_bubbles.append(chain)

        return vertical_bubbles


    
    async def run(self, payload, websocket):
        obj = json.loads(payload)    
        bubbles_blocks = self.process_plan(obj)
        self.state = "running"


        for block in bubbles_blocks:
            self.memory.create_node_history()

            for item in block:
                image = False
            
                chat_history = self.memory.latest_node_history()
                if item[0] == "<command>:generate":
                    response = text_generate(item[1], history=chat_history)
                    self.memory.add_node_history(item[1], "user", item[0])

                elif item[0] == "<command>:image_generation":
                    response = generate_image(item[1])
                    self.memory.add_node_history(item[1], "user", item[0])
                    image = True

                elif item[0] == "<command>:summarize":
                    response = summarize(history=chat_history)
                    self.memory.add_node_history(SUMMARY_PROMPT, "user", item[0])

                elif item[0] == "<command>:userinput":
                    response = {"request": item[1]}
                    self.state = "pending"
                    await websocket.send_json({"request": "userinput", "msg": item[1]})

                    self.state = "running"
                    user_input = await self.user_input_future
                    self.user_inputs.append(user_input)
                    info_request = "Information requested from user: {}\n\n User response: {}".format(item[1], user_input)
                    self.memory.add_node_history(info_request, "user", item[0])
                    continue

                else:
                    response = "command is not supported"

                self.memory.add_node_history(response, "assistant", item[0], image=image)


        
        output = self.memory.markdown_response()
        self.state = "finished"
        await websocket.send_json({"output": output})
        await websocket.send_json({"finished": True})

        

    def set_user_info(self, user_info):
        loop = asyncio.get_running_loop()
        loop.call_soon_threadsafe(self.user_input_future.set_result, user_info["msg"])


if __name__ == "__main__":
    json_data = [
    {
        "id": "91d0f522-fa6b-4a8c-84aa-e5a8858394e5",
        "type": "bubble",
        "props": {"text": "<command>:image_generation", "color": "green"},
        "content": [{"type": "text", "text": "Create an image of a fox breathing fire", "styles": {}}],
        "children": [
            {
                "id": "cdd32dc7-afed-4cab-91e9-5af12af13a8c",
                "type": "bubble",
                "props": {"text": "<command>:generate", "color": "blue"},
                "content": [{"type": "text", "text": "Write a description of the image above", "styles": {}}],
                "children": []
            }
        ]
    },
    {
        "id": "c458173e-1262-479b-ad48-5be21b74f092",
        "type": "bubble",
        "props": {"text": "<command>:another_action", "color": "red"},
        "content": [{"type": "text", "text": "Perform another action", "styles": {}}],
        "children": []
    }
]

    json_data="""[{"id":"bf9aca76-267e-4e83-8de6-31676d6df7e8","type":"bubble","props":{"text":"<command>:generate","color":"blue"},"content":[{"type":"text","text":"hello","styles":{}}],"children":[{"id":"4b06e705-313b-4fff-97d9-7711a1036ec5","type":"noparam","props":{"text":"<command>:summarize","color":"blue"},"content":[],"children":[]}]},{"id":"2931e7fc-27ff-4cb8-8379-3308267ccef7","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[],"children":[]}]"""
    json_data = json.loads(json_data)


    bubbles = Run().process_plan(json_data)
    print(bubbles[0])


