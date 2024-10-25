import json
from events.commands.mention import Mention
from events.controllgraph.BlockHolds import BlockHolds
from events.controllgraph.BlockNode import BlockNode
from events.commands.file import File
from events.commands.userinput import UserInput
from events.commands.paragraph import Paragraph
from events.commands.summarize import Summarize
from events.commands.generate import Generate
from events.commands.generateimage import GenerateImage
import asyncio 



ACTION_TYPES = {"<command>:generate", 
                "<command>:image_generation", 
                "<command>:summarize", 
                "<command>:userinput",
                "file",
                "paragraph"}



class Run:
    state: str
    sid: str
    user_inputs: list[str]
    user_input_future = asyncio.Future()
    future_registry: dict[str, asyncio.Future] = {}

    def __init__(self, sid):
        self.blockholds = BlockHolds()
        self.state = "idle"
        self.sid = sid

    def process_plan(self, editor_content):
        def get_node(item):
            id = item["id"]
            if item["type"] == "bubble":
                node = BlockNode(id=id, node_type=item["props"]["text"], prompt=item["content"][0]["text"], vis=item["props"]["vis"])
            elif item['type'] == 'noparam':
                node = BlockNode(id=id, node_type=item["props"]["text"], vis=item["props"]["vis"])
            elif item['type'] == 'file':
                node = BlockNode(id=id, node_type=item["type"], file_type=item["props"]["fileType"], vis=item["props"]["vis"])
            elif item['type'] == 'mention':
                node = BlockNode(id=id, node_type=item["type"], vis=item["props"]["vis"])
                node.add_mention(item["props"]["blockID"], item["props"]["nodeID"])
            else:
                content = item["content"][0]["text"] if item["content"] else ""
                node = BlockNode(id=id, node_type='paragraph', prompt=content)

            return node

        def search(node: BlockNode, content):
            for item in content:
                new_node = get_node(item) 
                node.add_child(new_node) 

                if 'children' in item and item['children']:
                    search(new_node, item['children']) 

        for count, item in enumerate(editor_content):
            node = get_node(item)
            self.blockholds.add_node(count, item["id"], node)

            if 'children' in item and item['children']:
                search(node, item['children'])


    async def emit(self, websocket, msg):
        await websocket.send_json(msg)

    async def dfs(self, node: BlockNode, parent_history, indexed_parent_history, websocket):
        node.initialize_memory(history=parent_history, indexed_history=indexed_parent_history)
        history = node.memory.get_history()
        process = True

        if node.node_type == "<command>:generate":
            node.processor = Generate(websocket, node)

        elif node.node_type == "<command>:image_generation":
            node.processor = GenerateImage(websocket, node)

        elif node.node_type == "<command>:summarize":
            node.processor = Summarize(websocket, node)

        elif node.node_type == "<command>:userinput":
            node.processor = UserInput(websocket, node, self)

        elif node.node_type == "file":
            node.processor = File(websocket, node, self)
            
        elif node.node_type == "paragraph":
            node.processor = Paragraph(websocket, node)

        elif node.node_type == "mention":
            node.processor = Mention(websocket, node, self.blockholds)
        else:
            await self.emit(websocket, {"output": "command is not supported"})
            process = False

        if process:
            await node.processor.process()


        history = node.memory.get_history()
        for child in node.children:
            await self.dfs(child, history, node.memory.indexed_history, websocket)


    async def run(self, payload, websocket):
        obj = json.loads(payload)    
        self.process_plan(obj)

        self.blockholds.visualize_all()
        self.state = "running"


        num_blocks = self.blockholds.get_num_blocks()
        for i in range(num_blocks):
            block = self.blockholds.get_block(i)
            await self.dfs(block, [], {}, websocket)

        await websocket.send_json({"finished": True})
           

    def register_future(self, identifier: str, future: asyncio.Future):
        """Registers a future to be fulfilled by a message."""
        self.future_registry[identifier] = future



    def set_user_info(self, user_info):
        for i in self.future_registry:
            self.future_registry[i].set_result(user_info["msg"])

        self.future_registry.clear()


if __name__ == "__main__":
    json_data='[{"id":"f284bedc-4878-4910-adef-b57a7ad08c86","type":"file","props":{"fileUrl":"","fileType":"PDF","send":false,"sid":"","vis":true},"content":[],"children":[{"id":"f6f51d1a-d652-451f-b6ab-b06f4ca727e8","type":"noparam","props":{"text":"<command>:summarize","color":"blue","vis":true},"content":[],"children":[]}]},{"id":"656087a0-82a7-4e71-9aa0-628e9d4eae23","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[],"children":[]}]'
    json_data = json.loads(json_data)

    run = Run(123312)

    run.process_plan(json_data)
    run.blockholds.visualize_all()


