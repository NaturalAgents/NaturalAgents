import json
from typing import List
from events.commands.paragraph import Paragraph
from events.commands.summarize import Summarize
from memory.history import ShortTermMemory
from events.commands.generate import Generate
from events.commands.generateimage import GenerateImage
from events.tools import generate_image, text_generate, summarize, processPDF
from events.PROMPTS import SUMMARY_PROMPT
import asyncio 



ACTION_TYPES = {"<command>:generate", 
                "<command>:image_generation", 
                "<command>:summarize", 
                "<command>:userinput",
                "file",
                "paragraph"}


class BlockNode:
    def __init__(self, id: str, node_type: str, prompt: str = None, file_type: str = None, vis: bool = False):
        self.id = id
        self.node_type = node_type  # type of the node (e.g., <command>:generate)
        self.prompt = prompt  # prompt text for certain types of nodes
        self.file_type = file_type  # fileType for file nodes
        self.vis = vis  # visibility
        self.children = []
        self.mention = None
        self.incoming = []
        self.memory = None
        self.processor = None

    def add_child(self, child: 'BlockNode'):
        self.children.append(child)


    def add_mention(self, graph_id: str, node_id: str):
        if self.node_type == "mention":
            self.mention = (graph_id, node_id)


    def initialize_memory(self, history=[], indexed_history={}):
        self.memory = ShortTermMemory(history=history, indexed_history=indexed_history)


    def retrieve_mention(self, nodeID):
        if nodeID in self.memory.indexed_history:
            return self.memory.indexed_history[nodeID]

        return None

class BlockHolds:
    def __init__(self):
        self.blocks = {}
        self.order = {}
        self.mention_exists = {}
        self.memory = {}

    def add_node(self, order, node_id, node: BlockNode):
        self.order[order] = node_id
        self.blocks[node_id] = node
        self.mention_exists[node_id] = False

    def get_num_blocks(self):
        return len(self.order.keys())
    
    def get_block(self, order_num):
        if order_num in self.order:
            graph_id = self.order[order_num]
            return self.blocks[graph_id]
        return None

    def visualize_node(self, node: BlockNode, depth: int = 0):
        """ Recursively visualize a node and its children. """    
        indent = "    " * depth  # Indent for tree structure
        print(f"{indent}- Node ID: {node.id}, Type: {node.node_type}, Prompt: {node.prompt}")

        for child in node.children:
            self.visualize_node(child, depth + 1)


    def visualize_all(self):
        """ Visualize all nodes in BlockHolds by iterating through the root nodes. """
        print("\nVisualizing BlockHolds...\n")
        for count, node_id in enumerate(self.blocks):
            node = self.blocks[node_id]
            print(f"Block {count + 1}")
            self.visualize_node(node, 0)
            print("\n")

        print("\nVisualization complete.")

    def retrieve_mention(self, blockID, nodeID):
        def find_node(node: BlockNode):
            if nodeID == node.id:
                return node.retrieve_mention(nodeID)
            
            for child in node.children:
                find_node(child)
            
        if blockID in self.blocks:
            return find_node(self.blocks[blockID])

        return None


class Run:
    state: str
    sid: str
    user_inputs: List[str]
    user_input_future = asyncio.Future()


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
        image = False
        skip_response = False

        if node.node_type == "<command>:generate":
            node.processor = Generate(websocket, node)
            await node.processor.process()
            skip_response = True


        elif node.node_type == "<command>:image_generation":
            node.processor = GenerateImage(websocket, node)
            await node.processor.process()
            skip_response = True

        elif node.node_type == "<command>:summarize":
            node.processor = Summarize(websocket, node)
            await node.processor.process()
            skip_response = True

        elif node.node_type == "<command>:userinput":
            self.state = "pending"
            
            await websocket.send_json({"request": "userinput", "msg": node.prompt})
            user_input = await self.user_input_future

            self.state = "running"
            info_request = "Information requested from user: {}\n\nUser response: {}".format(node.prompt, user_input)
            node.memory.queue_history(info_request, "user", node.node_type, node.id, visible=node.vis)
            self.user_input_future = asyncio.Future()
            skip_response = True

        elif node.node_type == "file":
            file_type = node.file_type


            if file_type == "PDF":
                self.state = "pending"

                await websocket.send_json({"request": "file", "type": file_type})
                user_input = await self.user_input_future
                
                self.state = "running"
                
                # extract pdf text and add to history
                text = processPDF(user_input)
                info_request = "User uploaded {} with the following content\n\n{}".format(file_type, text)
                node.memory.queue_history(info_request, "user", node.node_type, node.id, visible=node.vis)

                
                self.user_input_future = asyncio.Future()
                skip_response = True
            
        elif node.node_type == "paragraph":
            node.processor = Paragraph(websocket, node)
            await node.processor.process()
            skip_response = True

        elif node.node_type == "mention":
            if node.mention != None:
                value = self.blockholds.retrieve_mention(node.mention[0], node.mention[1])
                if node.vis:
                    await self.emit(websocket, {"output": json.dumps(value)})

            skip_response = True

        else:
            response = "command is not supported"


        if not skip_response:
            node.memory.queue_history(response, "assistant", node.node_type, node.id, visible=node.vis, image=image)
            if (node.vis):
                if image:
                    await self.emit(websocket, {"output": f"![generated image]({response})"})
                else:
                    await self.emit(websocket, {"output": response})

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
           

    def set_user_info(self, user_info):
        loop = asyncio.get_running_loop()
        loop.call_soon_threadsafe(self.user_input_future.set_result, user_info["msg"])


if __name__ == "__main__":
    json_data='[{"id":"f284bedc-4878-4910-adef-b57a7ad08c86","type":"file","props":{"fileUrl":"","fileType":"PDF","send":false,"sid":"","vis":true},"content":[],"children":[{"id":"f6f51d1a-d652-451f-b6ab-b06f4ca727e8","type":"noparam","props":{"text":"<command>:summarize","color":"blue","vis":true},"content":[],"children":[]}]},{"id":"656087a0-82a7-4e71-9aa0-628e9d4eae23","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[],"children":[]}]'
    json_data = json.loads(json_data)

    run = Run(123312)

    run.process_plan(json_data)
    run.blockholds.visualize_all()


